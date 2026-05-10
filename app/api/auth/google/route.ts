import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import { generateToken, generateRefreshToken, setAuthCookies } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { credential } = await req.json();
    if (!credential) return NextResponse.json({ error: "No credential provided" }, { status: 400 });

    const base64Url = credential.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(Buffer.from(base64, 'base64').toString().split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const payload = JSON.parse(jsonPayload);
    const { email, name } = payload;
    
    await connectDB();
    
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        email,
        name,
        authProvider: 'google',
      });
    } else if (user.authProvider !== 'google') {
      user.authProvider = 'google';
    }

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
    console.error("Google Auth error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
