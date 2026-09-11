"use client";

import { useEffect, useState } from "react";
import { getMyProfile, updateMyProfile } from "@/lib/api";
import { useToast } from "@/lib/toast-context";
import { MyProfile } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function MyProfilePage() {
  const { showToast } = useToast();
  const [profile, setProfile] = useState<MyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getMyProfile().then((data) => {
      setProfile(data);
      setLoading(false);
    });
  }, []);

  if (loading || !profile) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="page-title">My Profile</h1>
          <p className="page-subtitle">Loading...</p>
        </div>
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  function update(changes: Partial<MyProfile>) {
    setProfile((prev) => (prev ? { ...prev, ...changes } : prev));
  }

  async function handleSave() {
    if (!profile) return;
    setSaving(true);
    try {
      await updateMyProfile(profile);
      showToast("Profile saved");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="page-title">My Profile</h1>
      </div>

      <div className="card max-w-lg space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-700 mb-1">First Name</label>
            <input
              type="text"
              value={profile.firstName}
              onChange={(e) => update({ firstName: e.target.value })}
              className="w-full text-sm border border-border rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-700 mb-1">Last Name</label>
            <input
              type="text"
              value={profile.lastName}
              onChange={(e) => update({ lastName: e.target.value })}
              className="w-full text-sm border border-border rounded-md px-3 py-2"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm text-slate-700 mb-1">Email</label>
          <input
            type="email"
            value={profile.email}
            onChange={(e) => update({ email: e.target.value })}
            className="w-full text-sm border border-border rounded-md px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm text-slate-700 mb-1">Phone</label>
          <input
            type="text"
            value={profile.phone}
            onChange={(e) => update({ phone: e.target.value })}
            className="w-full text-sm border border-border rounded-md px-3 py-2"
          />
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Profile"}
        </Button>
      </div>
    </div>
  );
}
