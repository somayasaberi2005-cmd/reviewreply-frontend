"use client";

import { useEffect, useState } from "react";
import { getCompetitorReportStatus, enableCompetitorReport } from "@/lib/api";
import { useBusinessContext } from "@/lib/business-context";
import { useToast } from "@/lib/toast-context";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp } from "lucide-react";

export default function CompetitorReportPage() {
  const { selectedBusinessId } = useBusinessContext();
  const { showToast } = useToast();
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enabling, setEnabling] = useState(false);

  useEffect(() => {
    if (!selectedBusinessId) return;
    setLoading(true);
    getCompetitorReportStatus(selectedBusinessId).then((status) => {
      setEnabled(status.enabled);
      setLoading(false);
    });
  }, [selectedBusinessId]);

  async function handleEnable() {
    if (!selectedBusinessId) return;
    setEnabling(true);
    try {
      await enableCompetitorReport(selectedBusinessId);
      setEnabled(true);
      showToast("Competitor Analysis Report enabled");
    } finally {
      setEnabling(false);
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="page-title">Competitor Analysis</h1>
      </div>

      {loading ? (
        <Skeleton className="h-40 w-full max-w-xl rounded-2xl" />
      ) : enabled ? (
        <div className="card max-w-xl">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={18} className="text-berry-600" />
            <p className="font-semibold text-slate-900">Competitor Analysis is active</p>
          </div>
          <p className="text-sm text-slate-500">
            We are gathering data on your tracked competitors. Insights on review ratings, volume, and
            recency will appear here as data comes in.
          </p>
        </div>
      ) : (
        <div className="max-w-xl">
          <p className="text-sm text-slate-600 mb-5">
            Unlock insights and stay ahead of the competition. Click below to turn on the Competitor
            Analysis Report and start receiving tailored, data-driven insights about your competitors&apos;
            review ratings, volume, and recency.
          </p>
          <Button onClick={handleEnable} disabled={enabling}>
            {enabling ? "Enabling..." : "Enable"}
          </Button>
        </div>
      )}
    </div>
  );
}
