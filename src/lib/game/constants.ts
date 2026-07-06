import type { RiskMode } from "./types";

export const CHEST_COUNT = 5;
export const CURSED_CHEST_COUNT = 1;
export const SAFE_CHEST_COUNT = CHEST_COUNT - CURSED_CHEST_COUNT;

export const STARTING_BALANCE = 1000;
export const MIN_BET = 0.1;
export const MAX_BET = 100;
export const MAX_WIN_MULTIPLIER = 50;

export const MULTIPLIER_TABLE = [1.15, 1.5, 2.0, 7.0] as const;

export const SPECIAL_OUTCOME_WEIGHTS = {
  treasure: 0.85,
  golden_key: 0.1,
  mystery: 0.05,
} as const;

export const MYSTERY_BONUS_MULTIPLIER = 0.15;

export const BONUS_OUTCOME_WEIGHTS = {
  small_boost: 0.45,
  big_boost: 0.35,
  curse: 0.2,
} as const;

export const BONUS_SMALL_BOOST = 0.5;
export const BONUS_BIG_BOOST = 2.0;

export const BET_STEPS = [0.5, 1, 2, 5, 10, 25, 50, 100] as const;

export const DEFAULT_RISK_MODE: RiskMode = "medium";

export const RISK_MODE_CONFIG: Record<
  RiskMode,
  { label: string; multiplierScale: number }
> = {
  low: { label: "Low Risk", multiplierScale: 0.85 },
  medium: { label: "Medium Risk", multiplierScale: 1 },
  high: { label: "High Risk", multiplierScale: 1.15 },
};
