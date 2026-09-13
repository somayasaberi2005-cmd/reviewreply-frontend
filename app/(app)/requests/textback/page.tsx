"use client";

import { useEffect, useState } from "react";
import { getTextBackSettings, updateTextBackSettings } from "@/lib/api";
import { useBusinessContext } from "@/lib/business-context";
import { useToast } from "@/lib/toast-context";
import { TextBackSettings } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { HelpCircle, MessageSquare, User } from "lucide-react";

const MAX_CHARS = 125;
const COUNTRY_OPTIONS = [{ code: "US", label: "United States" }, { code: "CA", label: "Canada" }];
const PHONE_OPTIONS = ["(201) 555-0110", "(201) 555-0142", "(201) 555-0187"];

export default function TextBackPage() {
  const { selectedBusinessId } = useBusinessContext();
  const { showToast } = useToast();
  const [settings, setSettings] = useState<TextBackSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newKeyword, setNewKeyword] = useState("");

  useEffect(() => {
    if (!selectedBusinessId) return;
    setLoading(true);
    getTextBackSettings(selectedBusinessId).then((data) => {
      setSettings(data);
      setLoading(false);
    });
  }, [selectedBusinessId]);

  if (loading || !settings) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="page-title">TextBack</h1>
          <p className="page-subtitle">Loading...</p>
        </div>
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  function update(changes: Partial<TextBackSettings>) {
    setSettings((prev) => (prev ? { ...prev, ...changes } : prev));
  }

  function addKeyword() {
    const value = newKeyword.trim().toLowerCase();
    if (value && settings && !settings.keywords.includes(value)) {
      update({ keywords: [...settings.keywords, value] });
    }
    setNewKeyword("");
  }

  function removeKeyword(keyword: string) {
    if (keyword === "feedback") return;
    update({ keywords: settings!.keywords.filter((k) => k !== keyword) });
  }

  async function handleSave() {
    if (!selectedBusinessId || !settings) return;
    setSaving(true);
    try {
      await updateTextBackSettings(selectedBusinessId, settings);
      showToast("TextBack settings saved");
    } finally {
      setSaving(false);
    }
  }

  const charsUsed = settings.autoReplyMessage.length;
  const overLimit = charsUsed > MAX_CHARS;

  return (
    <div>
      <div className="mb-6">
        <h1 className="page-title">TextBack</h1>
        <p className="page-subtitle">
          TextBack offers customers real-time entry into the feedback process from their mobile phone.
          A customer self-activates by texting a keyword to your SMS number, and an auto-reply message
          helps them start the feedback and review process.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card">
          <div className="flex items-center gap-3 mb-6">
            <p className="text-sm font-medium text-slate-700">Activate TextBack</p>
            <button
              onClick={() => update({ active: !settings.active })}
              className={`w-9 h-5 rounded-full transition-colors relative ${
                settings.active ? "bg-berry-600" : "bg-slate-200"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                  settings.active ? "translate-x-4" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>

          <p className="text-sm font-medium text-slate-700 mb-1">Select A Phone Number</p>
          <p className="text-xs text-slate-500 mb-3">Select the phone number customers will text to.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="flex items-center gap-1 text-xs text-slate-600 mb-1">
                Your selected country <HelpCircle size={12} className="text-slate-400" />
              </label>
              <select
                value={settings.country}
                onChange={(e) => update({ country: e.target.value })}
                className="w-full text-sm border border-border rounded-md px-3 py-2"
              >
                {COUNTRY_OPTIONS.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="flex items-center gap-1 text-xs text-slate-600 mb-1">
                Your selected phone number <HelpCircle size={12} className="text-slate-400" />
              </label>
              <select
                value={settings.phoneNumber}
                onChange={(e) => update({ phoneNumber: e.target.value })}
                className="w-full text-sm border border-border rounded-md px-3 py-2"
              >
                <option value="">Select a number</option>
                {PHONE_OPTIONS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <p className="text-sm font-medium text-slate-700 mb-1">Keywords</p>
          <p className="text-xs text-slate-500 mb-2">
            Select a keyword or multiple keywords that a customer will text to activate the auto-reply.
          </p>
          <div className="flex flex-wrap gap-2 mb-3">
            {settings.keywords.map((keyword) => (
              <span
                key={keyword}
                className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-berry-50 text-berry-800"
              >
                {keyword} {keyword === "feedback" && "(default)"}
                {keyword !== "feedback" && (
                  <button onClick={() => removeKeyword(keyword)} className="ml-1">
                    &times;
                  </button>
                )}
              </span>
            ))}
          </div>
          <div className="flex gap-2 mb-6">
            <input
              type="text"
              placeholder="Add a keyword"
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addKeyword();
                }
              }}
              className="text-sm border border-border rounded-md px-3 py-1.5 flex-1 sm:max-w-xs"
            />
            <Button variant="outline" size="sm" onClick={addKeyword}>
              Add
            </Button>
          </div>

          <label className="block text-sm font-medium text-slate-700 mb-1">Auto-Reply Message</label>
          <p className="text-xs text-slate-500 mb-2">
            Edit the message sent to a customer texting the selected keyword(s). You can use up to{" "}
            {MAX_CHARS} characters.
          </p>
          <textarea
            value={settings.autoReplyMessage}
            onChange={(e) => update({ autoReplyMessage: e.target.value })}
            rows={4}
            className={`w-full text-sm border rounded-md p-3 mb-1 ${
              overLimit ? "border-red-400" : "border-border"
            }`}
          />
          <p className={`text-xs mb-4 ${overLimit ? "text-red-600" : "text-slate-500"}`}>
            {charsUsed} / {MAX_CHARS}
          </p>

          <p className="text-xs text-slate-500 mb-5">
            Feedback URL: <span className="text-berry-600">{settings.feedbackUrl}</span> will
            automatically appear below your message.
          </p>

          <Button onClick={handleSave} disabled={saving || overLimit}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>

        <div className="flex flex-col items-center">
          <div className="border-4 border-slate-800 rounded-[2rem] w-64 p-4 bg-white shadow-sm space-y-4">
            <div>
              <p className="text-[10px] text-center text-slate-400 mb-2">Customer texts your phone number</p>
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center mb-1">
                  <User size={16} className="text-slate-400" />
                </div>
                <p className="text-xs text-slate-500">{settings.phoneNumber || "XXX-XXX-XXXX"}</p>
              </div>
            </div>

            <div>
              <p className="text-[10px] text-center text-slate-400 mb-2">Keyword(s) Texted</p>
              <div className="flex justify-center">
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-800 text-white uppercase">
                  {settings.keywords[0] ?? "feedback"}
                </span>
              </div>
            </div>

            <div>
              <p className="text-[10px] text-center text-slate-400 mb-2">Auto-Reply Message</p>
              <div className="bg-slate-100 rounded-2xl rounded-tl-sm p-3 text-xs text-slate-700 mb-2">
                <MessageSquare size={12} className="inline mr-1 text-slate-400" />
                {settings.autoReplyMessage || "Your auto-reply will appear here"}
              </div>
              <p className="text-xs text-berry-600 break-all">{settings.feedbackUrl}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

