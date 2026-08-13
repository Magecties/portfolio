import { useNavigate } from "react-router-dom";
import Room from "../components/Room";
import Hanger from "../components/Hanger";
import Dots from "../components/Dots";
import Arrows from "../components/Arrows";
import useViewport from "../hooks/useViewport";
import useRail from "../hooks/useRail";
import { GARMENTS, FLOOR_SHADOW } from "../data/garments";
import { clamp } from "../theme";

const BAR =
  "linear-gradient(180deg, #FDFEFE 0%, #DCE2E6 38%, #A9B2B8 72%, #7C868C 100%)";

export default function Vintacool() {
  const navigate = useNavigate();
  const ROLES = ["Grafik", "Webshop", "Foto", "Drift"];
  const vp = useViewport();
  const { W, SPACING, BAR_Y, FLOOR_Y, geom, bind, dragging, idx, step, goTo, PERSP } = useRail({
    count: GARMENTS.length,
    vp,
  });

  return (
    <Room
      topLeft={
        <button
          onClick={() => navigate("/")}
          aria-label="Til forsiden"
          style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
        >
          <img src="/vintacool-logo.svg" alt="Vintacool" style={{ height: 46, display: "block" }} />
        </button>
      }
      topRight={
        <span className="brand" style={{ fontSize: 15 }}>
          {String(idx + 1).padStart(2, "0")} / {String(GARMENTS.length).padStart(2, "0")}
        </span>
      }
      caption={
        <h1 className="brand" style={{ fontSize: "clamp(1.4rem, 4.2vw, 3rem)", margin: 0, lineHeight: 1.02 }}>
          {GARMENTS[idx].name}
        </h1>
      }
      footLeft={<span className="credits">{ROLES.join(" · ")}</span>}
      footCenter={<Dots count={GARMENTS.length} active={idx} onPick={goTo} labels={GARMENTS.map((g) => g.name)} />}
      footRight={
        <Arrows
          onPrev={() => step(-1)}
          onNext={() => step(1)}
          prevDisabled={idx === 0}
          nextDisabled={idx === GARMENTS.length - 1}
        />
      }
      stageProps={{
        ...bind,
        style: {
          perspective: PERSP,
          perspectiveOrigin: `50% ${BAR_Y}px`,
          cursor: dragging ? "grabbing" : "grab",
          touchAction: "pan-y",
        },
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "-8%",
          right: "-8%",
          top: BAR_Y,
          height: 7,
          borderRadius: 4,
          zIndex: 1,
          background: BAR,
          boxShadow: "0 12px 30px rgba(30,40,50,0.14)",
        }}
      />
      <div style={{ position: "absolute", left: "50%", top: FLOOR_Y, zIndex: 0 }}>
        {GARMENTS.map((g, i) => {
          const { dist, ay, s } = geom[i];
          return (
            <img
              key={g.name}
              src={FLOOR_SHADOW}
              alt=""
              style={{
                position: "absolute",
                width: W * 1.2,
                left: -(W * 1.2) / 2,
                transform: `translateX(${dist * SPACING * s}px) translateY(${-(FLOOR_Y - BAR_Y) * (1 - s)}px) scale(${s}) scaleX(${Math.max(0.3, Math.cos((ay * Math.PI) / 180))}) scaleY(${1 - Math.min(Math.abs(dist), 2) * 0.13})`,
                opacity: clamp(0.8 - Math.abs(dist) * 0.22, 0.1, 0.8),
              }}
            />
          );
        })}
      </div>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: BAR_Y - 4,
          transformStyle: "preserve-3d",
          zIndex: 2,
        }}
      >
        {GARMENTS.map((g, i) => {
          const { dist, ay, az, z } = geom[i];
          return (
            <div
              key={g.name}
              onClick={() => goTo(i)}
              style={{
                position: "absolute",
                width: W,
                left: -W / 2,
                transformOrigin: "50% 4px",
                transform: `translateX(${dist * SPACING}px) translateZ(${z}px) rotateY(${ay}deg) rotateZ(${az}deg)`,
                zIndex: 100 - Math.round(Math.abs(dist) * 10),
                filter: `brightness(${clamp(1 - Math.abs(dist) * 0.09, 0.74, 1)}) saturate(${clamp(1 - Math.abs(dist) * 0.26, 0.4, 1)})`,
                transition: dragging ? "none" : "filter 320ms",
                cursor: "pointer",
              }}
            >
              <Hanger w={W} dim={clamp(1 - Math.abs(dist) * 0.2, 0.5, 1)} />
              <img
                src={g.image}
                alt={g.name}
                draggable="false"
                style={{
                  width: "100%",
                  display: "block",
                  marginTop: -W * 0.035,
                  filter: "drop-shadow(0 16px 22px rgba(25,30,38,0.11))",
                }}
              />
            </div>
          );
        })}
      </div>
    </Room>
  );
}
