import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { jsonOk, handleApiError } from "@/lib/utils/api";

export async function POST() {
  try {
    const user = await requireAuth();
    const ring = await prisma.ring.update({
      where: { userId: user.id },
      data: { status: "ACTIVE" },
    });
    return jsonOk(ring);
  } catch (error) {
    return handleApiError(error);
  }
}
