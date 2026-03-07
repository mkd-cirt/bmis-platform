export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prisma } = await import("@/server/db");
    const body = await req.json();
    const { orgName, entityType, track, answers, notes, score, domainScores } = body;

    // Create or find organization
    const org = await prisma.organization.create({
      data: {
        name: orgName || "Анонимна организација",
        sector: "UNKNOWN",
        size: "UNKNOWN",
        entityType: entityType || "NOT_COVERED",
      },
    });

    // Create assessment
    const assessment = await prisma.assessment.create({
      data: {
        organizationId: org.id,
        title: `BMIS Проценка — ${new Date().toLocaleDateString("mk-MK")}`,
        entityType: entityType || "NOT_COVERED",
        status: "COMPLETED",
        totalScore: score?.percentage || null,
        completedAt: new Date(),
      },
    });

    // Save domain scores
    if (domainScores?.length) {
      await prisma.domainScore.createMany({
        data: domainScores.map((ds: any) => ({
          assessmentId: assessment.id,
          domainId: ds.domainId,
          domainName: ds.domainName,
          score: ds.score,
          maxScore: ds.maxScore,
          percentage: ds.percentage,
        })),
      });
    }

    // Save control answers
    if (answers && Object.keys(answers).length) {
      await prisma.controlAnswer.createMany({
        data: Object.entries(answers).map(([controlId, status]: any) => ({
          assessmentId: assessment.id,
          controlId,
          domainId: controlId.split("-")[0],
          status,
          notes: notes?.[controlId] || null,
        })),
      });
    }

    return NextResponse.json({ success: true, assessmentId: assessment.id });
  } catch (err: any) {
    console.error("Save assessment error:", err);
    return NextResponse.json({ error: "Грешка при зачувување" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { prisma } = await import("@/server/db");
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      const assessment = await prisma.assessment.findUnique({
        where: { id },
        include: { domainScores: true, controlAnswers: true, organization: true },
      });
      if (!assessment) return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json(assessment);
    }

    const assessments = await prisma.assessment.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      include: { organization: true },
    });
    return NextResponse.json(assessments);
  } catch (err) {
    return NextResponse.json({ error: "Грешка" }, { status: 500 });
  }
}
