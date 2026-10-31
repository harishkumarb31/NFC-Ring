import crypto from "crypto";

export function generateRingToken(): string {
  return crypto.randomBytes(24).toString("hex");
}
