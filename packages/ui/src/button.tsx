"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
type ButtonSize = "default" | "sm" | "lg" | "icon" | "full" | "round";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>{
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const baseStyles =
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

  const variants: Record<ButtonVariant, string> = {
    default:
      "bg-gold-gradient text-[#151006] shadow-sm shadow-gold-800/15 hover:bg-gold-gradient-hover dark:text-[#151006] dark:shadow-black/25",
    destructive:
      "bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600",
    outline:
      "border border-[rgba(154,106,0,0.18)] bg-white/60 text-secondary-900 hover:border-gold-700/35 hover:bg-white dark:border-[var(--ek-dark-border)] dark:bg-[rgba(247,241,227,0.07)] dark:text-[var(--ek-dark-text)] dark:hover:border-[var(--ek-dark-border-strong)] dark:hover:bg-[rgba(229,184,62,0.12)]",
    secondary:
      "bg-[#f8f1e3] text-secondary-900 hover:bg-[#fffdf8] dark:bg-[var(--ek-dark-elevated)] dark:text-[var(--ek-dark-text)] dark:hover:bg-[rgba(229,184,62,0.12)]",
    ghost:
      "text-secondary-900 hover:bg-[rgba(154,106,0,0.08)] dark:text-[var(--ek-dark-text)] dark:hover:bg-[rgba(229,184,62,0.10)]",
    link:
      "text-gold-700 underline-offset-4 hover:underline dark:text-gold-400",
  };
  

const sizes: Record<ButtonSize, string> = {
  default: "h-10 px-4 py-2",
  sm: "h-9 px-3 text-sm",
  lg: "h-11 px-8 text-base",
  icon: "h-10 w-10 p-0",
  full: "w-full h-10 px-4",
  round: ""
};

export const Button = ({
  children,
  className = "",
  onClick,
  type = 'button',
  variant = "default",
  size = "default",
  ...props
}: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      type={type}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
