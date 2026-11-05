# InsightFlow API smoke tests

Run the app locally with `npm run dev`, then use these commands in a second terminal. These checks use demo mode and do not require an OpenAI API key.

## Inquiry Partner

```bash
curl -i -sS http://localhost:3000/api/inquiry \
  -H 'Content-Type: application/json' \
  -d '{"pattern":"Decision Flow","reflection":"Approvals seem to move upward"}'
```

Expected: HTTP 200, three `questions`, and `mode: "demo"` when live AI is disabled.

## Experiment Designer

```bash
curl -i -sS http://localhost:3000/api/experiment \
  -H 'Content-Type: application/json' \
  -d '{"possibility":"Look for a missing perspective","pattern":"Decision Flow"}'
```

Expected: HTTP 200 with `design`, `quality`, and `mode: "demo"`.

## Learning Synthesis

```bash
curl -i -sS http://localhost:3000/api/learning \
  -H 'Content-Type: application/json' \
  -d '{"pattern":"Decision Flow","hypothesis":"Sharing context earlier will help","outcome":"Fewer clarification messages","hypothesisResult":"supported","learningQuestion":"Does this hold across teams?"}'
```

Expected: HTTP 200 with `synthesis`, `quality`, `confidence`, and `mode: "demo"`.

## Error handling

Each of the following should return HTTP 400 with a JSON error message:

```bash
# Missing experiment possibility
curl -i -sS http://localhost:3000/api/experiment -H 'Content-Type: application/json' -d '{}'

# Invalid inquiry evidence shape
curl -i -sS http://localhost:3000/api/inquiry -H 'Content-Type: application/json' -d '{"pattern":"Decision Flow","evidence":[{"person":5,"quote":"example"}]}'

# Missing learning observation
curl -i -sS http://localhost:3000/api/learning -H 'Content-Type: application/json' -d '{"hypothesisResult":"supported"}'

# Malformed JSON
curl -i -sS http://localhost:3000/api/learning -H 'Content-Type: application/json' -d '{'
```

These are manual verification commands, not an automated test suite. Also run `npm run lint` and `npm run build` before merging.
