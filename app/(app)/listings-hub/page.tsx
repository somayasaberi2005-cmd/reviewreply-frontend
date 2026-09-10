"use client";

import { useEffect, useState } from "react";
import { getListingsHubSummary } from "@/lib/api";
import { useBusinessContext } from "@/lib/business-context";
import { ListingsHubSummary } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, ThumbsUp, Search, Camera } from "lucide-react";

const platformInfo = {
  facebook: { name: "Facebook", icon: ThumbsUp, color: "text-blue-600" },
  google: { name: "Google", icon: Search, color: "text-red-500" },
  instagram: { name: "Instagram", icon: Camera, color: "text-pink-600" },
};

export default function ListingsHubPage() {
  const { selectedBusinessId } = useBusinessContext();
  const [summary, setSummary] = useState<ListingsHubSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!selectedBusinessId) return;
    setLoading(true);
    getListingsHubSummary(selectedBusinessId).then((data) => {
      setSummary(data);
      setLoading(false);
    });
  }, [selectedBusinessId]);

  return (
    <div>
      <div className="bg-slate-900 rounded-2xl p-8 sm:p-12 mb-6 relative overflow-hidden">
        <div
          className="pointer-events-none absolute -top-20 -right-20 w-72 h-72 rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, #8BC34A 0%, transparent 70%)" }}
        />
        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4">
              One Hub. Every Listing. Total Control.
            </h1>
            <p className="text-slate-300 text-sm sm:text-base">
              Tired of jumping between platforms? The Listings Hub lets you manage, update, and clean
              up all your business listings from one place. Say goodbye to duplicates and hello to
              consistency.
            </p>
          </div>

          {loading || !summary ? (
            <Skeleton className="h-56 w-full rounded-2xl bg-white/10" />
          ) : (
            <div className="bg-white rounded-2xl p-5 shadow-lg">
              <p className="font-semibold text-slate-900 mb-4">Listings Hub</p>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="border border-border rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-slate-900">{summary.totalListings}</p>
                  <p className="text-xs text-slate-500">Listings</p>
                </div>
                <div className="border border-border rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-slate-900">{summary.syncedCount}</p>
                  <p className="text-xs text-slate-500">Synced</p>
                </div>
                <div className="border border-border rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-slate-900">{summary.updatedCount}</p>
                  <p className="text-xs text-slate-500">Updated</p>
                </div>
              </div>
              <div className="space-y-2">
                {summary.platforms.map((p) => {
                  const info = platformInfo[p.platform];
                  const Icon = info.icon;
                  return (
                    <div key={p.platform} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Icon size={16} className={info.color} />
                        <span className="text-slate-700">{info.name}</span>
                      </div>
                      <span className="flex items-center gap-1 text-berry-600 font-medium">
                        <CheckCircle2 size={14} /> Synced
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="text-center">
        <button className="bg-slate-900 text-white text-sm font-medium px-6 py-3 rounded-lg hover:bg-slate-800 transition-colors">
          Access Now
        </button>
      </div>
    </div>
  );
}
