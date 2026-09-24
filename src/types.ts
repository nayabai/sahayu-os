export type UserRole = 'customer' | 'worker' | 'admin';

export type Language = 'en' | 'hi' | 'mr';

export type UrgencyType = 'emergency' | 'today' | 'tomorrow' | 'this_week' | 'flexible';
export type JobUrgency = UrgencyType;

export type MaterialRequirement = 'customer_provides' | 'worker_provides' | 'need_quotation';

export type JobStatus =
  | 'POSTED'
  | 'RESPONSES_RECEIVED'
  | 'WORKER_SELECTED'
  | 'CONFIRMED'
  | 'WORKER_ON_THE_WAY'
  | 'ARRIVED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'PAYMENT'
  | 'REVIEWED'
  | 'CANCELLED';

export interface User {
  id: string;
  name: string;
  mobile: string;
  phone?: string;
  email?: string;
  role: UserRole;
  avatar?: string;
  locality: string;
  pincode: string;
  city: string;
  preferredLanguage: Language;
  rating?: number;
  joinedAt: string;
}

export interface VerificationBadges {
  phoneVerified: boolean;
  identityVerified: boolean;
  skillVerified: boolean;
  backgroundVerified: boolean;
  topRated: boolean;
  experienced: boolean;
}

export interface WorkerProfile {
  id: string;
  userId: string;
  name: string;
  mobile: string;
  profilePhoto: string;
  primaryCategory: string;
  otherSkills: string[];
  experienceYears: number;
  rating: number;
  totalReviews: number;
  completedJobs: number;
  responseRatePercent: number;
  completionRatePercent: number;
  baseLocality: string;
  serviceAreas: string[];
  startingPrice: number;
  languages: string[];
  workingHours: string;
  isAvailable: boolean;
  emergencyAvailable: boolean;
  about: string;
  verification: VerificationBadges;
  portfolioImages: string[];
  reviews: Review[];
  totalEarnings?: number;
}

export interface Subcategory {
  id: string;
  name: string;
  avgPriceEstimate: string;
}

export interface Category {
  id: string;
  name: string;
  hindiName: string;
  marathiName: string;
  icon: string;
  subcategories: Subcategory[];
  color: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  workerId: string;
  workerName: string;
  workerRating: number;
  workerExperience: number;
  workerPhoto: string;
  estimatedPrice: number;
  availableTime: string;
  message: string;
  estimatedDuration: string;
  materialCharge?: number;
  travelCharge?: number;
  createdAt: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface Quotation {
  id: string;
  jobId: string;
  workerId: string;
  workerName: string;
  labourCharge: number;
  materialCharge: number;
  travelCharge: number;
  otherCharge: number;
  total: number;
  estimatedDuration: string;
  validity: string;
  notes?: string;
  description?: string;
  laborCost?: number;
  materialCost?: number;
  travelCost?: number;
  totalAmount?: number;
  createdAt: string;
  status: 'sent' | 'accepted' | 'rejected' | 'revised';
}

export interface Job {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone?: string;
  customerRating?: number;
  title: string;
  category: string;
  subcategory: string;
  description: string;
  photos: string[];
  locationArea: string;
  address?: string; // Revealed only to selected worker
  pincode?: string;
  preferredDate: string;
  preferredTime: string;
  urgency: UrgencyType;
  budgetMin?: number;
  budgetMax?: number;
  materialRequired: MaterialRequirement;
  additionalNotes?: string;
  status: JobStatus;
  postedAt: string;
  assignedWorkerId?: string;
  assignedWorkerName?: string;
  finalPrice?: number;
  paymentMethod?: 'UPI' | 'Cash' | 'Card' | 'Pending';
  paymentStatus?: 'pending' | 'paid';
  applications: JobApplication[];
  quotations: Quotation[];
  isEmergency?: boolean;
}

export interface ChatMessage {
  id: string;
  jobId?: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  recipientId: string;
  text: string;
  imageUrl?: string;
  quoteId?: string;
  isSystem?: boolean;
  timestamp: string;
  read: boolean;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'job' | 'quote' | 'status' | 'message' | 'system' | 'payment';
  linkId?: string;
  timestamp: string;
  read: boolean;
}

export interface Review {
  id: string;
  jobId: string;
  reviewerId: string;
  reviewerName: string;
  customerName?: string;
  targetId: string; // Worker or Customer ID
  targetRole: 'worker' | 'customer';
  rating: number; // 1-5
  qualityRating?: number;
  punctualityRating?: number;
  behaviourRating?: number;
  professionalismRating?: number;
  valueRating?: number;
  comment: string;
  date: string;
}

export interface Dispute {
  id: string;
  jobId: string;
  jobTitle: string;
  reportedBy: string; // user ID
  reporterRole: 'customer' | 'worker';
  reportedUserName: string;
  reason: string;
  description: string;
  status: 'investigating' | 'resolved' | 'dismissed';
  adminNotes?: string;
  createdAt: string;
}

export interface AdminStats {
  totalUsers: number;
  totalWorkers: number;
  verifiedWorkers: number;
  activeJobs: number;
  completedJobs: number;
  cancelledJobs: number;
  totalRevenue: number;
  platformCommission: number;
  avgRating: number;
  newRegistrationsToday: number;
  openDisputes: number;
  topDemandedCategory: string;
}

export interface CommissionConfig {
  defaultPercentage: number;
  categoryOverrides: Record<string, number>;
  fixedFeeAmount: number;
  useFixedFee: boolean;
}
