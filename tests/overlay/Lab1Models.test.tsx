import { render } from '@testing-library/react';
import { ASSUMED, ATTACK, CANNOT_PROVE, FAIL_CLOSED, L1Baseline, L1Guardrails, L1Launch, L1Routing, L1SitePhoto, OBSERVED } from '../../src/overlay/concepts/lab1/Lab1Models';
import { attrs, expectNoCostNumbers, expectNoRed, expectOneRed } from './lab1Helpers';

test('1.6a launch the app: 3B Launch on OCI with a resource principal, no key stored; it opens the same app', () => {
  const c = render(<L1Launch kicker="k" message="m" />).container;
  expect(attrs(c, 'data-path')).toEqual(['3B']);
  expect(c.querySelectorAll('[data-path="3B"] [data-launch-step]')).toHaveLength(4);
  expect(c.querySelector('[data-credential="resource-principal"]')?.textContent).toContain('no key is stored in the image');
  expect(c.textContent).not.toContain('3A');
  for (const w of ['On OCI Container Instances', 'Cloud Shell', 'Launch Helper', 'Project OCID', 'semantic store OCID']) expect(c.textContent).toContain(w);
  expect(c.querySelector('[data-app]')?.textContent).toContain('Seer Construction Intelligence');
  expectNoRed(c);
});

test('1.6 site photo: the steel delivery photo, observed apart from assumed, what a photo cannot prove (the one red), same model', () => {
  const c = render(<L1SitePhoto kicker="k" message="m" />).container;
  expect(c.querySelector('[data-photo="steel-delivery"]')).not.toBeNull();
  expect(c.querySelector('[data-attached]')?.textContent).toContain('structural-steel delivery photo');
  const obs = c.querySelector('[data-observed="list"]')!;
  const ass = c.querySelector('[data-assumed="list"]')!;
  for (const o of OBSERVED) expect(obs.textContent).toContain(o);
  for (const a of ASSUMED) expect(ass.textContent).toContain(a);
  expect(obs.contains(ass)).toBe(false);
  for (const w of CANNOT_PROVE) expect(c.querySelector('[data-caution]')?.textContent).toContain(w);
  expect(c.querySelector('[data-notice] [data-runtime]')?.getAttribute('data-runtime')).toBe('the multimodal model');
  expectOneRed(c, '[data-caution]');
});

test('1.7 baseline: three requests, text or photo, all on the multimodal model; the runtime bar says so each time; no numbers', () => {
  const c = render(<L1Baseline kicker="k" message="m" />).container;
  expect(attrs(c, 'data-request')).toEqual(['text', 'text', 'photo']);
  expect(c.querySelector('[data-flow="all-to-one"]')).not.toBeNull();
  expect(c.querySelector('[data-model="multimodal"]')?.textContent).toContain('Multimodal model');
  expect(attrs(c, 'data-runtime')).toEqual(['the multimodal model', 'the multimodal model', 'the multimodal model']);
  expect(attrs(c, 'data-cost')).toEqual(['3', '3', '3']);
  expect(c.querySelector('[data-question="baseline"]')?.textContent).toContain('Do they need a model that can see?');
  expectNoCostNumbers(c);
  expectNoRed(c);
});

test('1.8 routing: response_model asks "has an image?", text to the lower-cost model, photos to the multimodal; cost stays qualitative', () => {
  const c = render(<L1Routing kicker="k" message="m" />).container;
  expect(c.querySelector('[data-router]')?.textContent).toContain('response_model');
  expect(c.querySelector('[data-model="lower-cost"]')?.textContent).toContain('text-only requests');
  expect(c.querySelector('[data-model="multimodal"]')?.textContent).toContain('requests with an image');
  expect(c.querySelector('[data-model="lower-cost"] [data-cost]')?.getAttribute('data-cost')).toBe('1');
  expect(c.querySelector('[data-model="multimodal"] [data-cost]')?.getAttribute('data-cost')).toBe('3');
  expect(c.querySelector('[data-turn-on]')?.textContent).toContain('Runtime configuration › Model routing');
  expect(c.querySelector('[data-cost-note]')?.textContent).toContain('Response time is not cost.');
  expectNoCostNumbers(c);
  expectNoRed(c);
});

test('1.9 guardrails: allowed passes, the attack is blocked before the model (the one red), and the check fails closed', () => {
  const c = render(<L1Guardrails kicker="k" message="m" />).container;
  expect(c.querySelector('[data-setting]')?.textContent).toContain('OCI_GENAI_PROMPT_PROTECTION_ENABLED=true');
  expect(attrs(c, 'data-lane')).toEqual(['allowed', 'attack']);
  expect(c.querySelector('[data-question="allowed"]')?.textContent).toBe('Supplier recommendation');
  expect(c.querySelector('[data-question="attack"]')?.textContent).toBe(`“${ATTACK}”`);
  expect(c.querySelector('[data-lane="attack"] [data-shield="x"]')).not.toBeNull();
  expect(c.querySelector('[data-model-called="false"]')?.textContent).toContain('never called');
  expect(c.querySelector('[data-result="blocked"]')?.textContent).toContain('Blocked by guardrails');
  expect(c.querySelector('[data-result="blocked"]')?.textContent).toContain('no supplier approved');
  expect(attrs(c, 'data-failure')).toEqual(FAIL_CLOSED);
  expect(c.querySelector('[data-stops]')?.textContent).toContain('the request stops');
  expectOneRed(c, '[data-result="blocked"]');
});
