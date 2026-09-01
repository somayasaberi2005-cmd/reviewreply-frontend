"use client";

import { useEffect, useState } from "react";
import { getReviews } from "@/lib/api";
import { Review, ReplyStatus } from "@/lib/types";

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

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftText, setDraftText] = useState("");

  useEffect(() => {
    getReviews().then((data) => {
      setReviews(data);
      setLoading(false);
    });
  }, []);

  function updateReplyStatus(reviewId: string, newStatus: ReplyStatus) {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId && r.reply
          ? { ...r, replyStatus: newStatus, reply: { ...r.reply, status: newStatus } }
          : r
      )
    );
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
    setEditingId(null);
  }

  if (loading) {
    return <p className="text-slate-500 text-sm">Loading reviews...</p>;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="page-title">Reviews</h1>
        <p className="page-subtitle">{reviews.length} reviews across your businesses</p>
      </div>

      {reviews.length === 0 ? (
        <div className="empty-state">
          <p className="font-medium text-slate-700">No reviews yet</p>
          <p className="empty-state-text">Reviews will appear here once your Google Business Profile is connected.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="card">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
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
    </div>
  );
}
