import type { Round } from "./types";

declare global {
  var __cursedChestRounds: Map<string, Round> | undefined;
}

const rounds: Map<string, Round> = globalThis.__cursedChestRounds ?? new Map();

if (!globalThis.__cursedChestRounds) {
  globalThis.__cursedChestRounds = rounds;
}

export function saveRound(round: Round): void {
  rounds.set(round.id, round);
}

export function getRound(id: string): Round | undefined {
  return rounds.get(id);
}

export function deleteRound(id: string): void {
  rounds.delete(id);
}

export function clearRounds(): void {
  rounds.clear();
}
