import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST() {
  const res = new NextResponse(null, { status: 204 });
  const isProd = process.env.NODE_ENV === "production";

  // Clear cookies
  res.cookies.set("access_token", "", {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  res.cookies.set("refresh_token", "", {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  // Hapus refresh token di DB
  try {
    const user = await getCurrentUser();
    if (user) {
      await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: null, refreshTokenExpires: null },
      });
    }
  } catch (e) {
    console.error("Error clearing refresh token:", e);
  }

  return res;
}
