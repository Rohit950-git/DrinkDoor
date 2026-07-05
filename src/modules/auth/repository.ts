import User, { IUser } from "@/src/models/User";
import { RegisterDto } from "./type";


class AuthRepository {
  /**
   * Find user by email
   */
  async findUserByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email });
  }

  /**
   * Find user by ID
   */
  async findUserById(id: string): Promise<IUser | null> {
    return await User.findById(id);
  }

  /**
   * Create new user
   */
  async createUser(data: RegisterDto): Promise<IUser> {
    return await User.create(data);
  }

  /**
   * Update password
   */
  async updatePassword(
    id: string,
    password: string
  ): Promise<IUser | null> {
    return await User.findByIdAndUpdate(
      id,
      {
        password,
      },
      {
        new: true,
      }
    );
  }

  /**
   * Update last login
   */
  async updateLastLogin(id: string): Promise<void> {
    await User.findByIdAndUpdate(id, {
      lastLogin: new Date(),
    });
  }
}

const authRepository = new AuthRepository();
export default  authRepository