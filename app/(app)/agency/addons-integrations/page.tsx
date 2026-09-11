"use client";

import { useEffect, useState } from "react";
import { getAddons, toggleAddon } from "@/lib/api";
import { useToast } from "@/lib/toast-context";
import { Addon } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function AddonsIntegrationsPage() {
  const { showToast } = useToast();
  const [addons, setAddons] = useState<Addon[]>([]);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState<string | null>(null);

  useEffect(() => {
    getAddons().then((data) => {
      setAddons(data);
      setLoading(false);
    });
  }, []);

  async function handleToggle(addon: Addon) {
    setPending(addon.id);
    try {
      await toggleAddon(addon.id);
      setAddons((prev) => prev.map((a) => (a.id === addon.id ? { ...a, active: !a.active } : a)));
      showToast(addon.active ? `${addon.name} removed` : `${addon.name} added`);
    } finally {
      setPending(null);
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="page-title">Add-ons &amp; Integrations</h1>
        <p className="page-subtitle">Extend your account with optional add-ons.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-40 w-full rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {addons.map((addon) => (
            <div key={addon.id} className="card flex flex-col">
              <p className="font-semibold text-slate-900 mb-1">{addon.name}</p>
              <p className="text-sm text-slate-500 flex-1 mb-3">{addon.description}</p>
              <p className="text-sm font-medium text-slate-700 mb-3">{addon.price}</p>
              <Button
                size="sm"
                variant={addon.active ? "outline" : "default"}
                onClick={() => handleToggle(addon)}
                disabled={pending === addon.id}
              >
                {pending === addon.id ? "..." : addon.active ? "Remove" : "Add"}
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
