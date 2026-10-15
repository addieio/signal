import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { TopNav } from "@/components/layout/TopNav";
import { BottomNav } from "@/components/layout/BottomNav";
import { CompareTray } from "@/components/CompareTray";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SignalIntroLoader } from "@/components/SignalIntroLoader";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Signal — Global Hackathon Discovery & Multi-Pillar Rankings",
  description:
    "Signal is a global hackathon and developer meet discovery engine with authentic banners, personalized algorithmic rankings, and verified source links.",
  keywords: ["hackathons", "developer meets", "ranking", "devfolio", "unstop", "mlh", "luma", "signal"],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" data-theme="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('signal.theme.v1');if(t==='light'){document.documentElement.classList.remove('dark');document.documentElement.classList.add('light');document.documentElement.setAttribute('data-theme','light');}}catch(e){}})();`,
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} font-sans bg-bg text-text antialiased transition-colors duration-250`}
      >
        <ThemeProvider>
          {/* Futuristic radar intro loader on site entry */}
          <SignalIntroLoader />

          {/* Desktop top nav */}
          <TopNav />

          {/* Page content */}
          <main className="min-h-screen pb-20 md:pb-0 md:pt-16">
            {children}
          </main>

          {/* Mobile bottom nav */}
          <BottomNav />

          {/* Global compare tray — slides up when events selected */}
          <CompareTray />
        </ThemeProvider>
      </body>
    </html>
  );
}
