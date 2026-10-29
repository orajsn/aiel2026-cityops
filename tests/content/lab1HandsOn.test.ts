import { LAB1_HANDS_ON } from '../../src/content/lab1HandsOn';
import { buildScenes } from '../../src/scenes';

const all = JSON.stringify(LAB1_HANDS_ON);
const lines = Object.values(LAB1_HANDS_ON).flatMap((e) => e.steps.flatMap((s) => (s.code ?? []).map((l) => l.t + (l.v ?? '') + (l.after ?? ''))));

test('every hands-on drawer has steps, each with a title', () => {
  expect(Object.keys(LAB1_HANDS_ON).sort()).toEqual(['1.3a', '1.4', '1.5', '1.6', '1.6a', '1.7', '1.8', '1.9']);
  for (const [id, e] of Object.entries(LAB1_HANDS_ON)) {
    expect(e.steps.length, id).toBeGreaterThan(0);
    for (const s of e.steps) expect(s.title.trim().length, id).toBeGreaterThan(0);
  }
});

test('no "copilot", no model or vendor names, no banned names', () => {
  expect(all).not.toMatch(/copilot/i);
  expect(all).not.toMatch(/\b(gpt|openai|llama|cohere|gemini|grok|claude|anthropic|mistral|xai)\b/i);
  expect(all).not.toMatch(/Kirkland|\bMEA\b|\bMWA\b|\bBMA\b|fictional/i);
});

test('placeholders only: no real-looking OCIDs, vector store IDs or addresses', () => {
  expect(all).not.toMatch(/ocid1\.[a-z]+\.[a-z0-9-]*\.[a-z0-9-]*\.[a-z0-9]{10,}/i);
  expect(all).not.toMatch(/\bvs_[a-z]+_[a-z0-9]{4,}/i);
  expect(all).not.toMatch(/https?:\/\/(?!127\.0\.0\.1|<)/);
  expect(all).toContain('<Project OCID>');
});

test("the guide's own lines are there", () => {
  expect(lines).toContain('    if cfg.get("model_routing_enabled") and not messages_include_images(messages):');
  expect(lines).toContain('from prompt_injection_guardrails import check_prompt_injection');
  expect(lines).toContain('    if guardrail_check.blocked:');
  expect(lines).toContain("curl -fL '<launch-helper-par>' -o launch-container-instance.sh");
  expect(lines).toContain('OCI_GENAI_PROMPT_PROTECTION_ENABLED=true');
  expect(lines).toContain('OCI_GENAI_MODEL_ROUTING_ENABLED=true');
});

test('with Lab 1 out of the show, no page has a hands-on drawer', () => {
  const ids = buildScenes(false).map((s) => s.id);
  expect(ids.filter((id) => id in LAB1_HANDS_ON)).toEqual([]);
});
