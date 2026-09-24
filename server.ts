import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import {
  PUNE_LOCALITIES,
  CATEGORIES,
  INITIAL_WORKERS,
  INITIAL_JOBS,
  INITIAL_NOTIFICATIONS,
  INITIAL_DISPUTES,
  INITIAL_COMMISSION,
  calculatePuneDistance
} from './src/data/puneData';
import {
  Job,
  WorkerProfile,
  JobApplication,
  Quotation,
  NotificationItem,
  Review,
  Dispute,
  CommissionConfig,
  JobStatus
} from './src/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-Memory Database Store for MVP
let workers: WorkerProfile[] = JSON.parse(JSON.stringify(INITIAL_WORKERS));
let jobs: Job[] = JSON.parse(JSON.stringify(INITIAL_JOBS));
let notifications: NotificationItem[] = JSON.parse(JSON.stringify(INITIAL_NOTIFICATIONS));
let disputes: Dispute[] = JSON.parse(JSON.stringify(INITIAL_DISPUTES));
let commissionConfig: CommissionConfig = JSON.parse(JSON.stringify(INITIAL_COMMISSION));
let chatMessages: Array<{
  id: string;
  jobId?: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  recipientId: string;
  text: string;
  imageUrl?: string;
  quoteId?: string;
  isSystem?: boolean;
  timestamp: string;
  read: boolean;
}> = [
  {
    id: 'm-1',
    jobId: 'job-101',
    senderId: 'w-1',
    senderName: 'Santosh Shinde',
    senderRole: 'worker',
    recipientId: 'c-1',
    text: 'Namaste Rohit ji. I have submitted a quotation for the angle valve replacement. I can visit your flat in Nyati Empire around 5:30 PM today.',
    timestamp: '1 hour ago',
    read: true
  },
  {
    id: 'm-2',
    jobId: 'job-101',
    senderId: 'c-1',
    senderName: 'Rohit Kulkarni',
    senderRole: 'customer',
    recipientId: 'w-1',
    text: 'Great, please bring a heavy brass valve with warranty.',
    timestamp: '45 mins ago',
    read: true
  }
];

