// User related types
export enum Role {
  ADMIN = 'ADMIN',
  WORKER = 'WORKER',
  VERIFIER = 'VERIFIER'
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: AchievementType;
  requiredProgress: number;
  unlockedAt: string;
  userId: string;
}

export enum AchievementType {
  CHORES_COMPLETED = 'CHORES_COMPLETED',
  STREAK_MILESTONE = 'STREAK_MILESTONE',
  VERIFICATION_MILESTONE = 'VERIFICATION_MILESTONE',
  BALANCE_MILESTONE = 'BALANCE_MILESTONE',
  SPECIAL_EVENT = 'SPECIAL_EVENT'
}

export interface UserPreferences {
  notifications: boolean;
  theme: string;
  emailReminders: boolean;
  celebrationAnimations: boolean;
}

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  roles: Role[];
  verifiableTasks: ChoreType[];
  balance: number;
  completedChores: number;
  streakCount: number;
  achievements: Achievement[];
  preferences: UserPreferences;
  createdAt: string;
  updatedAt: string;
  _links?: Record<string, HalLink>;
}

// Chore related types
export enum ChoreType {
  DISHES = 'DISHES',
  LAUNDRY = 'LAUNDRY',
  VACUUMING = 'VACUUMING',
  DUSTING = 'DUSTING',
  BATHROOM_CLEANING = 'BATHROOM_CLEANING',
  TRASH = 'TRASH',
  PET_CARE = 'PET_CARE',
  YARD_WORK = 'YARD_WORK',
  MEAL_PREP = 'MEAL_PREP',
  GENERAL_TIDYING = 'GENERAL_TIDYING'
}

export enum DifficultyLevel {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
  EXPERT = 'EXPERT'
}

export enum ScheduleType {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  CUSTOM = 'CUSTOM'
}

export interface Schedule {
  type: ScheduleType;
  days: string[]; // DayOfWeek values: "MONDAY", "TUESDAY", etc.
}

export interface Chore {
  id: string;
  name: string;
  description: string;
  type: ChoreType;
  value: number;
  estimatedDuration: number;
  difficulty: DifficultyLevel;
  checklist: string[];
  schedule: Schedule;
  isFlexible: boolean;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  _links?: Record<string, HalLink>;
}

// Assignment related types
export enum AssignmentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  VERIFICATION_NEEDED = 'VERIFICATION_NEEDED',
  REJECTED = 'REJECTED',
  VERIFIED = 'VERIFIED'
}

export interface Assignment {
  id: string;
  choreId: string;
  workerId: string;
  weekId: string;
  status: AssignmentStatus;
  completedAt: string | null;
  verifierId: string | null;
  verifiedAt: string | null;
  rejectionNotes: string | null;
  completionEvidence: string | null;
  createdAt: string;
  updatedAt: string;
  _links?: Record<string, HalLink>;
  _embedded?: {
    chore?: Chore;
    worker?: User;
    verifier?: User;
  };
}

// Week related types
export interface Week {
  id: string;
  startDate: string;
  endDate: string;
  goal: string;
  goalAchieved: boolean;
  totalChoresAssigned: number;
  totalChoresCompleted: number;
  createdAt: string;
  updatedAt: string;
  _links?: Record<string, HalLink>;
}

// HAL related types
export interface HalLink {
  href: string;
  templated?: boolean;
}

export interface HalPage {
  size: number;
  totalElements: number;
  totalPages: number;
  number: number;
}

export interface HalCollection<T> {
  _embedded: {
    [key: string]: T[];
  };
  _links: Record<string, HalLink>;
  page: HalPage;
}

// Authentication types
export interface AuthCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
