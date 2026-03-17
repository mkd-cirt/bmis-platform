import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export const dynamic = "force-dynamic";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@mkd-cirt.mk";

/** Verify the admin bearer token and return the email it belongs to, or null. */
function verifyToken(authHeader: string | null): string | null {
  if (!authHeader?.startsWith("Bearer ")) return null;
  try {
    const payload = JSON.parse(
      Buffer.from(authHeader.slice(7), "base64").toString()
    );
    if (
      typeof payload.email !== "string" ||
      payload.email.toLowerCase() !== ADMIN_EMAIL.toLowerCase() ||
      typeof payload.exp !== "number" ||
      payload.exp <= Date.now()
    ) {
      return null;
    }
    return payload.email.toLowerCase();
  } catch {
    return null;
  }
}

const SYSTEM_PROMPT = `You are a cybersecurity compliance assistant for MKD-CIRT, helping organizations in North Macedonia understand and comply with the Закон за безбедност на мрежни и информациски системи (ЗБМИС, Official Gazette No. 135, 4.7.2025), which transposes the EU NIS2 Directive (2022/2555).

Answer questions about:
- Entity classification (Essential vs. Important entities)
- Compliance obligations under ЗБМИС articles
- Security domains and controls
- Incident reporting timelines (3h early warning → 24h report → 72h initial assessment → 1 month final notification)
- Sanctions and deadlines

Be precise, cite specific ЗБМИС articles and NIS2 articles where relevant. Respond in the same language the user writes in (Macedonian, English, or Albanian).`;

export async function POST(req: NextRequest) {
  // 1. Authenticate — identity comes from the verified token, never from request body.
  const authenticatedEmail = verifyToken(req.headers.get("authorization"));
  if (!authenticatedEmail) {
    return NextResponse.json({ error: "Неовластен пристап" }, { status: 401 });
  }

  // 2. Parse and validate request body.
  let messages: { role: "user" | "assistant"; content: string }[];
  try {
    const body = await req.json();
    if (!Array.isArray(body.messages) || body.messages.length === 0) {
      return NextResponse.json({ error: "Невалидни пораки" }, { status: 400 });
    }
    messages = body.messages.map((m: any) => ({
      role:    m.role === "assistant" ? "assistant" : "user",
      content: String(m.content ?? "").slice(0, 4000),
    }));
  } catch {
    return NextResponse.json({ error: "Невалидно тело на барањето" }, { status: 400 });
  }

  // 3. Call Claude API.
  try {
    const client   = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const response = await client.messages.create({
      model:      "claude-sonnet-4-6",
      max_tokens: 1024,
      system:     SYSTEM_PROMPT,
      messages,
    });

    const text = response.content
      .filter((b: Anthropic.ContentBlock) => b.type === "text")
      .map((b: Anthropic.ContentBlock) => (b as Anthropic.TextBlock).text)
      .join("");

    return NextResponse.json({ reply: text });
  } catch (err: any) {
    console.error("Chat API error:", err);
    return NextResponse.json({ error: "Грешка при генерирање одговор" }, { status: 500 });
  }
}
