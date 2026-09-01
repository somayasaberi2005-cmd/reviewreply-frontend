"use client";

import { useEffect, useState } from "react";
import { getDashboardStats } from "@/lib/api";
import { DashboardStats } from "@/lib/types";
import { MessageSquareText, Clock, Star, TrendingUp } from "lucide-react";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    getDashboardStats().then(setStats);
  }, []);

  if (!stats) {
    return <p className="text-slate-500 text-sm">Loading dashboard...</p>;
  }

  const cards = [
    { label: "Total reviews", value: stats.totalReviews, icon: MessageSquareText, bg: "bg-berry-50", fg: "text-berry-700" },
    { label: "Average rating", value: stats.averageRating, icon: Star, bg: "bg-amber-50", fg: "text-amber-600" },
    { label: "Pending replies", value: stats.pendingReplies, icon: Clock, bg: "bg-slate-100", fg: "text-slate-600" },
    { label: "Response rate", value: `${stats.responseRate}%`, icon: TrendingUp, bg: "bg-emerald-50", fg: "text-emerald-600" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Overview of your review activity</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="card">
              <div className={`stat-icon ${card.bg}`}>
                <Icon size={18} className={card.fg} />
              </div>
              <p className="text-sm text-slate-500">{card.label}</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{card.value}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
