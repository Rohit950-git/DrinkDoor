
import { connectDB } from "@/src/lib/db";
import authController from "@/src/modules/auth/controller";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  await connectDB();

  return authController.login(request);
}