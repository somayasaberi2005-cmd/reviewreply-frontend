"use client";

import { useEffect, useMemo, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { getReviewsReport } from "@/lib/api";
import { useBusinessContext } from "@/lib/business-context";
import { ReviewsReportSummary } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { SavePdfButton } from "@/components/reports/SavePdfButton";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, Star } from "lucide-react";

function Stars({ rating }: { rating: number }) {
  return (
    <span className="text-berry-600 text-sm">
      {"\u2605".repeat(rating)}
      <span className="text-slate-300">{"\u2606".repeat(5 - rating)}</span>
    </span>
  );
}

export default function ReviewsReportPage() {
  const { selectedBusinessId } = useBusinessContext();
  const [data, setData] = useState<ReviewsReportSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"reviews" | "comparison">("reviews");

  useEffect(() => {
    if (!selectedBusinessId) return;
    setLoading(true);
    getReviewsReport(selectedBusinessId).then((result) => {
      setData(result);
      setLoading(false);
    });
  }, [selectedBusinessId]);

  const filteredDetails = useMemo(() => {
    if (!data) return [];
    const query = search.toLowerCase();
    return data.details.filter(
      (d) =>
        query === "" ||
        d.name.toLowerCase().includes(query) ||
        d.reviewContent.toLowerCase().includes(query) ||
        d.site.toLowerCase().includes(query)
    );
  }, [data, search]);

  function downloadCsv() {
    if (!data) return;
    const header = "Site,Rating,Review Content,Date,Name\n";
    const rows = data.details
      .map((d) => `${d.site},${d.rating},"${d.reviewContent.replace(/"/g, '""')}",${d.date},${d.name}`)
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "reviews-report.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="page-title">Reviews Report</h1>
          <p className="page-subtitle">Evaluate and compare your progress for review volume and rating type.</p>
        </div>
        <select className="text-sm border border-border rounded-md px-3 py-2 h-fit">
          <option>Date Range: Past Year</option>
          <option>Date Range: Past 90 Days</option>
          <option>Date Range: Past 30 Days</option>
        </select>
      </div>

      <div className="flex gap-2 mb-5">
        <button
          onClick={() => setTab("reviews")}
          className={`text-sm font-medium px-3 py-1.5 rounded-full ${
            tab === "reviews" ? "bg-berry-600 text-white" : "bg-white border border-border text-slate-600"
          }`}
        >
          Reviews
        </button>
        <button
          onClick={() => setTab("comparison")}
          className={`text-sm font-medium px-3 py-1.5 rounded-full ${
            tab === "comparison" ? "bg-berry-600 text-white" : "bg-white border border-border text-slate-600"
          }`}
        >
          Comparison
        </button>
      </div>

      {loading || !data ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-48 w-full rounded-2xl" />
            ))}
          </div>
          <Skeleton className="h-72 w-full rounded-2xl" />
        </div>
      ) : tab === "comparison" ? (
        <div className="empty-state">
          <p className="font-medium text-slate-700">Comparison view coming soon</p>
          <p className="empty-state-text">Compare this location against others once you add more businesses.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <div className="card flex flex-col items-center text-center">
              <p className="text-xs text-slate-500 mb-3">Overall Review Rating</p>
              <div className="w-20 h-20 rounded-full bg-berry-600 text-white flex items-center justify-center text-2xl font-bold mb-2">
                {data.overallRating.toFixed(1)}
              </div>
              <Stars rating={Math.round(data.overallRating)} />
              <p className="text-xs text-slate-500 mt-1">{data.totalReviews} Reviews</p>
              <div className="flex gap-4 mt-3 text-xs text-berry-700 font-medium">
                <span>+{data.newLast30Days} last 30 days</span>
                <span>+{data.newSinceJoining} since joining</span>
              </div>
            </div>

            <div className="card">
              <p className="text-xs text-slate-500 mb-3">Rating Types</p>
              <div className="space-y-2">
                {data.ratingBreakdown.map((r) => (
                  <div key={r.stars} className="flex items-center gap-2 text-xs">
                    <span className="w-10 text-slate-500">{r.stars} Stars</span>
                    <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-amber-400 h-full rounded-full"
                        style={{ width: `${(r.count / data.totalReviews) * 100}%` }}
                      />
                    </div>
                    <span className="w-4 text-right text-slate-600">{r.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <p className="text-xs text-slate-500 mb-3">Review Sources</p>
              <div className="space-y-2">
                {data.sources.map((s) => (
                  <div
                    key={s.name}
                    className="flex items-center justify-between text-sm border border-border rounded-md px-3 py-2"
                  >
                    <span className="text-slate-700">{s.name}</span>
                    <span className="font-medium text-slate-900">{s.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card mb-6">
            <p className="font-semibold text-slate-900 mb-4">Online Reviews by Month</p>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={data.monthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#64748b" }} />
                <YAxis tick={{ fontSize: 12, fill: "#64748b" }} allowDecimals={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }} />
                <Bar dataKey="count" name="Reviews" fill="#8BC34A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <p className="font-semibold text-slate-900">Review Details</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="text-sm border border-border rounded-md px-3 py-1.5"
                />
                <SavePdfButton />
                <Button variant="outline" size="sm" onClick={downloadCsv}>
                  <Download size={14} /> Download CSV
                </Button>
              </div>
            </div>

            {filteredDetails.length === 0 ? (
              <div className="empty-state">
                <p className="font-medium text-slate-700">No reviews match your search</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-xs text-slate-500">
                      <th className="py-2 pr-4">Site</th>
                      <th className="py-2 pr-4">Rating</th>
                      <th className="py-2 pr-4">Review Content</th>
                      <th className="py-2 pr-4">Date</th>
                      <th className="py-2 pr-4">Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDetails.map((d) => (
                      <tr key={d.id} className="border-b border-border last:border-0">
                        <td className="py-2 pr-4 text-slate-700">{d.site}</td>
                        <td className="py-2 pr-4">
                          <Stars rating={d.rating} />
                        </td>
                        <td className="py-2 pr-4 text-slate-700 max-w-xs truncate">{d.reviewContent}</td>
                        <td className="py-2 pr-4 text-slate-500">{d.date}</td>
                        <td className="py-2 pr-4 text-slate-700">{d.name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

