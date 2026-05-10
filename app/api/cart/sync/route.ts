import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Cart from "@/lib/models/Cart";

export async function GET() {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    
    let cart = await Cart.findOne({ userId: user._id });
    if (!cart) cart = await Cart.create({ userId: user._id, items: [], totalAmount: 0 });
    
    return NextResponse.json({ success: true, items: cart.items });
  } catch (err) {
    console.error("Cart GET error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    
    const { items } = await req.json();
    if (!items || !Array.isArray(items)) {
      return NextResponse.json({ error: "Items array required" }, { status: 400 });
    }
    
    const totalAmount = items.reduce((sum: number, item: any) => {
      const price = typeof item.price === "string" 
        ? parseFloat(item.price.replace(/[^\d.]/g, "")) 
        : Number(item.price);
      return sum + (price * item.qty);
    }, 0);

    let cart = await Cart.findOne({ userId: user._id });
    if (!cart) {
      cart = new Cart({ userId: user._id });
    }
    
    const mappedItems = items.map((t: any) => ({
      productId: t.id,
      name: t.name,
      size: t.size,
      quantity: t.qty,
      price: typeof t.price === "string" 
        ? parseFloat(t.price.replace(/[^\d.]/g, "")) 
        : Number(t.price),
      image: t.image
    }));

    cart.items = mappedItems;
    cart.totalAmount = totalAmount;
    await cart.save();
    
    return NextResponse.json({ success: true, items: cart.items });
  } catch (err) {
    console.error("Cart POST error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
