import { NextResponse } from "next/server";

type LearningRequest = {
  pattern?: string;
  hypothesis?: string;
  outcome?: string;
  surprise?: string;
  hypothesisResult?: "supported" | "challenged" | "inconclusive" | "";
  learningQuestion?: string;
  nextQuestion?: string;
};

type LearningSynthesis = {
  comparison: string;
  changedUnderstanding: string;
  evidenceToCarryForward: string;
  nextInquiry: string;
};

function clean(value?: string) {
  return value?.trim() ?? "";
}

function synthesizeLearning(body: LearningRequest): LearningSynthesis {
  const pattern = clean(body.pattern) || "the pattern being explored";
  const hypothesis = clean(body.hypothesis);
  const outcome = clean(body.outcome);
  const surprise = clean(body.surprise);
  const learningQuestion = clean(body.learningQuestion);
  const nextQuestion = clean(body.nextQuestion);

  const comparisonByResult = {
    supported: hypothesis
      ? `The recorded outcome is consistent with the original hypothesis: “${hypothesis}” This supports continuing to investigate the idea, but it does not establish causality.`
      : "The recorded outcome is consistent with the working hypothesis, but it should be treated as evidence to investigate rather than proof.",
    challenged: hypothesis
      ? `The recorded outcome does not fully match the original hypothesis: “${hypothesis}” The difference is useful evidence that the original assumption may need to change.`
      : "The recorded outcome challenges the working hypothesis and suggests that an assumption in the original interpretation may need to change.",
    inconclusive: hypothesis
      ? `The experiment did not provide enough evidence to clearly support or challenge the original hypothesis: “${hypothesis}”`
      : "The experiment produced mixed or insufficient evidence, so the working hypothesis remains unresolved.",
  } as const;

  const result = body.hypothesisResult || "inconclusive";
  const comparison = comparisonByResult[result];

  const changedUnderstanding = surprise
    ? `The most important new information is what was unexpected: ${surprise}`
    : result === "challenged"
      ? `The current understanding of ${pattern} should remain open because the observed result differed from what was expected.`
      : result === "supported"
        ? `The experiment adds evidence that the current interpretation of ${pattern} may be useful, while leaving room for alternative explanations.`
        : `The current understanding of ${pattern} is still incomplete and would benefit from more targeted evidence.`;

  const evidenceToCarryForward = outcome
    ? `Carry the observed outcome into future inquiry as evidence: ${outcome}`
    : "Carry forward the distinction between what was expected and what was actually observed, and gather a clearer outcome in the next test.";

  const nextInquiry = nextQuestion
    ? nextQuestion
    : learningQuestion
      ? `Revisit the learning question with the new evidence: ${learningQuestion}`
      : `What additional evidence would help explain why ${pattern} produced this outcome?`;

  return {
    comparison,
    changedUnderstanding,
    evidenceToCarryForward,
    nextInquiry,
  };
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LearningRequest;

    if (!clean(body.outcome) && !clean(body.surprise)) {
      return NextResponse.json(
        { error: "Record an outcome or surprise before synthesizing learning." },
        { status: 400 },
      );
    }

    return NextResponse.json({
      synthesis: synthesizeLearning(body),
      mode: "demo",
    });
  } catch (error) {
    console.error("InsightFlow learning synthesis request error:", error);
    return NextResponse.json(
      { error: "The learning synthesis could not process this request." },
      { status: 500 },
    );
  }
}
