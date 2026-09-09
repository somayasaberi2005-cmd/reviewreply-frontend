"use client";

import { useEffect, useState } from "react";
import { getTagWidgets, createTagWidget, deleteTagWidget, getReviewWidgetSettings } from "@/lib/api";
import { useBusinessContext } from "@/lib/business-context";
import { useToast } from "@/lib/toast-context";
import { TagWidget } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Trash2, X } from "lucide-react";

export default function TagWidgetPage() {
  const { selectedBusinessId } = useBusinessContext();
  const { showToast } = useToast();
  const [widgets, setWidgets] = useState<TagWidget[]>([]);
  const [reviewWidgetActive, setReviewWidgetActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!selectedBusinessId) return;
    setLoading(true);
    Promise.all([getTagWidgets(selectedBusinessId), getReviewWidgetSettings(selectedBusinessId)]).then(
      ([widgetData, reviewWidgetData]) => {
        setWidgets(widgetData);
        setReviewWidgetActive(reviewWidgetData.active);
        setLoading(false);
      }
    );
  }, [selectedBusinessId]);

  function addTag() {
    const value = tagInput.trim();
    if (value && !tags.includes(value)) setTags((prev) => [...prev, value]);
    setTagInput("");
  }

  async function handleCreate() {
    if (!selectedBusinessId || !name.trim() || tags.length === 0) return;
    setSaving(true);
    try {
      const widget = await createTagWidget(selectedBusinessId, name.trim(), tags);
      setWidgets((prev) => [...prev, widget]);
      setName("");
      setTags([]);
      setShowForm(false);
      showToast("Tag widget created");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!selectedBusinessId) return;
    setWidgets((prev) => prev.filter((w) => w.id !== id));
    await deleteTagWidget(selectedBusinessId, id);
    showToast("Tag widget deleted");
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="page-title">Tag Widget</h1>
        <p className="page-subtitle">
          Tag widgets let you create custom review widgets for specific services, products, or service
          areas. They link to the page where your Review Widget is displayed; currently your Review
          Widget is{" "}
          <span className={reviewWidgetActive ? "text-berry-600 font-medium" : "text-red-600 font-medium"}>
            {reviewWidgetActive ? "active" : "not active"}
          </span>
          .
        </p>
      </div>

      {loading ? (
        <Skeleton className="h-48 w-full rounded-2xl" />
      ) : (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <p className="font-semibold text-slate-900">Your Tag Widgets</p>
            <Button size="sm" onClick={() => setShowForm((prev) => !prev)}>
              <Plus size={14} /> Add Widget
            </Button>
          </div>

          {showForm && (
            <div className="border border-border rounded-xl p-4 mb-5 bg-slate-50">
              <label className="block text-sm font-medium text-slate-700 mb-1">Widget Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Haircuts"
                className="w-full text-sm border border-border rounded-md px-3 py-2 mb-3 bg-white"
              />

              <label className="block text-sm font-medium text-slate-700 mb-1">Tags Used</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-berry-50 text-berry-800"
                  >
                    {tag}
                    <button onClick={() => setTags((prev) => prev.filter((t) => t !== tag))}>
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  placeholder="Type a tag and press Enter"
                  className="text-sm border border-border rounded-md px-3 py-1.5 flex-1 bg-white"
                />
                <Button variant="outline" size="sm" onClick={addTag}>
                  Add
                </Button>
              </div>

              <div className="flex gap-2">
                <Button size="sm" onClick={handleCreate} disabled={saving || !name.trim() || tags.length === 0}>
                  {saving ? "Creating..." : "Create Widget"}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {widgets.length === 0 ? (
            <div className="empty-state">
              <p className="font-medium text-slate-700">No tag widgets yet</p>
              <p className="empty-state-text">Add one to create a scoped review widget for specific tags.</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-slate-500">
                  <th className="py-2 pr-4">Widget Name</th>
                  <th className="py-2 pr-4">Tags Used</th>
                  <th className="py-2 pr-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {widgets.map((w) => (
                  <tr key={w.id} className="border-b border-border last:border-0">
                    <td className="py-2 pr-4 font-medium text-slate-900">{w.name}</td>
                    <td className="py-2 pr-4 text-slate-600">{w.tags.join(", ")}</td>
                    <td className="py-2 pr-4 text-right">
                      <button
                        onClick={() => handleDelete(w.id)}
                        className="text-slate-400 hover:text-red-600"
                      >
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
