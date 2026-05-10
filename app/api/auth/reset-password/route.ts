import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import Joi from "joi";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import { generateToken, generateRefreshToken, setAuthCookies } from "@/lib/auth";

const schema = Joi.object({
  email: Joi.string().email().required(),
  code: Joi.string().length(6).required(),
  newPassword: Joi.string().min(8).required(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { error, value } = schema.validate(body);
    if (error) return NextResponse.json({ error: error.details[0].message }, { status: 400 });

    const code = value.code.trim();
    await connectDB();

    const user = await User.findOne({ email: value.email });
    if (!user) return NextResponse.json({ error: "Invalid email or code" }, { status: 400 });

    if (!user.otp || !user.otp.code) {
      return NextResponse.json({ error: "No reset code requested. Please request a new one." }, { status: 400 });
    }

    if (user.otp.expiresAt < new Date()) {
      return NextResponse.json({ error: "Reset code has expired. Please request a new one." }, { status: 400 });
    }

    if (user.otp.code !== code) {
      return NextResponse.json({ error: "Invalid reset code" }, { status: 400 });
    }

    const salt = await bcrypt.genSalt(12);
    user.passwordHash = await bcrypt.hash(value.newPassword, salt);
    user.otp = undefined;
    
    const token = generateToken(user._id.toString(), user.role);
    const refreshToken = generateRefreshToken(user._id.toString());
    user.refreshToken = refreshToken;
    await user.save();

    await setAuthCookies(token, refreshToken);

    return NextResponse.json({
      success: true,
      message: "Password reset successfully",
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("Reset password error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
