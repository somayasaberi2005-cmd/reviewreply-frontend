import { Review, DashboardStats, Business, ReportSummary, ReplyStatus } from "./types";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const mockReviews: Review[] = [
  {
    id: "1",
    businessId: "b1",
    businessReviewSiteId: "brs-1",
    reviewer: { id: "r1", displayName: "Sadaf Ahmadi" },
    rating: 5,
    reviewText: "Fantastic service, will come back again!",
    reviewCreatedAt: "2026-08-20",
    replyStatus: "posted",
    reply: {
      id: "rep-1",
      reviewId: "1",
      body: "Thank you so much, Sadaf! We're thrilled you had a great experience and can't wait to see you again.",
      status: "posted",
      source: "ai",
      publishedAt: "2026-08-20T14:30:00Z",
    },
    businessName: "Roshan",
  },
  {
    id: "2",
    businessId: "b1",
    businessReviewSiteId: "brs-1",
    reviewer: { id: "r2", displayName: "Ali Rahimi" },
    rating: 2,
    reviewText: "Waited 40 minutes for my order.",
    reviewCreatedAt: "2026-08-25",
    replyStatus: "pending",
    reply: {
      id: "rep-2",
      reviewId: "2",
      body: "Hi Ali, we're very sorry about the wait ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â that's not the experience we aim for. We'd love the chance to make it right.",
      status: "pending",
      source: "ai",
      publishedAt: null,
    },
    businessName: "Roshan",
  },
  {
    id: "3",
    businessId: "b2",
    businessReviewSiteId: "brs-2",
    reviewer: { id: "r3", displayName: "Mahdi Karimi" },
    rating: 4,
    reviewText: "Good service, a bit slow at times.",
    reviewCreatedAt: "2026-08-27",
    replyStatus: "pending",
    businessName: "Azizi Bank",
  },
];

const mockBusinesses: Business[] = [
  { id: "b1", name: "Roshan", shortName: "Roshan", city: "Kabul", state: "Kabul", status: "active", googleConnected: true },
  { id: "b2", name: "Azizi Bank", shortName: "Azizi Bank", city: "Kabul", state: "Kabul", status: "active", googleConnected: false },
  { id: "b3", name: "Etisalat Afghanistan", shortName: "Etisalat", city: "Herat", state: "Herat", status: "active", googleConnected: false },
  { id: "b4", name: "Afghan Wireless (AWCC)", shortName: "AWCC", city: "Mazar-i-Sharif", state: "Balkh", status: "active", googleConnected: false },
  { id: "b5", name: "Kabul Bank", shortName: "Kabul Bank", city: "Kandahar", state: "Kandahar", status: "active", googleConnected: false },
];

export async function getReviews(businessId?: string): Promise<Review[]> {
  await delay(300);
  if (!businessId) return mockReviews;
  return mockReviews.filter((r) => r.businessId === businessId);
}

export async function updateReviewReplyStatus(reviewId: string, newStatus: ReplyStatus): Promise<Review> {
  await delay(200);
  const review = mockReviews.find((r) => r.id === reviewId);
  if (!review) throw new Error("Review not found");
  review.replyStatus = newStatus;
  if (review.reply) {
    review.reply.status = newStatus;
  }
  return review;
}

export async function updateReviewReplyBody(reviewId: string, body: string): Promise<Review> {
  await delay(200);
  const review = mockReviews.find((r) => r.id === reviewId);
  if (!review) throw new Error("Review not found");
  if (review.reply) {
    review.reply.body = body;
  }
  return review;
}

export async function getDashboardStats(businessId?: string, range: DateRange = "all"): Promise<DashboardStats> {
  await delay(300);
  let relevant = businessId
    ? mockReviews.filter((r) => r.businessId === businessId)
    : mockReviews;
  relevant = filterByDateRange(relevant, range);

  const avgRating =
    relevant.length > 0
      ? relevant.reduce((sum, r) => sum + r.rating, 0) / relevant.length
      : 0;

  return {
    totalReviews: relevant.length,
    averageRating: Math.round(avgRating * 10) / 10,
    pendingReplies: relevant.filter((r) => r.replyStatus === "pending").length,
    responseRate: relevant.length > 0
      ? Math.round((relevant.filter((r) => r.replyStatus !== "pending").length / relevant.length) * 100)
      : 0,
  };
}

export async function getBusinesses(): Promise<Business[]> {
  await delay(300);
  return mockBusinesses;
}

export async function connectGoogleBusinessProfile(businessId: string): Promise<Business> {
  await delay(1200);
  const business = mockBusinesses.find((b) => b.id === businessId);
  if (!business) throw new Error("Business not found");
  business.googleConnected = true;
  return business;
}

export async function getReportSummary(businessId?: string, range: DateRange = "all"): Promise<ReportSummary> {
  await delay(300);
  let relevant = businessId
    ? mockReviews.filter((r) => r.businessId === businessId)
    : mockReviews;
  relevant = filterByDateRange(relevant, range);

  const replyRate = relevant.length > 0
    ? Math.round((relevant.filter((r) => r.replyStatus !== "pending").length / relevant.length) * 100)
    : 0;

  const positive = relevant.filter((r) => r.rating >= 4).length;
  const neutral = relevant.filter((r) => r.rating === 3).length;
  const negative = relevant.filter((r) => r.rating <= 2).length;
  const total = relevant.length || 1;

  return {
    replyRate,
    avgResponseTimeHours: 3.2,
    sentiment: {
      positive: Math.round((positive / total) * 100),
      neutral: Math.round((neutral / total) * 100),
      negative: Math.round((negative / total) * 100),
    },
  };
}
export async function getNegativeReviewAlerts(businessId?: string): Promise<Review[]> {
  await delay(200);
  const relevant = businessId
    ? mockReviews.filter((r) => r.businessId === businessId)
    : mockReviews;
  return relevant.filter((r) => r.rating <= 2 && r.replyStatus === "pending");
}

export async function bulkUpdateReviewReplyStatus(reviewIds: string[], newStatus: ReplyStatus): Promise<void> {
  await delay(300);
  reviewIds.forEach((id) => {
    const review = mockReviews.find((r) => r.id === id);
    if (review) {
      review.replyStatus = newStatus;
      if (review.reply) {
        review.reply.status = newStatus;
      }
    }
  });
}

export type DateRange = "7d" | "30d" | "all";

function filterByDateRange(reviews: Review[], range: DateRange): Review[] {
  if (range === "all") return reviews;
  const days = range === "7d" ? 7 : 30;
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return reviews.filter((r) => new Date(r.reviewCreatedAt) >= cutoff);
}

export async function getPendingCountsByBusiness(): Promise<Record<string, number>> {
  await delay(200);
  const counts: Record<string, number> = {};
  mockReviews.forEach((r) => {
    if (r.replyStatus === "pending") {
      counts[r.businessId] = (counts[r.businessId] ?? 0) + 1;
    }
  });
  return counts;
}

export async function getRatingDistribution(businessId?: string, range: DateRange = "all"): Promise<number[]> {
  await delay(200);
  let relevant = businessId
    ? mockReviews.filter((r) => r.businessId === businessId)
    : mockReviews;
  relevant = filterByDateRange(relevant, range);

  const distribution = [0, 0, 0, 0, 0];
  relevant.forEach((r) => {
    if (r.rating >= 1 && r.rating <= 5) {
      distribution[r.rating - 1]++;
    }
  });
  return distribution;
}
