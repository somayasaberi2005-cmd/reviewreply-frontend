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
export type UserRole = "owner" | "regional_manager" | "location_manager" | "viewer";

export type CurrentUser = {
  id: string;
  name: string;
  role: UserRole;
};

export type CommunicationPreference = "email" | "sms" | "both";

export type Customer = {
  id: string;
  businessId: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  notes?: string;
  communicationPreference: CommunicationPreference;
  customId?: string;
  tags: string[];
  sendImmediately: boolean;
  createdAt: string; // ISO date
};

export type NewCustomerInput = Omit<Customer, "id" | "createdAt">;

export type ImportSummary = {
  totalRows: number;
  imported: number;
  skipped: number;
};

export type RequestFlowChannel = "email" | "sms" | "email_sms" | "web";

export type RequestFlowStepId =
  | "rating_request"
  | "first_rating_reminder"
  | "second_rating_reminder"
  | "survey_questions"
  | "public_review_request"
  | "first_review_reminder"
  | "second_review_reminder"
  | "apology_page"
  | "negative_feedback_page"
  | "submission_confirmation"
  | "apology_email";

export type RequestFlowStep = {
  id: RequestFlowStepId;
  section: "core" | "positive" | "negative";
  channel: RequestFlowChannel;
  title: string;
  description: string;
  editable: boolean;
  enabled: boolean;
  delayValue?: number;
  delayUnit?: "hours" | "days";
  delayContext?: string;
};

export type RequestFlowSettings = {
  flowType: string;
  steps: RequestFlowStep[];
};

export type SmsMessageType = "sms" | "mms";

export type SmsSettings = {
  messageType: SmsMessageType;
  message: string;
  includeFeedbackUrl: boolean;
  feedbackUrl: string;
};

export type KioskTemplateIcon = "web" | "email";

export type KioskTemplateStep = {
  id: string;
  icon: KioskTemplateIcon;
  title: string;
  status: string;
  description: string;
  content: string;
  hasTiming?: boolean;
  timingEnabled?: boolean;
  timingValue?: number;
  timingUnit?: "hours" | "days";
};

export type KioskSettings = {
  kioskUrl: string;
  steps: KioskTemplateStep[];
};

export type TextBackSettings = {
  active: boolean;
  country: string;
  phoneNumber: string;
  keywords: string[];
  autoReplyMessage: string;
  feedbackUrl: string;
};

export type WidgetSize = "large" | "small";

export type EmailSignatureSurveySettings = {
  widgetSize: WidgetSize;
  promptText: string;
  redirectUrl: string;
  trackClicks: boolean;
};
