"use client";

import { useState } from "react";
import { useBusinessContext } from "@/lib/business-context";
import { useUserContext } from "@/lib/user-context";
import { connectGoogleBusinessProfile } from "@/lib/api";
import { CheckCircle2, ExternalLink, Lock } from "lucide-react";
import { useToast } from "@/lib/toast-context";

export default function SettingsPage() {
  const { businesses, selectedBusinessId, loading } = useBusinessContext();
  const { user } = useUserContext();
  const { showToast } = useToast();
  const canEditSettings = user.role === "owner" || user.role === "regional_manager";

  const [autoReply, setAutoReply] = useState(true);
  const [notifyNegative, setNotifyNegative] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [connectedOverride, setConnectedOverride] = useState<string | null>(null);

  const selectedBusiness = businesses.find((b) => b.id === selectedBusinessId);
  const isConnected = connectedOverride === selectedBusinessId || selectedBusiness?.googleConnected;

  async function handleConnect() {
    if (!selectedBusinessId || !canEditSettings) return;
    setConnecting(true);
    await connectGoogleBusinessProfile(selectedBusinessId);
    setConnectedOverride(selectedBusinessId);
    setConnecting(false);
    showToast("Google Business Profile connected");
  }

  if (loading) {
    return <p className="text-slate-500 text-sm">Loading settings...</p>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Manage how ReviewReply works for your business</p>
      </div>

      {!canEditSettings && (
        <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-100 rounded-lg px-3 py-2 mb-4">
          <Lock size={14} />
          You have read-only access to settings. Contact an owner or regional manager to make changes.
        </div>
      )}

      <div className="card mb-4">
        <p className="font-medium text-slate-900 mb-1">Google Business Profile</p>
        <p className="text-sm text-slate-500 mb-4">
          Connect your Google Business Profile so ReviewReply can read and reply to reviews for {selectedBusiness?.name ?? "this business"}.
        </p>

        {isConnected ? (
          <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 rounded-lg px-3 py-2">
            <CheckCircle2 size={16} />
            Connected to Google Business Profile
          </div>
        ) : canEditSettings ? (
          <button
            onClick={handleConnect}
            disabled={connecting}
            className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-md bg-berry-600 text-white hover:bg-berry-800 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {connecting ? (
              "Connecting..."
            ) : (
              <>
                <ExternalLink size={16} />
                Connect Google Business Profile
              </>
            )}
          </button>
        ) : (
          <p className="text-sm text-slate-500">Not connected</p>
        )}
      </div>

      <div className="card mb-4">
        <p className="font-medium text-slate-900 mb-1">Business profile</p>
        <p className="text-sm text-slate-500 mb-4">Basic information about your connected business</p>
        <div className="space-y-3 max-w-md">
          <div>
            <label className="text-xs font-medium text-slate-500 block mb-1">Business name</label>
            <input
              type="text"
              defaultValue={selectedBusiness?.name ?? ""}
              disabled={!canEditSettings}
              className="w-full text-sm border border-border rounded-md px-3 py-2 disabled:bg-slate-50 disabled:text-slate-400"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 block mb-1">Reply-to email</label>
            <input
              type="email"
              defaultValue="hello@roshan.af"
              disabled={!canEditSettings}
              className="w-full text-sm border border-border rounded-md px-3 py-2 disabled:bg-slate-50 disabled:text-slate-400"
            />
          </div>
        </div>
      </div>

      <div className="card mb-4">
        <p className="font-medium text-slate-900 mb-1">Auto-reply</p>
        <p className="text-sm text-slate-500 mb-4">Control how AI-drafted replies are handled</p>

        <div className="flex items-center justify-between py-2">
          <div>
            <p className="text-sm font-medium text-slate-900">Auto-post 4 and 5-star replies</p>
            <p className="text-xs text-slate-500">Positive reviews get replied to automatically</p>
          </div>
          <button
            onClick={() => canEditSettings && setAutoReply(!autoReply)}
            disabled={!canEditSettings}
            className={`w-10 h-6 rounded-full transition-colors relative disabled:opacity-50 disabled:cursor-not-allowed ${autoReply ? "bg-berry-600" : "bg-slate-200"}`}
          >
            <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${autoReply ? "translate-x-4" : "translate-x-0.5"}`} />
          </button>
        </div>

        <div className="flex items-center justify-between py-2 border-t border-border mt-2 pt-4">
          <div>
            <p className="text-sm font-medium text-slate-900">Notify me on negative reviews</p>
            <p className="text-xs text-slate-500">Get an alert for 1 and 2-star reviews</p>
          </div>
          <button
            onClick={() => canEditSettings && setNotifyNegative(!notifyNegative)}
            disabled={!canEditSettings}
            className={`w-10 h-6 rounded-full transition-colors relative disabled:opacity-50 disabled:cursor-not-allowed ${notifyNegative ? "bg-berry-600" : "bg-slate-200"}`}
          >
            <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${notifyNegative ? "translate-x-4" : "translate-x-0.5"}`} />
          </button>
        </div>
      </div>

      {canEditSettings && (
        <button className="text-sm font-medium px-4 py-2 rounded-md bg-berry-600 text-white hover:bg-berry-800">
          Save changes
        </button>
      )}
    </div>
  );
}