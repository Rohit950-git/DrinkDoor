import { NextResponse } from "next/server";

export class ApiResponse {
  static success<T>(
    data: T,
    message = "Success",
    statusCode = 200
  ) {
    return NextResponse.json(
      {
        success: true,
        message,
        data,
      },
      {
        status: statusCode,
      }
    );
  }

  static error(
    message = "Something went wrong",
    statusCode = 500,
    errors: unknown = null
  ) {
    return NextResponse.json(
      {
        success: false,
        message,
        errors,
      },
      {
        status: statusCode,
      }
    );
  }
}