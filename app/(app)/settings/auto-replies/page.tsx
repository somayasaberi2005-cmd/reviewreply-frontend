"use client";

import { useEffect, useState } from "react";
import { getAutoReplySettings, updateAutoReplySettings } from "@/lib/api";
import { useBusinessContext } from "@/lib/business-context";
import { useToast } from "@/lib/toast-context";
import { AutoReplySettings, AutoReplyReviewType, AutoReplyGenerationMethod } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";

export default function AutoRepliesPage() {
  const { selectedBusinessId } = useBusinessContext();
  const { showToast } = useToast();
  const [settings, setSettings] = useState<AutoReplySettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!selectedBusinessId) return;
    setLoading(true);
    getAutoReplySettings(selectedBusinessId).then((data) => {
      setSettings(data);
      setLoading(false);
    });
  }, [selectedBusinessId]);

  if (loading || !settings) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="page-title">Auto-Reply Settings</h1>
          <p className="page-subtitle">Loading...</p>
        </div>
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  async function persist(next: AutoReplySettings) {
    if (!selectedBusinessId) return;
    setSettings(next);
    await updateAutoReplySettings(selectedBusinessId, next);
  }

  function toggleEnabled() {
    if (!settings) return;
    persist({ ...settings, enabled: !settings.enabled });
  }

  function setReviewType(type: AutoReplyReviewType) {
    if (!settings) return;
    persist({ ...settings, reviewType: type });
  }

  function toggleThreshold(key: keyof AutoReplySettings["ratingThresholds"]) {
    if (!settings) return;
    persist({
      ...settings,
      ratingThresholds: { ...settings.ratingThresholds, [key]: !settings.ratingThresholds[key] },
    });
  }

  function setGenerationMethod(method: AutoReplyGenerationMethod) {
    if (!settings) return;
    persist({ ...settings, generationMethod: method });
  }

  function setReplyWithoutText(value: boolean) {
    if (!settings) return;
    persist({ ...settings, replyToReviewsWithoutText: value });
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="page-title">Auto-Reply Settings</h1>
      </div>

      <div className="card mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-slate-900">Auto-Reply to Positive Reviews</p>
            <p className="text-sm text-slate-500 mt-1">
              Automatically respond to positive 1st and/or 3rd-party reviews.
            </p>
          </div>
          <button
            onClick={toggleEnabled}
            className={`flex-shrink-0 w-9 h-5 rounded-full transition-colors relative ${
              settings.enabled ? "bg-berry-600" : "bg-slate-200"
            }`}
          >
            <span
              className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                settings.enabled ? "translate-x-4" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>
      </div>

      <div className={settings.enabled ? "" : "opacity-50 pointer-events-none"}>
        <div className="card mb-4">
          <p className="font-semibold text-slate-900 mb-1">1. Review Type</p>
          <p className="text-sm text-slate-500 mb-4">What kind of reviews would you like to reply to automatically?</p>
          <div className="space-y-2 mb-3">
            <label className="flex items-start gap-2 text-sm text-slate-700 cursor-pointer">
              <input type="radio" checked={settings.reviewType === "first_party"} onChange={() => setReviewType("first_party")} className="mt-0.5" />
              <span>Private 1st-party reviews and direct feedback. Replies send via email.</span>
            </label>
            <label className="flex items-start gap-2 text-sm text-slate-700 cursor-pointer">
              <input type="radio" checked={settings.reviewType === "third_party"} onChange={() => setReviewType("third_party")} className="mt-0.5" />
              <span>3rd-party reviews on sites like Google and Facebook. Replies post publicly.</span>
            </label>
            <label className="flex items-start gap-2 text-sm text-slate-700 cursor-pointer">
              <input type="radio" checked={settings.reviewType === "both"} onChange={() => setReviewType("both")} className="mt-0.5" />
              <span>Both 1st and 3rd-party reviews.</span>
            </label>
          </div>
          {!settings.googleFacebookAuthorized && settings.reviewType !== "first_party" && (
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-md px-3 py-2 text-xs text-amber-800">
              <AlertCircle size={14} className="flex-shrink-0" />
              No authorized Google or Facebook account has been detected for this business.{" "}
              <a href="/settings" className="underline font-medium">Go to Authorization Settings</a>
            </div>
          )}
        </div>

        <div className="card mb-4">
          <p className="font-semibold text-slate-900 mb-1">2. Rating Threshold</p>
          <p className="text-sm text-slate-500 mb-4">Choose which ratings can trigger an Auto-Reply.</p>
          <div className="space-y-2 mb-3">
            <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
              <input type="checkbox" checked={settings.ratingThresholds.fiveStar} onChange={() => toggleThreshold("fiveStar")} className="rounded border-border" />
              5-star / 9-10 NPS / Thumbs Up
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
              <input type="checkbox" checked={settings.ratingThresholds.fourStar} onChange={() => toggleThreshold("fourStar")} className="rounded border-border" />
              4-star / 7-8 NPS
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
              <input type="checkbox" checked={settings.ratingThresholds.facebookRecommend} onChange={() => toggleThreshold("facebookRecommend")} className="rounded border-border" />
              Facebook recommends: Yes
            </label>
          </div>
          <p className="text-xs text-slate-500 bg-slate-50 rounded-md p-2">
            We also evaluate the sentiment of a review&apos;s written content. An Auto-Reply will not be
            sent if the sentiment is negative, even with a positive rating.
          </p>
        </div>

        <div className="card mb-4">
          <p className="font-semibold text-slate-900 mb-1">3. Reply Generation Method</p>
          <p className="text-sm text-slate-500 mb-4">How would you like to generate and send auto-replies?</p>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
              <input type="radio" checked={settings.generationMethod === "ai_writes"} onChange={() => setGenerationMethod("ai_writes")} />
              I want AI to write replies for me.
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
              <input type="radio" checked={settings.generationMethod === "template_library"} onChange={() => setGenerationMethod("template_library")} />
              I want AI to choose from my list of pre-written reply templates.
            </label>
          </div>
        </div>

        <div className="card mb-4">
          <p className="font-semibold text-slate-900 mb-1">4. Reviews Without Text</p>
          <p className="text-sm text-slate-500 mb-4">
            Some reviews will not have text and only a rating. Would you like us to Auto-Reply to
            reviews without text?
          </p>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
              <input type="radio" checked={settings.replyToReviewsWithoutText} onChange={() => setReplyWithoutText(true)} />
              Yes, post replies to reviews without text.
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
              <input type="radio" checked={!settings.replyToReviewsWithoutText} onChange={() => setReplyWithoutText(false)} />
              No, do not reply to reviews without text.
            </label>
          </div>
        </div>

        <div className="card">
          <p className="text-sm font-semibold text-slate-700 mb-1">Use your own discretion:</p>
          <p className="text-xs text-slate-500">
            By activating Auto-Reply, you take on full responsibility for ensuring the replies adhere
            to your industry&apos;s regulations and comply with necessary privacy standards, particularly
            important in sensitive sectors like healthcare.
          </p>
        </div>
      </div>
    </div>
  );
}
