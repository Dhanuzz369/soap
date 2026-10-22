/**
 * Flat SVG pack drawings (240×240 viewBox), shared by ProductVisual, the hero range
 * composition and the OG image script. Classes pv-b/pv-d/pv-l/pv-g take the category tint.
 */

export type Shape =
  | 'squeeze' | 'jug' | 'spray' | 'pump' | 'angled'
  | 'bar' | 'bar-clear' | 'bar-duo' | 'bar-long' | 'tub'
  | 'pouch' | 'carboy' | 'drum' | 'sack';

export const bySlug: Record<string, Shape> = {
  'dish-wash-liquid': 'squeeze',
  'herbal-phenol': 'squeeze',
  'fabric-softener': 'jug',
  'liquid-detergent': 'jug',
  'floor-cleaner': 'jug',
  'glass-cleaner': 'spray',
  'multi-surface-cleaner': 'spray',
  'bathroom-tile-cleaner': 'spray',
  'liquid-hand-wash': 'pump',
  'body-wash-shower-gel': 'pump',
  'toilet-bowl-cleaner': 'angled',
  'glycerin-transparent-soap': 'bar-clear',
  'hotel-guest-soap': 'bar-duo',
  'laundry-soap-bar': 'bar-long',
  'dish-wash-bar': 'tub',
  'detergent-powder': 'pouch',
  'bulk-institutional-cleaners': 'carboy',
  labsa: 'drum',
  sles: 'drum',
  'soap-noodles': 'sack',
};

export const byCategory: Record<string, Shape> = {
  'bath-personal-soaps': 'bar',
  'laundry-care': 'jug',
  'kitchen-care': 'squeeze',
  'surface-home-cleaners': 'spray',
  'industrial-raw-materials': 'drum',
};

export const shapeFor = (slug: string, category: string): Shape =>
  bySlug[slug] ?? byCategory[category] ?? 'squeeze';

/* a small leaf mark printed on every label; centred at (x, y) */
export const leaf = (x: number, y: number, s = 1) =>
  `<g transform="translate(${x} ${y}) scale(${s})"><path class="pv-d" d="M0-11C9-7 9 6 0 11C-9 6-9-7 0-11Z"/><path class="pv-l" d="M-.9-7h1.8v16h-1.8z"/></g>`;

const label = (x: number, y: number, w: number, h: number, r = 6) =>
  `<rect class="pv-l" x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}"/>` +
  leaf(x + w / 2, y + h / 2 - 6, 0.9) +
  `<rect class="pv-b" x="${x + w / 2 - 14}" y="${y + h / 2 + 12}" width="28" height="4" rx="2"/>`;

