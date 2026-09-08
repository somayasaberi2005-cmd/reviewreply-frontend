"use client";

import { useEffect, useMemo, useState } from "react";
import { getQaEntries } from "@/lib/api";
import { useBusinessContext } from "@/lib/business-context";
import { QaEntry, QaStatus } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Download } from "lucide-react";

const statusStyles: Record<QaStatus, string> = {
  open: "bg-amber-50 text-amber-700",
  closed: "bg-berry-50 text-berry-800",
  reported: "bg-red-50 text-red-700",
  removed: "bg-slate-100 text-slate-500",
};

const statusOptions: QaStatus[] = ["open", "closed", "reported", "removed"];

export default function QaReportPage() {
  const { selectedBusinessId } = useBusinessContext();
  const [entries, setEntries] = useState<QaEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilters, setStatusFilters] = useState<QaStatus[]>([]);

  useEffect(() => {
    if (!selectedBusinessId) return;
    setLoading(true);
    getQaEntries(selectedBusinessId).then((data) => {
      setEntries(data);
      setLoading(false);
    });
  }, [selectedBusinessId]);

  function toggleStatus(status: QaStatus) {
    setStatusFilters((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );
  }

  const filtered = useMemo(() => {
    return entries.filter((e) => {
      const matchesSearch =
        search === "" ||
        e.question.toLowerCase().includes(search.toLowerCase()) ||
        e.location.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilters.length === 0 || statusFilters.includes(e.status);
      return matchesSearch && matchesStatus;
    });
  }, [entries, search, statusFilters]);

  const locationsMonitored = new Set(entries.map((e) => e.location)).size;

  function downloadCsv() {
    const header = "Location,Question,Answer,Date,Status\n";
    const rows = filtered
      .map((e) => `${e.location},"${e.question}","${e.answer}",${e.date},${e.status}`)
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "qa-report.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="page-title">Google Q&A</h1>
        <p className="page-subtitle">Monitor and manage your Google Business Profile questions and answers.</p>
      </div>

      {loading ? (
        <Skeleton className="h-72 w-full rounded-2xl" />
      ) : (
        <div className="card">
          <p className="text-xs text-slate-500 mb-4">Locations Monitored: {locationsMonitored}</p>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="text-sm border border-border rounded-md px-3 py-1.5 sm:max-w-xs"
            />
            <div className="flex flex-wrap items-center gap-2">
              {statusOptions.map((status) => (
                <button
                  key={status}
                  onClick={() => toggleStatus(status)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-full capitalize transition-colors ${
                    statusFilters.includes(status)
                      ? "bg-berry-600 text-white"
                      : "bg-white border border-border text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {status}
                </button>
              ))}
              <Button variant="outline" size="sm" onClick={downloadCsv}>
                <Download size={14} /> Download CSV
              </Button>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="empty-state">
              <p className="font-medium text-slate-700">No matching records</p>
              <p className="empty-state-text">Try a different search or status filter.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs text-slate-500">
                    <th className="py-2 pr-4">Location</th>
                    <th className="py-2 pr-4">Question</th>
                    <th className="py-2 pr-4">Answer</th>
                    <th className="py-2 pr-4">Date</th>
                    <th className="py-2 pr-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((e) => (
                    <tr key={e.id} className="border-b border-border last:border-0">
                      <td className="py-2 pr-4 text-slate-700 whitespace-nowrap">{e.location}</td>
                      <td className="py-2 pr-4 text-slate-700 max-w-xs">{e.question}</td>
                      <td className="py-2 pr-4 text-slate-500 max-w-xs">{e.answer || "-"}</td>
                      <td className="py-2 pr-4 text-slate-500 whitespace-nowrap">{e.date}</td>
                      <td className="py-2 pr-4">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${statusStyles[e.status]}`}>
                          {e.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
