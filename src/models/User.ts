import mongoose, { Document, Model, Schema } from "mongoose";

/**
 * User Roles
 */
export enum UserRole {
  ADMIN = "ADMIN",
  DISTRIBUTOR = "DISTRIBUTOR",
  SHOPKEEPER = "SHOPKEEPER",
}

/**
 * User Interface
 */
export interface IUser extends Document {
  name: string;
  email: string;
  phone?: string;
  password: string;
  role: UserRole;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
id: string ;
}

/**
 * User Schema
 */
const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      default: "",
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.SHOPKEEPER,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Export Model
 */
const User: Model<IUser> =
  mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);

export default User;