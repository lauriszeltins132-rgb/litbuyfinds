export type RiskMode = "low" | "medium" | "high";

export type RoundStatus = "active" | "lost" | "cashed_out" | "auto_won";

export type RoundPhase =
  | "picking"
  | "golden_key_offer"
  | "bonus_picking"
  | "ended";

export type ChestContent = "treasure" | "golden_key" | "mystery";

export type PickOutcome = "treasure" | "curse" | "golden_key" | "mystery";

export type BonusOutcome = "small_boost" | "big_boost" | "curse";

export type WinTier = "nice" | "big" | "epic";

export interface Round {
  id: string;
  bet: number;
  balanceBefore: number;
  curseIndex: number;
  chestContents: ChestContent[];
  openedChests: number[];
  safePickCount: number;
  multiplier: number;
  phase: RoundPhase;
  status: RoundStatus;
  goldenKeyPending: boolean;
  bonusMultiplierBefore: number | null;
  bonusPicked: boolean;
  cashoutResult: CashoutResult | null;
  createdAt: number;
}

export interface CashoutResult {
  winAmount: number;
  balanceAfter: number;
  tier: WinTier;
}

export interface StartRoundRequest {
  bet: number;
  balance: number;
  riskMode?: RiskMode;
}

export interface StartRoundResponse {
  roundId: string;
  balance: number;
  multiplier: number;
  chests: number;
}

export interface PickRequest {
  roundId: string;
  chestIndex: number;
}

export interface PickResponse {
  outcome: PickOutcome;
  multiplier: number;
  openedChests: number[];
  canCashOut: boolean;
  canContinue: boolean;
  status: RoundStatus;
  phase: RoundPhase;
  winAmount?: number;
  balance?: number;
  tier?: WinTier;
}

export interface CashoutRequest {
  roundId: string;
  balance: number;
}

export interface CashoutResponse {
  winAmount: number;
  balance: number;
  tier: WinTier;
  status: RoundStatus;
}

export interface BonusPickRequest {
  roundId: string;
  chestIndex: number;
}

export interface BonusPickResponse {
  outcome: BonusOutcome;
  multiplier: number;
  phase: RoundPhase;
  status: RoundStatus;
  canCashOut: boolean;
  canContinue: boolean;
  winAmount?: number;
  balance?: number;
  tier?: WinTier;
}

export interface BonusSkipRequest {
  roundId: string;
}

export interface BonusSkipResponse {
  phase: RoundPhase;
  canCashOut: boolean;
  canContinue: boolean;
}

export interface GameError {
  error: string;
  code: number;
}
