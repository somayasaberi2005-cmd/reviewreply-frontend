"use client";

import { useEffect, useState } from "react";
import { getNotificationSettings, updateNotificationRule } from "@/lib/api";
import { useBusinessContext } from "@/lib/business-context";
import { NotificationSettings, NotificationRule, NotificationChannel } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronDown, Mail, Hash, MessageSquare } from "lucide-react";

const channelIcons: Record<NotificationChannel, React.ElementType> = {
  email: Mail,
  slack: Hash,
  sms: MessageSquare,
};

export default function NotificationsPage() {
  const { selectedBusinessId } = useBusinessContext();
  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"essential" | "advanced">("essential");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedBusinessId) return;
    setLoading(true);
    getNotificationSettings(selectedBusinessId).then((data) => {
      setSettings(data);
      setLoading(false);
    });
  }, [selectedBusinessId]);

  if (loading || !settings) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="page-title">Notification Settings</h1>
          <p className="page-subtitle">Loading...</p>
        </div>
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  function toggleRule(rule: NotificationRule, listKey: "essential" | "advanced") {
    if (!selectedBusinessId || !settings) return;
    const nextEnabled = !rule.enabled;
    setSettings({
      ...settings,
      [listKey]: settings[listKey].map((r) => (r.id === rule.id ? { ...r, enabled: nextEnabled } : r)),
    });
    updateNotificationRule(selectedBusinessId, rule.id, { enabled: nextEnabled });
  }

  function toggleChannel(rule: NotificationRule, listKey: "essential" | "advanced", channel: NotificationChannel) {
    if (!selectedBusinessId || !settings) return;
    const nextChannels = rule.channels.includes(channel)
      ? rule.channels.filter((c) => c !== channel)
      : [...rule.channels, channel];
    setSettings({
      ...settings,
      [listKey]: settings[listKey].map((r) => (r.id === rule.id ? { ...r, channels: nextChannels } : r)),
    });
    updateNotificationRule(selectedBusinessId, rule.id, { channels: nextChannels });
  }

  const rules = tab === "essential" ? settings.essential : settings.advanced;

  return (
    <div>
      <div className="mb-6">
        <h1 className="page-title">Notification Settings</h1>
        <p className="page-subtitle">Control who receives notification emails for customer feedback, reviews, and reports.</p>
      </div>

      <div className="flex gap-2 mb-5">
        <button
          onClick={() => setTab("essential")}
          className={`text-sm font-medium px-3 py-1.5 rounded-full ${
            tab === "essential" ? "bg-berry-600 text-white" : "bg-white border border-border text-slate-600"
          }`}
        >
          Essential Notifications
        </button>
        <button
          onClick={() => setTab("advanced")}
          className={`text-sm font-medium px-3 py-1.5 rounded-full ${
            tab === "advanced" ? "bg-berry-600 text-white" : "bg-white border border-border text-slate-600"
          }`}
        >
          Advanced Notifications
        </button>
      </div>

      <div className="card divide-y divide-border">
        {rules.map((rule) => {
          const isExpanded = expandedId === rule.id;
          return (
            <div key={rule.id} className="py-3 first:pt-0 last:pb-0">
              <button
                onClick={() => setExpandedId(isExpanded ? null : rule.id)}
                className="w-full flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-2">
                  <ChevronDown
                    size={14}
                    className={`text-slate-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                  />
                  <div>
                    <p className="text-sm font-medium text-slate-900">{rule.title}</p>
                    <p className="text-xs text-slate-500">{rule.description}</p>
                  </div>
                </div>
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleRule(rule, tab);
                  }}
                  className={`flex-shrink-0 w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                    rule.enabled ? "bg-berry-600" : "bg-slate-200"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                      rule.enabled ? "translate-x-4" : "translate-x-0.5"
                    }`}
                  />
                </span>
              </button>

              {isExpanded && rule.enabled && (
                <div className="mt-3 ml-6 flex flex-wrap gap-2">
                  {(["email", "slack", "sms"] as NotificationChannel[]).map((channel) => {
                    const Icon = channelIcons[channel];
                    const active = rule.channels.includes(channel);
                    return (
                      <button
                        key={channel}
                        onClick={() => toggleChannel(rule, tab, channel)}
                        className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-md border transition-colors capitalize ${
                          active
                            ? "bg-berry-50 border-berry-300 text-berry-800"
                            : "bg-white border-border text-slate-500 hover:bg-slate-50"
                        }`}
                      >
                        <Icon size={12} /> {channel}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

