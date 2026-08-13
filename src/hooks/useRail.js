import { clamp } from "../Theme";

const RATIO = 613 / 660;

export default function useRail({ count, vp }) {
  const W = clamp(Math.min(vp.w * 0.46, vp.h * 0.74), 240, 700);
  const GH = W * RATIO;
  const HOOKH = W * 0.19;
  const SPACING = W * 0.58;
  const BAR_Y = Math.max(70, (vp.h - (GH + HOOKH)) * 0.42);
  const FLOOR_Y = BAR_Y + HOOKH + GH + Math.min(46, vp.h * 0.05);

  const geom = Array.from({ length: count }, (_, i) => ({
    dist: i - (count - 1) / 2,
  }));

  return { W, GH, HOOKH, SPACING, BAR_Y, FLOOR_Y, geom, idx: 0 };
}
