// User profile domain types

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  gender?: string;
  dateOfBirth?: string;
  address?: string;
  avatarUrl?: string;
}

export interface NextOfKin {
  name: string;
  phone: string;
  relationship: string;
}
