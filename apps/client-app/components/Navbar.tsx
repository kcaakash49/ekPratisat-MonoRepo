"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  ChevronDown,
  Heart,
  Home,
  HousePlus,
  LogOut,
  Menu,
  UserRound,
  X,
} from "lucide-react";
import { ToggleTheme } from "@repo/components/toggleTheme";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@repo/query-hook";
import type { User } from "@repo/query-hook";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import ScrollLogoTransition from "./hero/ScrollLogoTransition";
import { HERO_LOGO_SRC, NAV_LOGO_SIZES } from "./hero/logoAssets";
import { useHeroPerformanceMode } from "./hero/useHeroPerformanceMode";

const primaryLinks = [
  {
    label: "Properties",
    href: "/properties",
    description: "Browse available homes and spaces.",
  },
  {
    label: "About",
    href: "/about",
    description: "Meet the standard behind the brand.",
  },
  {
    label: "Services",
    href: "/services",
    description: "See how we support property moves.",
  },
  {
    label: "Contact",
    href: "/contact",
    description: "Start a real property conversation.",
  },
];

const propertyLinks = [
  { label: "Buy", href: "/properties?type=sale" },
  { label: "Rent", href: "/properties?type=rent" },
  { label: "Sell", href: "/user/add-property" },
];

const NAV_HEIGHT_MOBILE = 96;
const NAV_HEIGHT_DESKTOP = 112;
const SM_BREAKPOINT = 640;
const NAV_SOLID_ENTER_Y = 40;
const NAV_SOLID_EXIT_Y = 12;
const LOGO_HANDOFF_MS = 160;
type HomeLogoOwner = "hero" | "transitioning" | "navbar";

const getUserInitials = (name?: string | null) => {
  if (!name) return "U";

  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "U";

  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
};

type NavbarProps = {
  initialUser?: User;
};

