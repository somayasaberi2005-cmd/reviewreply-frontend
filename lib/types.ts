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

export type IntegrationId = "universal_email" | "google_sheets";

export type Integration = {
  id: IntegrationId;
  name: string;
  description: string;
  connected: boolean;
};

export type SmartInsight = {
  id: string;
  text: string;
};

export type PerformanceDataPoint = {
  month: string;
  requestsSent: number;
  feedbackReceived: number;
};

export type PerformanceSummary = {
  requestsSent: number;
  opens: number;
  openRate: number;
  feedbackReceived: number;
  feedbackRate: number;
  reviewClicks: number;
  newReviews: number;
  trend: PerformanceDataPoint[];
};

export type ReviewReportDetail = {
  id: string;
  site: string;
  rating: number;
  reviewContent: string;
  date: string;
  name: string;
};

export type ReviewsReportSummary = {
  overallRating: number;
  totalReviews: number;
  newLast30Days: number;
  newSinceJoining: number;
  ratingBreakdown: { stars: number; count: number }[];
  sources: { name: string; count: number }[];
  monthly: { month: string; count: number }[];
  details: ReviewReportDetail[];
};

export type NpsDataPoint = {
  month: string;
  score: number;
};

export type NpsReportSummary = {
  score: number;
  promoterPct: number;
  passivePct: number;
  detractorPct: number;
  promoterCount: number;
  passiveCount: number;
  detractorCount: number;
  totalResponses: number;
  trend: NpsDataPoint[];
};

export type SuccessReportSummary = {
  npsScore: number;
  npsPromoterPct: number;
  npsDetractorPct: number;
  npsTotalResponses: number;
  thirdPartyRating: number;
  thirdPartyTotal: number;
  thirdPartySinceJoining: number;
  firstPartyRating: number;
  firstPartyTotal: number;
  firstPartyLast30Days: number;
  details: ReviewReportDetail[];
};

export type BusinessReportRow = {
  businessId: string;
  businessName: string;
  locationId: string;
  rating: number;
  requestsSent: number;
  opens: number;
  openRate: number;
  feedbackReceived: number;
  feedbackRate: number;
  responseRate: number;
  reviewClicks: number;
  newReviews: number;
  totalReviews: number;
};

export type QaStatus = "open" | "closed" | "reported" | "removed";

export type QaEntry = {
  id: string;
  location: string;
  question: string;
  answer: string;
  date: string;
  status: QaStatus;
};

export type CompetitorReportStatus = {
  enabled: boolean;
};

export type WidgetLayout = "vertical" | "horizontal" | "full_page" | "data_only";

export type ReviewWidgetSettings = {
  layout: WidgetLayout;
  showRatingSummary: boolean;
  showIndividualReviews: boolean;
  minRatingToShow: number;
  active: boolean;
};

export type TagWidget = {
  id: string;
  name: string;
  tags: string[];
  createdAt: string;
};

export type BadgeLayout = "clean" | "modern" | "minimal";
export type LinkTarget = "new_tab" | "same_tab";

export type ReviewBadgeSettings = {
  layout: BadgeLayout;
  linkTarget: LinkTarget;
};

export type SocialPlatform = "facebook" | "instagram" | "google_posts";

export type SocialAccountStatus = {
  platform: SocialPlatform;
  connected: boolean;
};

export type SocialSharingSettings = {
  accounts: SocialAccountStatus[];
  automationEnabled: boolean;
  defaultContent: string;
};

export type UrlMatchType = "exact" | "partial";
export type PopupPosition = "left" | "right";

export type ConversionPopupSettings = {
  enabled: boolean;
  targetUrls: string;
  urlMatchType: UrlMatchType;
  clickThroughUrl: string;
  showFirstParty: boolean;
  showThirdParty: boolean;
  showOnMobile: boolean;
  desktopPosition: PopupPosition;
};

export type AiReplyPrompts = {
  customSmartReplyEnabled: boolean;
  smartReplyPrompt: string;
  customSuggestedReplyEnabled: boolean;
  suggestedReplyPrompt: string;
  customAutoReplyEnabled: boolean;
  autoReplyPrompt: string;
};

export type AutoTag = {
  id: string;
  name: string;
  keywords: string[];
  appliedToAllReviews: boolean;
  reviewCount: number;
};

export type AutoReplyReviewType = "first_party" | "third_party" | "both";
export type AutoReplyGenerationMethod = "ai_writes" | "template_library";

export type AutoReplySettings = {
  enabled: boolean;
  reviewType: AutoReplyReviewType;
  ratingThresholds: { fiveStar: boolean; fourStar: boolean; facebookRecommend: boolean };
  generationMethod: AutoReplyGenerationMethod;
  replyToReviewsWithoutText: boolean;
  googleFacebookAuthorized: boolean;
};

