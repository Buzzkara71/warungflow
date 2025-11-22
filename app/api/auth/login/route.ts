import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { signAccessToken, signRefreshToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body as { email: string; password: string };

    if (!email || !password) {
      return new NextResponse("Email dan password wajib diisi", {
        status: 400,
      });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash) {
      return new NextResponse("Email atau password salah", { status: 400 });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return new NextResponse("Email atau password salah", { status: 400 });
    }

    const accessToken = signAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = signRefreshToken({ userId: user.id });

    // Simpan refresh token di DB (plaintext; di production sebaiknya di-hash)
    const refreshExpires = new Date();
    refreshExpires.setDate(refreshExpires.getDate() + 7);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        refreshToken,
        refreshTokenExpires: refreshExpires,
      },
    });

    const res = NextResponse.json(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      { status: 200 }
    );

    const isProd = process.env.NODE_ENV === "production";

    res.cookies.set("access_token", accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: 15 * 60, // 15 menit
    });

    res.cookies.set("refresh_token", refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 hari
    });

    return res;
  } catch (error) {
    console.error("Error in login:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
