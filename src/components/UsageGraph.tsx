import { useEffect, useId, useRef, useState } from "react";

export type Usage = {
  days: { date: string; uses: number }[];
  average: number;
};

type Range = number | "all";

const RANGES: Range[] = [3, 7, 14, 30, "all"];
const ACCENT = "#538CE5";
const MUTED = "#8b8b94";
const TEXT = "#f4f4f5";
const SURFACE = "#0e0e11";
const GRID = "rgba(255,255,255,0.06)";
const UP = "#4ade80";
const DOWN = "#f87171";
const L = 44, R = 14, T = 20, B = 30;

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

const nf = (v: number, o?: Intl.NumberFormatOptions) => v.toLocaleString("en-US", o);

const CSS = `
.ug-line{stroke-dasharray:1 1;stroke-dashoffset:1;animation:ug-draw .9s cubic-bezier(.4,0,.2,1) forwards}
.ug-area{animation:ug-fade .8s ease-out both}
.ug-chart{outline:none;border-radius:12px}
.ug-chart:focus-visible{outline:2px solid ${ACCENT};outline-offset:6px}
.ug-btn:hover{color:${TEXT}}
@keyframes ug-draw{to{stroke-dashoffset:0}}
@keyframes ug-fade{from{opacity:0}to{opacity:1}}
@media (prefers-reduced-motion:reduce){.ug-line{animation:none;stroke-dashoffset:0}.ug-area{animation:none}}
`;

