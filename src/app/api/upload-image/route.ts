import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image files (JPEG, PNG, WebP) are allowed" }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "Image size must be 10MB or less" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = path.extname(file.name) || ".webp";
    const cleanExt = [".jpg", ".jpeg", ".png", ".webp", ".svg"].includes(ext.toLowerCase())
      ? ext.toLowerCase()
      : ".webp";
    const filename = `devotional-${Date.now()}-${crypto.randomBytes(4).toString("hex")}${cleanExt}`;

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    const filepath = path.join(uploadDir, filename);

    await writeFile(filepath, buffer);

    const publicUrl = `/uploads/${filename}`;
    return NextResponse.json({ success: true, url: publicUrl });
  } catch (err: any) {
    console.error("Upload handler error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to upload image" },
      { status: 500 }
    );
  }
}