export type NotificationChannel = "email" | "slack" | "sms";

export type NotificationRule = {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  channels: NotificationChannel[];
};

export type NotificationSettings = {
  essential: NotificationRule[];
  advanced: NotificationRule[];
};

export type BrandSettings = {
  logoUrl: string | null;
  accentColor: string;
  bannerUrl: string | null;
};

export type ReviewSiteId = "google" | "facebook" | "yelp" | "tripadvisor";

export type ReviewSiteLink = {
  id: string;
  site: ReviewSiteId;
  url: string;
  cidNumber: string;
  askForReviews: boolean;
  monitorReviews: boolean;
  order: number;
};

export type SendMethod = "email" | "sms" | "both";
export type RatingType = "nps" | "star" | "thumbs";
export type RatingOrder = "low_to_high" | "high_to_low";

export type FeedbackSettings = {
  replyToEmail: string;
  useCustomReplyEmail: boolean;
  repeatFeedbackThresholdEnabled: boolean;
  repeatFeedbackThresholdDays: number;
  defaultSendMethod: SendMethod;
  ratingType: RatingType;
  ratingOrder: RatingOrder;
  positiveFeedbackThreshold: number;
  smartAutoDirect: boolean;
  permissionToPostReview: boolean;
  askMobilePhone: boolean;
  askJobId: boolean;
  showBusinessAddressPhone: boolean;
  feedbackUrl: string;
};

export type VerificationStatus = "not_requested" | "pending" | "verified";

export type TollFreeDetails = {
  legalBusinessName: string;
  doingBusinessAs: string;
  businessType: string;
  registrationNumber: string;
  status: VerificationStatus;
};

export type BusinessDetailsInfo = {
  businessName: string;
  websiteUrl: string;
  streetAddress: string;
  businessType: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phoneNumber: string;
  timeZone: string;
  language: string;
};

export type BusinessOwnerDetails = {
  firstName: string;
  lastName: string;
  email: string;
};

export type ListingSyncStatus = {
  platform: "facebook" | "google" | "instagram";
  synced: boolean;
};

export type ListingsHubSummary = {
  totalListings: number;
  syncedCount: number;
  updatedCount: number;
  platforms: ListingSyncStatus[];
};

export type ReviewDefenseSummary = {
  totalLifetimeReviews: { active: number; suspicious: number; inDispute: number; removed: number };
  suspectedAiPercent: number;
  legitimateImpressions: number;
  suspiciousImpressions: number;
};

export type BusinessTrend = "up" | "down" | "same";

export type AgencyBusinessRow = {
  id: string;
  name: string;
  location: string;
  shortName: string;
  managers: string[];
  rating: number | null;
  requestsSent: number;
  openRate: number;
  requestsReceived: number;
  reviewClicks: number;
  totalOnlineReviews: number;
  trend: BusinessTrend;
};

export type LocationDashboardSummary = {
  userName: string;
  progressPercent: number;
  requestsSentLast30Days: number;
  repliesAwaiting: number;
  smartInsightsEnabled: boolean;
};

export type ActivityType = "request_sent" | "feedback_received" | "review_posted" | "reminder_sent";

export type CustomerActivityEntry = {
  id: string;
  customerName: string;
  type: ActivityType;
  detail: string;
  rating: number | null;
  date: string;
};

export type DefaultConfiguration = {
  autoReplyEnabledByDefault: boolean;
  defaultRatingType: RatingType;
  defaultSendMethod: SendMethod;
  requireConsentCheckbox: boolean;
};

export type ImportBusinessSummary = {
  totalRows: number;
  imported: number;
  skipped: number;
};

export type AgencyUserStatus = "active" | "invited";

export type AgencyUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  businesses: string[];
  status: AgencyUserStatus;
};

export type MyProfile = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

export type AuthProvider = "google" | "facebook" | "instagram";

export type AuthorizationEntry = {
  provider: AuthProvider;
  connected: boolean;
  accountEmail: string | null;
};

export type ApiCredential = {
  id: string;
  name: string;
  keyPreview: string;
  createdAt: string;
  lastUsed: string | null;
};

export type PaymentInfo = {
  cardBrand: string | null;
  last4: string | null;
  expiryMonth: number | null;
  expiryYear: number | null;
  billingEmail: string;
};

export type AiSettings = {
  aiRepliesEnabled: boolean;
  tone: "friendly" | "professional" | "casual";
  maxReplyLength: number;
  useEmoji: boolean;
};

export type AddonId = "sms_credits" | "extra_locations" | "white_label";

export type Addon = {
  id: AddonId;
  name: string;
  description: string;
  price: string;
  active: boolean;
};
