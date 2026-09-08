"use client";

import { useState } from "react";
import { generateSmartInsights } from "@/lib/api";
import { useBusinessContext } from "@/lib/business-context";
import { SmartInsight } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Target } from "lucide-react";

export default function SmartInsightsPage() {
  const { selectedBusinessId } = useBusinessContext();
  const [insights, setInsights] = useState<SmartInsight[] | null>(null);
  const [generating, setGenerating] = useState(false);

  async function handleGenerate() {
    if (!selectedBusinessId) return;
    setGenerating(true);
    try {
      const result = await generateSmartInsights(selectedBusinessId);
      setInsights(result);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="page-title">Smart Insights</h1>
        <p className="page-subtitle">You have got customer feedback. Now it is time to show them you are listening.</p>
      </div>

      <p className="text-sm text-slate-600 mb-5 max-w-2xl">
        Smart Insights uses AI analysis to turn feedback into actionable next steps. It reveals what
        you do well and what you can improve to take your business to the next level.
      </p>

      <div className="card max-w-xl mb-5">
        <div className="flex items-center gap-2 mb-4">
          <Target size={18} className="text-berry-600" />
          <p className="font-semibold text-slate-900">Areas for improvement</p>
        </div>

        {generating ? (
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3">
                <span className="text-sm font-medium text-slate-300">{i}.</span>
                <div className="flex-1 space-y-1.5">
                  <div className="h-2.5 bg-slate-100 rounded w-full" />
                  <div className="h-2.5 bg-slate-100 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : insights ? (
          <ol className="space-y-3">
            {insights.map((insight, i) => (
              <li key={insight.id} className="flex gap-3 text-sm text-slate-700">
                <span className="font-medium text-slate-400">{i + 1}.</span>
                <span>{insight.text}</span>
              </li>
            ))}
          </ol>
        ) : (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3">
                <span className="text-sm font-medium text-slate-300">{i}.</span>
                <div className="flex-1 space-y-1.5">
                  <div className="h-2.5 bg-slate-100 rounded w-full blur-[2px]" />
                  <div className="h-2.5 bg-slate-100 rounded w-2/3 blur-[2px]" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Button onClick={handleGenerate} disabled={generating}>
        {generating ? "Generating..." : insights ? "Regenerate My Insights" : "Generate My Insights"}
      </Button>
    </div>
  );
}
