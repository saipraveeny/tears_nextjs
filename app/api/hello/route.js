import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";

export async function GET() {
  logger.info("Health", "Health check endpoint called");
  return NextResponse.json({
    status: "ok",
    message: "TEARS Payment API is running",
    timestamp: new Date().toISOString(),
  });
}
