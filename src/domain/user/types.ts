// User profile domain types

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  gender?: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  avatarUrl?: string;
  profilePicture?: string;
  meansOfIdType?: string;
  meansOfIdNumber?: string;
  selfieImage?: string;
  socialMediaLinks?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
}

export interface NextOfKin {
  name: string;
  phone: string;
  relationship: string;
}
