import { NextRequest, NextResponse } from "next/server";
import authService from "./service";
import { loginSchema, registerSchema } from "./validation";

class AuthController {
  /**
   * Register User
   */
  async register(request: NextRequest) {
    try {
      const body = await request.json();

      // Validate request
      const validatedData = registerSchema.parse(body);

      // Call service
      const user = await authService.register(validatedData);

      return NextResponse.json(
        {
          success: true,
          message: "User registered successfully",
          data: user,
        },
        { status: 201 }
      );
    } catch (error: any) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        { status: 400 }
      );
    }
  }

  /**
   * Login User
   */
  async login(request: NextRequest) {
    try {
      const body = await request.json();

      // Validate request
      const validatedData = loginSchema.parse(body);

      // Call service
      const result = await authService.login(validatedData);

      const response = NextResponse.json(
        {
          success: true,
          message: "Login successful",
          user: result.user,
        },
        {
          status: 200,
        }
      );

      /**
       * HTTP Only Cookie
       */
      response.cookies.set("accessToken", result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 Days
        path: "/",
      });

      return response;
    } catch (error: any) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        {
          status: 401,
        }
      );
    }
  }

  /**
   * Profile
   */
  async profile(userId: string) {
    try {
      const user = await authService.getProfile(userId);

      return NextResponse.json({
        success: true,
        data: user,
      });
    } catch (error: any) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        {
          status: 404,
        }
      );
    }
  }

  /**
   * Logout
   */
  async logout() {
    const response = NextResponse.json({
      success: true,
      message: "Logout successful",
    });

    response.cookies.set("accessToken", "", {
      httpOnly: true,
      expires: new Date(0),
      path: "/",
    });

    return response;
  }
}

const authController =  new AuthController();
export  default authController;