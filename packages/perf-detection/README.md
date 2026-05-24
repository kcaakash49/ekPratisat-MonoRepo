# @repo/perf-detection

Capability-tiered animation system for the ekPratishat monorepo. Detects
device performance class **before paint**, exposes the result as
attributes on `<html>` plus a React hook, and ships compositor-only
CSS for the cross-fade logo handoff used on the balanced and lite tiers.

> For the full design rationale, data-flow diagram, decision rules,
> and contribution discipline, read [`ARCHITECTURE.md`](./ARCHITECTURE.md).

---

## Tiers

| Tier       | Design language        | Audience                                       |
| ---------- | ---------------------- | ---------------------------------------------- |
| `full`     | **Cinematic premium**  | Capable non-iOS devices (desktop, modern       |
|            |                        | Android: Chrome / Brave / Edge / Samsung / FF) |
| `balanced` | **Editorial premium**  | All iOS WebKit (any iPhone, any iPad, any iOS),|
|            |                        | mid-range Android hardware                     |
| `lite`     | **Clean premium**      | Reduced-motion, save-data, very weak hardware  |

Three tiers, locked. Every tier must feel premium — never a fallback.

---

## Quick wiring (3 steps per app)

### 1. Inject the inline script in `app/layout.tsx`

```tsx
import Script from "next/script";
import { PERF_DETECT_SCRIPT } from "@repo/perf-detection";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Script id="perf-detect" strategy="beforeInteractive">
          {PERF_DETECT_SCRIPT}
        </Script>
        {children}
      </body>
    </html>
  );
}
```

### 2. Import the CSS at your CSS entry point

```css
/* apps/<your-app>/app/globals.css */
@import "@repo/perf-detection/perf-mode.css";
```

### 3. Read tier from any client component

```tsx
"use client";
import { usePerfTier } from "@repo/perf-detection";

export function HeroAnimation() {
  const { tier, isMounted } = usePerfTier();
  if (!isMounted) return null;
  return tier === "full" ? <CinematicLogo /> : <EditorialLogo />;
}
```

---

## What you get on `<html>` (set before paint)

```html
<html
  data-perf-tier="full"
  data-scroll-timeline="false"
  data-reduce-motion="false"
  data-apple-webkit="false"
  data-perf-reason="capable"
  data-browser-engine="blink"
>
```

Use these in CSS for visual differences (no React state needed):

```css
html[data-perf-tier="full"] .my-thing { animation-duration: 0.8s; }
html[data-perf-tier="balanced"] .my-thing { animation-duration: 0.4s; }
```

---

## Test from devtools (any device)

On any local host (`localhost`, `127.0.0.1`, LAN IPs), force a tier:

```js
localStorage.setItem("ekPerfTier", "balanced");
location.reload();
```

The legacy key `ekHeroPerformanceMode` is also honored.

To find out *why* a device got the tier it did:

```js
document.documentElement.dataset.perfReason
// "ipad" | "iphone" | "very-low-hw" | "mid-hw" |
// "reduced-motion" | "save-data" | "capable" | "override"
```

---

## Discipline rules

- **Don't add a fourth tier.** Three is the locked sweet spot.
- **Don't add a signal that doesn't change a CSS branch or tier decision.**
  Detection is a contract, not a debug log.
- **Don't make the fallback feel cheap.** Every tier ships premium.
- **Don't downgrade by browser brand.** Use capability and known
  structural quirks (iPad WebKit, old iOS) — not vendor allowlists.

---

## File map

```
packages/perf-detection/
├── package.json
├── README.md              ← you are here
├── ARCHITECTURE.md        ← detailed workflow + design principles + decision rules
└── src/
    ├── index.ts           ← barrel export
    ├── types.ts           ← PerfTier, PerfState, PerfReason, BrowserEngine, attribute names
    ├── inline-script.ts   ← pre-paint detection (string)
    ├── use-perf-tier.ts   ← React hook (reactive reader)
    └── perf-mode.css      ← cross-fade easing helpers, attribute-keyed rules
```
