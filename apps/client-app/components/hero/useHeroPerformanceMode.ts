"use client";

/**
 * useHeroPerformanceMode — backward-compatibility shim.
 *
 * The original implementation lived here and re-detected the device
 * tier on every mount via useEffect, which caused a one-render flash
 * (initial state was "lite" until detection finished). That detection
 * has been moved to a pre-paint inline script in
 * `packages/perf-detection`, so the tier is already on `<html>` before
 * React hydrates.
 *
 * This file is preserved as a thin re-export so existing consumers
 * (HeroCardStack, MetallicBackground, ScrollLogoTransition, Navbar)
 * keep working with no source changes. New code should import
 * `usePerfTier` from `@repo/perf-detection` directly — it carries the
 * additional `supportsScrollTimeline` and `prefersReducedMotion` flags
 * that this legacy shape doesn't expose.
 */

import { usePerfTier, type PerfTier } from "@repo/perf-detection";

/** Legacy alias preserved for existing imports. */
export type HeroPerformanceMode = PerfTier;

/**
 * Legacy state shape preserved for existing consumers.
 *
 * - `mode` is the perf tier (full | balanced | lite).
 * - `isAppleWebKit` is true on iOS Safari, iPadOS, and desktop Safari —
 *   used by MetallicBackground to prefer mp4 over webm.
 * - `isMounted` flips to true after hydration; consumers gate
 *   structural decisions on it to avoid hydration mismatches.
 */
export type HeroPerformanceState = {
  mode: HeroPerformanceMode;
  isAppleWebKit: boolean;
  isMounted: boolean;
};

export function useHeroPerformanceMode(): HeroPerformanceState {
  const { tier, isAppleWebKit, isMounted } = usePerfTier();
  return { mode: tier, isAppleWebKit, isMounted };
}
