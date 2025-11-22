import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

function getDateRange(dateStr?: string) {
  const base = dateStr ? new Date(dateStr) : new Date();
  const start = new Date(base);
  start.setHours(0, 0, 0, 0);
  const end = new Date(base);
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const dateStr = searchParams.get("date") ?? undefined;
    const { start, end } = getDateRange(dateStr);

    // Total today Sale
    const [salesAgg, salesCount, lowStockCandidates] = await Promise.all([
      prisma.sale.aggregate({
        _sum: { totalPrice: true },
        where: {
          createdAt: {
            gte: start,
            lte: end,
          },
        },
      }),
      prisma.sale.count({
        where: {
          createdAt: {
            gte: start,
            lte: end,
          },
        },
      }),
      prisma.product.findMany({
        where: {
          lowStockThreshold: {
            gt: 0,
          },
        },
        orderBy: { stock: "asc" },
      }),
    ]);

    const totalSalesAmount = salesAgg._sum.totalPrice ?? 0;

    // Product Filter <= threshold 
    const lowStockProducts = lowStockCandidates
      .filter((p) => p.stock <= p.lowStockThreshold)
      .map((p) => ({
        id: p.id,
        name: p.name,
        stock: p.stock,
        lowStockThreshold: p.lowStockThreshold,
      }));

    return NextResponse.json({
      date: start.toISOString().slice(0, 10),
      total_sales_amount: totalSalesAmount,
      total_transactions: salesCount,
      low_stock_products: lowStockProducts,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
