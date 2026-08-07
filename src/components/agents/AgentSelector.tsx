"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { AgentId } from "@/lib/agents";
import { BUYING_AGENTS, getAgentById } from "@/lib/agents";
import { usePreferences } from "@/context/PreferencesContext";
import { useAgentModal } from "@/context/AgentModalContext";
import AgentLogo from "./AgentLogo";

type AgentSelectorProps = {
  variant?: "header" | "mobile";
  className?: string;
};

/** Primary agents shown first in mobile sheet */
const MOBILE_AGENT_ORDER: AgentId[] = [
  "litbuy",
  "usfans",
  "oopbuy",
  "kakobuy",
  "gtbuy",
  "boonbuy",
  "hipobuy",
];

function orderedAgents(): typeof BUYING_AGENTS {
  const byId = Object.fromEntries(BUYING_AGENTS.map((a) => [a.id, a]));
  return MOBILE_AGENT_ORDER.map((id) => byId[id]).filter(Boolean);
}

export default function AgentSelector({
  variant = "header",
  className = "",
}: AgentSelectorProps) {
  const { agentId, setAgentId } = usePreferences();
  const { openAgentModal } = useAgentModal();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const current = getAgentById(agentId);
  const isMobile = variant === "mobile";
  const agents = orderedAgents();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open || isMobile) return;
    function handleClick(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, isMobile]);

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

  const panelBody = (
    <>
      <div className="agent-selector-panel__header">
        <h2 className="agent-selector-panel__title">Choose agent</h2>
        <button
          type="button"
          className="agent-selector-panel__close"
          onClick={() => setOpen(false)}
          aria-label="Close"
        >
          ✕
        </button>
      </div>

      <ul className="agent-selector-list">
        {agents.map((agent) => {
          const selected = agentId === agent.id;
          return (
            <li key={agent.id}>
              <button
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => selectAgent(agent.id)}
                className={`agent-selector-card ${
                  selected ? "agent-selector-card--selected" : ""
                } ${agent.recommended ? "agent-selector-card--recommended" : ""}`}
              >
                <span
                  className={`agent-selector-card__radio ${
                    selected ? "agent-selector-card__radio--on" : ""
                  }`}
                  aria-hidden
                />
                <AgentLogo agentId={agent.id} size="md" />
                <span className="agent-selector-card__body">
                  <span className="agent-selector-card__name">{agent.name}</span>
                  {agent.recommended ? (
                    <span className="agent-selector-card__badge">
                      ⭐ Recommended
                    </span>
                  ) : null}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        onClick={() => {
          setOpen(false);
          openAgentModal({ redirectOnSelect: false });
        }}
        className="agent-selector-panel__footer"
      >
        Compare all agents
      </button>
    </>
  );

  const mobileSheet =
    open && isMobile && mounted
      ? createPortal(
          <>
            <button
              type="button"
              className="agent-selector-backdrop agent-selector-backdrop--portal"
              aria-label="Close agent menu"
              onClick={() => setOpen(false)}
            />
            <div
              className="agent-selector-panel agent-selector-panel--sheet agent-selector-panel--portal"
              role="listbox"
              aria-label="Buying agents"
            >
              {panelBody}
            </div>
          </>,
          document.body
        )
      : null;

  return (
    <div ref={rootRef} className={`agent-selector-root ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={
          isMobile ? "agent-selector-trigger agent-selector-trigger--mobile" : "agent-selector-trigger agent-selector-trigger--desktop"
        }
        aria-expanded={open}
        aria-haspopup="listbox"
        style={{ touchAction: "manipulation" }}
      >
        <AgentLogo agentId={agentId} size={isMobile ? "xs" : "sm"} />
        <span className="agent-selector-trigger__text">
          {!isMobile ? (
            <>
              <span className="agent-selector-trigger__label">Agent</span>
              <span className="agent-selector-trigger__value">{current.name}</span>
            </>
          ) : (
            <span className="agent-selector-trigger__value">{current.name}</span>
          )}
        </span>
        {current.recommended && !isMobile ? (
          <span className="agent-selector-trigger__pill">Recommended</span>
        ) : null}
        <span className="agent-selector-trigger__chevron" aria-hidden>
          ▾
        </span>
      </button>

      {mobileSheet}

      {open && !isMobile ? (
        <>
          <button
            type="button"
            className="agent-selector-backdrop"
            aria-label="Close agent menu"
            onClick={() => setOpen(false)}
          />
          <div
            className="agent-selector-panel agent-selector-panel--dropdown"
            role="listbox"
            aria-label="Buying agents"
          >
            {panelBody}
          </div>
        </>
      ) : null}
    </div>
  );
}
