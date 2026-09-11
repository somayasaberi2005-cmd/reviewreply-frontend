import { Review, DashboardStats, Business, ReportSummary, ReplyStatus, Customer, NewCustomerInput, ImportSummary, RequestFlowSettings, RequestFlowStep, RequestFlowStepId, SmsSettings, KioskSettings, KioskTemplateStep, TextBackSettings, EmailSignatureSurveySettings, UserRole, Integration, IntegrationId, SmartInsight, PerformanceSummary, ReviewsReportSummary, ReviewReportDetail, NpsReportSummary, NpsDataPoint, SuccessReportSummary, BusinessReportRow, QaEntry, QaStatus, CompetitorReportStatus, WidgetLayout, ReviewWidgetSettings, TagWidget, BadgeLayout, LinkTarget, ReviewBadgeSettings, SocialPlatform, SocialAccountStatus, SocialSharingSettings, UrlMatchType, PopupPosition, ConversionPopupSettings, AiReplyPrompts, AutoTag, AutoReplyReviewType, AutoReplyGenerationMethod, AutoReplySettings, NotificationChannel, NotificationRule, NotificationSettings, BrandSettings, ReviewSiteId, ReviewSiteLink, SendMethod, RatingType, RatingOrder, FeedbackSettings, VerificationStatus, TollFreeDetails, BusinessDetailsInfo, BusinessOwnerDetails, ListingSyncStatus, ListingsHubSummary, ReviewDefenseSummary, BusinessTrend, AgencyBusinessRow, LocationDashboardSummary, ActivityType, CustomerActivityEntry } from "./types";

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
      body: "Hi Ali, we're very sorry about the wait ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â that's not the experience we aim for. We'd love the chance to make it right.",
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

export type AuditLogEntry = {
  id: string;
  action: string;
  actor: string;
  target: string;
  timestamp: string;
};

const auditLog: AuditLogEntry[] = [
  { id: "a1", action: "Reply posted", actor: "AI (auto)", target: "Sadaf Ahmadi's review", timestamp: "2026-08-20T14:30:00Z" },
];

export function logAuditEvent(action: string, actor: string, target: string) {
  auditLog.unshift({
    id: `a${auditLog.length + 1}`,
    action,
    actor,
    target,
    timestamp: new Date().toISOString(),
  });
}

export async function getAuditLog(): Promise<AuditLogEntry[]> {
  await delay(200);
  return auditLog;
}

export type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

const mockTeam: TeamMember[] = [
  { id: "u1", name: "You", email: "you@roshan.af", role: "owner" },
  { id: "u2", name: "Farida Nasiri", email: "farida@roshan.af", role: "regional_manager" },
  { id: "u3", name: "Hamid Yousafi", email: "hamid@roshan.af", role: "location_manager" },
  { id: "u4", name: "Zainab Rezai", email: "zainab@roshan.af", role: "viewer" },
];

export async function getTeamMembers(): Promise<TeamMember[]> {
  await delay(300);
  return mockTeam;
}

export type Competitor = {
  id: string;
  name: string;
  rating: number;
  totalReviews: number;
};

const mockCompetitors: Record<string, Competitor[]> = {
  b1: [
    { id: "c1", name: "Etisalat Afghanistan", rating: 4.1, totalReviews: 890 },
    { id: "c2", name: "Afghan Wireless (AWCC)", rating: 3.8, totalReviews: 610 },
  ],
  b2: [
    { id: "c3", name: "Kabul Bank", rating: 4.0, totalReviews: 430 },
  ],
};

export async function getCompetitors(businessId?: string): Promise<Competitor[]> {
  await delay(300);
  if (!businessId) return [];
  return mockCompetitors[businessId] ?? [];
}
// add Customer, NewCustomerInput to the existing import from "./types"

const mockCustomers: Customer[] = [];

export async function getCustomers(businessId: string): Promise<Customer[]> {
  await delay(400);
  return mockCustomers.filter((c) => c.businessId === businessId);
}

export async function addCustomer(input: NewCustomerInput): Promise<Customer> {
  await delay(500);
  const newCustomer: Customer = {
    ...input,
    id: `c${mockCustomers.length + 1}`,
    createdAt: new Date().toISOString(),
  };
  mockCustomers.push(newCustomer);
  return newCustomer;
}

export function getStaffFormLink(businessId: string): string {
  return `https://app.yourdomain.com/staff/customer/${businessId}`;
}

export async function importCustomersFile(businessId: string, file: File): Promise<ImportSummary> {
  await delay(1200);
  return {
    totalRows: 25,
    imported: 23,
    skipped: 2,
  };
}

