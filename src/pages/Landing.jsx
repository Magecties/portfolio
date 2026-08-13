import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Room from "../components/Room";
import useViewport from "../hooks/useViewport";
import { HAIR, clamp } from "../theme";
import { GARMENTS } from "../data/garments";

const HERO = {
  name: "Magnus",
  line: "Jeg elsker at lave ting",
  mail: "hej@vintacool.dk",
};

const SECTIONS = [
  { id: "vintacool", label: "Tøj", sub: "Vintacool · ca. 20 designs", kind: "garment" },
  { id: "web", label: "Web", sub: "Sider jeg har designet og bygget", kind: "browser" },
  { id: "automation", label: "Automation", sub: "Systemer der kører selv", kind: "scenario" },
];

function Piece({ kind, w }) {
  if (kind === "garment") {
    return (
      <img
        src={GARMENTS[0].image}
        alt=""
        draggable="false"
        style={{ width: w, display: "block", filter: "drop-shadow(0 24px 34px rgba(25,30,38,0.13))" }}
      />
    );
  }

  const shell = {
    width: w,
    height: w * 0.66,
    background: "#fff",
    border: `1px solid ${HAIR}`,
    borderRadius: 8,
    overflow: "hidden",
    boxShadow: "0 34px 60px rgba(25,30,38,0.15)",
  };

  if (kind === "browser") {
    return (
      <div style={shell}>
        <div
          style={{
            height: w * 0.072,
            background: "#F4F4F1",
            borderBottom: `1px solid ${HAIR}`,
            display: "flex",
            alignItems: "center",
            gap: 5,
            padding: `0 ${w * 0.035}px`,
          }}
        >
          {[0, 1, 2].map((d) => (
            <span key={d} style={{ width: w * 0.018, height: w * 0.018, borderRadius: "50%", background: "#DCDCD7" }} />
          ))}
        </div>
        <div style={{ padding: w * 0.055, display: "flex", flexDirection: "column", gap: w * 0.022 }}>
          <div style={{ height: w * 0.085, width: "60%", background: "#2F7A5B", borderRadius: 2 }} />
          <div style={{ height: w * 0.018, width: "82%", background: "#EAEAE6", borderRadius: 3 }} />
          <div style={{ height: w * 0.018, width: "66%", background: "#EAEAE6", borderRadius: 3 }} />
          <div style={{ display: "flex", gap: w * 0.025, marginTop: w * 0.025 }}>
            {[0, 1, 2].map((k) => (
              <div key={k} style={{ flex: 1, height: w * 0.15, background: k === 2 ? "#2F7A5B1A" : "#F5F5F2", borderRadius: 3 }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const nodes = [
    { x: 16, y: 62, c: "#2B7CD3" },
    { x: 38, y: 34, c: "#5E9A46" },
    { x: 62, y: 62, c: "#7B62C4" },
    { x: 84, y: 34, c: "#2B5DC0" },
  ];

  return (
    <div style={{ ...shell, display: "grid", placeItems: "center" }}>
      <svg viewBox="0 0 100 96" style={{ width: "80%" }}>
        {nodes.slice(0, -1).map((n, i) => (
          <line
            key={i}
            x1={n.x}
            y1={n.y}
            x2={nodes[i + 1].x}
            y2={nodes[i + 1].y}
            stroke={HAIR}
            strokeWidth="1.6"
            strokeDasharray="3 4"
          />
        ))}
        {nodes.map((n, i) => (
          <circle key={i} cx={n.x} cy={n.y} r="9.5" fill={n.c} />
        ))}
      </svg>
    </div>
  );
}

export default function Landing() {
  const vp = useViewport();
  const navigate = useNavigate();
  const [i, setI] = useState(0);
  const [opening, setOpening] = useState(false);
  const tilt = useRef(null);

  const W = clamp(Math.min(vp.w * 0.4, vp.h * 0.52), 220, 520);

  const open = useCallback(
    (id) => {
      setOpening(true);
      setTimeout(() => navigate("/" + id), 420);
    },
    [navigate],
  );

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") setI((v) => Math.min(v + 1, SECTIONS.length - 1));
      if (e.key === "ArrowLeft") setI((v) => Math.max(v - 1, 0));
      if (e.key === "Enter") open(SECTIONS[i].id);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [i, open]);

  const stageProps = {
    style: { perspective: 1800, display: "grid", placeItems: "center" },
    onPointerMove: (e) => {
      if (!tilt.current) return;
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      tilt.current.style.transform = `rotateY(${nx * 11}deg) rotateX(${-ny * 5}deg) translateX(${nx * 14}px)`;
    },
  };

  return (
    <Room
      stageProps={stageProps}
      topRight={
        <a className="link" href={`mailto:${HERO.mail}`}>
          {HERO.mail}
        </a>
      }
      caption={
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "baseline",
              gap: "clamp(18px, 4vw, 54px)",
              flexWrap: "wrap",
            }}
          >
            {SECTIONS.map((s, k) => (
              <button
                key={s.id}
                className="nav"
                data-on={k === i}
                style={{ fontSize: "clamp(1.3rem, 4vw, 2.8rem)" }}
                onPointerEnter={() => setI(k)}
                onFocus={() => setI(k)}
                onClick={() => open(s.id)}
              >
                {s.label}
              </button>
            ))}
          </div>
          <div className="label" style={{ marginTop: 14, height: 14 }}>
            {SECTIONS[i].sub}
          </div>
        </>
      }
      footLeft={<span className="credits">{HERO.name}</span>}
      footRight={<span className="label">Skive · 2026</span>}
    >
      <div style={{ position: "absolute", top: clamp(vp.h * 0.12, 88, 172), left: 0, right: 0, textAlign: "center" }}>
        <div className="brand" style={{ fontSize: "clamp(1.5rem, 4.4vw, 3.2rem)", lineHeight: 0.92 }}>
          {HERO.line}
        </div>
      </div>

      <div ref={tilt} style={{ marginTop: -vp.h * 0.02, transition: "transform 620ms cubic-bezier(0.22,1,0.36,1)" }}>
        <div
          style={{
            display: "grid",
            placeItems: "center",
            transform: opening ? "scale(1.35)" : "scale(1)",
            opacity: opening ? 0 : 1,
            transition: "transform 620ms cubic-bezier(0.22,1,0.36,1), opacity 420ms",
          }}
        >
          {SECTIONS.map((s, k) => (
            <div
              key={s.id}
              aria-hidden={k !== i}
              style={{
                gridArea: "1 / 1",
                opacity: k === i ? 1 : 0,
                transform: k === i ? "scale(1)" : "scale(0.94)",
                transition: "opacity 480ms ease, transform 620ms cubic-bezier(0.22,1,0.36,1)",
                pointerEvents: "none",
              }}
            >
              <Piece kind={s.kind} w={W} />
            </div>
          ))}
        </div>
        <div
          style={{
            width: W * 0.8,
            height: 22,
            margin: "40px auto 0",
            borderRadius: "50%",
            background: "radial-gradient(closest-side, rgba(20,22,26,0.20), rgba(20,22,26,0))",
          }}
        />
      </div>
    </Room>
  );
}
