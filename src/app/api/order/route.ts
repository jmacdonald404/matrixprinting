import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma" // we'll create this next

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const {
      email,
      garmentId,
      designJson,
      previewUrl,
      quantities, // { "XS": 5, "M": 10, ... }
    } = body

    if (!email || !designJson || !garmentId || !quantities) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create Design record
    const design = await prisma.design.create({
      data: {
        canvasJson: designJson,
        previewUrl: previewUrl ?? "",
      },
    })

    // Create Order record
    const order = await prisma.order.create({
      data: {
        customer: "Customer", // could be improved later
        email,
        totalQuote: 0, // for now, set manually or add quote logic later
        designId: design.id,
        items: {
          create: Object.entries(quantities).map(([size, qty]) => ({
            garmentId,
            color: "White", // you can collect this later
            size,
            quantity: Number(qty),
            priceEach: 10.0, // placeholder — you can calculate this later
          })),
        },
      },
      include: {
        items: true,
      },
    })

    return NextResponse.json({ success: true, orderId: order.id }, { status: 201 })
  } catch (err) {
    console.error("Order submission error:", err)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
