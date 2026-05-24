"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { useHeroPerformanceMode } from "./hero/useHeroPerformanceMode";

type MetallicBackgroundProps = {
  variant?: "hero" | "about";
};

type HeroTheme = "light" | "dark";

const HERO_MEDIA = {
  light: {
    posterAvif: "/fallback-images/bg-fallback-light.avif",
    posterWebp: "/fallback-images/bg-fallback-light.webp",
    posterLosslessWebp: "/fallback-images/bg-fallback-light-lossless.webp",
    posterPng: "/fallback-images/bg-fallback-light.png",
    webm: "/videos/metallic-flow-light.webm",
    mp4: "/videos/metallic-flow-light.mp4",
    mp4_720: "/videos/metallic-flow-light-720.mp4",
  },
  dark: {
    posterAvif: "/fallback-images/bg-fallback-dark.avif",
    posterWebp: "/fallback-images/bg-fallback-dark.webp",
    posterLosslessWebp: "/fallback-images/bg-fallback-dark-lossless.webp",
    posterPng: "/fallback-images/bg-fallback-dark.png",
    webm: "/videos/metallic-flow-dark.webm",
    mp4: "/videos/metallic-flow-dark.mp4",
    mp4_720: "/videos/metallic-flow-dark-720.mp4",
  },
} as const;

const mediaClass = "absolute inset-0 h-full w-full object-cover";
const BALANCED_VIDEO_MOUNT_DELAY_MS = 1200;

export default function MetallicBackground({
  variant = "hero",
}: MetallicBackgroundProps) {
  const { resolvedTheme } = useTheme();
  const { mode, isAppleWebKit, isMounted } = useHeroPerformanceMode();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoFailed, setVideoFailed] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [canMountVideo, setCanMountVideo] = useState(false);

  const isThemeReady = resolvedTheme === "dark" || resolvedTheme === "light";
  const canRenderThemedMedia = isMounted && isThemeReady;
  const theme: HeroTheme = resolvedTheme === "dark" ? "dark" : "light";
  const media = HERO_MEDIA[theme];

  const selectedVideo = useMemo(() => {
    if (
      !canRenderThemedMedia ||
      !canMountVideo ||
      mode === "lite" ||
      videoFailed ||
      variant !== "hero"
    ) {
      return null;
    }

    if (mode === "balanced") {
      return isAppleWebKit
        ? { src: media.mp4_720, type: "video/mp4" }
        : { src: media.webm, type: "video/webm" };
    }

    return isAppleWebKit
      ? { src: media.mp4, type: "video/mp4" }
      : { src: media.webm, type: "video/webm" };
  }, [
    canMountVideo,
    canRenderThemedMedia,
    isAppleWebKit,
    media,
    mode,
    variant,
    videoFailed,
  ]);

  useEffect(() => {
    setVideoFailed(false);
    setVideoReady(false);

    if (!canRenderThemedMedia || mode === "lite" || variant !== "hero") {
      setCanMountVideo(false);
      return;
    }

    setCanMountVideo(false);

    const mountDelay = mode === "balanced" ? BALANCED_VIDEO_MOUNT_DELAY_MS : 0;
    const timeoutId = window.setTimeout(() => {
      setCanMountVideo(true);
    }, mountDelay);

    return () => window.clearTimeout(timeoutId);
  }, [canRenderThemedMedia, mode, theme, variant]);

  useEffect(() => {
    if (!selectedVideo) return;

    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.playsInline = true;

    const playPromise = video.play();
    if (playPromise) {
      playPromise.catch(() => {
        setVideoReady(false);
      });
    }
  }, [selectedVideo]);

  return (
    <div
      className="hero-metallic-fallback pointer-events-none absolute inset-0 overflow-hidden"
      data-hero-performance-mode={mode}
    >
      {canRenderThemedMedia ? (
        <picture key={`poster-${theme}-${mode}`}>
          <source srcSet={media.posterAvif} type="image/avif" />
          <source
            srcSet={mode === "full" ? media.posterLosslessWebp : media.posterWebp}
            type="image/webp"
          />
          <img
            src={media.posterPng}
            alt=""
            className={mediaClass}
            aria-hidden="true"
            draggable={false}
          />
        </picture>
      ) : null}

      {selectedVideo ? (
        <video
          ref={videoRef}
          key={`${theme}-${mode}-${selectedVideo.src}`}
          className={`${mediaClass} transition-opacity duration-500 ease-out ${
            videoReady ? "opacity-100" : "opacity-0"
          }`}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={media.posterAvif}
          onError={() => setVideoFailed(true)}
          onLoadedData={() => setVideoReady(true)}
          onCanPlay={() => setVideoReady(true)}
          onPlaying={() => setVideoReady(true)}
        >
          <source src={selectedVideo.src} type={selectedVideo.type} />
        </video>
      ) : null}

      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_30%_18%,rgba(255,255,255,0.28),transparent_30%)] transition-colors duration-300 dark:bg-[radial-gradient(circle_at_30%_18%,rgba(229,184,62,0.14),transparent_28%),linear-gradient(90deg,rgba(18,16,12,0.58),rgba(18,16,12,0.22))]"
        aria-hidden="true"
      />
    </div>
  );
}
