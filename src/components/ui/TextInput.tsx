"use client";

import { useId } from "react";

type TextInputProps = {
  id?: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "search" | "number";
  min?: number;
  className?: string;
  fullWidth?: boolean;
  icon?: React.ReactNode;
};

export default function TextInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  min,
  className = "",
  fullWidth = true,
  icon,
}: TextInputProps) {
  const autoId = useId();
  const inputId = id ?? autoId;

  return (
    <div className={`control-field ${fullWidth ? "w-full" : ""} ${className}`}>
      {label && (
        <label htmlFor={inputId} className="control-label">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          type={type}
          min={min}
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className={`control-input ${icon ? "pl-11" : ""} ${fullWidth ? "w-full" : ""}`}
        />
      </div>
    </div>
  );
}
