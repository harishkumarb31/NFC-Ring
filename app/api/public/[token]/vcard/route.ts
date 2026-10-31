import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { buildVCard } from "@/lib/utils/vcard";
import { trackEvent, normalizeSource } from "@/lib/analytics";

export async function GET(req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const { searchParams } = new URL(req.url);
  const source = normalizeSource(searchParams.get("source"));

  const ring = await prisma.ring.findUnique({
    where: { token },
    include: { user: { include: { profile: true } } },
  });

  if (!ring || !ring.user.profile || ring.status !== "ACTIVE") {
    return NextResponse.json({ success: false, error: "Profile not found" }, { status: 404 });
  }

  const p = ring.user.profile;
  const vcard = buildVCard({
    name: p.name,
    company: p.company,
    designation: p.designation,
    phone: p.phone,
    email: p.email,
    website: p.website,
  });

  await trackEvent(p.id, "SAVE", source);

  return new NextResponse(vcard, {
    status: 200,
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": `attachment; filename="${p.name.replace(/\s+/g, "_")}.vcf"`,
    },
  });
}
