import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BestMealMate - AI Meal Planning for Families",
  description: "Plan meals for your whole family in 2 minutes. AI-powered meal planning that handles Dad's keto, kid's allergies, and grandma's low-sodium - all in one plan.",
  keywords: ["meal planning", "family meals", "AI chef", "recipe planner", "grocery list", "nutrition tracking", "dietary restrictions"],
  authors: [{ name: "BestMealMate" }],
  creator: "BestMealMate",
  publisher: "BestMealMate",
  metadataBase: new URL("https://bestmealmate.vercel.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://bestmealmate.vercel.app",
    siteName: "BestMealMate",
    title: "BestMealMate - AI Meal Planning for Families",
    description: "Plan meals for your whole family in 2 minutes. Handle dietary restrictions, allergies, and preferences effortlessly.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BestMealMate - AI Meal Planning",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BestMealMate - AI Meal Planning for Families",
    description: "Plan meals for your whole family in 2 minutes with AI-powered recommendations.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google AdSense - exact format required for verification */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1194948930656889"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
