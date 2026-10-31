import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { jsonOk, handleApiError } from "@/lib/utils/api";

export async function GET() {
  try {
    await requireAdmin();
    const users = await prisma.user.findMany({
      include: { profile: true, ring: true },
      orderBy: { createdAt: "desc" },
    });
    return jsonOk(
      users.map((u) => ({
        id: u.id,
        email: u.email,
        role: u.role,
        createdAt: u.createdAt,
        name: u.profile?.name ?? "—",
        ringId: u.ring?.id ?? null,
        ringStatus: u.ring?.status ?? null,
        ringToken: u.ring?.token ?? null,
      }))
    );
  } catch (error) {
    return handleApiError(error);
  }
}
