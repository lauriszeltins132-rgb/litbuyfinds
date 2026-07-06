import type { WinTier } from "./types";

export function getWinTier(winAmount: number, bet: number): WinTier {
  const ratio = winAmount / bet;
  if (ratio >= 20) return "epic";
  if (ratio >= 5) return "big";
  return "nice";
}

export function formatCurrency(amount: number): string {
  return `€${amount.toFixed(2)}`;
}

export function formatMultiplier(multiplier: number): string {
  return `${multiplier.toFixed(2)}x`;
}
