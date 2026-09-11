"use client";

import { useState } from "react";
import { Check } from "lucide-react";

const steps = [
  { title: "Connect Google Business Profile", desc: "Authorize your Google account so we can read and reply to reviews." },
  { title: "Add your first customer", desc: "Send a test review request to yourself to see the full flow." },
  { title: "Customize your reply tone", desc: "Set your AI reply preferences in AI Settings." },
  { title: "Invite your team", desc: "Add teammates in User Management with the right role." },
];

export default function SetupWizardPage() {
  const [completed, setCompleted] = useState<number[]>([]);

  function toggleStep(i: number) {
    setCompleted((prev) => (prev.includes(i) ? prev.filter((n) => n !== i) : [...prev, i]));
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="page-title">Setup Wizard</h1>
        <p className="page-subtitle">Follow these steps to get your account fully set up.</p>
      </div>

      <div className="space-y-3 max-w-xl">
        {steps.map((step, i) => {
          const done = completed.includes(i);
          return (
            <div key={i} className="card flex items-start gap-3">
              <button
                onClick={() => toggleStep(i)}
                className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  done ? "bg-berry-600 text-white" : "border border-border text-transparent"
                }`}
              >
                <Check size={14} />
              </button>
              <div>
                <p className={`text-sm font-medium ${done ? "text-slate-400 line-through" : "text-slate-900"}`}>{step.title}</p>
                <p className="text-xs text-slate-500">{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
