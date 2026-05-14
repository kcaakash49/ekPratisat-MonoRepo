"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useHeroPerformanceMode, type HeroPerformanceMode } from "./useHeroPerformanceMode";
import {
  HERO_LOGO_SIZES,
  HERO_LOGO_SRC,
  HERO_LOGO_SRC_SET,
} from "./logoAssets";

type LogoRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type LogoLayout = {
  hero: LogoRect;
  nav: LogoRect;
  scrollRange: number;
  dockRange: number;
};

type ScrollLogoTransitionProps = {
  isMenuOpen?: boolean;
};

const HERO_SLOT_SELECTOR = '[data-logo-slot="hero"]';
const NAV_SLOT_SELECTOR = '[data-logo-slot="navbar"]';

const snapToDevicePixel = (value: number) => {
  const pixelRatio = window.devicePixelRatio || 1;
  return Math.round(value * pixelRatio) / pixelRatio;
};

const getScrollRange = (mode: HeroPerformanceMode) => {
  const width = window.innerWidth;

  if (mode === "lite") return width < 1024 ? 96 : 108;
  if (mode === "balanced") return width < 640 ? 112 : width < 1024 ? 128 : 144;
  if (width < 640) return 112;
  if (width < 1024) return 128;
  return 128;
};

const getDockRange = (mode: HeroPerformanceMode, scrollRange: number) => {
  if (mode === "balanced") return Math.max(72, Math.round(scrollRange * 0.62));
  if (mode === "lite") return Math.max(64, Math.round(scrollRange * 0.64));
  return scrollRange;
};

const readSlotRect = (element: Element): LogoRect => {
  const rect = element.getBoundingClientRect();
  const scrollTop = Math.max(0, window.scrollY || window.pageYOffset || 0);

  return {
    x: snapToDevicePixel(rect.left),
    y: snapToDevicePixel(rect.top + scrollTop),
    width: snapToDevicePixel(rect.width),
    height: snapToDevicePixel(rect.height),
  };
};

