"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type { Product } from "@/lib/types";
import AgentModal from "@/components/agents/AgentModal";

type AgentModalOptions = {
  product?: Product;
  /** Redirect to the agent purchase URL after selection (default: true when product set) */
  redirectOnSelect?: boolean;
  title?: string;
};

type AgentModalContextValue = {
  openAgentModal: (options?: AgentModalOptions) => void;
  closeAgentModal: () => void;
};

const AgentModalContext = createContext<AgentModalContextValue | null>(null);

export function AgentModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<AgentModalOptions>({});

  const closeAgentModal = useCallback(() => {
    setOpen(false);
    setOptions({});
  }, []);

  const openAgentModal = useCallback((next: AgentModalOptions = {}) => {
    setOptions(next);
    setOpen(true);
  }, []);

  const value = useMemo(
    () => ({ openAgentModal, closeAgentModal }),
    [openAgentModal, closeAgentModal]
  );

  return (
    <AgentModalContext.Provider value={value}>
      {children}
      <AgentModal
        open={open}
        onClose={closeAgentModal}
        product={options.product}
        redirectOnSelect={
          options.redirectOnSelect ?? Boolean(options.product)
        }
        title={options.title}
      />
    </AgentModalContext.Provider>
  );
}

export function useAgentModal() {
  const context = useContext(AgentModalContext);
  if (!context) {
    throw new Error("useAgentModal must be used within AgentModalProvider");
  }
  return context;
}
