"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopbarSearch } from "@/components/layout/TopbarSearch";
import { NotificationBell } from "@/components/layout/NotificationBell";
import { UserMenu } from "@/components/layout/UserMenu";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-full flex bg-slate-50">
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-40 transform transition-transform duration-200 lg:static lg:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar onNavigate={() => setMobileMenuOpen(false)} />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-border bg-white flex items-center justify-between px-4 sm:px-6 gap-3">
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="lg:hidden text-slate-500 flex-shrink-0"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="hidden sm:block">
            <TopbarSearch />
          </div>

          <div className="flex items-center gap-3 sm:gap-4 ml-auto">
            <NotificationBell />
            <UserMenu />
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-8 overflow-x-hidden">
          <div key={pathname} className="animate-in fade-in slide-in-from-bottom-1 duration-300">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}