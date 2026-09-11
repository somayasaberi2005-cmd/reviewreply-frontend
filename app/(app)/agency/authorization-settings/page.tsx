"use client";

import { useEffect, useState } from "react";
import { getAuthorizations, toggleAuthorization } from "@/lib/api";
import { useToast } from "@/lib/toast-context";
import { AuthorizationEntry, AuthProvider } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ThumbsUp, Search, Camera } from "lucide-react";

const providerInfo: Record<AuthProvider, { name: string; icon: React.ElementType; color: string }> = {
  google: { name: "Google", icon: Search, color: "text-red-500" },
  facebook: { name: "Facebook", icon: ThumbsUp, color: "text-blue-600" },
  instagram: { name: "Instagram", icon: Camera, color: "text-pink-600" },
};

export default function AuthorizationSettingsPage() {
  const { showToast } = useToast();
  const [entries, setEntries] = useState<AuthorizationEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState<AuthProvider | null>(null);

  useEffect(() => {
    getAuthorizations().then((data) => {
      setEntries(data);
      setLoading(false);
    });
  }, []);

  async function handleToggle(entry: AuthorizationEntry) {
    setPending(entry.provider);
    try {
      const next = !entry.connected;
      await toggleAuthorization(entry.provider, next);
      setEntries((prev) =>
        prev.map((e) => (e.provider === entry.provider ? { ...e, connected: next, accountEmail: next ? "you@roshan.af" : null } : e))
      );
      showToast(next ? `${providerInfo[entry.provider].name} connected` : `${providerInfo[entry.provider].name} disconnected`);
    } finally {
      setPending(null);
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="page-title">Authorization Settings</h1>
        <p className="page-subtitle">Manage account-level connections to Google, Facebook, and Instagram used across all your businesses.</p>
      </div>

      {loading ? (
        <Skeleton className="h-48 w-full rounded-2xl" />
      ) : (
        <div className="card max-w-xl divide-y divide-border">
          {entries.map((entry) => {
            const info = providerInfo[entry.provider];
            const Icon = info.icon;
            return (
              <div key={entry.provider} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <Icon size={18} className={info.color} />
                  <div>
                    <p className="text-sm text-slate-700">{info.name}</p>
                    {entry.accountEmail && <p className="text-xs text-slate-400">{entry.accountEmail}</p>}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant={entry.connected ? "outline" : "default"}
                  onClick={() => handleToggle(entry)}
                  disabled={pending === entry.provider}
                >
                  {pending === entry.provider ? "..." : entry.connected ? "Disconnect" : "Connect"}
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
