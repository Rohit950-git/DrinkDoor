import { UserRole } from "@/src/models/User";


export interface RegisterDto {
  name: string;
  email: string;
  phone?: string;
  password: string;
  role?: UserRole;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface JwtPayload {
  id: string;
}