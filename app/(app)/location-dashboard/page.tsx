"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getLocationDashboardSummary } from "@/lib/api";
import { useBusinessContext } from "@/lib/business-context";
import { LocationDashboardSummary } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles, X } from "lucide-react";

export default function LocationDashboardPage() {
  const { selectedBusinessId } = useBusinessContext();
  const [summary, setSummary] = useState<LocationDashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    if (!selectedBusinessId) return;
    setLoading(true);
    getLocationDashboardSummary(selectedBusinessId).then((data) => {
      setSummary(data);
      setLoading(false);
    });
  }, [selectedBusinessId]);

  if (loading || !summary) {
    return (
      <div>
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (summary.progressPercent / 100) * circumference;

  return (
    <div>
      {showBanner && (
        <div className="flex items-center justify-between bg-cyan-50 border border-cyan-200 rounded-lg px-4 py-2.5 mb-5 text-sm text-cyan-800">
          <span>Nice! You&apos;ll see this dashboard first when you navigate to a location.</span>
          <button onClick={() => setShowBanner(false)}>
            <X size={16} />
          </button>
        </div>
      )}

      <div className="flex items-center gap-3 mb-6">
        <h1 className="page-title">Welcome, {summary.userName}.</h1>
        <span className="text-xs font-medium px-2 py-1 rounded-full bg-pink-100 text-pink-700">
          Beta Dashboard
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card">
          <p className="font-semibold text-slate-900 mb-4">Progress</p>
          <div className="flex items-center gap-4">
            <svg width="90" height="90" viewBox="0 0 90 90">
              <circle cx="45" cy="45" r="40" fill="none" stroke="#f1f5f9" strokeWidth="8" />
              <circle
                cx="45"
                cy="45"
                r="40"
                fill="none"
                stroke="#5E8C2E"
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                transform="rotate(-90 45 45)"
              />
              <text x="45" y="50" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#0f172a">
                {summary.progressPercent}%
              </text>
            </svg>
            <div>
              <p className="text-sm text-slate-600">Building momentum with your review requests.</p>
              <Link href="/reports/success" className="text-xs text-berry-600 font-medium hover:underline">
                View Success Report &rarr;
              </Link>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <p className="font-semibold text-slate-900">Requests</p>
            <span className="text-xs text-slate-400">last 30 days</span>
          </div>
          <p className="text-3xl font-bold text-slate-900 mb-1">{summary.requestsSentLast30Days}</p>
          <p className="text-xs text-slate-500 mb-4">requests sent</p>
          <Link
            href="/requests/add-customer"
            className="text-xs font-medium px-3 py-1.5 rounded-md bg-berry-600 text-white hover:bg-berry-800 inline-block"
          >
            Send Requests &rarr;
          </Link>
        </div>

        <div className="card">
          <p className="font-semibold text-slate-900 mb-2">Replies</p>
          {summary.repliesAwaiting > 0 ? (
            <>
              <p className="text-3xl font-bold text-amber-600 mb-1">{summary.repliesAwaiting}</p>
              <p className="text-xs text-slate-500">awaiting reply</p>
            </>
          ) : (
            <p className="text-sm text-slate-500">Looks like no reviews need a reply at the moment.</p>
          )}
        </div>
      </div>

      {!summary.smartInsightsEnabled && (
        <div className="card mt-4 max-w-xl bg-gradient-to-br from-berry-50 to-white border-berry-200">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={16} className="text-berry-600" />
            <p className="font-semibold text-slate-900">Turn on Smart Insights</p>
          </div>
          <p className="text-sm text-slate-600 mb-3">
            Let AI analyze your feedback and surface what you&apos;re doing well and what to improve.
          </p>
          <Link
            href="/reports/smart-insights"
            className="text-xs font-medium px-3 py-1.5 rounded-md bg-berry-600 text-white hover:bg-berry-800 inline-block"
          >
            Get Started
          </Link>
        </div>
      )}
    </div>
  );
}
