import { NextResponse } from "next/server";

export function jsonOk<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

export function handleApiError(error: unknown) {
  if (error instanceof Error) {
    if (error.message === "UNAUTHORIZED") return jsonError("Please log in to continue", 401);
    if (error.message === "FORBIDDEN") return jsonError("You do not have access to this resource", 403);
    if (error.message === "TOO_MANY_REQUESTS") return jsonError("Too many requests. Please slow down and try again later.", 429);
  }
  if (typeof error === "object" && error !== null && "code" in error) {
    // Prisma Unique Constraint Violation
    if (error.code === "P2002") {
      return jsonError("A record with this information already exists", 409);
    }
  }
  console.error(error);
  return jsonError("Something went wrong. Please try again.", 500);
}
