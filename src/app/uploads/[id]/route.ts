import { NextRequest } from "next/server";
import { db } from "@/lib/backend/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const dataUrl = db.uploadedImages[id];
  if (!dataUrl) {
    return new Response(JSON.stringify({ status: false, message: "Image not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  const matches = dataUrl.match(/^data:(.+);base64,(.+)$/);
  if (!matches) {
    return new Response(JSON.stringify({ status: false, message: "Invalid image data" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const mimeType = matches[1];
  const buffer = Buffer.from(matches[2], "base64");

  return new Response(buffer, {
    status: 200,
    headers: {
      "Content-Type": mimeType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
