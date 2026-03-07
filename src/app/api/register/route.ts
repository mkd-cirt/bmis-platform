import { NextResponse } from "next/server";
import { prisma } from "@/server/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password, orgName } = await req.json();
    if (!email || !password || !orgName)
      return NextResponse.json({ error: "Пополнете ги сите полиња" }, { status: 400 });
    if (password.length < 8)
      return NextResponse.json({ error: "Лозинката мора да има минимум 8 знаци" }, { status: 400 });
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists)
      return NextResponse.json({ error: "Email адресата е веќе регистрирана" }, { status: 400 });
    const hashed = await bcrypt.hash(password, 12);
    const org    = await prisma.organization.create({
      data: { name: orgName, sector: "UNKNOWN", size: "UNKNOWN" },
    });
    const user   = await prisma.user.create({
      data: {
        name, email, password: hashed,
        organizations: { create: { organizationId: org.id, role: "ADMIN" } },
      },
    });
    return NextResponse.json({ success: true, userId: user.id });
  } catch {
    return NextResponse.json({ error: "Грешка при регистрација. Обидете се повторно." }, { status: 500 });
  }
}
