import { useState } from "react";

export type Usage = {
  days: { date: string; uses: number }[];
  average: number;
};

const RANGES = [3, 7, 14, 30];
const W = 600, H = 240, L = 40, R = 16, T = 16, B = 30;
const ACCENT = "#4f8cff";
const MUTED = "#8b8b94";
const LINE = "rgba(255,255,255,0.07)";

type Pt = [number, number];

// monotone cubic through the points, so the curve never dips below the data
function smooth(p: Pt[]) {
  const n = p.length;
  if (n < 2) return `M${p[0][0]} ${p[0][1]}`;
  const dx: number[] = [], m: number[] = [], t: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    dx[i] = p[i + 1][0] - p[i][0];
    m[i] = (p[i + 1][1] - p[i][1]) / dx[i];
  }
  t[0] = m[0];
  t[n - 1] = m[n - 2];
  for (let i = 1; i < n - 1; i++) t[i] = m[i - 1] * m[i] <= 0 ? 0 : (m[i - 1] + m[i]) / 2;
  for (let i = 0; i < n - 1; i++) {
    if (m[i] === 0) { t[i] = t[i + 1] = 0; continue; }
    const a = t[i] / m[i], b = t[i + 1] / m[i], s = a * a + b * b;
    if (s > 9) {
      const k = 3 / Math.sqrt(s);
      t[i] = k * a * m[i];
      t[i + 1] = k * b * m[i];
    }
  }
  let d = `M${p[0][0].toFixed(1)} ${p[0][1].toFixed(1)}`;
  for (let i = 0; i < n - 1; i++) {
    const h = dx[i] / 3;
    d += ` C${(p[i][0] + h).toFixed(1)} ${(p[i][1] + t[i] * h).toFixed(1)} ${(p[i + 1][0] - h).toFixed(1)} ${(p[i + 1][1] - t[i + 1] * h).toFixed(1)} ${p[i + 1][0].toFixed(1)} ${p[i + 1][1].toFixed(1)}`;
  }
  return d;
}

const fmtDay = (d: string, o: Intl.DateTimeFormatOptions) =>
  new Date(d + "T00:00:00Z").toLocaleDateString("en-US", { ...o, timeZone: "UTC" });

