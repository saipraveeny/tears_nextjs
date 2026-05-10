import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { connectDB } from "./db";
import User, { IUser } from "./models/User";
import { UserRole } from "./constants";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_development_secret_only";

export interface TokenPayload {
  userId: string;
  role: UserRole;
}

export const generateToken = (userId: string, role: UserRole): string => {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: "15m" });
};

export const generateRefreshToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
};

export const verifyToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (err) {
    return null;
  }
};

export async function setAuthCookies(token: string, refreshToken: string) {
  const cookieStore = await cookies();
  const isProd = process.env.NODE_ENV === "production";

  cookieStore.set("token", token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    maxAge: 15 * 60,
    path: "/",
  });

  cookieStore.set("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60,
    path: "/",
  });
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();
  const isProd = process.env.NODE_ENV === "production";

  cookieStore.set("token", "", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    maxAge: 0,
    path: "/",
  });

  cookieStore.set("refreshToken", "", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    maxAge: 0,
    path: "/",
  });
}

export async function getAuthenticatedUser(): Promise<IUser | null> {
  const cookieStore = await cookies();
  let token = cookieStore.get("token")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!token && !refreshToken) return null;

  await connectDB();

  let decoded = token ? verifyToken(token) : null;

  // Refresh token logic
  if (!decoded && refreshToken) {
    const refreshDecoded = verifyToken(refreshToken);
    if (refreshDecoded) {
      const user = await User.findById(refreshDecoded.userId);
      if (user && user.refreshToken === refreshToken) {
        token = generateToken(user._id.toString(), user.role);
        await setAuthCookies(token, refreshToken);
        decoded = { userId: user._id.toString(), role: user.role };
      }
    }
  }

  if (!decoded) return null;

  try {
    const user = await User.findById(decoded.userId).select("-passwordHash -refreshToken");
    return user;
  } catch (err) {
    console.error("[Auth] User lookup failed:", err);
    return null;
  }
}
