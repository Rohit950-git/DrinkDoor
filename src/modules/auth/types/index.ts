export enum UserRole {
  ADMIN = "ADMIN",
  DISTRIBUTOR = "DISTRIBUTOR",
  SHOPKEEPER = "SHOPKEEPER",
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  user: AuthUser;
}

export interface ProfileResponse {
  success: boolean;
  data: AuthUser;
}

export interface LogoutResponse {
  success: boolean;
  message?: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message?: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message?: string;
}
