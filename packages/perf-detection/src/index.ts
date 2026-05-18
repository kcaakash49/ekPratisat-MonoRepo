/**
 * @repo/perf-detection — public API.
 *
 * The package has three consumable shapes:
 *
 *   1. The inline detection script (string), injected once per page in
 *      a Next.js layout via <Script strategy="beforeInteractive">.
 *      Re-export: PERF_DETECT_SCRIPT
 *
 *   2. The React hook, used inside any client component that needs to
 *      branch on tier or capability flags.
 *      Re-export: usePerfTier
 *
 *   3. The CSS file, imported once at the app's CSS entry point so the
 *      [data-perf-tier="..."] selectors are present in the bundle.
 *      Path:       @repo/perf-detection/perf-mode.css
 *
 * Types and attribute-name constants are also re-exported so consumers
 * write `tier === "balanced"` etc. against a checked union and never
 * hardcode the data-attribute strings.
 *
 * See ARCHITECTURE.md for the data-flow diagram and the design
 * principles behind the three tiers.
 */
export { PERF_DETECT_SCRIPT } from "./inline-script";
export { usePerfTier } from "./use-perf-tier";
export {
  APPLE_WEBKIT_ATTR,
  BROWSER_ENGINE_ATTR,
  LEGACY_PERF_OVERRIDE_KEY,
  PERF_REASON_ATTR,
  PERF_TIER_ATTR,
  PERF_TIER_OVERRIDE_KEY,
  REDUCE_MOTION_ATTR,
  SCROLL_TIMELINE_ATTR,
  type BrowserEngine,
  type PerfReason,
  type PerfState,
  type PerfTier,
} from "./types";
