// app/api/upload-image/route.js
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

export const runtime = "nodejs"; // ensure Node runtime, not Edge

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    const body = await req.json();
    const { image, folder = "planpal" } = body;

    if (!image) {
      return NextResponse.json(
        { error: "No image provided" },
        { status: 400 }
      );
    }

    const result = await cloudinary.uploader.upload(image, {
      folder,
      transformation: [
        { width: 1600, height: 1600, crop: "limit" },
        { quality: "auto", fetch_format: "auto" },
      ],
    });

    return NextResponse.json({ url: result.secure_url });
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    // include the Cloudinary error message in the response body for easier debugging
    const message = err?.message || "Upload failed";
    return NextResponse.json(
      { error: message, details: err },
      { status: 500 }
    );
  }
}
