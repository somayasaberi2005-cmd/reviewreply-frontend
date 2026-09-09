"use client";

import { useEffect, useState } from "react";
import { getSocialSharingSettings, updateSocialSharingSettings } from "@/lib/api";
import { useBusinessContext } from "@/lib/business-context";
import { useToast } from "@/lib/toast-context";
import { SocialSharingSettings, SocialPlatform } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ThumbsUp, Camera, Search } from "lucide-react";

const platformInfo: Record<SocialPlatform, { name: string; icon: React.ElementType; color: string }> = {
  facebook: { name: "Facebook", icon: ThumbsUp, color: "text-blue-600" },
  instagram: { name: "Instagram", icon: Camera, color: "text-pink-600" },
  google_posts: { name: "Google Posts", icon: Search, color: "text-red-500" },
};

export default function SocialSharingPage() {
  const { selectedBusinessId } = useBusinessContext();
  const { showToast } = useToast();
  const [settings, setSettings] = useState<SocialSharingSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!selectedBusinessId) return;
    setLoading(true);
    getSocialSharingSettings(selectedBusinessId).then((data) => {
      setSettings(data);
      setLoading(false);
    });
  }, [selectedBusinessId]);

  if (loading || !settings) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="page-title">Social Sharing Settings</h1>
          <p className="page-subtitle">Loading...</p>
        </div>
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  function toggleConnect(platform: SocialPlatform) {
    setSettings((prev) =>
      prev
        ? {
            ...prev,
            accounts: prev.accounts.map((a) =>
              a.platform === platform ? { ...a, connected: !a.connected } : a
            ),
          }
        : prev
    );
  }

  async function handleSave() {
    if (!selectedBusinessId || !settings) return;
    setSaving(true);
    try {
      await updateSocialSharingSettings(selectedBusinessId, settings);
      showToast("Social sharing settings saved");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="page-title">Social Sharing Settings</h1>
        <p className="page-subtitle">
          Complete your settings for sharing reviews via social media. To share a review, visit
          Customer Activity and select &ldquo;Social Post&rdquo; from the Manage button.
        </p>
      </div>

      <div className="card mb-6">
        <p className="font-semibold text-slate-900 mb-4">Account Authorizations</p>
        <div className="divide-y divide-border">
          {settings.accounts.map((account) => {
            const info = platformInfo[account.platform];
            const Icon = info.icon;
            return (
              <div key={account.platform} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <Icon size={18} className={info.color} />
                  <span className="text-sm text-slate-700">{info.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-xs ${account.connected ? "text-berry-600" : "text-red-500"}`}>
                    {account.connected ? "Connected" : "Not Connected - Admin Authorization Needed"}
                  </span>
                  <Button
                    size="sm"
                    variant={account.connected ? "outline" : "default"}
                    onClick={() => toggleConnect(account.platform)}
                  >
                    {account.connected ? "Disconnect" : "Connect"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card mb-6">
        <p className="font-semibold text-slate-900 mb-1">Automate Social Sharing</p>
        <p className="text-sm text-slate-500 mb-3">
          Complete your settings for automatically sharing your reviews via social media.
        </p>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={settings.automationEnabled}
            onChange={(e) =>
              setSettings((prev) => (prev ? { ...prev, automationEnabled: e.target.checked } : prev))
            }
            className="rounded border-border"
          />
          <span className="text-sm text-slate-700">Automatically share new positive reviews</span>
        </label>
      </div>

      <div className="card mb-6 max-w-xl">
        <p className="font-semibold text-slate-900 mb-1">Default Social Content</p>
        <p className="text-sm text-slate-500 mb-3">
          This content will be the default for any new social post. It can be edited during the
          posting process.
        </p>
        <textarea
          value={settings.defaultContent}
          maxLength={1000}
          onChange={(e) =>
            setSettings((prev) => (prev ? { ...prev, defaultContent: e.target.value } : prev))
          }
          rows={4}
          className="w-full text-sm border border-border rounded-md p-3"
        />
        <p className="text-xs text-slate-400 mt-1">{settings.defaultContent.length}/1000</p>
      </div>

      <Button onClick={handleSave} disabled={saving}>
        {saving ? "Saving..." : "Save Settings"}
      </Button>
    </div>
  );
}

