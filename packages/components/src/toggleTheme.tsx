"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ToggleTheme() {
  const { theme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="rounded-full border border-[var(--ek-border-strong)] bg-[rgba(255,253,248,0.94)] p-2 text-[var(--ek-gold-text)] shadow-lg shadow-secondary-900/15 transition hover:border-gold-500 hover:bg-white hover:text-secondary-950 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 dark:border-[rgba(229,184,62,0.14)] dark:bg-white/[0.035] dark:text-[var(--ek-dark-gold)] dark:shadow-none dark:hover:border-[rgba(229,184,62,0.24)] dark:hover:bg-white/[0.065] dark:hover:text-[#f7f1e3]"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
       {isDark ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </button>
  );
}
