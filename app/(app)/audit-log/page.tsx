"use client";

import { useEffect, useState } from "react";
import { getAuditLog, AuditLogEntry } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { FileClock } from "lucide-react";

function formatTimestamp(iso: string) {
  const date = new Date(iso);
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AuditLogPage() {
  const [entries, setEntries] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAuditLog().then((data) => {
      setEntries(data);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="page-title">Audit Log</h1>
        <p className="page-subtitle">A record of every reply action across your businesses</p>
      </div>

      {loading ? (
        <div className="card space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>
      ) : entries.length === 0 ? (
        <div className="empty-state">
          <FileClock className="text-slate-300 mb-2" size={28} />
          <p className="font-medium text-slate-700">No activity yet</p>
          <p className="empty-state-text">Actions like approving or rejecting replies will show up here.</p>
        </div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-5 py-3 font-medium text-slate-500 text-xs uppercase tracking-wide">Action</th>
                <th className="px-5 py-3 font-medium text-slate-500 text-xs uppercase tracking-wide">By</th>
                <th className="px-5 py-3 font-medium text-slate-500 text-xs uppercase tracking-wide">Target</th>
                <th className="px-5 py-3 font-medium text-slate-500 text-xs uppercase tracking-wide">When</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.id} className="border-b border-border last:border-b-0 hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3 font-medium text-slate-900">{entry.action}</td>
                  <td className="px-5 py-3 text-slate-600">{entry.actor}</td>
                  <td className="px-5 py-3 text-slate-600">{entry.target}</td>
                  <td className="px-5 py-3 text-slate-400">{formatTimestamp(entry.timestamp)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}