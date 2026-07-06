import { randomInt } from "crypto";
import {
  BONUS_BIG_BOOST,
  BONUS_OUTCOME_WEIGHTS,
  BONUS_SMALL_BOOST,
  MULTIPLIER_TABLE,
  MYSTERY_BONUS_MULTIPLIER,
  SPECIAL_OUTCOME_WEIGHTS,
} from "./constants";
import type {
  BonusOutcome,
  ChestContent,
  RiskMode,
} from "./types";
import { RISK_MODE_CONFIG } from "./constants";

export function randomCurseIndex(chestCount: number): number {
  return randomInt(0, chestCount);
}

export function assignChestContents(curseIndex: number, chestCount: number): ChestContent[] {
  const contents: ChestContent[] = Array(chestCount).fill("treasure");

  for (let i = 0; i < chestCount; i++) {
    if (i === curseIndex) continue;
    contents[i] = rollSpecialOutcome();
  }

  return contents;
}

export function rollSpecialOutcome(): ChestContent {
  const roll = Math.random();
  let cumulative = 0;

  for (const [outcome, weight] of Object.entries(SPECIAL_OUTCOME_WEIGHTS)) {
    cumulative += weight;
    if (roll < cumulative) {
      return outcome as ChestContent;
    }
  }

  return "treasure";
}

export function rollBonusOutcome(): BonusOutcome {
  const roll = Math.random();
  let cumulative = 0;

  for (const [outcome, weight] of Object.entries(BONUS_OUTCOME_WEIGHTS)) {
    cumulative += weight;
    if (roll < cumulative) {
      return outcome as BonusOutcome;
    }
  }

  return "small_boost";
}

export function getMultiplierForSafePick(
  safePickCount: number,
  riskMode: RiskMode = "medium"
): number {
  const index = Math.min(safePickCount, MULTIPLIER_TABLE.length) - 1;
  if (index < 0) return 1;
  const base = MULTIPLIER_TABLE[index];
  const scale = RISK_MODE_CONFIG[riskMode].multiplierScale;
  return Math.round(base * scale * 100) / 100;
}

export function applyMysteryBonus(multiplier: number): number {
  return Math.round((multiplier + MYSTERY_BONUS_MULTIPLIER) * 100) / 100;
}

export function applyBonusBoost(
  multiplier: number,
  outcome: BonusOutcome
): number {
  if (outcome === "small_boost") {
    return Math.round((multiplier + BONUS_SMALL_BOOST) * 100) / 100;
  }
  if (outcome === "big_boost") {
    return Math.round((multiplier + BONUS_BIG_BOOST) * 100) / 100;
  }
  return multiplier;
}

export function calculateWinAmount(
  bet: number,
  multiplier: number,
  maxWinMultiplier: number
): number {
  const cappedMultiplier = Math.min(multiplier, maxWinMultiplier);
  return Math.round(bet * cappedMultiplier * 100) / 100;
}
