"use client";

import { useEffect, useState } from "react";

export type HeroPerformanceMode = "full" | "balanced" | "lite";
const HERO_PERFORMANCE_MODES: HeroPerformanceMode[] = ["full", "balanced", "lite"];

type HeroPerformanceState = {
  mode: HeroPerformanceMode;
  isAppleWebKit: boolean;
  isMounted: boolean;
};

const isAppleTouchDevice = () => {
  const platform = navigator.platform || "";
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
};

const isSafariLike = () => {
  const ua = navigator.userAgent;
  return /^((?!chrome|android|crios|fxios|edgios).)*safari/i.test(ua);
};

const isLocalDebugHost = () => {
  const hostname = window.location.hostname;

  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname.startsWith("192.168.") ||
    hostname.startsWith("10.") ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(hostname)
  );
};

const readDevelopmentModeOverride = (): HeroPerformanceMode | null => {
  if (!isLocalDebugHost()) return null;

  try {
    const value = window.localStorage.getItem("ekHeroPerformanceMode");
    return HERO_PERFORMANCE_MODES.includes(value as HeroPerformanceMode)
      ? (value as HeroPerformanceMode)
      : null;
  } catch {
    return null;
  }
};

const readPerformanceState = (): Omit<HeroPerformanceState, "isMounted"> => {
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const width = window.innerWidth;
  const appleWebKit = isAppleTouchDevice() || isSafariLike();
  const connection = (
    navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
      deviceMemory?: number;
    }
  ).connection;
  const deviceMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  const hardwareConcurrency = navigator.hardwareConcurrency || 0;
  const saveData = Boolean(connection?.saveData);
  const constrainedNetwork =
    connection?.effectiveType === "slow-2g" ||
    connection?.effectiveType === "2g" ||
    connection?.effectiveType === "3g";
  const constrainedDevice =
    (typeof deviceMemory === "number" && deviceMemory <= 4) ||
    (hardwareConcurrency > 0 && hardwareConcurrency <= 4);
  const developmentModeOverride = readDevelopmentModeOverride();

  if (developmentModeOverride) {
    return { mode: developmentModeOverride, isAppleWebKit: appleWebKit };
  }

  if (reducedMotion || saveData || constrainedNetwork || constrainedDevice) {
    return { mode: "lite", isAppleWebKit: appleWebKit };
  }

  if (appleWebKit || coarsePointer || width < 1180) {
    return { mode: "balanced", isAppleWebKit: appleWebKit };
  }

  return { mode: "full", isAppleWebKit: appleWebKit };
};

export function useHeroPerformanceMode(): HeroPerformanceState {
  const [state, setState] = useState<HeroPerformanceState>({
    mode: "lite",
    isAppleWebKit: false,
    isMounted: false,
  });

  useEffect(() => {
    const update = () =>
      setState({
        ...readPerformanceState(),
        isMounted: true,
      });

    update();

    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    const coarsePointerQuery = window.matchMedia("(pointer: coarse)");

    window.addEventListener("resize", update);
    reducedMotionQuery.addEventListener("change", update);
    coarsePointerQuery.addEventListener("change", update);

    return () => {
      window.removeEventListener("resize", update);
      reducedMotionQuery.removeEventListener("change", update);
      coarsePointerQuery.removeEventListener("change", update);
    };
  }, []);

  return state;
}
