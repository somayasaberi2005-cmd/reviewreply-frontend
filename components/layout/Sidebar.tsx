"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquareText,
  Building2,
  BarChart3,
  Settings,
} from "lucide-react";

const navGroups = [
  {
    label: "Overview",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "Reviews", href: "/reviews", icon: MessageSquareText },
    ],
  },
  {
    label: "Manage",
    items: [
      { name: "Businesses", href: "/businesses", icon: Building2 },
      { name: "Reports", href: "/reports", icon: BarChart3 },
      { name: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-full border-r border-border bg-white flex flex-col">
      <div className="px-6 py-5 border-b border-border">
        <h1 className="text-xl font-bold text-foreground">ReviewReply</h1>
      </div>

      <nav className="flex-1 px-3 py-2 overflow-y-auto">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="nav-group-label">{group.label}</p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors border-l-2 ${
                      isActive
                        ? "bg-berry-50 text-berry-800 border-berry-600"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-transparent"
                    }`}
                  >
                    <Icon
                      size={18}
                      className={isActive ? "text-berry-600" : "text-slate-400"}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-border flex items-center gap-3">
        <div className="avatar-circle">DC</div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-900 truncate">Downtown Cafe</p>
          <p className="text-xs text-slate-500 truncate">Free plan</p>
        </div>
      </div>
    </aside>
  );
}
