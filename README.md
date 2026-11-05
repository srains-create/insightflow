# InsightFlow

InsightFlow is an experimental human-in-the-loop application for exploring patterns inside complex organizations. Instead of asking AI to make organizational decisions, the prototype uses AI-assisted workflows to help people examine evidence, challenge assumptions, explore possibilities, design small experiments, and capture what they learn.

The current demo uses a fictional organization, **Meridian Labs**, and synthetic evidence so the product workflow can be explored without exposing real organizational data.

## Core workflow

InsightFlow follows a learning loop:

**Data → Relationships → Patterns → Inquiry → Possibilities → Experiment → Learning**

In the current prototype, a user can:

- explore a living network of organizational relationships;
- open detected patterns and review supporting evidence;
- use the Inquiry Partner to generate context-aware questions;
- select AI-assisted questions without replacing their own reflection;
- explore possibilities based on the inquiry context;
- turn a selected possibility into a hypothesis, small experiment, observation criteria, and learning question;
- save completed inquiries to a Learning Library;
- record experiment outcomes and whether a hypothesis was supported, challenged, or inconclusive;
- continue a learning chain into a follow-up inquiry;
- generate a deterministic learning synthesis that compares the hypothesis with the recorded outcome, highlights evidence, and suggests a next inquiry.

## Human-in-the-loop AI

The central design principle is simple: **AI surfaces information, questions, and possible experiments; humans provide judgment.**

AI-assisted output is treated as a suggestion rather than a decision. Users can edit the generated content, and experiment suggestions only fill empty fields so existing human-written work is preserved.

The Inquiry Partner has a server-side OpenAI integration with a deterministic demo fallback. The prototype can therefore demonstrate the complete workflow without requiring paid API credits. Live AI can be enabled separately when an API key and credits are available.

The Experiment Designer also supports a no-cost context-aware mode. It uses the selected pattern, reflection, and possibility to create a structured experiment design while keeping the user in control of the final wording.

## Learning Library

Completed inquiries are stored locally in the browser for the prototype. The Learning Library includes:

- pattern and follow-up filters;
- full-text search across learning records;
- sorting by creation date or latest activity;
- experiment outcome follow-up;
- hypothesis result tracking;
- related learning chains;
- pattern-level learning summaries;
- on-demand Learning Synthesis with confidence guidance, missing-evidence prompts, and quality checks.

Browser `localStorage` is intentionally used for this prototype. A production version would move persistence to an authenticated database with tenant isolation and appropriate security and retention controls.

## Learning Synthesis API

After saving an outcome in the Learning Library, select **Synthesize learning** to request a structured synthesis from `POST /api/learning`. This endpoint currently runs in deterministic demo mode; it does not call a live AI model.

The endpoint accepts a JSON object with optional string fields `pattern`, `hypothesis`, `outcome`, `surprise`, `learningQuestion`, and `nextQuestion`. The optional `hypothesisResult` field must be `supported`, `challenged`, `inconclusive`, or an empty string. At least one of `outcome` or `surprise` must contain non-whitespace text.

The response includes:

- `synthesis`: comparison, changed understanding, evidence to carry forward, and next inquiry;
- `quality`: four checks with a pass flag and an explanation (`reason`);
- `confidence`: a completeness-oriented level, rationale, and missing-evidence suggestions;
- `mode: "demo"`: identifies the deterministic implementation.

Malformed field types, unsupported hypothesis results, and requests without recorded observations receive HTTP 400. Confidence reflects how complete the learning record is, **not** the probability that a hypothesis is correct.

### Manual verification

1. Run `npm run build` and `npm run dev`.
2. Open a saved inquiry in the Learning Library and record an outcome or surprise.
3. Click **Synthesize learning** and check that the synthesis, confidence guidance, and quality checks appear.
4. Click **Refresh learning synthesis** to verify that the request can be repeated.
5. Edit the recorded outcome and synthesize again; confirm the new response reflects the saved text.
6. Confirm that an incomplete request to `POST /api/learning` returns HTTP 400 rather than a server error.

## Technology

- Next.js 16
- React
- TypeScript
- Tailwind CSS
- Next.js App Router
- OpenAI SDK for the optional live Inquiry Partner
- Browser localStorage for prototype persistence

## Running locally

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

To verify a production build:

```bash
npm run build
```

## AI configuration

InsightFlow is demo-first by default and does not require an API key to run the prototype.

For live Inquiry Partner responses, configure `OPENAI_API_KEY` in the server environment and enable the project's live-AI environment flag. If live AI is unavailable, the inquiry workflow falls back to deterministic demo questions rather than blocking the user.

## Project status

InsightFlow is an evolving prototype focused on AI-assisted inquiry and organizational learning. Current development is centered on making context flow naturally between stages while preserving a clear boundary between AI assistance and human decision-making.
