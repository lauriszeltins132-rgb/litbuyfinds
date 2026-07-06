"use client";

import { useCallback, useEffect, useState } from "react";
import { STARTING_BALANCE } from "@/lib/game/constants";
import type {
  BonusPickResponse,
  CashoutResponse,
  PickOutcome,
  PickResponse,
  RoundPhase,
  RoundStatus,
  WinTier,
} from "@/lib/game/types";

const BALANCE_KEY = "cursed-chest-balance";

export type GamePhase =
  | "idle"
  | "round_active"
  | "chest_selected"
  | "revealing"
  | "golden_key_offer"
  | "bonus_active"
  | "won"
  | "lost";

export interface GameSessionState {
  balance: number;
  bet: number;
  roundId: string | null;
  multiplier: number;
  openedChests: number[];
  selectedChest: number | null;
  serverPhase: RoundPhase;
  status: RoundStatus | "idle";
  lastOutcome: PickOutcome | null;
  clientPhase: GamePhase;
  winAmount: number | null;
  winTier: WinTier | null;
  isLoading: boolean;
  error: string | null;
}

export function useGameSession() {
  const [balance, setBalance] = useState(STARTING_BALANCE);
  const [bet, setBet] = useState(10);
  const [roundId, setRoundId] = useState<string | null>(null);
  const [multiplier, setMultiplier] = useState(1);
  const [openedChests, setOpenedChests] = useState<number[]>([]);
  const [selectedChest, setSelectedChest] = useState<number | null>(null);
  const [serverPhase, setServerPhase] = useState<RoundPhase>("picking");
  const [status, setStatus] = useState<RoundStatus | "idle">("idle");
  const [lastOutcome, setLastOutcome] = useState<PickOutcome | null>(null);
  const [clientPhase, setClientPhase] = useState<GamePhase>("idle");
  const [winAmount, setWinAmount] = useState<number | null>(null);
  const [winTier, setWinTier] = useState<WinTier | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [revealingChest, setRevealingChest] = useState<number | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem(BALANCE_KEY);
    if (stored) {
      const parsed = parseFloat(stored);
      if (!isNaN(parsed) && parsed > 0) {
        setBalance(parsed);
      }
    }
  }, []);

  const persistBalance = useCallback((value: number) => {
    setBalance(value);
    sessionStorage.setItem(BALANCE_KEY, value.toString());
  }, []);

  const resetRound = useCallback(() => {
    setRoundId(null);
    setMultiplier(1);
    setOpenedChests([]);
    setSelectedChest(null);
    setServerPhase("picking");
    setStatus("idle");
    setLastOutcome(null);
    setClientPhase("idle");
    setWinAmount(null);
    setWinTier(null);
    setRevealingChest(null);
    setError(null);
  }, []);

  const startRound = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/game/round", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bet, balance }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to start round");

      persistBalance(data.balance);
      setRoundId(data.roundId);
      setMultiplier(data.multiplier);
      setOpenedChests([]);
      setSelectedChest(null);
      setServerPhase("picking");
      setStatus("active");
      setClientPhase("round_active");
      setLastOutcome(null);
      setWinAmount(null);
      setWinTier(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start round");
    } finally {
      setIsLoading(false);
    }
  }, [bet, balance, persistBalance]);

  const selectChest = useCallback(
    (index: number) => {
      if (clientPhase !== "round_active" && clientPhase !== "chest_selected") return;
      if (openedChests.includes(index)) return;
      setSelectedChest(index);
      setClientPhase("chest_selected");
    },
    [clientPhase, openedChests]
  );

  const openChest = useCallback(async () => {
    if (selectedChest === null || !roundId) return;
    setIsLoading(true);
    setError(null);
    setClientPhase("revealing");
    setRevealingChest(selectedChest);

    await new Promise((r) => setTimeout(r, 700));

    try {
      const res = await fetch("/api/game/pick", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roundId, chestIndex: selectedChest }),
      });
      const data: PickResponse = await res.json();
      if (!res.ok) throw new Error((data as unknown as { error: string }).error);

      setOpenedChests(data.openedChests);
      setMultiplier(data.multiplier);
      setLastOutcome(data.outcome);
      setServerPhase(data.phase);
      setStatus(data.status);
      setRevealingChest(null);
      setSelectedChest(null);

      if (data.outcome === "curse") {
        setClientPhase("lost");
      } else if (data.phase === "golden_key_offer") {
        setClientPhase("golden_key_offer");
      } else if (data.status === "auto_won" || data.status === "cashed_out") {
        if (data.winAmount !== undefined && data.balance !== undefined) {
          persistBalance(data.balance);
          setWinAmount(data.winAmount);
          setWinTier(data.tier ?? "nice");
        }
        setClientPhase("won");
      } else {
        setClientPhase("round_active");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to open chest");
      setClientPhase("round_active");
      setRevealingChest(null);
    } finally {
      setIsLoading(false);
    }
  }, [selectedChest, roundId, persistBalance]);

  const cashOut = useCallback(async () => {
    if (!roundId) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/game/cashout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roundId, balance }),
      });
      const data: CashoutResponse = await res.json();
      if (!res.ok) throw new Error((data as unknown as { error: string }).error);

      persistBalance(data.balance);
      setWinAmount(data.winAmount);
      setWinTier(data.tier);
      setStatus(data.status);
      setClientPhase("won");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to cash out");
    } finally {
      setIsLoading(false);
    }
  }, [roundId, balance, persistBalance]);

  const acceptGoldenKey = useCallback(async () => {
    if (!roundId) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/game/bonus/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roundId }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }
      setServerPhase("bonus_picking");
      setClientPhase("bonus_active");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to accept key");
    } finally {
      setIsLoading(false);
    }
  }, [roundId]);

  const skipGoldenKey = useCallback(async () => {
    if (!roundId) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/game/bonus/skip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roundId }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }
      setServerPhase("picking");
      setClientPhase("round_active");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to skip bonus");
    } finally {
      setIsLoading(false);
    }
  }, [roundId]);

  const pickBonusChest = useCallback(
    async (chestIndex: number) => {
      if (!roundId) return;
      setIsLoading(true);
      try {
        const res = await fetch("/api/game/bonus/pick", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ roundId, chestIndex }),
        });
        const data: BonusPickResponse = await res.json();
        if (!res.ok) throw new Error((data as unknown as { error: string }).error);

        setMultiplier(data.multiplier);
        setServerPhase(data.phase);
        setStatus(data.status);

        if (data.status === "auto_won" || data.status === "cashed_out") {
          if (data.winAmount !== undefined && data.balance !== undefined) {
            persistBalance(data.balance);
            setWinAmount(data.winAmount);
            setWinTier(data.tier ?? "nice");
          }
          setClientPhase("won");
        } else {
          setClientPhase("round_active");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to pick bonus");
      } finally {
        setIsLoading(false);
      }
    },
    [roundId, persistBalance]
  );

  const potentialWin = Math.round(bet * multiplier * 100) / 100;
  const canCashOut =
    (clientPhase === "round_active" || clientPhase === "golden_key_offer") &&
    openedChests.length > 0 &&
    status === "active";
  const isRoundActive = clientPhase !== "idle" && clientPhase !== "won" && clientPhase !== "lost";

  return {
    balance,
    bet,
    setBet,
    roundId,
    multiplier,
    openedChests,
    selectedChest,
    serverPhase,
    status,
    lastOutcome,
    clientPhase,
    winAmount,
    winTier,
    isLoading,
    error,
    revealingChest,
    potentialWin,
    canCashOut,
    isRoundActive,
    startRound,
    selectChest,
    openChest,
    cashOut,
    acceptGoldenKey,
    skipGoldenKey,
    pickBonusChest,
    resetRound,
  };
}
