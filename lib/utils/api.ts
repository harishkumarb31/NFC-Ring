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
    if (error.message.includes("JWT_SECRET")) {
      console.error("JWT Configuration Error:", error.message);
      return jsonError("Server configuration error: JWT_SECRET is not configured.", 500);
    }
    if (
      error.message.includes("does not match the provider") ||
      error.name === "PrismaClientInitializationError"
    ) {
      console.error("Database Connection/Initialization Error:", error.message);
      return jsonError(
        "Database connection error. Please verify your DATABASE_URL in environment settings.",
        500
      );
    }
  }

  if (typeof error === "object" && error !== null && "code" in error) {
    const err = error as { code: string; message?: string };
    // Prisma Unique Constraint Violation
    if (err.code === "P2002") {
      return jsonError("An account with this email already exists", 409);
    }
    // Prisma Table/Relation Missing
    if (err.code === "P2021") {
      console.error("Database Table Missing Error:", err.message);
      return jsonError(
        "Database tables have not been created yet. Please run prisma db push to synchronize your database.",
        500
      );
    }
    // Prisma Server Connection Refused / Timeout
    if (err.code === "P1001" || err.code === "P1002") {
      console.error("Database Unreachable Error:", err.message);
      return jsonError("Cannot connect to the database server. Please check your network and credentials.", 503);
    }
  }

  console.error("Unhandled API Error:", error);
  return jsonError("Something went wrong. Please try again.", 500);
}
