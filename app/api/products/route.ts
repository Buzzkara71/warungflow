import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

// GET /api/products - Cashier and Admin
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// POST /api/products - Admin Only
export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const body = await req.json();
    const { name, category, price, stock, lowStockThreshold } = body;

    if (!name || typeof price !== "number" || typeof stock !== "number") {
      return new NextResponse("Invalid data", { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        name,
        category,
        price,
        stock,
        lowStockThreshold: lowStockThreshold ?? 0,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