export function getImportStaffFormLink(businessId: string): string {
  return `https://app.yourdomain.com/staff/import-customer/${businessId}`;
}

export function downloadSampleCustomerCsv() {
  const header = "First Name,Last Name,Email,Mobile Phone,Custom ID\n";
  const sample = "Jane,Doe,jane@example.com,(201) 555-0123,JOB-1001\n";
  const blob = new Blob([header + sample], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "sample-customers.csv";
  a.click();
  URL.revokeObjectURL(url);
}

const mockRequestFlow: RequestFlowStep[] = [
  {
    id: "rating_request",
    section: "core",
    channel: "email_sms",
    title: "Rating Request",
    description: "This first message asks contacts for a rating.",
    editable: false,
    enabled: true,
  },
  {
    id: "first_rating_reminder",
    section: "core",
    channel: "email_sms",
    title: "First Rating Reminder",
    description: "If the recipient does not leave a rating, they will get this reminder.",
    editable: true,
    enabled: true,
    delayValue: 2,
    delayUnit: "days",
    delayContext: "after initial request",
  },
  {
    id: "second_rating_reminder",
    section: "core",
    channel: "email_sms",
    title: "Second Rating Reminder",
    description: "A final nudge if the recipient still has not responded.",
    editable: true,
    enabled: false,
    delayValue: 5,
    delayUnit: "days",
    delayContext: "after initial request",
  },
  {
    id: "survey_questions",
    section: "core",
    channel: "web",
    title: "Survey Questions",
    description: "Contacts who click your request will be directed here to share more details about their experience.",
    editable: false,
    enabled: true,
  },
  {
    id: "public_review_request",
    section: "positive",
    channel: "web",
    title: "Public Review Request",
    description: "If the contact provides positive feedback, ask them to share their experience publicly on sites like Google and Facebook.",
    editable: false,
    enabled: true,
  },
  {
    id: "first_review_reminder",
    section: "positive",
    channel: "email",
    title: "First Review Reminder",
    description: "If the recipient does not click to the public review site, they will get this reminder.",
    editable: true,
    enabled: true,
    delayValue: 4,
    delayUnit: "hours",
    delayContext: "after initial feedback",
  },
  {
    id: "second_review_reminder",
    section: "positive",
    channel: "email",
    title: "Second Review Reminder",
    description: "A final nudge to leave a public review.",
    editable: true,
    enabled: true,
    delayValue: 2,
    delayUnit: "days",
    delayContext: "after initial feedback",
  },
  {
    id: "apology_page",
    section: "negative",
    channel: "web",
    title: "Apology Page",
    description: "If the contact leaves a negative rating, apologize and ask for details. This page avoids linking to public review sites.",
    editable: false,
    enabled: true,
  },
  {
    id: "negative_feedback_page",
    section: "negative",
    channel: "web",
    title: "Negative Feedback Page",
    description: "Collect more private details about the negative experience.",
    editable: false,
    enabled: true,
  },
  {
    id: "submission_confirmation",
    section: "negative",
    channel: "web",
    title: "Submission Confirmation",
    description: "Page that confirms the private feedback was received.",
    editable: false,
    enabled: true,
  },
  {
    id: "apology_email",
    section: "negative",
    channel: "email",
    title: "Apology Email",
    description: "Sent to the customer after they submit private negative feedback.",
    editable: true,
    enabled: true,
  },
];

export async function getRequestFlow(businessId: string): Promise<RequestFlowSettings> {
  await delay(400);
  return { flowType: "survey_reviews", steps: mockRequestFlow };
}

export async function updateRequestFlowStep(
  businessId: string,
  stepId: RequestFlowStepId,
  changes: Partial<Pick<RequestFlowStep, "enabled" | "delayValue" | "delayUnit">>
): Promise<void> {
  await delay(300);
  const step = mockRequestFlow.find((s) => s.id === stepId);
  if (step) Object.assign(step, changes);
}


let mockSmsSettings: SmsSettings = {
  messageType: "sms",
  message: "Hi! We'd love your feedback, please click the link:",
  includeFeedbackUrl: true,
  feedbackUrl: "https://app.yourdomain.com/d-6MjSK",
};

export async function getSmsSettings(businessId: string): Promise<SmsSettings> {
  await delay(300);
  return mockSmsSettings;
}

export async function updateSmsSettings(businessId: string, settings: SmsSettings): Promise<void> {
  await delay(400);
  mockSmsSettings = settings;
}

export async function sendTestSms(businessId: string): Promise<void> {
  await delay(500);
}

let mockKioskSettings: KioskSettings = {
  kioskUrl: "https://app.yourdomain.com/k-b1",
  steps: [
    {
      id: "landing_page",
      icon: "web",
      title: "Kiosk Mode: Feedback Landing Page",
      status: "unchanged",
      description: "The Feedback Landing Page questions are pulled from Request Setup. Complete Request Setup before using Kiosk Mode.",
      content: "Please tell us about your experience.",
    },
    {
      id: "thank_you_page",
      icon: "web",
      title: "Kiosk Mode: Positive Feedback - Thank You Page",
      status: "Edited recently",
      description: "This is the thank-you page text that appears after someone leaves positive feedback.",
      content: "Thank you so much for your feedback! We really appreciate it.",
    },
    {
      id: "review_request_email",
      icon: "email",
      title: "Kiosk Mode: Positive Email - Review Request",
      status: "Edited recently",
      description: "This is the email sent to customers after they leave positive feedback. A delay gives them time before being asked for an online review.",
      content: "Hi! Thanks again for the kind words. Would you mind sharing that publicly too?",
      hasTiming: true,
      timingEnabled: false,
      timingValue: 4,
      timingUnit: "hours",
    },
    {
      id: "negative_apology",
      icon: "web",
      title: "Kiosk Mode: Negative Feedback - Apology",
      status: "Edited recently",
      description: "Follow-up for a poor experience rating and request for more info.",
      content: "We are sorry to hear your experience did not meet expectations. Please tell us more.",
    },
  ],
};

export async function getKioskSettings(businessId: string): Promise<KioskSettings> {
  await delay(400);
  return mockKioskSettings;
}

export async function updateKioskTemplate(
  businessId: string,
  stepId: string,
  changes: Partial<KioskTemplateStep>
): Promise<void> {
  await delay(300);
  const step = mockKioskSettings.steps.find((s) => s.id === stepId);
  if (step) Object.assign(step, changes);
}

let mockTextBackSettings: TextBackSettings = {
  active: false,
  country: "US",
  phoneNumber: "",
  keywords: ["feedback"],
  autoReplyMessage: "Hi! We'd love your feedback, please click the link:",
  feedbackUrl: "https://app.yourdomain.com/f-b1",
};

export async function getTextBackSettings(businessId: string): Promise<TextBackSettings> {
  await delay(300);
  return mockTextBackSettings;
}

export async function updateTextBackSettings(businessId: string, settings: TextBackSettings): Promise<void> {
  await delay(400);
  mockTextBackSettings = settings;
}

let mockSignatureSurvey: EmailSignatureSurveySettings = {
  widgetSize: "large",
  promptText: "How did we do?",
  redirectUrl: "",
  trackClicks: true,
};

export async function getEmailSignatureSurvey(businessId: string): Promise<EmailSignatureSurveySettings> {
  await delay(300);
  return mockSignatureSurvey;
}

export async function updateEmailSignatureSurvey(
  businessId: string,
  settings: EmailSignatureSurveySettings
): Promise<void> {
  await delay(400);
  mockSignatureSurvey = settings;
}

export function getSignatureWidgetSnippet(businessId: string): string {
  return `<a href="https://app.yourdomain.com/survey/${businessId}">How did we do?</a>`;
}

let mockIntegrations: Integration[] = [
  {
    id: "universal_email",
    name: "Universal Email Integration",
    description: "Use a simple BCC email to schedule a review request after you send a transactional email.",
    connected: false,
  },
  {
    id: "google_sheets",
    name: "Google Sheets",
    description: "Add customers to a Google Sheet to add them to your request sequence.",
    connected: false,
  },
];

export async function getIntegrations(businessId: string): Promise<Integration[]> {
  await delay(300);
  return mockIntegrations;
}

export async function setIntegrationConnected(
  businessId: string,
  id: IntegrationId,
  connected: boolean
): Promise<void> {
  await delay(400);
  const integration = mockIntegrations.find((i) => i.id === id);
  if (integration) integration.connected = connected;
}

export async function generateSmartInsights(businessId: string): Promise<SmartInsight[]> {
  await delay(1500);
  return [
    { id: "i1", text: "Customers frequently mention slow response times during peak hours. Consider adding staff or a queue system between 12-2pm." },
    { id: "i2", text: "Several reviews praise your staff by name. Highlighting this in marketing could reinforce your service reputation." },
    { id: "i3", text: "A recurring theme is difficulty finding parking. Adding signage or partnering with a nearby lot could reduce friction." },
  ];
}

export async function getPerformanceReport(businessId: string): Promise<PerformanceSummary> {
  await delay(500);
  const months = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"];
  const trend = months.map((month, i) => ({
    month,
    requestsSent: 40 + i * 6 + Math.round(Math.sin(i) * 5),
    feedbackReceived: 12 + i * 3 + Math.round(Math.cos(i) * 3),
  }));
  const requestsSent = trend.reduce((sum, t) => sum + t.requestsSent, 0);
  const feedbackReceived = trend.reduce((sum, t) => sum + t.feedbackReceived, 0);
  const opens = Math.round(requestsSent * 0.62);
  return {
    requestsSent,
    opens,
    openRate: Math.round((opens / requestsSent) * 1000) / 10,
    feedbackReceived,
    feedbackRate: Math.round((feedbackReceived / requestsSent) * 1000) / 10,
    reviewClicks: Math.round(feedbackReceived * 0.55),
    newReviews: Math.round(feedbackReceived * 0.4),
    trend,
  };
}

export async function getReviewsReport(businessId: string): Promise<ReviewsReportSummary> {
  await delay(500);
  const details: ReviewReportDetail[] = [
    { id: "rr1", site: "Google", rating: 5, reviewContent: "Fantastic service, will come back again!", date: "2026-08-20", name: "Sadaf Ahmadi" },
    { id: "rr2", site: "Google", rating: 2, reviewContent: "Waited 40 minutes for my order.", date: "2026-08-25", name: "Ali Rahimi" },
    { id: "rr3", site: "Facebook", rating: 5, reviewContent: "Best experience in the city, highly recommend.", date: "2026-08-28", name: "Nadia Kabiri" },
    { id: "rr4", site: "Google", rating: 4, reviewContent: "Good overall, staff were friendly.", date: "2026-09-01", name: "Omar Sultani" },
    { id: "rr5", site: "Facebook", rating: 3, reviewContent: "Average, nothing special.", date: "2026-09-03", name: "Latifa Noori" },
  ];
  return {
    overallRating: 4.6,
    totalReviews: details.length,
    newLast30Days: 3,
    newSinceJoining: details.length,
    ratingBreakdown: [
      { stars: 5, count: 2 },
      { stars: 4, count: 1 },
      { stars: 3, count: 1 },
      { stars: 2, count: 1 },
      { stars: 1, count: 0 },
    ],
    sources: [
      { name: "Google", count: 3 },
      { name: "Facebook", count: 2 },
    ],
    monthly: [
      { month: "Apr", count: 2 },
      { month: "May", count: 4 },
      { month: "Jun", count: 3 },
      { month: "Jul", count: 5 },
      { month: "Aug", count: 6 },
      { month: "Sep", count: 5 },
    ],
    details,
  };
}

export async function getNpsReport(businessId: string): Promise<NpsReportSummary> {
  await delay(500);
  const months = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"];
  const trend: NpsDataPoint[] = months.map((month, i) => ({
    month,
    score: Math.round(10 + i * 3 + Math.sin(i) * 8),
  }));
  const promoterCount = 9;
  const passiveCount = 7;
  const detractorCount = 3;
  const totalResponses = promoterCount + passiveCount + detractorCount;
  const promoterPct = Math.round((promoterCount / totalResponses) * 100);
  const detractorPct = Math.round((detractorCount / totalResponses) * 100);
  return {
    score: promoterPct - detractorPct,
    promoterPct,
    passivePct: Math.round((passiveCount / totalResponses) * 100),
    detractorPct,
    promoterCount,
    passiveCount,
    detractorCount,
    totalResponses,
    trend,
  };
}

export async function getSuccessReport(businessId: string): Promise<SuccessReportSummary> {
  await delay(500);
  const details: ReviewReportDetail[] = [
    { id: "sr1", site: "Google", rating: 5, reviewContent: "Fantastic service, will come back again!", date: "2026-08-20", name: "Sadaf Ahmadi" },
    { id: "sr2", site: "Facebook", rating: 5, reviewContent: "Best experience in the city, highly recommend.", date: "2026-08-28", name: "Nadia Kabiri" },
    { id: "sr3", site: "Google", rating: 4, reviewContent: "Good overall, staff were friendly.", date: "2026-09-01", name: "Omar Sultani" },
  ];
  return {
    npsScore: 42,
    npsPromoterPct: 56,
    npsDetractorPct: 14,
    npsTotalResponses: 19,
    thirdPartyRating: 4.6,
    thirdPartyTotal: 5,
    thirdPartySinceJoining: 5,
    firstPartyRating: 4.8,
    firstPartyTotal: 12,
    firstPartyLast30Days: 4,
    details,
  };
}

export async function getBusinessReport(): Promise<BusinessReportRow[]> {
  await delay(500);
  return [
    {
      businessId: "b1",
      businessName: "Roshan",
      locationId: "#174190",
      rating: 4.6,
      requestsSent: 128,
      opens: 79,
      openRate: 61.7,
      feedbackReceived: 42,
      feedbackRate: 32.8,
      responseRate: 94,
      reviewClicks: 23,
      newReviews: 5,
      totalReviews: 18,
    },
    {
      businessId: "b2",
      businessName: "Roshan - Downtown",
      locationId: "#174191",
      rating: 4.3,
      requestsSent: 96,
      opens: 55,
      openRate: 57.3,
      feedbackReceived: 31,
      feedbackRate: 32.3,
      responseRate: 88,
      reviewClicks: 18,
      newReviews: 3,
      totalReviews: 12,
    },
    {
      businessId: "b3",
      businessName: "Roshan - Westside",
      locationId: "#174192",
      rating: 4.8,
      requestsSent: 74,
      opens: 51,
      openRate: 68.9,
      feedbackReceived: 29,
      feedbackRate: 39.2,
      responseRate: 97,
      reviewClicks: 20,
      newReviews: 6,
      totalReviews: 15,
    },
  ];
}

const mockQaEntries: QaEntry[] = [
  {
    id: "qa1",
    location: "Roshan",
    question: "Do you offer weekend appointments?",
    answer: "Yes, we're open Saturdays 9am-3pm.",
    date: "2026-08-14",
    status: "closed",
  },
  {
    id: "qa2",
    location: "Roshan",
    question: "Is parking available on-site?",
    answer: "",
    date: "2026-08-30",
    status: "open",
  },
  {
    id: "qa3",
    location: "Roshan - Downtown",
    question: "Can I reschedule online?",
    answer: "Not yet, please call the front desk.",
    date: "2026-09-02",
    status: "closed",
  },
];

export async function getQaEntries(businessId: string): Promise<QaEntry[]> {
  await delay(400);
  return mockQaEntries;
}

let mockCompetitorReportStatus: CompetitorReportStatus = { enabled: false };

export async function getCompetitorReportStatus(businessId: string): Promise<CompetitorReportStatus> {
  await delay(300);
  return mockCompetitorReportStatus;
}

export async function enableCompetitorReport(businessId: string): Promise<void> {
  await delay(600);
  mockCompetitorReportStatus = { enabled: true };
}

let mockReviewWidget: ReviewWidgetSettings = {
  layout: "vertical",
  showRatingSummary: true,
  showIndividualReviews: true,
  minRatingToShow: 4,
  active: false,
};

export async function getReviewWidgetSettings(businessId: string): Promise<ReviewWidgetSettings> {
  await delay(300);
  return mockReviewWidget;
}

export async function updateReviewWidgetSettings(
  businessId: string,
  settings: ReviewWidgetSettings
): Promise<void> {
  await delay(400);
  mockReviewWidget = settings;
}

export function getReviewWidgetEmbedCode(businessId: string, layout: WidgetLayout): string {
  return `<script src="https://app.yourdomain.com/widget/${businessId}.js" data-layout="${layout}"></script>`;
}

let mockTagWidgets: TagWidget[] = [];

export async function getTagWidgets(businessId: string): Promise<TagWidget[]> {
  await delay(300);
  return mockTagWidgets;
}

export async function createTagWidget(businessId: string, name: string, tags: string[]): Promise<TagWidget> {
  await delay(400);
  const widget: TagWidget = {
    id: `tw${mockTagWidgets.length + 1}`,
    name,
    tags,
    createdAt: new Date().toISOString(),
  };
  mockTagWidgets.push(widget);
  return widget;
}

export async function deleteTagWidget(businessId: string, id: string): Promise<void> {
  await delay(300);
  mockTagWidgets = mockTagWidgets.filter((w) => w.id !== id);
}

let mockReviewBadge: ReviewBadgeSettings = { layout: "modern", linkTarget: "new_tab" };

export async function getReviewBadgeSettings(businessId: string): Promise<ReviewBadgeSettings> {
  await delay(300);
  return mockReviewBadge;
}

export async function updateReviewBadgeSettings(
  businessId: string,
  settings: ReviewBadgeSettings
): Promise<void> {
  await delay(400);
  mockReviewBadge = settings;
}

export function getReviewBadgeEmbedCode(businessId: string): string {
  return `<script src="https://app.yourdomain.com/badge/${businessId}.js"></script>`;
}

let mockSocialSharing: SocialSharingSettings = {
  accounts: [
    { platform: "facebook", connected: false },
    { platform: "instagram", connected: false },
    { platform: "google_posts", connected: false },
  ],
  automationEnabled: false,
  defaultContent: "Another great review from one of our customers...",
};

export async function getSocialSharingSettings(businessId: string): Promise<SocialSharingSettings> {
  await delay(300);
  return mockSocialSharing;
}

export async function updateSocialSharingSettings(
  businessId: string,
  settings: SocialSharingSettings
): Promise<void> {
  await delay(400);
  mockSocialSharing = settings;
}

let mockConversionPopup: ConversionPopupSettings = {
  enabled: true,
  targetUrls: "",
  urlMatchType: "exact",
  clickThroughUrl: "",
  showFirstParty: true,
  showThirdParty: true,
  showOnMobile: true,
  desktopPosition: "left",
};

export async function getConversionPopupSettings(businessId: string): Promise<ConversionPopupSettings> {
  await delay(300);
  return mockConversionPopup;
}

export async function updateConversionPopupSettings(
  businessId: string,
  settings: ConversionPopupSettings
): Promise<void> {
  await delay(400);
  mockConversionPopup = settings;
}

export function getConversionPopupEmbedCode(businessId: string): string {
  return `<script src="https://app.yourdomain.com/popup/${businessId}.js"></script>`;
}

let mockAiReplyPrompts: AiReplyPrompts = {
  customSmartReplyEnabled: false,
  smartReplyPrompt: "Write a warm, professional reply that acknowledges the reviewer by name and references specific details from their review.",
  customSuggestedReplyEnabled: false,
  suggestedReplyPrompt: "Draft a suggested reply for approval, keeping the tone friendly and on-brand.",
  customAutoReplyEnabled: false,
  autoReplyPrompt: "Automatically draft and send a reply for positive reviews without requiring approval.",
};

export async function getAiReplyPrompts(businessId: string): Promise<AiReplyPrompts> {
  await delay(300);
  return mockAiReplyPrompts;
}

export async function updateAiReplyPrompts(businessId: string, prompts: AiReplyPrompts): Promise<void> {
  await delay(400);
  mockAiReplyPrompts = prompts;
}

let mockAutoTags: AutoTag[] = [];

export async function getAutoTags(businessId: string): Promise<AutoTag[]> {
  await delay(300);
  return mockAutoTags;
}

export async function createAutoTag(
  businessId: string,
  name: string,
  keywords: string[],
  appliedToAllReviews: boolean
): Promise<AutoTag> {
  await delay(400);
  const tag: AutoTag = {
    id: `at${mockAutoTags.length + 1}`,
    name,
    keywords,
    appliedToAllReviews,
    reviewCount: 0,
  };
  mockAutoTags.push(tag);
  return tag;
}

export async function deleteAutoTag(businessId: string, id: string): Promise<void> {
  await delay(300);
  mockAutoTags = mockAutoTags.filter((t) => t.id !== id);
}

let mockAutoReplySettings: AutoReplySettings = {
  enabled: false,
  reviewType: "both",
  ratingThresholds: { fiveStar: true, fourStar: true, facebookRecommend: true },
  generationMethod: "ai_writes",
  replyToReviewsWithoutText: true,
  googleFacebookAuthorized: false,
};

export async function getAutoReplySettings(businessId: string): Promise<AutoReplySettings> {
  await delay(300);
  return mockAutoReplySettings;
}

export async function updateAutoReplySettings(businessId: string, settings: AutoReplySettings): Promise<void> {
  await delay(400);
  mockAutoReplySettings = settings;
}

let mockNotificationSettings: NotificationSettings = {
  essential: [
    {
      id: "n1",
      title: "1st-Party Reviews",
      description: "Manage your notifications for 1st-party reviews (customer feedback, testimonials).",
      enabled: true,
      channels: ["email"],
    },
    {
      id: "n2",
      title: "3rd-Party Reviews",
      description: "Manage your notifications for new 3rd-party reviews on sites like Google, Facebook, etc.",
      enabled: true,
      channels: ["email"],
    },
    {
      id: "n3",
      title: "Suggested Reply",
      description: "Enable AI-assisted response suggestions for 3rd-party reviews.",
      enabled: false,
      channels: [],
    },
  ],
  advanced: [
    {
      id: "n4",
      title: "Report Delivery",
      description: "Manage who receives automatic reports via email. Select your report types and frequency.",
      enabled: false,
      channels: ["email"],
    },
    {
      id: "n5",
      title: "No Requests Sent Reminder",
      description: "Get notified when this location has not sent any review requests on a weekly or monthly basis.",
      enabled: true,
      channels: ["email"],
    },
    {
      id: "n6",
      title: "Broken Authorization",
      description: "Get notified when this location has lost connection to Google, Instagram, or Facebook.",
      enabled: true,
      channels: ["email", "slack"],
    },
  ],
};

export async function getNotificationSettings(businessId: string): Promise<NotificationSettings> {
  await delay(400);
  return mockNotificationSettings;
}

export async function updateNotificationRule(
  businessId: string,
  ruleId: string,
  changes: Partial<Pick<NotificationRule, "enabled" | "channels">>
): Promise<void> {
  await delay(300);
  const rule =
    mockNotificationSettings.essential.find((r) => r.id === ruleId) ||
    mockNotificationSettings.advanced.find((r) => r.id === ruleId);
  if (rule) Object.assign(rule, changes);
}

let mockBrandSettings: BrandSettings = {
  logoUrl: null,
  accentColor: "#5E8C2E",
  bannerUrl: null,
};

export async function getBrandSettings(businessId: string): Promise<BrandSettings> {
  await delay(300);
  return mockBrandSettings;
}

export async function updateBrandSettings(businessId: string, settings: BrandSettings): Promise<void> {
  await delay(400);
  mockBrandSettings = settings;
}

let mockReviewSiteLinks: ReviewSiteLink[] = [
  {
    id: "rl1",
    site: "google",
    url: "https://search.google.com/local/writereview?placeid=",
    cidNumber: "",
    askForReviews: true,
    monitorReviews: true,
    order: 1,
  },
];

export async function getReviewSiteLinks(businessId: string): Promise<ReviewSiteLink[]> {
  await delay(300);
  return mockReviewSiteLinks;
}

export async function addReviewSiteLink(businessId: string, site: ReviewSiteId): Promise<ReviewSiteLink> {
  await delay(400);
  const link: ReviewSiteLink = {
    id: `rl${mockReviewSiteLinks.length + 1}`,
    site,
    url: "",
    cidNumber: "",
    askForReviews: true,
    monitorReviews: true,
    order: mockReviewSiteLinks.length + 1,
  };
  mockReviewSiteLinks.push(link);
  return link;
}

export async function updateReviewSiteLink(
  businessId: string,
  id: string,
  changes: Partial<ReviewSiteLink>
): Promise<void> {
  await delay(300);
  const link = mockReviewSiteLinks.find((l) => l.id === id);
  if (link) Object.assign(link, changes);
}

export async function deleteReviewSiteLink(businessId: string, id: string): Promise<void> {
  await delay(300);
  mockReviewSiteLinks = mockReviewSiteLinks.filter((l) => l.id !== id);
}

export async function moveReviewSiteLink(businessId: string, id: string, direction: "up" | "down"): Promise<void> {
  await delay(200);
  const index = mockReviewSiteLinks.findIndex((l) => l.id === id);
  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || swapIndex < 0 || swapIndex >= mockReviewSiteLinks.length) return;
  [mockReviewSiteLinks[index], mockReviewSiteLinks[swapIndex]] = [
    mockReviewSiteLinks[swapIndex],
    mockReviewSiteLinks[index],
  ];
}

