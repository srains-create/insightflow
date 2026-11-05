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

type QualitySignal = {
  passed: boolean;
  reason: string;
};

type SynthesisQuality = {
  evidenceGrounded: QualitySignal;
  distinguishesInterpretation: QualitySignal;
  avoidsCausalOverclaim: QualitySignal;
  supportsContinuedInquiry: QualitySignal;
};

type ConfidenceGuidance = {
  level: "emerging" | "developing" | "stronger";
  reason: string;
  missingEvidence: string[];
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

function assessSynthesisQuality(body: LearningRequest): SynthesisQuality {
  const hasObservedEvidence = Boolean(clean(body.outcome) || clean(body.surprise));
  const hasInterpretiveContext = Boolean(clean(body.hypothesis) || body.hypothesisResult);
  const hasNextInquiry = Boolean(clean(body.nextQuestion) || clean(body.learningQuestion));

  return {
    evidenceGrounded: {
      passed: hasObservedEvidence,
      reason: hasObservedEvidence
        ? "The synthesis is grounded in an outcome or surprise recorded after the experiment."
        : "Record an observed outcome or surprise before treating the synthesis as learning.",
    },
    distinguishesInterpretation: {
      passed: hasInterpretiveContext,
      reason: hasInterpretiveContext
        ? "The synthesis compares observed evidence with the original hypothesis or its recorded result."
        : "Add the original hypothesis or hypothesis result so observations can be distinguished from interpretation.",
    },
    avoidsCausalOverclaim: {
      passed: true,
      reason: "The synthesis describes evidence as consistent with, challenging, or insufficient for a hypothesis rather than claiming the experiment proved causality.",
    },
    supportsContinuedInquiry: {
      passed: hasNextInquiry,
      reason: hasNextInquiry
        ? "The learning record contains a question that can carry the new evidence into another inquiry."
        : "Add a learning or next question to make the transition from outcome to continued inquiry explicit.",
    },
  };
}

function assessConfidence(body: LearningRequest): ConfidenceGuidance {
  const missingEvidence: string[] = [];
  const hasOutcome = Boolean(clean(body.outcome));
  const hasSurprise = Boolean(clean(body.surprise));
  const hasHypothesis = Boolean(clean(body.hypothesis));
  const hasResult = Boolean(body.hypothesisResult);
  const hasNextInquiry = Boolean(clean(body.nextQuestion) || clean(body.learningQuestion));

  if (!hasOutcome) missingEvidence.push("a clearly recorded experiment outcome");
  if (!hasHypothesis) missingEvidence.push("the original hypothesis for comparison");
  if (!hasResult) missingEvidence.push("a supported, challenged, or inconclusive hypothesis assessment");
  if (!hasNextInquiry) missingEvidence.push("a question for continued inquiry");

  const evidenceSignals = [hasOutcome, hasSurprise, hasHypothesis, hasResult, hasNextInquiry].filter(Boolean).length;

  if (evidenceSignals >= 5) {
    return {
      level: "stronger",
      reason: "The synthesis has an observed outcome, interpretive context, an explicit hypothesis assessment, unexpected evidence, and a question for continued inquiry. Confidence still describes the completeness of the learning record, not certainty that the hypothesis is true.",
      missingEvidence,
    };
  }

  if (evidenceSignals >= 3) {
    return {
      level: "developing",
      reason: "The learning record contains several useful evidence signals, but important context is still missing. Treat the synthesis as a working interpretation that should be tested again.",
      missingEvidence,
    };
  }

  return {
    level: "emerging",
    reason: "The synthesis is based on limited recorded evidence. Use it to guide the next inquiry rather than as a conclusion about the system.",
    missingEvidence,
  };
}

function isLearningRequest(value: unknown): value is LearningRequest {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;

  const fields = value as Record<string, unknown>;
  const textFields = [
    "pattern",
    "hypothesis",
    "outcome",
    "surprise",
    "learningQuestion",
    "nextQuestion",
  ];

  if (textFields.some((field) => {
    const value = fields[field];
    return value !== undefined && (typeof value !== "string" || value.length > 5000);
  })) {
    return false;
  }

  return (
    fields.hypothesisResult === undefined ||
    fields.hypothesisResult === "" ||
    fields.hypothesisResult === "supported" ||
    fields.hypothesisResult === "challenged" ||
    fields.hypothesisResult === "inconclusive"
  );
}

export async function POST(request: Request) {
  try {
    const payload: unknown = await request.json();

    if (!isLearningRequest(payload)) {
      return NextResponse.json(
        { error: "Invalid learning synthesis request. Check field types, 5000-character limits, and hypothesis result." },
        { status: 400 },
      );
    }

    const body = payload;

    if (!clean(body.outcome) && !clean(body.surprise)) {
      return NextResponse.json(
        { error: "Record an outcome or surprise before synthesizing learning." },
        { status: 400 },
      );
    }

    return NextResponse.json({
      synthesis: synthesizeLearning(body),
      quality: assessSynthesisQuality(body),
      confidence: assessConfidence(body),
      mode: "demo",
    });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON in learning synthesis request." },
        { status: 400 },
      );
    }

    console.error("InsightFlow learning synthesis request error:", error);
    return NextResponse.json(
      { error: "The learning synthesis could not process this request." },
      { status: 500 },
    );
  }
}
