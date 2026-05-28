import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const target = new URL("/checkout/result", url.origin);

  for (const [key, value] of url.searchParams.entries()) {
    target.searchParams.append(key, value);
  }

  return NextResponse.redirect(target);
}