let mockFeedbackSettings: FeedbackSettings = {
  replyToEmail: "hello@yourbusiness.com",
  useCustomReplyEmail: true,
  repeatFeedbackThresholdEnabled: true,
  repeatFeedbackThresholdDays: 30,
  defaultSendMethod: "both",
  ratingType: "nps",
  ratingOrder: "low_to_high",
  positiveFeedbackThreshold: 7,
  smartAutoDirect: true,
  permissionToPostReview: true,
  askMobilePhone: false,
  askJobId: false,
  showBusinessAddressPhone: true,
  feedbackUrl: "https://app.yourdomain.com/f/b1",
};

export async function getFeedbackSettings(businessId: string): Promise<FeedbackSettings> {
  await delay(400);
  return mockFeedbackSettings;
}

export async function updateFeedbackSettings(businessId: string, settings: FeedbackSettings): Promise<void> {
  await delay(400);
  mockFeedbackSettings = settings;
}

let mockTollFree: TollFreeDetails = {
  legalBusinessName: "",
  doingBusinessAs: "",
  businessType: "",
  registrationNumber: "",
  status: "not_requested",
};

let mockBusinessDetails: BusinessDetailsInfo = {
  businessName: "Roshan",
  websiteUrl: "",
  streetAddress: "",
  businessType: "",
  city: "",
  state: "",
  zip: "",
  country: "United States",
  phoneNumber: "",
  timeZone: "Pacific/Honolulu",
  language: "English",
};

