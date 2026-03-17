import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@mkd-cirt.mk";
const PAGE_SIZE   = 20;

function verifyToken(authHeader: string | null): boolean {
  if (!authHeader?.startsWith("Bearer ")) return false;
  try {
    const payload = JSON.parse(Buffer.from(authHeader.slice(7), "base64").toString());
    return (
      typeof payload.email === "string" &&
      payload.email.toLowerCase() === ADMIN_EMAIL.toLowerCase() &&
      typeof payload.exp === "number" &&
      payload.exp > Date.now()
    );
  } catch {
    return false;
  }
}

export async function GET(req: NextRequest) {
  if (!verifyToken(req.headers.get("authorization"))) {
    return NextResponse.json({ error: "Неовластен пристап" }, { status: 401 });
  }

  const { searchParams } = req.nextUrl;
  const page   = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const search = searchParams.get("search") ?? "";
  const type   = searchParams.get("type")   ?? "";

  const where = {
    ...(search ? { name: { contains: search, mode: "insensitive" as const } } : {}),
    ...(type   ? { entityType: type as any } : {}),
  };

  const [total, organizations] = await Promise.all([
    prisma.organization.count({ where }),
    prisma.organization.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: {
        id:         true,
        name:       true,
        sector:     true,
        size:       true,
        entityType: true,
        createdAt:  true,
        assessments: {
          where:   { status: "COMPLETED" },
          orderBy: { completedAt: "desc" },
          take:    1,
          select:  { id: true, totalScore: true, completedAt: true, entityType: true },
        },
      },
    }),
  ]);

  const entities = organizations.map((org) => {
    const latest = org.assessments[0] ?? null;
    return {
      id:          org.id,
      name:        org.name,
      sector:      org.sector,
      size:        org.size,
      entityType:  latest?.entityType ?? org.entityType ?? "NOT_COVERED",
      score:       latest?.totalScore ?? null,
      completedAt: latest?.completedAt ?? null,
      assessmentId: latest?.id ?? null,
      createdAt:   org.createdAt,
    };
  });

  return NextResponse.json({ entities, total, page, pageSize: PAGE_SIZE });
}
