import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import Joi from "joi";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import { generateToken, generateRefreshToken, setAuthCookies } from "@/lib/auth";

const signupSchema = Joi.object({
  name: Joi.string().required(),
  identifier: Joi.string().required(),
  password: Joi.string().min(8).required()
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { error, value } = signupSchema.validate(body);
    if (error) return NextResponse.json({ error: error.details[0].message }, { status: 400 });

    await connectDB();

    const isEmail = value.identifier.includes('@');
    const userEmail = isEmail ? value.identifier : `phone_${value.identifier}@tears.local`;
    const userPhone = isEmail ? undefined : value.identifier.replace(/\D/g, '');

    const existingUser = await User.findOne({ $or: [{ email: userEmail }, ...(userPhone ? [{ phone: userPhone }] : []) ] });

    if (existingUser) {
      if (!existingUser.passwordHash) {
        const salt = await bcrypt.genSalt(12);
        existingUser.passwordHash = await bcrypt.hash(value.password, salt);
        if (value.name && !existingUser.name) existingUser.name = value.name;
        
        const token = generateToken(existingUser._id.toString(), existingUser.role);
        const refreshToken = generateRefreshToken(existingUser._id.toString());
        existingUser.refreshToken = refreshToken;
        await existingUser.save();

        await setAuthCookies(token, refreshToken);
        return NextResponse.json({ success: true, user: { id: existingUser._id, name: existingUser.name, email: existingUser.email, role: existingUser.role } });
      }
      return NextResponse.json({ error: "Account already exists. Please sign in instead." }, { status: 400 });
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(value.password, salt);

    const newUser = await User.create({
      name: value.name,
      email: userEmail,
      phone: userPhone,
      passwordHash,
      authProvider: isEmail ? 'email' : 'phone'
    });

    const token = generateToken(newUser._id.toString(), newUser.role);
    const refreshToken = generateRefreshToken(newUser._id.toString());
    newUser.refreshToken = refreshToken;
    await newUser.save();

    await setAuthCookies(token, refreshToken);

    return NextResponse.json({ 
      success: true, 
      user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role } 
    }, { status: 201 });

  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
