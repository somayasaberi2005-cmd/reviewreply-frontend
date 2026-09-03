import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Sidebar } from "@/components/layout/Sidebar";
import { BusinessProvider } from "@/lib/business-context";
import { UserProvider } from "@/lib/user-context";
import { TopbarSearch } from "@/components/layout/TopbarSearch";
import { NotificationBell } from "@/components/layout/NotificationBell";
import { UserMenu } from "@/components/layout/UserMenu";
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
        <UserProvider>
        <BusinessProvider>
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <header className="h-14 border-b border-border bg-white flex items-center justify-between px-6">
              <TopbarSearch />
              <div className="flex items-center gap-4">
                <NotificationBell />
                <UserMenu />
              </div>
            </header>
            <main className="flex-1 p-8">{children}</main>
          </div>
        </BusinessProvider>
        </UserProvider>
      </body>
    </html>
  );
}