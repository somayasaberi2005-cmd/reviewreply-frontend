"use client";

import { useEffect, useState } from "react";
import { getReviewBadgeSettings, updateReviewBadgeSettings, getReviewBadgeEmbedCode, getReviewWidgetSettings } from "@/lib/api";
import { useBusinessContext } from "@/lib/business-context";
import { useToast } from "@/lib/toast-context";
import { ReviewBadgeSettings, BadgeLayout, LinkTarget } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, Check, Copy } from "lucide-react";

const layoutOptions: { id: BadgeLayout; name: string; description: string }[] = [
  { id: "clean", name: "Clean", description: "The original badge, showing your overall rating and number of reviews." },
  { id: "modern", name: "Modern", description: "A modern design using your Review Widget color preferences." },
  { id: "minimal", name: "Minimal", description: "A simple design displaying your overall rating and review count." },
];

function BadgePreview({ layout }: { layout: BadgeLayout }) {
  if (layout === "modern") {
    return (
      <div className="bg-berry-600 text-white rounded-lg p-3 text-center w-40">
        <p className="text-xs font-medium mb-1">Business Name</p>
        <p className="text-2xl font-bold">4.6</p>
        <div className="flex justify-center gap-0.5 my-1">
          {[0, 1, 2, 3].map((i) => (
            <Star key={i} size={10} className="fill-amber-300 text-amber-300" />
          ))}
          <Star size={10} className="text-white/40" />
        </div>
        <p className="text-[10px] text-white/80">18 Total</p>
      </div>
    );
  }
  if (layout === "minimal") {
    return (
      <div className="flex items-center gap-1.5 text-sm">
        <span className="font-bold text-slate-900">4.6</span>
        <div className="flex">
          {[0, 1, 2, 3].map((i) => (
            <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
          ))}
          <Star size={12} className="text-slate-300" />
        </div>
        <span className="text-berry-600 underline text-xs">Read Our 18 Reviews</span>
      </div>
    );
  }
  return (
    <div className="border border-border rounded-lg p-3 text-center w-40 bg-white">
      <p className="text-[10px] text-slate-500 mb-1">Overall Rating / 18 Total Reviews</p>
      <p className="text-xl font-bold text-slate-900">4.6</p>
      <div className="flex justify-center gap-0.5 my-1">
        {[0, 1, 2, 3].map((i) => (
          <Star key={i} size={10} className="fill-amber-400 text-amber-400" />
        ))}
        <Star size={10} className="text-slate-300" />
      </div>
      <p className="text-[10px] text-berry-600 underline">Read Business Name&apos;s Reviews</p>
    </div>
  );
}

export default function ReviewBadgePage() {
  const { selectedBusinessId } = useBusinessContext();
  const { showToast } = useToast();
  const [settings, setSettings] = useState<ReviewBadgeSettings | null>(null);
  const [widgetActive, setWidgetActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!selectedBusinessId) return;
    setLoading(true);
    Promise.all([getReviewBadgeSettings(selectedBusinessId), getReviewWidgetSettings(selectedBusinessId)]).then(
      ([badgeData, widgetData]) => {
        setSettings(badgeData);
        setWidgetActive(widgetData.active);
        setLoading(false);
      }
    );
  }, [selectedBusinessId]);

  if (loading || !settings) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="page-title">Review Badge Settings</h1>
          <p className="page-subtitle">Loading...</p>
        </div>
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  async function update(changes: Partial<ReviewBadgeSettings>) {
    if (!selectedBusinessId || !settings) return;
    const next = { ...settings, ...changes };
    setSettings(next);
    await updateReviewBadgeSettings(selectedBusinessId, next);
  }

  async function copyEmbed() {
    if (!selectedBusinessId) return;
    await navigator.clipboard.writeText(getReviewBadgeEmbedCode(selectedBusinessId));
    setCopied(true);
    showToast("Embed code copied");
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="page-title">Review Badge Settings</h1>
      </div>

      <div className="card mb-6">
        <p className="text-sm font-semibold text-berry-700 mb-1">Step 1 of 1: Select a layout</p>
        <p className="text-sm text-slate-500 mb-5">
          The Review Badge can be placed on any page of your website and links to your feedback.
          Currently your Review Widget is{" "}
          <span className={widgetActive ? "text-berry-600 font-medium" : "text-red-600 font-medium"}>
            {widgetActive ? "active" : "not active"}
          </span>
          . You can grab the embed code for the badge and place it in your website.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {layoutOptions.map((option) => (
            <div
              key={option.id}
              onClick={() => update({ layout: option.id })}
              className={`border rounded-xl p-4 cursor-pointer transition-colors flex flex-col items-center ${
                settings.layout === option.id ? "border-berry-400 ring-1 ring-berry-200" : "border-border"
              }`}
            >
              <div className="flex items-center justify-between w-full mb-3">
                <p className="text-sm font-semibold text-slate-900">{option.name}</p>
                {settings.layout === option.id && (
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-berry-600 text-white">
                    Active
                  </span>
                )}
              </div>
              <BadgePreview layout={option.id} />
              <p className="text-xs text-slate-500 mt-3 text-center">{option.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card max-w-md">
        <p className="font-semibold text-slate-900 mb-1">Review Link Target</p>
        <p className="text-sm text-slate-500 mb-3">When a user clicks the badge, it will open in:</p>
        <select
          value={settings.linkTarget}
          onChange={(e) => update({ linkTarget: e.target.value as LinkTarget })}
          className="text-sm border border-border rounded-md px-3 py-2 mb-5 w-full"
        >
          <option value="new_tab">New browser tab</option>
          <option value="same_tab">Same tab</option>
        </select>

        <Button variant="outline" size="sm" onClick={copyEmbed}>
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? "Copied" : "Get Embed Code"}
        </Button>
      </div>
    </div>
  );
}
