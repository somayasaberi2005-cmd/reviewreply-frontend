"use client";

import { useEffect, useState } from "react";
import { getSuccessReport } from "@/lib/api";
import { useBusinessContext } from "@/lib/business-context";
import { SuccessReportSummary } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Download } from "lucide-react";

function Stars({ rating }: { rating: number }) {
  const rounded = Math.round(rating);
  return (
    <span className="text-berry-600 text-sm">
      {"\u2605".repeat(rounded)}
      <span className="text-slate-300">{"\u2606".repeat(5 - rounded)}</span>
    </span>
  );
}

export default function SuccessReportPage() {
  const { selectedBusinessId } = useBusinessContext();
  const [data, setData] = useState<SuccessReportSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!selectedBusinessId) return;
    setLoading(true);
    getSuccessReport(selectedBusinessId).then((result) => {
      setData(result);
      setLoading(false);
    });
  }, [selectedBusinessId]);

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
    a.download = "success-report.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  const filteredDetails = data
    ? data.details.filter(
        (d) =>
          search === "" ||
          d.name.toLowerCase().includes(search.toLowerCase()) ||
          d.reviewContent.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  return (
    <div>
      <div className="mb-6">
        <h1 className="page-title">Success Report</h1>
        <p className="page-subtitle">A one-page summary of your reputation&apos;s growth since joining.</p>
      </div>

      {loading || !data ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-48 w-full rounded-2xl" />
            ))}
          </div>
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <div className="card flex flex-col items-center text-center">
              <p className="text-xs text-slate-500 mb-3">Net Promoter Score</p>
              <div className="w-20 h-20 rounded-full bg-slate-900 text-white flex items-center justify-center text-2xl font-bold mb-2">
                {data.npsScore}
              </div>
              <p className="text-xs text-slate-500">Total Responses: {data.npsTotalResponses}</p>
              <div className="flex gap-4 mt-3 text-xs font-medium">
                <span className="text-berry-700">{data.npsPromoterPct}% Promoters</span>
                <span className="text-red-600">{data.npsDetractorPct}% Detractors</span>
              </div>
            </div>

            <div className="card flex flex-col items-center text-center">
              <p className="text-xs text-slate-500 mb-3">3rd-Party Online Reviews</p>
              <div className="w-20 h-20 rounded-full bg-berry-600 text-white flex items-center justify-center text-2xl font-bold mb-2">
                {data.thirdPartyRating.toFixed(1)}
              </div>
              <p className="text-xs text-slate-500">Total Reviews: {data.thirdPartyTotal}</p>
              <p className="text-xs text-berry-700 font-medium mt-1">
                +{data.thirdPartySinceJoining} since joining
              </p>
            </div>

            <div className="card flex flex-col items-center text-center">
              <p className="text-xs text-slate-500 mb-3">1st-Party Reviews</p>
              <div className="w-20 h-20 rounded-full bg-slate-700 text-white flex items-center justify-center text-2xl font-bold mb-2">
                {data.firstPartyRating.toFixed(1)}
              </div>
              <p className="text-xs text-slate-500">Total Reviews: {data.firstPartyTotal}</p>
              <p className="text-xs text-berry-700 font-medium mt-1">
                +{data.firstPartyLast30Days} last 30 days
              </p>
            </div>
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
