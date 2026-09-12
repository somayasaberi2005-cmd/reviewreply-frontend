"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useUserContext } from "@/lib/user-context";
import { UserRole } from "@/lib/types";

const roleLabels: Record<UserRole, string> = {
  owner: "Owner",
  regional_manager: "Regional Manager",
  location_manager: "Location Manager",
  viewer: "Viewer",
};

const roleOptions: UserRole[] = ["owner", "regional_manager", "location_manager", "viewer"];

const agencyLinks = [
  { name: "Default Configuration", href: "/agency/default-configuration" },
  { name: "Import Businesses", href: "/agency/import-businesses" },
  { name: "User Management", href: "/agency/user-management" },
  { name: "My Profile", href: "/agency/my-profile" },
  { name: "Authorization Settings", href: "/agency/authorization-settings" },
  { name: "API Credentials", href: "/agency/api-credentials" },
  { name: "Payment Information", href: "/agency/payment-information" },
  { name: "AI Settings", href: "/agency/ai-settings" },
  { name: "Add-ons & Integrations", href: "/agency/addons-integrations" },
];

export function UserMenu() {
  const { user, setRole } = useUserContext();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button onClick={() => setOpen((prev) => !prev)} className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-berry-100 text-berry-800 flex items-center justify-center text-sm font-medium">
          {user.name[0]}
        </div>
        <div className="text-left hidden sm:block">
          <p className="text-xs font-medium text-slate-700 leading-tight">{user.name}</p>
          <p className="text-xs text-slate-400 leading-tight">{roleLabels[user.role]}</p>
        </div>
        <ChevronDown size={14} className="text-slate-400" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-border rounded-lg shadow-sm py-1 z-10 max-h-[28rem] overflow-y-auto">
          <p className="text-xs text-slate-400 px-3 py-2">Switch role (demo)</p>
          {roleOptions.map((role) => (
            <button
              key={role}
              onClick={() => {
                setRole(role);
                setOpen(false);
              }}
              className={`w-full text-left text-sm px-3 py-2 hover:bg-slate-50 transition-colors ${
                user.role === role ? "text-berry-700 font-medium" : "text-slate-600"
              }`}
            >
              {roleLabels[role]}
            </button>
          ))}

          <div className="border-t border-border my-1" />

          {agencyLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block text-sm px-3 py-2 text-slate-600 hover:bg-slate-50 transition-colors"
            >
              {link.name}
            </Link>
          ))}

          <div className="border-t border-border my-1" />

          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="block text-sm px-3 py-2 text-red-600 hover:bg-red-50 transition-colors"
          >
            Logout
          </Link>
        </div>
      )}
    </div>
  );
}

