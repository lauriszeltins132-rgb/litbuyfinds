import type {
  BonusPickRequest,
  BonusSkipRequest,
  CashoutRequest,
  PickRequest,
  StartRoundRequest,
} from "./types";
import {
  CHEST_COUNT,
  MAX_BET,
  MIN_BET,
} from "./constants";

export function validateStartRound(body: unknown): StartRoundRequest | null {
  if (!body || typeof body !== "object") return null;
  const { bet, balance } = body as Record<string, unknown>;
  if (typeof bet !== "number" || typeof balance !== "number") return null;
  if (!Number.isFinite(bet) || !Number.isFinite(balance)) return null;
  return { bet, balance };
}

export function validatePick(body: unknown): PickRequest | null {
  if (!body || typeof body !== "object") return null;
  const { roundId, chestIndex } = body as Record<string, unknown>;
  if (typeof roundId !== "string" || typeof chestIndex !== "number") return null;
  if (!Number.isInteger(chestIndex) || chestIndex < 0 || chestIndex >= CHEST_COUNT) {
    return null;
  }
  return { roundId, chestIndex };
}

export function validateCashout(body: unknown): CashoutRequest | null {
  if (!body || typeof body !== "object") return null;
  const { roundId, balance } = body as Record<string, unknown>;
  if (typeof roundId !== "string" || typeof balance !== "number") return null;
  if (!Number.isFinite(balance)) return null;
  return { roundId, balance };
}

export function validateBonusPick(body: unknown): BonusPickRequest | null {
  if (!body || typeof body !== "object") return null;
  const { roundId, chestIndex } = body as Record<string, unknown>;
  if (typeof roundId !== "string" || typeof chestIndex !== "number") return null;
  if (!Number.isInteger(chestIndex) || chestIndex < 0 || chestIndex > 2) {
    return null;
  }
  return { roundId, chestIndex };
}

export function validateBonusSkip(body: unknown): BonusSkipRequest | null {
  if (!body || typeof body !== "object") return null;
  const { roundId } = body as Record<string, unknown>;
  if (typeof roundId !== "string") return null;
  return { roundId };
}

export function validateBet(bet: number, balance: number): string | null {
  if (bet < MIN_BET) return `Minimum bet is €${MIN_BET.toFixed(2)}`;
  if (bet > MAX_BET) return `Maximum bet is €${MAX_BET.toFixed(2)}`;
  if (bet > balance) return "Insufficient balance";
  return null;
}
