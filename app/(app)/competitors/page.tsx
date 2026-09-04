"use client";

import { useEffect, useState } from "react";
import { getCompetitors, Competitor, getDashboardStats } from "@/lib/api";
import { useBusinessContext } from "@/lib/business-context";
import { Skeleton } from "@/components/ui/skeleton";
import { Users } from "lucide-react";

export default function CompetitorsPage() {
  const { businesses, selectedBusinessId } = useBusinessContext();
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [yourRating, setYourRating] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!selectedBusinessId) return;
    setLoading(true);
    Promise.all([
      getCompetitors(selectedBusinessId),
      getDashboardStats(selectedBusinessId),
    ]).then(([comps, stats]) => {
      setCompetitors(comps);
      setYourRating(stats.averageRating);
      setLoading(false);
    });
  }, [selectedBusinessId]);

  const selectedBusiness = businesses.find((b) => b.id === selectedBusinessId);
  const maxRating = Math.max(yourRating ?? 0, ...competitors.map((c) => c.rating), 5);

  return (
    <div>
      <div className="mb-6">
        <h1 className="page-title">Competitors</h1>
        <p className="page-subtitle">See how {selectedBusiness?.name ?? "your business"} compares nearby</p>
      </div>

      {loading ? (
        <div className="card space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>
      ) : competitors.length === 0 ? (
        <div className="empty-state">
          <Users className="text-slate-300 mb-2" size={28} />
          <p className="font-medium text-slate-700">No competitors tracked yet</p>
          <p className="empty-state-text">Add competitors to compare ratings and review volume.</p>
        </div>
      ) : (
        <div className="card">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-slate-900">{selectedBusiness?.name} (you)</span>
                <span className="text-slate-500">{yourRating}{String.fromCharCode(9733)}</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-berry-500"
                  style={{ width: `${((yourRating ?? 0) / maxRating) * 100}%` }}
                />
              </div>
            </div>

            {competitors.map((comp) => (
              <div key={comp.id}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600">{comp.name}</span>
                  <span className="text-slate-400">{comp.rating}{String.fromCharCode(9733)} &middot; {comp.totalReviews} reviews</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-slate-300"
                    style={{ width: `${(comp.rating / maxRating) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}