export type ReplyStatus = "pending" | "posted" | "rejected";

export type Business = {
  id: string;
  name: string;
  shortName: string;
  city: string;
  state: string;
  status: string;
  googleConnected: boolean;
};

export type Reviewer = {
  id: string;
  displayName: string;
  profilePhotoUrl?: string;
};

export type ReviewReply = {
  id: string;
  reviewId: string;
  body: string;
  status: ReplyStatus;
  source: "ai" | "manual";
  publishedAt: string | null;
};

export type Review = {
  id: string;
  businessId: string;
  businessReviewSiteId: string;
  reviewer: Reviewer;
  rating: number; // 1-5
  reviewText: string;
  reviewCreatedAt: string; // ISO date
  replyStatus: ReplyStatus;
  reply?: ReviewReply;
  businessName: string; // denormalized for display convenience
};

export type DashboardStats = {
  totalReviews: number;
  averageRating: number;
  pendingReplies: number;
  responseRate: number; // percentage, e.g. 94
};
export type SentimentBreakdown = {
  positive: number;
  neutral: number;
  negative: number;
};

export type ReportSummary = {
  replyRate: number; // percentage
  avgResponseTimeHours: number;
  sentiment: SentimentBreakdown;
};