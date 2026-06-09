import type { ButtonHTMLAttributes, ReactNode } from "react";

type ControlButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  children: ReactNode;
};

export default function ControlButton({
  variant = "secondary",
  className = "",
  children,
  ...props
}: ControlButtonProps) {
  const variantClass =
    variant === "primary"
      ? "control-btn-primary"
      : variant === "ghost"
        ? "control-btn-ghost"
        : "control-btn";

  return (
    <button
      type={props.type ?? "button"}
      className={`${variantClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
