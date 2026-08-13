import Room from "../components/Room";
import Hanger from "../components/Hanger";
import useViewport from "../hooks/useViewport";
import useRail from "../hooks/useRail";
import { GARMENTS } from "../data/garments";

const BAR =
  "linear-gradient(180deg, #FDFEFE 0%, #DCE2E6 38%, #A9B2B8 72%, #7C868C 100%)";

export default function Vintacool() {
  const vp = useViewport();
  const { W, SPACING, BAR_Y, geom } = useRail({ count: GARMENTS.length, vp });

  return (
    <Room>
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
      <div style={{ position: "absolute", left: "50%", top: BAR_Y - 4, zIndex: 2 }}>
        {GARMENTS.map((g, i) => (
          <div
            key={g.name}
            style={{
              position: "absolute",
              width: W,
              left: -W / 2,
              transform: `translateX(${geom[i].dist * SPACING}px)`,
            }}
          >
            <Hanger w={W} />
            <img
              src={g.image}
              alt={g.name}
              draggable="false"
              style={{ width: "100%", display: "block", marginTop: -W * 0.035 }}
            />
          </div>
        ))}
      </div>
    </Room>
  );
}
