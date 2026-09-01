"use client";

import { useEffect, useState } from "react";
import { getReportSummary } from "@/lib/api";
import { ReportSummary } from "@/lib/types";
import { TrendingUp, Clock } from "lucide-react";

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

  useEffect(() => {
    getReportSummary().then(setReport);
  }, []);

  if (!report) {
    return <p className="text-slate-500 text-sm">Loading reports...</p>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="page-title">Reports</h1>
        <p className="page-subtitle">Performance across your businesses</p>
      </div>

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
  );
}