export default function ScrollLogoTransition({
  isMenuOpen = false,
}: ScrollLogoTransitionProps) {
  const { mode } = useHeroPerformanceMode();
  const clampedScrollY = useMotionValue(0);
  const [layout, setLayout] = useState<LogoLayout | null>(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const logoImageRef = useRef<HTMLImageElement | null>(null);
  const measuredWidthRef = useRef<number | null>(null);

  useEffect(() => {
    let isCancelled = false;
    const logoImage = new window.Image();

    const markLoaded = () => {
      if (!isCancelled) setIsImageLoaded(true);
    };

    logoImage.onload = markLoaded;
    logoImage.src = HERO_LOGO_SRC;

    if (logoImage.complete && logoImage.naturalWidth > 0) {
      markLoaded();
    } else if (logoImage.decode) {
      logoImage.decode().then(markLoaded).catch(() => {});
    }

    return () => {
      isCancelled = true;
      logoImage.onload = null;
    };
  }, []);

  const updateLayout = useCallback((force = false) => {
    const viewportWidth = window.innerWidth;

    if (!force && measuredWidthRef.current === viewportWidth) return;

    const heroSlot = document.querySelector(HERO_SLOT_SELECTOR);
    const navSlot = document.querySelector(NAV_SLOT_SELECTOR);

    if (!heroSlot || !navSlot) return;

    const hero = readSlotRect(heroSlot);
    const navRect = navSlot.getBoundingClientRect();

    const scrollRange = getScrollRange(mode);

    setLayout({
      hero,
      nav: {
        x: snapToDevicePixel(navRect.left),
        y: snapToDevicePixel(navRect.top),
        width: snapToDevicePixel(navRect.width),
        height: snapToDevicePixel(navRect.height),
      },
      scrollRange,
      dockRange: getDockRange(mode, scrollRange),
    });
    measuredWidthRef.current = viewportWidth;
  }, [mode]);

  useLayoutEffect(() => {
    updateLayout(true);

    const frameId = requestAnimationFrame(() => updateLayout(true));
    return () => cancelAnimationFrame(frameId);
  }, [updateLayout]);

  useEffect(() => {
    let frameId: number | null = null;

    const scheduleUpdate = (force = false) => {
      if (frameId !== null) cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => updateLayout(force));
    };

    const handleResize = () => scheduleUpdate(false);
    const handleOrientationChange = () => scheduleUpdate(true);
    const handleLoad = () => scheduleUpdate(true);

    scheduleUpdate(true);
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleOrientationChange);
    window.addEventListener("load", handleLoad);

    return () => {
      if (frameId !== null) cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleOrientationChange);
      window.removeEventListener("load", handleLoad);
    };
  }, [updateLayout]);

  useEffect(() => {
    const logoImage = logoImageRef.current;

    if (logoImage?.complete && logoImage.naturalWidth > 0) {
      setIsImageLoaded(true);
    }
  }, [layout]);

  const hero = layout?.hero ?? { x: 0, y: 0, width: 1, height: 1 };
  const nav = layout?.nav ?? hero;
  const scrollRange = layout?.scrollRange ?? 320;
  const dockRange = layout?.dockRange ?? scrollRange;
  const endScale = nav.width / hero.width;
  const lastPhaseRef = useRef<"hero" | "docking" | "docked" | null>(null);

  useEffect(() => {
    let frameId: number | null = null;

    const syncScrollPosition = () => {
      frameId = null;
      const scrollTop = Math.max(0, window.scrollY || window.pageYOffset || 0);
      clampedScrollY.set(Math.min(scrollTop, scrollRange));

      const phase =
        scrollTop <= 1 ? "hero" : scrollTop < dockRange ? "docking" : "docked";

      if (lastPhaseRef.current !== phase) {
        document.documentElement.dataset.scrollLogoPhase = phase;
        lastPhaseRef.current = phase;
      }
    };

    const scheduleSync = () => {
      if (frameId !== null) return;
      frameId = window.requestAnimationFrame(syncScrollPosition);
    };

    scheduleSync();
    window.addEventListener("scroll", scheduleSync, { passive: true });
    window.addEventListener("resize", scheduleSync);
    window.addEventListener("orientationchange", scheduleSync);

    return () => {
      if (frameId !== null) window.cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", scheduleSync);
      window.removeEventListener("resize", scheduleSync);
      window.removeEventListener("orientationchange", scheduleSync);
      delete document.documentElement.dataset.scrollLogoPhase;
      lastPhaseRef.current = null;
    };
  }, [clampedScrollY, dockRange, scrollRange]);

  const x = useTransform(clampedScrollY, [0, dockRange], [hero.x, nav.x], {
    clamp: true,
  });
  const y = useTransform(clampedScrollY, [0, dockRange], [hero.y, nav.y], {
    clamp: true,
  });
  const scale = useTransform(clampedScrollY, [0, dockRange], [1, endScale], {
    clamp: true,
  });

  const isLogoReady = Boolean(layout && isImageLoaded);

  useEffect(() => {
    if (!isLogoReady) {
      delete document.documentElement.dataset.scrollLogoReady;
      return;
    }

    document.documentElement.dataset.scrollLogoReady = "true";

    return () => {
      delete document.documentElement.dataset.scrollLogoReady;
    };
  }, [isLogoReady]);

  return (
    <motion.img
      ref={logoImageRef}
      src={HERO_LOGO_SRC}
      srcSet={HERO_LOGO_SRC_SET}
      sizes={HERO_LOGO_SIZES}
      alt=""
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[60] select-none object-contain will-change-transform"
      style={{
        width: hero.width,
        height: hero.height,
        x,
        y,
        scale,
        transformOrigin: "top left",
      }}
      initial={false}
      animate={{ opacity: isLogoReady && !isMenuOpen ? 1 : 0 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      onLoad={() => setIsImageLoaded(true)}
      loading="eager"
      decoding="async"
      draggable={false}
    />
  );
}
