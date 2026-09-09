"use client";

import { useEffect, useState } from "react";
import { getAiReplyPrompts, updateAiReplyPrompts } from "@/lib/api";
import { useBusinessContext } from "@/lib/business-context";
import { useToast } from "@/lib/toast-context";
import { AiReplyPrompts } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

type PromptField = {
  toggleKey: keyof AiReplyPrompts;
  textKey: keyof AiReplyPrompts;
  title: string;
  description: string;
};

const fields: PromptField[] = [
  {
    toggleKey: "customSmartReplyEnabled",
    textKey: "smartReplyPrompt",
    title: "Custom Smart Reply Prompt",
    description: "Edit the prompt used to generate a smart reply when writing manual responses in the dashboard.",
  },
  {
    toggleKey: "customSuggestedReplyEnabled",
    textKey: "suggestedReplyPrompt",
    title: "Custom Suggested Reply Prompt",
    description: "Customize the prompt that sends suggested review replies to you for approval.",
  },
  {
    toggleKey: "customAutoReplyEnabled",
    textKey: "autoReplyPrompt",
    title: "Custom Auto Reply Prompt",
    description: "Customize the prompt used to automatically draft and send review replies.",
  },
];

export default function AiReplyPromptsPage() {
  const { selectedBusinessId } = useBusinessContext();
  const { showToast } = useToast();
  const [prompts, setPrompts] = useState<AiReplyPrompts | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!selectedBusinessId) return;
    setLoading(true);
    getAiReplyPrompts(selectedBusinessId).then((data) => {
      setPrompts(data);
      setLoading(false);
    });
  }, [selectedBusinessId]);

  if (loading || !prompts) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="page-title">AI Reply Prompts</h1>
          <p className="page-subtitle">Loading...</p>
        </div>
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  async function persist(next: AiReplyPrompts) {
    if (!selectedBusinessId) return;
    setPrompts(next);
    await updateAiReplyPrompts(selectedBusinessId, next);
  }

  function toggleField(field: PromptField) {
    if (!prompts) return;
    persist({ ...prompts, [field.toggleKey]: !prompts[field.toggleKey] });
  }

  function updateText(field: PromptField, value: string) {
    if (!prompts) return;
    setPrompts({ ...prompts, [field.textKey]: value });
  }

  function saveText(field: PromptField) {
    if (!prompts) return;
    persist(prompts);
    showToast(`${field.title} saved`);
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="page-title">AI Reply Prompts</h1>
        <p className="page-subtitle">
          Customize the prompts used to generate Smart Reply, Suggested Reply, and Auto Reply messages.
          If toggled off, the system uses the default prompts.
        </p>
      </div>

      <div className="space-y-4">
        {fields.map((field) => {
          const enabled = prompts[field.toggleKey] as boolean;
          const text = prompts[field.textKey] as string;
          return (
            <div key={field.toggleKey} className="card">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <p className="font-semibold text-slate-900">{field.title}</p>
                  <p className="text-sm text-slate-500 mt-1">{field.description}</p>
                </div>
                <button
                  onClick={() => toggleField(field)}
                  className={`flex-shrink-0 w-9 h-5 rounded-full transition-colors relative ${
                    enabled ? "bg-berry-600" : "bg-slate-200"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                      enabled ? "translate-x-4" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>

              {enabled && (
                <div>
                  <textarea
                    value={text}
                    onChange={(e) => updateText(field, e.target.value)}
                    rows={3}
                    className="w-full text-sm border border-border rounded-md p-3 mb-2"
                  />
                  <button
                    onClick={() => saveText(field)}
                    className="text-xs font-medium px-3 py-1.5 rounded-md bg-berry-600 text-white hover:bg-berry-800"
                  >
                    Save
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
