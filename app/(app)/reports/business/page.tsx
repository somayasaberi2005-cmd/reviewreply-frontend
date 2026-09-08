"use client";

import { useEffect, useMemo, useState } from "react";
import { getBusinessReport } from "@/lib/api";
import { BusinessReportRow } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, ArrowUpDown } from "lucide-react";

type SortKey = keyof BusinessReportRow;

export default function BusinessReportPage() {
  const [rows, setRows] = useState<BusinessReportRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("businessName");
  const [sortAsc, setSortAsc] = useState(true);

  useEffect(() => {
    setLoading(true);
    getBusinessReport().then((data) => {
      setRows(data);
      setLoading(false);
    });
  }, []);

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortAsc((prev) => !prev);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  }

  const filteredSorted = useMemo(() => {
    const filtered = rows.filter((r) => r.businessName.toLowerCase().includes(search.toLowerCase()));
    return [...filtered].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortAsc ? aVal - bVal : bVal - aVal;
      }
      return sortAsc
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [rows, search, sortKey, sortAsc]);

  function downloadCsv() {
    const header =
      "Business Name,Location ID,Rating,Requests Sent,Opens,Open Rate,Feedback Received,Feedback Rate,Response Rate,Review Clicks,New Reviews,Total Reviews\n";
    const csvRows = filteredSorted
      .map(
        (r) =>
          `${r.businessName},${r.locationId},${r.rating},${r.requestsSent},${r.opens},${r.openRate}%,${r.feedbackReceived},${r.feedbackRate}%,${r.responseRate}%,${r.reviewClicks},${r.newReviews},${r.totalReviews}`
      )
      .join("\n");
    const blob = new Blob([header + csvRows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "business-report.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  const columns: { key: SortKey; label: string }[] = [
    { key: "businessName", label: "Business Name" },
    { key: "locationId", label: "Location ID" },
    { key: "rating", label: "Rating" },
    { key: "requestsSent", label: "Requests Sent" },
    { key: "opens", label: "Opens" },
    { key: "openRate", label: "Open Rate" },
    { key: "feedbackReceived", label: "Feedback Received" },
    { key: "feedbackRate", label: "Feedback Rate" },
    { key: "responseRate", label: "Response Rate" },
    { key: "reviewClicks", label: "Review Clicks" },
    { key: "newReviews", label: "New Reviews" },
    { key: "totalReviews", label: "Total Reviews" },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="page-title">Business Report</h1>
        <p className="page-subtitle">Discover how your locations measure up across key request performance metrics.</p>
      </div>

      {loading ? (
        <Skeleton className="h-96 w-full rounded-2xl" />
      ) : (
        <div className="card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <input
              type="text"
              placeholder="Search businesses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="text-sm border border-border rounded-md px-3 py-1.5 sm:max-w-xs"
            />
            <Button variant="outline" size="sm" onClick={downloadCsv}>
              <Download size={14} /> Email CSV
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-slate-500">
                  {columns.map((col) => (
                    <th key={col.key} className="py-2 pr-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleSort(col.key)}
                        className="flex items-center gap-1 hover:text-slate-900"
                      >
                        {col.label}
                        <ArrowUpDown size={11} className={sortKey === col.key ? "text-berry-600" : "text-slate-300"} />
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredSorted.map((r) => (
                  <tr key={r.businessId} className="border-b border-border last:border-0">
                    <td className="py-2 pr-4 font-medium text-slate-900 whitespace-nowrap">{r.businessName}</td>
                    <td className="py-2 pr-4 text-slate-500 whitespace-nowrap">{r.locationId}</td>
                    <td className="py-2 pr-4 text-slate-700">{r.rating.toFixed(1)}</td>
                    <td className="py-2 pr-4 text-slate-700">{r.requestsSent}</td>
                    <td className="py-2 pr-4 text-slate-700">{r.opens}</td>
                    <td className="py-2 pr-4 text-slate-700">{r.openRate}%</td>
                    <td className="py-2 pr-4 text-slate-700">{r.feedbackReceived}</td>
                    <td className="py-2 pr-4 text-slate-700">{r.feedbackRate}%</td>
                    <td className="py-2 pr-4 text-slate-700">{r.responseRate}%</td>
                    <td className="py-2 pr-4 text-slate-700">{r.reviewClicks}</td>
                    <td className="py-2 pr-4 text-slate-700">{r.newReviews}</td>
                    <td className="py-2 pr-4 text-slate-700">{r.totalReviews}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
