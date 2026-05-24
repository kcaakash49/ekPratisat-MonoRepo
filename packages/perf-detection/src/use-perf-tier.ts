"use client";

import { useEffect, useState } from "react";
import {
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

/**
 * usePerfTier — the only React API consumers should use.
 *
 * Reads the canonical performance state from <html>'s attributes,
 * which the inline detection script committed *before* React hydrated.
 * Subscribes to OS-level preference changes (reduced-motion, network
 * conditions) so the tier stays correct if the user toggles a setting
 * mid-session.
 *
 * Detection logic is duplicated between this hook and the inline
 * script (the script must be a self-contained string with no module
 * imports). When you change one, change the other — there are unit
 * tests in package consumers that catch drift.
 *
 * SSR & hydration
 * ---------------
 * The first server render returns `SAFE_DEFAULT_STATE` (`tier: "balanced"`,
 * `isMounted: false`). After hydration the hook reads the real values
 * from <html> and re-renders. Components that branch on `tier` for
 * structural decisions (mount/unmount) should gate those decisions on
 * `isMounted` to avoid hydration mismatches. CSS rules keyed off
 * `[data-perf-tier="..."]` apply at first paint without any React
 * involvement.
 */
export function usePerfTier(): PerfState {
  const [state, setState] = useState<PerfState>(SAFE_DEFAULT_STATE);

  useEffect(() => {
    setState(readStateFromDom());

    const onMediaChange = () => setState(redetectAndCommit());

    const queries: MediaQueryList[] = [];
    try {
      const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
      motion.addEventListener("change", onMediaChange);
      queries.push(motion);
    } catch {
      // matchMedia unsupported; preferences won't update mid-session.
    }

    type ConnectionLike = {
      addEventListener?: (type: string, listener: () => void) => void;
      removeEventListener?: (type: string, listener: () => void) => void;
    };
    const conn = (navigator as Navigator & { connection?: ConnectionLike })
      .connection;
    conn?.addEventListener?.("change", onMediaChange);

    return () => {
      queries.forEach((mq) => mq.removeEventListener("change", onMediaChange));
      conn?.removeEventListener?.("change", onMediaChange);
    };
  }, []);

  return state;
}

// ---------------------------------------------------------------------------
// Internals
// ---------------------------------------------------------------------------

/**
 * Returned during SSR and the very first client render. "balanced" is
 * the safest middle tier — it never assumes capabilities that might
 * not exist and looks premium on every device.
 */
const SAFE_DEFAULT_STATE: PerfState = {
  tier: "balanced",
  supportsScrollTimeline: false,
  prefersReducedMotion: false,
  isAppleWebKit: false,
  isMounted: false,
  reason: "capable",
  browserEngine: "unknown",
};

/** Pull the canonical state from <html>'s attributes. */
function readStateFromDom(): PerfState {
  if (typeof document === "undefined") return SAFE_DEFAULT_STATE;

  const html = document.documentElement;
  const tierAttr = html.getAttribute(PERF_TIER_ATTR);
  const tier = isPerfTier(tierAttr) ? tierAttr : redetectTierAndReason().tier;
  const reasonAttr = html.getAttribute(PERF_REASON_ATTR);
  const reason = isPerfReason(reasonAttr) ? reasonAttr : "capable";
  const engineAttr = html.getAttribute(BROWSER_ENGINE_ATTR);
  const browserEngine = isBrowserEngine(engineAttr) ? engineAttr : "unknown";

  return {
    tier,
    supportsScrollTimeline: html.getAttribute(SCROLL_TIMELINE_ATTR) === "true",
    prefersReducedMotion: html.getAttribute(REDUCE_MOTION_ATTR) === "true",
    isAppleWebKit: html.getAttribute(APPLE_WEBKIT_ATTR) === "true",
    isMounted: true,
    reason,
    browserEngine,
  };
}

/**
 * Re-evaluate from scratch and write the new values back to <html>.
 * Used when a media-query change fires after mount — keeps CSS rules
 * and React state in lock-step.
 */
function redetectAndCommit(): PerfState {
  if (typeof document === "undefined") return SAFE_DEFAULT_STATE;

  const { tier, reason } = redetectTierAndReason();
  const supportsScrollTimeline = detectScrollTimelineSupport();
  const prefersReducedMotion = detectReducedMotion();
  const isAppleWebKit = detectAppleWebKit();
  const browserEngine = detectBrowserEngine();

  const html = document.documentElement;
  html.setAttribute(PERF_TIER_ATTR, tier);
  html.setAttribute(SCROLL_TIMELINE_ATTR, String(supportsScrollTimeline));
  html.setAttribute(REDUCE_MOTION_ATTR, String(prefersReducedMotion));
  html.setAttribute(APPLE_WEBKIT_ATTR, String(isAppleWebKit));
  html.setAttribute(PERF_REASON_ATTR, reason);
  html.setAttribute(BROWSER_ENGINE_ATTR, browserEngine);

  return {
    tier,
    supportsScrollTimeline,
    prefersReducedMotion,
    isAppleWebKit,
    isMounted: true,
    reason,
    browserEngine,
  };
}

/**
 * Tier decision logic — kept in lockstep with `inline-script.ts`.
 * If you change one, change the other.
 */
function redetectTierAndReason(): { tier: PerfTier; reason: PerfReason } {
  const override = readDevOverride();
  if (override) return { tier: override, reason: "override" };

  if (detectReducedMotion()) return { tier: "lite", reason: "reduced-motion" };
  if (detectSaveData() || detectSlowNetwork())
    return { tier: "lite", reason: "save-data" };

  const memory = getDeviceMemory();
  const cores = navigator.hardwareConcurrency || 0;

  const veryLowHw =
    (typeof memory === "number" && memory <= 2) ||
    (cores > 0 && cores <= 2);
  if (veryLowHw) return { tier: "lite", reason: "very-low-hw" };

  if (detectIPad()) return { tier: "balanced", reason: "ipad" };
  if (detectIPhone()) return { tier: "balanced", reason: "iphone" };

  const midHw =
    (typeof memory === "number" && memory <= 3) ||
    (cores > 0 && cores <= 4);
  if (midHw) return { tier: "balanced", reason: "mid-hw" };

  return { tier: "full", reason: "capable" };
}

function detectReducedMotion(): boolean {
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

type ConnectionInfo = { saveData?: boolean; effectiveType?: string };

function getConnection(): ConnectionInfo | undefined {
  return (navigator as Navigator & { connection?: ConnectionInfo }).connection;
}

function detectSaveData(): boolean {
  return Boolean(getConnection()?.saveData);
}

function detectSlowNetwork(): boolean {
  const t = getConnection()?.effectiveType;
  return t === "slow-2g" || t === "2g" || t === "3g";
}

function getDeviceMemory(): number | null {
  const v = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  return typeof v === "number" ? v : null;
}

/** True for any iPad — including iPadOS that spoofs the macOS UA. */
function detectIPad(): boolean {
  const ua = navigator.userAgent || "";
  if (/iPad/.test(ua)) return true;
  const platform =
    (navigator as unknown as { platform?: string }).platform || "";
  return platform === "MacIntel" && navigator.maxTouchPoints > 1;
}

/**
 * True for any iPhone or iPod (not iPad — which has its own detector).
 * All iOS WebKit is forced to "balanced" regardless of iOS version,
 * because the main-thread JS scroll throttling that causes the lag
 * is architectural to iOS Safari, not version- or hardware-dependent.
 */
function detectIPhone(): boolean {
  const ua = navigator.userAgent || "";
  if (detectIPad()) return false;
  return /iPhone|iPod/.test(ua);
}

function detectAppleWebKit(): boolean {
  const ua = navigator.userAgent || "";
  if (detectIPad()) return true;
  if (/iPhone|iPod/.test(ua)) return true;
  const isSafari = /^((?!chrome|android|crios|fxios|edgios).)*safari/i.test(ua);
  return isSafari;
}

function detectBrowserEngine(): BrowserEngine {
  const ua = navigator.userAgent || "";
  // WebKit only — no other engine in the UA. Order matters: check
  // Chromium-on-iOS spoofs (CriOS, FxiOS, EdgiOS) before declaring webkit.
  if (
    detectAppleWebKit() &&
    !/(Chrome|CriOS|FxiOS|EdgiOS)/.test(ua)
  ) {
    return "webkit";
  }
  if (/Firefox|FxiOS/.test(ua)) return "gecko";
  if (
    /Chrome|CriOS|EdgiOS|Edg|OPR|SamsungBrowser|Brave/.test(ua) ||
    typeof (window as unknown as { chrome?: unknown }).chrome !== "undefined"
  ) {
    return "blink";
  }
  return "unknown";
}

function detectScrollTimelineSupport(): boolean {
  try {
    return (
      typeof CSS !== "undefined" &&
      typeof CSS.supports === "function" &&
      CSS.supports("animation-timeline: scroll()")
    );
  } catch {
    return false;
  }
}

/**
 * Honors the same dev-mode override as the inline script. Lets a
 * developer test any tier from devtools without changing devices:
 *   localStorage.setItem("ekPerfTier", "balanced"); location.reload();
 * Only active on local hosts so production behavior is never altered.
 */
function readDevOverride(): PerfTier | null {
  try {
    const host = window.location.hostname;
    const isLocal =
      host === "localhost" ||
      host === "127.0.0.1" ||
      host.startsWith("192.168.") ||
      host.startsWith("10.") ||
      /^172\.(1[6-9]|2\d|3[0-1])\./.test(host);
    if (!isLocal) return null;

    const raw =
      window.localStorage.getItem(PERF_TIER_OVERRIDE_KEY) ||
      window.localStorage.getItem(LEGACY_PERF_OVERRIDE_KEY);
    return isPerfTier(raw) ? raw : null;
  } catch {
    return null;
  }
}

function isPerfTier(value: unknown): value is PerfTier {
  return value === "full" || value === "balanced" || value === "lite";
}

function isPerfReason(value: unknown): value is PerfReason {
  return (
    value === "override" ||
    value === "reduced-motion" ||
    value === "save-data" ||
    value === "very-low-hw" ||
    value === "ipad" ||
    value === "iphone" ||
    value === "mid-hw" ||
    value === "capable"
  );
}

function isBrowserEngine(value: unknown): value is BrowserEngine {
  return (
    value === "webkit" ||
    value === "blink" ||
    value === "gecko" ||
    value === "unknown"
  );
}
