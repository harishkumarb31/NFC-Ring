interface VCardInput {
  name: string;
  company?: string | null;
  designation?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
}

function escapeVCard(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
}

export function buildVCard(input: VCardInput): string {
  const parts = input.name.trim().split(/\s+/);
  const lastName = parts.length > 1 ? parts[parts.length - 1] : "";
  const firstName = parts.length > 1 ? parts.slice(0, -1).join(" ") : parts[0] || "";

  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${escapeVCard(input.name)}`,
    `N:${escapeVCard(lastName)};${escapeVCard(firstName)};;;`,
    input.company ? `ORG:${escapeVCard(input.company)}` : null,
    input.designation ? `TITLE:${escapeVCard(input.designation)}` : null,
    input.phone ? `TEL;TYPE=CELL:${escapeVCard(input.phone)}` : null,
    input.email ? `EMAIL:${escapeVCard(input.email)}` : null,
    input.website ? `URL:${escapeVCard(input.website)}` : null,
    "END:VCARD",
  ].filter(Boolean);
  return lines.join("\r\n");
}
