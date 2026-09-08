"use client";

import { useEffect, useState } from "react";
import { getIntegrations, setIntegrationConnected } from "@/lib/api";
import { useBusinessContext } from "@/lib/business-context";
import { useToast } from "@/lib/toast-context";
import { Integration } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Mail, Sheet } from "lucide-react";

export default function IntegrationsPage() {
  const { selectedBusinessId } = useBusinessContext();
  const { showToast } = useToast();
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingId, setPendingId] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedBusinessId) return;
    setLoading(true);
    getIntegrations(selectedBusinessId).then((data) => {
      setIntegrations(data);
      setLoading(false);
    });
  }, [selectedBusinessId]);

  async function toggleConnection(integration: Integration) {
    if (!selectedBusinessId) return;
    setPendingId(integration.id);
    const nextConnected = !integration.connected;
    try {
      await setIntegrationConnected(selectedBusinessId, integration.id, nextConnected);
      setIntegrations((prev) =>
        prev.map((i) => (i.id === integration.id ? { ...i, connected: nextConnected } : i))
      );
      showToast(nextConnected ? `${integration.name} connected` : `${integration.name} disconnected`);
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="page-title">Integrations</h1>
        <p className="page-subtitle">Connect an integration below to automate your review requests.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Skeleton className="h-56 w-full rounded-2xl" />
          <Skeleton className="h-56 w-full rounded-2xl" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {integrations.map((integration) => {
            const Icon = integration.id === "google_sheets" ? Sheet : Mail;
            return (
              <div key={integration.id} className="card">
                <p className="font-semibold text-slate-900 mb-3">{integration.name}</p>
                <div className="bg-slate-50 border border-border rounded-lg h-32 flex items-center justify-center mb-4">
                  <Icon size={36} className="text-slate-300" />
                </div>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs text-slate-500 flex-1">{integration.description}</p>
                  <Button
                    variant={integration.connected ? "outline" : "default"}
                    size="sm"
                    onClick={() => toggleConnection(integration)}
                    disabled={pendingId === integration.id}
                  >
                    {pendingId === integration.id
                      ? "..."
                      : integration.connected
                      ? "Disconnect"
                      : "Connect"}
                  </Button>
                </div>
                {integration.connected && (
                  <p className="text-xs text-berry-600 font-medium mt-2">Connected</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
