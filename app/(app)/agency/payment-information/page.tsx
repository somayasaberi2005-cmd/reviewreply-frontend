"use client";

import { useEffect, useState } from "react";
import { getPaymentInfo, updatePaymentInfo } from "@/lib/api";
import { useToast } from "@/lib/toast-context";
import { PaymentInfo } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CreditCard } from "lucide-react";

export default function PaymentInformationPage() {
  const { showToast } = useToast();
  const [info, setInfo] = useState<PaymentInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getPaymentInfo().then((data) => {
      setInfo(data);
      setLoading(false);
    });
  }, []);

  if (loading || !info) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="page-title">Payment Information</h1>
          <p className="page-subtitle">Loading...</p>
        </div>
        <Skeleton className="h-56 w-full rounded-2xl" />
      </div>
    );
  }

  async function handleSave() {
    if (!info) return;
    setSaving(true);
    try {
      await updatePaymentInfo(info);
      showToast("Billing email saved");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="page-title">Payment Information</h1>
      </div>

      <div className="card max-w-lg">
        <div className="flex items-center gap-3 mb-4 p-4 bg-slate-50 rounded-lg">
          <CreditCard size={24} className="text-slate-400" />
          {info.cardBrand && info.last4 ? (
            <div>
              <p className="text-sm font-medium text-slate-900">
                {info.cardBrand} &middot;&middot;&middot;&middot; {info.last4}
              </p>
              <p className="text-xs text-slate-500">
                Expires {info.expiryMonth}/{info.expiryYear}
              </p>
            </div>
          ) : (
            <p className="text-sm text-slate-500">No payment method on file.</p>
          )}
        </div>

        <label className="block text-sm font-medium text-slate-700 mb-1">Billing Email</label>
        <input
          type="email"
          value={info.billingEmail}
          onChange={(e) => setInfo({ ...info, billingEmail: e.target.value })}
          placeholder="billing@yourbusiness.com"
          className="w-full text-sm border border-border rounded-md px-3 py-2 mb-4"
        />

        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
}
