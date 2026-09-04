"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  MessageSquareText,
  Building2,
  BarChart3,
  Settings,
  ChevronDown,
  FileClock,
  Users,
  Users2,
} from "lucide-react";
import { useBusinessContext } from "@/lib/business-context";
import { getPendingCountsByBusiness } from "@/lib/api";

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
      { name: "Audit Log", href: "/audit-log", icon: FileClock },
      { name: "Team", href: "/team", icon: Users },
      { name: "Competitors", href: "/competitors", icon: Users2 },
    ],
  },
];

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { businesses, selectedBusinessId, setSelectedBusinessId, loading } = useBusinessContext();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [pendingCounts, setPendingCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    getPendingCountsByBusiness().then(setPendingCounts);
  }, []);

  const selectedBusiness = businesses.find((b) => b.id === selectedBusinessId);
  const selectedPending = selectedBusiness ? pendingCounts[selectedBusiness.id] ?? 0 : 0;

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
                    onClick={onNavigate}
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

      <div className="relative px-3 py-3 border-t border-border">
        {loading ? (
          <div className="px-1 py-1 text-xs text-slate-400">Loading businesses...</div>
        ) : (
          <>
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div className="avatar-circle">
                {selectedBusiness ? initials(selectedBusiness.name) : "?"}
              </div>
              <div className="min-w-0 flex-1 text-left">
                <p className="text-sm font-medium text-slate-900 truncate">
                  {selectedBusiness?.name ?? "Select business"}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  {businesses.length} location{businesses.length !== 1 ? "s" : ""}
                </p>
              </div>
              {selectedPending > 0 && (
                <span className="text-[10px] font-semibold bg-amber-100 text-amber-700 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                  {selectedPending}
                </span>
              )}
              <ChevronDown size={16} className="text-slate-400 flex-shrink-0" />
            </button>

            {dropdownOpen && (
              <div className="absolute bottom-full left-3 right-3 mb-1 bg-white border border-border rounded-lg shadow-sm py-1 max-h-56 overflow-y-auto">
                {businesses.map((business) => {
                  const count = pendingCounts[business.id] ?? 0;
                  return (
                    <button
                      key={business.id}
                      onClick={() => {
                        setSelectedBusinessId(business.id);
                        setDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-slate-50 transition-colors ${
                        business.id === selectedBusinessId ? "bg-berry-50" : ""
                      }`}
                    >
                      <div className="avatar-circle">{initials(business.name)}</div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-slate-900 truncate">{business.name}</p>
                        <p className="text-xs text-slate-500 truncate">{business.city}, {business.state}</p>
                      </div>
                      {count > 0 && (
                        <span className="text-[10px] font-semibold bg-amber-100 text-amber-700 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </aside>
  );
}