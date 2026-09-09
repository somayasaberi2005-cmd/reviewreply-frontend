"use client";

import { useEffect, useState } from "react";
import { getReviewWidgetSettings, updateReviewWidgetSettings, getReviewWidgetEmbedCode } from "@/lib/api";
import { useBusinessContext } from "@/lib/business-context";
import { useToast } from "@/lib/toast-context";
import { ReviewWidgetSettings, WidgetLayout } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Check, Copy, Star } from "lucide-react";

const layoutOptions: { id: WidgetLayout; name: string; description: string }[] = [
  { id: "vertical", name: "Vertical", description: "A layout roughly 1000px wide with reviews stacked vertically." },
  { id: "horizontal", name: "Horizontal", description: "Fills the width of the page and is roughly 900px in height." },
  { id: "full_page", name: "Full Page", description: "Fills an entire website page with reviews and feedback content." },
  { id: "data_only", name: "Data Only", description: "Use just the review data to fully customize the layout yourself." },
];

function MiniPreview({ layout }: { layout: WidgetLayout }) {
  if (layout === "data_only") {
    return (
      <div className="bg-slate-900 rounded-md h-24 flex items-center justify-center text-[10px] text-berry-400 font-mono">
        {"{ }"} JSON
      </div>
    );
  }
  return (
    <div
      className={`bg-slate-50 border border-border rounded-md h-24 p-2 flex ${
        layout === "vertical" ? "flex-col gap-1" : "flex-row gap-2"
      }`}
    >
      <div className="flex items-center gap-1">
        <span className="text-xs font-bold text-slate-700">4.5</span>
        <div className="flex">
          {[0, 1, 2, 3].map((i) => (
            <Star key={i} size={8} className="fill-amber-400 text-amber-400" />
          ))}
          <Star size={8} className="text-slate-300" />
        </div>
      </div>
      <div className={`flex ${layout === "vertical" ? "flex-col gap-1" : "flex-row gap-1 flex-1"}`}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white border border-border rounded p-1 flex-1">
            <div className="h-1 bg-slate-200 rounded w-3/4 mb-1" />
            <div className="h-1 bg-slate-100 rounded w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ReviewWidgetPage() {
  const { selectedBusinessId } = useBusinessContext();
  const { showToast } = useToast();
  const [settings, setSettings] = useState<ReviewWidgetSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!selectedBusinessId) return;
    setLoading(true);
    getReviewWidgetSettings(selectedBusinessId).then((data) => {
      setSettings(data);
      setLoading(false);
    });
  }, [selectedBusinessId]);

  if (loading || !settings) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="page-title">Review Widget</h1>
          <p className="page-subtitle">Loading...</p>
        </div>
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  function update(changes: Partial<ReviewWidgetSettings>) {
    setSettings((prev) => (prev ? { ...prev, ...changes } : prev));
  }

  async function saveAndContinue() {
    if (!selectedBusinessId || !settings) return;
    await updateReviewWidgetSettings(selectedBusinessId, settings);
    setStep((s) => Math.min(s + 1, 3));
  }

  async function activate() {
    if (!selectedBusinessId || !settings) return;
    await updateReviewWidgetSettings(selectedBusinessId, { ...settings, active: true });
    update({ active: true });
    showToast("Review Widget activated");
  }

  async function copyEmbed() {
    if (!selectedBusinessId || !settings) return;
    await navigator.clipboard.writeText(getReviewWidgetEmbedCode(selectedBusinessId, settings.layout));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">Review Widget</h1>
          <p className="page-subtitle">
            {settings.active ? (
              <span className="text-berry-600 font-medium">Active</span>
            ) : (
              <span className="text-slate-400">Not active</span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          {[1, 2, 3].map((s) => (
            <span
              key={s}
              className={`w-2 h-2 rounded-full ${s === step ? "bg-berry-600" : "bg-slate-200"}`}
            />
          ))}
        </div>
      </div>

      {step === 1 && (
        <div className="card">
          <p className="text-sm font-semibold text-berry-700 mb-1">Step 1 of 3: Layout</p>
          <p className="text-sm text-slate-500 mb-5">Select one of the layout options for your widget.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {layoutOptions.map((option) => (
              <div
                key={option.id}
                className={`border rounded-xl p-4 cursor-pointer transition-colors ${
                  settings.layout === option.id ? "border-berry-400 ring-1 ring-berry-200" : "border-border"
                }`}
                onClick={() => update({ layout: option.id })}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-slate-900">{option.name}</p>
                  {settings.layout === option.id && (
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-berry-600 text-white">
                      Active Layout
                    </span>
                  )}
                </div>
                <MiniPreview layout={option.id} />
                <p className="text-xs text-slate-500 mt-2">{option.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-5">
            <Button onClick={saveAndContinue}>Save &amp; Continue to Step 2: Settings</Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="card max-w-xl">
          <p className="text-sm font-semibold text-berry-700 mb-1">Step 2 of 3: Settings</p>
          <p className="text-sm text-slate-500 mb-5">Choose what content appears in your widget.</p>

          <div className="space-y-4 mb-5">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-slate-700">Show rating summary</span>
              <input
                type="checkbox"
                checked={settings.showRatingSummary}
                onChange={(e) => update({ showRatingSummary: e.target.checked })}
                className="rounded border-border"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-slate-700">Show individual reviews</span>
              <input
                type="checkbox"
                checked={settings.showIndividualReviews}
                onChange={(e) => update({ showIndividualReviews: e.target.checked })}
                className="rounded border-border"
              />
            </label>
            <div>
              <label className="block text-sm text-slate-700 mb-1">Minimum rating to display</label>
              <select
                value={settings.minRatingToShow}
                onChange={(e) => update({ minRatingToShow: Number(e.target.value) })}
                className="text-sm border border-border rounded-md px-3 py-2"
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n} stars and up
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button onClick={saveAndContinue}>Save &amp; Continue to Step 3: Embed Code</Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="card max-w-xl">
          <p className="text-sm font-semibold text-berry-700 mb-1">Step 3 of 3: Embed Code</p>
          <p className="text-sm text-slate-500 mb-5">
            Copy this code and paste it into your website where you want the widget to appear.
          </p>

          <div className="bg-slate-900 text-slate-100 rounded-lg p-3 text-xs font-mono mb-3 overflow-x-auto">
            {selectedBusinessId && getReviewWidgetEmbedCode(selectedBusinessId, settings.layout)}
          </div>

          <div className="flex gap-2 mb-5">
            <Button variant="outline" size="sm" onClick={copyEmbed}>
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? "Copied" : "Get Embed Code"}
            </Button>
          </div>

          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setStep(2)}>
              Back
            </Button>
            <Button onClick={activate} disabled={settings.active}>
              {settings.active ? "Widget Active" : "Activate Widget"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

