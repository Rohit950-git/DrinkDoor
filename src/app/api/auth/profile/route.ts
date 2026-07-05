
import { connectDB } from "@/src/lib/db";
import authController from "@/src/modules/auth/controller";
import { verifyToken } from "@/src/lib/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const tokenCookie = request.cookies.get("accessToken");
    if (!tokenCookie || !tokenCookie.value) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized: No access token found",
        },
        { status: 401 }
      );
    }

    const decoded = verifyToken(tokenCookie.value) as { id: string };
    if (!decoded || !decoded.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized: Invalid token",
        },
        { status: 401 }
      );
    }

    return authController.profile(decoded.id);
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized: " + (error.message || "Session expired"),
      },
      { status: 401 }
    );
  }
}