let mockBusinessOwner: BusinessOwnerDetails = {
  firstName: "",
  lastName: "",
  email: "",
};

export async function getTollFreeDetails(businessId: string): Promise<TollFreeDetails> {
  await delay(300);
  return mockTollFree;
}

export async function updateTollFreeDetails(businessId: string, details: TollFreeDetails): Promise<void> {
  await delay(400);
  mockTollFree = details;
}

export async function submitTollFreeVerification(businessId: string): Promise<void> {
  await delay(600);
  mockTollFree.status = "pending";
}

export async function getBusinessDetailsInfo(businessId: string): Promise<BusinessDetailsInfo> {
  await delay(300);
  return mockBusinessDetails;
}

export async function updateBusinessDetailsInfo(businessId: string, info: BusinessDetailsInfo): Promise<void> {
  await delay(400);
  mockBusinessDetails = info;
}

export async function getBusinessOwnerDetails(businessId: string): Promise<BusinessOwnerDetails> {
  await delay(300);
  return mockBusinessOwner;
}

export async function updateBusinessOwnerDetails(businessId: string, owner: BusinessOwnerDetails): Promise<void> {
  await delay(400);
  mockBusinessOwner = owner;
}

export async function getListingsHubSummary(businessId: string): Promise<ListingsHubSummary> {
  await delay(400);
  return {
    totalListings: 56,
    syncedCount: 22,
    updatedCount: 5,
    platforms: [
      { platform: "facebook", synced: true },
      { platform: "google", synced: true },
      { platform: "instagram", synced: true },
    ],
  };
}

