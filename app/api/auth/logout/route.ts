import { NextResponse } from "next/server";
import { clearAuthCookies } from "@/lib/auth";

export async function POST() {
  try {
    await clearAuthCookies();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Logout error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
