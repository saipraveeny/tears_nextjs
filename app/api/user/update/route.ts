import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { name, phone, addresses } = await req.json();

    if (name) user.name = name;
    if (phone) user.phone = phone;
    
    if (addresses && Array.isArray(addresses)) {
      const processedAddresses = addresses.map((addr, index) => {
        if (index === 0 && !addr.tag) {
          addr.tag = "Home";
        }
        if (index === 0 && addresses.every(a => !a.isDefault)) {
          addr.isDefault = true;
        }
        return addr;
      });
      user.addresses = processedAddresses;
    }

    await user.save();

    return NextResponse.json({ 
      success: true, 
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        addresses: user.addresses,
        role: user.role
      }
    });
  } catch (err: any) {
    console.error("Update profile error:", err);
    if (err.code === 11000) {
      return NextResponse.json({ error: "Phone number already in use" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  return POST(req);
}