export default function UsageGraph({ usage }: { usage?: Usage }) {
  const all = usage?.days ?? [];
  const has = all.length > 0;
  const [range, setRange] = useState<Range>(7);
  const [hover, setHover] = useState<number | null>(null);
  const [width, setWidth] = useState(600);
  const box = useRef<HTMLDivElement>(null);
  const uid = useId().replace(/:/g, "");

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setWidth(Math.max(240, Math.round(e.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, [has]);

  if (!has) {
    return (
      <div ref={box} style={{ color: MUTED, padding: "2rem 0", textAlign: "center", fontSize: ".9rem" }}>
        no usage data yet
      </div>
    );
  }

  const isAll = range === "all";
  const days = isAll ? all : all.slice(-range);
  const n = days.length;
  const active = Math.min(hover ?? n - 1, n - 1);
  const total = days.reduce((a, d) => a + d.uses, 0);
  const average = Math.round((total / n) * 10) / 10;
  const peak = days.reduce((b, d) => (d.uses > b.uses ? d : b), days[0]);

  // no previous period to compare against on all time, so the pill hides itself
  const prev = !isAll && all.length >= n * 2 ? all.slice(-n * 2, -n).reduce((a, d) => a + d.uses, 0) : 0;
  const delta = prev > 0 ? ((total - prev) / prev) * 100 : null;

  // long spans get years on the labels and tooltip
  const longSpan = n > 300;

  // geometry
  const h = width < 420 ? 210 : 270;
  const plotW = width - L - R;
  const maxV = Math.max(1, ...days.map((d) => d.uses));
  const raw = maxV / 4;
  const pow = Math.pow(10, Math.floor(Math.log10(raw)));
  const f = raw / pow;
  const step = Math.max(1, (f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10) * pow);
  const top = step * 4;

  const x = (i: number) => (n === 1 ? L + plotW / 2 : L + (i * plotW) / (n - 1));
  const y = (v: number) => h - B - (v / top) * (h - B - T);
  const pts: Pt[] = days.map((d, i) => [x(i), y(d.uses)]);
  const curve = smooth(pts);
  const base = y(0);
  const [ax, ay] = pts[active];

  const maxLabels = Math.max(2, Math.floor(plotW / (longSpan ? 72 : 64)));
  const every = Math.ceil(n / maxLabels);
  const labelOpts: Intl.DateTimeFormatOptions = longSpan
    ? { month: "short", year: "2-digit" }
    : n <= 7
      ? { weekday: "short" }
      : { month: "short", day: "numeric" };

  const tipLeft = Math.min(Math.max(ax, 72), width - 72);
  const tipBelow = ay < 72;
  const uses = days[active].uses;

  const move = (e: React.PointerEvent<SVGSVGElement>) => {
    if (n === 1) return setHover(0);
    const r = e.currentTarget.getBoundingClientRect();
    const i = Math.round(((e.clientX - r.left - L) / plotW) * (n - 1));
    setHover(Math.max(0, Math.min(n - 1, i)));
  };

  const key = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") { e.preventDefault(); setHover(Math.max(0, active - 1)); }
    else if (e.key === "ArrowRight") { e.preventDefault(); setHover(Math.min(n - 1, active + 1)); }
    else if (e.key === "Home") { e.preventDefault(); setHover(0); }
    else if (e.key === "End") { e.preventDefault(); setHover(n - 1); }
    else if (e.key === "Escape") setHover(null);
  };

  return (
    <div ref={box}>
      <style>{CSS}</style>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
        <div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
            <b style={{ fontSize: "1.75rem", fontWeight: 600, letterSpacing: "-0.03em", lineHeight: 1.1 }}>
              {nf(average, { maximumFractionDigits: 1 })}
              <span style={{ color: MUTED, fontSize: ".9rem", fontWeight: 500, letterSpacing: 0 }}> avg / day</span>
            </b>
            {delta !== null && (
              <span
                title={`vs the previous ${n} days`}
                style={{
                  color: delta >= 0 ? UP : DOWN, fontSize: ".75rem", fontWeight: 600,
                  background: delta >= 0 ? "rgba(74,222,128,.12)" : "rgba(248,113,113,.12)",
                  padding: ".15rem .5rem", borderRadius: 999,
                }}
              >
                {delta >= 0 ? "▲" : "▼"} {Math.abs(delta).toFixed(0)}%
              </span>
            )}
          </div>
          <span style={{ color: MUTED, fontSize: ".82rem", display: "block", marginTop: 4 }}>
            {nf(total)} commands {isAll ? `all time (${nf(n)} day${n === 1 ? "" : "s"})` : `in ${n} day${n === 1 ? "" : "s"}`} · peak {nf(peak.uses)} on{" "}
            {fmtDay(peak.date, { month: "short", day: "numeric", ...(longSpan ? { year: "numeric" } : {}) })}
          </span>
        </div>

        <div
          role="group"
          aria-label="Time range"
          style={{ display: "inline-flex", gap: 2, padding: 3, borderRadius: 10, background: "rgba(255,255,255,0.04)", border: `1px solid ${GRID}` }}
        >
          {RANGES.map((r) => (
            <button
              key={r}
              type="button"
              className="ug-btn"
              aria-pressed={r === range}
              aria-label={r === "all" ? "All time" : `Last ${r} days`}
              onClick={() => { setRange(r); setHover(null); }}
              style={{
                border: 0, cursor: "pointer", fontFamily: "inherit", fontSize: ".78rem", fontWeight: 500,
                padding: ".3rem .7rem", borderRadius: 8, transition: "background .2s, color .2s",
                background: r === range ? "rgba(255,255,255,0.1)" : "transparent",
                color: r === range ? TEXT : MUTED,
              }}
            >
              {r === "all" ? "ALL" : `${r}D`}
            </button>
          ))}
        </div>
      </div>

      <div
        className="ug-chart"
        tabIndex={0}
        onKeyDown={key}
        onBlur={() => setHover(null)}
        style={{ position: "relative", height: h }}
      >
        <svg
          width={width}
          height={h}
          viewBox={`0 0 ${width} ${h}`}
          role="img"
          aria-label={isAll ? "commands used per day, all time" : `commands used per day over the last ${n} days`}
          style={{ display: "block", overflow: "visible", touchAction: "pan-y", cursor: "crosshair" }}
          onPointerMove={move}
          onPointerDown={move}
          onPointerLeave={() => setHover(null)}
        >
          <defs>
            <linearGradient id={`${uid}-fill`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={ACCENT} stopOpacity=".32" />
              <stop offset="70%" stopColor={ACCENT} stopOpacity=".05" />
              <stop offset="100%" stopColor={ACCENT} stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* grid + y axis */}
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={i}>
              <line
                x1={L} x2={width - R} y1={y(i * step)} y2={y(i * step)}
                stroke={i === 0 ? "rgba(255,255,255,0.12)" : GRID}
              />
              <text x={L - 10} y={y(i * step) + 4} textAnchor="end" fill={MUTED} fontSize="11">
                {nf(i * step, { notation: "compact" })}
              </text>
            </g>
          ))}

          {/* data (re-keyed so the draw-in replays when the range changes) */}
          <g key={String(range)}>
            {n > 1 && (
              <path
                className="ug-area"
                d={`${curve} L${pts[n - 1][0].toFixed(1)} ${base} L${pts[0][0].toFixed(1)} ${base} Z`}
                fill={`url(#${uid}-fill)`}
              />
            )}

            {/* average */}
            <line
              x1={L} x2={width - R} y1={y(average)} y2={y(average)}
              stroke="rgba(255,255,255,0.2)" strokeDasharray="4 5"
            />
            {y(average) > T + 12 && (
              <text x={width - R} y={y(average) - 7} textAnchor="end" fill={MUTED} fontSize="10.5">
                avg {nf(average, { maximumFractionDigits: 1 })}
              </text>
            )}

            {n > 1 && (
              <path
                className="ug-line"
                d={curve}
                pathLength={1}
                fill="none"
                stroke={ACCENT}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ filter: `drop-shadow(0 0 6px ${ACCENT}66)` }}
              />
            )}

            {n <= 14 && pts.map(([px, py], i) =>
              i === active ? null : <circle key={i} cx={px} cy={py} r="3" fill={ACCENT} opacity=".85" />,
            )}
          </g>

          {/* active point */}
          <line x1={ax} x2={ax} y1={T} y2={base} stroke="rgba(255,255,255,0.16)" strokeDasharray="3 4" />
          <circle cx={ax} cy={ay} r="11" fill={ACCENT} opacity=".18" />
          <circle cx={ax} cy={ay} r="5" fill={ACCENT} stroke={SURFACE} strokeWidth="2" />

          {/* x labels */}
          {days.map((d, i) =>
            (n - 1 - i) % every === 0 ? (
              <text
                key={d.date} x={x(i)} y={h - 8} textAnchor="middle" fontSize="11"
                fill={i === active ? TEXT : MUTED} fontWeight={i === active ? 600 : 400}
              >
                {fmtDay(d.date, labelOpts)}
              </text>
            ) : null,
          )}
        </svg>

        <div
          style={{
            position: "absolute", pointerEvents: "none", whiteSpace: "nowrap",
            left: tipLeft, top: tipBelow ? ay + 18 : ay - 18,
            transform: tipBelow ? "translate(-50%, 0)" : "translate(-50%, -100%)",
            background: "rgba(21,21,26,0.92)", backdropFilter: "blur(6px)",
            border: `1px solid rgba(255,255,255,0.1)`, borderRadius: 10,
            padding: ".4rem .7rem", fontSize: ".82rem", lineHeight: 1.35,
            boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
          }}
        >
          <span style={{ display: "block", color: MUTED, fontSize: ".72rem" }}>
            {fmtDay(
              days[active].date,
              longSpan
                ? { month: "short", day: "numeric", year: "numeric" }
                : { weekday: "long", month: "short", day: "numeric" },
            )}
          </span>
          <b style={{ fontWeight: 600 }}>{nf(uses)} {uses === 1 ? "command" : "commands"}</b>
        </div>
      </div>
    </div>
  );
} // i need this to push an update
