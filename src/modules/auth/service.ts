

import { ApiError } from "next/dist/server/api-utils";
import authRepository from "./repository";
import { LoginDto, RegisterDto } from "./type";
import { AUTH_MESSAGES } from "@/src/constant/message";
import { HTTP_STATUS } from "@/src/constant/statusCode";
import { comparePassword, hashPassword } from "@/src/lib/bcrypt";
import { generateToken } from "@/src/lib/jwt";


class AuthService {
  /**
   * Register User
   */
  async register(data: RegisterDto) {
    // Check if email already exists
    const existingUser = await authRepository.findUserByEmail(data.email);

    if (existingUser) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        AUTH_MESSAGES.EMAIL_EXISTS
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(data.password);

    // Create user
    const user = await authRepository.createUser({
      ...data,
      password: hashedPassword,
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }

  /**
   * Login User
   */
  async login(data: LoginDto) {
    // Find user
    const user = await authRepository.findUserByEmail(data.email);

    if (!user) {
      throw new ApiError(
        HTTP_STATUS.UNAUTHORIZED,
        AUTH_MESSAGES.INVALID_CREDENTIALS
      );
    }

    // Compare password
    const isPasswordValid = await comparePassword(
      data.password,
      user.password
    );

    if (!isPasswordValid) {
      throw new ApiError(
        HTTP_STATUS.UNAUTHORIZED,
        AUTH_MESSAGES.INVALID_CREDENTIALS
      );
    }

    // Update last login
    await authRepository.updateLastLogin(user.id);

    // Generate JWT
    const token = generateToken(user.id);

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  /**
   * Get Profile
   */
  async getProfile(userId: string) {
    const user = await authRepository.findUserById(userId);

    if (!user) {
      throw new ApiError(
        HTTP_STATUS.NOT_FOUND,
        AUTH_MESSAGES.USER_NOT_FOUND
      );
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isActive: user.isActive,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  /**
   * Logout User
   */
  async logout() {
    return {
      message: AUTH_MESSAGES.LOGOUT_SUCCESS,
    };
  }
}

const authService = new AuthService();

export default authService;