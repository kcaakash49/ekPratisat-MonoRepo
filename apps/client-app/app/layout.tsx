import type { Metadata } from "next";

import "./globals.css";
import { ClientProvider } from "./clientProvider";
import { Toaster } from "sonner";
import Script from "next/script";
import { PERF_DETECT_SCRIPT } from "@repo/perf-detection";

export const metadata: Metadata = {
  title: {
    default: "Ek Pratishat | Premium Real Estate in Nepal",
    template: "%s | Ek Pratishat"
  },
  description: "Buy, sell, and rent premium properties with 1% commission. The most trusted real estate marketplace for luxury homes, land, and commercial spaces.",
  keywords: ["Real Estate Nepal", "Property Listing", "Buy House Nepal", "1 Percent Commission", "Luxury Homes", "Rent rooms", "Rent flat"],
  authors: [{ name: "Ek Pratishat Team" }],
  creator: "Ek Pratishat",
  openGraph: {
    title: "Ek Pratishat | Premium Real Estate",
    description: "Discover your dream property with just 1% commission. Transparent, reliable, and premium real estate services.",
    url: "https://ekpratishat.com",
    siteName: "Ek Pratishat",
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
    title: "Ek Pratishat | Real Estate",
    description: "Find your perfect home with Nepal's premium property marketplace.",
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
    <html lang="en" suppressHydrationWarning>
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
