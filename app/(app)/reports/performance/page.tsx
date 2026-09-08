"use client";

import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { getPerformanceReport } from "@/lib/api";
import { useBusinessContext } from "@/lib/business-context";
import { PerformanceSummary } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { SavePdfButton } from "@/components/reports/SavePdfButton";
import { Send, MailOpen, MessageSquare, MousePointerClick, Star, FileDown } from "lucide-react";

function StatCard({
  icon: Icon,
  label,
  value,
  sublabel,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sublabel?: string;
}) {
  return (
    <div className="card">
      <div className="stat-icon bg-berry-50">
        <Icon size={18} className="text-berry-600" />
      </div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <p className="text-xs text-slate-500 mt-0.5">{label}</p>
      {sublabel && <p className="text-xs text-berry-600 font-medium mt-1">{sublabel}</p>}
    </div>
  );
}

export default function PerformanceReportPage() {
  const { selectedBusinessId } = useBusinessContext();
  const [data, setData] = useState<PerformanceSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!selectedBusinessId) return;
    setLoading(true);
    getPerformanceReport(selectedBusinessId).then((result) => {
      setData(result);
      setLoading(false);
    });
  }, [selectedBusinessId]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="page-title">Performance Report</h1>
        <p className="page-subtitle">Track how your review requests are performing over time.</p>
        <button onClick={() => window.print()} className="no-print text-sm font-medium px-3 py-1.5 rounded-md border border-border text-slate-600 hover:bg-slate-50 flex items-center gap-1.5 mt-3"><FileDown size={14} /> Save as PDF</button>
      </div>

      {loading || !data ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-24 w-full rounded-2xl" />
            ))}
          </div>
          <Skeleton className="h-80 w-full rounded-2xl" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <StatCard icon={Send} label="Requests Sent" value={data.requestsSent} />
            <StatCard icon={MailOpen} label="Opens" value={data.opens} sublabel={`${data.openRate}% open rate`} />
            <StatCard
              icon={MessageSquare}
              label="Feedback Received"
              value={data.feedbackReceived}
              sublabel={`${data.feedbackRate}% feedback rate`}
            />
            <StatCard icon={MousePointerClick} label="Review Clicks" value={data.reviewClicks} />
            <StatCard icon={Star} label="New Reviews" value={data.newReviews} />
          </div>

          <div className="card">
            <p className="font-semibold text-slate-900 mb-4">Requests vs. Feedback Over Time</p>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={data.trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#64748b" }} />
                <YAxis tick={{ fontSize: 12, fill: "#64748b" }} />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line
                  type="monotone"
                  dataKey="requestsSent"
                  name="Requests Sent"
                  stroke="#5E8C2E"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="feedbackReceived"
                  name="Feedback Received"
                  stroke="#8BC34A"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}


