"use client";

import { useEffect, useState } from "react";
import { getSmsSettings, updateSmsSettings, sendTestSms } from "@/lib/api";
import { useBusinessContext } from "@/lib/business-context";
import { useToast } from "@/lib/toast-context";
import { SmsSettings, SmsMessageType } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const LIMITS: Record<SmsMessageType, number> = { sms: 160, mms: 306 };
const RESERVED_CHARS = 37;

export default function SmsRequestsPage() {
  const { selectedBusinessId } = useBusinessContext();
  const { showToast } = useToast();
  const [settings, setSettings] = useState<SmsSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sendingTest, setSendingTest] = useState(false);

  useEffect(() => {
    if (!selectedBusinessId) return;
    setLoading(true);
    getSmsSettings(selectedBusinessId).then((data) => {
      setSettings(data);
      setLoading(false);
    });
  }, [selectedBusinessId]);

  if (loading || !settings) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="page-title">SMS Requests</h1>
          <p className="page-subtitle">Loading...</p>
        </div>
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  const maxChars = LIMITS[settings.messageType];
  const reserved = settings.includeFeedbackUrl ? RESERVED_CHARS : 0;
  const effectiveMax = maxChars - reserved;
  const charsUsed = settings.message.length;
  const overLimit = charsUsed > effectiveMax;

  function update(changes: Partial<SmsSettings>) {
    setSettings((prev) => (prev ? { ...prev, ...changes } : prev));
  }

  async function handleSave() {
    if (!selectedBusinessId || !settings || overLimit) return;
    setSaving(true);
    try {
      await updateSmsSettings(selectedBusinessId, settings);
      showToast("SMS settings saved");
    } finally {
      setSaving(false);
    }
  }

  async function handleSendTest() {
    if (!selectedBusinessId) return;
    setSendingTest(true);
    try {
      await sendTestSms(selectedBusinessId);
      showToast("Test message sent");
    } finally {
      setSendingTest(false);
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="page-title">SMS Requests</h1>
        <p className="page-subtitle">
          Set up and customize text requests. If the initial request is sent via text message,
          reminders will also be sent as texts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card">
          <p className="text-sm font-medium text-slate-700 mb-2">Message Type</p>
          <div className="space-y-2 mb-5">
            <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
              <input
                type="radio"
                checked={settings.messageType === "sms"}
                onChange={() => update({ messageType: "sms" })}
              />
              SMS Text Message (1 credit)
              <span className="text-xs text-slate-400">160 characters maximum</span>
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
              <input
                type="radio"
                checked={settings.messageType === "mms"}
                onChange={() => update({ messageType: "mms" })}
              />
              MMS Text Message (2 credits)
              <span className="text-xs text-slate-400">306 characters maximum</span>
            </label>
          </div>

          <label className="block text-sm font-medium text-slate-700 mb-1">Message to Send</label>
          <textarea
            value={settings.message}
            onChange={(e) => update({ message: e.target.value })}
            rows={5}
            className={`w-full text-sm border rounded-md p-3 mb-1 ${
              overLimit ? "border-red-400" : "border-border"
            }`}
          />
          <p className={`text-xs mb-4 ${overLimit ? "text-red-600" : "text-slate-500"}`}>
            {charsUsed} characters used of {effectiveMax}.
          </p>

          <label className="flex items-center gap-2 text-sm text-slate-700 mb-1 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.includeFeedbackUrl}
              onChange={(e) => update({ includeFeedbackUrl: e.target.checked })}
              className="rounded border-border"
            />
            Include Feedback URL:
            <span className="text-berry-600">{settings.feedbackUrl}</span>
          </label>
          <p className="text-xs text-slate-500 mb-5">
            When checked, your feedback URL will appear below your message. We automatically deduct
            characters for the customer name, feedback URL, and unsubscribe text.
          </p>

          <Button onClick={handleSave} disabled={saving || overLimit}>
            {saving ? "Saving..." : "Save"}
          </Button>

          <p className="text-xs text-slate-400 mt-5">
            SMS messages are only sent from 9am to 9pm in your business location time zone. Any SMS
            requests in the queue will be sent the following day.
          </p>
        </div>

        <div className="flex flex-col items-center">
          <div className="border-4 border-slate-800 rounded-[2rem] w-64 p-3 bg-white shadow-sm">
            <div className="flex justify-center mb-3">
              <div className="w-16 h-1.5 rounded-full bg-slate-800" />
            </div>
            <div className="bg-slate-100 rounded-2xl rounded-tl-sm p-3 text-xs text-slate-700 mb-2">
              {settings.message || "Your message preview will appear here"}
              {settings.includeFeedbackUrl && (
                <p className="text-berry-600 mt-1 break-all">{settings.feedbackUrl}</p>
              )}
              <p className="text-slate-400 mt-1">Text STOP to opt out</p>
            </div>
            <div className="flex justify-center mt-4 mb-1">
              <div className="w-8 h-8 rounded-full border-2 border-slate-800" />
            </div>
          </div>

          <Button variant="outline" size="sm" className="mt-4" onClick={handleSendTest} disabled={sendingTest}>
            {sendingTest ? "Sending..." : "Send Test"}
          </Button>
          <p className="text-xs text-slate-400 text-center mt-3 max-w-[16rem]">
            This preview may not be fully accurate, devices may display differently. Send yourself a
            test message to be sure.
          </p>
        </div>
      </div>
    </div>
  );
}
