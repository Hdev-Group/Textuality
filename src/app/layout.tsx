"use client";
import React from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { Inter as FontSans } from "next/font/google";
import ConvexClientProvider from "./ConvexClientProvider";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import Head from "next/head";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "";

if (!convexUrl) {
  throw new Error("Missing Convex URL. Check your environment variables.");
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY} dynamic>
      <ConvexProvider client={new ConvexReactClient(convexUrl)}>
        <html lang="en" className="dark" suppressHydrationWarning>
          <head>
            <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100..900&family=Space+Grotesk:wght@300..700&display=swap" rel="stylesheet"></link>
            <link rel="icon" href="/IMG_6128.png" />
          </head>
          <ConvexClientProvider>
              {children}
              <Toaster />
          </ConvexClientProvider>
        </html>
      </ConvexProvider>
    </ClerkProvider>
  );
}
