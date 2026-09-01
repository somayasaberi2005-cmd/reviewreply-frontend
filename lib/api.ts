import { Review, DashboardStats, Business, ReportSummary } from "./types";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const mockReviews: Review[] = [
  {
    id: "1",
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
    businessReviewSiteId: "brs-1",
    reviewer: { id: "r3", displayName: "Priya Patel" },
    rating: 4,
    reviewText: "Good food, a bit pricey.",
    reviewCreatedAt: "2026-08-27",
    replyStatus: "pending",
    businessName: "Downtown Cafe",
  },
];

const mockBusinesses: Business[] = [
  { id: "b1", name: "Downtown Cafe", shortName: "Downtown", city: "Austin", state: "TX", status: "active" },
  { id: "b2", name: "Riverside Diner", shortName: "Riverside", city: "Austin", state: "TX", status: "active" },
];

export async function getReviews(): Promise<Review[]> {
  await delay(300);
  return mockReviews;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  await delay(300);
  return {
    totalReviews: mockReviews.length,
    averageRating: 4.6,
    pendingReplies: mockReviews.filter((r) => r.replyStatus === "pending").length,
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