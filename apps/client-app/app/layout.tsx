import type { Metadata } from "next";
import { Ubuntu, Ubuntu_Mono } from "next/font/google";
import localFont from "next/font/local";

import "./globals.css";
import { ClientProvider } from "./clientProvider";
import { Toaster } from "sonner";
import Script from "next/script";
import { PERF_DETECT_SCRIPT } from "@repo/perf-detection";

/*
  Self-hosted brand fonts (shipped with the build via next/font, so every
  device renders identically instead of falling back to its own system font).
  This pins the exact typefaces the UI was built and tuned against:

    --font-sans        Ubuntu      — body + headings (the whole Latin UI)
    --font-mono        Ubuntu Mono — uppercase eyebrow labels (font-mono)
    --font-devanagari  Lohit       — Nepali (Devanagari) glyphs

  Ubuntu ships only 300/400/500/700; the design's 600/800/900 weight-match
  down to 700 exactly as the prior system-font rendering did, so the heavy
  headings (font-black/extrabold) and the hero metrics do not shift.
*/
const fontSans = Ubuntu({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-sans",
  display: "swap",
});
const fontMono = Ubuntu_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
  display: "swap",
});
// Lohit is not on Google Fonts, so it's self-hosted from app/fonts/.
const fontDevanagari = localFont({
  src: "./fonts/Lohit-Devanagari.ttf",
  weight: "400",
  variable: "--font-devanagari",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "EkPratishat Real Estate",
    template: "%s | EkPratishat"
  },
  verification: {
    other: {
      "trustpilot-one-time-domain-verification-id":
        "40841453-68cb-47da-b044-5fc7a9af9f80",
    },
  },
  description: "EK PRATISHAT Real Estate Pvt. Ltd is a trusted real estate agency in Kathmandu, Nepal for buying, selling, renting, and leasing properties. We provide complete real estate services including property management, valuation, appraisal, legal documentation, deal closing, interior design, and property development. Find residential, commercial, and investment properties across Nepal with our secure and reliable digital platform.",
  keywords: ["Real Estate Nepal", "Property Listing", "Buy House Nepal","Luxury Homes", "Rent rooms", "Rent flat"],
  authors: [{ name: "EkPratishat Team" }],
  creator: "EkPratishat",
  openGraph: {
    title: "EkPratishat Real Estate",
    description: "EK PRATISHAT Real Estate Pvt. Ltd is a trusted real estate agency in Kathmandu, Nepal for buying, selling, renting, and leasing properties. We provide complete real estate services including property management, valuation, appraisal, legal documentation, deal closing, interior design, and property development. Find residential, commercial, and investment properties across Nepal with our secure and reliable digital platform.",
    url: "https://ekpratishat.com",
    siteName: "EkPratishat",
    images: [
      {
        url: "/ogMedia.png",
        width: 1200,
        height: 630,
        alt: "Ek Pratishat Real Estate",
      },
    ],
    locale: "en_NP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EkPratishat Real Estate",
    description: "EK PRATISHAT Real Estate Pvt. Ltd is a trusted real estate agency in Kathmandu, Nepal for buying, selling, renting, and leasing properties. We provide complete real estate services including property management, valuation, appraisal, legal documentation, deal closing, interior design, and property development. Find residential, commercial, and investment properties across Nepal with our secure and reliable digital platform.",
    images: ["/ogMedia.png"],
  },
};
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fontSans.variable} ${fontMono.variable} ${fontDevanagari.variable}`}
      suppressHydrationWarning
    >
      <body>
        {/*
          Pre-paint performance detection. Runs synchronously in <head>
          before React hydrates, so [data-perf-tier] is already set on
          <html> by the time CSS resolves and components mount. See
          packages/perf-detection/ARCHITECTURE.md for the full data flow.
        */}
        <Script id="perf-detect" strategy="beforeInteractive">
          {PERF_DETECT_SCRIPT}
        </Script>
        {/*
          Snapshot window.innerHeight into --viewport-h BEFORE paint, then
          GROW-ONLY as the visual viewport expands. iOS Safari + Brave on
          iPad collapse the URL bar on scroll, which both grows the
          viewport AND (on Brave) makes 100svh non-stable. Strategy:

            - Initial load: --viewport-h = innerHeight. Hero fills the
              currently visible area perfectly (URL bar shown).
            - On scroll, URL bar collapses; visualViewport.resize fires
              with a larger height. We update --viewport-h ONCE to that
              larger value. Hero grows to fill the new viewport.
            - On scroll back to top, URL bar reappears; visualViewport
              shrinks. We do NOT shrink --viewport-h. Hero is now taller
              than visible — the extra extends under the URL bar, which
              is fine (no reframe, no gap, no visible change).
            - Result: bg-video reframes at most ONCE per session (during
              the first scroll-down), then is stable forever.
            - On orientation change, we reset and re-baseline.
        */}
        <Script id="viewport-h" strategy="beforeInteractive">
          {`(function(){
            try {
              var html = document.documentElement;
              var maxH = 0;
              var setH = function(h){
                if (typeof h !== 'number' || !isFinite(h) || h <= maxH) return;
                maxH = h;
                html.style.setProperty('--viewport-h', h + 'px');
              };
              setH(window.innerHeight);
              if (window.visualViewport) {
                window.visualViewport.addEventListener('resize', function(){
                  setH(window.visualViewport.height);
                });
              }
              window.addEventListener('orientationchange', function(){
                setTimeout(function(){
                  maxH = 0;
                  setH(window.innerHeight);
                }, 200);
              });
            } catch(e){}
          })();`}
        </Script>
        <ClientProvider>
          {children}
          <Toaster richColors position="top-center" duration={1500} />
        </ClientProvider>
        {
          GA_ID && (
            <>
              <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
                strategy="afterInteractive"
              />

              <Script id="google-analytics" strategy="afterInteractive">
                {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}
              </Script>

            </>
          )
        }
      </body>
    </html>
  );
}
