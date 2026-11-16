import rawLab2 from '../../src/content/notebooks/lab2_rag_to_agents.json?raw';
import rawComplete from '../../src/content/notebooks/lab3_complete.json?raw';
import rawStudent from '../../src/content/notebooks/lab3_student.json?raw';
import originalComplete from '../../src/content/notebooks/lab3_complete.json';
import originalStudent from '../../src/content/notebooks/lab3_student.json';
import senayanComplete from '../../src/content/notebooks/senayan/lab3_complete.json';
import senayanStudent from '../../src/content/notebooks/senayan/lab3_student.json';
const baseline = {
  "lab2_rag_to_agents": {
    "length": 107739,
    "fingerprint": 858643942
  },
  "lab3_complete": {
    "length": 118651,
    "fingerprint": 3816125605
  },
  "lab3_student": {
    "length": 71903,
    "fingerprint": 268458273
  }
};
interface Cell { type: string; source: string; count?: number | null; outputs?: string[] }
interface Notebook { file: string; cells: Cell[] }
function fingerprint(text: string): number {
  let hash = 2166136261;
  for (let i = 0; i < text.length; i++) hash = Math.imul(hash ^ text.charCodeAt(i), 16777619) >>> 0;
  return hash;
}
test('original notebook content retains its checked-in length and regression fingerprint', () => {
  for (const [name, text] of Object.entries({ lab2_rag_to_agents: rawLab2, lab3_complete: rawComplete, lab3_student: rawStudent })) {
    const raw = text.replace(/\r\n/g, '\n');
    expect({ length: raw.length, fingerprint: fingerprint(raw) }, name).toEqual(baseline[name as keyof typeof baseline]);
  }
});
test.each([
  ['complete', originalComplete, senayanComplete],
  ['student', originalStudent, senayanStudent],
] as const)('%s variant changes only the scope assertion and its explanatory markdown', (_, original: Notebook, variant: Notebook) => {
  expect(variant.file).toBe(original.file);
  expect(variant.cells).toHaveLength(original.cells.length);
  const changed = variant.cells.map((cell, i) => ({ cell, original: original.cells[i], i })).filter(x => JSON.stringify(x.cell) !== JSON.stringify(x.original));
  const code = changed.filter(x => x.cell.type === 'code');
  expect(code).toHaveLength(1);
  expect(changed.filter(x => x.cell.type !== 'code').every(x => x.original.source.includes('multi-tenant safety guarantee') && x.cell.source.includes('does not establish'))).toBe(true);
  const cell = code[0].cell;
  expect(cell.count).toBeUndefined();
  expect(cell.outputs).toEqual(['Updated scope assertion: run this cell in your lab to generate results.']);
  expect(cell.source).not.toContain('"shift swap" not in');
  expect(cell.source).toContain('private_note_sentinel.casefold() not in r.record.content.casefold()');
  const sentinel = cell.source.match(/private_note_sentinel = "([^"]+)"/)?.[1];
  expect(sentinel).toBe('Remember to swap shifts with Jordan next Tuesday.');
  expect(original.cells.some(c => c.source.includes(`content="${sentinel}"`))).toBe(true);
  // Negative control: this exact stored message escaped the source's reversed-word check.
  expect(sentinel!.toLowerCase().includes('shift swap')).toBe(false);
  expect(sentinel!.toLowerCase().includes(sentinel!.toLowerCase())).toBe(true);
  expect('Public corrosion guideline'.toLowerCase().includes(sentinel!.toLowerCase())).toBe(false);
});
