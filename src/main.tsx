"use client";
import React from "react";
import RootLayout from "@/app/layout";
import ReactDOM from "react-dom/client";
import "./index.css";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL as string);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <RootLayout children />
      </ConvexProviderWithClerk>
  </React.StrictMode>,
);