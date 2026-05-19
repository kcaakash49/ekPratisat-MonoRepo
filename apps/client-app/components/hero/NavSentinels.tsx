/**
 * NavSentinels — two invisible 1×1 px markers that anchor the navbar's
 * dock/undock IntersectionObserver (see Navbar.tsx → navbar-bg /
 * data-docked effect). One sentinel sits 40px below the document top,
 * the other at 12px. As the user scrolls past each, the observer flips
 * its corresponding flag — the asymmetric thresholds give the same
 * enter/exit feel as the legacy 40/12 scroll listener without per-frame
 * JS during scroll.
 *
 * Positioning is `absolute`, so this MUST be rendered inside an element
 * with `position: relative` (today: the HeroSection outer div). The
 * sentinels then land at exactly document Y 40px / 12px regardless of
 * body styling. Tiny, invisible, never intercept pointer events.
 *
 * Pure server component (no interactivity, no hooks). Cut verbatim from
 * HeroSection during the homepage refactor — see SectionHeader.tsx for
 * the parallel extraction story.
 */
export default function NavSentinels() {
  return (
    <>
      <div
        data-nav-sentinel="enter"
        aria-hidden="true"
        className="pointer-events-none absolute left-0 h-px w-px"
        style={{ top: "40px" }}
      />
      <div
        data-nav-sentinel="exit"
        aria-hidden="true"
        className="pointer-events-none absolute left-0 h-px w-px"
        style={{ top: "12px" }}
      />
    </>
  );
}
