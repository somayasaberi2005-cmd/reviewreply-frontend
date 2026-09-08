import { Review, DashboardStats, Business, ReportSummary, ReplyStatus, Customer, NewCustomerInput, ImportSummary, RequestFlowSettings, RequestFlowStep, RequestFlowStepId, SmsSettings, KioskSettings, KioskTemplateStep, TextBackSettings, EmailSignatureSurveySettings, UserRole, Integration, IntegrationId } from "./types";

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
