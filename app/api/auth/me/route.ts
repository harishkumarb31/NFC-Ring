import { getCurrentUser } from "@/lib/auth";
import { jsonOk, jsonError, handleApiError } from "@/lib/utils/api";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return jsonError("Not authenticated", 401);
    return jsonOk({
      id: user.id,
      email: user.email,
      role: user.role,
      profile: user.profile,
      ring: user.ring,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
