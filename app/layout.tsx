import type { Metadata } from "next";
import { DM_Sans, Inter } from "next/font/google";
import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "True Feedback - Anonymous Messaging Platform",
  description: "Share honest feedback anonymously. A safe space for genuine conversations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${inter.variable} h-full antialiased`}
    >
      <AuthProvider>
        <body className="min-h-full flex flex-col bg-[#0A0A0F] text-gray-100">
          <main className="flex-1">
            {children}
          </main>
          <Toaster />
        </body>
      </AuthProvider>
    </html>
  );
}
