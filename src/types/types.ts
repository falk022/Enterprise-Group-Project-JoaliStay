// API Configuration
export const API_BASE = "http://144.91.126.109:5000";
export const API_KEY = "sk-8fj29dk3nf03jfldkf0293jf02ldkf03";

// Auth Types
export interface LoginParams {
  email: string;
  password: string;
  apiKey: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenParams {
  accessToken: string;
  refreshToken: string;
}

// User Types
export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string | null;
  organizationId?: number;
  role?: string;
}

export interface CustomerRegisterParams {
  name: string;
  email: string;
  phone: string;
  password: string;
  passwordConfirm: string;
}

export interface StaffCreateParams {
  name: string;
  email: string;
  phoneNumber: string;
  orgId?: number;
}

export interface InitialPasswordResetParams {
  email: string;
  temporaryKey: string;
  newPassword: string;
}

// Organization Types
export interface Organization {
  id: number;
  name: string;
  registrationNumber: string;
  email: string;
  phone: string;
  address: string;
  country: string;
  website?: string;
  logoUrl?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string | null;
  parentOrganizationId?: number | null;
  parentOrganization?: any | null;
  type: number;
}

export interface OrganizationCreateParams {
  name: string;
  registrationNumber: string;
  email: string;
  phone: string;
  address: string;
  country: string;
  logoUrl: string;
  website: string;
  orgType: number;
  initialManager: string;
}

// Service Types
export interface Service {
  id?: number;
  name: string;
  description: string;
  price: number;
  orgId: number;
  organization?: Organization;
  serviceTypeId: number;
  serviceType?: ServiceType;
  capacity?: number;
  durationInMinutes?: number;
  imageUrl: string;
  isActive?: boolean;
  createdAt?: string;
}

export interface ServiceType {
  id?: number;
  name: string;
  description: string;
  isActive?: boolean;
}

// Service Order Types
export interface ServiceOrderParams {
  serviceId: number;
  quantity: number;
  scheduledFor: string;
}

export interface ServiceOrderStatusUpdateParams {
  status: number;
}

export interface ServiceOrderFilters {
  orgId?: number;
  status?: number;
  from?: string;
  to?: string;
}

export interface PaymentParams {
  bookingId: number | string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: string[];
}
