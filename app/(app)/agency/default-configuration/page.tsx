"use client";

import { useEffect, useState } from "react";
import { getDefaultConfiguration, updateDefaultConfiguration } from "@/lib/api";
import { useToast } from "@/lib/toast-context";
import { DefaultConfiguration, RatingType, SendMethod } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`flex-shrink-0 w-9 h-5 rounded-full transition-colors relative ${checked ? "bg-berry-600" : "bg-slate-200"}`}
    >
      <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${checked ? "translate-x-4" : "translate-x-0.5"}`} />
    </button>
  );
}

export default function DefaultConfigurationPage() {
  const { showToast } = useToast();
  const [config, setConfig] = useState<DefaultConfiguration | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getDefaultConfiguration().then((data) => {
      setConfig(data);
      setLoading(false);
    });
  }, []);

  if (loading || !config) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="page-title">Default Configuration</h1>
          <p className="page-subtitle">Loading...</p>
        </div>
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  function update(changes: Partial<DefaultConfiguration>) {
    setConfig((prev) => (prev ? { ...prev, ...changes } : prev));
  }

  async function handleSave() {
    if (!config) return;
    setSaving(true);
    try {
      await updateDefaultConfiguration(config);
      showToast("Default configuration saved");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="page-title">Default Configuration</h1>
        <p className="page-subtitle">These defaults apply automatically to every new business you add to this account.</p>
      </div>

      <div className="card max-w-xl space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-700">Auto-Reply Enabled by Default</p>
            <p className="text-xs text-slate-500">New businesses start with Auto-Reply turned on.</p>
          </div>
          <Toggle checked={config.autoReplyEnabledByDefault} onChange={() => update({ autoReplyEnabledByDefault: !config.autoReplyEnabledByDefault })} />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Default Rating Type</label>
          <select
            value={config.defaultRatingType}
            onChange={(e) => update({ defaultRatingType: e.target.value as RatingType })}
            className="w-full text-sm border border-border rounded-md px-3 py-2"
          >
            <option value="nps">NPS</option>
            <option value="star">Star Rating</option>
            <option value="thumbs">Thumbs Up/Down</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Default Send Method</label>
          <select
            value={config.defaultSendMethod}
            onChange={(e) => update({ defaultSendMethod: e.target.value as SendMethod })}
            className="w-full text-sm border border-border rounded-md px-3 py-2"
          >
            <option value="email">Email</option>
            <option value="sms">SMS</option>
            <option value="both">Both</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-700">Require Consent Checkbox</p>
            <p className="text-xs text-slate-500">New businesses require consent confirmation before adding customers.</p>
          </div>
          <Toggle checked={config.requireConsentCheckbox} onChange={() => update({ requireConsentCheckbox: !config.requireConsentCheckbox })} />
        </div>

        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Defaults"}
        </Button>
      </div>
    </div>
  );
}
