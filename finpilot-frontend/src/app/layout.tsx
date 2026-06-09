import type { Metadata, Viewport } from "next";
import { Inter, DM_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/ThemeProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "FinPilot — Smart Financial Planning for Everyone",
    template: "%s | FinPilot",
  },
  description:
    "Take control of your finances with FinPilot. Plan goals, track investments, manage budgets, and build wealth with India's smartest financial planning platform.",
  keywords: [
    "financial planning",
    "budget planner",
    "SIP calculator",
    "EMI calculator",
    "investment tracker",
    "personal finance",
    "goal planning",
    "India",
    "INR",
  ],
  authors: [{ name: "FinPilot" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://finpilot.app",
    title: "FinPilot — Smart Financial Planning for Everyone",
    description:
      "Plan goals, track investments, manage budgets, and build wealth with India's smartest financial planning platform.",
    siteName: "FinPilot",
  },
  twitter: {
    card: "summary_large_image",
    title: "FinPilot — Smart Financial Planning",
    description:
      "India's smartest financial planning platform. EMI, SIP, budgets & more.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#030712" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${dmSans.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
