"use client";

import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { getNpsReport, getNpsReportExtras } from "@/lib/api";
import { useBusinessContext } from "@/lib/business-context";
import { NpsReportSummary, NpsReportExtras } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { SavePdfButton } from "@/components/reports/SavePdfButton";

function NpsGauge({ score }: { score: number }) {
  const clamped = Math.max(-100, Math.min(100, score));
  const angle = ((clamped + 100) / 200) * 180;
  const needleRad = ((180 - angle) * Math.PI) / 180;
  const cx = 150;
  const cy = 140;
  const r = 110;
  const needleX = cx + r * 0.8 * Math.cos(needleRad);
  const needleY = cy - r * 0.8 * Math.sin(needleRad);

  function arcPath(startAngle: number, endAngle: number) {
    const toXY = (deg: number) => {
      const rad = (deg * Math.PI) / 180;
      return [cx - r * Math.cos(rad), cy - r * Math.sin(rad)];
    };
    const [x1, y1] = toXY(startAngle);
    const [x2, y2] = toXY(endAngle);
    return `M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`;
  }

  return (
    <svg viewBox="0 0 300 170" className="w-full max-w-sm">
      <path d={arcPath(180, 144)} stroke="#ef4444" strokeWidth={16} fill="none" strokeLinecap="round" />
      <path d={arcPath(144, 108)} stroke="#f59e0b" strokeWidth={16} fill="none" />
      <path d={arcPath(108, 72)} stroke="#e2e8f0" strokeWidth={16} fill="none" />
      <path d={arcPath(72, 36)} stroke="#5E8C2E" strokeWidth={16} fill="none" />
      <path d={arcPath(36, 0)} stroke="#22c55e" strokeWidth={16} fill="none" strokeLinecap="round" />

      <line x1={cx} y1={cy} x2={needleX} y2={needleY} stroke="#1e293b" strokeWidth={3} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={5} fill="#1e293b" />

      <text x={cx - r - 10} y={cy + 15} fontSize="12" fill="#ef4444">-100</text>
      <text x={cx - 8} y={cy - r - 8} fontSize="12" fill="#f59e0b">0</text>
      <text x={cx + r - 5} y={cy + 15} fontSize="12" fill="#22c55e">100</text>
      <text x={cx} y={cy + 35} fontSize="24" fontWeight="bold" fill="#0f172a" textAnchor="middle">
        {score}
      </text>
    </svg>
  );
}

export default function NpsReportPage() {
  const { selectedBusinessId } = useBusinessContext();
  const [data, setData] = useState<NpsReportSummary | null>(null);
  const [extras, setExtras] = useState<NpsReportExtras | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!selectedBusinessId) return;
    setLoading(true);
    Promise.all([getNpsReport(selectedBusinessId), getNpsReportExtras(selectedBusinessId)]).then(([result, extraData]) => {
      setData(result);
      setExtras(extraData);
      setLoading(false);
    });
  }, [selectedBusinessId]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="page-title">Net Promoter Score Report</h1>
        <SavePdfButton />
        <p className="page-subtitle">
          Dig into your Net Promoter Score and see your distribution of promoters, passives, and detractors.
        </p>
      </div>

      {loading || !data ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Skeleton className="h-64 w-full rounded-2xl" />
            <Skeleton className="h-64 w-full rounded-2xl" />
          </div>
          <Skeleton className="h-72 w-full rounded-2xl" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <div className="card flex flex-col items-center">
              <p className="text-sm font-medium text-slate-700 self-start mb-2">Net Promoter Score</p>
              <NpsGauge score={data.score} />
              <div className="flex items-center gap-2 text-sm mt-2">
                <span className="font-medium text-berry-700">{data.promoterPct}% Promoters</span>
                <span className="text-slate-400">-</span>
                <span className="font-medium text-red-600">{data.detractorPct}% Detractors</span>
                <span className="text-slate-400">=</span>
                <span className="font-bold text-slate-900">{data.score} NPS Score</span>
              </div>
            </div>

            <div className="card">
              <p className="text-sm font-medium text-slate-700 mb-4">NPS Categories</p>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="flex items-center gap-2 text-slate-700">
                      <span className="w-2 h-2 rounded-full bg-berry-500" /> Promoters (9/10)
                    </span>
                    <span className="font-medium text-slate-900">{data.promoterCount}</span>
                  </div>
                  <div className="bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-berry-500 h-full" style={{ width: `${data.promoterPct}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="flex items-center gap-2 text-slate-700">
                      <span className="w-2 h-2 rounded-full bg-amber-400" /> Passives (7/8)
                    </span>
                    <span className="font-medium text-slate-900">{data.passiveCount}</span>
                  </div>
                  <div className="bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-amber-400 h-full" style={{ width: `${data.passivePct}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="flex items-center gap-2 text-slate-700">
                      <span className="w-2 h-2 rounded-full bg-red-500" /> Detractors (0-6)
                    </span>
                    <span className="font-medium text-slate-900">{data.detractorCount}</span>
                  </div>
                  <div className="bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-red-500 h-full" style={{ width: `${data.detractorPct}%` }} />
                  </div>
                </div>
                <p className="text-xs text-slate-400 pt-2">Total responses: {data.totalResponses}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <p className="font-semibold text-slate-900 mb-4">Net Promoter Score: How are you doing month-to-month?</p>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={data.trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#64748b" }} />
                <YAxis domain={[-100, 100]} tick={{ fontSize: 12, fill: "#64748b" }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }} />
                <Line type="monotone" dataKey="score" name="NPS" stroke="#5E8C2E" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        
          {extras && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
              <div className="card">
                <p className="font-semibold text-slate-900 mb-1">Reviews</p>
                <p className="text-xs text-slate-500 mb-4">View your progress on 3rd-party review sites.</p>
                <div className="flex items-center justify-between text-sm mb-4">
                  <span className="text-slate-700">Google</span>
                  <span className="font-bold text-slate-900">{extras.yourRating.toFixed(1)}</span>
                  <span className="text-xs text-slate-400">Total: {extras.yourTotalReviews}</span>
                </div>
                <p className="text-xs text-slate-500 mb-1">Industry Averages</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-700">Google (Average)</span>
                  <span className="font-medium text-slate-600">{extras.industryAverageRating.toFixed(1)}</span>
                </div>
              </div>

              <div className="card">
                <p className="font-semibold text-slate-900 mb-1">Feedback Process</p>
                <p className="text-xs text-slate-500 mb-4">View your data in the feedback process stages.</p>
                <div className="space-y-3">
                  {extras.feedbackProcess.map((stage) => (
                    <div key={stage.label} className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">{stage.label}</span>
                      <span className="font-medium text-slate-900">{stage.count}</span>
                      <span className="text-xs text-slate-400">{stage.percentOfPrevious}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {extras && (
            <div className="card mt-4">
              <p className="font-semibold text-slate-900 mb-1">Additional Entry Points</p>
              <p className="text-xs text-slate-500 mb-4">How customers enter the feedback process outside of email requests.</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {extras.entryPoints.map((point) => (
                  <div key={point.label} className="text-center">
                    <p className="text-2xl font-bold text-slate-900">{point.count}</p>
                    <p className="text-xs text-slate-500">{point.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}


