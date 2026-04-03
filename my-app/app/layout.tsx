import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

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
        <div
          id="google_translate_element"
          className="fixed top-4 right-4 z-50 "
        ></div>

        <script
          type="text/javascript"
          src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        ></script>

        <script
          dangerouslySetInnerHTML={{
            __html: `
    function googleTranslateElementInit() {
      new google.translate.TranslateElement({
        pageLanguage: 'en',
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE
      }, 'google_translate_element');
    }
  `,
          }}
        />

        <style
          dangerouslySetInnerHTML={{
            __html: `
    .goog-te-gadget-simple {
  background-color: rgba(255, 255, 255, 0.6) !important;
  backdrop-filter: blur(8px);
  border: 1px solid #a7f3d0 !important; /* emerald-200 */
  
  /* Fixed sizing: don't make it too tall/wide */
  height: 40px !important; 
  min-width: 120px !important;
  padding: 0 12px !important;
  
  border-radius: 12px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
}

.goog-te-gadget-simple:hover {
  background-color: white !important;
  border-color: #10b981 !important; /* emerald-500 */
  box-shadow: 0 4px 20px rgba(16, 185, 129, 0.15);
  transform: translateY(-1px);
}

/* 2. Fix the Text (The part that was invisible) */
.goog-te-menu-value {
  display: flex !important;
  align-items: center !important;
  margin: 0 !important;
  width: 100%;
}

.goog-te-menu-value span:nth-child(1) {
  display: block !important;
  color: #064e3b !important; /* emerald-900 */
  font-weight: 600 !important;
  font-size: 13px !important;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

/* 3. Add a Globe Icon (SVG trick) */
.goog-te-gadget-simple::before {
  content: "";
  display: inline-block;
  width: 16px;
  height: 16px;
  margin-right: 8px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2310b981' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Cline x1='2' y1='12' x2='22' y2='12'/%3E%3Cpath d='M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
}

/* 4. The Down Arrow */
.goog-te-menu-value:after {
  content: '▼' !important;
  font-size: 8px !important;
  margin-left: auto !important;
  color: #10b981 !important;
  padding-left: 8px;
}

/* 5. Cleanup - Hide the ugly Google bits */
.goog-te-gadget img, 
.goog-te-gadget span,
.goog-te-banner-frame,
#goog-gt-tt { 
  display: none !important; 
}

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
