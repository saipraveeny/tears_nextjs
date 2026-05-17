import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Review from "@/lib/models/Review";

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    if (productId) {
      const pid = parseInt(productId);
      const reviews = await Review.find({ productId: pid }).sort({ createdAt: -1 });
      return NextResponse.json({ reviews });
    }

    // Otherwise, aggregate stats for all products
    const reviews = await Review.find({});
    const stats: Record<number, { sum: number; count: number; avgRating: number }> = {};
    
    reviews.forEach((r: any) => {
      if (!stats[r.productId]) {
        stats[r.productId] = { sum: 0, count: 0, avgRating: 0 };
      }
      stats[r.productId].sum += r.rating;
      stats[r.productId].count += 1;
    });

    Object.keys(stats).forEach((pidStr) => {
      const pid = parseInt(pidStr);
      stats[pid].avgRating = parseFloat((stats[pid].sum / stats[pid].count).toFixed(1));
    });

    return NextResponse.json({ stats });
  } catch (error: any) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { productId, user, rating, comment } = body;

    if (!productId || !user || !rating) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newReview = new Review({
      productId: parseInt(productId),
      user,
      rating: parseInt(rating),
      comment: comment || "",
      date: new Date().toISOString().split("T")[0],
    });

    await newReview.save();
    return NextResponse.json({ success: true, review: newReview });
  } catch (error: any) {
    console.error("Error saving review:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
