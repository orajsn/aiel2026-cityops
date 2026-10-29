import type { ReactNode } from 'react';
import { highlightPython } from './highlight';

/** inline marks the notebooks use: `code` and **bold** */
function inline(text: string): ReactNode[] {
  return text.split(/(`[^`]+`|\*\*.+?\*\*)/g).map((part, i) => {
    if (part.startsWith('`') && part.endsWith('`') && part.length > 1) return <code key={i}>{part.slice(1, -1)}</code>;
    if (part.startsWith('**') && part.endsWith('**') && part.length > 3) return <b key={i}>{part.slice(2, -2)}</b>;
    return part;
  });
}

export type LinePiece = { text: string; kind: string };

/** the coloured tokens of a cell, one array per line (a token that spans lines is split at the line ends) */
export function codeLines(source: string): LinePiece[][] {
  const lines: LinePiece[][] = [[]];
  for (const t of highlightPython(source)) {
    t.text.split('\n').forEach((part, j) => {
      if (j > 0) lines.push([]);
      if (part) lines[lines.length - 1].push({ text: part, kind: t.kind });
    });
  }
  return lines;
}

/** one line's pieces, coloured as JupyterLab colours them */
export const linePieces = (line: LinePiece[]) => line.map((p, j) => (p.kind === 'plain' ? p.text : <span key={j} className={`py-${p.kind}`}>{p.text}</span>));

/** `marked` tints whole lines (the TODO lines people type into); tokens are split at line ends for that */
/** `marked` lines are lit: a TODO's lines, or (tone 'guide') the part of the cell a guide step is about */
export function PythonCode({ source, marked, tone = 'todo' }: { source: string; marked?: Set<number>; tone?: 'todo' | 'guide' }) {
  const tokens = highlightPython(source);
  if (!marked?.size) {
    return <pre className="jd__code">{tokens.map((t, i) => (t.kind === 'plain' ? t.text : <span key={i} className={`py-${t.kind}`}>{t.text}</span>))}</pre>;
  }
  const lines = codeLines(source);
  return (
    <pre className="jd__code">
      {lines.map((line, i) => (
        <span key={i} data-line={i} className={`jd__line${marked.has(i) ? (tone === 'guide' ? ' jd__line--guide' : ' jd__line--mark') : ''}`}>
          {line.map((p, j) => (p.kind === 'plain' ? p.text : <span key={j} className={`py-${p.kind}`}>{p.text}</span>))}
          {'\n'}
        </span>
      ))}
    </pre>
  );
}

/**
 * Just enough Markdown for these notebooks: headings, paragraphs, quotes, lists, fenced code and the
 * <details> answer blocks (shown closed, as in JupyterLab).
 */
export function NotebookMarkdown({ source }: { source: string }) {
  const details = source.match(/<details>\s*<summary>([\s\S]*?)<\/summary>([\s\S]*?)<\/details>/);
  if (details) {
    return (
      <details className="jd__details">
        <summary>{details[1].trim()}</summary>
        <NotebookMarkdown source={details[2]} />
      </details>
    );
  }
  const blocks: ReactNode[] = [];
  const lines = source.split('\n');
  let para: string[] = [];
  const flush = () => {
    if (para.length) blocks.push(<p key={blocks.length}>{inline(para.join(' '))}</p>);
    para = [];
  };
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const fence = line.match(/^```(\w*)/);
    if (fence) {
      flush();
      const body: string[] = [];
      while (++i < lines.length && !lines[i].startsWith('```')) body.push(lines[i]);
      blocks.push(<PythonCode key={blocks.length} source={body.join('\n')} />);
      continue;
    }
    const h = line.match(/^(#{1,4})\s+(.*)/);
    if (h) {
      flush();
      const level = Math.min(h[1].length, 3);
      blocks.push(
        <div key={blocks.length} className={`jd__h jd__h${level}`}>
          {inline(h[2])}
        </div>,
      );
      continue;
    }
    if (line.startsWith('>')) {
      flush();
      blocks.push(<blockquote key={blocks.length}>{inline(line.replace(/^>\s*/, ''))}</blockquote>);
      continue;
    }
    if (/^\s*-\s+/.test(line)) {
      flush();
      blocks.push(
        <div key={blocks.length} className="jd__li">
          • {inline(line.replace(/^\s*-\s+/, ''))}
        </div>,
      );
      continue;
    }
    if (!line.trim()) flush();
    else para.push(line.trim());
  }
  flush();
  return <div className="jd__md">{blocks}</div>;
}
