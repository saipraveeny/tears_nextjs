import { NextResponse } from "next/server";
import Joi from "joi";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import { sendEmail } from "@/lib/notify";

const schema = Joi.object({
  email: Joi.string().email().required(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { error, value } = schema.validate(body);
    if (error) return NextResponse.json({ error: error.details[0].message }, { status: 400 });

    await connectDB();

    const user = await User.findOne({ email: value.email });
    if (!user) {
      return NextResponse.json({
        success: true,
        message: "If an account exists with this email, a reset code has been sent.",
      });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    user.otp = { code, expiresAt };
    await user.save();

    const emailSent = await sendEmail(code, "RESET_PASSWORD", { email: user.email, name: user.name });

    return NextResponse.json({
      success: true,
      message: "If an account exists with this email, a reset code has been sent.",
      ...(!emailSent && { devCode: code }),
    });
  } catch (err) {
    console.error("Forgot password error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
