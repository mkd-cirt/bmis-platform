export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prisma } = await import("@/server/db");
    const bcrypt     = await import("bcryptjs");

    const { email, password } = await req.json();

    if (!email || !password)
      return NextResponse.json({ error: "Пополнете ги сите полиња" }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (!user?.password)
      return NextResponse.json({ error: "Невалидна е-пошта или лозинка" }, { status: 401 });

    const valid = await bcrypt.default.compare(password, user.password);
    if (!valid)
      return NextResponse.json({ error: "Невалидна е-пошта или лозинка" }, { status: 401 });

    const exp   = Date.now() + 24 * 60 * 60 * 1000; // 24h
    const token = Buffer.from(
      JSON.stringify({ userId: user.id, email: user.email, exp })
    ).toString("base64");

    return NextResponse.json({ token, name: user.name, email: user.email });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Грешка на серверот" }, { status: 500 });
  }
}
