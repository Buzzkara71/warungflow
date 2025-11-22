import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

type CartItemInput = {
  productId: number;
  quantity: number;
};

type ProductForSale = {
  id: number;
  name: string;
  price: number;
  stock: number;
  lowStockThreshold: number;
};

function getDateRange(dateStr?: string) {
  const base = dateStr ? new Date(dateStr) : new Date();
  const start = new Date(base);
  start.setHours(0, 0, 0, 0);
  const end = new Date(base);
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

// GET /api/sales?date=YYYY-MM-DD
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const dateStr = searchParams.get("date") ?? undefined;
    const { start, end } = getDateRange(dateStr);

    const sales = await prisma.sale.findMany({
      where: {
        createdAt: {
          gte: start,
          lte: end,
        },
      },
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json(sales);
  } catch (error) {
    console.error("Error in GET /api/sales:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// POST /api/sales
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { items } = body as { items: CartItemInput[] };

    if (!Array.isArray(items) || items.length === 0) {
      return new NextResponse("Items array is required", { status: 400 });
    }


    const productIds: number[] = Array.from(
      new Set(
        items
          .map((item: CartItemInput) => item.productId)
          .filter((id: number) => typeof id === "number")
      )
    );

    if (productIds.length === 0) {
      return new NextResponse("No valid productId in items", {
        status: 400,
      });
    }
    const products: ProductForSale[] = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: {
        id: true,
        name: true,
        price: true,
        stock: true,
        lowStockThreshold: true,
      },
    });

    const productMap = new Map<number, ProductForSale>(
      products.map((p: ProductForSale) => [p.id, p])
    );

    for (const item of items as CartItemInput[]) {
      const product = productMap.get(item.productId);
      if (!product) {
        return new NextResponse(
          `Produk dengan ID ${item.productId} tidak ditemukan`,
          { status: 400 }
        );
      }

      if (item.quantity <= 0) {
        return new NextResponse("Quantity harus lebih dari 0", {
          status: 400,
        });
      }

      if (item.quantity > product.stock) {
        return new NextResponse(
          `Stok tidak cukup untuk produk "${product.name}". Stok: ${product.stock}, diminta: ${item.quantity}`,
          { status: 400 }
        );
      }
    }

    // Count TOTAL
    const totalPrice = (items as CartItemInput[]).reduce(
      (total: number, item: CartItemInput) => {
        const product = productMap.get(item.productId);
        if (!product) return total;
        return total + product.price * item.quantity;
      },
      0
    );

    // Save sale + items + stock update
    const sale = await prisma.$transaction(async (tx) => {
      const createdSale = await tx.sale.create({
        data: {
          userId: user.id,
          totalPrice,
          items: {
            create: (items as CartItemInput[]).map(
              (item: CartItemInput) => {
                const product = productMap.get(item.productId)!;
                return {
                  productId: product.id,
                  quantity: item.quantity,
                  price: product.price,
                };
              }
            ),
          },
        },
        include: {
          items: {
            include: { product: true },
          },
        },
      });

      // update stock
      for (const item of items as CartItemInput[]) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      return createdSale;
    });

    return NextResponse.json(sale, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/sales:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
