"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { getNegativeReviewAlerts } from "@/lib/api";
import { useBusinessContext } from "@/lib/business-context";
import { Review } from "@/lib/types";

export function NotificationBell() {
  const { selectedBusinessId } = useBusinessContext();
  const [alerts, setAlerts] = useState<Review[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!selectedBusinessId) return;
    getNegativeReviewAlerts(selectedBusinessId).then(setAlerts);
  }, [selectedBusinessId]);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative text-slate-400 hover:text-slate-600 transition-colors"
      >
        <Bell size={18} />
        {alerts.length > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-semibold w-4 h-4 rounded-full flex items-center justify-center">
            {alerts.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-border rounded-lg shadow-sm z-10">
          <div className="px-4 py-3 border-b border-border">
            <p className="text-sm font-medium text-slate-900">Negative review alerts</p>
          </div>

          {alerts.length === 0 ? (
            <p className="text-sm text-slate-500 px-4 py-6 text-center">
              No urgent alerts right now.
            </p>
          ) : (
            <div className="max-h-72 overflow-y-auto">
              {alerts.map((review) => (
                <Link
                  key={review.id}
                  href="/reviews"
                  onClick={() => setOpen(false)}
                  className="block px-4 py-3 border-b border-border last:border-b-0 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-slate-900">{review.reviewer.displayName}</p>
                    <span className="text-xs text-berry-600">{"\u2605".repeat(review.rating)}</span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2">{review.reviewText}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}