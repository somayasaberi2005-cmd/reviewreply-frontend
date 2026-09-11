"use client";

import { useEffect, useState } from "react";
import { getApiCredentials, createApiCredential, revokeApiCredential } from "@/lib/api";
import { useToast } from "@/lib/toast-context";
import { ApiCredential } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Trash2, KeyRound } from "lucide-react";

export default function ApiCredentialsPage() {
  const { showToast } = useToast();
  const [credentials, setCredentials] = useState<ApiCredential[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    getApiCredentials().then((data) => {
      setCredentials(data);
      setLoading(false);
    });
  }, []);

  async function handleCreate() {
    if (!name.trim()) return;
    setCreating(true);
    try {
      const credential = await createApiCredential(name.trim());
      setCredentials((prev) => [...prev, credential]);
      setName("");
      showToast("API key created");
    } finally {
      setCreating(false);
    }
  }

  async function handleRevoke(id: string) {
    setCredentials((prev) => prev.filter((c) => c.id !== id));
    await revokeApiCredential(id);
    showToast("API key revoked");
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="page-title">API Credentials</h1>
        <p className="page-subtitle">Create and manage API keys for programmatic access to your account.</p>
      </div>

      <div className="card mb-5 max-w-xl">
        <p className="font-semibold text-slate-900 mb-3">Create New Key</p>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Key name, e.g. Zapier Integration"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="text-sm border border-border rounded-md px-3 py-2 flex-1"
          />
          <Button onClick={handleCreate} disabled={creating || !name.trim()}>
            {creating ? "Creating..." : "Create Key"}
          </Button>
        </div>
      </div>

      {loading ? (
        <Skeleton className="h-40 w-full rounded-2xl" />
      ) : credentials.length === 0 ? (
        <div className="empty-state">
          <KeyRound size={24} className="text-slate-300 mb-2" />
          <p className="font-medium text-slate-700">No API keys yet</p>
          <p className="empty-state-text">Create one above to get started.</p>
        </div>
      ) : (
        <div className="card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-slate-500">
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">Key</th>
                <th className="py-2 pr-4">Created</th>
                <th className="py-2 pr-4">Last Used</th>
                <th className="py-2 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {credentials.map((c) => (
                <tr key={c.id} className="border-b border-border last:border-0">
                  <td className="py-2 pr-4 font-medium text-slate-900">{c.name}</td>
                  <td className="py-2 pr-4 font-mono text-xs text-slate-600">{c.keyPreview}</td>
                  <td className="py-2 pr-4 text-slate-500">{new Date(c.createdAt).toLocaleDateString()}</td>
                  <td className="py-2 pr-4 text-slate-500">{c.lastUsed ?? "Never"}</td>
                  <td className="py-2 pr-4 text-right">
                    <button onClick={() => handleRevoke(c.id)} className="text-slate-400 hover:text-red-600">
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
