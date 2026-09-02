"use client";

import { useEffect, useState } from "react";
import { getBusinesses } from "@/lib/api";
import { Business } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, AlertCircle } from "lucide-react";

export default function BusinessesPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  function load() {
    setLoading(true);
    setError(false);
    getBusinesses()
      .then((data) => {
        setBusinesses(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }

  useEffect(load, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="page-title">Businesses</h1>
        <p className="page-subtitle">
          {loading ? "Loading..." : `${businesses.length} businesses connected`}
        </p>
      </div>

      {error ? (
        <div className="empty-state">
          <AlertCircle className="text-red-400 mb-2" size={28} />
          <p className="font-medium text-slate-700">Couldn't load businesses</p>
          <p className="empty-state-text mb-4">Something went wrong fetching your businesses.</p>
          <button onClick={load} className="text-sm font-medium px-4 py-2 rounded-md bg-berry-600 text-white hover:bg-berry-800">
            Try again
          </button>
        </div>
      ) : loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card">
              <Skeleton className="w-10 h-10 rounded-xl mb-3" />
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-3 w-20 mb-3" />
              <Skeleton className="h-5 w-14 rounded-full" />
            </div>
          ))}
        </div>
      ) : businesses.length === 0 ? (
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