import type { Metadata } from "next";

import "./globals.css";
import { ClientProvider } from "./clientProvider";
import { Toaster } from "sonner";
import Script from "next/script";

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
