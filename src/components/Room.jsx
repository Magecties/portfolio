import { useEffect, useRef } from "react";

export default function Room({
  topLeft,
  topRight,
  caption,
  footLeft,
  footCenter,
  footRight,
  stageProps = {},
  onCaptionHeight,
  children,
}) {
  const capRef = useRef(null);

  // Caption copy wraps to a different number of lines per viewport, so pages
  // that size artwork around it need the measured height rather than a guess.
  useEffect(() => {
    const el = capRef.current;
    if (!onCaptionHeight || !el) return;
    const report = () => onCaptionHeight(el.offsetHeight);
    report();
    const ro = new ResizeObserver(report);
    ro.observe(el);
    return () => ro.disconnect();
  }, [onCaptionHeight, caption]);

  return (
    <div className="room">
      {topLeft && <div className="slot-tl">{topLeft}</div>}
      {topRight && <div className="slot-tr">{topRight}</div>}
      <div className="stage" {...stageProps}>{children}</div>
      {caption && <div className="caption" ref={capRef}>{caption}</div>}
      <div className="foot">
        <div>{footLeft}</div>
        {footCenter && <div className="foot-center">{footCenter}</div>}
        <div>{footRight}</div>
      </div>
    </div>
  );
}
