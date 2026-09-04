import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { BusinessProvider } from "@/lib/business-context";
import { UserProvider } from "@/lib/user-context";
import { ToastProvider } from "@/lib/toast-context";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ReviewReply",
  description: "AI-powered review reply management",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <ToastProvider>
          <UserProvider>
            <BusinessProvider>{children}</BusinessProvider>
          </UserProvider>
        </ToastProvider>
      </body>
    </html>
  );
}