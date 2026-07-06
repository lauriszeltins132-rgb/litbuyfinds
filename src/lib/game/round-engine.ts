import { randomUUID } from "crypto";
import {
  CHEST_COUNT,
  DEFAULT_RISK_MODE,
  MAX_WIN_MULTIPLIER,
  SAFE_CHEST_COUNT,
} from "./constants";
import {
  applyBonusBoost,
  applyMysteryBonus,
  assignChestContents,
  calculateWinAmount,
  getMultiplierForSafePick,
  randomCurseIndex,
  rollBonusOutcome,
} from "./math";
import { getRound, saveRound } from "./round-store";
import type {
  BonusPickResponse,
  BonusSkipResponse,
  CashoutResponse,
  PickResponse,
  Round,
  StartRoundResponse,
} from "./types";
import { getWinTier } from "./win-tier";
import { validateBet } from "./validation";

function createRoundRecord(
  bet: number,
  balanceBefore: number
): Round {
  const curseIndex = randomCurseIndex(CHEST_COUNT);
  const chestContents = assignChestContents(curseIndex, CHEST_COUNT);

  return {
    id: randomUUID(),
    bet,
    balanceBefore,
    curseIndex,
    chestContents,
    openedChests: [],
    safePickCount: 0,
    multiplier: 1,
    phase: "picking",
    status: "active",
    goldenKeyPending: false,
    bonusMultiplierBefore: null,
    bonusPicked: false,
    cashoutResult: null,
    createdAt: Date.now(),
  };
}

function finalizeCashout(round: Round, balance: number): CashoutResponse {
  const winAmount = calculateWinAmount(
    round.bet,
    round.multiplier,
    MAX_WIN_MULTIPLIER
  );
  const balanceAfter = Math.round((balance + winAmount) * 100) / 100;
  const tier = getWinTier(winAmount, round.bet);

  round.cashoutResult = { winAmount, balanceAfter, tier };
  round.status = round.safePickCount >= SAFE_CHEST_COUNT ? "auto_won" : "cashed_out";
  round.phase = "ended";
  saveRound(round);

  return {
    winAmount,
    balance: balanceAfter,
    tier,
    status: round.status,
  };
}

export function startRound(
  bet: number,
  balance: number
): { ok: true; data: StartRoundResponse } | { ok: false; error: string } {
  const betError = validateBet(bet, balance);
  if (betError) return { ok: false, error: betError };

  const round = createRoundRecord(bet, balance);
  const newBalance = Math.round((balance - bet) * 100) / 100;
  saveRound(round);

  return {
    ok: true,
    data: {
      roundId: round.id,
      balance: newBalance,
      multiplier: 1,
      chests: CHEST_COUNT,
    },
  };
}

export function pickChest(
  roundId: string,
  chestIndex: number
): { ok: true; data: PickResponse } | { ok: false; error: string; code: number } {
  const round = getRound(roundId);
  if (!round) return { ok: false, error: "Round not found", code: 404 };
  if (round.status !== "active") {
    return { ok: false, error: "Round is not active", code: 409 };
  }
  if (round.phase !== "picking") {
    return { ok: false, error: "Cannot pick chest in current phase", code: 409 };
  }
  if (round.openedChests.includes(chestIndex)) {
    return { ok: false, error: "Chest already opened", code: 409 };
  }

  round.openedChests.push(chestIndex);

  if (chestIndex === round.curseIndex) {
    round.status = "lost";
    round.phase = "ended";
    saveRound(round);

    return {
      ok: true,
      data: {
        outcome: "curse",
        multiplier: round.multiplier,
        openedChests: [...round.openedChests],
        canCashOut: false,
        canContinue: false,
        status: "lost",
        phase: "ended",
      },
    };
  }

  round.safePickCount += 1;
  round.multiplier = getMultiplierForSafePick(
    round.safePickCount,
    DEFAULT_RISK_MODE
  );

  const content = round.chestContents[chestIndex];

  if (content === "mystery") {
    round.multiplier = applyMysteryBonus(round.multiplier);
    saveRound(round);

    if (round.safePickCount >= SAFE_CHEST_COUNT) {
      const cashout = finalizeCashout(round, round.balanceBefore - round.bet);
      return {
        ok: true,
        data: {
          outcome: "mystery",
          multiplier: round.multiplier,
          openedChests: [...round.openedChests],
          canCashOut: false,
          canContinue: false,
          status: round.status,
          phase: "ended",
          winAmount: cashout.winAmount,
          balance: cashout.balance,
          tier: cashout.tier,
        },
      };
    }

    return {
      ok: true,
      data: {
        outcome: "mystery",
        multiplier: round.multiplier,
        openedChests: [...round.openedChests],
        canCashOut: true,
        canContinue: true,
        status: "active",
        phase: "picking",
      },
    };
  }

  if (content === "golden_key") {
    round.goldenKeyPending = true;
    round.bonusMultiplierBefore = round.multiplier;
    round.phase = "golden_key_offer";
    saveRound(round);

    return {
      ok: true,
      data: {
        outcome: "golden_key",
        multiplier: round.multiplier,
        openedChests: [...round.openedChests],
        canCashOut: true,
        canContinue: false,
        status: "active",
        phase: "golden_key_offer",
      },
    };
  }

  saveRound(round);

  if (round.safePickCount >= SAFE_CHEST_COUNT) {
    const cashout = finalizeCashout(round, round.balanceBefore - round.bet);
    return {
      ok: true,
      data: {
        outcome: "treasure",
        multiplier: round.multiplier,
        openedChests: [...round.openedChests],
        canCashOut: false,
        canContinue: false,
        status: round.status,
        phase: "ended",
        winAmount: cashout.winAmount,
        balance: cashout.balance,
        tier: cashout.tier,
      },
    };
  }

  return {
    ok: true,
    data: {
      outcome: "treasure",
      multiplier: round.multiplier,
      openedChests: [...round.openedChests],
      canCashOut: true,
      canContinue: true,
      status: "active",
      phase: "picking",
    },
  };
}

