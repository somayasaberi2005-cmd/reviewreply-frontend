"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getReviews, updateReviewReplyStatus, updateReviewReplyBody, bulkUpdateReviewReplyStatus } from "@/lib/api";
import { useBusinessContext } from "@/lib/business-context";
import { Review, ReplyStatus } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    posted: "bg-berry-50 text-berry-800",
    pending: "bg-amber-50 text-amber-700",
    rejected: "bg-red-50 text-red-700",
  };
  return (
    <span className={`text-xs font-medium px-2 py-1 rounded-full ${styles[status] || "bg-slate-100 text-slate-700"}`}>
      {status}
    </span>
  );
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="text-berry-600 text-sm">
      {"\u2605".repeat(rating)}
      <span className="text-slate-300">{"\u2606".repeat(5 - rating)}</span>
    </span>
  );
}

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

const filterOptions: { label: string; value: "all" | ReplyStatus }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Posted", value: "posted" },
  { label: "Rejected", value: "rejected" },
];

export default function ReviewsPage() {
  const { selectedBusinessId } = useBusinessContext();
  const searchParams = useSearchParams();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftText, setDraftText] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | ReplyStatus>("all");
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") ?? "");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkLoading, setBulkLoading] = useState(false);

  function load() {
    if (!selectedBusinessId) return;
    setLoading(true);
    setError(false);
    getReviews(selectedBusinessId)
      .then((data) => {
        setReviews(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }

  useEffect(load, [selectedBusinessId]);

  useEffect(() => {
    const q = searchParams.get("q") ?? "";
    setSearchQuery(q);
  }, [searchParams]);

  function updateReplyStatus(reviewId: string, newStatus: ReplyStatus) {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId && r.reply
          ? { ...r, replyStatus: newStatus, reply: { ...r.reply, status: newStatus } }
          : r
      )
    );
    updateReviewReplyStatus(reviewId, newStatus);
  }

  function startEditing(review: Review) {
    setEditingId(review.id);
    setDraftText(review.reply?.body ?? "");
  }

  function saveEdit(reviewId: string) {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId && r.reply
          ? { ...r, reply: { ...r.reply, body: draftText } }
          : r
      )
    );
    updateReviewReplyBody(reviewId, draftText);
    setEditingId(null);
  }

  function toggleSelect(reviewId: string) {
    setSelectedIds((prev) =>
      prev.includes(reviewId) ? prev.filter((id) => id !== reviewId) : [...prev, reviewId]
    );
  }

  async function handleBulkAction(newStatus: ReplyStatus) {
    setBulkLoading(true);
    await bulkUpdateReviewReplyStatus(selectedIds, newStatus);
    setReviews((prev) =>
      prev.map((r) =>
        selectedIds.includes(r.id) && r.reply
          ? { ...r, replyStatus: newStatus, reply: { ...r.reply, status: newStatus } }
          : r
      )
    );
    setSelectedIds([]);
    setBulkLoading(false);
  }

  const filteredReviews = reviews.filter((review) => {
    const matchesStatus = statusFilter === "all" || review.replyStatus === statusFilter;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      query === "" ||
      review.reviewer.displayName.toLowerCase().includes(query) ||
      review.reviewText.toLowerCase().includes(query);
    return matchesStatus && matchesSearch;
  });

  const selectablePending = filteredReviews.filter((r) => r.replyStatus === "pending");
  const allSelected = selectablePending.length > 0 && selectablePending.every((r) => selectedIds.includes(r.id));

  function toggleSelectAll() {
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !selectablePending.some((r) => r.id === id)));
    } else {
      setSelectedIds((prev) => [...new Set([...prev, ...selectablePending.map((r) => r.id)])]);
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="page-title">Reviews</h1>
        <p className="page-subtitle">{loading ? "Loading..." : `${reviews.length} reviews across your businesses`}</p>
      </div>

      {error ? (
        <div className="empty-state">
          <AlertCircle className="text-red-400 mb-2" size={28} />
          <p className="font-medium text-slate-700">Couldn't load reviews</p>
          <p className="empty-state-text mb-4">Something went wrong fetching your reviews.</p>
          <button onClick={load} className="text-sm font-medium px-4 py-2 rounded-md bg-berry-600 text-white hover:bg-berry-800">
            Try again
          </button>
        </div>
      ) : loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card">
              <div className="flex items-center gap-3 mb-3">
                <Skeleton className="w-9 h-9 rounded-full" />
                <div>
                  <Skeleton className="h-3 w-24 mb-2" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <Skeleton className="h-3 w-full mb-2" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="flex gap-2">
              {filterOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setStatusFilter(option.value)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
                    statusFilter === option.value
                      ? "bg-berry-600 text-white"
                      : "bg-white border border-border text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder="Search by reviewer or review text..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-sm border border-border rounded-md px-3 py-1.5 flex-1 sm:max-w-xs"
            />
          </div>

          {selectablePending.length > 0 && (
            <div className="flex items-center gap-3 mb-4">
              <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleSelectAll}
                  className="rounded border-border"
                />
                Select all pending
              </label>

              {selectedIds.length > 0 && (
                <div className="flex items-center gap-2 ml-auto bg-berry-50 border border-berry-200 rounded-lg px-3 py-1.5">
                  <span className="text-xs font-medium text-berry-800">{selectedIds.length} selected</span>
                  <button
                    onClick={() => handleBulkAction("posted")}
                    disabled={bulkLoading}
                    className="text-xs font-medium px-3 py-1 rounded-md bg-berry-600 text-white hover:bg-berry-800 disabled:opacity-60"
                  >
                    Approve all
                  </button>
                  <button
                    onClick={() => handleBulkAction("rejected")}
                    disabled={bulkLoading}
                    className="text-xs font-medium px-3 py-1 rounded-md text-red-600 hover:bg-red-50 disabled:opacity-60"
                  >
                    Reject all
                  </button>
                </div>
              )}
            </div>
          )}

          {filteredReviews.length === 0 ? (
            <div className="empty-state">
              <p className="font-medium text-slate-700">No reviews match your filters</p>
              <p className="empty-state-text">Try a different status or search term.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredReviews.map((review) => (
                <div key={review.id} className="card">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {review.replyStatus === "pending" && (
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(review.id)}
                          onChange={() => toggleSelect(review.id)}
                          className="rounded border-border"
                        />
                      )}
                      <div className="avatar-circle">{initials(review.reviewer.displayName)}</div>
                      <div>
                        <p className="font-medium text-slate-900">{review.reviewer.displayName}</p>
                        <Stars rating={review.rating} />
                      </div>
                    </div>
                    <StatusBadge status={review.replyStatus} />
                  </div>

                  <p className="text-sm text-slate-700 mb-3">{review.reviewText}</p>

                  {review.reply && (
                    <div className="bg-slate-50 rounded-lg p-3 border-l-2 border-berry-400">
                      <p className="text-xs font-medium text-berry-800 mb-1">AI-drafted reply</p>

                      {editingId === review.id ? (
                        <div>
                          <textarea
                            value={draftText}
                            onChange={(e) => setDraftText(e.target.value)}
                            className="w-full text-sm text-slate-700 border border-border rounded-md p-2 mb-2"
                            rows={3}
                          />
                          <div className="flex gap-2">
                            <button onClick={() => saveEdit(review.id)} className="text-xs font-medium px-3 py-1.5 rounded-md bg-berry-600 text-white hover:bg-berry-800">
                              Save
                            </button>
                            <button onClick={() => setEditingId(null)} className="text-xs font-medium px-3 py-1.5 rounded-md text-slate-600 hover:bg-slate-100">
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <p className="text-sm text-slate-600 mb-2">{review.reply.body}</p>
                          {review.replyStatus === "pending" && (
                            <div className="flex gap-2">
                              <button onClick={() => updateReplyStatus(review.id, "posted")} className="text-xs font-medium px-3 py-1.5 rounded-md bg-berry-600 text-white hover:bg-berry-800">
                                Approve
                              </button>
                              <button onClick={() => startEditing(review)} className="text-xs font-medium px-3 py-1.5 rounded-md text-slate-600 hover:bg-slate-100">
                                Edit
                              </button>
                              <button onClick={() => updateReplyStatus(review.id, "rejected")} className="text-xs font-medium px-3 py-1.5 rounded-md text-red-600 hover:bg-red-50">
                                Reject
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}