import lab2 from '../../src/content/notebooks/lab2_rag_to_agents.json';
import { LAB2_FOCUS } from '../../src/content/lab2Focus';
import { chapter1 } from '../../src/scenes/chapter1';

const cells = (lab2 as { cells: { type: string; source: string }[] }).cells;
const lines = (cell: number) => cells[cell].source.replace(/\n$/, '').split('\n');

test('every focus step points at a real code cell and real lines of it, in the notebook as it is', () => {
  for (const [id, steps] of Object.entries(LAB2_FOCUS)) {
    expect(chapter1.some((s) => s.id === id), id).toBe(true);
    for (const s of steps) {
      expect(cells[s.cell]?.type, `${id} cell ${s.cell}`).toBe('code');
      for (const [a, b] of s.lines ?? []) {
        expect(a, `${id} cell ${s.cell}`).toBeGreaterThanOrEqual(1);
        expect(b, `${id} cell ${s.cell}`).toBeGreaterThanOrEqual(a);
        expect(b, `${id} cell ${s.cell}`).toBeLessThanOrEqual(lines(s.cell).length);
      }
    }
  }
});

test('the highlighted lines are the ones the deck points at', () => {
  const at = (id: string, k: number) => {
    const s = LAB2_FOCUS[id][k];
    const [a, b] = s.lines![0];
    return lines(s.cell).slice(a - 1, b).join('\n');
  };
  expect(at('0.6', 1)).toContain('Respond with exactly the single word READY');
  expect(at('2.2c', 1)).toContain('VECTOR_EMBEDDING');
  expect(at('2.2d', 3)).toContain('FETCH FIRST :k ROWS ONLY');
  expect(at('2.3', 0)).toContain('ONLY the facts in <context>');
  expect(at('2.4f', 0)).toContain('Literal["routine", "warning", "critical"]');
  expect(at('2.4h', 3)).toContain('format_report(incident, triage, draft)');
  expect(at('2.5c', 0)).toBe('@tool');
  expect(at('2.5d', 3)).toContain('Crack width > 1.0 mm');
  for (const steps of Object.values(LAB2_FOCUS)) for (const s of steps) expect(s.note ?? '').not.toMatch(/^Here:/); // the drawer writes “Here:” itself
  expect(at('2.6c', 3)).toContain('get_asset_incident_brief_raw');
  expect(at('2.7', 2)).toContain('add_conditional_edges("model"');
  expect(at('2.7', 3)).toContain('graph.add_edge("tools", "model")');
  expect(at('2.7e', 2)).toContain('.bind_tools(AGENT_TOOLS)');
  expect(at('2.7f', 1)).toContain('untrusted data');
  expect(at('2.8', 1)).toContain('asset_name');
});

test('callout numbers stay within the picture’s steps, labels are short', () => {
  for (const [id, steps] of Object.entries(LAB2_FOCUS)) {
    for (const s of steps) {
      expect(s.n, id).toBeGreaterThanOrEqual(1);
      expect(s.n, id).toBeLessThanOrEqual(8);
      expect(s.label.length, `${id} ${s.label}`).toBeLessThan(60);
      expect(`${s.label} ${s.note ?? ''}`, id).not.toMatch(/\bpier\s*\d|llama|ollama/i);
    }
  }
});
