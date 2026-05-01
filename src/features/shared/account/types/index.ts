export interface UserProfile {
  id: string;
  username: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  profilePhoto: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileResponse {
  message: string;
  user: UserProfile;
}

export interface UpdateProfilePayload {
  firstName: string;
  lastName: string;
  profilePhoto: string;
  phone: string;
}
