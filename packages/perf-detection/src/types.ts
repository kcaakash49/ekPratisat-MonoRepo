/**
 * Shared types for @repo/perf-detection.
 *
 * Three tiers are intentional and locked. See ARCHITECTURE.md for the
 * design language behind each name. Do not add more tiers — keep CSS
 * branching bounded.
 *
 *   full     → "Cinematic premium"  — desktop, strong devices
 *   balanced → "Editorial premium"  — iPads, mid-range phones, iOS Safari
 *   lite     → "Clean premium"      — weak phones, reduced-motion, save-data
 *
 * The internal names (full/balanced/lite) are preserved to keep
 * existing consumers like `useHeroPerformanceMode` working without
 * any source changes.
 */
export type PerfTier = "full" | "balanced" | "lite";

/**
 * Snapshot of capability + preference signals exposed by the hook.
 *
 * `isMounted` flips to true after the React component using this hook
 * has hydrated. Useful for consumers that need to wait until the
 * client-side environment is known (e.g. before mounting a video
 * element to avoid SSR hydration mismatches).
 *
 * `supportsScrollTimeline` reflects whether the browser implements the
 * CSS `animation-timeline: scroll()` spec. Used as a progressive
 * enhancement signal on the `full` tier.
 *
 * `prefersReducedMotion` mirrors the OS-level setting and updates
 * reactively if the user toggles it mid-session.
 *
 * `isAppleWebKit` is true on iOS Safari, iPadOS, and desktop Safari.
 * Used by media-selection code (e.g. MetallicBackground) to prefer
 * mp4 over webm and to apply Safari-specific transition tweaks.
 *
 * `reason` is a short string explaining why the chosen tier was
 * selected (e.g. "ipad", "very-low-hw", "reduced-motion", "capable").
 * Useful for debugging via devtools — also mirrored to <html data-perf-reason>.
 *
 * `browserEngine` reports the rendering engine: "webkit" (Safari/iOS),
 * "blink" (Chrome / Edge / Brave / Samsung / Opera / etc), or "gecko"
 * (Firefox). Mirrored to <html data-browser-engine>. Use sparingly —
 * tier classification is capability-based, not engine-based.
 */
export type PerfState = {
  tier: PerfTier;
  supportsScrollTimeline: boolean;
  prefersReducedMotion: boolean;
  isAppleWebKit: boolean;
  isMounted: boolean;
  reason: PerfReason;
  browserEngine: BrowserEngine;
};

/**
 * The set of reasons a tier may have been selected. Closed union so
 * the docs and devtools stay in sync with what the detection actually
 * emits. Each value maps to a single decision branch in the script.
 */
export type PerfReason =
  | "override"           // localStorage override (dev only)
  | "reduced-motion"     // OS preference
  | "save-data"          // network constraint
  | "very-low-hw"        // genuinely weak hardware
  | "ipad"               // iPad / iPadOS (forced balanced — WebKit scroll quirk)
  | "iphone"             // any iPhone / iPod (forced balanced — WebKit scroll quirk)
  | "mid-hw"             // mid-range device (still capable, balanced for safety)
  | "capable";           // healthy device, full tier

export type BrowserEngine = "webkit" | "blink" | "gecko" | "unknown";

/**
 * Names of the data attributes set on the <html> element by the
 * inline detection script. Exported so consumers (CSS, components)
 * use the same canonical strings — never hardcode these elsewhere.
 */
export const PERF_TIER_ATTR = "data-perf-tier";
export const SCROLL_TIMELINE_ATTR = "data-scroll-timeline";
export const REDUCE_MOTION_ATTR = "data-reduce-motion";
export const APPLE_WEBKIT_ATTR = "data-apple-webkit";
export const PERF_REASON_ATTR = "data-perf-reason";
export const BROWSER_ENGINE_ATTR = "data-browser-engine";

/**
 * Optional development override key. Read by both the inline script
 * and the React hook. Setting this in localStorage on a local host
 * forces a specific tier — useful for testing the editorial/clean
 * variants from a desktop browser without changing physical devices.
 *
 *   localStorage.setItem("ekPerfTier", "balanced");
 *   // then reload.
 *
 * Legacy key `ekHeroPerformanceMode` is also honored for
 * backward compatibility with the previous hero performance hook.
 */
export const PERF_TIER_OVERRIDE_KEY = "ekPerfTier";
export const LEGACY_PERF_OVERRIDE_KEY = "ekHeroPerformanceMode";
