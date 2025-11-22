import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

// GET /api/products/[id] - Product Details
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await context.params;
    const numericId = Number(id);

    if (isNaN(numericId)) {
      return new NextResponse("Invalid product id", { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id: numericId },
    });

    if (!product) {
      return new NextResponse("Product not found", { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error in GET /api/products/[id]:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// PUT /api/products/[id] - Product Update (Only Admin)
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const { id } = await context.params;
    const numericId = Number(id);

    if (isNaN(numericId)) {
      return new NextResponse("Invalid product id", { status: 400 });
    }

    const body = await request.json();
    const { name, category, price, stock, lowStockThreshold } = body;

    const data: any = {};

    if (typeof name === "string") data.name = name;
    if (typeof category === "string" || category === null)
      data.category = category;
    if (typeof price === "number") data.price = price;
    if (typeof stock === "number") data.stock = stock;
    if (typeof lowStockThreshold === "number")
      data.lowStockThreshold = lowStockThreshold;

    if (Object.keys(data).length === 0) {
      return new NextResponse("No valid fields to update", {
        status: 400,
      });
    }

    const product = await prisma.product.update({
      where: { id: numericId },
      data,
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error in PUT /api/products/[id]:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// DELETE /api/products/[id] - (Admin Only)
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const { id } = await context.params;
    const numericId = Number(id);

    if (isNaN(numericId)) {
      return new NextResponse("Invalid product id", { status: 400 });
    }

    await prisma.product.delete({
      where: { id: numericId },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error in DELETE /api/products/[id]:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
