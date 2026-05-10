import { NextResponse } from "next/server";
import Joi from "joi";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import { generateToken, generateRefreshToken, setAuthCookies } from "@/lib/auth";

const loginSchema = Joi.object({
  identifier: Joi.string().required(),
  password: Joi.string().required()
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { error, value } = loginSchema.validate(body);
    if (error) return NextResponse.json({ error: error.details[0].message }, { status: 400 });

    await connectDB();

    const user = await User.findOne({ $or: [{ email: value.identifier }, { phone: value.identifier }] });
    if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const isValid = await user.verifyPassword(value.password);
    if (!isValid) return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });

    const token = generateToken(user._id.toString(), user.role);
    const refreshToken = generateRefreshToken(user._id.toString());

    user.refreshToken = refreshToken;
    await user.save();

    await setAuthCookies(token, refreshToken);

    return NextResponse.json({ 
      success: true, 
      user: { id: user._id, name: user.name, email: user.email, role: user.role } 
    });

  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
