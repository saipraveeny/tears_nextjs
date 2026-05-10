import { NextResponse } from "next/server";
import Joi from "joi";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import { generateToken, generateRefreshToken, setAuthCookies } from "@/lib/auth";

const verifySchema = Joi.object({
  phone: Joi.string().required(),
  code: Joi.string().length(6).required()
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { error, value } = verifySchema.validate(body);
    if (error) return NextResponse.json({ error: error.details[0].message }, { status: 400 });

    await connectDB();

    const user = await User.findOne({ phone: value.phone });
    if (!user || !user.otp || !user.otp.code) {
      return NextResponse.json({ error: "No OTP requested for this number" }, { status: 400 });
    }

    if (user.otp.expiresAt < new Date()) {
      return NextResponse.json({ error: "OTP expired" }, { status: 400 });
    }

    if (user.otp.code !== value.code.trim()) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    user.otp = undefined;
    
    const token = generateToken(user._id.toString(), user.role);
    const refreshToken = generateRefreshToken(user._id.toString());
    user.refreshToken = refreshToken;
    await user.save();
    
    await setAuthCookies(token, refreshToken);
    
    return NextResponse.json({ success: true, user: { id: user._id, name: user.name, phone: user.phone, role: user.role } });
    
  } catch (err) {
    console.error("Verify OTP error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
