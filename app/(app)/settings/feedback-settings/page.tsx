"use client";

import { useEffect, useState } from "react";
import { getFeedbackSettings, updateFeedbackSettings } from "@/lib/api";
import { useBusinessContext } from "@/lib/business-context";
import { useToast } from "@/lib/toast-context";
import { FeedbackSettings, SendMethod, RatingType, RatingOrder } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Copy, Check } from "lucide-react";

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`flex-shrink-0 w-9 h-5 rounded-full transition-colors relative ${
        checked ? "bg-berry-600" : "bg-slate-200"
      }`}
    >
      <span
        className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
          checked ? "translate-x-4" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

export default function FeedbackSettingsPage() {
  const { selectedBusinessId } = useBusinessContext();
  const { showToast } = useToast();
  const [settings, setSettings] = useState<FeedbackSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!selectedBusinessId) return;
    setLoading(true);
    getFeedbackSettings(selectedBusinessId).then((data) => {
      setSettings(data);
      setLoading(false);
    });
  }, [selectedBusinessId]);

  if (loading || !settings) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="page-title">Feedback Settings</h1>
          <p className="page-subtitle">Loading...</p>
        </div>
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  function update(changes: Partial<FeedbackSettings>) {
    setSettings((prev) => (prev ? { ...prev, ...changes } : prev));
  }

  async function handleSave() {
    if (!selectedBusinessId || !settings) return;
    setSaving(true);
    try {
      await updateFeedbackSettings(selectedBusinessId, settings);
      showToast("Feedback settings saved");
    } finally {
      setSaving(false);
    }
  }

  async function copyUrl() {
    if (!settings) return;
    await navigator.clipboard.writeText(settings.feedbackUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="page-title">Feedback Settings</h1>
        <p className="page-subtitle">Control and customize your feedback settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <p className="font-semibold text-slate-900 mb-4">Sending Settings</p>

            <label className="flex items-center gap-2 mb-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.useCustomReplyEmail}
                onChange={(e) => update({ useCustomReplyEmail: e.target.checked })}
                className="rounded border-border"
              />
              <span className="text-sm text-slate-700">Send replies to a custom email address</span>
            </label>
            {settings.useCustomReplyEmail && (
              <div className="flex gap-2 mb-4 ml-6">
                <input
                  type="email"
                  value={settings.replyToEmail}
                  onChange={(e) => update({ replyToEmail: e.target.value })}
                  className="text-sm border border-border rounded-md px-3 py-1.5 flex-1 sm:max-w-xs"
                />
              </div>
            )}

            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-sm font-medium text-slate-700">Repeat Customer Feedback</p>
                <p className="text-xs text-slate-500">
                  Set the number of days to wait before allowing repeat feedback from the same customer.
                </p>
              </div>
              <Toggle
                checked={settings.repeatFeedbackThresholdEnabled}
                onChange={() => update({ repeatFeedbackThresholdEnabled: !settings.repeatFeedbackThresholdEnabled })}
              />
            </div>
            {settings.repeatFeedbackThresholdEnabled && (
              <div className="flex items-center gap-2 mb-4 ml-0">
                <input
                  type="number"
                  min={1}
                  max={365}
                  value={settings.repeatFeedbackThresholdDays}
                  onChange={(e) => update({ repeatFeedbackThresholdDays: Number(e.target.value) })}
                  className="w-20 text-sm border border-border rounded-md px-3 py-1.5"
                />
                <span className="text-sm text-slate-600">days</span>
              </div>
            )}

            <p className="text-sm font-medium text-slate-700 mb-2">Default Send Method</p>
            <div className="space-y-1">
              {(["email", "sms", "both"] as SendMethod[]).map((method) => (
                <label key={method} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    checked={settings.defaultSendMethod === method}
                    onChange={() => update({ defaultSendMethod: method })}
                  />
                  {method === "both" ? "Send both simultaneously" : method === "sms" ? "SMS" : "Email"}
                </label>
              ))}
            </div>
          </div>

          <div className="card">
            <p className="font-semibold text-slate-900 mb-4">Rating Settings</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm text-slate-700 mb-1">Feedback Rating Type</label>
                <select
                  value={settings.ratingType}
                  onChange={(e) => update({ ratingType: e.target.value as RatingType })}
                  className="w-full text-sm border border-border rounded-md px-3 py-2"
                >
                  <option value="nps">NPS</option>
                  <option value="star">Star Rating</option>
                  <option value="thumbs">Thumbs Up/Down</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-1">NPS Order</label>
                <select
                  value={settings.ratingOrder}
                  onChange={(e) => update({ ratingOrder: e.target.value as RatingOrder })}
                  className="w-full text-sm border border-border rounded-md px-3 py-2"
                >
                  <option value="low_to_high">Low to High (0-10)</option>
                  <option value="high_to_low">High to Low (10-0)</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm text-slate-700 mb-1">Positive Feedback Threshold</label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600">Show positive page when the rating is</span>
                <select
                  value={settings.positiveFeedbackThreshold}
                  onChange={(e) => update({ positiveFeedbackThreshold: Number(e.target.value) })}
                  className="text-sm border border-border rounded-md px-2 py-1.5"
                >
                  {Array.from({ length: 11 }, (_, i) => i).map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
                <span className="text-sm text-slate-600">or higher</span>
              </div>
            </div>
          </div>

          <div className="card">
            <p className="font-semibold text-slate-900 mb-4">Landing Page Settings</p>
            <div className="space-y-4">
              {[
                {
                  key: "smartAutoDirect" as const,
                  title: "Smart Auto Direct",
                  desc: "Automatically directs feedback to Facebook or Google for review, bypassing other options on your review form.",
                },
                {
                  key: "permissionToPostReview" as const,
                  title: "Permission to Post Review on Your Website Checkbox",
                  desc: "Adds a checkbox letting customers consent to having their name and review used publicly, including on your review site profile.",
                },
                {
                  key: "askMobilePhone" as const,
                  title: "Ask for Customer's Mobile Phone Number",
                  desc: "Adds an entry field marked as optional for a customer's mobile number.",
                },
                {
                  key: "askJobId" as const,
                  title: "Ask for Customer's Job ID",
                  desc: "Adds a field to collect order numbers, invoice numbers, or other identifiers.",
                },
                {
                  key: "showBusinessAddressPhone" as const,
                  title: "Show Business Address and Phone Number",
                  desc: "Option to add your business address and phone number to feedback landing pages.",
                },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-700">{item.title}</p>
                    <p className="text-xs text-slate-500">{item.desc}</p>
                  </div>
                  <Toggle checked={settings[item.key]} onChange={() => update({ [item.key]: !settings[item.key] })} />
                </div>
              ))}
            </div>
          </div>

          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Settings"}
          </Button>
        </div>

        <div className="card h-fit">
          <p className="font-semibold text-slate-900 mb-1">Leave Feedback URL</p>
          <p className="text-sm text-slate-500 mb-4">
            This URL is unique to your location and can be added to websites, pasted into social media
            posts, email signatures, existing newsletters, or printed materials like invoices, SMS,
            kiosks, receipts, business cards, and QR codes.
          </p>
          <div className="flex items-center gap-2 bg-slate-50 border border-border rounded-md px-3 py-2 mb-2 overflow-hidden">
            <span className="text-xs text-slate-600 truncate flex-1">{settings.feedbackUrl}</span>
          </div>
          <Button variant="outline" size="sm" onClick={copyUrl} className="w-full mb-4">
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Copied" : "Copy"}
          </Button>
          <div className="bg-white border border-border rounded-lg p-3 flex items-center justify-center">
            <svg width="120" height="120" viewBox="0 0 120 120">
              <rect width="120" height="120" fill="white" />
              {Array.from({ length: 12 }, (_, row) =>
                Array.from({ length: 12 }, (_, col) => {
                  const seed = (row * 12 + col + settings.feedbackUrl.length) % 3;
                  return seed === 0 ? (
                    <rect key={`${row}-${col}`} x={col * 10} y={row * 10} width={10} height={10} fill="#0f172a" />
                  ) : null;
                })
              )}
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

