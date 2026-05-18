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
          DEBUG: eruda mobile console. Inert unless the URL contains
          ?debug=1, so safe to leave in for now — costs zero bytes
          to real users (only the tiny gate script runs and exits).
          Remove this <Script> block before final production launch.
        */}
        <Script id="eruda-debug" strategy="afterInteractive">
          {`(function(){
            try {
              if (!/[?&]debug=1(?:&|$)/.test(window.location.search)) return;
              var s = document.createElement('script');
              s.src = 'https://cdn.jsdelivr.net/npm/eruda';
              s.onload = function(){ window.eruda && window.eruda.init(); };
              document.body.appendChild(s);
            } catch(_){}
          })();`}
        </Script>
        {/*
          DEBUG: on-screen perf pill. Same ?debug=1 gate. Shows the
          three values we care about, live, no console typing needed.
          Remove this block with the eruda block before production.
        */}
        <Script id="perf-pill-debug" strategy="afterInteractive">
          {`(function(){
            try {
              if (!/[?&]debug=1(?:&|$)/.test(window.location.search)) return;
              var html = document.documentElement;
              var pill = document.createElement('div');
              pill.id = '__perf_pill__';
              pill.style.cssText = [
                'position:fixed','left:8px','bottom:8px','z-index:2147483647',
                'background:rgba(0,0,0,0.85)','color:#fff','font:600 11px/1.3 ui-monospace,monospace',
                'padding:8px 10px','border-radius:8px','pointer-events:none',
                'box-shadow:0 2px 8px rgba(0,0,0,0.3)','max-width:60vw','white-space:pre'
              ].join(';');
              var render = function(){
                pill.textContent =
                  'tier:    ' + (html.dataset.perfTier || '?') + '\\n' +
                  'reason:  ' + (html.dataset.perfReason || '?') + '\\n' +
                  'docked:  ' + (html.dataset.docked || 'false') + '\\n' +
                  'engine:  ' + (html.dataset.browserEngine || '?') + '\\n' +
                  'scrollT: ' + (html.dataset.scrollTimeline || '?');
              };
              render();
              document.body.appendChild(pill);
              var mo = new MutationObserver(render);
              mo.observe(html, { attributes: true });
            } catch(_){}
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