export async function getReviewDefenseSummary(businessId: string): Promise<ReviewDefenseSummary> {
  await delay(500);
  return {
    totalLifetimeReviews: { active: 240, suspicious: 12, inDispute: 3, removed: 5 },
    suspectedAiPercent: 8,
    legitimateImpressions: 92,
    suspiciousImpressions: 8,
  };
}

export async function auditBusinessForSuspiciousReviews(businessId: string): Promise<void> {
  await delay(1200);
}

export async function getAgencyBusinesses(): Promise<AgencyBusinessRow[]> {
  await delay(400);
  return [
    {
      id: "b1",
      name: "Roshan",
      location: "Kabul, Afghanistan, Kabul, AL",
      shortName: "roshan",
      managers: [],
      rating: null,
      requestsSent: 0,
      openRate: 0,
      requestsReceived: 0,
      reviewClicks: 0,
      totalOnlineReviews: 0,
      trend: "same",
    },
    {
      id: "b2",
      name: "Roshan - Downtown",
      location: "Kabul, Afghanistan, Kabul, AL",
      shortName: "roshan-dt",
      managers: ["Farida Nasiri"],
      rating: 4.3,
      requestsSent: 96,
      openRate: 57.3,
      requestsReceived: 31,
      reviewClicks: 18,
      totalOnlineReviews: 12,
      trend: "up",
    },
    {
      id: "b3",
      name: "Roshan - Westside",
      location: "Kabul, Afghanistan, Kabul, AL",
      shortName: "roshan-ws",
      managers: ["Hamid Yousafi"],
      rating: 4.8,
      requestsSent: 74,
      openRate: 68.9,
      requestsReceived: 29,
      reviewClicks: 20,
      totalOnlineReviews: 15,
      trend: "down",
    },
  ];
}

