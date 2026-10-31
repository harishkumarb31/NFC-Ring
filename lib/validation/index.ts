import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(2, "Name is required").max(100),
});

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export function normalizeUrl(val: unknown): string {
  if (typeof val !== "string") return "";
  const trimmed = val.trim();
  if (!trimmed) return "";
  if (/^javascript:/i.test(trimmed)) return "";
  if (!/^https?:\/\//i.test(trimmed)) {
    return `https://${trimmed}`;
  }
  return trimmed;
}

const optionalUrl = z.preprocess(
  normalizeUrl,
  z.string().url("Enter a valid URL").optional().or(z.literal(""))
);

export const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  company: z.string().max(150).optional().or(z.literal("")),
  designation: z.string().max(150).optional().or(z.literal("")),
  bio: z.string().max(1000).optional().or(z.literal("")),
  shortBio: z.string().max(200).optional().or(z.literal("")),
  phone: z.string().max(30).optional().or(z.literal("")),
  email: z.string().email("Enter a valid email").optional().or(z.literal("")),
  website: optionalUrl,
  linkedin: optionalUrl,
  whatsapp: z.string().max(30).optional().or(z.literal("")),
  portfolioUrl: optionalUrl,
  photoUrl: optionalUrl,
  services: z.string().max(500).optional().or(z.literal("")),
  mode: z.enum(["BUSINESS", "PERSONAL", "SALES", "EVENT"]),
});

export const connectionSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  company: z.string().max(150).optional().or(z.literal("")),
  message: z.string().max(1000).optional().or(z.literal("")),
});

export const leadSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().max(30).optional().or(z.literal("")),
  company: z.string().max(150).optional().or(z.literal("")),
  message: z.string().max(1000).optional().or(z.literal("")),
});

export const bioGenerateSchema = z.object({
  name: z.string().min(2).max(100),
  designation: z.string().max(150),
  company: z.string().max(150).optional().or(z.literal("")),
  skills: z.string().max(300),
  experience: z.string().max(100),
  industry: z.string().max(150),
  tone: z.enum(["Professional", "Modern", "Executive", "Friendly"]),
});

export function sanitizeText(input: string): string {
  if (!input || typeof input !== "string") return "";
  return input
    .replace(/\0/g, "")
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/[<>]/g, "")
    .trim();
}
