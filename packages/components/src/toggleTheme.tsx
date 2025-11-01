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
    <Button
      variant="ghost" // Use ghost variant for minimal styling
      size="sm"     // Use icon size for perfect circle
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="px-4 py-2 rounded border border-gray-400 dark:border-gray-600 hover:bg-gray-300 dark:hover:bg-gray-700 transition"
    >
      {isDark ? (
        <Sun className="text-yellow-400" />
      ) : (
        <Moon className="text-gray-600" />
      )}
      {/* {isDark ? "Switch to Light Mode" : "Switch to Dark Mode"} */}
    </Button>
  );
}