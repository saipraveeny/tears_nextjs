import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Cart from "@/lib/models/Cart";
import User from "@/lib/models/User";
import { sendEmail } from "@/lib/notify";

export async function GET(req: Request) {
  try {
    // Check authorization key if configured (e.g. for Vercel Cron protection)
    const authHeader = req.headers.get("authorization");
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Carts updated more than 30 minutes ago
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

    const abandonedCarts = await Cart.find({
      items: { $exists: true, $not: { $size: 0 } },
      updatedAt: { $lt: thirtyMinutesAgo },
      $or: [
        { abandonedEmailSent: { $exists: false } },
        { abandonedEmailSent: false }
      ]
    });

    const results = [];

    const host = req.headers.get("host") || "tears.co.in";
    const protocol = req.headers.get("x-forwarded-proto") || "https";
    const baseUrl = `${protocol}://${host}`;
    const cartLink = `${baseUrl}?cart=open`;

    for (const cart of abandonedCarts) {
      try {
        const user = await User.findById(cart.userId);
        if (!user || !user.email) {
          continue;
        }

        // Send abandonment email
        await sendEmail(
          null,
          "ABANDONED_CART",
          user,
          cart.items,
          "Did you leave something in your cart? 🔥",
          null,
          null,
          { cartLink }
        );

        // Update database flags
        cart.abandonedEmailSent = true;
        cart.abandonedEmailSentAt = new Date();
        await cart.save();

        results.push({
          userId: cart.userId,
          email: user.email,
          status: "sent"
        });
      } catch (err: any) {
        console.error(`Failed to process abandoned cart for user ${cart.userId}:`, err);
        results.push({
          userId: cart.userId,
          status: "failed",
          error: err.message
        });
      }
    }

    return NextResponse.json({
      success: true,
      processedCount: abandonedCarts.length,
      results
    });
  } catch (err: any) {
    console.error("Cron handler error:", err);
    return NextResponse.json({ error: "Internal Server Error", details: err.message }, { status: 500 });
  }
}