export default function UsageGraph({ usage }: { usage?: Usage }) {
  const all = usage?.days ?? [];
  const [range, setRange] = useState(7);
  const [hover, setHover] = useState<number | null>(null);

  if (!all.length) return <div style={{ color: MUTED }}>no usage data yet</div>;

  const days = all.slice(-range);
  const n = days.length;
  const active = Math.min(hover ?? n - 1, n - 1);
  const total = days.reduce((a, d) => a + d.uses, 0);
  const average = Math.round((total / n) * 10) / 10;

  const maxV = Math.max(1, ...days.map((d) => d.uses));
  const raw = maxV / 4;
  const pow = Math.pow(10, Math.floor(Math.log10(raw)));
  const f = raw / pow;
  const step = Math.max(1, (f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10) * pow);
  const top = step * 4;

  const x = (i: number) => L + (i * (W - L - R)) / Math.max(1, n - 1);
  const y = (v: number) => H - B - (v / top) * (H - B - T);
  const pts: Pt[] = days.map((d, i) => [x(i), y(d.uses)]);
  const curve = smooth(pts);
  const [ax, ay] = pts[active];
  const xp = (ax / W) * 100;

  const every = n <= 7 ? 1 : n <= 14 ? 2 : 5;
  const labelOpts: Intl.DateTimeFormatOptions = n <= 7 ? { weekday: "short" } : { month: "short", day: "numeric" };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 12 }}>
        <div>
          <b style={{ display: "block", fontSize: "1.5rem", fontWeight: 600, letterSpacing: "-0.02em" }}>
            {average.toLocaleString("en-US", { maximumFractionDigits: 1 })} avg / day
          </b>
          <span style={{ color: MUTED, fontSize: ".85rem" }}>
            {total.toLocaleString("en-US")} commands in {n} days
          </span>
        </div>
        <div style={{ display: "flex", gap: 18, marginTop: 4 }}>
          {RANGES.map((r) => (
            <button
              key={r}
              type="button"
              aria-pressed={r === range}
              aria-label={`Last ${r} days`}
              onClick={() => { setRange(r); setHover(null); }}
              style={{
                background: "none", border: 0, borderBottom: `2px solid ${r === range ? ACCENT : "transparent"}`,
                padding: ".2rem 0", cursor: "pointer", fontFamily: "inherit", fontSize: ".8rem",
                fontWeight: 500, letterSpacing: ".04em", transition: "color .2s, border-color .2s",
                color: r === range ? "#f4f4f5" : MUTED,
              }}
            >
              {r}D
            </button>
          ))}
        </div>
      </div>

      <div style={{ position: "relative" }}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-label={`commands used per day over the last ${n} days`}
          style={{ display: "block", width: "100%", height: "auto", overflow: "visible", touchAction: "pan-y" }}
          onPointerMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            const vx = ((e.clientX - r.left) / r.width) * W;
            const i = Math.round((vx - L) / ((W - L - R) / Math.max(1, n - 1)));
            setHover(Math.max(0, Math.min(n - 1, i)));
          }}
          onPointerLeave={() => setHover(null)}
        >
          <defs>
            <linearGradient id="usageFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={ACCENT} stopOpacity=".28" />
              <stop offset="100%" stopColor={ACCENT} stopOpacity="0" />
            </linearGradient>
          </defs>

          {[0, 1, 2, 3, 4].map((i) => (
            <g key={i}>
              <line x1={L} x2={W - R} y1={y(i * step)} y2={y(i * step)} stroke={LINE} strokeDasharray="2 4" />
              <text x={L - 8} y={y(i * step) + 4} textAnchor="end" fill={MUTED} fontSize="11">
                {(i * step).toLocaleString("en-US", { notation: "compact" })}
              </text>
            </g>
          ))}

          <path d={`${curve} L${pts[n - 1][0].toFixed(1)} ${H - B} L${pts[0][0].toFixed(1)} ${H - B} Z`} fill="url(#usageFill)" />
          <line x1={L} x2={W - R} y1={y(average)} y2={y(average)} stroke="rgba(255,255,255,0.22)" strokeDasharray="4 4" />
          <path d={curve} fill="none" stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          <line x1={ax} x2={ax} y1={T} y2={H - B} stroke="rgba(255,255,255,0.18)" />
          <circle cx={ax} cy={ay} r="10" fill={ACCENT} opacity=".2" />
          <circle cx={ax} cy={ay} r="4.5" fill={ACCENT} stroke="#0e0e11" strokeWidth="2" />

          {days.map((d, i) =>
            (n - 1 - i) % every === 0 ? (
              <text
                key={d.date} x={x(i)} y={H - 8} textAnchor="middle" fontSize="11"
                fill={i === active ? "#f4f4f5" : MUTED}
              >
                {fmtDay(d.date, labelOpts)}
              </text>
            ) : null,
          )}
        </svg>

        <div
          style={{
            position: "absolute", pointerEvents: "none", whiteSpace: "nowrap",
            left: `${xp}%`, top: `${(ay / H) * 100}%`, transform: `translate(-${xp}%, -135%)`,
            background: "#15151a", border: `1px solid ${LINE}`, borderRadius: 10,
            padding: ".3rem .6rem", fontSize: ".8rem", lineHeight: 1.35,
          }}
        >
          <span style={{ display: "block", color: MUTED, fontSize: ".72rem" }}>
            {fmtDay(days[active].date, { weekday: "long", month: "short", day: "numeric" })}
          </span>
          <b style={{ fontWeight: 600 }}>{days[active].uses.toLocaleString("en-US")} commands</b>
        </div>
      </div>
    </div>
  );
}
