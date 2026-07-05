import { connectDB } from "@/src/lib/db";
import { NextResponse } from "next/server";


export async function GET() {
  try {
    await connectDB();

    return NextResponse.json({
      success: true,
      message: "MongoDB Connected Successfully",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "MongoDB Connection Failed",
      },
      { status: 500 }
    );
  }
}