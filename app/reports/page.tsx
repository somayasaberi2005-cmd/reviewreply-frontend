"use client";

import { useEffect, useState } from "react";
import { getReportSummary } from "@/lib/api";
import type { DateRange } from "@/lib/api";
import { ReportSummary } from "@/lib/types";
import { useBusinessContext } from "@/lib/business-context";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, Clock, AlertCircle, Download } from "lucide-react";
import { downloadCsv } from "@/lib/csv-export";
import { getRatingDistribution } from "@/lib/api";
import { RatingChart } from "@/components/ui/rating-chart";

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
  const { businesses, selectedBusinessId } = useBusinessContext();
  const [range, setRange] = useState<DateRange>("all");
  const [report, setReport] = useState<ReportSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [distribution, setDistribution] = useState<number[]>([0, 0, 0, 0, 0]);

  function load() {
    setLoading(true);
    setError(false);
    getReportSummary(selectedBusinessId ?? undefined, range)
      .then((data) => {
        setReport(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
    getRatingDistribution(selectedBusinessId ?? undefined, range).then(setDistribution);
  }

  useEffect(load, [selectedBusinessId, range]);

  function handleExport() {
    if (!report) return;
    const businessName = businesses.find((b) => b.id === selectedBusinessId)?.name ?? "business";
    downloadCsv(`reviewreply-report-${businessName}.csv`, [
      ["Metric", "Value"],
      ["Reply rate", `${report.replyRate}%`],
      ["Avg. response time (hours)", `${report.avgResponseTimeHours}`],
      ["Positive sentiment", `${report.sentiment.positive}%`],
      ["Neutral sentiment", `${report.sentiment.neutral}%`],
      ["Negative sentiment", `${report.sentiment.negative}%`],
    ]);
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="page-title">Reports</h1>
          <p className="page-subtitle">Performance across your businesses</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-white border border-border rounded-lg p-0.5">
            {(["7d", "30d", "all"] as DateRange[]).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`text-xs font-medium px-3 py-1.5 rounded-md transition-colors ${
                  range === r ? "bg-berry-600 text-white" : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {r === "7d" ? "7 days" : r === "30d" ? "30 days" : "All time"}
              </button>
            ))}
          </div>

          {report && (
            <button
              onClick={handleExport}
              className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-md bg-white border border-border text-slate-700 hover:bg-slate-50"
            >
              <Download size={16} />
              Export CSV
            </button>
          )}
        </div>
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
      ) : report.replyRate === 0 && report.sentiment.positive === 0 && report.sentiment.neutral === 0 && report.sentiment.negative === 0 ? (
        <div className="empty-state">
          <p className="font-medium text-slate-700">No reviews in this time range</p>
          <p className="empty-state-text">Try a wider date range to see more data.</p>
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

          <div className="card mb-4">
            <p className="font-medium text-slate-900 mb-4">Reviews by rating</p>
            <RatingChart distribution={distribution} />
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