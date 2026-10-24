/** Python colouring for the Jupyter drawer, in JupyterLab's own light-theme colours. Joining the tokens gives back the source exactly. */
export type TokenKind = 'kw' | 'builtin' | 'str' | 'comment' | 'num' | 'def' | 'deco' | 'plain';
export interface Token {
  text: string;
  kind: TokenKind;
}

const KEYWORDS = new Set(
  'False None True and as assert async await break class continue def del elif else except finally for from global if import in is lambda nonlocal not or pass raise return try while with yield'.split(' '),
);
const BUILTINS = new Set('print len list dict str int float isinstance hasattr type range open super set tuple bool any all sorted enumerate zip'.split(' '));

// order matters: strings (triple first) and comments before anything that could start inside them
const RULES: [TokenKind, RegExp][] = [
  ['str', /^[rRbBfFuU]{0,2}("""[\s\S]*?(?:"""|$)|'''[\s\S]*?(?:'''|$))/],
  ['str', /^[rRbBfFuU]{0,2}("(?:\\.|[^"\\\n])*"?|'(?:\\.|[^'\\\n])*'?)/],
  ['comment', /^#[^\n]*/],
  ['deco', /^@[A-Za-z_][\w.]*/],
  ['num', /^\d[\d_]*(?:\.\d+)?(?:e[+-]?\d+)?/i],
  ['plain', /^[A-Za-z_]\w*/],
  ['plain', /^\s+/],
  ['plain', /^[^\w\s"'#@]+/],
  ['plain', /^./],
];

export function highlightPython(src: string): Token[] {
  const out: Token[] = [];
  let rest = src;
  let afterDef = false;
  while (rest.length) {
    for (const [kind, re] of RULES) {
      const m = rest.match(re);
      if (!m) continue;
      const text = m[0];
      let k: TokenKind = kind;
      if (kind === 'plain' && /^[A-Za-z_]/.test(text)) {
        if (afterDef) k = 'def';
        else if (KEYWORDS.has(text)) k = 'kw';
        else if (BUILTINS.has(text)) k = 'builtin';
      }
      if (!/^\s+$/.test(text)) afterDef = k === 'kw' && (text === 'def' || text === 'class');
      const last = out[out.length - 1];
      if (k === 'plain' && last?.kind === 'plain') last.text += text;
      else out.push({ text, kind: k });
      rest = rest.slice(text.length);
      break;
    }
  }
  return out;
}
