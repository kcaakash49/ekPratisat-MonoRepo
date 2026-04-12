import type { Metadata } from "next";

import "./globals.css";
import { ClientProvider } from "./clientProvider";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "EkPratishat Real Estate",
  description: "Buy, sell, and rent premium properties with 1% commission. The most trusted real estate marketplace for luxury homes, land, and commercial spaces.",
};

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
          <Toaster richColors position="top-center" duration={1500}/>
        </ClientProvider>
      </body>
    </html>
  );
}
