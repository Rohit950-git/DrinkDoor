import { UserRole } from "@/src/modules/auth/types";

export interface UserItem {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  isActive: boolean;
  distributor?: string;
  lastLogin?: string;
  createdAt: string;
}

export interface CreateUserDto {
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  password?: string;
  distributor?: string;
}

export interface UpdateUserDto {
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  distributor?: string;
}

export interface UserListResponse {
  success: boolean;
  data: UserItem[];
  totalCount: number;
}
