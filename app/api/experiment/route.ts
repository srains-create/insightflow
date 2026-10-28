import { NextResponse } from "next/server";

type ExperimentRequest = {
  possibility?: string;
  reflection?: string;
  pattern?: string;
};

type ExperimentDesign = {
  hypothesis: string;
  experiment: string;
  observation: string;
  learningQuestion: string;
};

type DesignBuilder = (context: string) => ExperimentDesign;

const designs: Record<string, DesignBuilder> = {
  "Look for a missing perspective": (context) => ({
    hypothesis: `If we include a perspective that is missing from the current evidence about ${context}, our interpretation may change or become more precise.`,
    experiment:
      "Invite one person whose perspective is not represented in the current evidence to review the working interpretation and describe what they see differently.",
    observation:
      "Notice which assumptions they confirm, challenge, or reframe and whether they introduce evidence that was previously absent.",
    learningQuestion: `What changes in our understanding of ${context} when a previously missing perspective is included?`,
  }),
  "Change the information flow": (context) => ({
    hypothesis: `If important context about ${context} is shared earlier or more directly, fewer assumptions may be needed as information moves between teams.`,
    experiment:
      "For one upcoming handoff, share the original context alongside the request and ask the receiving team what information was most useful or still missing.",
    observation:
      "Watch for fewer clarification loops, different interpretations, or decisions that can be made with less additional context.",
    learningQuestion: `Does changing when and how context is shared improve shared understanding of ${context}?`,
  }),
  "Test the assumption in your reflection": (context) => ({
    hypothesis: `If the working interpretation about ${context} is accurate, a small test should produce observable evidence consistent with it.`,
    experiment:
      "Choose one upcoming instance of this pattern and deliberately collect evidence that could both support and challenge the current interpretation.",
    observation:
      "Compare what actually happens with what the reflection predicted, paying special attention to evidence that does not fit the assumption.",
    learningQuestion: `What evidence from this test strengthens, weakens, or changes our interpretation of ${context}?`,
  }),
};

function compactContext(body: ExperimentRequest): string {
  const reflection = body.reflection?.trim().split("\n")[0];
  const pattern = body.pattern?.trim();
  const raw = reflection || pattern || "the current pattern";

  return raw.length > 140 ? `${raw.slice(0, 137)}...` : raw;
}

function buildExperimentDesign(body: ExperimentRequest): ExperimentDesign {
  const possibility = body.possibility?.trim() ?? "";
  const context = compactContext(body);
  const knownDesign = designs[possibility];

  if (knownDesign) return knownDesign(context);

  return {
    hypothesis: `If we try “${possibility},” we should observe a meaningful change in how ${context} shows up in the system.`,
    experiment: `Run a small, reversible test of “${possibility}” in one real situation before applying it more broadly.`,
    observation:
      "Capture what changes, what stays the same, and any evidence that contradicts the expected result.",
    learningQuestion: `What does this small test teach us about whether “${possibility}” is worth exploring further in relation to ${context}?`,
  };
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ExperimentRequest;
    const possibility = body.possibility?.trim();

    if (!possibility) {
      return NextResponse.json(
        { error: "A possibility is required before designing an experiment." },
        { status: 400 },
      );
    }

    return NextResponse.json({
      design: buildExperimentDesign({ ...body, possibility }),
      mode: "demo",
    });
  } catch (error) {
    console.error("InsightFlow experiment design request error:", error);
    return NextResponse.json(
      { error: "The experiment designer could not process this request." },
      { status: 500 },
    );
  }
}
