import { connectDB } from "@/src/lib/db";
import User from "@/src/models/User";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { email } = forgotPasswordSchema.parse(body);

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User with this email does not exist",
        },
        { status: 404 }
      );
    }

    // Generate a simple mock reset token containing the user ID
    const mockToken = `mock-token-${user.id}`;

    return NextResponse.json({
      success: true,
      message: "Reset link generated successfully",
      token: mockToken,
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
