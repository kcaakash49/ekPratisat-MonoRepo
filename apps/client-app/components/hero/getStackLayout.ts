/**
 * Pure helper extracted from HeroCardStack — given the current viewport
 * width and the active perf tier, return the translate offsets and 3D
 * rotation values for the stacked-card layout. Kept as a plain `.ts`
 * file (not a hook, not a component) because it has no React state, no
 * side effects beyond reading `window.innerWidth`, and is called from
 * inside an effect in HeroCardStack.
 *
 * Lives next to its only consumer for now. If a second component ever
 * needs the same breakpoint math, lift it into a shared layout helper
 * — but resist that move until the second caller actually exists.
 */

import type { HeroPerformanceMode } from "./useHeroPerformanceMode";

export type StackLayout = {
  x: number;
  y: number;
  rotateY: number;
  rotateZ: number;
};

export const getStackLayout = (mode: HeroPerformanceMode): StackLayout => {
  const vw = window.innerWidth;
  let cardWidthPx: number;

  if (vw >= 1536) {
    cardWidthPx = Math.min(vw * 0.46, 790);
  } else if (vw >= 1280) {
    cardWidthPx = Math.min(vw * 0.48, 720);
  } else if (vw >= 1024) {
    cardWidthPx = Math.min(vw * 0.5, 650);
  } else if (vw >= 768) {
    cardWidthPx = Math.min(vw * 0.5, 480);
  } else if (vw >= 640) {
    cardWidthPx = Math.min(vw * 0.66, 520);
  } else if (vw >= 375) {
    cardWidthPx = Math.min(vw * 0.74, 340);
  } else if (vw >= 360) {
    cardWidthPx = Math.min(vw * 0.72, 330);
  } else {
    cardWidthPx = Math.min(vw * 0.7, 250);
  }

  // Per-tier intensity multiplier. Scales the translate offsets and 3D
  // rotation values together so weaker GPUs do less compositor work
  // per animated frame, while preserving the same visual *direction*
  // (the cards still tilt the same way, just less dramatically).
  //   full     → 1.00   cinematic depth; desktop / strong GPUs
  //   balanced → 0.72   editorial depth; iPads, mid-range phones
  //   lite     → 0.50   clean depth; reduced-motion or low-end devices
  // The `lite` tier also disables auto-rotation entirely (see
  // `shouldAutoRotate` in HeroCardStack), so static intensity is the
  // baseline.
  const intensity = mode === "full" ? 1 : mode === "balanced" ? 0.72 : 0.5;
  const x = Math.round(cardWidthPx * 0.028 * intensity);
  const y = -Math.round(cardWidthPx * 0.035 * intensity);

  // Mobile uses gentler 3D — narrow viewports already feel busy.
  if (vw < 640) {
    return { x, y, rotateY: -3 * intensity, rotateZ: -0.25 * intensity };
  }

  return { x, y, rotateY: -7 * intensity, rotateZ: -0.6 * intensity };
};
