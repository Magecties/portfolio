import { useCallback, useEffect, useRef, useState } from "react";
import { clamp, lerp } from "../theme";

const RATIO = 613 / 660;
const MAXROT = 44;
const PERSP = 2200;

export default function useRail({ count, vp }) {
  const W = clamp(Math.min(vp.w * 0.46, vp.h * 0.74), 240, 700);
  const GH = W * RATIO;
  const HOOKH = W * 0.19;
  const SPACING = W * 0.58;
  const BAR_Y = Math.max(70, (vp.h - (GH + HOOKH)) * 0.42);
  const FLOOR_Y = BAR_Y + HOOKH + GH + Math.min(46, vp.h * 0.05);
  const maxOffset = (count - 1) * SPACING;
  const ZSTEP = W * 0.5;

  const [smooth, setSmooth] = useState(0);
  const [dragging, setDragging] = useState(false);
  const target = useRef(0);
  const drag = useRef(null);
  const lock = useRef(false);

  const setTarget = useCallback(
    (v) => {
      target.current = clamp(v, 0, maxOffset);
    },
    [maxOffset],
  );

  useEffect(() => {
    let raf;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      setSmooth((s) =>
        Math.abs(target.current - s) < 0.04 ? target.current : lerp(s, target.current, 0.11),
      );
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, []);

  const goTo = useCallback((i) => setTarget(i * SPACING), [setTarget, SPACING]);
  const step = useCallback(
    (d) => setTarget(Math.round(target.current / SPACING + d) * SPACING),
    [setTarget, SPACING],
  );

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step]);

  const bind = {
    onPointerDown: (e) => {
      e.currentTarget.setPointerCapture(e.pointerId);
      drag.current = { x: e.clientX, base: target.current };
      setDragging(true);
    },
    onPointerMove: (e) => {
      if (drag.current) setTarget(drag.current.base - (e.clientX - drag.current.x) * 1.15);
    },
    onPointerUp: () => {
      if (!drag.current) return;
      drag.current = null;
      setDragging(false);
      setTarget(Math.round(target.current / SPACING) * SPACING);
    },
    onPointerCancel: () => {
      drag.current = null;
      setDragging(false);
    },
    onWheel: (e) => {
      if (lock.current) return;
      const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(d) < 8) return;
      lock.current = true;
      step(d > 0 ? 1 : -1);
      setTimeout(() => {
        lock.current = false;
      }, 300);
    },
  };

  const idx = clamp(Math.round(smooth / SPACING), 0, count - 1);
  const lag = target.current - smooth;
  const geom = Array.from({ length: count }, (_, i) => {
    const dist = (i * SPACING - smooth) / SPACING;
    const z = -Math.min(Math.abs(dist), 3) * ZSTEP;
    return {
      dist,
      z,
      s: PERSP / (PERSP - z),
      ay: clamp(dist, -1, 1) * MAXROT,
      az: clamp(lag * 0.045 * (1 - Math.min(Math.abs(dist), 3) / 4), -7, 7),
    };
  });

  return { W, GH, HOOKH, SPACING, BAR_Y, FLOOR_Y, geom, idx, lag, dragging, bind, goTo, step, PERSP };
}
