import type { CSSProperties, ReactNode } from 'react';
import { at } from '../../engine/base';

const linkStyle: CSSProperties = { color: 'inherit', textUnderlineOffset: 3 };
function SourceLink({ href, children }: { href: string; children: ReactNode }) {
  return <a href={href} target="_blank" rel="noopener noreferrer" style={linkStyle}>{children}</a>;
}

/** Attribution stays outside the scaled scene so it remains usable at any screen size. */
export function MapSources({ bottomInset = 0 }: { bottomInset?: number }) {
  return <aside aria-label="Map attribution and sources" data-testid="map-sources" style={{ position: 'fixed', left: 14, bottom: bottomInset + 12, zIndex: 1200, display: 'flex', gap: 12, alignItems: 'center', maxWidth: 'calc(100vw - 28px)', padding: '5px 9px', border: '1px solid rgba(90,105,99,.18)', borderRadius: 6, background: 'rgba(250,249,244,.94)', color: '#3c4e49', fontFamily: 'Inter, sans-serif', fontSize: 11, lineHeight: 1.45, pointerEvents: 'auto' }}>
    <SourceLink href="https://www.openstreetmap.org/copyright">© OpenStreetMap contributors</SourceLink>
    <details style={{ position: 'relative' }}>
      <summary style={{ cursor: 'pointer', fontWeight: 650, whiteSpace: 'nowrap' }}>Map sources</summary>
      <div style={{ position: 'absolute', left: -180, bottom: 28, width: 'min(420px, calc(100vw - 36px))', maxHeight: 'min(440px, 65vh)', overflowY: 'auto', padding: 20, borderRadius: 10, border: '1px solid #d9dfd8', background: '#fffefa', boxShadow: '0 10px 35px rgba(20,40,30,.18)', fontSize: 13, lineHeight: 1.6 }}>
        <h2 style={{ margin: '0 0 9px', fontSize: 18, lineHeight: 1.25, color: '#213c34' }}>Senayan · map references</h2>
        <p>The neighbourhood model uses OpenStreetMap building footprints and road geometry around Fairmont, Plaza Senayan, GBK and Senayan City. Building heights combine source tags and visual estimates; this is not a survey model.</p>
        <p>The candidate crossing is on Jalan Terusan Hang Lekir V near Kali Grogol (−6.2281844, 106.7957299). Its detailed bridge shape remains provisional until checked against recent photographs.</p>
        <p><SourceLink href="https://www.openstreetmap.org/way/498447364">Crossing reference · OpenStreetMap way 498447364 ↗</SourceLink></p>
        <p>Harbor Bridge, the inspection findings and the lab asset identifiers remain fictional training material. They do not describe a real defect at this crossing. Inspection cutaways temporarily hide nearby context buildings for visibility; neighbourhood views retain their mapped footprints.</p>
        <p><SourceLink href={at('data/senayan-map-source.geojson')}>Download the map source snapshot (GeoJSON)</SourceLink></p>
        <p style={{ marginBottom: 0 }}><SourceLink href="https://www.openstreetmap.org/copyright">Map data attribution and licence ↗</SourceLink></p>
      </div>
    </details>
  </aside>;
}
