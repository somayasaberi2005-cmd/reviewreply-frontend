"use client";

import { useState } from "react";
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

export function UserMenu() {
  const { user, setRole } = useUserContext();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2"
      >
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
        <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-border rounded-lg shadow-sm py-1 z-10">
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
        </div>
      )}
    </div>
  );
}