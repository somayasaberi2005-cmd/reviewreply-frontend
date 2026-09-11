"use client";

import { useEffect, useMemo, useState } from "react";
import { getAgencyBusinesses } from "@/lib/api";
import { AgencyBusinessRow } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Tag, Search, TrendingUp, TrendingDown, Minus } from "lucide-react";

function TrendDot({ trend }: { trend: AgencyBusinessRow["trend"] }) {
  if (trend === "up") return <TrendingUp size={12} className="text-green-600" />;
  if (trend === "down") return <TrendingDown size={12} className="text-red-600" />;
  return <Minus size={12} className="text-slate-500" />;
}

export default function BusinessDashboardPage() {
  const [rows, setRows] = useState<AgencyBusinessRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [pageSize, setPageSize] = useState(25);

  useEffect(() => {
    setLoading(true);
    getAgencyBusinesses().then((data) => {
      setRows(data);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(
    () => rows.filter((r) => r.name.toLowerCase().includes(search.toLowerCase())),
    [rows, search]
  );

  function toggleSelect(id: string) {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  }

  function exportCsv() {
    const header =
      "Business Name,Short Name,Managers,Rating,Requests Sent,Open Rate,Requests Received,Review Clicks,Total Online Reviews\n";
    const csvRows = filtered
      .map(
        (r) =>
          `${r.name},${r.shortName},${r.managers.join("; ") || "-"},${r.rating ?? "-"},${r.requestsSent},${r.openRate}%,${r.requestsReceived},${r.reviewClicks},${r.totalOnlineReviews}`
      )
      .join("\n");
    const blob = new Blob([header + csvRows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "business-dashboard.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="page-title">Business Dashboard</h1>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex gap-2">
          <Button size="sm">
            <Plus size={14} /> Add business
          </Button>
          <Button size="sm" variant="outline">
            <Tag size={14} /> label
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-slate-700">Reporting Time Period</label>
          <select className="text-sm border border-border rounded-md px-3 py-1.5">
            <option>From the beginning</option>
            <option>Past 90 days</option>
            <option>Past 30 days</option>
          </select>
        </div>
      </div>

      {loading ? (
        <Skeleton className="h-72 w-full rounded-2xl" />
      ) : (
        <>
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <Search size={14} className="text-slate-400" />
              <input
                type="text"
                placeholder="search businesses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="text-sm border border-border rounded-md px-3 py-1.5 flex-1 sm:max-w-xs"
              />
              <span className="text-xs text-slate-400 ml-auto">1 to {filtered.length} of {filtered.length}</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs text-slate-500">
                    <th className="py-2 pr-3">
                      <input type="checkbox" className="rounded border-border" />
                    </th>
                    <th className="py-2 pr-4">Business Name</th>
                    <th className="py-2 pr-4">Short Name</th>
                    <th className="py-2 pr-4">Managers</th>
                    <th className="py-2 pr-4">Rating</th>
                    <th className="py-2 pr-4"># Feedback Requests Sent</th>
                    <th className="py-2 pr-4">Open Rate</th>
                    <th className="py-2 pr-4"># Feedback Requests Rec&apos;d</th>
                    <th className="py-2 pr-4">Clicks to Review Sites</th>
                    <th className="py-2 pr-4">Total Online Reviews</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => (
                    <tr key={r.id} className="border-b border-border last:border-0">
                      <td className="py-2 pr-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(r.id)}
                          onChange={() => toggleSelect(r.id)}
                          className="rounded border-border"
                        />
                      </td>
                      <td className="py-2 pr-4">
                        <p className="font-medium text-berry-700">{r.name}</p>
                        <p className="text-xs text-slate-400">{r.location}</p>
                      </td>
                      <td className="py-2 pr-4 text-slate-600 whitespace-nowrap">{r.shortName}</td>
                      <td className="py-2 pr-4 text-slate-600 whitespace-nowrap">{r.managers.join(", ") || "-"}</td>
                      <td className="py-2 pr-4 text-slate-700">{r.rating ?? "-"}</td>
                      <td className="py-2 pr-4">
                        <span className="flex items-center gap-1 text-slate-700">
                          <TrendDot trend={r.trend} /> {r.requestsSent}
                        </span>
                      </td>
                      <td className="py-2 pr-4 text-slate-700">{r.openRate}%</td>
                      <td className="py-2 pr-4 text-slate-700">{r.requestsReceived}</td>
                      <td className="py-2 pr-4 text-slate-700">{r.reviewClicks}</td>
                      <td className="py-2 pr-4 text-slate-700">{r.totalOnlineReviews}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4">
            <Button variant="outline" size="sm" onClick={exportCsv}>
              Export business data
            </Button>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                Show
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="border border-border rounded-md px-2 py-1"
                >
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>
              <span className="text-xs text-slate-400">1 to {filtered.length} of {filtered.length}</span>
            </div>
          </div>

          <div className="bg-slate-50 border border-border rounded-lg p-4 mt-4 max-w-xs text-xs text-slate-600">
            <p className="font-semibold text-slate-700 mb-1">Legend:</p>
            <p><span className="text-green-600 font-medium">Green</span> means trending up</p>
            <p><span className="text-red-600 font-medium">Red</span> means trending down</p>
            <p><span className="font-medium">Black</span> means same as last score</p>
          </div>
        </>
      )}
    </div>
  );
}
