import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
// @ts-ignore: CSS imports are handled by Next.js
import "./globals.css";
import Script from "next/script";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cow Monitor - Farm Health Dashboard",
  description:
    "Simple farmer-friendly cow monitoring dashboard. Track temperature, heartbeat, activity, and more for each cow.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
        <Analytics />

        {/* On mobile: bottom-center strip. On sm+: top-right corner. */}
        <div
          id="google_translate_element"
          className="
            fixed z-50
            bottom-4 left-1/2 -translate-x-1/2
            sm:bottom-auto sm:top-4 sm:left-auto sm:right-4 sm:translate-x-0
          "
        />

        <Script
          type="text/javascript"
          src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        />

        <Script
          dangerouslySetInnerHTML={{
            __html: `
      function googleTranslateElementInit() {
        new google.translate.TranslateElement({
          pageLanguage: 'en',
          includedLanguages: 'en,hi,ta,te,kn,bn,mr,gu,pa,ml,or',
          layout: google.translate.TranslateElement.InlineLayout.SIMPLE
        }, 'google_translate_element');
      }
    `,
          }}
        />

        <style
          dangerouslySetInnerHTML={{
            __html: `
/* ── Google Translate Widget ── */

.goog-te-gadget-simple {
  display: inline-flex !important;
  align-items: center !important;
  gap: 0 !important;
  height: 36px !important;
  padding: 0 12px !important;
  min-width: 0 !important;
  max-width: calc(100vw - 32px) !important; /* never overflow on tiny screens */
  background-color: rgba(255, 255, 255, 0.75) !important;
  backdrop-filter: blur(10px) !important;
  -webkit-backdrop-filter: blur(10px) !important;
  border: 1px solid #d1fae5 !important;
  border-radius: 10px !important;
  cursor: pointer !important;
  transition: background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease !important;
  position: relative !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04) !important;
}

.goog-te-gadget-simple:hover {
  background-color: rgba(255, 255, 255, 0.95) !important;
  border-color: #6ee7b7 !important;
  box-shadow: 0 2px 12px rgba(16, 185, 129, 0.12) !important;
}

.goog-te-gadget-simple:active {
  transform: scale(0.98) !important;
}

/* Globe icon */
.goog-te-gadget-simple::before {
  content: "" !important;
  display: inline-block !important;
  width: 15px !important;
  height: 15px !important;
  flex-shrink: 0 !important;
  margin-right: 7px !important;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2310b981' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Cline x1='2' y1='12' x2='22' y2='12'/%3E%3Cpath d='M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z'/%3E%3C/svg%3E") !important;
  background-repeat: no-repeat !important;
  background-size: contain !important;
}

/* Menu value row */
.goog-te-menu-value {
  display: inline-flex !important;
  align-items: center !important;
  gap: 5px !important;
  margin: 0 !important;
  width: auto !important;
}

/* Language label */
.goog-te-menu-value span:nth-child(1) {
  display: block !important;
  color: #065f46 !important;
  font-size: 13px !important;
  font-weight: 600 !important;
  letter-spacing: 0.01em !important;
  text-transform: none !important;
  white-space: nowrap !important;
}

/* SVG chevron */
.goog-te-menu-value::after {
  content: "" !important;
  display: inline-block !important;
  width: 10px !important;
  height: 10px !important;
  flex-shrink: 0 !important;
  margin-left: 4px !important;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10' fill='none'%3E%3Cpath d='M2 3.5L5 6.5L8 3.5' stroke='%2310b981' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") !important;
  background-repeat: no-repeat !important;
  background-size: contain !important;
}

/* Hide Google junk */
.goog-te-gadget img,
.goog-te-gadget > span,
.goog-te-banner-frame,
#goog-gt-tt,
.skiptranslate iframe {
  display: none !important;
}

body {
  top: 0 !important;
}
            `,
          }}
        />
      </body>
    </html>
  );
}