export async function getLocationDashboardSummary(businessId: string): Promise<LocationDashboardSummary> {
  await delay(400);
  return {
    userName: "Somaya",
    progressPercent: 65,
    requestsSentLast30Days: 42,
    repliesAwaiting: 3,
    smartInsightsEnabled: false,
  };
}

export async function getCustomerActivity(businessId: string): Promise<CustomerActivityEntry[]> {
  await delay(400);
  return [
    {
      id: "ca1",
      customerName: "Sadaf Ahmadi",
      type: "review_posted",
      detail: "Left a 5-star review on Google",
      rating: 5,
      date: "2026-08-20T14:30:00Z",
    },
    {
      id: "ca2",
      customerName: "Ali Rahimi",
      type: "feedback_received",
      detail: "Submitted private feedback (2 stars)",
      rating: 2,
      date: "2026-08-25T09:12:00Z",
    },
    {
      id: "ca3",
      customerName: "Nadia Kabiri",
      type: "request_sent",
      detail: "Review request sent via Email",
      rating: null,
      date: "2026-08-27T11:00:00Z",
    },
    {
      id: "ca4",
      customerName: "Omar Sultani",
      type: "reminder_sent",
      detail: "First rating reminder sent via SMS",
      rating: null,
      date: "2026-08-29T16:45:00Z",
    },
    {
      id: "ca5",
      customerName: "Latifa Noori",
      type: "review_posted",
      detail: "Left a 3-star review on Facebook",
      rating: 3,
      date: "2026-09-03T08:20:00Z",
    },
  ];
}
