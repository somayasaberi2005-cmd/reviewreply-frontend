"use client";

import { useEffect, useState } from "react";
import { getConversionPopupSettings, updateConversionPopupSettings, getConversionPopupEmbedCode } from "@/lib/api";
import { useBusinessContext } from "@/lib/business-context";
import { useToast } from "@/lib/toast-context";
import { ConversionPopupSettings, UrlMatchType, PopupPosition } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, Check, Copy } from "lucide-react";

export default function ConversionPopupPage() {
  const { selectedBusinessId } = useBusinessContext();
  const { showToast } = useToast();
  const [settings, setSettings] = useState<ConversionPopupSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!selectedBusinessId) return;
    setLoading(true);
    getConversionPopupSettings(selectedBusinessId).then((data) => {
      setSettings(data);
      setLoading(false);
    });
  }, [selectedBusinessId]);

  if (loading || !settings) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="page-title">Conversion Pop-Up</h1>
          <p className="page-subtitle">Loading...</p>
        </div>
        <Skeleton className="h-80 w-full rounded-2xl" />
      </div>
    );
  }

  function update(changes: Partial<ConversionPopupSettings>) {
    setSettings((prev) => (prev ? { ...prev, ...changes } : prev));
  }

  async function handleSave() {
    if (!selectedBusinessId || !settings) return;
    setSaving(true);
    try {
      await updateConversionPopupSettings(selectedBusinessId, settings);
      showToast("Conversion Pop-Up settings saved");
    } finally {
      setSaving(false);
    }
  }

  async function copyEmbed() {
    if (!selectedBusinessId) return;
    await navigator.clipboard.writeText(getConversionPopupEmbedCode(selectedBusinessId));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="page-title">Conversion Pop-Up</h1>
        <p className="page-subtitle">
          Display your best reviews on any page of your website using a highly visual popup. The
          Conversion Pop-Up shows when there are 3 or more available reviews that match your settings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card space-y-5">
          <label className="flex items-center gap-3 cursor-pointer">
            <button
              type="button"
              onClick={() => update({ enabled: !settings.enabled })}
              className={`w-9 h-5 rounded-full transition-colors relative ${
                settings.enabled ? "bg-berry-600" : "bg-slate-200"
              }`}
            >
              <span
                className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                  settings.enabled ? "translate-x-4" : "translate-x-0.5"
                }`}
              />
            </button>
            <span className="text-sm font-medium text-slate-700">Enable the Conversion Pop-Up</span>
          </label>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              URLs to display your Conversion Pop-Up on
            </label>
            <p className="text-xs text-slate-500 mb-2">
              Full or partial URLs where you would like the popup to appear. Leave empty to display on
              all pages.
            </p>
            <input
              type="text"
              placeholder="http://"
              value={settings.targetUrls}
              onChange={(e) => update({ targetUrls: e.target.value })}
              className="w-full text-sm border border-border rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">URL match type</label>
            <select
              value={settings.urlMatchType}
              onChange={(e) => update({ urlMatchType: e.target.value as UrlMatchType })}
              className="text-sm border border-border rounded-md px-3 py-2"
            >
              <option value="exact">Exact Match</option>
              <option value="partial">Partial Match</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Click-through URL</label>
            <input
              type="text"
              placeholder="Click-through URL..."
              value={settings.clickThroughUrl}
              onChange={(e) => update({ clickThroughUrl: e.target.value })}
              className="w-full text-sm border border-border rounded-md px-3 py-2"
            />
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.showFirstParty}
                onChange={(e) => update({ showFirstParty: e.target.checked })}
                className="rounded border-border"
              />
              <span className="text-sm text-slate-700">Display 1st-party reviews</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.showThirdParty}
                onChange={(e) => update({ showThirdParty: e.target.checked })}
                className="rounded border-border"
              />
              <span className="text-sm text-slate-700">Display 3rd-party reviews</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.showOnMobile}
                onChange={(e) => update({ showOnMobile: e.target.checked })}
                className="rounded border-border"
              />
              <span className="text-sm text-slate-700">Show on mobile devices</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Show on desktop screen side</label>
            <select
              value={settings.desktopPosition}
              onChange={(e) => update({ desktopPosition: e.target.value as PopupPosition })}
              className="text-sm border border-border rounded-md px-3 py-2"
            >
              <option value="left">Left</option>
              <option value="right">Right</option>
            </select>
          </div>

          <div className="flex gap-2 pt-2">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Settings"}
            </Button>
            <Button variant="outline" onClick={copyEmbed}>
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? "Copied" : "Get Embed Code"}
            </Button>
          </div>
        </div>

        <div className="flex justify-center items-start">
          <div
            className={`bg-white border border-border rounded-lg shadow-lg p-3 w-56 ${
              settings.desktopPosition === "right" ? "self-end" : ""
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-bold text-slate-900">5.0</span>
              <div className="flex">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} size={10} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
            </div>
            <p className="text-xs text-slate-500 mb-1">5.0 Star Rating by John Anderson</p>
            <p className="text-[10px] text-slate-400">04/12/26</p>
          </div>
        </div>
      </div>
    </div>
  );
}