// Lazy Gemini API Client
let geminiClient: GoogleGenAI | null = null;
function getGemini(): GoogleGenAI | null {
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    geminiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return geminiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // ==========================================
  // API ROUTES
  // ==========================================

  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'Sahayu API',
      timestamp: new Date().toISOString(),
      locality: 'Pune, Maharashtra'
    });
  });

  // Localities & Categories
  app.get('/api/locations', (req, res) => {
    res.json(PUNE_LOCALITIES);
  });

  app.get('/api/categories', (req, res) => {
    res.json(CATEGORIES);
  });

  // Workers
  app.get('/api/workers', (req, res) => {
    const { category, locality = 'Kharadi', emergency, verified, minRating, language, search } = req.query;

    let result = workers.map(w => {
      const distance = calculatePuneDistance(locality as string, w.baseLocality);
      return {
        ...w,
        calculatedDistance: distance
      };
    });

    if (category && category !== 'all') {
      result = result.filter(w =>
        w.primaryCategory.toLowerCase() === (category as string).toLowerCase() ||
        w.otherSkills.some(s => s.toLowerCase().includes((category as string).toLowerCase()))
      );
    }

    if (emergency === 'true') {
      result = result.filter(w => w.emergencyAvailable && w.isAvailable);
    }

    if (verified === 'true') {
      result = result.filter(w => w.verification.identityVerified && w.verification.skillVerified);
    }

    if (minRating) {
      const ratingThreshold = parseFloat(minRating as string);
      result = result.filter(w => w.rating >= ratingThreshold);
    }

    if (language) {
      result = result.filter(w => w.languages.some(l => l.toLowerCase().includes((language as string).toLowerCase())));
    }

    if (search) {
      const query = (search as string).toLowerCase();
      result = result.filter(w =>
        w.name.toLowerCase().includes(query) ||
        w.primaryCategory.toLowerCase().includes(query) ||
        w.otherSkills.some(s => s.toLowerCase().includes(query)) ||
        w.serviceAreas.some(a => a.toLowerCase().includes(query))
      );
    }

    // Sort by recommended score (rating, proximity, completed jobs)
    result.sort((a, b) => {
      const scoreA = (a.rating * 2) - (a.calculatedDistance * 0.5) + (a.completedJobs * 0.01);
      const scoreB = (b.rating * 2) - (b.calculatedDistance * 0.5) + (b.completedJobs * 0.01);
      return scoreB - scoreA;
    });

    res.json(result);
  });

  app.get('/api/workers/:id', (req, res) => {
    const worker = workers.find(w => w.id === req.params.id);
    if (!worker) {
      return res.status(404).json({ error: 'Worker not found' });
    }
    const userLocality = (req.query.locality as string) || 'Kharadi';
    const distance = calculatePuneDistance(userLocality, worker.baseLocality);
    res.json({ ...worker, calculatedDistance: distance });
  });

  app.patch('/api/workers/:id/availability', (req, res) => {
    const worker = workers.find(w => w.id === req.params.id);
    if (!worker) {
      return res.status(404).json({ error: 'Worker not found' });
    }
    if (typeof req.body.isAvailable === 'boolean') {
      worker.isAvailable = req.body.isAvailable;
    }
    if (typeof req.body.emergencyAvailable === 'boolean') {
      worker.emergencyAvailable = req.body.emergencyAvailable;
    }
    res.json(worker);
  });

  // Onboard new worker
  app.post('/api/workers/register', (req, res) => {
    const data = req.body;
    const newWorkerId = `w-${Date.now().toString().slice(-4)}`;
    const newWorker: WorkerProfile = {
      id: newWorkerId,
      userId: `u-${newWorkerId}`,
      name: data.name || 'New Skilled Worker',
      mobile: data.mobile || '+91 98000 00000',
      profilePhoto: data.profilePhoto || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&auto=format&fit=crop&q=80',
      primaryCategory: data.primaryCategory || 'Plumbing',
      otherSkills: Array.isArray(data.otherSkills) ? data.otherSkills : ['General Maintenance'],
      experienceYears: Number(data.experienceYears) || 3,
      rating: 5.0,
      totalReviews: 0,
      completedJobs: 0,
      responseRatePercent: 100,
      completionRatePercent: 100,
      baseLocality: data.baseLocality || 'Kharadi',
      serviceAreas: data.serviceAreas && data.serviceAreas.length ? data.serviceAreas : [data.baseLocality || 'Kharadi'],
      startingPrice: Number(data.startingPrice) || 299,
      languages: data.languages && data.languages.length ? data.languages : ['Marathi', 'Hindi'],
      workingHours: data.workingHours || '8:00 AM - 8:00 PM',
      isAvailable: true,
      emergencyAvailable: Boolean(data.emergencyAvailable),
      about: data.about || 'Dedicated skilled professional in Pune ready to provide dependable service.',
      verification: {
        phoneVerified: true,
        identityVerified: false,
        skillVerified: false,
        backgroundVerified: false,
        topRated: false,
        experienced: Number(data.experienceYears) >= 5
      },
      portfolioImages: [],
      reviews: [],
      totalEarnings: 0
    };

    workers.unshift(newWorker);
    res.status(201).json(newWorker);
  });

  // Jobs
  app.get('/api/jobs', (req, res) => {
    const { category, locality, urgency, customerId, workerId, status } = req.query;
    let result = [...jobs];

    if (customerId) {
      result = result.filter(j => j.customerId === customerId);
    }
    if (workerId) {
      result = result.filter(j => j.assignedWorkerId === workerId || j.applications.some(a => a.workerId === workerId));
    }
    if (category && category !== 'all') {
      result = result.filter(j => j.category.toLowerCase() === (category as string).toLowerCase());
    }
    if (locality && locality !== 'all') {
      result = result.filter(j => j.locationArea.toLowerCase() === (locality as string).toLowerCase());
    }
    if (urgency && urgency !== 'all') {
      result = result.filter(j => j.urgency === urgency);
    }
    if (status && status !== 'all') {
      result = result.filter(j => j.status === status);
    }

    res.json(result);
  });

  app.get('/api/jobs/:id', (req, res) => {
    const job = jobs.find(j => j.id === req.params.id);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    res.json(job);
  });

  // Post a Job
  app.post('/api/jobs/post', (req, res) => {
    const data = req.body;
    const newJobId = `job-${Date.now().toString().slice(-4)}`;
    const newJob: Job = {
      id: newJobId,
      customerId: data.customerId || 'c-1',
      customerName: data.customerName || 'Pune Citizen',
      customerPhone: data.customerPhone || '+91 98000 12345',
      customerRating: 4.9,
      title: data.title,
      category: data.category,
      subcategory: data.subcategory || 'General Service',
      description: data.description,
      photos: data.photos || [],
      locationArea: data.locationArea || 'Kharadi',
      address: data.address || 'Confidential (Shared upon confirmation)',
      pincode: data.pincode || '411014',
      preferredDate: data.preferredDate || 'Today',
      preferredTime: data.preferredTime || 'Flexible',
      urgency: data.urgency || 'today',
      budgetMin: data.budgetMin ? Number(data.budgetMin) : undefined,
      budgetMax: data.budgetMax ? Number(data.budgetMax) : undefined,
      materialRequired: data.materialRequired || 'worker_provides',
      additionalNotes: data.additionalNotes || '',
      status: 'POSTED',
      postedAt: 'Just now',
      applications: [],
      quotations: [],
      isEmergency: data.urgency === 'emergency'
    };

    jobs.unshift(newJob);

    // Create notifications for matching nearby workers
    const matchingWorkers = workers.filter(w =>
      w.primaryCategory.toLowerCase() === newJob.category.toLowerCase() &&
      w.serviceAreas.some(area => area.toLowerCase() === newJob.locationArea.toLowerCase())
    );

    matchingWorkers.forEach(w => {
      notifications.unshift({
        id: `n-${Date.now()}-${w.id}`,
        userId: w.userId,
        title: `New ${newJob.category} Job in ${newJob.locationArea}`,
        message: `"${newJob.title}" posted. Budget: ₹${newJob.budgetMin || 300} - ₹${newJob.budgetMax || 800}`,
        type: 'job',
        linkId: newJob.id,
        timestamp: 'Just now',
        read: false
      });
    });

    res.status(201).json(newJob);
  });

  // Worker Apply for a Job
  app.post('/api/jobs/:id/apply', (req, res) => {
    const job = jobs.find(j => j.id === req.params.id);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const { workerId, estimatedPrice, availableTime, message, estimatedDuration, materialCharge, travelCharge } = req.body;
    const worker = workers.find(w => w.id === workerId);
    if (!worker) {
      return res.status(404).json({ error: 'Worker not found' });
    }

    const newApp: JobApplication = {
      id: `app-${Date.now()}`,
      jobId: job.id,
      workerId: worker.id,
      workerName: worker.name,
      workerRating: worker.rating,
      workerExperience: worker.experienceYears,
      workerPhoto: worker.profilePhoto,
      estimatedPrice: Number(estimatedPrice) || worker.startingPrice,
      availableTime: availableTime || 'Available today',
      message: message || `Namaste! I have ${worker.experienceYears} years experience in ${job.category}. I can handle this neatly.`,
      estimatedDuration: estimatedDuration || '1 hour',
      materialCharge: materialCharge ? Number(materialCharge) : 0,
      travelCharge: travelCharge ? Number(travelCharge) : 0,
      createdAt: 'Just now',
      status: 'pending'
    };

    job.applications.push(newApp);
    if (job.status === 'POSTED') {
      job.status = 'RESPONSES_RECEIVED';
    }

    // Notify customer
    notifications.unshift({
      id: `n-${Date.now()}`,
      userId: job.customerId,
      title: 'New Worker Application Received',
      message: `${worker.name} applied for "${job.title}" with estimate ₹${newApp.estimatedPrice}.`,
      type: 'quote',
      linkId: job.id,
      timestamp: 'Just now',
      read: false
    });

    res.status(201).json({ job, application: newApp });
  });

  // Worker Send Quotation
  app.post('/api/jobs/:id/quote', (req, res) => {
    const job = jobs.find(j => j.id === req.params.id);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const { workerId, labourCharge, materialCharge, travelCharge, otherCharge, estimatedDuration, validity, notes } = req.body;
    const worker = workers.find(w => w.id === workerId);
    if (!worker) {
      return res.status(404).json({ error: 'Worker not found' });
    }

    const labour = Number(labourCharge) || 300;
    const material = Number(materialCharge) || 0;
    const travel = Number(travelCharge) || 0;
    const other = Number(otherCharge) || 0;
    const total = labour + material + travel + other;

    const newQuote: Quotation = {
      id: `q-${Date.now()}`,
      jobId: job.id,
      workerId: worker.id,
      workerName: worker.name,
      labourCharge: labour,
      materialCharge: material,
      travelCharge: travel,
      otherCharge: other,
      total,
      estimatedDuration: estimatedDuration || '1-2 hours',
      validity: validity || 'Valid for 48 hours',
      notes: notes || '',
      createdAt: 'Just now',
      status: 'sent'
    };

    job.quotations.push(newQuote);
    if (job.status === 'POSTED') {
      job.status = 'RESPONSES_RECEIVED';
    }

    // Add chat message representing the quote
    chatMessages.push({
      id: `m-${Date.now()}`,
      jobId: job.id,
      senderId: worker.id,
      senderName: worker.name,
      senderRole: 'worker',
      recipientId: job.customerId,
      text: `Quotation Sent: Total ₹${total} (Labour: ₹${labour}, Material: ₹${material}). ${notes || ''}`,
      quoteId: newQuote.id,
      timestamp: 'Just now',
      read: false
    });

    // Notify customer
    notifications.unshift({
      id: `n-${Date.now()}`,
      userId: job.customerId,
      title: 'Quotation Received',
      message: `${worker.name} sent a quote of ₹${total} for "${job.title}".`,
      type: 'quote',
      linkId: job.id,
      timestamp: 'Just now',
      read: false
    });

    res.status(201).json({ job, quotation: newQuote });
  });

  // Customer Selects Worker / Accepts Application or Quote
  app.post('/api/jobs/:id/select-worker', (req, res) => {
    const job = jobs.find(j => j.id === req.params.id);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const { workerId, finalPrice } = req.body;
    const worker = workers.find(w => w.id === workerId);
    if (!worker) {
      return res.status(404).json({ error: 'Worker not found' });
    }

    job.assignedWorkerId = worker.id;
    job.assignedWorkerName = worker.name;
    job.finalPrice = Number(finalPrice) || worker.startingPrice;
    job.status = 'WORKER_SELECTED';

    // Mark application as accepted
    job.applications.forEach(a => {
      if (a.workerId === worker.id) a.status = 'accepted';
      else a.status = 'rejected';
    });

    // Notify Worker
    notifications.unshift({
      id: `n-${Date.now()}`,
      userId: worker.userId,
      title: 'Congratulations! Job Awarded',
      message: `${job.customerName} in ${job.locationArea} selected you for "${job.title}". Tap to confirm visit.`,
      type: 'status',
      linkId: job.id,
      timestamp: 'Just now',
      read: false
    });

    res.json(job);
  });

  // Update Job Lifecycle Status
  app.patch('/api/jobs/:id/status', (req, res) => {
    const job = jobs.find(j => j.id === req.params.id);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const { status, paymentMethod } = req.body as { status: JobStatus; paymentMethod?: 'UPI' | 'Cash' | 'Card' };
    job.status = status;

    if (paymentMethod) {
      job.paymentMethod = paymentMethod;
      job.paymentStatus = 'paid';
    }

    if (status === 'COMPLETED' && job.assignedWorkerId) {
      const worker = workers.find(w => w.id === job.assignedWorkerId);
      if (worker) {
        worker.completedJobs += 1;
        const jobVal = job.finalPrice || worker.startingPrice;
        const net = Math.round(jobVal * 0.9);
        worker.totalEarnings = (worker.totalEarnings || 0) + net;
      }
    }

    // Send notifications on critical lifecycle events
    const statusNotifications: Record<string, { title: string; message: string; target: 'customer' | 'worker' }> = {
      CONFIRMED: {
        title: 'Booking Confirmed!',
        message: `${job.assignedWorkerName} confirmed the job and scheduled arrival.`,
        target: 'customer'
      },
      WORKER_ON_THE_WAY: {
        title: 'Worker is On the Way',
        message: `${job.assignedWorkerName} has departed towards your address in ${job.locationArea}.`,
        target: 'customer'
      },
      ARRIVED: {
        title: 'Worker Arrived',
        message: `${job.assignedWorkerName} has arrived at your premises.`,
        target: 'customer'
      },
      IN_PROGRESS: {
        title: 'Job In Progress',
        message: `Work for "${job.title}" has officially begun.`,
        target: 'customer'
      },
      COMPLETED: {
        title: 'Work Completed!',
        message: `${job.assignedWorkerName} marked the work as completed. Please review and process payment.`,
        target: 'customer'
      },
      PAYMENT: {
        title: 'Payment Received',
        message: `Payment of ₹${job.finalPrice || 500} recorded via ${job.paymentMethod || 'UPI'}.`,
        target: 'worker'
      }
    };

    if (statusNotifications[status]) {
      const info = statusNotifications[status];
      const targetUserId = info.target === 'customer' ? job.customerId : (workers.find(w => w.id === job.assignedWorkerId)?.userId || 'u-w1');
      notifications.unshift({
        id: `n-${Date.now()}`,
        userId: targetUserId,
        title: info.title,
        message: info.message,
        type: 'status',
        linkId: job.id,
        timestamp: 'Just now',
        read: false
      });
    }

    res.json(job);
  });

  // Chat & Messages
  app.get('/api/messages', (req, res) => {
    const { jobId, userId } = req.query;
    let result = [...chatMessages];
    if (jobId) {
      result = result.filter(m => m.jobId === jobId);
    }
    if (userId) {
      result = result.filter(m => m.senderId === userId || m.recipientId === userId);
    }
    res.json(result);
  });

  app.post('/api/messages/send', (req, res) => {
    const { jobId, senderId, senderName, senderRole, recipientId, text, imageUrl } = req.body;
    const newMsg = {
      id: `m-${Date.now()}`,
      jobId,
      senderId,
      senderName,
      senderRole,
      recipientId,
      text,
      imageUrl,
      timestamp: 'Just now',
      read: false
    };
    chatMessages.push(newMsg);

    // Notify recipient
    notifications.unshift({
      id: `n-${Date.now()}`,
      userId: recipientId,
      title: `New Message from ${senderName}`,
      message: text.length > 50 ? `${text.slice(0, 50)}...` : text,
      type: 'message',
      linkId: jobId,
      timestamp: 'Just now',
      read: false
    });

    res.status(201).json(newMsg);
  });

  // Notifications
  app.get('/api/notifications', (req, res) => {
    const { userId } = req.query;
    if (userId) {
      return res.json(notifications.filter(n => n.userId === userId));
    }
    res.json(notifications);
  });

  app.patch('/api/notifications/:id/read', (req, res) => {
    const notif = notifications.find(n => n.id === req.params.id);
    if (notif) notif.read = true;
    res.json({ success: true });
  });

  // Reviews
  app.post('/api/reviews', (req, res) => {
    const { jobId, reviewerId, reviewerName, targetId, targetRole, rating, qualityRating, punctualityRating, behaviourRating, professionalismRating, valueRating, comment } = req.body;

    const newRev: Review = {
      id: `r-${Date.now()}`,
      jobId,
      reviewerId,
      reviewerName,
      targetId,
      targetRole,
      rating: Number(rating) || 5,
      qualityRating: Number(qualityRating) || 5,
      punctualityRating: Number(punctualityRating) || 5,
      behaviourRating: Number(behaviourRating) || 5,
      professionalismRating: Number(professionalismRating) || 5,
      valueRating: Number(valueRating) || 5,
      comment: comment || 'Very satisfied with the service.',
      date: new Date().toISOString().split('T')[0]
    };

    // If target is worker, recalculate rating
    if (targetRole === 'worker') {
      const worker = workers.find(w => w.id === targetId);
      if (worker) {
        worker.reviews.unshift(newRev);
        worker.totalReviews += 1;
        const sum = worker.reviews.reduce((acc, r) => acc + r.rating, 0);
        worker.rating = Number((sum / worker.reviews.length).toFixed(2));
      }
    }

    // Update job status to REVIEWED
    const job = jobs.find(j => j.id === jobId);
    if (job) {
      job.status = 'REVIEWED';
    }

    res.status(201).json(newRev);
  });

  // Disputes
  app.get('/api/disputes', (req, res) => {
    res.json(disputes);
  });

  app.post('/api/disputes', (req, res) => {
    const { jobId, reportedBy, reporterRole, reportedUserName, reason, description } = req.body;
    const job = jobs.find(j => j.id === jobId);

    const newDispute: Dispute = {
      id: `disp-${Date.now()}`,
      jobId,
      jobTitle: job ? job.title : 'Service Dispute',
      reportedBy,
      reporterRole,
      reportedUserName: reportedUserName || 'User',
      reason,
      description,
      status: 'investigating',
      createdAt: 'Just now'
    };

    disputes.unshift(newDispute);
    res.status(201).json(newDispute);
  });

  app.patch('/api/disputes/:id/resolve', (req, res) => {
    const disp = disputes.find(d => d.id === req.params.id);
    if (!disp) {
      return res.status(404).json({ error: 'Dispute not found' });
    }
    disp.status = req.body.status || 'resolved';
    disp.adminNotes = req.body.adminNotes || 'Investigated by Sahayu trust and safety team.';
    res.json(disp);
  });

  // Admin Stats & Verification Management
  app.get('/api/admin/stats', (req, res) => {
    const totalWorkers = workers.length;
    const verifiedWorkers = workers.filter(w => w.verification.identityVerified && w.verification.skillVerified).length;
    const activeJobs = jobs.filter(j => ['POSTED', 'RESPONSES_RECEIVED', 'WORKER_SELECTED', 'CONFIRMED', 'WORKER_ON_THE_WAY', 'ARRIVED', 'IN_PROGRESS'].includes(j.status)).length;
    const completedJobs = jobs.filter(j => ['COMPLETED', 'PAYMENT', 'REVIEWED'].includes(j.status)).length;
    const cancelledJobs = jobs.filter(j => j.status === 'CANCELLED').length;
    const totalRevenue = jobs.filter(j => j.paymentStatus === 'paid').reduce((acc, j) => acc + (j.finalPrice || 500), 0);
    const platformCommission = Math.round(totalRevenue * (commissionConfig.defaultPercentage / 100));

    res.json({
      totalUsers: 1420 + jobs.length,
      totalWorkers,
      verifiedWorkers,
      activeJobs,
      completedJobs,
      cancelledJobs,
      totalRevenue: totalRevenue + 145000,
      platformCommission: platformCommission + 14500,
      avgRating: 4.84,
      newRegistrationsToday: 14,
      openDisputes: disputes.filter(d => d.status === 'investigating').length,
      topDemandedCategory: 'Plumbing & Electrical'
    });
  });

  app.patch('/api/admin/workers/:id/verify', (req, res) => {
    const worker = workers.find(w => w.id === req.params.id);
    if (!worker) {
      return res.status(404).json({ error: 'Worker not found' });
    }
    const { identityVerified, skillVerified, backgroundVerified } = req.body;
    if (typeof identityVerified === 'boolean') worker.verification.identityVerified = identityVerified;
    if (typeof skillVerified === 'boolean') worker.verification.skillVerified = skillVerified;
    if (typeof backgroundVerified === 'boolean') worker.verification.backgroundVerified = backgroundVerified;

    res.json(worker);
  });

  app.get('/api/admin/commission', (req, res) => {
    res.json(commissionConfig);
  });

  app.patch('/api/admin/commission', (req, res) => {
    const { defaultPercentage, categoryOverrides, fixedFeeAmount, useFixedFee } = req.body;
    if (typeof defaultPercentage === 'number') commissionConfig.defaultPercentage = defaultPercentage;
    if (categoryOverrides) commissionConfig.categoryOverrides = categoryOverrides;
    if (typeof fixedFeeAmount === 'number') commissionConfig.fixedFeeAmount = fixedFeeAmount;
    if (typeof useFixedFee === 'boolean') commissionConfig.useFixedFee = useFixedFee;

    res.json(commissionConfig);
  });

  // ==========================================
  // GEMINI AI ENDPOINTS (Server-Side)
  // ==========================================

  // 1. AI Job Description Assistant
  app.post('/api/ai/suggest-job', async (req, res) => {
    const { rawText, language = 'en' } = req.body;
    if (!rawText || !rawText.trim()) {
      return res.status(400).json({ error: 'Text prompt is required' });
    }

    try {
      const ai = getGemini();
      if (ai) {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `You are an AI assistant for "Sahayu", a local skilled worker marketplace in Pune, India.
Given the user's raw input description (which may be in English, Hindi, Hinglish, Marathi, or mixed): "${rawText}".
Available categories: Plumbing, Electrical, Carpentry, Household Help, Appliance Repair, Painting, Mason & Construction, Technical, Mobile Repair, Vehicle Mechanics, Personal Grooming, Moving & Labour Help.

Return a strictly valid JSON object with the following schema (no markdown fences, just pure JSON):
{
  "category": "One of the available categories",
  "subcategory": "A concise specific subcategory",
  "title": "Clear, professional job title in 4-8 words",
  "description": "Polished, helpful job description explaining what work needs to be done, potential causes, and what the technician should check",
  "suggestedBudgetMin": number (in INR, e.g. 300),
  "suggestedBudgetMax": number (in INR, e.g. 700),
  "urgency": "emergency" | "today" | "tomorrow" | "this_week" | "flexible",
  "materialRequired": "customer_provides" | "worker_provides" | "need_quotation"
}`
                }
              ]
            }
          ]
        });

        const textResponse = response.text || '';
        const cleaned = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        return res.json(parsed);
      }
    } catch (err) {
      console.warn('Gemini AI fallback triggered:', err);
    }

    // Fallback heuristic intelligence if key is missing or parsing failed
    const lower = rawText.toLowerCase();
    let category = 'Plumbing';
    let subcategory = 'Tap Repair & Installation';
    let title = 'Home Maintenance Repair Required';
    let minBudget = 350;
    let maxBudget = 750;
    let urgency: 'today' | 'emergency' | 'tomorrow' = 'today';

    if (lower.includes('leak') || lower.includes('tap') || lower.includes('water') || lower.includes('paani') || lower.includes('nal') || lower.includes('drain') || lower.includes('pipe') || lower.includes('गळत')) {
      category = 'Plumbing';
      subcategory = lower.includes('drain') ? 'Drain & Sewer Blockage' : 'Pipe Leakage Repair';
      title = 'Plumbing Water Leakage & Pipe Repair';
      minBudget = 350;
      maxBudget = 800;
    } else if (lower.includes('current') || lower.includes('bijli') || lower.includes('mcb') || lower.includes('light') || lower.includes('fan') || lower.includes('spark') || lower.includes('wire') || lower.includes('शॉर्ट')) {
      category = 'Electrical';
      subcategory = lower.includes('fan') ? 'Ceiling Fan Installation & Repair' : 'Wiring & MCB Tripping Fix';
      title = 'Electrical Wiring & Power Tripping Inspection';
      minBudget = 300;
      maxBudget = 900;
      urgency = lower.includes('spark') ? 'emergency' : 'today';
    } else if (lower.includes('clean') || lower.includes('safai') || lower.includes('maid') || lower.includes('kachra') || lower.includes('बाई') || lower.includes('झाडू')) {
      category = 'Household Help';
      subcategory = 'Deep Home Cleaning';
      title = 'House Deep Cleaning & Degreasing';
      minBudget = 1200;
      maxBudget = 2500;
    } else if (lower.includes('ac') || lower.includes('fridge') || lower.includes('cooling') || lower.includes('geyser') || lower.includes('washing')) {
      category = 'Appliance Repair';
      subcategory = lower.includes('ac') ? 'AC Service, Gas & Jet Clean' : 'Refrigerator Cooling & Compressor';
      title = 'Home Appliance Inspection & Repair';
      minBudget = 499;
      maxBudget = 1500;
    } else if (lower.includes('wood') || lower.includes('door') || lower.includes('cupboard') || lower.includes('lock') || lower.includes('bed') || lower.includes('सुतार')) {
      category = 'Carpentry';
      subcategory = 'Wooden Furniture Repair';
      title = 'Carpentry Furniture & Lock Repair';
      minBudget = 400;
      maxBudget = 1200;
    } else if (lower.includes('paint') || lower.includes('color') || lower.includes('putty') || lower.includes('रंग')) {
      category = 'Painting';
      subcategory = 'Single Wall / Touchup Painting';
      title = 'Wall Touchup & Room Painting';
      minBudget = 1500;
      maxBudget = 4500;
    } else if (lower.includes('laptop') || lower.includes('computer') || lower.includes('mac') || lower.includes('screen') || lower.includes('wifi')) {
      category = 'Technical';
      subcategory = 'Laptop Overheating & Fan Clean';
      title = 'Laptop / Computer Hardware Servicing';
      minBudget = 400;
      maxBudget = 1200;
    }

    res.json({
      category,
      subcategory,
      title,
      description: `Customer reported: "${rawText}". Technician requested to inspect the root issue, provide fair estimate for parts, and complete repair with testing.`,
      suggestedBudgetMin: minBudget,
      suggestedBudgetMax: maxBudget,
      urgency,
      materialRequired: 'worker_provides'
    });
  });

  // 2. AI Smart Worker Matching Explanation
  app.post('/api/ai/smart-match', async (req, res) => {
    const { workerName, category, distanceKm, rating, completedJobs, experienceYears } = req.body;

    try {
      const ai = getGemini();
      if (ai) {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `Write a 2-sentence objective explanation for why ${workerName} is recommended for a ${category} job in Pune based solely on these factual parameters:
Distance: ${distanceKm} km away
Rating: ${rating}/5.0
Completed jobs: ${completedJobs}
Experience: ${experienceYears} years.
Do not use hype. State the factual proximity and proven track record clearly.`
                }
              ]
            }
          ]
        });
        return res.json({ explanation: response.text?.trim() });
      }
    } catch (err) {
      console.warn('Gemini smart match fallback:', err);
    }

    res.json({
      explanation: `${workerName} is located only ${distanceKm} km away with a high ${rating}★ track record across ${completedJobs} completed jobs and ${experienceYears} years of practical expertise in Pune.`
    });
  });

  // 3. AI Translation between EN, HI, MR
  app.post('/api/ai/translate', async (req, res) => {
    const { text, targetLang = 'hi' } = req.body;
    if (!text) return res.json({ translatedText: '' });

    try {
      const ai = getGemini();
      if (ai) {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `Translate the following local service marketplace text into ${targetLang === 'hi' ? 'Hindi' : targetLang === 'mr' ? 'Marathi' : 'English'}. Keep tone respectful, natural to Pune/Maharashtra locals. Only return the translated text:\n"${text}"`
                }
              ]
            }
          ]
        });
        return res.json({ translatedText: response.text?.trim() });
      }
    } catch (err) {
      console.warn('Translation fallback:', err);
    }

    res.json({ translatedText: text });
  });

  // ==========================================
  // VITE / STATIC SERVING
  // ==========================================

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Sahayu server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
