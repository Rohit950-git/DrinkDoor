
import { connectDB } from "@/src/lib/db";
import authController from "@/src/modules/auth/controller";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  await connectDB();

  // Temporary
  const userId = "USER_ID";

  return authController.profile(userId);
}