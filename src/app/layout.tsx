import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/Navigation/Navbar";
import { Footer } from "@/components/Navigation/Footer";
import { Auralis } from "@/components/ui/auralis";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#F6F3EC",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://aegistak.com"),
  title: "Aegis — Staking on Robinhood Chain",
  description: "Aegis is a staking protocol built on Robinhood Chain. Stake, flow, grow, and earn.",
  keywords: ["Aegis", "Robinhood Chain", "Staking", "DeFi", "Web3", "Ethereum", "EVM"],
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon.png", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Aegis — Staking on Robinhood Chain",
    description: "Aegis is a staking protocol built on Robinhood Chain. Stake, flow, grow, and earn.",
    url: "https://aegistak.com",
    siteName: "Aegis Protocol",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Aegis Protocol — Robinhood Chain",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aegis — Staking on Robinhood Chain",
    description: "Aegis is a staking protocol built on Robinhood Chain. Stake, flow, grow, and earn.",
    creator: "@aegistak",
    site: "@aegistak",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon-32x32.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Unbounded:wght@600;700;800;900&family=Syne:wght@700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#F6F3EC] text-[#1C1B18] antialiased selection:bg-[#1C1B18] selection:text-[#F6F3EC] min-h-screen flex flex-col relative overflow-x-hidden">
        {/* Warm Paper Atmospheric Background Grain & Glow */}
        <div className="fixed inset-0 pointer-events-none -z-20 overflow-hidden">
          <div className="absolute top-0 right-1/4 w-[600px] h-[500px] bg-[#EAE4D6]/60 blur-[160px] rounded-full" />
          <div className="absolute bottom-1/4 left-1/4 w-[700px] h-[600px] bg-[#E2DDD0]/50 blur-[170px] rounded-full" />
        </div>

        <Providers>
          <Navbar />
          <main className="flex-1 relative z-10">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
