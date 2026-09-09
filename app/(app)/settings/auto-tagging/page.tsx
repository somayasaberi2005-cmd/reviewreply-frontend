"use client";

import { useEffect, useState } from "react";
import { getAutoTags, createAutoTag, deleteAutoTag } from "@/lib/api";
import { useBusinessContext } from "@/lib/business-context";
import { useToast } from "@/lib/toast-context";
import { AutoTag } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Trash2, X } from "lucide-react";

export default function AutoTaggingPage() {
  const { selectedBusinessId } = useBusinessContext();
  const { showToast } = useToast();
  const [tags, setTags] = useState<AutoTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [keywordInput, setKeywordInput] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [appliedToAll, setAppliedToAll] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!selectedBusinessId) return;
    setLoading(true);
    getAutoTags(selectedBusinessId).then((data) => {
      setTags(data);
      setLoading(false);
    });
  }, [selectedBusinessId]);

  function addKeyword() {
    const value = keywordInput.trim();
    if (value && !keywords.includes(value)) setKeywords((prev) => [...prev, value]);
    setKeywordInput("");
  }

  async function handleCreate() {
    if (!selectedBusinessId || !name.trim()) return;
    setSaving(true);
    try {
      const tag = await createAutoTag(selectedBusinessId, name.trim(), keywords, appliedToAll);
      setTags((prev) => [...prev, tag]);
      setName("");
      setKeywords([]);
      setAppliedToAll(false);
      setShowForm(false);
      showToast("Tag created");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!selectedBusinessId) return;
    setTags((prev) => prev.filter((t) => t.id !== id));
    await deleteAutoTag(selectedBusinessId, id);
    showToast("Tag deleted");
  }

  const filtered = tags.filter((t) => t.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">Auto-Tagging</h1>
          <p className="page-subtitle">
            Active Tags: {tags.length} of {tags.length} Total
          </p>
        </div>
        <Button size="sm" onClick={() => setShowForm((prev) => !prev)}>
          <Plus size={14} /> Add New Tag
        </Button>
      </div>

      {showForm && (
        <div className="card mb-5 bg-slate-50">
          <label className="block text-sm font-medium text-slate-700 mb-1">Tag Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Pricing Complaint"
            className="w-full text-sm border border-border rounded-md px-3 py-2 mb-3 bg-white sm:max-w-sm"
          />

          <label className="block text-sm font-medium text-slate-700 mb-1">Keywords</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {keywords.map((k) => (
              <span
                key={k}
                className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-berry-50 text-berry-800"
              >
                {k}
                <button onClick={() => setKeywords((prev) => prev.filter((kw) => kw !== k))}>
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addKeyword();
                }
              }}
              placeholder="Type a keyword and press Enter"
              className="text-sm border border-border rounded-md px-3 py-1.5 flex-1 sm:max-w-xs bg-white"
            />
            <Button variant="outline" size="sm" onClick={addKeyword}>
              Add
            </Button>
          </div>

          <label className="flex items-center gap-2 mb-4 cursor-pointer">
            <input
              type="checkbox"
              checked={appliedToAll}
              onChange={(e) => setAppliedToAll(e.target.checked)}
              className="rounded border-border"
            />
            <span className="text-sm text-slate-700">Apply this tag to all existing reviews that match</span>
          </label>

          <div className="flex gap-2">
            <Button size="sm" onClick={handleCreate} disabled={saving || !name.trim()}>
              {saving ? "Creating..." : "Create Tag"}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {loading ? (
        <Skeleton className="h-48 w-full rounded-2xl" />
      ) : (
        <div className="card">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="text-sm border border-border rounded-md px-3 py-1.5 mb-4 sm:max-w-xs"
          />

          {filtered.length === 0 ? (
            <div className="empty-state">
              <p className="font-medium text-slate-700">No tags yet</p>
              <p className="empty-state-text">Add a tag to start auto-tagging matching reviews.</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-slate-500">
                  <th className="py-2 pr-4">Tag Name</th>
                  <th className="py-2 pr-4">Auto-Tagging</th>
                  <th className="py-2 pr-4">Keywords</th>
                  <th className="py-2 pr-4">Applied To All Reviews</th>
                  <th className="py-2 pr-4 text-right">Manage</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((tag) => (
                  <tr key={tag.id} className="border-b border-border last:border-0">
                    <td className="py-2 pr-4 font-medium text-slate-900">{tag.name}</td>
                    <td className="py-2 pr-4">
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-berry-50 text-berry-800">
                        Active
                      </span>
                    </td>
                    <td className="py-2 pr-4 text-slate-600">{tag.keywords.join(", ") || "-"}</td>
                    <td className="py-2 pr-4 text-slate-600">{tag.appliedToAllReviews ? "Yes" : "No"}</td>
                    <td className="py-2 pr-4 text-right">
                      <button onClick={() => handleDelete(tag.id)} className="text-slate-400 hover:text-red-600">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
