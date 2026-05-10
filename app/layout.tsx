import React from "react";
import "@/styles/globals.css";
import "@/styles/components.css";
import "@/styles/App.css";
import Providers from "@/components/Providers";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";
import AssetPreloader from "@/components/AssetPreloader";

import Script from "next/script";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

export const metadata = {
  title: "Tears - Premium Hot Sauce",
  description: "Experience the heat with Tears premium hot sauces.",
};

const logo = "/assets/logo.png";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Highcharts scripts for Admin Dashboard */}
        <Script src="https://code.highcharts.com/highcharts.js" />
        <Script src="https://code.highcharts.com/highcharts-more.js" />
        <Script src="https://code.highcharts.com/modules/exporting.js" />
        <Script src="https://code.highcharts.com/modules/export-data.js" />
        <Script src="https://code.highcharts.com/modules/accessibility.js" />
        
        <Providers>
          <AuthModal />
          <AssetPreloader />
          <Navigation logo={logo} />
          <main>{children}</main>
          <Footer logo={logo} />
          <SpeedInsights />
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
