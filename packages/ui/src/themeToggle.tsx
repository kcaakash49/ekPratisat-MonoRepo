"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "./button";
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
    <Button
      variant="ghost" // Use ghost variant for minimal styling
      size="round"     // Use icon size for perfect circle
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="rounded-3xl p-2"
    >
      {isDark ? (
        <Sun className="text-yellow-400" />
      ) : (
        <Moon className="text-blue-600" />
      )}
    </Button>
  );
}