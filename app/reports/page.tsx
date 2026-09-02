"use client";

import { useEffect, useState } from "react";
import { getReportSummary } from "@/lib/api";
import { ReportSummary } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, Clock, AlertCircle } from "lucide-react";

function SentimentBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="mb-3">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-slate-600">{label}</span>
        <span className="text-slate-500">{value}%</span>
      </div>
      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export default function ReportsPage() {
  const [report, setReport] = useState<ReportSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  function load() {
    setLoading(true);
    setError(false);
    getReportSummary()
      .then((data) => {
        setReport(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }

  useEffect(load, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="page-title">Reports</h1>
        <p className="page-subtitle">Performance across your businesses</p>
      </div>

      {error ? (
        <div className="empty-state">
          <AlertCircle className="text-red-400 mb-2" size={28} />
          <p className="font-medium text-slate-700">Couldn't load reports</p>
          <p className="empty-state-text mb-4">Something went wrong fetching your report data.</p>
          <button onClick={load} className="text-sm font-medium px-4 py-2 rounded-md bg-berry-600 text-white hover:bg-berry-800">
            Try again
          </button>
        </div>
      ) : loading || !report ? (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {[1, 2].map((i) => (
              <div key={i} className="card">
                <Skeleton className="w-10 h-10 rounded-xl mb-3" />
                <Skeleton className="h-3 w-24 mb-2" />
                <Skeleton className="h-6 w-16" />
              </div>
            ))}
          </div>
          <div className="card">
            <Skeleton className="h-4 w-32 mb-4" />
            <Skeleton className="h-3 w-full mb-2" />
            <Skeleton className="h-2 w-full mb-4" />
            <Skeleton className="h-3 w-full mb-2" />
            <Skeleton className="h-2 w-full mb-4" />
            <Skeleton className="h-3 w-full mb-2" />
            <Skeleton className="h-2 w-full" />
          </div>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="card">
              <div className="stat-icon bg-emerald-50">
                <TrendingUp size={18} className="text-emerald-600" />
              </div>
              <p className="text-sm text-slate-500">Reply rate</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{report.replyRate}%</p>
            </div>
            <div className="card">
              <div className="stat-icon bg-slate-100">
                <Clock size={18} className="text-slate-600" />
              </div>
              <p className="text-sm text-slate-500">Avg. response time</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{report.avgResponseTimeHours}h</p>
            </div>
          </div>

          <div className="card">
            <p className="font-medium text-slate-900 mb-4">Sentiment breakdown</p>
            <SentimentBar label="Positive" value={report.sentiment.positive} color="bg-berry-400" />
            <SentimentBar label="Neutral" value={report.sentiment.neutral} color="bg-amber-400" />
            <SentimentBar label="Negative" value={report.sentiment.negative} color="bg-red-400" />
          </div>
        </div>
      )}
    </div>
  );
}