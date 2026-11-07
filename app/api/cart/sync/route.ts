import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Cart from "@/lib/models/Cart";
import { ALL_PRODUCTS } from "@/utils/productData";

function resolveItemPrice(item: any): number {
  const raw = item.price ?? item.amount;
  const parsed =
    typeof raw === "string"
      ? parseFloat(raw.replace(/[^\d.]/g, ""))
      : Number(raw);
  if (!Number.isNaN(parsed) && parsed > 0) return parsed;

  const catalogMatch = ALL_PRODUCTS.find(
    (cp) =>
      String(cp.id) === String(item.productId ?? item.id) ||
      (item.name && cp.name.toLowerCase() === String(item.name).toLowerCase()),
  );
  if (catalogMatch?.price) {
    const catNum = parseFloat(String(catalogMatch.price).replace(/[^\d.]/g, ""));
    if (!Number.isNaN(catNum) && catNum > 0) return catNum;
  }
  return 0;
}

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
      const price = resolveItemPrice(item);
      const qty = item.quantity || item.qty || 1;
      return sum + price * qty;
    }, 0);

    let cart = await Cart.findOne({ userId: user._id });
    if (!cart) {
      cart = new Cart({ userId: user._id });
    }

    const mappedItems = items.map((t: any) => ({
      productId: t.productId || t.id,
      name: t.name,
      size: t.size,
      quantity: t.quantity || t.qty || 1,
      price: resolveItemPrice(t),
      image: t.image,
    }));

    cart.items = mappedItems;
    cart.totalAmount = totalAmount;
    cart.abandonedEmailSent = false;
    cart.abandonedEmailSentAt = undefined;
    await cart.save();
    
    return NextResponse.json({ success: true, items: cart.items });
  } catch (err) {
    console.error("Cart POST error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
