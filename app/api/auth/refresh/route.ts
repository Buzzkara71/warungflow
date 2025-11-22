import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import {
  signAccessToken,
  verifyRefreshToken,
} from "@/lib/auth";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const refresh = cookieStore.get("refresh_token")?.value;

    if (!refresh) {
      return new NextResponse("No refresh token", { status: 401 });
    }

    const payload = verifyRefreshToken(refresh);
    if (!payload) {
      return new NextResponse("Invalid refresh token", { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (
      !user ||
      !user.refreshToken ||
      user.refreshToken !== refresh ||
      !user.refreshTokenExpires ||
      user.refreshTokenExpires < new Date()
    ) {
      return new NextResponse("Refresh token tidak valid/expired", {
        status: 401,
      });
    }

    const newAccessToken = signAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const res = NextResponse.json(
      { message: "Access token refreshed" },
      { status: 200 }
    );

    const isProd = process.env.NODE_ENV === "production";

    res.cookies.set("access_token", newAccessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: 15 * 60,
    });

    return res;
  } catch (error) {
    console.error("Error in refresh:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
