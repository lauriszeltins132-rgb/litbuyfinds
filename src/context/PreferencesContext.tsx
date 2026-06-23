"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { AgentId, CurrencyCode } from "@/lib/constants";
import { DEFAULT_AGENT_ID, isAgentId } from "@/lib/agents";
import { BUYING_AGENTS } from "@/lib/agents";

type PreferencesContextValue = {
  currency: CurrencyCode;
  agentId: AgentId;
  setCurrency: (currency: CurrencyCode) => void;
  setAgentId: (agentId: AgentId) => void;
  agents: typeof BUYING_AGENTS;
};

const PreferencesContext = createContext<PreferencesContextValue | null>(null);
const STORAGE_KEY = "litbuyfinds-preferences";

export function PreferencesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currency, setCurrencyState] = useState<CurrencyCode>("USD");
  const [agentId, setAgentIdState] = useState<AgentId>(DEFAULT_AGENT_ID);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as {
          currency?: CurrencyCode;
          agentId?: AgentId;
        };
        if (parsed.currency) setCurrencyState(parsed.currency);
        if (parsed.agentId && isAgentId(parsed.agentId)) {
          setAgentIdState(parsed.agentId);
        }
      }
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ currency, agentId })
    );
  }, [currency, agentId, hydrated]);

  const setCurrency = useCallback((next: CurrencyCode) => {
    setCurrencyState(next);
  }, []);

  const setAgentId = useCallback((next: AgentId) => {
    setAgentIdState(next);
  }, []);

  const value = useMemo(
    () => ({
      currency,
      agentId,
      setCurrency,
      setAgentId,
      agents: BUYING_AGENTS,
    }),
    [currency, agentId, setCurrency, setAgentId]
  );

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error("usePreferences must be used within PreferencesProvider");
  }
  return context;
}
