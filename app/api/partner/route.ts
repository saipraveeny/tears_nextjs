import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/notify";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { businessName, contactName, contactNumber, email, message, bestTime } = body;

    if (!businessName || !contactName || !contactNumber || !email || !message) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    await sendEmail(null, "PARTNER_INQUIRY", { email, name: contactName }, [], null, null, null, {
        businessName,
        contactName,
        contactNumber,
        email,
        message,
        bestTime
    });

    return NextResponse.json({ message: "Inquiry received successfully. Check your email for confirmation." });
  } catch (error) {
    console.error("Partner inquiry error:", error);
    return NextResponse.json({ message: "Failed to process inquiry." }, { status: 500 });
  }
}
