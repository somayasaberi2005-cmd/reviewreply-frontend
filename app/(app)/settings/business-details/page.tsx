"use client";

import { useEffect, useState } from "react";
import {
  getTollFreeDetails,
  updateTollFreeDetails,
  submitTollFreeVerification,
  getBusinessDetailsInfo,
  updateBusinessDetailsInfo,
  getBusinessOwnerDetails,
  updateBusinessOwnerDetails,
} from "@/lib/api";
import { useBusinessContext } from "@/lib/business-context";
import { useToast } from "@/lib/toast-context";
import { TollFreeDetails, BusinessDetailsInfo, BusinessOwnerDetails } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle } from "lucide-react";

export default function BusinessDetailsPage() {
  const { selectedBusinessId } = useBusinessContext();
  const { showToast } = useToast();
  const [tollFree, setTollFree] = useState<TollFreeDetails | null>(null);
  const [details, setDetails] = useState<BusinessDetailsInfo | null>(null);
  const [owner, setOwner] = useState<BusinessOwnerDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [savingDetails, setSavingDetails] = useState(false);
  const [savingOwner, setSavingOwner] = useState(false);

  useEffect(() => {
    if (!selectedBusinessId) return;
    setLoading(true);
    Promise.all([
      getTollFreeDetails(selectedBusinessId),
      getBusinessDetailsInfo(selectedBusinessId),
      getBusinessOwnerDetails(selectedBusinessId),
    ]).then(([tf, bd, bo]) => {
      setTollFree(tf);
      setDetails(bd);
      setOwner(bo);
      setLoading(false);
    });
  }, [selectedBusinessId]);

  if (loading || !tollFree || !details || !owner) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="page-title">Business Details</h1>
          <p className="page-subtitle">Loading...</p>
        </div>
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  async function handleSubmitVerification() {
    if (!selectedBusinessId || !tollFree) return;
    setSubmitting(true);
    try {
      await updateTollFreeDetails(selectedBusinessId, tollFree);
      await submitTollFreeVerification(selectedBusinessId);
      setTollFree({ ...tollFree, status: "pending" });
      showToast("Submitted for verification");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSaveDetails() {
    if (!selectedBusinessId || !details) return;
    setSavingDetails(true);
    try {
      await updateBusinessDetailsInfo(selectedBusinessId, details);
      showToast("Business details saved");
    } finally {
      setSavingDetails(false);
    }
  }

  async function handleSaveOwner() {
    if (!selectedBusinessId || !owner) return;
    setSavingOwner(true);
    try {
      await updateBusinessOwnerDetails(selectedBusinessId, owner);
      showToast("Owner details saved");
    } finally {
      setSavingOwner(false);
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="page-title">Business Details</h1>
      </div>

      <div className="card mb-6">
        <p className="font-semibold text-slate-900 mb-1">Toll Free Number</p>
        <p className="text-sm text-slate-500 mb-4">
          To enable SMS messaging, each business location must obtain an active phone number from the carriers.
        </p>

        {tollFree.status === "not_requested" && (
          <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-md p-3 mb-4 text-xs text-amber-800">
            <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium mb-1">Additional Details Needed</p>
              <p>Provide the information below, ensure everything on this page is correct, then submit for verification.</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm text-slate-700 mb-1">Legal Business Name</label>
            <input
              type="text"
              value={tollFree.legalBusinessName}
              onChange={(e) => setTollFree({ ...tollFree, legalBusinessName: e.target.value })}
              className="w-full text-sm border border-border rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-700 mb-1">Doing Business As</label>
            <input
              type="text"
              value={tollFree.doingBusinessAs}
              onChange={(e) => setTollFree({ ...tollFree, doingBusinessAs: e.target.value })}
              className="w-full text-sm border border-border rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-700 mb-1">Business Type</label>
            <select
              value={tollFree.businessType}
              onChange={(e) => setTollFree({ ...tollFree, businessType: e.target.value })}
              className="w-full text-sm border border-border rounded-md px-3 py-2"
            >
              <option value="">Select</option>
              <option value="sole_proprietor">Sole Proprietor</option>
              <option value="llc">LLC</option>
              <option value="corporation">Corporation</option>
              <option value="nonprofit">Nonprofit</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-slate-700 mb-1">Business Registration Number</label>
            <input
              type="text"
              value={tollFree.registrationNumber}
              onChange={(e) => setTollFree({ ...tollFree, registrationNumber: e.target.value })}
              className="w-full text-sm border border-border rounded-md px-3 py-2"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Status:{" "}
            <span
              className={`font-medium capitalize ${
                tollFree.status === "verified"
                  ? "text-berry-600"
                  : tollFree.status === "pending"
                  ? "text-amber-600"
                  : "text-slate-500"
              }`}
            >
              {tollFree.status.replace("_", " ")}
            </span>
          </p>
          <Button onClick={handleSubmitVerification} disabled={submitting || tollFree.status !== "not_requested"}>
            {submitting ? "Submitting..." : "Submit for Verification"}
          </Button>
        </div>
      </div>

      <div className="card mb-6">
        <p className="font-semibold text-slate-900 mb-1">Business Details</p>
        <p className="text-sm text-slate-500 mb-4">Keep this information up to date to prevent issues with your account.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm text-slate-700 mb-1">Business Name</label>
            <input
              type="text"
              value={details.businessName}
              onChange={(e) => setDetails({ ...details, businessName: e.target.value })}
              className="w-full text-sm border border-border rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-700 mb-1">Your Website URL</label>
            <input
              type="text"
              value={details.websiteUrl}
              onChange={(e) => setDetails({ ...details, websiteUrl: e.target.value })}
              className="w-full text-sm border border-border rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-700 mb-1">Street Address</label>
            <input
              type="text"
              value={details.streetAddress}
              onChange={(e) => setDetails({ ...details, streetAddress: e.target.value })}
              className="w-full text-sm border border-border rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-700 mb-1">City</label>
            <input
              type="text"
              value={details.city}
              onChange={(e) => setDetails({ ...details, city: e.target.value })}
              className="w-full text-sm border border-border rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-700 mb-1">State/Province</label>
            <input
              type="text"
              value={details.state}
              onChange={(e) => setDetails({ ...details, state: e.target.value })}
              className="w-full text-sm border border-border rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-700 mb-1">ZIP/Postal Code</label>
            <input
              type="text"
              value={details.zip}
              onChange={(e) => setDetails({ ...details, zip: e.target.value })}
              className="w-full text-sm border border-border rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-700 mb-1">Country</label>
            <input
              type="text"
              value={details.country}
              onChange={(e) => setDetails({ ...details, country: e.target.value })}
              className="w-full text-sm border border-border rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-700 mb-1">Phone Number</label>
            <input
              type="text"
              value={details.phoneNumber}
              onChange={(e) => setDetails({ ...details, phoneNumber: e.target.value })}
              className="w-full text-sm border border-border rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-700 mb-1">Time Zone</label>
            <select
              value={details.timeZone}
              onChange={(e) => setDetails({ ...details, timeZone: e.target.value })}
              className="w-full text-sm border border-border rounded-md px-3 py-2"
            >
              <option value="Pacific/Honolulu">Pacific/Honolulu</option>
              <option value="America/Los_Angeles">America/Los_Angeles</option>
              <option value="America/Denver">America/Denver</option>
              <option value="America/Chicago">America/Chicago</option>
              <option value="America/New_York">America/New_York</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-slate-700 mb-1">Language</label>
            <select
              value={details.language}
              onChange={(e) => setDetails({ ...details, language: e.target.value })}
              className="w-full text-sm border border-border rounded-md px-3 py-2"
            >
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="Dari">Dari</option>
              <option value="Pashto">Pashto</option>
            </select>
          </div>
        </div>

        <Button onClick={handleSaveDetails} disabled={savingDetails}>
          {savingDetails ? "Saving..." : "Save"}
        </Button>
      </div>

      <div className="card max-w-xl">
        <p className="font-semibold text-slate-900 mb-1">Business Owner Details</p>
        <p className="text-sm text-slate-500 mb-4">
          Enter the contact information for the individual who owns this business location.
        </p>

        <div className="space-y-4 mb-4">
          <div>
            <label className="block text-sm text-slate-700 mb-1">Business Owner First Name</label>
            <input
              type="text"
              value={owner.firstName}
              onChange={(e) => setOwner({ ...owner, firstName: e.target.value })}
              className="w-full text-sm border border-border rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-700 mb-1">Business Owner Last Name</label>
            <input
              type="text"
              value={owner.lastName}
              onChange={(e) => setOwner({ ...owner, lastName: e.target.value })}
              className="w-full text-sm border border-border rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-700 mb-1">Business Owner Email</label>
            <input
              type="email"
              value={owner.email}
              onChange={(e) => setOwner({ ...owner, email: e.target.value })}
              className="w-full text-sm border border-border rounded-md px-3 py-2"
            />
          </div>
        </div>

        <Button onClick={handleSaveOwner} disabled={savingOwner}>
          {savingOwner ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
}
