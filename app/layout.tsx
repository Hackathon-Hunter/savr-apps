import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ICPPriceProvider } from "@/contexts/ICPPriceContext";
import { SavingsAnalysisProvider } from "@/contexts/SavingsAnalysisContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SAVR - AI-Powered Savings on ICP",
  description: "Smart savings plans with AI analysis and ICP staking rewards",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ICPPriceProvider>
          <SavingsAnalysisProvider>{children}</SavingsAnalysisProvider>
        </ICPPriceProvider>
      </body>
    </html>
  );
}
