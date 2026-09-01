"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getBusinesses } from "@/lib/api";
import { Business } from "@/lib/types";

type BusinessContextType = {
  businesses: Business[];
  selectedBusinessId: string | null;
  setSelectedBusinessId: (id: string) => void;
  loading: boolean;
};

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export function BusinessProvider({ children }: { children: ReactNode }) {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBusinesses().then((data) => {
      setBusinesses(data);
      if (data.length > 0) {
        setSelectedBusinessId(data[0].id);
      }
      setLoading(false);
    });
  }, []);

  return (
    <BusinessContext.Provider
      value={{ businesses, selectedBusinessId, setSelectedBusinessId, loading }}
    >
      {children}
    </BusinessContext.Provider>
  );
}

export function useBusinessContext() {
  const context = useContext(BusinessContext);
  if (!context) {
    throw new Error("useBusinessContext must be used within a BusinessProvider");
  }
  return context;
}