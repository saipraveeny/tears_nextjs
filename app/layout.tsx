import React from "react";
import "@/styles/globals.css";
import "@/styles/components.css";
import "@/styles/App.css";
import Providers from "@/components/Providers";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";

import Script from "next/script";

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
      <head>
        {/* Highcharts CDN for Admin Dashboard */}
        <Script src="https://code.highcharts.com/highcharts.js" strategy="lazyOnload" />
        <Script src="https://code.highcharts.com/highcharts-more.js" strategy="lazyOnload" />
        <Script src="https://code.highcharts.com/modules/exporting.js" strategy="lazyOnload" />
        <Script src="https://code.highcharts.com/modules/export-data.js" strategy="lazyOnload" />
        <Script src="https://code.highcharts.com/modules/accessibility.js" strategy="lazyOnload" />
      </head>
      <body>
        <Providers>
          <AuthModal />
          <Navigation logo={logo} />
          <main>{children}</main>
          <Footer logo={logo} />
        </Providers>
      </body>
    </html>
  );
}
