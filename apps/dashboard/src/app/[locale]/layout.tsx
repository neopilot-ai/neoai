import "@/styles/globals.css";
import { cn } from "@neoai/ui/cn";
import "@neoai/ui/globals.css";
import { DesktopHeader } from "@/components/desktop-header";
import { isDesktopApp } from "@/utils/desktop";
import { Provider as Analytics } from "@neoai/events/client";
import { Toaster } from "@neoai/ui/toaster";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import { Lora } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import type { ReactElement } from "react";
import { Providers } from "./providers";

export const metadata: Metadata = {
  metadataBase: new URL("https://app.neoai.khulnasoft.com"),
  title: "Neoai | Run your business smarter",
  description:
    "Automate financial tasks, stay organized, and make informed decisions effortlessly.",
  twitter: {
    title: "Neoai | Run your business smarter",
    description:
      "Automate financial tasks, stay organized, and make informed decisions effortlessly.",
    images: [
      {
        url: "https://cdn.neoai.khulnasoft.com/opengraph-image.jpg",
        width: 800,
        height: 600,
      },
      {
        url: "https://cdn.neoai.khulnasoft.com/opengraph-image.jpg",
        width: 1800,
        height: 1600,
      },
    ],
  },
  openGraph: {
    title: "Neoai | Run your business smarter",
    description:
      "Automate financial tasks, stay organized, and make informed decisions effortlessly.",
    url: "https://app.neoai.khulnasoft.com",
    siteName: "Neoai",
    images: [
      {
        url: "https://cdn.neoai.khulnasoft.com/opengraph-image.jpg",
        width: 800,
        height: 600,
      },
      {
        url: "https://cdn.neoai.khulnasoft.com/opengraph-image.jpg",
        width: 1800,
        height: 1600,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

const lora = Lora({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif",
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)" },
    { media: "(prefers-color-scheme: dark)" },
  ],
};

export default async function Layout({
  children,
  params,
}: {
  children: ReactElement;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isDesktop = await isDesktopApp();

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={cn(isDesktop && "desktop")}
    >
      <body
        className={cn(
          `${GeistSans.variable} ${GeistMono.variable} ${lora.variable} font-sans`,
          "whitespace-pre-line overscroll-none antialiased",
        )}
      >
        <DesktopHeader />

        <NuqsAdapter>
          <Providers locale={locale}>{children}</Providers>
          <Toaster />
          <Analytics />
        </NuqsAdapter>
      </body>
    </html>
  );
}
