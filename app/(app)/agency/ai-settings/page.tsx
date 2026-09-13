"use client";

import { useEffect, useState } from "react";
import { getAiSettings, updateAiSettings } from "@/lib/api";
import { useToast } from "@/lib/toast-context";
import { AiSettings } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`flex-shrink-0 w-9 h-5 rounded-full transition-colors relative ${checked ? "bg-berry-600" : "bg-slate-200"}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${checked ? "translate-x-4" : "translate-x-0.5"}`} />
    </button>
  );
}

export default function AiSettingsPage() {
  const { showToast } = useToast();
  const [settings, setSettings] = useState<AiSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getAiSettings().then((data) => {
      setSettings(data);
      setLoading(false);
    });
  }, []);

  if (loading || !settings) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="page-title">AI Settings</h1>
          <p className="page-subtitle">Loading...</p>
        </div>
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  function update(changes: Partial<AiSettings>) {
    setSettings((prev) => (prev ? { ...prev, ...changes } : prev));
  }

  async function handleSave() {
    if (!settings) return;
    setSaving(true);
    try {
      await updateAiSettings(settings);
      showToast("AI settings saved");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="page-title">AI Settings</h1>
        <p className="page-subtitle">Account-wide defaults for how AI drafts and sends replies across all your businesses.</p>
      </div>

      <div className="card max-w-xl space-y-5">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-slate-700">Enable AI Replies</p>
          <Toggle checked={settings.aiRepliesEnabled} onChange={() => update({ aiRepliesEnabled: !settings.aiRepliesEnabled })} />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Reply Tone</label>
          <select
            value={settings.tone}
            onChange={(e) => update({ tone: e.target.value as AiSettings["tone"] })}
            className="w-full text-sm border border-border rounded-md px-3 py-2"
          >
            <option value="friendly">Friendly</option>
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Max Reply Length (characters)</label>
          <input
            type="number"
            value={settings.maxReplyLength}
            onChange={(e) => update({ maxReplyLength: Number(e.target.value) })}
            className="w-32 text-sm border border-border rounded-md px-3 py-2"
          />
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-slate-700">Use Emoji in Replies</p>
          <Toggle checked={settings.useEmoji} onChange={() => update({ useEmoji: !settings.useEmoji })} />
        </div>

        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  );
}

