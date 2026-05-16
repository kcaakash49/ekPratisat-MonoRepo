import type { Metadata } from "next";

import "./globals.css";
import { ClientProvider } from "./clientProvider";
import { Toaster } from "sonner";
import Script from "next/script";

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
