import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Sidebar } from "@/components/layout/Sidebar";
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
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 border-b border-border bg-white flex items-center justify-between px-6">
            <div className="flex items-center gap-2 bg-slate-50 border border-border rounded-lg px-3 py-1.5 w-72">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <span className="text-sm text-slate-400">Search reviews, businesses...</span>
            </div>
            <div className="flex items-center gap-4">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400">
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
              </svg>
              <div className="w-8 h-8 rounded-full bg-berry-100 text-berry-800 flex items-center justify-center text-sm font-medium">
                U
              </div>
            </div>
          </header>
          <main className="flex-1 p-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
