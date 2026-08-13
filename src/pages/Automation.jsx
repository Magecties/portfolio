import { useNavigate } from "react-router-dom";
import Room from "../components/Room";
import Chevron from "../components/Chevron";
import useViewport from "../hooks/useViewport";
import { HAIR, MUTE, clamp } from "../theme";
import { SCENARIOS } from "../data/scenarios";

export default function Automation() {
  const vp = useViewport();
  const navigate = useNavigate();
  const sc = SCENARIOS[0];
  const N = sc.modules.length;

  const GW = clamp(Math.min(vp.w * 0.74, 980), 300, 980);
  const GH = GW * 0.26;
  const R = Math.max(20, GW * 0.036);
  const pts = sc.modules.map((_, i) => ({
    x: (GW / (N + 0.6)) * (i + 0.8),
    y: GH * (i % 2 === 0 ? 0.62 : 0.3),
  }));

  return (
    <Room
      stageProps={{ style: { display: "grid", placeItems: "center" } }}
      topLeft={
        <button className="home" onClick={() => navigate("/")}>
          <Chevron dir="left" />
          <span>Tilbage</span>
        </button>
      }
      caption={
        <h1 className="brand" style={{ fontSize: "clamp(1.4rem, 4.2vw, 3rem)", margin: 0, lineHeight: 1 }}>
          {sc.name}
        </h1>
      }
      footLeft={<span className="credits">{sc.stack}</span>}
    >
      <div style={{ width: GW, marginTop: -vp.h * 0.06 }}>
        <div className="label" style={{ textAlign: "center", marginBottom: 10 }}>
          {sc.trigger}
        </div>
        <svg viewBox={`0 0 ${GW} ${GH + R * 2.6}`} style={{ width: "100%", display: "block", overflow: "visible" }}>
          <defs>
            <filter id="soft" x="-60%" y="-60%" width="220%" height="220%">
              <feDropShadow dx="0" dy={R * 0.34} stdDeviation={R * 0.3} floodColor="#1A1E26" floodOpacity="0.18" />
            </filter>
          </defs>
          {pts.slice(0, -1).map((p, i) => (
            <line
              key={i}
              x1={p.x}
              y1={p.y}
              x2={pts[i + 1].x}
              y2={pts[i + 1].y}
              stroke={HAIR}
              strokeWidth="2"
              strokeDasharray="4 6"
            />
          ))}
          {pts.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r={R} fill="#fff" stroke={HAIR} strokeWidth="1.5" filter="url(#soft)" />
              <text x={p.x} y={p.y + R * 0.16} textAnchor="middle" fontSize={R * 0.42} fontWeight="700" fill={MUTE}>
                {sc.modules[i].label.slice(0, 3).toUpperCase()}
              </text>
              <text x={p.x} y={p.y + R * 1.75} textAnchor="middle" fontSize={11} fontWeight="600" fill={MUTE}>
                {sc.modules[i].label}
              </text>
              <text x={p.x} y={p.y + R * 1.75 + 14} textAnchor="middle" fontSize={9.5} fill={MUTE}>
                {sc.modules[i].sub}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </Room>
  );
}
