import { Fragment } from 'react';

/**
 * Text with the presenter's emphasis: **words** in bold teal (the idea), !!words!! in bold red (the one
 * thing to look at). Everything else stays plain.
 */
export function Rich({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|!![^!]+!!)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith('**') && p.endsWith('**') && p.length > 4 ? (
          <b key={i} className="hl">
            {p.slice(2, -2)}
          </b>
        ) : p.startsWith('!!') && p.endsWith('!!') && p.length > 4 ? (
          <b key={i} className="hl-red">
            {p.slice(2, -2)}
          </b>
        ) : (
          <Fragment key={i}>{p}</Fragment>
        ),
      )}
    </>
  );
}

/** the same text without its marks (for tests and anything that needs plain words) */
export const plain = (text: string) => text.replace(/\*\*([^*]+)\*\*|!!([^!]+)!!/g, (_, a, b) => a ?? b);
