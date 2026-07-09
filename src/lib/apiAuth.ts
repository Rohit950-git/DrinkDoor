import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/src/lib/jwt";
import { UserRole } from "@/src/models/User";
import { ApiResponse } from "@/src/lib/apiResponse";

export interface AuthenticatedNextRequest extends NextRequest {
  user?: {
    id: string;
    role: UserRole;
  };
}

type ApiHandler = (
  request: AuthenticatedNextRequest,
  context: any
) => Promise<NextResponse> | NextResponse;

/**
 * API route wrapper to verify authentication and role authorization.
 */
export function withRole(allowedRoles: UserRole[], handler: ApiHandler) {
  return async (request: NextRequest, context: any) => {
    try {
      const tokenCookie = request.cookies.get("accessToken");
      const token = tokenCookie?.value;

      if (!token) {
        return ApiResponse.error("Unauthorized: Access token missing", 401);
      }

      const decoded = verifyToken(token);
      if (!decoded || !decoded.id || !decoded.role) {
        return ApiResponse.error("Unauthorized: Invalid access token", 401);
      }

      // Check role authorization
      if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role as UserRole)) {
        return ApiResponse.error("Forbidden: You do not have permission to access this resource", 403);
      }

      // Attach user details to the request
      const authenticatedRequest = request as AuthenticatedNextRequest;
      authenticatedRequest.user = {
        id: decoded.id,
        role: decoded.role as UserRole,
      };

      return await handler(authenticatedRequest, context);
    } catch (error: any) {
      console.error("API Auth wrapper error:", error);
      return ApiResponse.error(
        "Unauthorized: " + (error.message || "Invalid session"),
        401
      );
    }
  };
}

/**
 * Shorthand wrapper to verify authentication only (any role).
 */
export function withAuth(handler: ApiHandler) {
  return withRole([], handler);
}
