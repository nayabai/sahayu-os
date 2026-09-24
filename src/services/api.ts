import {
  WorkerProfile,
  Job,
  Category,
  NotificationItem,
  ChatMessage,
  Review,
  Dispute,
  AdminStats,
  CommissionConfig,
  JobStatus
} from '../types';
import { PUNE_LOCALITIES, CATEGORIES, INITIAL_WORKERS, INITIAL_JOBS, calculatePuneDistance } from '../data/puneData';

const BASE_URL = '/api';

export async function fetchLocations() {
  try {
    const res = await fetch(`${BASE_URL}/locations`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Using local fallback for locations', e);
  }
  return PUNE_LOCALITIES;
}

export async function fetchCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${BASE_URL}/categories`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Using local fallback for categories', e);
  }
  return CATEGORIES;
}

export async function fetchWorkers(params?: {
  category?: string;
  locality?: string;
  emergency?: boolean;
  verified?: boolean;
  minRating?: number;
  language?: string;
  search?: string;
}): Promise<(WorkerProfile & { calculatedDistance: number })[]> {
  try {
    const query = new URLSearchParams();
    if (params?.category) query.set('category', params.category);
    if (params?.locality) query.set('locality', params.locality);
    if (params?.emergency) query.set('emergency', 'true');
    if (params?.verified) query.set('verified', 'true');
    if (params?.minRating) query.set('minRating', params.minRating.toString());
    if (params?.language) query.set('language', params.language);
    if (params?.search) query.set('search', params.search);

    const res = await fetch(`${BASE_URL}/workers?${query.toString()}`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Workers fetch error, using fallback', e);
  }

  // Fallback
  const loc = params?.locality || 'Kharadi';
  return INITIAL_WORKERS.map(w => ({
    ...w,
    calculatedDistance: calculatePuneDistance(loc, w.baseLocality)
  }));
}

export async function fetchWorkerById(id: string, locality = 'Kharadi'): Promise<WorkerProfile & { calculatedDistance: number }> {
  try {
    const res = await fetch(`${BASE_URL}/workers/${id}?locality=${encodeURIComponent(locality)}`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Worker by id error', e);
  }
  const w = INITIAL_WORKERS.find(item => item.id === id) || INITIAL_WORKERS[0];
  return {
    ...w,
    calculatedDistance: calculatePuneDistance(locality, w.baseLocality)
  };
}

export async function registerWorker(data: Partial<WorkerProfile>): Promise<WorkerProfile> {
  const res = await fetch(`${BASE_URL}/workers/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to register worker');
  return await res.json();
}

export async function toggleWorkerAvailability(id: string, isAvailable: boolean, emergencyAvailable?: boolean) {
  const res = await fetch(`${BASE_URL}/workers/${id}/availability`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ isAvailable, emergencyAvailable })
  });
  if (!res.ok) throw new Error('Failed to update availability');
  return await res.json();
}

export async function fetchJobs(params?: {
  category?: string;
  locality?: string;
  urgency?: string;
  customerId?: string;
  workerId?: string;
  status?: string;
}): Promise<Job[]> {
  try {
    const query = new URLSearchParams();
    if (params?.category) query.set('category', params.category);
    if (params?.locality) query.set('locality', params.locality);
    if (params?.urgency) query.set('urgency', params.urgency);
    if (params?.customerId) query.set('customerId', params.customerId);
    if (params?.workerId) query.set('workerId', params.workerId);
    if (params?.status) query.set('status', params.status);

    const res = await fetch(`${BASE_URL}/jobs?${query.toString()}`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Jobs fetch error, using fallback', e);
  }
  return INITIAL_JOBS;
}

export async function fetchJobById(id: string): Promise<Job> {
  const res = await fetch(`${BASE_URL}/jobs/${id}`);
  if (!res.ok) throw new Error('Job not found');
  return await res.json();
}

export async function postJob(data: Partial<Job>): Promise<Job> {
  const res = await fetch(`${BASE_URL}/jobs/post`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to post job');
  return await res.json();
}

export async function applyForJob(jobId: string, data: {
  workerId: string;
  workerName?: string;
  estimatedPrice: number;
  availableTime: string;
  message: string;
  estimatedDuration: string;
  materialCharge?: number;
  travelCharge?: number;
}) {
  const res = await fetch(`${BASE_URL}/jobs/${jobId}/apply`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to submit application');
  return await res.json();
}

export async function sendQuotation(jobId: string, data: {
  workerId: string;
  labourCharge: number;
  materialCharge: number;
  travelCharge: number;
  otherCharge: number;
  estimatedDuration: string;
  validity: string;
  notes?: string;
}) {
  const res = await fetch(`${BASE_URL}/jobs/${jobId}/quote`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to send quote');
  return await res.json();
}

export async function selectWorkerForJob(jobId: string, workerId: string, finalPrice?: number) {
  const res = await fetch(`${BASE_URL}/jobs/${jobId}/select-worker`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ workerId, finalPrice })
  });
  if (!res.ok) throw new Error('Failed to select worker');
  return await res.json();
}

export async function updateJobStatus(jobId: string, status: JobStatus, paymentMethod?: 'UPI' | 'Cash' | 'Card') {
  const res = await fetch(`${BASE_URL}/jobs/${jobId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, paymentMethod })
  });
  if (!res.ok) throw new Error('Failed to update job status');
  return await res.json();
}

export async function fetchMessages(jobId?: string, userId?: string): Promise<ChatMessage[]> {
  try {
    const query = new URLSearchParams();
    if (jobId) query.set('jobId', jobId);
    if (userId) query.set('userId', userId);
    const res = await fetch(`${BASE_URL}/messages?${query.toString()}`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Messages fetch error', e);
  }
  return [];
}

export async function sendMessage(data: {
  jobId?: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  recipientId: string;
  text: string;
  imageUrl?: string;
}): Promise<ChatMessage> {
  const res = await fetch(`${BASE_URL}/messages/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to send message');
  return await res.json();
}

export async function fetchNotifications(userId?: string): Promise<NotificationItem[]> {
  try {
    const query = userId ? `?userId=${encodeURIComponent(userId)}` : '';
    const res = await fetch(`${BASE_URL}/notifications${query}`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Notifications fetch error', e);
  }
  return [];
}

export async function markNotificationRead(id: string) {
  await fetch(`${BASE_URL}/notifications/${id}/read`, { method: 'PATCH' });
}

export async function submitReview(data: {
  jobId: string;
  reviewerId: string;
  reviewerName: string;
  targetId: string;
  targetRole: 'worker' | 'customer';
  rating: number;
  qualityRating?: number;
  punctualityRating?: number;
  behaviourRating?: number;
  professionalismRating?: number;
  valueRating?: number;
  comment: string;
}): Promise<Review> {
  const res = await fetch(`${BASE_URL}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to submit review');
  return await res.json();
}

export async function fetchDisputes(): Promise<Dispute[]> {
  const res = await fetch(`${BASE_URL}/disputes`);
  if (!res.ok) return [];
  return await res.json();
}

export async function submitDispute(data: {
  jobId: string;
  jobTitle?: string;
  reportedBy: string;
  reporterRole: 'customer' | 'worker';
  reportedUserName: string;
  reason: string;
  description: string;
}): Promise<Dispute> {
  const res = await fetch(`${BASE_URL}/disputes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to submit dispute');
  return await res.json();
}

export async function resolveDispute(id: string, status: string, adminNotes: string) {
  const res = await fetch(`${BASE_URL}/disputes/${id}/resolve`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, adminNotes })
  });
  if (!res.ok) throw new Error('Failed to resolve dispute');
  return await res.json();
}

export async function fetchAdminStats(): Promise<AdminStats> {
  const res = await fetch(`${BASE_URL}/admin/stats`);
  if (!res.ok) throw new Error('Failed to fetch admin stats');
  return await res.json();
}

export async function updateAdminVerification(workerId: string, badges: {
  identityVerified?: boolean;
  skillVerified?: boolean;
  backgroundVerified?: boolean;
}) {
  const res = await fetch(`${BASE_URL}/admin/workers/${workerId}/verify`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(badges)
  });
  if (!res.ok) throw new Error('Failed to update verification');
  return await res.json();
}

