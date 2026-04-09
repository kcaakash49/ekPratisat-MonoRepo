"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@repo/ui/button";

export function ToggleTheme() {
  const { theme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const isDark = theme === "dark";

  return (
    <button onClick={() => setTheme(isDark ? "light" : "dark")} className="rounded-full p-2 border shadow-xl hover:shadow-lg transition-shadow bg-transparent border-gray-300 dark:border-gray-600">
       {isDark ? (
        <Sun className="text-yellow-400" />
      ) : (
        <Moon className="text-yellow-600"/>
      )}
    </button>
  );
}