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

function buildDemoInquiry(body: InquiryRequest) {
  const questions = demoQuestions[body.pattern ?? ""] ?? [
    "What assumption are we making about this pattern that the current evidence does not yet prove?",
    "Whose perspective is missing from the evidence we have?",
    "What evidence would challenge our current interpretation of this pattern?",
  ];

  const reflection = body.reflection?.trim();
  const contextualQuestion = reflection
    ? `Your reflection suggests a working interpretation: “${reflection}” What observation would most strongly challenge that interpretation?`
    : questions[0];

  return [contextualQuestion, ...questions.filter((q) => q !== contextualQuestion)].slice(0, 3).join("\n\n");
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as InquiryRequest;

    if (!body.pattern) {
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
      return NextResponse.json({
        inquiry: buildDemoInquiry(body),
        mode: "demo",
      });
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

Respond with exactly three concise inquiry questions. Each question should help a human investigator think more carefully. Do not give recommendations or solutions. Do not claim causation from recurring patterns.`,
        input: `Pattern: ${body.pattern}\nDescription: ${body.description ?? "Not supplied."}\nRecurring language: ${recurring}\n\nEvidence:\n${evidence}\n\nHuman reflection:\n${body.reflection?.trim() || "No reflection has been entered yet."}`,
      });

      return NextResponse.json({ inquiry: response.output_text, mode: "live" });
    } catch (error) {
      console.warn("Live inquiry unavailable; using demo mode.", error);
      return NextResponse.json({
        inquiry: buildDemoInquiry(body),
        mode: "demo",
      });
    }
  } catch (error) {
    console.error("InsightFlow inquiry request error:", error);
    return NextResponse.json(
      { error: "The inquiry partner could not process this request." },
      { status: 500 },
    );
  }
}
