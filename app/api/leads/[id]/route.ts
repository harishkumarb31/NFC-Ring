import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { jsonOk, jsonError, handleApiError } from "@/lib/utils/api";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const body = await req.json();
    const status = body.status;
    const validStatuses = ["NEW", "CONTACTED", "QUALIFIED", "CLOSED"];
    if (!validStatuses.includes(status)) {
      return jsonError("Invalid status", 422);
    }

    const lead = await prisma.lead.findUnique({ where: { id }, include: { profile: true } });
    if (!lead || lead.profile.userId !== user.id) {
      return jsonError("Lead not found", 404);
    }

    const updated = await prisma.lead.update({ where: { id }, data: { status } });
    return jsonOk(updated);
  } catch (error) {
    return handleApiError(error);
  }
}
