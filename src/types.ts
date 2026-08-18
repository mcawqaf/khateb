export type RegistrationStatus = 'pending' | 'accepted_initial' | 'accepted_final' | 'rejected' | 'under_review';

export interface Registration {
  id: string;
  serialNumber: string; // e.g. KHT-1448-001
  sequenceNumber: number;
  fullName: string;
  nationalId: string;
  phone: string;
  email?: string;
  birthDate: string;
  age: number;
  city: string;
  address: string;
  educationalLevel: string;
  quranMemorization: string;
  isCurrentlyKhateeb: boolean;
  hasAttendedPreviousCourses: boolean;
  fluencyAndSpeechClear: boolean;
  agreedToBehaviorAndAppearance: boolean;
  attendanceCommitment: boolean;
  housingNeeded: boolean;
  housingCommitment?: boolean;
  notes?: string;
  status: RegistrationStatus;
  supervisorNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminStats {
  total: number;
  acceptedInitial: number;
  acceptedFinal: number;
  underReview: number;
  rejected: number;
  housingRequested: number;
  fullQuranMemorizers: number;
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConfigured: boolean;
}