export async function fetchCommissionConfig(): Promise<CommissionConfig> {
  const res = await fetch(`${BASE_URL}/admin/commission`);
  if (!res.ok) throw new Error('Failed to fetch commission config');
  return await res.json();
}

export async function updateCommissionConfig(data: Partial<CommissionConfig>) {
  const res = await fetch(`${BASE_URL}/admin/commission`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update commission');
  return await res.json();
}

// AI Services
export async function suggestJobWithAi(rawText: string, language = 'en') {
  const res = await fetch(`${BASE_URL}/ai/suggest-job`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rawText, language })
  });
  if (!res.ok) throw new Error('AI suggestion failed');
  return await res.json();
}

export async function getSmartMatchExplanation(workerData: {
  workerName: string;
  category: string;
  distanceKm: number;
  rating: number;
  completedJobs: number;
  experienceYears: number;
}): Promise<string> {
  try {
    const res = await fetch(`${BASE_URL}/ai/smart-match`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(workerData)
    });
    if (res.ok) {
      const data = await res.json();
      return data.explanation;
    }
  } catch (e) {
    console.warn('Smart match explanation failed', e);
  }
  return `${workerData.workerName} is ${workerData.distanceKm} km away with ${workerData.rating}★ rating and ${workerData.completedJobs} successfully finished jobs in Pune.`;
}

export async function translateTextWithAi(text: string, targetLang: 'hi' | 'mr' | 'en'): Promise<string> {
  try {
    const res = await fetch(`${BASE_URL}/ai/translate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, targetLang })
    });
    if (res.ok) {
      const data = await res.json();
      return data.translatedText || text;
    }
  } catch (e) {
    console.warn('Translation failed', e);
  }
  return text;
}

// Aliases and helpers
export const applyToJob = applyForJob;
export const createJob = postJob;
export const suggestJobWithAI = suggestJobWithAi;
export const createDispute = submitDispute;

export async function submitQuotation(jobId: string, data: any) {
  return sendQuotation(jobId, {
    workerId: data.workerId,
    labourCharge: data.laborCost ?? data.labourCharge ?? 0,
    materialCharge: data.materialCost ?? data.materialCharge ?? 0,
    travelCharge: data.travelCost ?? data.travelCharge ?? 0,
    otherCharge: data.otherCharge ?? 0,
    estimatedDuration: data.estimatedHours ?? data.estimatedDuration ?? '1-2 hours',
    validity: data.validity ?? '7 days',
    notes: data.description ?? data.notes ?? ''
  });
}

export async function processPayment(jobId: string, amount: number, paymentMethod: string) {
  return updateJobStatus(jobId, 'COMPLETED', paymentMethod === 'cash' ? 'Cash' : 'UPI');
}

export async function sendChatMessage(data: any) {
  return sendMessage({
    jobId: data.jobId,
    senderId: data.senderId,
    senderName: data.senderName,
    senderRole: data.senderRole,
    recipientId: data.receiverId || data.recipientId,
    text: data.message || data.text || '',
    imageUrl: data.imageUrl
  });
}

