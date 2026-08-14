import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Room from "../components/Room";
import Chevron from "../components/Chevron";
import Dots from "../components/Dots";
import Arrows from "../components/Arrows";
import Note from "../components/Note";
import useViewport from "../hooks/useViewport";
import { HAIR, INK, LIVE, MUTE, clamp } from "../theme";
import { SCENARIOS } from "../data/scenarios";

const HEAD = 76;
const CAPTION_BOTTOM = 78;
const GAP = 20;
// Trigger label, the margin under the graph and the run row.
const GRAPH_CHROME = 112;
// Graph height per unit width: the svg body (0.26) plus node labels (2.6 · 0.036R).
const GRAPH_RATIO = 0.26 + 0.036 * 2.6;

export default function Automation() {
  const vp = useViewport();
  const navigate = useNavigate();
  const [s, setS] = useState(0);
  const [prog, setProg] = useState(-1);
  const [running, setRunning] = useState(false);
  const [picked, setPicked] = useState(null);
  const [capH, setCapH] = useState(150);
  const raf = useRef(0);

  const sc = SCENARIOS[s];
  const N = sc.modules.length;

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const reset = useCallback(() => {
    cancelAnimationFrame(raf.current);
    setRunning(false);
    setProg(-1);
    setPicked(null);
  }, []);

  const run = () => {
    cancelAnimationFrame(raf.current);
    setPicked(null);
    setRunning(true);
    setProg(0);
    let p = 0;
    let last = performance.now();
    const tick = (now) => {
      p += ((now - last) / 1000) * 0.8;
      last = now;
      if (p >= N - 1) {
        setProg(N - 1);
        setRunning(false);
        return;
      }
      setProg(p);
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  };

  const go = (n) => {
    reset();
    setS(clamp(n, 0, SCENARIOS.length - 1));
  };

  const band = Math.max(150, vp.h - HEAD - CAPTION_BOTTOM - capH - GAP);
  const GW = clamp(Math.min(vp.w * 0.74, (band - GRAPH_CHROME) / GRAPH_RATIO), 300, 980);
  // The free band sits above centre, so nudge the graph into it.
  const bandOffset = HEAD + band / 2 - vp.h / 2;
  const GH = GW * 0.26;
  const R = Math.max(20, GW * 0.036);
  const pts = sc.modules.map((_, i) => ({
    x: (GW / (N + 0.6)) * (i + 0.8),
    y: GH * (i % 2 === 0 ? 0.62 : 0.3),
  }));
  const seg = Math.floor(Math.max(prog, 0));
  const t = Math.max(prog, 0) - seg;
  const a = pts[Math.min(seg, N - 1)];
  const b = pts[Math.min(seg + 1, N - 1)];
  const tok = { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
  const reached = prog < 0 ? -1 : Math.round(prog);
  const shown = picked !== null ? picked : clamp(reached, 0, N - 1);
  const mod = sc.modules[shown];
  const idle = prog < 0 && picked === null;

  return (
    <Room
      onCaptionHeight={setCapH}
      stageProps={{ style: { display: "grid", placeItems: "center" } }}
      topLeft={
        <button className="home" onClick={() => navigate("/")}>
          <Chevron dir="left" />
          <span>Tilbage</span>
        </button>
      }
      caption={
        <>
          <h1 className="brand" style={{ fontSize: "clamp(1.4rem, 4.2vw, 3rem)", margin: 0, lineHeight: 1 }}>
            {sc.name}
          </h1>
          <Note>{sc.note}</Note>
        </>
      }
      footLeft={<span className="credits">{sc.stack}</span>}
      footCenter={<Dots count={SCENARIOS.length} active={s} onPick={go} labels={SCENARIOS.map((x) => x.name)} />}
      footRight={
        <Arrows
          onPrev={() => go(s - 1)}
          onNext={() => go(s + 1)}
          prevDisabled={s === 0}
          nextDisabled={s === SCENARIOS.length - 1}
        />
      }
    >
      <div style={{ width: GW, marginTop: bandOffset }}>
        <div className="label" style={{ textAlign: "center", marginBottom: 10 }}>
          {sc.trigger}
        </div>
        <svg viewBox={`0 0 ${GW} ${GH + R * 2.6}`} style={{ width: "100%", display: "block", overflow: "visible" }}>
          <defs>
            <filter id="soft" x="-60%" y="-60%" width="220%" height="220%">
              <feDropShadow dx="0" dy={R * 0.34} stdDeviation={R * 0.3} floodColor="#1A1E26" floodOpacity="0.18" />
            </filter>
          </defs>
          {pts.slice(0, -1).map((p, i) => {
            const done = prog > i;
            return (
              <line
                key={i}
                x1={p.x}
                y1={p.y}
                x2={pts[i + 1].x}
                y2={pts[i + 1].y}
                stroke={done ? LIVE : HAIR}
                strokeWidth={done ? 2.5 : 2}
                strokeDasharray={done ? "none" : "4 6"}
              />
            );
          })}
          {pts.map((p, i) => {
            const lit = prog >= i;
            const sel = shown === i && !idle;
            const m = sc.modules[i];
            return (
              <g key={i} style={{ cursor: "pointer" }} onClick={() => setPicked(i)}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={R}
                  fill={lit ? m.tint : "#fff"}
                  stroke={sel ? INK : lit ? m.tint : HAIR}
                  strokeWidth={sel ? 2.5 : 1.5}
                  filter="url(#soft)"
                  style={{ transition: "fill 300ms" }}
                />
                <text
                  x={p.x}
                  y={p.y + R * 0.16}
                  textAnchor="middle"
                  fontSize={R * 0.42}
                  fontWeight="700"
                  fill={lit ? "#fff" : MUTE}
                  style={{ pointerEvents: "none" }}
                >
                  {m.label.slice(0, 3).toUpperCase()}
                </text>
                <text
                  x={p.x}
                  y={p.y + R * 1.75}
                  textAnchor="middle"
                  fontSize={11}
                  fontWeight="600"
                  fill={lit ? INK : MUTE}
                  style={{ pointerEvents: "none" }}
                >
                  {m.label}
                </text>
                <text
                  x={p.x}
                  y={p.y + R * 1.75 + 14}
                  textAnchor="middle"
                  fontSize={9.5}
                  fill={MUTE}
                  style={{ pointerEvents: "none" }}
                >
                  {m.sub}
                </text>
              </g>
            );
          })}
          {running && <circle cx={tok.x} cy={tok.y} r={R * 0.24} fill={LIVE} />}
        </svg>
        <div style={{ display: "flex", gap: 20, alignItems: "flex-start", marginTop: 30, flexWrap: "wrap" }}>
          <button className="run" onClick={run} disabled={running}>
            {running ? "Kører" : prog >= 0 ? "Kør igen" : "Kør scenarie"}
          </button>
          <div style={{ flex: 1, minWidth: 240, borderLeft: `2px solid ${HAIR}`, paddingLeft: 18, minHeight: 58 }}>
            <div className="label">{idle ? "Klar" : `Trin ${shown + 1} af ${N} — ${mod.label}`}</div>
            <div style={{ fontSize: 13.5, lineHeight: 1.55, marginTop: 6 }}>
              {idle ? "Tryk kør, eller klik på et modul." : mod.does}
            </div>
            {!idle && <div style={{ fontSize: 12, color: MUTE, marginTop: 6 }}>→ {mod.out}</div>}
          </div>
        </div>
      </div>
    </Room>
  );
}
