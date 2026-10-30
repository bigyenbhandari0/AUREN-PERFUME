import { useId } from "react";

type Props = { id: string; name: string; className?: string };

/** Original SVG perfume bottles. viewBox 0 0 200 400; base sits at y≈380. */
export function Bottle({ id, name, className }: Props) {
  const u = useId().replace(/:/g, "");
  const g = (k: string) => `${u}-${k}`;
  const label = (x: number, y: number, w: number, h: number, dark = false) => (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={1.5} fill={dark ? "#1b1414" : "#efe6d6"} opacity={0.94} />
      <rect x={x + 3} y={y + 3} width={w - 6} height={h - 6} rx={1} fill="none" stroke={dark ? "#b89a6a" : "#8a7458"} strokeWidth={0.5} />
      <text x={x + w / 2} y={y + h * 0.42} textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontSize={7} letterSpacing={1.4} fill={dark ? "#d9c39a" : "#3a2e22"}>
        YOUR PRODUCT
      </text>
      <line x1={x + w * 0.3} x2={x + w * 0.7} y1={y + h * 0.55} y2={y + h * 0.55} stroke={dark ? "#b89a6a" : "#8a7458"} strokeWidth={0.4} />
      <text x={x + w / 2} y={y + h * 0.78} textAnchor="middle" fontFamily="Inter, sans-serif" fontSize={4.6} letterSpacing={1.2} fill={dark ? "#cdb68e" : "#5a4a38"}>
        {name.toUpperCase()}
      </text>
    </g>
  );

  const common = (
    <defs>
      <linearGradient id={g("shine")} x1="0" x2="1">
        <stop offset="0" stopColor="#fff" stopOpacity="0" />
        <stop offset="0.18" stopColor="#fff" stopOpacity="0.55" />
        <stop offset="0.3" stopColor="#fff" stopOpacity="0" />
        <stop offset="0.82" stopColor="#fff" stopOpacity="0" />
        <stop offset="0.9" stopColor="#fff" stopOpacity="0.25" />
        <stop offset="1" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
      <linearGradient id={g("edge")} x1="0" x2="1">
        <stop offset="0" stopColor="#000" stopOpacity="0.45" />
        <stop offset="0.2" stopColor="#000" stopOpacity="0" />
        <stop offset="0.8" stopColor="#000" stopOpacity="0" />
        <stop offset="1" stopColor="#000" stopOpacity="0.5" />
      </linearGradient>
      <linearGradient id={g("bronze")} x1="0" x2="1">
        <stop offset="0" stopColor="#4a3220" />
        <stop offset="0.35" stopColor="#c99a62" />
        <stop offset="0.5" stopColor="#f0cf98" />
        <stop offset="0.7" stopColor="#9a6b3e" />
        <stop offset="1" stopColor="#3a2616" />
      </linearGradient>
      <linearGradient id={g("silver")} x1="0" x2="1">
        <stop offset="0" stopColor="#5b6168" />
        <stop offset="0.4" stopColor="#d9dee4" />
        <stop offset="0.55" stopColor="#ffffff" />
        <stop offset="0.75" stopColor="#9aa1a9" />
        <stop offset="1" stopColor="#3f444a" />
      </linearGradient>
      <linearGradient id={g("ivory")} x1="0" x2="1">
        <stop offset="0" stopColor="#a89c86" />
        <stop offset="0.45" stopColor="#f6efe2" />
        <stop offset="1" stopColor="#8f846f" />
      </linearGradient>
      <radialGradient id={g("sphere")} cx="0.35" cy="0.3" r="0.75">
        <stop offset="0" stopColor="#6b6470" />
        <stop offset="0.25" stopColor="#24202a" />
        <stop offset="1" stopColor="#050406" />
      </radialGradient>
      <linearGradient id={g("darkcap")} x1="0" x2="1">
        <stop offset="0" stopColor="#0d0809" />
        <stop offset="0.4" stopColor="#3a2a2c" />
        <stop offset="0.55" stopColor="#5a4446" />
        <stop offset="1" stopColor="#0a0607" />
      </linearGradient>
      <radialGradient id={g("shadow")} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#000" stopOpacity="0.7" />
        <stop offset="1" stopColor="#000" stopOpacity="0" />
      </radialGradient>
    </defs>
  );

  const shadow = <ellipse cx="100" cy="382" rx="78" ry="9" fill={`url(#${g("shadow")})`} />;

  let body: React.ReactNode = null;

  if (id === "ember-veil") {
    body = (
      <>
        <defs>
          <linearGradient id={g("glass")} x1="0" x2="1">
            <stop offset="0" stopColor="#5a2a08" />
            <stop offset="0.4" stopColor="#c7781e" />
            <stop offset="0.6" stopColor="#e89a3a" />
            <stop offset="1" stopColor="#4a2006" />
          </linearGradient>
          <linearGradient id={g("liq")} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f2a94a" stopOpacity="0.9" />
            <stop offset="1" stopColor="#8a3e08" stopOpacity="0.95" />
          </linearGradient>
        </defs>
        {shadow}
        {/* cap */}
        <rect x="80" y="40" width="40" height="70" rx="2" fill={`url(#${g("bronze")})`} />
        {[...Array(12)].map((_, i) => (
          <line key={i} x1="80" x2="120" y1={46 + i * 5.4} y2={46 + i * 5.4} stroke="#000" strokeOpacity="0.12" strokeWidth="0.6" />
        ))}
        <rect x="86" y="108" width="28" height="10" fill="#2a1a0e" />
        {/* body */}
        <rect x="52" y="118" width="96" height="262" rx="4" fill={`url(#${g("glass")})`} opacity="0.92" />
        <rect x="58" y="150" width="84" height="196" rx="2" fill={`url(#${g("liq")})`} opacity="0.75" />
        {/* heavy base */}
        <rect x="52" y="346" width="96" height="34" rx="4" fill="#f4c27a" opacity="0.28" />
        <rect x="52" y="346" width="96" height="2" fill="#fff" opacity="0.35" />
        <rect x="52" y="118" width="96" height="262" rx="4" fill={`url(#${g("edge")})`} />
        <rect x="52" y="118" width="96" height="262" rx="4" fill={`url(#${g("shine")})`} />
        {label(68, 226, 64, 46)}
      </>
    );
  } else if (id === "rose-static") {
    body = (
      <>
        <defs>
          <radialGradient id={g("glass")} cx="0.4" cy="0.38" r="0.7">
            <stop offset="0" stopColor="#ffe3e6" />
            <stop offset="0.45" stopColor="#e7a3ac" />
            <stop offset="1" stopColor="#7d3d48" />
          </radialGradient>
          <linearGradient id={g("liq")} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f6b8c0" stopOpacity="0.6" />
            <stop offset="1" stopColor="#b25a68" stopOpacity="0.9" />
          </linearGradient>
          <clipPath id={g("clip")}>
            <circle cx="100" cy="280" r="96" />
          </clipPath>
        </defs>
        {shadow}
        <circle cx="100" cy="118" r="38" fill={`url(#${g("sphere")})`} />
        <ellipse cx="88" cy="104" rx="10" ry="6" fill="#fff" opacity="0.25" />
        <rect x="86" y="152" width="28" height="36" fill={`url(#${g("silver")})`} />
        <rect x="86" y="160" width="28" height="1" fill="#000" opacity="0.3" />
        <circle cx="100" cy="280" r="96" fill={`url(#${g("glass")})`} opacity="0.9" />
        <rect x="0" y="236" width="200" height="160" fill={`url(#${g("liq")})`} clipPath={`url(#${g("clip")})`} opacity="0.7" />
        <circle cx="100" cy="280" r="96" fill="none" stroke="#fff" strokeOpacity="0.35" strokeWidth="1.2" />
        <circle cx="100" cy="280" r="80" fill="none" stroke="#fff" strokeOpacity="0.12" strokeWidth="6" />
        <path d="M40 240 A70 70 0 0 1 90 196" stroke="#fff" strokeOpacity="0.55" strokeWidth="5" fill="none" strokeLinecap="round" />
        {label(78, 300, 44, 30)}
      </>
    );
  } else if (id === "moss-theory") {
    body = (
      <>
        <defs>
          <linearGradient id={g("glass")} x1="0" x2="1">
            <stop offset="0" stopColor="#4f6450" />
            <stop offset="0.45" stopColor="#c6d7bd" />
            <stop offset="0.6" stopColor="#dfe9d6" />
            <stop offset="1" stopColor="#465a47" />
          </linearGradient>
          <linearGradient id={g("liq")} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#d6e5c4" stopOpacity="0.5" />
            <stop offset="1" stopColor="#6f8a5f" stopOpacity="0.85" />
          </linearGradient>
        </defs>
        {shadow}
        <ellipse cx="100" cy="150" rx="40" ry="34" fill={`url(#${g("ivory")})`} />
        <ellipse cx="88" cy="138" rx="12" ry="7" fill="#fff" opacity="0.45" />
        <rect x="84" y="178" width="32" height="26" fill="#cbbf9f" />
        <path d="M30 380 L30 250 Q30 206 74 204 L126 204 Q170 206 170 250 L170 380 Z" fill={`url(#${g("glass")})`} opacity="0.9" />
        <path d="M38 372 L38 262 Q38 232 74 230 L126 230 Q162 232 162 262 L162 372 Z" fill={`url(#${g("liq")})`} opacity="0.75" />
        <path d="M30 380 L30 250 Q30 206 74 204 L126 204 Q170 206 170 250 L170 380 Z" fill={`url(#${g("edge")})`} />
        <path d="M30 380 L30 250 Q30 206 74 204 L126 204 Q170 206 170 250 L170 380 Z" fill={`url(#${g("shine")})`} />
        <rect x="30" y="364" width="140" height="16" fill="#fff" opacity="0.12" />
        {label(66, 280, 68, 42)}
      </>
    );
  } else if (id === "blue-hour") {
    body = (
      <>
        <defs>
          <linearGradient id={g("glass")} x1="0" x2="1">
            <stop offset="0" stopColor="#050c26" />
            <stop offset="0.4" stopColor="#1d3a8a" />
            <stop offset="0.55" stopColor="#3a5fc0" />
            <stop offset="1" stopColor="#040a20" />
          </linearGradient>
          <linearGradient id={g("liq")} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#4a74d8" stopOpacity="0.5" />
            <stop offset="1" stopColor="#0b1a52" stopOpacity="0.9" />
          </linearGradient>
        </defs>
        {shadow}
        <rect x="84" y="40" width="32" height="74" rx="1.5" fill={`url(#${g("silver")})`} />
        <rect x="84" y="108" width="32" height="2" fill="#000" opacity="0.35" />
        <rect x="88" y="114" width="24" height="16" fill="#9aa1a9" />
        <path d="M66 380 L66 150 Q66 132 84 130 L116 130 Q134 132 134 150 L134 380 Z" fill={`url(#${g("glass")})`} opacity="0.95" />
        <rect x="71" y="170" width="58" height="200" fill={`url(#${g("liq")})`} opacity="0.7" />
        <path d="M66 380 L66 150 Q66 132 84 130 L116 130 Q134 132 134 150 L134 380 Z" fill={`url(#${g("edge")})`} />
        <path d="M66 380 L66 150 Q66 132 84 130 L116 130 Q134 132 134 150 L134 380 Z" fill={`url(#${g("shine")})`} />
        <rect x="66" y="360" width="68" height="20" fill="#8fb0ff" opacity="0.12" />
        <rect x="66" y="232" width="68" height="0.8" fill={`url(#${g("silver")})`} />
        <rect x="66" y="296" width="68" height="0.8" fill={`url(#${g("silver")})`} />
        <text x="100" y="262" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontSize="7" letterSpacing="1.4" fill="#e6ebf2">YOUR PRODUCT</text>
        <text x="100" y="276" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="4.6" letterSpacing="1.4" fill="#b8c2d6">BLUE HOUR</text>
      </>
    );
  } else {
    // velvet-after: broad faceted
    body = (
      <>
        <defs>
          <linearGradient id={g("glass")} x1="0" x2="1">
            <stop offset="0" stopColor="#2a0409" />
            <stop offset="0.45" stopColor="#8a1c2c" />
            <stop offset="0.6" stopColor="#b02c40" />
            <stop offset="1" stopColor="#22030a" />
          </linearGradient>
        </defs>
        {shadow}
        <rect x="68" y="84" width="64" height="58" rx="2" fill={`url(#${g("darkcap")})`} />
        <rect x="68" y="84" width="64" height="3" fill="#fff" opacity="0.15" />
        <rect x="84" y="142" width="32" height="16" fill={`url(#${g("bronze")})`} />
        <path d="M34 380 L26 196 L52 158 L148 158 L174 196 L166 380 Z" fill={`url(#${g("glass")})`} opacity="0.95" />
        {/* facets */}
        <path d="M52 158 L64 200 L136 200 L148 158 Z" fill="#fff" opacity="0.12" />
        <path d="M26 196 L64 200 L60 350 L34 380 Z" fill="#000" opacity="0.25" />
        <path d="M174 196 L136 200 L140 350 L166 380 Z" fill="#000" opacity="0.32" />
        <path d="M60 350 L140 350 L166 380 L34 380 Z" fill="#ff9fb0" opacity="0.14" />
        <path d="M64 200 L136 200 L140 350 L60 350 Z" fill="#c43a52" opacity="0.25" />
        <path d="M34 380 L26 196 L52 158 L148 158 L174 196 L166 380 Z" fill={`url(#${g("shine")})`} />
        <path d="M34 380 L26 196 L52 158 L148 158 L174 196 L166 380 Z" fill="none" stroke="#ffb3c0" strokeOpacity="0.25" strokeWidth="0.8" />
        {label(72, 246, 56, 42, true)}
      </>
    );
  }

  return (
    <svg viewBox="0 0 200 400" className={className} role="img" aria-label={`${name} bottle`}>
      {common}
      {body}
    </svg>
  );
}
