import { NextRequest, NextResponse } from "next/server";

const ADMIN_EMAIL    = process.env.ADMIN_EMAIL    ?? "admin@mkd-cirt.mk";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "admin123";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      email.trim().toLowerCase() !== ADMIN_EMAIL.toLowerCase() ||
      password !== ADMIN_PASSWORD
    ) {
      return NextResponse.json({ error: "Невалидни акредитиви" }, { status: 401 });
    }

    // Simple token: base64(email|expiry)
    const exp   = Date.now() + 8 * 60 * 60 * 1000; // 8h
    const token = Buffer.from(JSON.stringify({ email: email.trim().toLowerCase(), exp })).toString("base64");

    return NextResponse.json({ token });
  } catch {
    return NextResponse.json({ error: "Грешка на серверот" }, { status: 500 });
  }
}
