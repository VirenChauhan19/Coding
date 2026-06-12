import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { BADGE_DEFS } from "../src/lib/gamification";
import type { SeedCourse } from "./seed-data/types";
import { pythonLessons } from "./seed-data/python-lessons";
import { pythonExams } from "./seed-data/python-exams";
import { otherCourses } from "./seed-data/other-courses";

const prisma = new PrismaClient();

const pythonCourse: SeedCourse = {
  slug: "python",
  language: "Python",
  title: "Python",
  description: "The friendliest language to start with — clear, readable, powerful.",
  icon: "🐍",
  color: "#3776ab",
  order: 1,
  lessons: pythonLessons,
  exams: pythonExams,
};

const allCourses: SeedCourse[] = [pythonCourse, ...otherCourses];

async function clearDatabase() {
  // Order matters due to FK constraints.
  await prisma.userBadge.deleteMany();
  await prisma.badge.deleteMany();
  await prisma.topicStat.deleteMany();
  await prisma.examAttempt.deleteMany();
  await prisma.quizAttempt.deleteMany();
  await prisma.lessonProgress.deleteMany();
  await prisma.question.deleteMany();
  await prisma.exam.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.practiceProblem.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();
}

async function seedBadges() {
  for (const def of BADGE_DEFS) {
    await prisma.badge.upsert({
      where: { key: def.key },
      update: def,
      create: def,
    });
  }
  console.log(`  ✓ ${BADGE_DEFS.length} badges`);
}

async function seedCourse(course: SeedCourse) {
  const created = await prisma.course.create({
    data: {
      slug: course.slug,
      language: course.language,
      title: course.title,
      description: course.description,
      icon: course.icon,
      color: course.color,
      order: course.order,
    },
  });

  let lessonOrder = 0;
  for (const lesson of course.lessons) {
    const createdLesson = await prisma.lesson.create({
      data: {
        courseId: created.id,
        slug: lesson.slug,
        title: lesson.title,
        level: lesson.level,
        order: lessonOrder++,
        estMinutes: lesson.estMinutes ?? 10,
        content: lesson.content,
        codeExample: lesson.codeExample ?? "",
        summary: lesson.summary ?? "",
        prerequisites: JSON.stringify(lesson.prerequisites ?? []),
      },
    });

    // Quizzes + questions
    let quizOrder = 0;
    for (const quiz of lesson.quizzes ?? []) {
      const createdQuiz = await prisma.quiz.create({
        data: { lessonId: createdLesson.id, title: quiz.title, order: quizOrder++ },
      });
      let qOrder = 0;
      for (const q of quiz.questions) {
        await prisma.question.create({
          data: {
            quizId: createdQuiz.id,
            type: q.type,
            prompt: q.prompt,
            code: q.code ?? "",
            options: JSON.stringify(q.options ?? []),
            answer: q.answer,
            explanation: q.explanation,
            difficulty: q.difficulty ?? "EASY",
            topic: q.topic ?? "",
            order: qOrder++,
          },
        });
      }
    }

    // Practice problems
    let pOrder = 0;
    for (const p of lesson.practice ?? []) {
      await prisma.practiceProblem.create({
        data: {
          lessonId: createdLesson.id,
          courseId: created.id,
          title: p.title,
          prompt: p.prompt,
          language: p.language ?? "javascript",
          starterCode: p.starterCode ?? "",
          solution: p.solution ?? "",
          difficulty: p.difficulty ?? "EASY",
          topic: p.topic ?? "",
          testCases: JSON.stringify(p.testCases ?? []),
          order: pOrder++,
        },
      });
    }
  }

  // Exams
  for (const exam of course.exams) {
    const createdExam = await prisma.exam.create({
      data: {
        courseId: created.id,
        title: exam.title,
        level: exam.level,
        durationMinutes: exam.durationMinutes,
        passingScore: exam.passingScore,
        isBoss: exam.isBoss ?? false,
        xpReward: exam.xpReward ?? 200,
      },
    });
    let qOrder = 0;
    for (const q of exam.questions) {
      await prisma.question.create({
        data: {
          examId: createdExam.id,
          type: q.type,
          prompt: q.prompt,
          code: q.code ?? "",
          options: JSON.stringify(q.options ?? []),
          answer: q.answer,
          explanation: q.explanation,
          difficulty: q.difficulty ?? "EASY",
          topic: q.topic ?? "",
          order: qOrder++,
        },
      });
    }
  }

  console.log(
    `  ✓ ${course.title} (${course.lessons.length} lessons, ${course.exams.length} exams)`,
  );
  return created;
}

async function seedDemoUsers(pythonCourseId: string, jsCourseId: string) {
  const passwordHash = await bcrypt.hash("password123", 10);

  const admin = await prisma.user.create({
    data: {
      email: "admin@codementor.dev",
      name: "Admin",
      passwordHash,
      role: "ADMIN",
      xp: 0,
    },
  });

  const student = await prisma.user.create({
    data: {
      email: "student@codementor.dev",
      name: "Demo Student",
      passwordHash,
      role: "STUDENT",
      xp: 320,
      streakCount: 3,
      lastActiveDate: new Date(),
      timeSpentSeconds: 4500,
    },
  });

  // Enroll the demo student in Python + JavaScript.
  await prisma.enrollment.createMany({
    data: [
      { userId: student.id, courseId: pythonCourseId },
      { userId: student.id, courseId: jsCourseId },
    ],
  });

  // Mark the first 3 Python lessons complete for a populated dashboard.
  const pyLessons = await prisma.lesson.findMany({
    where: { courseId: pythonCourseId },
    orderBy: { order: "asc" },
    take: 3,
  });
  for (const l of pyLessons) {
    await prisma.lessonProgress.create({
      data: {
        userId: student.id,
        lessonId: l.id,
        completed: true,
        completedAt: new Date(),
        timeSpent: 600,
      },
    });
  }

  // A sample quiz attempt.
  const firstQuiz = await prisma.quiz.findFirst({
    where: { lesson: { courseId: pythonCourseId } },
  });
  if (firstQuiz) {
    await prisma.quizAttempt.create({
      data: {
        userId: student.id,
        quizId: firstQuiz.id,
        score: 2,
        total: 3,
        answers: "[]",
      },
    });
  }

  // Seed a couple of topic stats so "weak topics" shows up immediately.
  await prisma.topicStat.createMany({
    data: [
      { userId: student.id, topic: "Loops", correct: 1, total: 4 },
      { userId: student.id, topic: "Dictionaries", correct: 2, total: 5 },
      { userId: student.id, topic: "Variables", correct: 6, total: 6 },
    ],
  });

  // Award a starter badge.
  const firstSteps = await prisma.badge.findUnique({ where: { key: "first_steps" } });
  if (firstSteps) {
    await prisma.userBadge.create({
      data: { userId: student.id, badgeId: firstSteps.id },
    });
  }

  console.log(`  ✓ Demo users: admin@codementor.dev / student@codementor.dev (password123)`);
  return { admin, student };
}

async function main() {
  console.log("🌱 Seeding CodeMentor Academy...\n");
  await clearDatabase();
  await seedBadges();

  const createdMap = new Map<string, string>();
  for (const course of allCourses) {
    const created = await seedCourse(course);
    createdMap.set(course.slug, created.id);
  }

  await seedDemoUsers(createdMap.get("python")!, createdMap.get("javascript")!);

  console.log("\n✅ Seed complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
