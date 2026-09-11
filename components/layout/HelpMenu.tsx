"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, HelpCircle } from "lucide-react";

const helpLinks = [
  { name: "Setup Wizard", href: "/help/setup-wizard" },
  { name: "Userguide", href: "/help/userguide" },
  { name: "Contact Support Team", href: "/help/contact-support" },
];

export function HelpMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900"
      >
        <HelpCircle size={16} />
        <span className="hidden sm:inline">Help</span>
        <ChevronDown size={14} className="text-slate-400" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-border rounded-lg shadow-sm py-1 z-10">
          {helpLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block text-sm px-3 py-2 text-slate-600 hover:bg-slate-50 transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
