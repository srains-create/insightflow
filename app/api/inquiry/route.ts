import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type InquiryRequest = {
  pattern?: string;
  description?: string;
  evidence?: Array<{ person: string; quote: string }>;
  recurring?: string[];
  reflection?: string;
};

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key is not configured." },
        { status: 500 },
      );
    }

    const body = (await request.json()) as InquiryRequest;

    if (!body.pattern) {
      return NextResponse.json(
        { error: "A pattern is required." },
        { status: 400 },
      );
    }

    const evidence = Array.isArray(body.evidence)
      ? body.evidence
          .slice(0, 8)
          .map((item) => `- ${item.person}: “${item.quote}”`)
          .join("\n")
      : "No evidence supplied.";

    const recurring = Array.isArray(body.recurring)
      ? body.recurring.slice(0, 12).join(", ")
      : "None supplied.";

    const response = await openai.responses.create({
      model: "gpt-5-mini",
      instructions: `You are the InsightFlow Inquiry Partner, an AI assistant for exploring complex human systems.

Your job is to deepen human inquiry, not make organizational decisions, diagnose people, rank employees, or present uncertain interpretations as facts.

Ground your response only in the supplied pattern, evidence, recurring language, and human reflection. Distinguish observations from interpretations. Surface assumptions, missing perspectives, alternative explanations, and evidence that could challenge the current interpretation.

Respond with exactly three concise inquiry questions. Each question should help a human investigator think more carefully. Do not give recommendations or solutions. Do not claim causation from recurring patterns.`,
      input: `Pattern: ${body.pattern}\nDescription: ${body.description ?? "Not supplied."}\nRecurring language: ${recurring}\n\nEvidence:\n${evidence}\n\nHuman reflection:\n${body.reflection?.trim() || "No reflection has been entered yet."}`,
    });

    return NextResponse.json({ inquiry: response.output_text });
  } catch (error) {
    console.error("InsightFlow inquiry error:", error);
    return NextResponse.json(
      { error: "The inquiry partner could not respond. Please try again." },
      { status: 500 },
    );
  }
}
