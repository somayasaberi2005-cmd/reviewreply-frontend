import { Review, DashboardStats, Business, ReportSummary } from "./types";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const mockReviews: Review[] = [
  {
    id: "1",
    businessId: "b1",
    businessReviewSiteId: "brs-1",
    reviewer: { id: "r1", displayName: "Sarah Chen" },
    rating: 5,
    reviewText: "Fantastic service, will come back again!",
    reviewCreatedAt: "2026-08-20",
    replyStatus: "posted",
    reply: {
      id: "rep-1",
      reviewId: "1",
      body: "Thank you so much, Sarah! We're thrilled you had a great experience and can't wait to see you again.",
      status: "posted",
      source: "ai",
      publishedAt: "2026-08-20T14:30:00Z",
    },
    businessName: "Downtown Cafe",
  },
  {
    id: "2",
    businessId: "b1",
    businessReviewSiteId: "brs-1",
    reviewer: { id: "r2", displayName: "James Okoro" },
    rating: 2,
    reviewText: "Waited 40 minutes for my order.",
    reviewCreatedAt: "2026-08-25",
    replyStatus: "pending",
    reply: {
      id: "rep-2",
      reviewId: "2",
      body: "Hi James, we're very sorry about the wait — that's not the experience we aim for. We'd love the chance to make it right.",
      status: "pending",
      source: "ai",
      publishedAt: null,
    },
    businessName: "Downtown Cafe",
  },
  {
    id: "3",
    businessId: "b2",
    businessReviewSiteId: "brs-2",
    reviewer: { id: "r3", displayName: "Priya Patel" },
    rating: 4,
    reviewText: "Good food, a bit pricey.",
    reviewCreatedAt: "2026-08-27",
    replyStatus: "pending",
    businessName: "Riverside Diner",
  },
];

const mockBusinesses: Business[] = [
  { id: "b1", name: "Downtown Cafe", shortName: "Downtown", city: "Austin", state: "TX", status: "active" },
  { id: "b2", name: "Riverside Diner", shortName: "Riverside", city: "Austin", state: "TX", status: "active" },
];

export async function getReviews(businessId?: string): Promise<Review[]> {
  await delay(300);
  if (!businessId) return mockReviews;
  return mockReviews.filter((r) => r.businessId === businessId);
}

export async function getDashboardStats(businessId?: string): Promise<DashboardStats> {
  await delay(300);
  const relevant = businessId
    ? mockReviews.filter((r) => r.businessId === businessId)
    : mockReviews;

  const avgRating =
    relevant.length > 0
      ? relevant.reduce((sum, r) => sum + r.rating, 0) / relevant.length
      : 0;

  return {
    totalReviews: relevant.length,
    averageRating: Math.round(avgRating * 10) / 10,
    pendingReplies: relevant.filter((r) => r.replyStatus === "pending").length,
    responseRate: 94,
  };
}

export async function getBusinesses(): Promise<Business[]> {
  await delay(300);
  return mockBusinesses;
}

export async function getReportSummary(): Promise<ReportSummary> {
  await delay(300);
  return {
    replyRate: 94,
    avgResponseTimeHours: 3.2,
    sentiment: { positive: 62, neutral: 21, negative: 17 },
  };
}