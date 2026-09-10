"use client";

import { useState } from "react";
import { getReviewDefenseSummary, auditBusinessForSuspiciousReviews } from "@/lib/api";
import { useBusinessContext } from "@/lib/business-context";
import { useToast } from "@/lib/toast-context";
import { ReviewDefenseSummary } from "@/lib/types";
import { Button } from "@/components/ui/button";

export default function ReviewDefensePage() {
  const { selectedBusinessId } = useBusinessContext();
  const { showToast } = useToast();
  const [summary, setSummary] = useState<ReviewDefenseSummary | null>(null);
  const [auditing, setAuditing] = useState(false);

  async function handleAudit() {
    if (!selectedBusinessId) return;
    setAuditing(true);
    try {
      await auditBusinessForSuspiciousReviews(selectedBusinessId);
      const data = await getReviewDefenseSummary(selectedBusinessId);
      setSummary(data);
      showToast("Audit complete");
    } finally {
      setAuditing(false);
    }
  }

  const total = summary
    ? summary.totalLifetimeReviews.active +
      summary.totalLifetimeReviews.suspicious +
      summary.totalLifetimeReviews.inDispute +
      summary.totalLifetimeReviews.removed
    : 0;

  return (
    <div>
      <div className="mb-6">
        <h1 className="page-title">Defend Your Reputation</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6 max-w-3xl">
        <div className="card">
          <p className="text-sm font-medium text-slate-700 mb-3">Total Lifetime Reviews</p>
          {summary ? (
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Active</span>
                <span className="font-medium text-slate-900">{summary.totalLifetimeReviews.active}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Suspicious</span>
                <span className="font-medium text-amber-600">{summary.totalLifetimeReviews.suspicious}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">In Dispute</span>
                <span className="font-medium text-red-600">{summary.totalLifetimeReviews.inDispute}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Removed</span>
                <span className="font-medium text-slate-400">{summary.totalLifetimeReviews.removed}</span>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-3 bg-slate-100 rounded blur-[2px]" />
              ))}
            </div>
          )}
        </div>

        <div className="card flex flex-col items-center justify-center text-center">
          <p className="text-sm font-medium text-slate-700 mb-3">Suspected AI Reviews</p>
          {summary ? (
            <div className="relative w-24 h-24">
              <svg viewBox="0 0 36 36" className="w-24 h-24 -rotate-90">
                <circle cx="18" cy="18" r="16" fill="none" stroke="#f1f5f9" strokeWidth="4" />
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  stroke="#dc2626"
                  strokeWidth="4"
                  strokeDasharray={`${summary.suspectedAiPercent} 100`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-lg font-bold text-slate-900">
                {summary.suspectedAiPercent}%
              </div>
            </div>
          ) : (
            <div className="w-24 h-24 rounded-full border-8 border-slate-100 blur-[2px]" />
          )}
        </div>

        <div className="card">
          <p className="text-sm font-medium text-slate-700 mb-1">Impressions Impact</p>
          <p className="text-xs text-slate-500 mb-3">Legitimate vs. Suspicious Reviews</p>
          {summary ? (
            <div className="flex h-2 rounded-full overflow-hidden bg-slate-100">
              <div className="bg-berry-500" style={{ width: `${summary.legitimateImpressions}%` }} />
              <div className="bg-red-400" style={{ width: `${summary.suspiciousImpressions}%` }} />
            </div>
          ) : (
            <div className="h-2 bg-slate-100 rounded-full blur-[2px]" />
          )}
        </div>
      </div>

      <p className="text-sm text-slate-600 max-w-xl mb-5">
        The Review Defense Report protects your reputation from terms of service violations and fake
        reviews that put your profile at risk. Click audit to identify suspicious reviews on your
        profile that may require removal.
      </p>

      <Button onClick={handleAudit} disabled={auditing}>
        {auditing ? "Auditing..." : "Audit My Business for Suspicious Reviews"}
      </Button>
    </div>
  );
}
