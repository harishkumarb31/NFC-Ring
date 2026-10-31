import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { jsonOk, jsonError, handleApiError } from "@/lib/utils/api";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await req.json();
    if (!["ACTIVE", "INACTIVE"].includes(body.status)) {
      return jsonError("Invalid status", 422);
    }
    const ring = await prisma.ring.update({ where: { id }, data: { status: body.status } });
    return jsonOk(ring);
  } catch (error) {
    return handleApiError(error);
  }
}
