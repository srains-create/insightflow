import OpenAI from "openai";
import { NextResponse } from "next/server";

type InquiryRequest = {
  pattern?: string;
  description?: string;
  evidence?: Array<{ person: string; quote: string }>;
  recurring?: string[];
  reflection?: string;
};

const demoQuestions: Record<string, string[]> = {
  "Decision Flow": [
    "What evidence would distinguish necessary coordination from an approval habit that has become automatic?",
    "Whose perspective is missing when a decision moves upward, and what might that perspective reveal?",
    "Where could you look for a similar decision that moved without executive confirmation, and what was different?",
  ],
  "Product ↔ Sales": [
    "What evidence would show whether customer context is actually arriving too late, rather than being interpreted differently by Product and Sales?",
    "Whose perspective is missing from the current evidence, especially between the moment feedback is heard and the moment planning begins?",
    "What alternative explanation could account for the repeated language around handoffs, priorities, and context?",
  ],
  "Customer Feedback": [
    "At what point does the evidence suggest customer feedback may change meaning as it moves between teams?",
    "What evidence would challenge the interpretation that context is being lost rather than deliberately filtered for different needs?",
    "Whose perspective could help reveal what happens between collecting feedback and acting on it?",
  ],
};

function buildDemoQuestions(body: InquiryRequest) {
  const questions = demoQuestions[body.pattern ?? ""] ?? [
    "What assumption are we making about this pattern that the current evidence does not yet prove?",
    "Whose perspective is missing from the evidence we have?",
    "What evidence would challenge our current interpretation of this pattern?",
  ];

  const reflection = body.reflection?.trim();
  const shortReflection = reflection && reflection.length > 240
    ? `${reflection.slice(0, 237)}...`
    : reflection;
  const contextualQuestion = shortReflection
    ? `Your reflection suggests a working interpretation: “${shortReflection}” What observation would most strongly challenge that interpretation?`
    : questions[0];

  return [contextualQuestion, ...questions.filter((q) => q !== contextualQuestion)].slice(0, 3);
}

function parseInquiryQuestions(text: string) {
  const normalized = text.trim();
  if (!normalized) return [];

  const lines = normalized
    .split(/\n+/)
    .map((line) => line.replace(/^\s*(?:[-*•]|\d+[.)])\s*/, "").trim())
    .filter(Boolean);

  if (lines.length >= 2) return lines.filter((line) => line.endsWith("?")).slice(0, 3);

  const questions = normalized.match(/[^?]+\?/g)?.map((question) => question.trim()) ?? [];
  return questions.slice(0, 3);
}

function inquiryPayload(questions: string[], mode: "demo" | "live") {
  return {
    inquiry: questions.join("\n\n"),
    questions,
    mode,
  };
}

export async function POST(request: Request) {
  try {
    const payload: unknown = await request.json();
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
      return NextResponse.json({ error: "Invalid inquiry request." }, { status: 400 });
    }

    const fields = payload as Record<string, unknown>;
    const textFields = ["pattern", "description", "reflection"];
    const validText = textFields.every(
      (field) => {
        const value = fields[field];
        return value === undefined || (typeof value === "string" && value.length <= 5000);
      },
    );
    const validRecurring = fields.recurring === undefined ||
      (Array.isArray(fields.recurring) && fields.recurring.length <= 12 && fields.recurring.every((item) => typeof item === "string" && item.length <= 500));
    const validEvidence = fields.evidence === undefined ||
      (Array.isArray(fields.evidence) && fields.evidence.length <= 8 && fields.evidence.every(
        (item) => item !== null && typeof item === "object" && !Array.isArray(item) &&
          typeof item.person === "string" && item.person.length <= 200 &&
          typeof item.quote === "string" && item.quote.length <= 2000,
      ));

    if (!validText || !validRecurring || !validEvidence) {
      return NextResponse.json(
        { error: "Invalid inquiry fields, field lengths, or evidence format." },
        { status: 400 },
      );
    }

    const body = payload as InquiryRequest;
    if (!body.pattern?.trim()) {
      return NextResponse.json(
        { error: "A pattern is required." },
        { status: 400 },
      );
    }

    // InsightFlow is demo-first so the prototype works without billing or
    // external API calls. Live AI must be intentionally enabled in the
    // environment in addition to providing an API key.
    const liveAiEnabled = process.env.INSIGHTFLOW_LIVE_AI === "true";

    if (!liveAiEnabled || !process.env.OPENAI_API_KEY) {
      return NextResponse.json(inquiryPayload(buildDemoQuestions(body), "demo"));
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

    try {
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const response = await openai.responses.create({
        model: "gpt-5-mini",
        instructions: `You are the InsightFlow Inquiry Partner, an AI assistant for exploring complex human systems.

Your job is to deepen human inquiry, not make organizational decisions, diagnose people, rank employees, or present uncertain interpretations as facts.

Ground your response only in the supplied pattern, evidence, recurring language, and human reflection. Distinguish observations from interpretations. Surface assumptions, missing perspectives, alternative explanations, and evidence that could challenge the current interpretation.

Respond with exactly three concise inquiry questions, one per line. Each question should help a human investigator think more carefully. Do not give recommendations or solutions. Do not claim causation from recurring patterns.`,
        input: `Pattern: ${body.pattern}\nDescription: ${body.description ?? "Not supplied."}\nRecurring language: ${recurring}\n\nEvidence:\n${evidence}\n\nHuman reflection:\n${body.reflection?.trim() || "No reflection has been entered yet."}`,
      });

      const questions = parseInquiryQuestions(response.output_text);
      if (questions.length !== 3) {
        throw new Error("Inquiry Partner did not return exactly three questions.");
      }

      return NextResponse.json(inquiryPayload(questions, "live"));
    } catch (error) {
      console.warn("Live inquiry unavailable; using demo mode.", error);
      return NextResponse.json(inquiryPayload(buildDemoQuestions(body), "demo"));
    }
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: "Invalid JSON in inquiry request." }, { status: 400 });
    }
    console.error("InsightFlow inquiry request error:", error);
    return NextResponse.json(
      { error: "The inquiry partner could not process this request." },
      { status: 500 },
    );
  }
}
