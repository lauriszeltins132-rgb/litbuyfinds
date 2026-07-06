/**
 * Monte Carlo RTP simulation for Cursed Chest.
 * Run: node scripts/simulate-rtp.mjs
 */

const CHEST_COUNT = 5;
const SAFE_CHEST_COUNT = 4;
const MULTIPLIER_TABLE = [1.15, 1.5, 2.0, 7.0];
const MAX_WIN_MULTIPLIER = 50;
const SPECIAL_OUTCOME_WEIGHTS = { treasure: 0.85, golden_key: 0.1, mystery: 0.05 };
const MYSTERY_BONUS = 0.15;
const BONUS_OUTCOME_WEIGHTS = { small_boost: 0.45, big_boost: 0.35, curse: 0.2 };
const BONUS_SMALL = 0.5;
const BONUS_BIG = 2.0;

function randomInt(max) {
  return Math.floor(Math.random() * max);
}

function rollWeighted(weights) {
  const roll = Math.random();
  let cumulative = 0;
  for (const [key, weight] of Object.entries(weights)) {
    cumulative += weight;
    if (roll < cumulative) return key;
  }
  return Object.keys(weights)[0];
}

function assignContents(curseIndex) {
  const contents = Array(CHEST_COUNT).fill("treasure");
  for (let i = 0; i < CHEST_COUNT; i++) {
    if (i !== curseIndex) contents[i] = rollWeighted(SPECIAL_OUTCOME_WEIGHTS);
  }
  return contents;
}

function getMultiplier(safePickCount) {
  const index = Math.min(safePickCount, MULTIPLIER_TABLE.length) - 1;
  return index < 0 ? 1 : MULTIPLIER_TABLE[index];
}

function calcWin(bet, multiplier) {
  return bet * Math.min(multiplier, MAX_WIN_MULTIPLIER);
}

function simulateRound(strategy) {
  const bet = 1;
  const curseIndex = randomInt(CHEST_COUNT);
  const contents = assignContents(curseIndex);
  const remaining = [0, 1, 2, 3, 4];
  let safePickCount = 0;
  let multiplier = 1;
  let goldenKeyOffer = false;

  while (remaining.length > 0) {
    if (goldenKeyOffer) {
      const bonusOutcome = rollWeighted(BONUS_OUTCOME_WEIGHTS);
      goldenKeyOffer = false;
      if (bonusOutcome === "curse") {
        // keep pre-bonus multiplier, continue or cash out per strategy
      } else if (bonusOutcome === "small_boost") {
        multiplier += BONUS_SMALL;
      } else {
        multiplier += BONUS_BIG;
      }
      if (strategy === "cash_after_1" && safePickCount >= 1) {
        return calcWin(bet, multiplier);
      }
      if (safePickCount >= SAFE_CHEST_COUNT) {
        return calcWin(bet, multiplier);
      }
      continue;
    }

    let pickIdx;
    if (strategy === "random") {
      pickIdx = randomInt(remaining.length);
    } else {
      pickIdx = 0;
    }
    const chestIndex = remaining.splice(pickIdx, 1)[0];

    if (chestIndex === curseIndex) {
      return 0;
    }

    safePickCount += 1;
    multiplier = getMultiplier(safePickCount);
    const content = contents[chestIndex];

    if (content === "mystery") {
      multiplier += MYSTERY_BONUS;
    } else if (content === "golden_key") {
      goldenKeyOffer = true;
      if (strategy === "skip_bonus") {
        goldenKeyOffer = false;
      } else {
        continue;
      }
    }

    if (strategy === "cash_after_1" && safePickCount >= 1) {
      return calcWin(bet, multiplier);
    }
    if (strategy === "cash_after_2" && safePickCount >= 2) {
      return calcWin(bet, multiplier);
    }
    if (safePickCount >= SAFE_CHEST_COUNT) {
      return calcWin(bet, multiplier);
    }
  }

  return calcWin(bet, multiplier);
}

function runSimulation(strategy, rounds = 100000) {
  let totalReturn = 0;
  for (let i = 0; i < rounds; i++) {
    totalReturn += simulateRound(strategy);
  }
  const rtp = (totalReturn / rounds) * 100;
  return rtp;
}

const strategies = [
  "cash_after_1",
  "cash_after_2",
  "random",
  "skip_bonus",
];

console.log("Cursed Chest RTP Simulation (bet=1, 100k rounds each)\n");
for (const strategy of strategies) {
  const rtp = runSimulation(strategy);
  console.log(`  ${strategy.padEnd(16)} RTP: ${rtp.toFixed(2)}%`);
}
console.log("\nTarget RTP: ~96% (tune weights in src/lib/game/constants.ts)");