export function cashOut(
  roundId: string,
  balance: number
): { ok: true; data: CashoutResponse } | { ok: false; error: string; code: number } {
  const round = getRound(roundId);
  if (!round) return { ok: false, error: "Round not found", code: 404 };

  if (round.cashoutResult) {
    return {
      ok: true,
      data: {
        winAmount: round.cashoutResult.winAmount,
        balance: round.cashoutResult.balanceAfter,
        tier: round.cashoutResult.tier,
        status: round.status,
      },
    };
  }

  if (round.status !== "active") {
    return { ok: false, error: "Round is not active", code: 409 };
  }
  if (round.safePickCount === 0) {
    return { ok: false, error: "No safe picks to cash out", code: 409 };
  }
  if (round.phase === "bonus_picking") {
    return { ok: false, error: "Complete bonus first", code: 409 };
  }

  const data = finalizeCashout(round, balance);
  return { ok: true, data };
}

export function acceptGoldenKey(
  roundId: string
): { ok: true; data: BonusSkipResponse } | { ok: false; error: string; code: number } {
  const round = getRound(roundId);
  if (!round) return { ok: false, error: "Round not found", code: 404 };
  if (round.phase !== "golden_key_offer") {
    return { ok: false, error: "Golden Key not available", code: 409 };
  }

  round.phase = "bonus_picking";
  round.goldenKeyPending = false;
  saveRound(round);

  return {
    ok: true,
    data: {
      phase: "bonus_picking",
      canCashOut: false,
      canContinue: true,
    },
  };
}

export function skipGoldenKey(
  roundId: string
): { ok: true; data: BonusSkipResponse } | { ok: false; error: string; code: number } {
  const round = getRound(roundId);
  if (!round) return { ok: false, error: "Round not found", code: 404 };
  if (round.phase !== "golden_key_offer") {
    return { ok: false, error: "Golden Key not available", code: 409 };
  }

  round.goldenKeyPending = false;
  round.phase = "picking";
  saveRound(round);

  return {
    ok: true,
    data: {
      phase: "picking",
      canCashOut: true,
      canContinue: round.safePickCount < SAFE_CHEST_COUNT,
    },
  };
}

export function pickBonusChest(
  roundId: string,
  chestIndex: number
): { ok: true; data: BonusPickResponse } | { ok: false; error: string; code: number } {
  void chestIndex;
  const round = getRound(roundId);
  if (!round) return { ok: false, error: "Round not found", code: 404 };
  if (round.phase !== "bonus_picking") {
    return { ok: false, error: "Bonus not active", code: 409 };
  }
  if (round.bonusPicked) {
    return { ok: false, error: "Bonus already picked", code: 409 };
  }

  round.bonusPicked = true;
  const outcome = rollBonusOutcome();

  if (outcome === "curse") {
    if (round.bonusMultiplierBefore !== null) {
      round.multiplier = round.bonusMultiplierBefore;
    }
    round.phase = "picking";
    saveRound(round);

    return {
      ok: true,
      data: {
        outcome: "curse",
        multiplier: round.multiplier,
        phase: "picking",
        status: "active",
        canCashOut: true,
        canContinue: round.safePickCount < SAFE_CHEST_COUNT,
      },
    };
  }

  round.multiplier = applyBonusBoost(round.multiplier, outcome);
  round.phase = "picking";
  saveRound(round);

  if (round.safePickCount >= SAFE_CHEST_COUNT) {
    const cashout = finalizeCashout(round, round.balanceBefore - round.bet);
    return {
      ok: true,
      data: {
        outcome,
        multiplier: round.multiplier,
        phase: "ended",
        status: round.status,
        canCashOut: false,
        canContinue: false,
        winAmount: cashout.winAmount,
        balance: cashout.balance,
        tier: cashout.tier,
      },
    };
  }

  return {
    ok: true,
    data: {
      outcome,
      multiplier: round.multiplier,
      phase: "picking",
      status: "active",
      canCashOut: true,
      canContinue: true,
    },
  };
}
