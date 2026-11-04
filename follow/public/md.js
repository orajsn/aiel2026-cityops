// Markdown for the scripts on the phone page (owner, 4 Nov): # headings, **bold**, *italic*, `code`, [links](https://...), - and 1. lists,
// > quotes, paragraphs and line breaks. Builds DOM nodes and never innerHTML, because colleagues write these scripts. Underscores stay
// plain text, so names like CITY_MEMORY and call_copilot are safe.
(() => {
  const INLINE = /\*\*([^\n]+?)\*\*|\*(?=\S)([^*\n]+?)(?<=\S)\*|`([^`\n]+)`|\[([^\]\n]+)\]\((https?:\/\/[^\s)]+)\)/g;

  function inline(parent, text) {
    let at = 0;
    for (const m of text.matchAll(INLINE)) {
      if (m.index > at) parent.append(text.slice(at, m.index));
      if (m[1] !== undefined) {
        const e = document.createElement('strong');
        inline(e, m[1]);
        parent.append(e);
      } else if (m[2] !== undefined) {
        const e = document.createElement('em');
        inline(e, m[2]);
        parent.append(e);
      } else if (m[3] !== undefined) {
        const e = document.createElement('code');
        e.textContent = m[3];
        parent.append(e);
      } else {
        const e = document.createElement('a');
        e.href = m[5];
        e.target = '_blank';
        e.rel = 'noopener noreferrer';
        inline(e, m[4]);
        parent.append(e);
      }
      at = m.index + m[0].length;
    }
    if (at < text.length) parent.append(text.slice(at));
  }

  function lines(parent, rows) {
    rows.forEach((row, i) => {
      if (i) parent.append(document.createElement('br'));
      inline(parent, row);
    });
  }

  const ITEM = { ul: /^\s*[-*+]\s+/, ol: /^\s*\d+[.)]\s+/ };

  /** appends the markdown's blocks to `box` */
  window.renderMarkdown = (box, text) => {
    for (const block of text.replace(/\r\n/g, '\n').split(/\n\s*\n+/)) {
      const rows = block.split('\n').filter((r) => r.trim());
      if (!rows.length) continue;
      const heading = rows.length === 1 && rows[0].match(/^(#{1,4})\s+(.*)$/);
      const kind = ['ul', 'ol'].find((k) => rows.every((r) => ITEM[k].test(r)));
      if (heading) {
        const e = document.createElement(`h${Math.min(heading[1].length + 2, 6)}`);
        inline(e, heading[2]);
        box.append(e);
      } else if (kind) {
        const list = document.createElement(kind);
        for (const r of rows) {
          const li = document.createElement('li');
          inline(li, r.replace(ITEM[kind], ''));
          list.append(li);
        }
        box.append(list);
      } else if (rows.every((r) => r.startsWith('>'))) {
        const q = document.createElement('blockquote');
        lines(q, rows.map((r) => r.replace(/^>\s?/, '')));
        box.append(q);
      } else {
        const p = document.createElement('p');
        lines(p, rows);
        box.append(p);
      }
    }
  };
})();
