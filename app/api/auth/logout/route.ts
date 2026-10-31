import { clearSessionCookie } from "@/lib/auth";
import { jsonOk, handleApiError } from "@/lib/utils/api";

export async function POST() {
  try {
    await clearSessionCookie();
    return jsonOk({ loggedOut: true });
  } catch (error) {
    return handleApiError(error);
  }
}
