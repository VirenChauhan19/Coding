import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

/** Create a new lesson. Admin-only. Demonstrates the content pipeline. */
export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const body = await req.json();
  const { courseId, title, level, content, codeExample, summary, prerequisites } = body;

  if (!courseId || !title || !content) {
    return NextResponse.json(
      { error: "courseId, title and content are required." },
      { status: 400 },
    );
  }

  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) return NextResponse.json({ error: "Course not found." }, { status: 404 });

  // Slug from title; ensure uniqueness within the course.
  const baseSlug = String(title)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50);
  let slug = baseSlug || "lesson";
  let n = 1;
  while (await prisma.lesson.findUnique({ where: { courseId_slug: { courseId, slug } } })) {
    slug = `${baseSlug}-${n++}`;
  }

  const maxOrder = await prisma.lesson.aggregate({
    where: { courseId },
    _max: { order: true },
  });

  const checklist = Array.isArray(prerequisites)
    ? prerequisites
    : String(prerequisites ?? "")
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);

  const lesson = await prisma.lesson.create({
    data: {
      courseId,
      slug,
      title: String(title).slice(0, 120),
      level: ["BEGINNER", "INTERMEDIATE", "ADVANCED"].includes(level) ? level : "BEGINNER",
      order: (maxOrder._max.order ?? -1) + 1,
      content,
      codeExample: codeExample ?? "",
      summary: summary ?? "",
      prerequisites: JSON.stringify(checklist),
    },
  });

  return NextResponse.json({ ok: true, lessonId: lesson.id });
}
