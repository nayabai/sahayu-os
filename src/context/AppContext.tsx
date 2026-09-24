import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, Language, WorkerProfile, Job, NotificationItem, Category, ChatMessage } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import * as api from '../services/api';

interface AppContextType {
  currentUser: User;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  currentLocality: string;
  setCurrentLocality: (loc: string) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;

  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedCategoryFilter: string;
  setSelectedCategoryFilter: (cat: string) => void;
  seoParam: { locality?: string; category?: string } | null;
  setSeoParam: (param: { locality?: string; category?: string } | null) => void;

  // Data lists
  workers: (WorkerProfile & { calculatedDistance: number })[];
  jobs: Job[];
  categories: Category[];
  notifications: NotificationItem[];
  savedWorkerIds: string[];
  toggleSaveWorker: (workerId: string) => void;
  refreshData: () => Promise<void>;

  // Toast
  toast: string | null;
  toastMessage: string | null;
  showToast: (msg: string) => void;

  // Modal controls
  isPostJobModalOpen: boolean;
  setIsPostJobModalOpen: (open: boolean) => void;

  selectedWorkerForProfile: (WorkerProfile & { calculatedDistance?: number }) | null;
  setSelectedWorkerForProfile: (worker: (WorkerProfile & { calculatedDistance?: number }) | null) => void;

  selectedJobForDetails: Job | null;
  setSelectedJobForDetails: (job: Job | null) => void;

  isApplyModalOpen: boolean;
  setIsApplyModalOpen: (open: boolean) => void;
  selectedJobForApply: Job | null;
  setSelectedJobForApply: (job: Job | null) => void;

  isQuoteModalOpen: boolean;
  setIsQuoteModalOpen: (open: boolean) => void;
  selectedJobForQuote: Job | null;
  setSelectedJobForQuote: (job: Job | null) => void;

  isWorkerOnboardingOpen: boolean;
  setIsWorkerOnboardingOpen: (open: boolean) => void;

  isChatDrawerOpen: boolean;
  setIsChatDrawerOpen: (open: boolean) => void;
  activeChatTarget: { id: string; name: string; role: string; jobId?: string } | null;
  setActiveChatTarget: (target: { id: string; name: string; role: string; jobId?: string } | null) => void;
  openChatWith: (target: { id: string; name: string; role: string; jobId?: string }) => void;
  chatMessages: ChatMessage[];

  isPaymentModalOpen: boolean;
  setIsPaymentModalOpen: (open: boolean) => void;
  selectedJobForPayment: Job | null;
  setSelectedJobForPayment: (job: Job | null) => void;

  isReviewModalOpen: boolean;
  setIsReviewModalOpen: (open: boolean) => void;
  selectedJobForReview: Job | null;
  setSelectedJobForReview: (job: Job | null) => void;

  isDisputeModalOpen: boolean;
  setIsDisputeModalOpen: (open: boolean) => void;
  selectedJobForDispute: Job | null;
  setSelectedJobForDispute: (job: Job | null) => void;

  isSafetyModalOpen: boolean;
  setIsSafetyModalOpen: (open: boolean) => void;

