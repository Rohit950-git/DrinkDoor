import { UserRole } from "@/src/modules/auth/types";

export interface JwtPayload {
  id: string;
  role: UserRole;
  exp?: number;
}

/**
 * Base64URL decoding helper
 */
function base64urlDecode(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  return atob(base64);
}

/**
 * Decode token without cryptographic signature verification
 */
export function decodeToken(token: string): JwtPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payloadJson = base64urlDecode(parts[1]);
    return JSON.parse(payloadJson) as JwtPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Edge-compatible HS256 JWT verifier using standard Web Crypto API
 */
export async function verifyTokenEdge(
  token: string,
  secret: string
): Promise<JwtPayload | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [headerStr, payloadStr, signatureStr] = parts;
    const encoder = new TextEncoder();
    const data = encoder.encode(`${headerStr}.${payloadStr}`);

    // Verify signature
    const keyData = encoder.encode(secret);
    const key = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: { name: "SHA-256" } },
      false,
      ["verify"]
    );

    // Decode signature
    const sigBin = base64urlDecode(signatureStr);
    const sigBuf = new Uint8Array(sigBin.length);
    for (let i = 0; i < sigBin.length; i++) {
      sigBuf[i] = sigBin.charCodeAt(i);
    }

    const isValid = await crypto.subtle.verify("HMAC", key, sigBuf, data);
    if (!isValid) return null;

    // Check expiration
    const payload = decodeToken(token);
    if (!payload) return null;

    if (payload.exp && Date.now() >= payload.exp * 1000) {
      return null; // Token expired
    }

    return payload;
  } catch (error) {
    console.error("JWT verification failed on Edge:", error);
    return null;
  }
}
