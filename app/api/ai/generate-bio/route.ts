import { NextRequest } from "next/server";
import Groq from "groq-sdk";
import { requireAuth } from "@/lib/auth";
import { bioGenerateSchema } from "@/lib/validation";
import { jsonOk, jsonError, handleApiError } from "@/lib/utils/api";

// Server-only client — GROQ_API_KEY never reaches the browser.
function getGroqClient() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;
  return new Groq({ apiKey });
}

export async function POST(req: NextRequest) {
  try {
    await requireAuth();

    const body = await req.json();
    const parsed = bioGenerateSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message || "Invalid input", 422);
    }
    const { name, designation, company, skills, experience, industry, tone } = parsed.data;

    const client = getGroqClient();
    if (!client) {
      return jsonError(
        "AI bio generation is not configured. Set GROQ_API_KEY on the server to enable this feature.",
        503
      );
    }

    const prompt = `Write two professional biographies for a business profile, in a ${tone.toLowerCase()} tone.

Person: ${name}
Role: ${designation}${company ? ` at ${company}` : ""}
Industry: ${industry}
Years of experience: ${experience}
Key skills: ${skills}

Return ONLY valid JSON, no markdown fences, no preamble, in this exact shape:
{"shortBio": "one sentence, under 160 characters", "fullBio": "3-4 sentences, under 500 characters"}`;

    const candidateModels = [
      "openai/gpt-oss-120b",
      "openai/gpt-oss-20b",
      "qwen/qwen3.8-27b",
    ];

    let raw = "";
    let lastError: Error | null = null;

    for (const model of candidateModels) {
      try {
        const completion = await client.chat.completions.create({
          model,
          messages: [
            {
              role: "system",
              content:
                "You are an expert executive bio writer. You must return a valid JSON object with keys 'shortBio' and 'fullBio'.",
            },
            { role: "user", content: prompt },
          ],
          response_format: { type: "json_object" },
          temperature: 0.7,
          max_tokens: 1000,
        });
        raw = completion.choices[0]?.message?.content?.trim() || "";
        if (raw) break;
      } catch (err: any) {
        lastError = err;
        console.warn(`Groq model ${model} failed, attempting next fallback...`, err.message);
      }
    }

    if (!raw && lastError) {
      return jsonError(`AI service temporarily unavailable: ${lastError.message}`, 503);
    }

    const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();

    let parsedResult: { shortBio?: string; fullBio?: string };
    try {
      parsedResult = JSON.parse(cleaned);
    } catch {
      return jsonError("AI response could not be parsed. Please try again.", 502);
    }

    if (!parsedResult.shortBio || !parsedResult.fullBio) {
      return jsonError("AI response was incomplete. Please try again.", 502);
    }

    return jsonOk({ shortBio: parsedResult.shortBio, fullBio: parsedResult.fullBio });
  } catch (error) {
    return handleApiError(error);
  }
}
