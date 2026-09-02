import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Sidebar } from "@/components/layout/Sidebar";
import { BusinessProvider } from "@/lib/business-context";
import { TopbarSearch } from "@/components/layout/TopbarSearch";
import { NotificationBell } from "@/components/layout/NotificationBell";
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
      <body className="min-h-full flex bg-slate-50">
        <BusinessProvider>
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <header className="h-14 border-b border-border bg-white flex items-center justify-between px-6">
              <TopbarSearch />
              <div className="flex items-center gap-4">
                <NotificationBell />
                <div className="w-8 h-8 rounded-full bg-berry-100 text-berry-800 flex items-center justify-center text-sm font-medium">
                  U
                </div>
              </div>
            </header>
            <main className="flex-1 p-8">{children}</main>
          </div>
        </BusinessProvider>
      </body>
    </html>
  );
}