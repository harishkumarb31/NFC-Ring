import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  const ring = await prisma.ring.findUnique({ where: { token } });
  if (!ring) {
    return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
  }

  const host = req.headers.get("host");
  const protocol = req.headers.get("x-forwarded-proto") || "http";
  const baseUrl = host ? `${protocol}://${host}` : process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const url = `${baseUrl}/u/${token}?source=qr`;

  const buffer = await QRCode.toBuffer(url, {
    width: 480,
    margin: 2,
    color: { dark: "#0a0a0b", light: "#f2f1edff" },
  });

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
