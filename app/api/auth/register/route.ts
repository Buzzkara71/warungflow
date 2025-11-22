import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();

    if (!rawBody) {
      return new NextResponse("Request body kosong", { status: 400 });
    }

    let body: any;
    try {
      body = JSON.parse(rawBody);
    } catch {
      return new NextResponse("Body harus JSON valid", { status: 400 });
    }

    const { name, email, password, role } = body as {
      name: string;
      email: string;
      password: string;
      role?: string;
    };

    if (!name || !email || !password) {
      return new NextResponse("Name, email, dan password wajib diisi", {
        status: 400,
      });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return new NextResponse("Email sudah terdaftar", { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const userRole =
      role === "cashier" || role === "admin" ? role : "admin";

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: userRole,
      },
    });

    return NextResponse.json(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in register:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
