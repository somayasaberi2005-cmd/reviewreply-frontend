"use client";

import { useEffect, useMemo, useState } from "react";
import { getCustomerActivity } from "@/lib/api";
import { useBusinessContext } from "@/lib/business-context";
import { CustomerActivityEntry, ActivityType } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Send, MessageSquare, Star, Clock3 } from "lucide-react";

const typeInfo: Record<ActivityType, { icon: React.ElementType; color: string; label: string }> = {
  request_sent: { icon: Send, color: "text-blue-600 bg-blue-50", label: "Request Sent" },
  feedback_received: { icon: MessageSquare, color: "text-amber-600 bg-amber-50", label: "Feedback Received" },
  review_posted: { icon: Star, color: "text-berry-600 bg-berry-50", label: "Review Posted" },
  reminder_sent: { icon: Clock3, color: "text-slate-500 bg-slate-100", label: "Reminder Sent" },
};

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function CustomerActivityPage() {
  const { selectedBusinessId } = useBusinessContext();
  const [entries, setEntries] = useState<CustomerActivityEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<ActivityType | "all">("all");

  useEffect(() => {
    if (!selectedBusinessId) return;
    setLoading(true);
    getCustomerActivity(selectedBusinessId).then((data) => {
      setEntries(data);
      setLoading(false);
    });
  }, [selectedBusinessId]);

  const filtered = useMemo(() => {
    return entries
      .filter((e) => typeFilter === "all" || e.type === typeFilter)
      .filter((e) => search === "" || e.customerName.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [entries, search, typeFilter]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="page-title">Customer Activity</h1>
        <p className="page-subtitle">A timeline of every customer interaction across your business.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <input
          type="text"
          placeholder="Search by customer name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="text-sm border border-border rounded-md px-3 py-1.5 flex-1 sm:max-w-xs"
        />
        <div className="flex flex-wrap gap-2">
          {(["all", "request_sent", "feedback_received", "review_posted", "reminder_sent"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
                typeFilter === t
                  ? "bg-berry-600 text-white"
                  : "bg-white border border-border text-slate-600 hover:bg-slate-50"
              }`}
            >
              {t === "all" ? "All" : typeInfo[t].label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-2xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <p className="font-medium text-slate-700">No activity found</p>
          <p className="empty-state-text">Try a different search or filter.</p>
        </div>
      ) : (
        <div className="relative pl-8">
          <div className="absolute left-3 top-2 bottom-2 w-px bg-border" />
          <div className="space-y-4">
            {filtered.map((entry) => {
              const info = typeInfo[entry.type];
              const Icon = info.icon;
              return (
                <div key={entry.id} className="relative">
                  <div className={`absolute -left-8 top-3 w-6 h-6 rounded-full flex items-center justify-center ${info.color}`}>
                    <Icon size={12} />
                  </div>
                  <div className="card flex items-center gap-3">
                    <div className="avatar-circle">{initials(entry.customerName)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900">{entry.customerName}</p>
                      <p className="text-xs text-slate-500">{entry.detail}</p>
                    </div>
                    {entry.rating !== null && (
                      <span className="text-berry-600 text-sm flex-shrink-0">
                        {"\u2605".repeat(entry.rating)}
                        <span className="text-slate-300">{"\u2606".repeat(5 - entry.rating)}</span>
                      </span>
                    )}
                    <span className="text-xs text-slate-400 flex-shrink-0 whitespace-nowrap">
                      {formatDate(entry.date)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
