"use client";

import { useEffect, useState } from "react";
import { getEmailSignatureSurvey, updateEmailSignatureSurvey, getSignatureWidgetSnippet } from "@/lib/api";
import { useBusinessContext } from "@/lib/business-context";
import { useToast } from "@/lib/toast-context";
import { EmailSignatureSurveySettings, WidgetSize } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Info, ChevronDown, Check, Copy } from "lucide-react";

const MAX_PROMPT_CHARS = 100;

export default function EmailSignatureSurveyPage() {
  const { selectedBusinessId } = useBusinessContext();
  const { showToast } = useToast();
  const [settings, setSettings] = useState<EmailSignatureSurveySettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [copied, setCopied] = useState(false);
  const [previewRating, setPreviewRating] = useState<number | null>(null);

  useEffect(() => {
    if (!selectedBusinessId) return;
    setLoading(true);
    getEmailSignatureSurvey(selectedBusinessId).then((data) => {
      setSettings(data);
      setLoading(false);
    });
  }, [selectedBusinessId]);

  if (loading || !settings) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="page-title">Email Signature Survey</h1>
          <p className="page-subtitle">Loading...</p>
        </div>
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  function update(changes: Partial<EmailSignatureSurveySettings>) {
    setSettings((prev) => (prev ? { ...prev, ...changes } : prev));
  }

  async function handleSave() {
    if (!selectedBusinessId || !settings) return;
    setSaving(true);
    try {
      await updateEmailSignatureSurvey(selectedBusinessId, settings);
      showToast("Survey settings saved");
    } finally {
      setSaving(false);
    }
  }

  async function copyWidget() {
    if (!selectedBusinessId) return;
    await navigator.clipboard.writeText(getSignatureWidgetSnippet(selectedBusinessId));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const scale = settings.widgetSize === "large" ? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] : [0, 2, 4, 6, 8, 10];

  return (
    <div>
      <div className="mb-6">
        <h1 className="page-title">Email Signature Survey</h1>
        <p className="page-subtitle">Passively collect ratings using a survey in your email signature.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card">
          <Button variant="outline" size="sm" className="mb-5">
            How it Works
          </Button>

          <p className="text-sm font-medium text-slate-700 mb-2">Widget Size</p>
          <div className="flex gap-2 mb-5">
            {(["large", "small"] as WidgetSize[]).map((size) => (
              <button
                key={size}
                onClick={() => update({ widgetSize: size })}
                className={`text-sm font-medium px-4 py-1.5 rounded-md capitalize ${
                  settings.widgetSize === size
                    ? "bg-slate-900 text-white"
                    : "bg-white border border-border text-slate-600 hover:bg-slate-50"
                }`}
              >
                {size}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium text-slate-700">Prompt Text</label>
            <span className="text-xs text-slate-400">
              {settings.promptText.length}/{MAX_PROMPT_CHARS}
            </span>
          </div>
          <input
            type="text"
            value={settings.promptText}
            maxLength={MAX_PROMPT_CHARS}
            onChange={(e) => update({ promptText: e.target.value })}
            className="w-full text-sm border border-border rounded-md px-3 py-2 mb-5"
          />

          <button
            onClick={() => setShowAdvanced((prev) => !prev)}
            className="w-full flex items-center justify-between text-sm font-medium text-slate-700 border border-border rounded-md px-3 py-2 mb-4"
          >
            Advanced
            <ChevronDown size={16} className={`transition-transform ${showAdvanced ? "rotate-180" : ""}`} />
          </button>

          {showAdvanced && (
            <div className="space-y-4 mb-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Redirect URL after rating (optional)
                </label>
                <input
                  type="text"
                  value={settings.redirectUrl}
                  onChange={(e) => update({ redirectUrl: e.target.value })}
                  placeholder="https://yourdomain.com/thank-you"
                  className="w-full text-sm border border-border rounded-md px-3 py-2"
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.trackClicks}
                  onChange={(e) => update({ trackClicks: e.target.checked })}
                  className="rounded border-border"
                />
                Track clicks in Google Analytics
              </label>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-5">
            <div className="flex gap-2">
              <Info size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
              <ul className="text-xs text-blue-800 space-y-1 list-disc pl-4">
                <li>HTML markup may not function in certain email clients. Always test your signature before sending.</li>
                <li>After you save changes to the widget, you will need to re-embed it to see the updates in your email signature.</li>
              </ul>
            </div>
          </div>

          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Settings"}
          </Button>
        </div>

        <div className="space-y-4">
          <div className="border border-border rounded-lg overflow-hidden">
            <div className="bg-slate-50 px-3 py-2 flex gap-1.5 border-b border-border">
              <span className="w-2 h-2 rounded-full bg-slate-300" />
              <span className="w-2 h-2 rounded-full bg-slate-300" />
              <span className="w-2 h-2 rounded-full bg-slate-300" />
            </div>
            <div className="p-4 text-sm text-slate-700">
              <p>Hi Sarah,</p>
              <p className="mt-2">Thanks for reaching out! Let me know if you need anything else.</p>
              <p className="mt-2">Best,</p>
              <div className="border-t border-border mt-4 pt-3 text-xs">
                <p className="font-semibold text-slate-900">Alex Johnson</p>
                <p className="text-slate-500">Account Manager</p>
                <p className="text-slate-500">Example Company</p>
                <p className="text-slate-500">alex@example.com</p>
              </div>
              <div className="mt-4">
                <p className="text-sm font-semibold text-slate-900 mb-2">{settings.promptText}</p>
                <div className="flex flex-wrap gap-1.5">
                  {scale.map((n) => (
                    <button
                      key={n}
                      onClick={() => setPreviewRating(n)}
                      className={`w-7 h-7 rounded-full text-xs flex items-center justify-center transition-colors ${
                        previewRating === n ? "bg-berry-600 text-white" : "bg-slate-800 text-white hover:bg-slate-700"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-berry-600 mt-2">Click to rate your experience</p>
              </div>
            </div>
          </div>

          <Button variant="outline" size="sm" onClick={copyWidget} className="w-full">
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Copied" : "Copy Widget for Signature"}
          </Button>
          <p className="text-xs text-slate-500 text-center">
            Copy this widget and paste it directly into your email signature.
          </p>
        </div>
      </div>
    </div>
  );
}
