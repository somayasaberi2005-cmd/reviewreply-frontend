"use client";

import { useEffect, useState } from "react";
import { getRequestFlow, updateRequestFlowStep } from "@/lib/api";
import { useBusinessContext } from "@/lib/business-context";
import { useToast } from "@/lib/toast-context";
import { RequestFlowStep, RequestFlowChannel } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

function ChannelBadge({ channel }: { channel: RequestFlowChannel }) {
  const labels: Record<RequestFlowChannel, string> = {
    email: "Email",
    sms: "SMS",
    email_sms: "Email/SMS",
    web: "Web",
  };
  return (
    <span className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
      {labels[channel]}
    </span>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mt-6 mb-2">{children}</p>;
}

export default function RequestSetupPage() {
  const { selectedBusinessId } = useBusinessContext();
  const { showToast } = useToast();
  const [steps, setSteps] = useState<RequestFlowStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [previewRating, setPreviewRating] = useState<number | null>(null);

  useEffect(() => {
    if (!selectedBusinessId) return;
    setLoading(true);
    getRequestFlow(selectedBusinessId).then((data) => {
      setSteps(data.steps);
      setSelectedId(data.steps[0]?.id ?? null);
      setLoading(false);
    });
  }, [selectedBusinessId]);

  function toggleStep(step: RequestFlowStep) {
    if (!selectedBusinessId || !step.editable) return;
    const nextEnabled = !step.enabled;
    setSteps((prev) => prev.map((s) => (s.id === step.id ? { ...s, enabled: nextEnabled } : s)));
    updateRequestFlowStep(selectedBusinessId, step.id, { enabled: nextEnabled });
    showToast(nextEnabled ? `${step.title} turned on` : `${step.title} turned off`);
  }

  function updateDelay(step: RequestFlowStep, value: number) {
    if (!selectedBusinessId) return;
    setSteps((prev) => prev.map((s) => (s.id === step.id ? { ...s, delayValue: value } : s)));
    updateRequestFlowStep(selectedBusinessId, step.id, { delayValue: value });
  }

  const coreSteps = steps.filter((s) => s.section === "core");
  const positiveSteps = steps.filter((s) => s.section === "positive");
  const negativeSteps = steps.filter((s) => s.section === "negative");
  const selectedStep = steps.find((s) => s.id === selectedId) ?? steps[0];

  function StepCard({ step }: { step: RequestFlowStep }) {
    const isSelected = step.id === selectedStep?.id;
    return (
      <div
        onClick={() => setSelectedId(step.id)}
        className={`card cursor-pointer mb-3 ${isSelected ? "border-berry-400 ring-1 ring-berry-200" : ""}`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <ChannelBadge channel={step.channel} />
            </div>
            <p className="text-sm font-semibold text-slate-900">{step.title}</p>
            <p className="text-xs text-slate-500 mt-1">{step.description}</p>

            {step.editable && step.enabled && step.delayValue !== undefined && (
              <div className="flex items-center gap-2 mt-3 text-xs text-slate-600" onClick={(e) => e.stopPropagation()}>
                <span>Send</span>
                <input
                  type="number"
                  min={1}
                  value={step.delayValue}
                  onChange={(e) => updateDelay(step, Number(e.target.value))}
                  className="w-14 border border-border rounded-md px-2 py-1 text-xs"
                />
                <span>{step.delayUnit}</span>
                <span>{step.delayContext}</span>
              </div>
            )}
          </div>

          {step.editable && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleStep(step);
              }}
              className={`flex-shrink-0 w-9 h-5 rounded-full transition-colors relative ${
                step.enabled ? "bg-berry-600" : "bg-slate-200"
              }`}
            >
              <span
                className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                  step.enabled ? "translate-x-4" : "translate-x-0.5"
                }`}
              />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="page-title">Request Setup</h1>
        <p className="page-subtitle">Design the flow contacts follow after receiving a review request.</p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <select className="text-sm border border-border rounded-md px-3 py-2 mb-2 w-full sm:w-auto">
              <option>Survey & Reviews Flow (preferred)</option>
            </select>

            {coreSteps.map((step) => (
              <StepCard key={step.id} step={step} />
            ))}

            <SectionLabel>Positive Flow</SectionLabel>
            {positiveSteps.map((step) => (
              <StepCard key={step.id} step={step} />
            ))}

            <SectionLabel>Negative Flow</SectionLabel>
            {negativeSteps.map((step) => (
              <StepCard key={step.id} step={step} />
            ))}
          </div>

          <div className="lg:sticky lg:top-6 h-fit">
            <p className="text-sm font-semibold text-slate-900 mb-1">{selectedStep?.title}</p>
            {selectedStep?.channel !== "web" && (
              <p className="text-xs text-slate-500 mb-3">
                Subject: Hi [customer first name], just a few questions
              </p>
            )}

            <div className="bg-slate-50 border border-border rounded-2xl p-6 text-center">
              {selectedStep?.channel === "web" ? (
                <>
                  <p className="text-sm font-medium text-slate-900 mb-4">{selectedStep.description}</p>
                  <div className="bg-white border border-border rounded-lg p-4 text-xs text-slate-400">
                    Web page preview
                  </div>
                </>
              ) : (
                <>
                  <p className="text-sm text-slate-800 mb-4">Please tell us about your experience.</p>
                  <p className="text-xs text-slate-600 mb-3">
                    How likely is it that you would recommend <span className="font-medium">our company</span> to a
                    friend or colleague?
                  </p>
                  <div className="flex flex-wrap justify-center gap-1.5 mb-2">
                    {Array.from({ length: 11 }, (_, i) => i).map((n) => (
                      <button
                        key={n}
                        onClick={() => setPreviewRating(n)}
                        className={`w-7 h-7 rounded-full text-xs flex items-center justify-center transition-colors ${
                          previewRating === n ? "bg-berry-600 text-white" : "bg-slate-800 text-white hover:bg-slate-700"
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 mb-5 px-1">
                    <span>0 = Not Likely</span>
                    <span>10 = Very Likely</span>
                  </div>
                  <p className="text-xs text-berry-800 underline">Unsubscribe</p>
                  <p className="text-[10px] text-slate-400 mt-4">Powered by ReviewReply</p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
