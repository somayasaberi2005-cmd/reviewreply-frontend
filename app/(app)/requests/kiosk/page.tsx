"use client";

import { useEffect, useState } from "react";
import { getKioskSettings, updateKioskTemplate } from "@/lib/api";
import { useBusinessContext } from "@/lib/business-context";
import { useToast } from "@/lib/toast-context";
import { KioskSettings, KioskTemplateStep } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Copy, Check, Monitor, Mail, Pencil } from "lucide-react";

export default function KioskModePage() {
  const { selectedBusinessId } = useBusinessContext();
  const { showToast } = useToast();
  const [settings, setSettings] = useState<KioskSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showDiagram, setShowDiagram] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    if (!selectedBusinessId) return;
    setLoading(true);
    getKioskSettings(selectedBusinessId).then((data) => {
      setSettings(data);
      setLoading(false);
    });
  }, [selectedBusinessId]);

  async function copyLink() {
    if (!settings) return;
    await navigator.clipboard.writeText(settings.kioskUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function startEdit(step: KioskTemplateStep) {
    setEditingId(step.id);
    setDraft(step.content);
  }

  async function saveEdit(step: KioskTemplateStep) {
    if (!selectedBusinessId) return;
    setSettings((prev) =>
      prev
        ? {
            ...prev,
            steps: prev.steps.map((s) =>
              s.id === step.id ? { ...s, content: draft, status: "Edited just now" } : s
            ),
          }
        : prev
    );
    await updateKioskTemplate(selectedBusinessId, step.id, { content: draft, status: "Edited just now" });
    setEditingId(null);
    showToast("Template updated");
  }

  function toggleTiming(step: KioskTemplateStep) {
    if (!selectedBusinessId) return;
    const next = !step.timingEnabled;
    setSettings((prev) =>
      prev
        ? { ...prev, steps: prev.steps.map((s) => (s.id === step.id ? { ...s, timingEnabled: next } : s)) }
        : prev
    );
    updateKioskTemplate(selectedBusinessId, step.id, { timingEnabled: next });
  }

  if (loading || !settings) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="page-title">Kiosk Mode</h1>
          <p className="page-subtitle">Loading...</p>
        </div>
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="page-title">Kiosk Mode</h1>
        <p className="page-subtitle">
          Request feedback from customers on-site, ideal for restaurants, medical offices, and any
          business that interacts with customers in person.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="card">
            <Button variant="outline" size="sm" onClick={() => setShowDiagram((prev) => !prev)} className="mb-4">
              {showDiagram ? "Hide Kiosk Mode Diagram" : "View Kiosk Mode Diagram"}
            </Button>

            {showDiagram && (
              <div className="bg-slate-50 border border-border rounded-lg p-4 mb-4 text-xs text-slate-600 space-y-2">
                <p>Customer taps kiosk link &rarr; leaves a rating</p>
                <p>Positive &rarr; Thank You Page &rarr; delayed email review request</p>
                <p>Negative &rarr; Apology page &rarr; private feedback collected</p>
              </div>
            )}

            <label className="block text-sm font-medium text-slate-700 mb-1">
              Your Kiosk Mode URL for this Location
            </label>
            <div className="flex items-center gap-2 bg-slate-50 border border-border rounded-md px-3 py-2 mb-2 overflow-hidden">
              <span className="text-xs text-slate-600 truncate flex-1">{settings.kioskUrl}</span>
            </div>
            <Button variant="outline" size="sm" onClick={copyLink} className="w-full mb-3">
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? "Copied" : "Copy Link"}
            </Button>
            <p className="text-xs text-slate-500">
              We recommend using an iPad or similar tablet device. Copy your unique Kiosk URL into a
              web browser and hand it to your customer during checkout or towards the end of the visit.
            </p>
          </div>
        </div>

        <div className="lg:col-span-2">
          <p className="text-sm font-semibold text-slate-900 mb-1">Edit Kiosk Mode Templates</p>
          <p className="text-xs text-slate-500 mb-4">Edit the templates for each step below.</p>

          <div className="relative pl-8">
            <div className="absolute left-3 top-2 bottom-2 w-px bg-border" />
            <div className="space-y-4">
              {settings.steps.map((step) => {
                const Icon = step.icon === "email" ? Mail : Monitor;
                return (
                  <div key={step.id} className="relative">
                    <div className="absolute -left-8 top-4 w-6 h-6 rounded-full bg-berry-600 flex items-center justify-center">
                      <Icon size={12} className="text-white" />
                    </div>
                    <div className="card">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{step.title}</p>
                          <p className="text-xs text-slate-400">{step.status}</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => startEdit(step)}>
                          <Pencil size={12} /> Edit
                        </Button>
                      </div>
                      <p className="text-xs text-slate-500 mb-2">{step.description}</p>

                      {editingId === step.id ? (
                        <div>
                          <textarea
                            value={draft}
                            onChange={(e) => setDraft(e.target.value)}
                            rows={3}
                            className="w-full text-sm border border-border rounded-md p-2 mb-2"
                          />
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => saveEdit(step)}>
                              Save
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-600 bg-slate-50 rounded-md p-2 italic">{step.content}</p>
                      )}

                      {step.hasTiming && (
                        <div className="flex items-center gap-2 mt-3 text-xs text-slate-600">
                          <button
                            onClick={() => toggleTiming(step)}
                            className={`w-9 h-5 rounded-full transition-colors relative ${
                              step.timingEnabled ? "bg-berry-600" : "bg-slate-200"
                            }`}
                          >
                            <span
                              className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                                step.timingEnabled ? "translate-x-4" : "translate-x-0.5"
                              }`}
                            />
                          </button>
                          <span>Timing:</span>
                          <span className="font-medium">
                            {step.timingValue} {step.timingUnit}
                          </span>
                          <span>after feedback left</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

