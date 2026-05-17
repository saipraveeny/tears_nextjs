import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const VALID_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".avif"];

export async function GET(
  request: Request,
  { params }: { params: Promise<{ folder: string }> }
) {
  try {
    const { folder } = await params;
    
    // Sanitize folder name to prevent path traversal
    const safeFolderName = folder.replace(/[^a-zA-Z0-9_-]/g, "");
    const dirPath = path.join(process.cwd(), "public", "assets", "products", safeFolderName);

    if (!fs.existsSync(dirPath)) {
      return NextResponse.json({ images: [] });
    }

    const files = fs.readdirSync(dirPath);
    const images = files
      .filter((file) => {
        const ext = path.extname(file).toLowerCase();
        return VALID_EXTENSIONS.includes(ext);
      })
      .map((file) => `/assets/products/${safeFolderName}/${file}`);

    return NextResponse.json({ images });
  } catch (error) {
    console.error("Error reading product images:", error);
    return NextResponse.json({ images: [] });
  }
}
