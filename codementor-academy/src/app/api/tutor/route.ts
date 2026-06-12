import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getTutorResponse } from "@/lib/tutor";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { question, context, history } = await req.json();
  if (!question || typeof question !== "string") {
    return NextResponse.json({ error: "A question is required." }, { status: 400 });
  }

  const response = await getTutorResponse({
    question: question.slice(0, 2000),
    context,
    history,
  });

  return NextResponse.json(response);
}
