export default function Room({ topLeft, topRight, caption, footLeft, footCenter, footRight, stageProps = {}, children }) {
  return (
    <div className="room">
      {topLeft && <div className="slot-tl">{topLeft}</div>}
      {topRight && <div className="slot-tr">{topRight}</div>}
      <div className="stage" {...stageProps}>{children}</div>
      {caption && <div className="caption">{caption}</div>}
      <div className="foot">
        <div>{footLeft}</div>
        {footCenter && <div className="foot-center">{footCenter}</div>}
        <div>{footRight}</div>
      </div>
    </div>
  );
}