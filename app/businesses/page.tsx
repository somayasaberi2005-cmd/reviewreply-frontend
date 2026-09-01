"use client";

import { useEffect, useState } from "react";
import { getBusinesses } from "@/lib/api";
import { Business } from "@/lib/types";
import { Building2 } from "lucide-react";

export default function BusinessesPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBusinesses().then((data) => {
      setBusinesses(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <p className="text-slate-500 text-sm">Loading businesses...</p>;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="page-title">Businesses</h1>
        <p className="page-subtitle">{businesses.length} businesses connected</p>
      </div>

      {businesses.length === 0 ? (
        <div className="empty-state">
          <p className="font-medium text-slate-700">No businesses yet</p>
          <p className="empty-state-text">Connect a Google Business Profile to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {businesses.map((business) => (
            <div key={business.id} className="card">
              <div className="stat-icon bg-berry-50">
                <Building2 size={18} className="text-berry-700" />
              </div>
              <p className="font-medium text-slate-900">{business.name}</p>
              <p className="text-sm text-slate-500 mt-1">{business.city}, {business.state}</p>
              <span className="inline-block mt-3 text-xs font-medium px-2 py-1 rounded-full bg-berry-50 text-berry-800">
                {business.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