  isMaskedCallModalOpen: boolean;
  setIsMaskedCallModalOpen: (open: boolean) => void;
  maskedCallTarget: { name: string; role: string; phone?: string } | null;
  triggerMaskedCall: (target: { name: string; role: string; phone?: string } | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>('customer');
  const [currentLocality, setCurrentLocality] = useState<string>('Kharadi');
  const [language, setLanguage] = useState<Language>('en');
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [seoParam, setSeoParam] = useState<{ locality?: string; category?: string } | null>(null);

  // Demo user profiles
  const [currentUser, setCurrentUser] = useState<User>({
    id: 'c-1',
    name: 'Rohit Kulkarni',
    mobile: '+91 98230 55410',
    email: 'rohit.kulkarni@example.com',
    role: 'customer',
    locality: 'Kharadi',
    pincode: '411014',
    city: 'Pune',
    preferredLanguage: 'en',
    joinedAt: 'March 2026'
  });

  // Switch user profile when role changes
  useEffect(() => {
    if (currentRole === 'customer') {
      setCurrentUser({
        id: 'c-1',
        name: 'Rohit Kulkarni',
        mobile: '+91 98230 55410',
        email: 'rohit.kulkarni@example.com',
        role: 'customer',
        locality: currentLocality,
        pincode: '411014',
        city: 'Pune',
        preferredLanguage: language,
        joinedAt: 'March 2026'
      });
    } else if (currentRole === 'worker') {
      setCurrentUser({
        id: 'w-1',
        name: 'Santosh Shinde',
        mobile: '+91 98220 14820',
        role: 'worker',
        locality: currentLocality,
        pincode: '411014',
        city: 'Pune',
        preferredLanguage: language,
        rating: 4.88,
        joinedAt: 'January 2025'
      });
    } else {
      setCurrentUser({
        id: 'adm-1',
        name: 'Sahayu Admin Pune',
        mobile: '+91 98900 11223',
        role: 'admin',
        locality: 'Shivajinagar',
        pincode: '411005',
        city: 'Pune',
        preferredLanguage: 'en',
        joinedAt: 'December 2024'
      });
    }
  }, [currentRole, currentLocality, language]);

  // Data lists
  const [workers, setWorkers] = useState<(WorkerProfile & { calculatedDistance: number })[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [savedWorkerIds, setSavedWorkerIds] = useState<string[]>(['w-1', 'w-4']);

  // Modals
  const [toast, setToast] = useState<string | null>(null);
  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false);
  const [selectedWorkerForProfile, setSelectedWorkerForProfile] = useState<(WorkerProfile & { calculatedDistance?: number }) | null>(null);
  const [selectedJobForDetails, setSelectedJobForDetails] = useState<Job | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedJobForApply, setSelectedJobForApply] = useState<Job | null>(null);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [selectedJobForQuote, setSelectedJobForQuote] = useState<Job | null>(null);
  const [isWorkerOnboardingOpen, setIsWorkerOnboardingOpen] = useState(false);
  const [isChatDrawerOpen, setIsChatDrawerOpen] = useState(false);
  const [activeChatTarget, setActiveChatTarget] = useState<{ id: string; name: string; role: string; jobId?: string } | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedJobForPayment, setSelectedJobForPayment] = useState<Job | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedJobForReview, setSelectedJobForReview] = useState<Job | null>(null);
  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);
  const [selectedJobForDispute, setSelectedJobForDispute] = useState<Job | null>(null);
  const [isSafetyModalOpen, setIsSafetyModalOpen] = useState(false);
  const [isMaskedCallModalOpen, setIsMaskedCallModalOpen] = useState(false);
  const [maskedCallTarget, setMaskedCallTarget] = useState<{ name: string; role: string; phone?: string } | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const toggleSaveWorker = (workerId: string) => {
    setSavedWorkerIds(prev => {
      if (prev.includes(workerId)) {
        showToast('Worker removed from saved favorites.');
        return prev.filter(id => id !== workerId);
      } else {
        showToast('Worker saved to your favorites!');
        return [...prev, workerId];
      }
    });
  };

  const openChatWith = (target: { id: string; name: string; role: string; jobId?: string }) => {
    setActiveChatTarget(target);
    setIsChatDrawerOpen(true);
  };

  const triggerMaskedCall = (target: { name: string; role: string; phone?: string } | null) => {
    if (!target) {
      setMaskedCallTarget(null);
      setIsMaskedCallModalOpen(false);
      return;
    }
    setMaskedCallTarget(target);
    setIsMaskedCallModalOpen(true);
  };

  const refreshData = async () => {
    try {
      const [fetchedWorkers, fetchedJobs, fetchedCats, fetchedNotifs, fetchedMsgs] = await Promise.all([
        api.fetchWorkers({ locality: currentLocality }),
        api.fetchJobs(),
        api.fetchCategories(),
        api.fetchNotifications(),
        api.fetchMessages()
      ]);
      setWorkers(fetchedWorkers);
      setJobs(fetchedJobs);
      setCategories(fetchedCats);
      setNotifications(fetchedNotifs);
      setChatMessages(fetchedMsgs);
    } catch (e) {
      console.warn('Error refreshing data', e);
    }
  };

  useEffect(() => {
    refreshData();
  }, [currentLocality]);

  const t = (key: string): string => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS.en[key] || key;
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentRole,
        setCurrentRole,
        currentLocality,
        setCurrentLocality,
        language,
        setLanguage,
        t,
        activeTab,
        setActiveTab,
        selectedCategoryFilter,
        setSelectedCategoryFilter,
        seoParam,
        setSeoParam,
        workers,
        jobs,
        categories,
        notifications,
        savedWorkerIds,
        toggleSaveWorker,
        refreshData,
        toast,
        toastMessage: toast,
        showToast,
        isPostJobModalOpen,
        setIsPostJobModalOpen,
        selectedWorkerForProfile,
        setSelectedWorkerForProfile,
        selectedJobForDetails,
        setSelectedJobForDetails,
        isApplyModalOpen,
        setIsApplyModalOpen,
        selectedJobForApply,
        setSelectedJobForApply,
        isQuoteModalOpen,
        setIsQuoteModalOpen,
        selectedJobForQuote,
        setSelectedJobForQuote,
        isWorkerOnboardingOpen,
        setIsWorkerOnboardingOpen,
        isChatDrawerOpen,
        setIsChatDrawerOpen,
        activeChatTarget,
        setActiveChatTarget,
        openChatWith,
        chatMessages,
        isPaymentModalOpen,
        setIsPaymentModalOpen,
        selectedJobForPayment,
        setSelectedJobForPayment,
        isReviewModalOpen,
        setIsReviewModalOpen,
        selectedJobForReview,
        setSelectedJobForReview,
        isDisputeModalOpen,
        setIsDisputeModalOpen,
        selectedJobForDispute,
        setSelectedJobForDispute,
        isSafetyModalOpen,
        setIsSafetyModalOpen,
        isMaskedCallModalOpen,
        setIsMaskedCallModalOpen,
        maskedCallTarget,
        triggerMaskedCall
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
