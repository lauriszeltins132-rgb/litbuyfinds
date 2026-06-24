"use client";

import { useEffect, useRef, useState } from "react";
import type { AgentId } from "@/lib/agents";
import { BUYING_AGENTS, getAgentById } from "@/lib/agents";
import { usePreferences } from "@/context/PreferencesContext";
import { useAgentModal } from "@/context/AgentModalContext";

type AgentSelectorProps = {
  variant?: "header" | "mobile";
  className?: string;
};

export default function AgentSelector({
  variant = "header",
  className = "",
}: AgentSelectorProps) {
  const { agentId, setAgentId } = usePreferences();
  const { openAgentModal } = useAgentModal();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const current = getAgentById(agentId);
  const isMobile = variant === "mobile";

  useEffect(() => {
    if (!open) return;
    function handleClick(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  useEffect(() => {
    if (!open || !isMobile) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open, isMobile]);

  function selectAgent(nextId: AgentId) {
    setAgentId(nextId);
    setOpen(false);
  }

  const triggerClass = isMobile
    ? "agent-selector agent-selector--mobile"
    : "agent-selector agent-selector--header";

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={triggerClass}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        {isMobile ? (
          <>
            <span className="agent-selector__mobile-prefix">Agent</span>
            <span className="agent-selector__mobile-value">{current.name}</span>
            <span className="agent-selector__chevron" aria-hidden>
              ▾
            </span>
          </>
        ) : (
          <>
            <span className="agent-selector__label">Choose your agent</span>
            <span className="agent-selector__value">
              {current.name}
              {current.recommended ? (
                <span className="agent-selector__recommended">Recommended</span>
              ) : null}
            </span>
            <span className="agent-selector__chevron" aria-hidden>
              ▾
            </span>
          </>
        )}
      </button>

      {open ? (
        <>
          {isMobile ? (
            <button
              type="button"
              className="agent-selector__backdrop"
              aria-label="Close agent menu"
              onClick={() => setOpen(false)}
            />
          ) : null}
          <div
            className={
              isMobile ? "agent-selector__sheet" : "agent-selector__menu"
            }
            role="listbox"
            aria-label="Buying agents"
          >
            {isMobile ? (
              <div className="agent-selector__sheet-header">
                <span className="agent-selector__sheet-title">
                  Choose your agent
                </span>
                <button
                  type="button"
                  className="agent-selector__sheet-close"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
            ) : null}
            {BUYING_AGENTS.map((agent) => (
              <button
                key={agent.id}
                type="button"
                role="option"
                aria-selected={agentId === agent.id}
                onClick={() => selectAgent(agent.id)}
                className={`agent-selector__option ${
                  agentId === agent.id ? "agent-selector__option--active" : ""
                }`}
              >
                <span className="font-bold">{agent.name}</span>
                {agent.recommended ? (
                  <span className="agent-selector__pill">Recommended</span>
                ) : null}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                openAgentModal({ redirectOnSelect: false });
              }}
              className="agent-selector__footer"
            >
              Compare all agents
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}
