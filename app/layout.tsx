import type { Metadata, Viewport } from "next";
import { Orbitron, Rajdhani, Space_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

// Configure your 3 fonts
const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron"
});

const rajdhani = Rajdhani({
  weight: ["300", "400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-rajdhani"
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono"
});

// Viewport settings for perfect mobile scaling
export const viewport: Viewport = {
  themeColor: "#060810",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

// Advanced SEO Metadata (For Google, WhatsApp, Facebook, Telegram)
export const metadata: Metadata = {
  title: "DTBOSS MOD APK HUB - Download Premium Hacks",
  description: "Download Premium Mod APKs, Casino Hacks, and Colour Prediction Tools for Free. 100% Secure & Verified Algorithms.",
  keywords: "mod apk, apk download, premium apps free, best apk hub, android apps, colour prediction hack, wingo hack, casino mod apk",
  openGraph: {
    title: "DTBOSS MOD APK HUB - Premium Hacks",
    description: "Download Premium Mod APKs, Casino Hacks, and Colour Prediction Tools for Free.",
    url: "https://dtboss.sbs", // Change this to your real domain later
    siteName: "DTBOSS",
    images: [
      {
        url: "https://i.ibb.co/C3MnW05j/Logo.jpg",
        width: 800,
        height: 600,
        alt: "DTBOSS Premium Hacks",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DTBOSS MOD APK HUB - Premium Hacks",
    description: "Download Premium Mod APKs, Casino Hacks, and Colour Prediction Tools for Free.",
    images: ["https://i.ibb.co/C3MnW05j/Logo.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Your exact Meta Pixel ID
  const META_PIXEL_ID = "1258097689637106";

  return (
    <html lang="en">
      <head>
        {/* META PIXEL SCRIPT - Optimized for Next.js */}
        <Script
          id="meta-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${META_PIXEL_ID}');
              fbq('track', 'PageView');
            `,
          }}
        />
      </head>
      <body className={`${rajdhani.className} ${orbitron.variable} ${rajdhani.variable} ${spaceMono.variable} antialiased`}>

        {/* FALLBACK PIXEL FOR USERS WITH JAVASCRIPT DISABLED */}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>

        {children}
      </body>
    </html>
  );
}