import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

// string date (YYYY-MM-DD)
function getDateRange(dateStr?: string) {
  const now = new Date();
  const target = dateStr ? new Date(dateStr) : now;

  const start = new Date(target);
  start.setHours(0, 0, 0, 0);

  const end = new Date(target);
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

// GET /api/sales?date=YYYY-MM-DD 
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
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
    console.error("Error fetching sales:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// POST /api/sales
export async function POST(req: Request) {
  try{
    const body = await req.json();
    const { items } = body as {
      items: { productId: number; quantity: number }[];
    };

    if (!items || !Array.isArray(items) || items.length === 0) {
      return new NextResponse("Items tidak boleh kosong", { status: 400 });
    }
    for (const item of items) {
      if (
        !item.productId ||
        typeof item.productId !== "number" ||
        !item.quantity ||
        typeof item.quantity !== "number" ||
        item.quantity <= 0
      ) {
        return new NextResponse(
          "Setiap item harus punya productId (number) dan quantity > 0",
          { status: 400 }
        );
      }
    }

    // GET ALL related product
    const productIds = items.map((i) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    // inventory stock check
    const productMap = new Map(products.map((p) => [p.id, p]));
    for (const item of items) {
      const product = productMap.get(item.productId);
      if (!product) {
        return new NextResponse(
          `Produk dengan ID ${item.productId} tidak ditemukan`,
          { status: 400 }
        );
      }
      if (item.quantity > product.stock) {
        return new NextResponse(
          `Stok tidak cukup untuk produk "${product.name}". Stok: ${product.stock}, diminta: ${item.quantity}`,
          { status: 400 }
        );
      }
    }
    // Get user from Cookies (login required)
    const user = await getCurrentUser();
    if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
}
    const result = await prisma.$transaction(async (tx) => {
     
       // count totalPrice
      let totalPrice = 0;
      for (const item of items) {
        const product = productMap.get(item.productId)!;
        totalPrice += product.price * item.quantity;
      }

      // Sale Record
      const sale = await tx.sale.create({
        data: {
          userId: user.id,
          totalPrice,
        },
      });

      // SaleItem + Stock Update
      for (const item of items) {
        const product = productMap.get(item.productId)!;

        // buat item
        await tx.saleItem.create({
          data: {
            saleId: sale.id,
            productId: product.id,
            quantity: item.quantity,
            price: product.price, 
          },
        });

        // Stock update (decrease)
        await tx.product.update({
          where: { id: product.id },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      // Get all item and product
      const fullSale = await tx.sale.findUnique({
        where: { id: sale.id },
        include: {
          items: {
            include: { product: true },
          },
          user: true,
        },
      });

      return fullSale;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error creating sale:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
