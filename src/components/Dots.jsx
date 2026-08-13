export default function Dots({ count, active, onPick, labels = [] }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          className="dot"
          data-on={i === active}
          onClick={() => onPick(i)}
          aria-label={labels[i] || `Vis ${i + 1}`}
        />
      ))}
    </>
  );
}
