import { connectDB } from "@/src/lib/db";
import { hashPassword } from "@/src/lib/bcrypt";
import authRepository from "@/src/modules/auth/repository";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const resetPasswordSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { token, password } = resetPasswordSchema.parse(body);

    if (!token.startsWith("mock-token-")) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired reset token",
        },
        { status: 400 }
      );
    }

    const userId = token.replace("mock-token-", "");
    const user = await authRepository.findUserById(userId);
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    // Hash the new password and save it
    const hashedPassword = await hashPassword(password);
    await authRepository.updatePassword(userId, hashedPassword);

    return NextResponse.json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "An error occurred",
      },
      { status: 400 }
    );
  }
}
