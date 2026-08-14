import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Room from "../components/Room";
import Chevron from "../components/Chevron";
import Dots from "../components/Dots";
import Arrows from "../components/Arrows";
import MockPage from "../components/MockPage";
import Note from "../components/Note";
import useViewport from "../hooks/useViewport";
import { HAIR, INK, clamp, lerp } from "../theme";
import { SITES } from "../data/sites";

// Vertical chrome around the browser mock: the back button up top, and the
// caption (bottom-anchored, measured) plus a gap below.
const HEAD = 76;
const CAPTION_BOTTOM = 78;
const GAP = 20;
// Scroll bar, ground shadow and their margins, on top of the mock itself.
const SHELL_CHROME = 71;
// Widest mock that still fits `band`. Its height is SH (0.62·SW) + the title bar
// + SHELL_CHROME, and the title bar is max(22, 0.042·SW) — so bound both branches.
const fitWidth = (band) =>
  Math.min((band - SHELL_CHROME) / 0.662, (band - SHELL_CHROME - 22) / 0.62);

export default function Web() {
  const vp = useViewport();
  const navigate = useNavigate();
  const [i, setI] = useState(0);
  const [scroll, setScroll] = useState(0);
  const [render, setRender] = useState(0);
  const [capH, setCapH] = useState(150);
  const smooth = useRef(0);
  const tilt = useRef(null);
  const drag = useRef(null);
  const lock = useRef(false);

  const site = SITES[i];
  const band = Math.max(150, vp.h - HEAD - CAPTION_BOTTOM - capH - GAP);
  const SW = clamp(Math.min(vp.w * 0.56, fitWidth(band)), 300, 820);
  const SH = SW * 0.62;
  const CHROME = Math.max(22, SW * 0.042);
  const PAGE_H = SH * 3.1;
  // The free band sits above centre, so nudge the mock into it.
  const bandOffset = HEAD + band / 2 - vp.h / 2;

  useEffect(() => {
    let raf;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      smooth.current = lerp(smooth.current, scroll, 0.12);
      setRender(smooth.current);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [scroll]);

  const go = useCallback((n) => {
    setI(clamp(n, 0, SITES.length - 1));
    setScroll(0);
    smooth.current = 0;
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") go(i + 1);
      if (e.key === "ArrowLeft") go(i - 1);
      if (e.key === "ArrowDown") setScroll((s) => clamp(s + 0.12, 0, 1));
      if (e.key === "ArrowUp") setScroll((s) => clamp(s - 0.12, 0, 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [i, go]);

  const stageProps = {
    style: { perspective: 1900, display: "grid", placeItems: "center", cursor: "grab", touchAction: "pan-y" },
    onWheel: (e) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) + 4) {
        if (lock.current) return;
        lock.current = true;
        go(i + (e.deltaX > 0 ? 1 : -1));
        setTimeout(() => {
          lock.current = false;
        }, 420);
        return;
      }
      setScroll((s) => clamp(s + e.deltaY / (PAGE_H - SH), 0, 1));
    },
    onPointerDown: (e) => {
      drag.current = { y: e.clientY, base: scroll };
    },
    onPointerUp: () => {
      drag.current = null;
    },
    onPointerLeave: () => {
      drag.current = null;
      if (tilt.current) tilt.current.style.transform = "";
    },
    onPointerMove: (e) => {
      if (drag.current) {
        setScroll(clamp(drag.current.base - (e.clientY - drag.current.y) / (PAGE_H - SH), 0, 1));
        return;
      }
      if (!tilt.current) return;
      const nx = e.clientX / window.innerWidth - 0.5;
      tilt.current.style.transform = `rotateY(${nx * 9}deg) translateX(${nx * 10}px)`;
    },
  };

  return (
    <Room
      onCaptionHeight={setCapH}
      stageProps={stageProps}
      topLeft={
        <button className="home" onClick={() => navigate("/")}>
          <Chevron dir="left" />
          <span>Tilbage</span>
        </button>
      }
      topRight={
        <span className="brand" style={{ fontSize: 15 }}>
          {String(i + 1).padStart(2, "0")} / {String(SITES.length).padStart(2, "0")}
        </span>
      }
      caption={
        <>
          <h1 className="brand" style={{ fontSize: "clamp(1.4rem, 4.2vw, 3rem)", margin: 0, lineHeight: 1 }}>
            {site.name}
          </h1>
          <Note>{site.note}</Note>
          <div style={{ marginTop: 12 }}>
            <a className="link" href={`https://${site.url}`} target="_blank" rel="noreferrer">
              Besøg siden
            </a>
          </div>
        </>
      }
      footLeft={<span className="credits">{site.stack}</span>}
      footCenter={<Dots count={SITES.length} active={i} onPick={go} labels={SITES.map((s) => s.name)} />}
      footRight={
        <Arrows
          onPrev={() => go(i - 1)}
          onNext={() => go(i + 1)}
          prevDisabled={i === 0}
          nextDisabled={i === SITES.length - 1}
        />
      }
    >
      <div style={{ marginTop: bandOffset }}>
        <div ref={tilt} style={{ transition: "transform 480ms cubic-bezier(0.22,1,0.36,1)" }}>
          <div
            style={{
              width: SW,
              borderRadius: 8,
              overflow: "hidden",
              background: "#fff",
              border: `1px solid ${HAIR}`,
              boxShadow: "0 40px 70px rgba(25,30,38,0.16)",
            }}
          >
            <div
              style={{
                height: CHROME,
                background: "#F4F4F1",
                borderBottom: `1px solid ${HAIR}`,
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "0 12px",
              }}
            >
              {[0, 1, 2].map((d) => (
                <span key={d} style={{ width: 8, height: 8, borderRadius: "50%", background: "#DCDCD7" }} />
              ))}
              <span className="label" style={{ marginLeft: 12, fontSize: 9, letterSpacing: "0.12em" }}>
                {site.url}
              </span>
            </div>
            <div style={{ height: SH, overflow: "hidden" }}>
              <div style={{ transform: `translateY(${-render * (PAGE_H - SH)}px)`, willChange: "transform" }}>
                {site.shot ? (
                  <img src={site.shot} alt={site.name} draggable="false" style={{ width: "100%", display: "block" }} />
                ) : (
                  <MockPage site={site} w={SW} />
                )}
              </div>
            </div>
          </div>
          <div style={{ height: 3, background: HAIR, borderRadius: 2, marginTop: 10, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${render * 100}%`, background: INK }} />
          </div>
        </div>
        <div
          style={{
            width: SW * 0.86,
            height: 24,
            margin: "34px auto 0",
            borderRadius: "50%",
            background: "radial-gradient(closest-side, rgba(20,22,26,0.20), rgba(20,22,26,0))",
          }}
        />
      </div>
    </Room>
  );
}
