import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/providers/session-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ComfortCare Home Health - Quality Care at Home",
  description:
    "Professional home care services including personal care, companion care, skilled nursing, and more. Serving families with compassion and excellence.",
  keywords:
    "home care, home health, personal care, companion care, skilled nursing, caregiver, elder care",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
