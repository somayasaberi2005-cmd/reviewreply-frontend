"use client";

import { useEffect, useState } from "react";
import { getTeamMembers, TeamMember } from "@/lib/api";
import { useUserContext } from "@/lib/user-context";
import { Skeleton } from "@/components/ui/skeleton";
import { UserRole } from "@/lib/types";
import { Lock } from "lucide-react";

const roleLabels: Record<UserRole, string> = {
  owner: "Owner",
  regional_manager: "Regional Manager",
  location_manager: "Location Manager",
  viewer: "Viewer",
};

const roleStyles: Record<UserRole, string> = {
  owner: "bg-berry-50 text-berry-800",
  regional_manager: "bg-blue-50 text-blue-700",
  location_manager: "bg-amber-50 text-amber-700",
  viewer: "bg-slate-100 text-slate-600",
};

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

export default function TeamPage() {
  const { user } = useUserContext();
  const canManageTeam = user.role === "owner" || user.role === "regional_manager";
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTeamMembers().then((data) => {
      setMembers(data);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="page-title">Team</h1>
          <p className="page-subtitle">Manage who has access and what they can do</p>
        </div>
        {canManageTeam && (
          <button className="text-sm font-medium px-4 py-2 rounded-md bg-berry-600 text-white hover:bg-berry-800 transition-colors">
            Invite member
          </button>
        )}
      </div>

      {!canManageTeam && (
        <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-100 rounded-lg px-3 py-2 mb-4">
          <Lock size={14} />
          Only owners and regional managers can invite or change roles.
        </div>
      )}

      {loading ? (
        <div className="card space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>
      ) : (
        <div className="card p-0 overflow-hidden">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between px-5 py-4 border-b border-border last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <div className="avatar-circle">{initials(member.name)}</div>
                <div>
                  <p className="text-sm font-medium text-slate-900">{member.name}</p>
                  <p className="text-xs text-slate-500">{member.email}</p>
                </div>
              </div>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${roleStyles[member.role]}`}>
                {roleLabels[member.role]}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}