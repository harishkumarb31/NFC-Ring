import { requireAuth } from "@/lib/auth";
import { jsonOk, handleApiError } from "@/lib/utils/api";

export async function GET() {
  try {
    const user = await requireAuth();
    return jsonOk(user.ring);
  } catch (error) {
    return handleApiError(error);
  }
}
