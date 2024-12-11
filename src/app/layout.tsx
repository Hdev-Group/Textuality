"use client";
import React from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { Inter as FontSans, Funnel_Sans, Roboto_Mono } from "next/font/google";
import ConvexClientProvider from "./ConvexClientProvider";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const Funnel_Sansfont = Funnel_Sans({
  subsets: ["latin"],
  variable: "--font-Funnel_Sansfont",
  weight: ["300", "400", "700"],
});
const roboto_mono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono',
})

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "";

if (!convexUrl) {
  throw new Error("Missing Convex URL. Check your environment variables.");
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY} dynamic>
      <ConvexProvider client={new ConvexReactClient(convexUrl)}>
        <html lang="en" className={`dark ${Funnel_Sansfont.variable} ${roboto_mono.variable}`} suppressHydrationWarning>
          <head>
            <link
              href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100..900&family=Space+Grotesk:wght@300..700&display=swap"
              rel="stylesheet"
            />
            <link rel="icon" href="/IMG_6128.png" />
          </head>
          <body>
            <ConvexClientProvider>
              {children}
              <Toaster />
            </ConvexClientProvider>
          </body>
        </html>
      </ConvexProvider>
    </ClerkProvider>
  );
}
