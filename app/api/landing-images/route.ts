import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const VALID_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".avif", ".PNG", ".JPG", ".JPEG", ".WEBP"];

export async function GET() {
  try {
    const dirPath = path.join(process.cwd(), "public", "assets", "landing page");

    // If the directory does not exist, return the default set of images as fallback
    if (!fs.existsSync(dirPath)) {
      return NextResponse.json({ 
        images: [
          "/assets/landing page/NDN04145.jpg",
          "/assets/landing page/NDN04235.jpg",
          "/assets/landing page/NDN04252.jpg"
        ] 
      });
    }

    const files = fs.readdirSync(dirPath);
    const images = files
      .filter((file) => {
        const ext = path.extname(file).toLowerCase();
        return VALID_EXTENSIONS.includes(ext);
      })
      .map((file) => `/assets/landing page/${file}`);

    // If the folder is empty, fallback to the default high-res set
    if (images.length === 0) {
      return NextResponse.json({
        images: [
          "/assets/landing page/NDN04145.jpg",
          "/assets/landing page/NDN04235.jpg",
          "/assets/landing page/NDN04252.jpg"
        ]
      });
    }

    return NextResponse.json({ images });
  } catch (error) {
    console.error("Error reading landing page images dynamically:", error);
    return NextResponse.json({ 
      images: [
        "/assets/landing page/NDN04145.jpg",
        "/assets/landing page/NDN04235.jpg",
        "/assets/landing page/NDN04252.jpg"
      ] 
    });
  }
}