export const shapes: Record<Shape, string> = {
  squeeze:
    `<ellipse class="pv-g" cx="120" cy="213" rx="42" ry="5"/>` +
    `<rect class="pv-d" x="114" y="18" width="12" height="12" rx="2"/>` +
    `<rect class="pv-d" x="104" y="28" width="32" height="26" rx="5"/>` +
    `<path class="pv-b" d="M86 98Q86 72 108 64V54h24v10q22 8 22 34v98q0 16-16 16h-36q-16 0-16-16Z"/>` +
    `<rect class="pv-l pv-hl" x="93" y="84" width="7" height="116" rx="3.5"/>` +
    label(98, 116, 48, 66),
  jug:
    `<ellipse class="pv-g" cx="120" cy="213" rx="54" ry="5"/>` +
    `<rect class="pv-d" x="99" y="50" width="42" height="24" rx="4"/>` +
    `<path class="pv-l pv-hl" d="M104 58h32v3h-32zM104 65h32v3h-32z"/>` +
    `<path class="pv-b" fill-rule="evenodd" d="M68 122q0-32 30-36l6-12h32l6 12h8q22 6 22 34v76q0 16-16 16H84q-16 0-16-16ZM146 102h10a5 5 0 0 1 5 5v26a5 5 0 0 1-5 5h-10a5 5 0 0 1-5-5v-26a5 5 0 0 1 5-5Z"/>` +
    `<rect class="pv-l pv-hl" x="76" y="110" width="7" height="90" rx="3.5"/>` +
    label(90, 146, 66, 52),
  spray:
    `<ellipse class="pv-g" cx="120" cy="213" rx="40" ry="5"/>` +
    `<path class="pv-d" d="M100 84V60q0-12 12-12h46q6 0 6 6v8q0 6-6 6h-20v16Z"/>` +
    `<rect class="pv-d" x="164" y="52" width="9" height="10" rx="2"/>` +
    `<path class="pv-d" d="M116 68h10l4 28q1 5-4 5h-5q-4 0-4-5Z"/>` +
    `<rect class="pv-b" x="106" y="80" width="28" height="18" rx="3"/>` +
    `<path class="pv-b" d="M90 116q0-20 18-20h24q18 0 18 20v80q0 16-16 16h-28q-16 0-16-16Z"/>` +
    `<rect class="pv-l pv-hl" x="97" y="112" width="7" height="88" rx="3.5"/>` +
    label(103, 132, 40, 58),
  pump:
    `<ellipse class="pv-g" cx="120" cy="213" rx="44" ry="5"/>` +
    `<rect class="pv-d" x="98" y="38" width="48" height="14" rx="7"/>` +
    `<rect class="pv-d" x="142" y="41" width="24" height="7" rx="3.5"/>` +
    `<rect class="pv-d" x="115" y="50" width="12" height="30" rx="2"/>` +
    `<rect class="pv-d" x="104" y="76" width="34" height="18" rx="4"/>` +
    `<path class="pv-b" d="M82 118q0-26 26-26h26q26 0 26 26v78q0 16-16 16h-46q-16 0-16-16Z"/>` +
    `<rect class="pv-l pv-hl" x="90" y="110" width="7" height="90" rx="3.5"/>` +
    label(100, 128, 48, 62),
  angled:
    `<ellipse class="pv-g" cx="120" cy="213" rx="40" ry="5"/>` +
    `<path class="pv-d" d="M140 30l16 11-10 14-16-11Z"/>` +
    `<path class="pv-b" d="M104 102V80l28-40 16 11-24 34v17Z"/>` +
    `<path class="pv-b" d="M88 122q0-24 22-24h18q22 0 22 24v74q0 16-16 16h-30q-16 0-16-16Z"/>` +
    `<rect class="pv-l pv-hl" x="95" y="116" width="7" height="84" rx="3.5"/>` +
    label(104, 132, 40, 58),
  bar:
    `<ellipse class="pv-g" cx="120" cy="206" rx="76" ry="6"/>` +
    `<rect class="pv-d" x="118" y="56" width="74" height="104" rx="4"/>` +
    `<rect class="pv-l" x="118" y="92" width="74" height="30"/>` +
    leaf(155, 107, 0.8) +
    `<path class="pv-d" d="M44 150q0-6 6-6h140q6 0 6 6v18q0 30-30 30H74q-30 0-30-30Z" opacity=".55"/>` +
    `<rect class="pv-b" x="44" y="118" width="152" height="64" rx="32"/>` +
    `<ellipse class="pv-l pv-hl" cx="120" cy="150" rx="46" ry="17"/>` +
    leaf(120, 150, 0.8),
  'bar-clear':
    `<ellipse class="pv-g" cx="120" cy="206" rx="72" ry="6"/>` +
    `<rect class="pv-b" x="58" y="148" width="124" height="52" rx="22" opacity=".55"/>` +
    `<rect class="pv-b" x="66" y="86" width="108" height="66" rx="24" opacity=".7"/>` +
    `<rect class="pv-l" x="78" y="96" width="34" height="8" rx="4" opacity=".9"/>` +
    `<rect class="pv-l" x="70" y="158" width="44" height="8" rx="4" opacity=".9"/>` +
    `<ellipse class="pv-d" cx="120" cy="119" rx="26" ry="10" opacity=".35"/>` +
    leaf(120, 119, 0.7),
  'bar-duo':
    `<ellipse class="pv-g" cx="120" cy="206" rx="78" ry="6"/>` +
    `<path class="pv-d" d="M42 130h6v-6h64v6h6v52h-6v6H48v-6h-6Z"/>` +
    `<rect class="pv-l" x="48" y="140" width="64" height="32"/>` +
    leaf(80, 156, 0.7) +
    `<path class="pv-b" d="M122 150q0-4 4-4h64q4 0 4 4v42q0 10-10 10h-52q-10 0-10-10Z" opacity=".6"/>` +
    `<rect class="pv-b" x="122" y="126" width="72" height="56" rx="24"/>` +
    `<ellipse class="pv-l pv-hl" cx="158" cy="154" rx="22" ry="11"/>`,
  'bar-long':
    `<ellipse class="pv-g" cx="120" cy="200" rx="92" ry="6"/>` +
    `<rect class="pv-d" x="30" y="132" width="180" height="62" rx="28" opacity=".55"/>` +
    `<rect class="pv-b" x="30" y="108" width="180" height="70" rx="28"/>` +
    `<rect class="pv-l pv-hl" x="48" y="118" width="70" height="9" rx="4.5"/>` +
    `<rect class="pv-l" x="76" y="132" width="88" height="34" rx="17" opacity=".75"/>` +
    leaf(102, 149, 0.75) +
    `<rect class="pv-d" x="114" y="146" width="36" height="6" rx="3" opacity=".6"/>`,
  tub:
    `<ellipse class="pv-g" cx="120" cy="208" rx="62" ry="6"/>` +
    `<path class="pv-b" d="M60 116h120l-8 80q-52 18-104 0Z"/>` +
    `<path class="pv-l" d="M64 146h112l-3 34q-53 14-106 0Z"/>` +
    leaf(120, 163, 0.85) +
    `<ellipse class="pv-d" cx="120" cy="116" rx="64" ry="16"/>` +
    `<ellipse class="pv-b" cx="120" cy="110" rx="58" ry="12"/>` +
    `<ellipse class="pv-l pv-hl" cx="104" cy="108" rx="26" ry="4"/>`,
  pouch:
    `<ellipse class="pv-g" cx="120" cy="212" rx="56" ry="5"/>` +
    `<path class="pv-b" d="M74 62h92l6 136q0 12-12 12H80q-12 0-12-12Z"/>` +
    `<rect class="pv-d" x="74" y="62" width="92" height="16"/>` +
    `<path class="pv-l" d="M74 90h92v4H74z" opacity=".7"/>` +
    `<path class="pv-g" d="M68 196q52-18 104 0v2q0 12-12 12H80q-12 0-12-12Z"/>` +
    `<rect class="pv-l" x="90" y="112" width="60" height="70" rx="30"/>` +
    `<g class="pv-d"><circle cx="108" cy="136" r="3"/><circle cx="120" cy="130" r="3"/><circle cx="132" cy="138" r="3"/><circle cx="114" cy="150" r="3"/><circle cx="127" cy="152" r="3"/><circle cx="120" cy="164" r="3"/></g>`,
  carboy:
    `<ellipse class="pv-g" cx="120" cy="213" rx="64" ry="5"/>` +
    `<path class="pv-b" fill-rule="evenodd" d="M74 70h52a8 8 0 0 1 8 8v16H64V80q0-10 10-10ZM80 80v8h40v-8Z"/>` +
    `<rect class="pv-d" x="146" y="70" width="26" height="24" rx="4"/>` +
    `<path class="pv-b" d="M56 108q0-16 16-16h96q16 0 16 16v88q0 16-16 16H72q-16 0-16-16Z"/>` +
    `<rect class="pv-d" x="56" y="126" width="128" height="5" opacity=".25"/>` +
    `<rect class="pv-d" x="56" y="190" width="128" height="5" opacity=".25"/>` +
    label(82, 138, 76, 46),
  drum:
    `<ellipse class="pv-g" cx="120" cy="212" rx="64" ry="6"/>` +
    `<path class="pv-b" d="M64 62h112v142q-56 16-112 0Z"/>` +
    `<path class="pv-d" d="M64 102q56 14 112 0v9q-56 14-112 0ZM64 160q56 14 112 0v9q-56 14-112 0Z" opacity=".6"/>` +
    `<rect class="pv-l pv-hl" x="72" y="74" width="8" height="122" rx="4"/>` +
    label(96, 120, 48, 34) +
    `<ellipse class="pv-l" cx="120" cy="62" rx="56" ry="13"/>` +
    `<ellipse class="pv-d" cx="148" cy="60" rx="7" ry="3"/>` +
    `<ellipse class="pv-d" cx="98" cy="64" rx="4" ry="2"/>`,
  sack:
    `<ellipse class="pv-g" cx="120" cy="210" rx="64" ry="6"/>` +
    `<path class="pv-b" d="M66 72q54-14 108 0l8 124q-62 18-124 0Z"/>` +
    `<path class="pv-d" d="M66 72q54-14 108 0v14q-54-14-108 0Z"/>` +
    `<path class="pv-d" d="M66 72l-8-10 14 4ZM174 72l8-10-14 4Z"/>` +
    `<g class="pv-l">${Array.from({ length: 9 }, (_, i) => `<rect x="${74 + i * 11}" y="${74 + Math.abs(4 - i) * 0.9}" width="6" height="2" rx="1"/>`).join('')}</g>` +
    `<rect class="pv-l" x="86" y="112" width="68" height="62" rx="6"/>` +
    `<g class="pv-b"><rect x="98" y="124" width="18" height="6" rx="3"/><rect x="120" y="130" width="22" height="6" rx="3"/><rect x="100" y="140" width="22" height="6" rx="3"/><rect x="104" y="156" width="16" height="6" rx="3"/><rect x="124" y="150" width="18" height="6" rx="3"/></g>`,
};

