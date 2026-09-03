"use client";

import { useEffect, useState } from "react";
import { getDashboardStats } from "@/lib/api";
import type { DateRange } from "@/lib/api";
import { DashboardStats } from "@/lib/types";
import { useBusinessContext } from "@/lib/business-context";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquareText, Clock, Star, TrendingUp, AlertCircle } from "lucide-react";

export default function DashboardPage() {
  const { selectedBusinessId } = useBusinessContext();
  const [range, setRange] = useState<DateRange>("all");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  function load() {
    if (!selectedBusinessId) return;
    setLoading(true);
    setError(false);
    getDashboardStats(selectedBusinessId, range)
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }

  useEffect(load, [selectedBusinessId, range]);

  const cardMeta = [
    { key: "totalReviews", label: "Total reviews", icon: MessageSquareText, bg: "bg-berry-50", fg: "text-berry-700" },
    { key: "averageRating", label: "Average rating", icon: Star, bg: "bg-amber-50", fg: "text-amber-600" },
    { key: "pendingReplies", label: "Pending replies", icon: Clock, bg: "bg-slate-100", fg: "text-slate-600" },
    { key: "responseRate", label: "Response rate", icon: TrendingUp, bg: "bg-emerald-50", fg: "text-emerald-600" },
  ];

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Overview of your review activity</p>
        </div>
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
      </div>

      {error ? (
        <div className="empty-state">
          <AlertCircle className="text-red-400 mb-2" size={28} />
          <p className="font-medium text-slate-700">Couldn't load dashboard</p>
          <p className="empty-state-text mb-4">Something went wrong fetching your stats.</p>
          <button onClick={load} className="text-sm font-medium px-4 py-2 rounded-md bg-berry-600 text-white hover:bg-berry-800">
            Try again
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {loading || !stats
            ? cardMeta.map((card) => (
                <div key={card.key} className="card">
                  <Skeleton className="w-10 h-10 rounded-xl mb-3" />
                  <Skeleton className="h-3 w-20 mb-2" />
                  <Skeleton className="h-6 w-14" />
                </div>
              ))
            : cardMeta.map((card) => {
                const Icon = card.icon;
                const value = stats[card.key as keyof DashboardStats];
                return (
                  <div key={card.key} className="card">
                    <div className={`stat-icon ${card.bg}`}>
                      <Icon size={18} className={card.fg} />
                    </div>
                    <p className="text-sm text-slate-500">{card.label}</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">
                      {card.key === "responseRate" ? `${value}%` : value}
                    </p>
                  </div>
                );
              })}
        </div>
      )}
    </div>
  );
}