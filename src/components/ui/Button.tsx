import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "cashout";
  children: ReactNode;
};

export default function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const variantClass =
    variant === "cashout"
      ? "game-btn-cashout"
      : variant === "secondary"
        ? "game-btn-secondary"
        : "game-btn-primary";

  return (
    <button
      type={props.type ?? "button"}
      className={`game-btn ${variantClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
