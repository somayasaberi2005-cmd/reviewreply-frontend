"use client";

import { useEffect, useState } from "react";
import { getAgencyUsers, inviteAgencyUser, removeAgencyUser } from "@/lib/api";
import { useToast } from "@/lib/toast-context";
import { AgencyUser, UserRole } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Trash2 } from "lucide-react";

const roleLabels: Record<UserRole, string> = {
  owner: "Owner",
  regional_manager: "Regional Manager",
  location_manager: "Location Manager",
  viewer: "Viewer",
};

export default function UserManagementPage() {
  const { showToast } = useToast();
  const [users, setUsers] = useState<AgencyUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("viewer");
  const [inviting, setInviting] = useState(false);

  useEffect(() => {
    getAgencyUsers().then((data) => {
      setUsers(data);
      setLoading(false);
    });
  }, []);

  async function handleInvite() {
    if (!email.trim()) return;
    setInviting(true);
    try {
      const user = await inviteAgencyUser(email.trim(), role);
      setUsers((prev) => [...prev, user]);
      setEmail("");
      showToast("Invitation sent");
    } finally {
      setInviting(false);
    }
  }

  async function handleRemove(id: string) {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    await removeAgencyUser(id);
    showToast("User removed");
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="page-title">User Management</h1>
        <p className="page-subtitle">Invite teammates and manage their access across all your businesses.</p>
      </div>

      <div className="card mb-5">
        <p className="font-semibold text-slate-900 mb-3">Invite a User</p>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="text-sm border border-border rounded-md px-3 py-2 flex-1"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
            className="text-sm border border-border rounded-md px-3 py-2"
          >
            {Object.entries(roleLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <Button onClick={handleInvite} disabled={inviting || !email.trim()}>
            {inviting ? "Sending..." : "Send Invite"}
          </Button>
        </div>
      </div>

      {loading ? (
        <Skeleton className="h-48 w-full rounded-2xl" />
      ) : (
        <div className="card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-slate-500">
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">Email</th>
                <th className="py-2 pr-4">Role</th>
                <th className="py-2 pr-4">Businesses</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-border last:border-0">
                  <td className="py-2 pr-4 font-medium text-slate-900">{u.name}</td>
                  <td className="py-2 pr-4 text-slate-600">{u.email}</td>
                  <td className="py-2 pr-4 text-slate-600">{roleLabels[u.role]}</td>
                  <td className="py-2 pr-4 text-slate-600">{u.businesses.join(", ") || "-"}</td>
                  <td className="py-2 pr-4">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${u.status === "active" ? "bg-berry-50 text-berry-800" : "bg-amber-50 text-amber-700"}`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="py-2 pr-4 text-right">
                    <button onClick={() => handleRemove(u.id)} className="text-slate-400 hover:text-red-600">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
