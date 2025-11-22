import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { prisma } from "./db";

const ACCESS_SECRET =
  process.env.JWT_ACCESS_SECRET || "dev-access-secret";
const REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || "dev-refresh-secret";

export type JwtAccessPayload = {
  userId: number;
  email: string;
  role: string;
};

export type JwtRefreshPayload = {
  userId: number;
};

export function signAccessToken(payload: JwtAccessPayload) {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: "15m" });
}

export function signRefreshToken(payload: JwtRefreshPayload) {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: "7d" });
}

export function verifyAccessToken(token: string): JwtAccessPayload | null {
  try {
    return jwt.verify(token, ACCESS_SECRET) as JwtAccessPayload;
  } catch {
    return null;
  }
}

export function verifyRefreshToken(token: string): JwtRefreshPayload | null {
  try {
    return jwt.verify(token, REFRESH_SECRET) as JwtRefreshPayload;
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  const cookieStore = await cookies(); // Next 15: cookies() async
  const token = cookieStore.get("access_token")?.value;
  if (!token) return null;

  const payload = verifyAccessToken(token);
  if (!payload) return null;

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
  });

  return user;
}

// Helper role check (admin only)
export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") return null;
  return user;
}
