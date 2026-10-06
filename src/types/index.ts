/**
 * GiveHope TypeScript Types
 * Accurately mirrors Django REST Framework models & API contracts
 */

export type BackendCategory = 'HEALTH' | 'EDUCATION' | 'NATURAL DISASTER';

export type Currency = 'NPR' | 'USD' | 'INR';

export type RecurringTiming = 'WEEKLY' | 'MONTHLY' | 'YEARLY';

export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILURE' | 'CANCELLED';

export type PaymentMethod = 'KHALTI' | 'ESEWA' | 'BANK';

export type SubscriptionPackage = 'BASIC' | 'STANDARD' | 'PREMIUM';

export type DocumentType = 'Medical Report' | 'ID Proof' | 'NGO Certificate' | 'Other';

export interface Campaign {
  id: number;
  title: string;
  description: string;
  category: BackendCategory;
  goal_amount: number;
  current_raised: number;
  is_active: boolean;
  is_approved: boolean;
  donor_count?: number;
  image?: string;
  image_url?: string;
  organizer_name?: string;
  location?: string;
  created_at: string;
  updated_at?: string;
  user_email?: string;
}

export interface SubscriptionPlan {
  id: number;
  campaign: number;
  package: SubscriptionPackage;
  amount: number;
  currency: Currency;
  benefits: string;
  is_active: boolean;
}

export interface CampaignDocument {
  id: number;
  campaign: number | string;
  campaign_id?: number;
  document?: string;
  document_name?: string;
  document_type: DocumentType | string;
  document_type_display?: string;
  uploaded_at?: string;
  created_at?: string;
  verified?: boolean;
  is_verified_by_staff?: boolean;
}

export interface CreatorDocument {
  id: number;
  document?: string;
  document_type: 'id' | 'address_proof' | 'organization' | 'other' | string;
  document_type_display?: string;
  document_name?: string;
  document_url?: string;
  uploaded_at?: string;
}

export interface UserProfile {
  id?: number;
  email: string;
  full_name: string;
  address?: string;
  phone?: string;
  bio?: string;
  profile_picture?: string;
  profile_picture_url?: string;
  documents?: CreatorDocument[];
  is_creator_ready?: boolean;
  missing_requirements?: string[];
  created_at: string;
  updated_at?: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  username?: string;
  full_name?: string;
  phone?: string;
}

export interface OneTimeDonationPayload {
  amount: number;
  currency: Currency;
  is_anonymous: boolean;
}

export interface OneTimeDonationResponse {
  message: string;
  donation_id: number;
}

export interface RecurringDonationPayload {
  campaign: number;
  amount: number;
  currency: Currency;
  recurring_timing: RecurringTiming;
  is_anonymous: boolean;
  is_active?: boolean;
}

export interface RecurringDonationResponse {
  message: string;
  recurring_id: number;
}

export interface PaymentUrlResponse {
  payment_url: string;
}


export interface DonationRecord {
  id: number;
  campaign: number;
  campaign_title?: string;
  amount: number;
  currency: Currency;
  is_anonymous: boolean;
  payment_status: PaymentStatus;
  created_at: string;
  updated_at?: string;
  transaction_id?: string;
  billing_id?: number;
}

export interface RecurringDonationRecord {
  id: number;
  campaign: number;
  campaign_title?: string;
  amount: number;
  currency: Currency;
  recurring_timing: RecurringTiming;
  is_active: boolean;
  is_anonymous: boolean;
  is_processing: boolean;
  next_run?: string;
  last_run?: string;
  last_payment_status?: PaymentStatus;
  created_at: string;
}

export interface BillingRecord {
  id: number;
  donation?: number | null;
  recurring_donation?: number | null;
  campaign_id?: number;
  campaign_title?: string;
  transaction_id: string; // May be masked by backend for non-staff
  amount: number;
  currency: Currency;
  payment_method: PaymentMethod;
  status: PaymentStatus;
  is_recurring: boolean;
  created_at: string;
  updated_at: string;
}
