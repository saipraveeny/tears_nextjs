import { NextResponse } from "next/server";
import Joi from "joi";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";

const otpSchema = Joi.object({
  phone: Joi.string().required(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { error, value } = otpSchema.validate(body);
    if (error) return NextResponse.json({ error: error.details[0].message }, { status: 400 });

    await connectDB();

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    let user = await User.findOne({ phone: value.phone });
    if (!user) {
      user = new User({
        email: `phone_${value.phone}@tears.local`,
        phone: value.phone,
        authProvider: 'phone'
      });
    }

    user.otp = { code, expiresAt };
    await user.save();

    console.log(`[Twilio Mock] Sending OTP ${code} to ${value.phone}`);

    return NextResponse.json({ 
      success: true, 
      message: "OTP sent successfully",
      mockCode: process.env.TWILIO_SID ? undefined : code,
    });
  } catch (err) {
    console.error("Send OTP error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