const Navbar = ({ initialUser }: NavbarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: user, isLoading } = useUser(initialUser);
  const { isMounted: isHeroPerformanceMounted } = useHeroPerformanceMode();
  const accountMenuRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [homeLogoOwner, setHomeLogoOwner] = useState<HomeLogoOwner>("hero");

  useEffect(() => {
    if (!user) setIsAccountOpen(false);
  }, [user]);

  useEffect(() => {
    if (!isAccountOpen) return;

    const closeOnOutsidePointer = (event: PointerEvent) => {
      const target = event.target;
      if (
        target instanceof Node &&
        accountMenuRef.current?.contains(target)
      ) {
        return;
      }

      setIsAccountOpen(false);
    };

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsAccountOpen(false);
    };

    document.addEventListener("pointerdown", closeOnOutsidePointer);
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePointer);
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isAccountOpen]);

  useEffect(() => {
    const syncNavHeight = () => {
      const height =
        window.innerWidth >= SM_BREAKPOINT
          ? NAV_HEIGHT_DESKTOP
          : NAV_HEIGHT_MOBILE;

      document.documentElement.style.setProperty(
        "--site-nav-height",
        `${height}px`,
      );
    };

    syncNavHeight();
    window.addEventListener("resize", syncNavHeight);
    return () => window.removeEventListener("resize", syncNavHeight);
  }, []);

  useEffect(() => {
    let frameId: number | null = null;

    const updateScrolledState = () => {
      frameId = null;

      setHasScrolled((current) => {
        const scrollY = Math.max(0, window.scrollY || window.pageYOffset || 0);

        if (current) return scrollY > NAV_SOLID_EXIT_Y;
        return scrollY > NAV_SOLID_ENTER_Y;
      });
    };

    const scheduleUpdate = () => {
      if (frameId !== null) return;
      frameId = window.requestAnimationFrame(updateScrolledState);
    };

    scheduleUpdate();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });

    return () => {
      if (frameId !== null) window.cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", scheduleUpdate);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const scrollY = Math.max(0, window.scrollY || window.pageYOffset || 0);
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    const originalBodyOverflow = document.body.style.overflow;
    const originalBodyPosition = document.body.style.position;
    const originalBodyTop = document.body.style.top;
    const originalBodyWidth = document.body.style.width;
    const originalBodyPaddingRight = document.body.style.paddingRight;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalHtmlOverscrollBehavior =
      document.documentElement.style.overscrollBehavior;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.overscrollBehavior = "none";
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    window.addEventListener("keydown", closeOnEscape);

    return () => {
      window.removeEventListener("keydown", closeOnEscape);
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.documentElement.style.overscrollBehavior =
        originalHtmlOverscrollBehavior;
      document.body.style.overflow = originalBodyOverflow;
      document.body.style.position = originalBodyPosition;
      document.body.style.top = originalBodyTop;
      document.body.style.width = originalBodyWidth;
      document.body.style.paddingRight = originalBodyPaddingRight;
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  const isHomePage = pathname === "/";
  const closeMenu = () => {
    setIsOpen(false);
    setIsAccountOpen(false);
  };
  const isSolid = hasScrolled || isOpen;
  const shouldUseScrollLogo = isHomePage && isHeroPerformanceMounted;
  const shouldUseStaticLogoHandoff =
    isHomePage && isHeroPerformanceMounted && !shouldUseScrollLogo;
  const targetHomeLogoOwner: HomeLogoOwner =
    shouldUseStaticLogoHandoff && isSolid ? "navbar" : "hero";
  const showStaticNavLogo = isHomePage
    ? shouldUseScrollLogo
      ? isOpen
      : homeLogoOwner === "navbar"
    : isSolid;
  const showHandoffNavLogo =
    isHomePage && !shouldUseScrollLogo && homeLogoOwner === "transitioning";
  const shouldShowAuthControl = !isLoading;
  const userInitials = getUserInitials(user?.name);

  useEffect(() => {
    if (!shouldUseStaticLogoHandoff) {
      setHomeLogoOwner("hero");
      return;
    }

    let timeoutId: number | null = null;

    setHomeLogoOwner((current) => {
      if (current === targetHomeLogoOwner) return current;

      timeoutId = window.setTimeout(() => {
        setHomeLogoOwner(targetHomeLogoOwner);
      }, LOGO_HANDOFF_MS);

      return "transitioning";
    });

    return () => {
      if (timeoutId !== null) window.clearTimeout(timeoutId);
    };
  }, [shouldUseStaticLogoHandoff, targetHomeLogoOwner]);

  useLayoutEffect(() => {
    if (!isHomePage || shouldUseScrollLogo) {
      delete document.documentElement.dataset.homeLogoOwner;
      return;
    }

    document.documentElement.dataset.homeLogoOwner = homeLogoOwner;

    return () => {
      delete document.documentElement.dataset.homeLogoOwner;
    };
  }, [homeLogoOwner, isHomePage, shouldUseScrollLogo]);

  const handleLogout = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/signout`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        toast.error("Logout failed");
        return;
      }

      queryClient.clear();
      toast.success("Logged out");
      setIsOpen(false);
      setIsAccountOpen(false);
      router.replace("/");
    } catch {
      toast.error("Logout failed");
    }
  };

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-transparent">
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 bg-[rgba(247,243,234,0.84)] backdrop-blur-none transition-opacity duration-150 ease-out dark:bg-[var(--ek-dark-nav)] sm:backdrop-blur-sm lg:backdrop-blur-md ${
          isSolid ? "opacity-100" : "opacity-0"
        }`}
      />
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 bottom-0 h-px bg-[rgba(154,106,0,0.12)] transition-opacity duration-150 ease-out dark:bg-[rgba(229,184,62,0.10)] ${
          isSolid ? "opacity-100" : "opacity-0"
        }`}
      />
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 shadow-[0_10px_30px_rgba(15,23,42,0.08)] transition-opacity duration-150 ease-out dark:shadow-[0_10px_30px_rgba(0,0,0,0.22)] ${
          isSolid ? "opacity-100" : "opacity-0"
        }`}
      />
      {shouldUseScrollLogo ? <ScrollLogoTransition isMenuOpen={isOpen} /> : null}

      <div className="relative z-50 mx-auto flex h-24 w-full max-w-7xl items-center justify-between px-5 sm:h-28 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex min-w-0 shrink-0 items-center rounded-lg focus:outline-none focus-visible:outline-none"
          onClick={closeMenu}
          aria-label="Go to Ekpratishat home"
        >
          <span
            data-logo-slot="navbar"
            className="relative block h-14 w-20 sm:h-16 sm:w-24 lg:h-[4.5rem] lg:w-28 xl:h-20 xl:w-32"
            aria-hidden="true"
          >
            <Image
              src={HERO_LOGO_SRC}
              alt=""
              fill
              sizes={NAV_LOGO_SIZES}
              className={`object-contain transition-opacity ease-out ${
                showStaticNavLogo ? "opacity-100 duration-150" : "opacity-0 duration-100"
              }`}
              priority
              unoptimized
            />
            <Image
              src={HERO_LOGO_SRC}
              alt=""
              fill
              sizes={NAV_LOGO_SIZES}
              className={`object-contain transition-opacity ease-out ${
                showHandoffNavLogo
                  ? "opacity-100 duration-100"
                  : "opacity-0 delay-100 duration-100"
              }`}
              priority
              unoptimized
            />
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/user/add-property"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gold-gradient text-[#100d08] shadow-lg shadow-gold-800/15 transition hover:bg-gold-gradient-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:h-auto sm:w-auto sm:px-4 sm:py-3 lg:px-5"
            onClick={closeMenu}
            aria-label="List your property"
          >
            <HousePlus className="h-5 w-5 sm:hidden" aria-hidden="true" />
            <span className="hidden text-xs font-bold uppercase tracking-[0.18em] sm:inline lg:hidden">
              List
            </span>
            <span className="hidden text-xs font-bold uppercase tracking-[0.18em] lg:inline">
              List Property
            </span>
          </Link>

          <div ref={accountMenuRef} className="relative">
            {shouldShowAuthControl ? (
              user ? (
                <>
                  <button
                    type="button"
                    aria-expanded={isAccountOpen}
                    aria-controls="account-menu"
                    aria-label="Open account menu"
                    className="inline-flex h-10 items-center gap-2 rounded-lg border border-[rgba(154,106,0,0.18)] bg-[rgba(255,253,248,0.9)] px-1.5 pr-2 text-secondary-950 shadow-lg shadow-black/10 transition-colors hover:border-[var(--ek-border-strong)] hover:bg-[rgba(255,253,248,0.98)] focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 dark:border-white/[0.12] dark:bg-white/[0.045] dark:text-[var(--ek-dark-text)] dark:hover:border-[rgba(229,184,62,0.22)] dark:hover:bg-white/[0.075] sm:pr-3"
                    onClick={() => {
                      setIsOpen(false);
                      setIsAccountOpen((current) => !current);
                    }}
                  >
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-gold-gradient text-xs font-black uppercase tracking-[0.03em] text-[#100d08] shadow-sm shadow-gold-800/15">
                      {userInitials}
                    </span>
                    <ChevronDown
                      className={`hidden h-4 w-4 text-secondary-600 transition-transform dark:text-[var(--ek-dark-muted)] sm:block ${
                        isAccountOpen ? "rotate-180" : ""
                      }`}
                      aria-hidden="true"
                    />
                  </button>

                  <div
                    id="account-menu"
                    className={`absolute right-0 top-full z-[70] mt-3 w-64 overflow-hidden rounded-xl border border-[#e5d8c7] bg-[rgba(255,253,248,0.98)] text-secondary-950 shadow-[0_24px_70px_-34px_rgba(15,23,42,0.42)] transition-[opacity,transform,visibility] duration-150 ease-out dark:border-[var(--ek-dark-border)] dark:bg-[var(--ek-dark-card)] dark:text-[var(--ek-dark-text)] dark:shadow-[0_24px_70px_-34px_rgba(0,0,0,0.72)] ${
                      isAccountOpen
                        ? "visible translate-y-0 opacity-100"
                        : "invisible -translate-y-2 opacity-0"
                    }`}
                  >
                    <div className="border-b border-[#e5d8c7] px-4 py-3 dark:border-[var(--ek-dark-border)]">
                      <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-secondary-500 dark:text-[var(--ek-dark-muted)]">
                        Account
                      </p>
                      <p className="mt-1 truncate text-sm font-bold text-secondary-950 dark:text-[var(--ek-dark-text)]">
                        {user.name}
                      </p>
                    </div>

                    <div className="py-2">
                      <Link
                        href="/user/my-listings"
                        className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-secondary-700 transition hover:bg-[#f8f1e3] hover:text-secondary-950 focus:outline-none focus-visible:bg-[#f8f1e3] dark:text-[var(--ek-dark-secondary)] dark:hover:bg-[rgba(229,184,62,0.10)] dark:hover:text-[var(--ek-dark-text)]"
                        onClick={() => setIsAccountOpen(false)}
                      >
                        <Home className="h-4 w-4" aria-hidden="true" />
                        My Listings
                      </Link>
                      <Link
                        href="/user/my-favourites"
                        className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-secondary-700 transition hover:bg-[#f8f1e3] hover:text-secondary-950 focus:outline-none focus-visible:bg-[#f8f1e3] dark:text-[var(--ek-dark-secondary)] dark:hover:bg-[rgba(229,184,62,0.10)] dark:hover:text-[var(--ek-dark-text)]"
                        onClick={() => setIsAccountOpen(false)}
                      >
                        <Heart className="h-4 w-4" aria-hidden="true" />
                        My Favourites
                      </Link>
                    </div>

                    <div className="border-t border-[#e5d8c7] p-2 dark:border-[var(--ek-dark-border)]">
                      <button
                        type="button"
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 focus:outline-none focus-visible:bg-red-50 dark:text-red-200 dark:hover:bg-red-500/10"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-4 w-4" aria-hidden="true" />
                        Logout
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <Link
                  href="/auth/signin"
                  className="inline-flex h-10 w-10 items-center justify-center gap-2 rounded-lg border border-[rgba(154,106,0,0.18)] bg-[rgba(255,253,248,0.9)] text-secondary-950 shadow-lg shadow-black/10 transition-colors hover:border-[var(--ek-border-strong)] hover:bg-[rgba(255,253,248,0.98)] focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 dark:border-white/[0.12] dark:bg-white/[0.045] dark:text-[var(--ek-dark-text)] dark:hover:border-[rgba(229,184,62,0.22)] dark:hover:bg-white/[0.075] sm:w-auto sm:px-4"
                  onClick={() => {
                    setIsOpen(false);
                    setIsAccountOpen(false);
                  }}
                  aria-label="Sign in"
                >
                  <UserRound className="h-4 w-4" aria-hidden="true" />
                  <span className="hidden text-xs font-bold uppercase tracking-[0.16em] sm:inline">
                    Sign In
                  </span>
                </Link>
              )
            ) : (
              <button
                type="button"
                className="inline-flex h-10 w-10 cursor-default items-center justify-center gap-2 rounded-lg border border-[rgba(154,106,0,0.16)] bg-[rgba(255,253,248,0.72)] text-secondary-500 shadow-lg shadow-black/5 transition-none dark:border-white/[0.10] dark:bg-white/[0.035] dark:text-[var(--ek-dark-muted)] sm:w-auto sm:px-4"
                aria-label="Checking account status"
                disabled
              >
                <UserRound className="h-4 w-4" aria-hidden="true" />
                <span className="hidden text-xs font-bold uppercase tracking-[0.16em] sm:inline">
                  Account
                </span>
              </button>
            )}
          </div>

          <div className="hidden sm:block">
            <ToggleTheme />
          </div>

          <button
            type="button"
            aria-expanded={isOpen}
            aria-controls="site-menu-panel"
            className={`inline-flex min-h-11 items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] shadow-lg shadow-black/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 sm:px-4 ${
              isSolid
                ? "border border-[rgba(154,106,0,0.18)] bg-[rgba(255,253,248,0.9)] text-secondary-950 hover:border-[var(--ek-border-strong)] hover:bg-[rgba(255,253,248,0.98)] dark:border-white/[0.12] dark:bg-white/[0.045] dark:text-[var(--ek-dark-text)] dark:hover:border-[rgba(229,184,62,0.22)] dark:hover:bg-white/[0.075]"
                : "border border-[rgba(154,106,0,0.16)] bg-[rgba(255,253,248,0.78)] text-secondary-950 hover:border-[var(--ek-border-strong)] hover:bg-[rgba(255,253,248,0.94)] dark:border-white/[0.12] dark:bg-white/[0.045] dark:text-[var(--ek-dark-text)] dark:hover:border-[rgba(229,184,62,0.22)] dark:hover:bg-white/[0.075]"
            }`}
            onClick={() => {
              setIsAccountOpen(false);
              setIsOpen((current) => !current);
            }}
          >
            <span className="hidden sm:inline">
              {isOpen ? "Close" : "Menu"}
            </span>
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div
        id="site-menu-panel"
        aria-hidden={!isOpen}
        className={`fixed inset-x-0 top-[var(--site-nav-height)] z-40 overflow-y-auto border-b border-white/45 bg-[#f8f5ef] px-5 pt-5 shadow-2xl shadow-secondary-900/10 backdrop-blur-none transition-[opacity,transform,visibility] duration-300 ease-out dark:border-[rgba(229,184,62,0.10)] dark:bg-[rgba(23,21,18,0.92)] dark:shadow-black/40 sm:px-6 sm:pt-6 sm:backdrop-blur-sm lg:px-8 lg:backdrop-blur-md ${
          isOpen
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-6 opacity-0"
        }`}
        style={{
          maxHeight: "calc(100dvh - var(--site-nav-height))",
          paddingBottom: "max(2rem, env(safe-area-inset-bottom))",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_0%,rgba(229,184,62,0.10),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.045),transparent_48%)] opacity-0 dark:opacity-100" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[#dfd2c0] dark:bg-[var(--ek-dark-border-strong)]" />

        <div className="relative mx-auto w-full max-w-7xl">
          <div className="mb-6 flex flex-col gap-4 border-b border-[#dfd2c0] pb-6 dark:border-[var(--ek-dark-border)] sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.32em] text-gold-700">
                Navigation
              </p>
              <p className="mt-3 text-2xl font-black tracking-tight text-secondary-950 dark:text-[var(--ek-dark-text)] sm:text-4xl">
                Choose your path.
              </p>
            </div>
            <p className="max-w-sm text-sm font-medium leading-6 text-secondary-600 dark:text-[var(--ek-dark-muted)]">
              Find, list, or talk with the team without losing the premium calm.
            </p>
          </div>

          <div className="grid min-h-0 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(300px,0.42fr)] lg:items-start">
            <div className="grid min-h-0 gap-2">
              {primaryLinks.map((item, index) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="group relative overflow-hidden rounded-lg border border-transparent px-2 py-4 text-secondary-950 transition hover:border-white/60 hover:bg-white/45 hover:shadow-[0_20px_70px_-48px_rgba(15,23,42,0.45)] focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 dark:text-[var(--ek-dark-text)] dark:hover:border-[var(--ek-dark-border)] dark:hover:bg-[rgba(40,35,26,0.80)] sm:px-5 sm:py-5"
                  onClick={closeMenu}
                >
                  <span className="absolute inset-y-4 left-0 w-[3px] origin-top scale-y-0 bg-gold-gradient transition duration-300 group-hover:scale-y-100" />

                  <span className="flex items-center justify-between gap-4">
                    <span className="flex min-w-0 items-baseline gap-3 sm:gap-4">
                      <span className="font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-gold-700">
                        0{index + 1}
                      </span>
                      <span className="truncate text-2xl font-black tracking-tight min-[360px]:text-3xl sm:text-5xl">
                        {item.label}
                      </span>
                    </span>

                    <ArrowUpRight className="h-4 w-4 flex-none text-secondary-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold-700 sm:h-5 sm:w-5" />
                  </span>

                  <span className="mt-2 block pl-[2.8rem] text-sm font-medium text-secondary-500 transition group-hover:text-secondary-700 dark:text-[var(--ek-dark-soft)] dark:group-hover:text-[var(--ek-dark-muted)] sm:pl-[3.6rem]">
                    {item.description}
                  </span>
                </Link>
              ))}
            </div>

            <div className="relative overflow-hidden rounded-lg border border-white/65 bg-white/70 p-5 text-secondary-950 shadow-[0_24px_90px_-58px_rgba(15,23,42,0.55)] backdrop-blur-md dark:border-[rgba(229,184,62,0.22)] dark:bg-[linear-gradient(160deg,rgba(40,35,26,0.98),rgba(29,26,22,0.96))] dark:text-[var(--ek-dark-text)] dark:shadow-[0_28px_90px_-52px_rgba(0,0,0,0.72)] sm:p-6">
              <div className="absolute inset-x-0 top-0 h-1 bg-gold-gradient" />

              <p className="text-xs font-bold uppercase tracking-[0.3em] text-secondary-500 dark:text-[var(--ek-dark-gold)]">
                Property Pathways
              </p>
              <h2 className="mt-3 text-2xl font-black leading-tight tracking-tight text-secondary-950 dark:text-[var(--ek-dark-text)]">
                Buy, rent, or list with clarity.
              </h2>

              <div className="mt-6 grid grid-cols-3 gap-2">
                {propertyLinks.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="group rounded-lg border border-white/65 bg-white/60 px-3 py-4 text-center text-sm font-black uppercase tracking-[0.16em] text-secondary-900 transition hover:border-gold-500/70 hover:bg-white/85 hover:text-gold-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 dark:border-[var(--ek-dark-border)] dark:bg-[rgba(247,241,227,0.08)] dark:text-[var(--ek-dark-text)] dark:hover:border-[var(--ek-dark-border-strong)] dark:hover:bg-[rgba(229,184,62,0.14)] dark:hover:text-[var(--ek-dark-text)]"
                    onClick={closeMenu}
                  >
                    <span>{item.label}</span>
                    <span className="mx-auto mt-2 block h-px w-5 bg-gold-500 transition group-hover:w-8" />
                  </Link>
                ))}
              </div>

              <div className="mt-5 border-t border-[#e5d8c7] pt-5 dark:border-[var(--ek-dark-border)] sm:hidden">
                <ToggleTheme />
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
