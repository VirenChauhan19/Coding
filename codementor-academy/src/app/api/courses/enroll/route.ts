import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { courseId } = await req.json();
  if (!courseId) return NextResponse.json({ error: "courseId required" }, { status: 400 });

  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 });

  // Idempotent enroll (unique constraint on userId+courseId).
  await prisma.enrollment.upsert({
    where: { userId_courseId: { userId: session.id, courseId } },
    update: {},
    create: { userId: session.id, courseId },
  });

  return NextResponse.json({ ok: true });
}
