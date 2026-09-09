"use client";

import { useEffect, useState } from "react";
import {
  getReviewSiteLinks,
  addReviewSiteLink,
  updateReviewSiteLink,
  deleteReviewSiteLink,
  moveReviewSiteLink,
} from "@/lib/api";
import { useBusinessContext } from "@/lib/business-context";
import { useToast } from "@/lib/toast-context";
import { ReviewSiteLink, ReviewSiteId } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUp, ArrowDown, Trash2, ExternalLink } from "lucide-react";

const siteNames: Record<ReviewSiteId, string> = {
  google: "Google",
  facebook: "Facebook",
  yelp: "Yelp",
  tripadvisor: "Tripadvisor",
};

const allSites: ReviewSiteId[] = ["google", "facebook", "yelp", "tripadvisor"];

export default function OnlineReviewLinksPage() {
  const { selectedBusinessId } = useBusinessContext();
  const { showToast } = useToast();
  const [links, setLinks] = useState<ReviewSiteLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSite, setSelectedSite] = useState<ReviewSiteId | "">("");

  useEffect(() => {
    if (!selectedBusinessId) return;
    setLoading(true);
    getReviewSiteLinks(selectedBusinessId).then((data) => {
      setLinks(data.sort((a, b) => a.order - b.order));
      setLoading(false);
    });
  }, [selectedBusinessId]);

  const availableSites = allSites.filter((s) => !links.some((l) => l.site === s));

  async function handleAdd() {
    if (!selectedBusinessId || !selectedSite) return;
    const link = await addReviewSiteLink(selectedBusinessId, selectedSite as ReviewSiteId);
    setLinks((prev) => [...prev, link]);
    setSelectedSite("");
  }

  function updateField(id: string, changes: Partial<ReviewSiteLink>) {
    setLinks((prev) => prev.map((l) => (l.id === id ? { ...l, ...changes } : l)));
  }

  async function saveField(link: ReviewSiteLink) {
    if (!selectedBusinessId) return;
    await updateReviewSiteLink(selectedBusinessId, link.id, link);
    showToast("Saved");
  }

  async function handleDelete(id: string) {
    if (!selectedBusinessId) return;
    setLinks((prev) => prev.filter((l) => l.id !== id));
    await deleteReviewSiteLink(selectedBusinessId, id);
    showToast("Review site removed");
  }

  async function handleMove(id: string, direction: "up" | "down") {
    if (!selectedBusinessId) return;
    const index = links.findIndex((l) => l.id === id);
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= links.length) return;
    const next = [...links];
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
    setLinks(next);
    await moveReviewSiteLink(selectedBusinessId, id, direction);
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="page-title">Online Review Links</h1>
        <p className="page-subtitle">
          Add your review profile links here. The sites you select will appear in your review
          requests, widgets, and reports. We recommend at least 2 review sites to get the most reviews.
        </p>
      </div>

      <div className="card mb-5">
        <p className="text-sm font-medium text-slate-700 mb-2">Select a Review Site</p>
        <div className="flex gap-2">
          <select
            value={selectedSite}
            onChange={(e) => setSelectedSite(e.target.value as ReviewSiteId)}
            className="text-sm border border-border rounded-md px-3 py-2 flex-1 sm:max-w-xs"
          >
            <option value="">Select a site</option>
            {availableSites.map((s) => (
              <option key={s} value={s}>
                {siteNames[s]}
              </option>
            ))}
          </select>
          <Button onClick={handleAdd} disabled={!selectedSite}>
            Add Review Site
          </Button>
        </div>
      </div>

      {loading ? (
        <Skeleton className="h-40 w-full rounded-2xl" />
      ) : links.length === 0 ? (
        <div className="empty-state">
          <p className="font-medium text-slate-700">No review sites added yet</p>
          <p className="empty-state-text">Add at least 2 sites above to get started.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {links.map((link, i) => (
            <div key={link.id} className="card">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-2">
                  <ExternalLink size={16} className="text-slate-400" />
                  <p className="font-semibold text-slate-900">{siteNames[link.site]}</p>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleMove(link.id, "up")}
                    disabled={i === 0}
                    className="text-xs font-medium px-2 py-1 rounded-md border border-border text-slate-500 hover:bg-slate-50 disabled:opacity-40 flex items-center gap-1"
                  >
                    <ArrowUp size={12} /> Move Up
                  </button>
                  <button
                    onClick={() => handleMove(link.id, "down")}
                    disabled={i === links.length - 1}
                    className="text-xs font-medium px-2 py-1 rounded-md border border-border text-slate-500 hover:bg-slate-50 disabled:opacity-40 flex items-center gap-1"
                  >
                    <ArrowDown size={12} /> Move Down
                  </button>
                  <button
                    onClick={() => handleDelete(link.id)}
                    className="text-xs font-medium px-2 py-1 rounded-md border border-border text-red-500 hover:bg-red-50 flex items-center gap-1"
                  >
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs text-slate-500 mb-1">Profile URL</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={link.url}
                      onChange={(e) => updateField(link.id, { url: e.target.value })}
                      className="flex-1 text-sm border border-border rounded-md px-3 py-1.5"
                    />
                    <Button size="sm" onClick={() => saveField(link)}>
                      Save
                    </Button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">CID Number</label>
                  <input
                    type="text"
                    value={link.cidNumber}
                    onChange={(e) => updateField(link.id, { cidNumber: e.target.value })}
                    onBlur={() => saveField(link)}
                    className="w-full text-sm border border-border rounded-md px-3 py-1.5"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={link.askForReviews}
                    onChange={(e) => {
                      updateField(link.id, { askForReviews: e.target.checked });
                      saveField({ ...link, askForReviews: e.target.checked });
                    }}
                    className="rounded border-border"
                  />
                  Ask for reviews on this profile URL
                </label>
                <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={link.monitorReviews}
                    onChange={(e) => {
                      updateField(link.id, { monitorReviews: e.target.checked });
                      saveField({ ...link, monitorReviews: e.target.checked });
                    }}
                    className="rounded border-border"
                  />
                  Monitor online reviews on this profile URL
                </label>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
