import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const VALID_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".avif"];

export async function GET() {
  try {
    const dirPath = path.join(process.cwd(), "public", "assets", "collabs");

    if (!fs.existsSync(dirPath)) {
      return NextResponse.json({ collabs: [] });
    }

    const files = fs.readdirSync(dirPath);
    const collabs = files
      .filter((file) => {
        const ext = path.extname(file).toLowerCase();
        return VALID_EXTENSIONS.includes(ext);
      })
      .map((file) => ({
        name: path.basename(file, path.extname(file)),
        src: `/assets/collabs/${file}`
      }));

    return NextResponse.json({ success: true, collabs });
  } catch (error: any) {
    console.error("Error reading collabs:", error);
    return NextResponse.json({ success: false, collabs: [], error: error.message });
  }
}
