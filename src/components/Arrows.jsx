import Chevron from "./Chevron";

export default function Arrows({ onPrev, onNext, prevDisabled, nextDisabled }) {
  return (
    <div style={{ display: "flex", gap: 4 }}>
      <button className="arrow" onClick={onPrev} disabled={prevDisabled} aria-label="Forrige">
        <Chevron dir="left" />
      </button>
      <button className="arrow" onClick={onNext} disabled={nextDisabled} aria-label="Næste">
        <Chevron dir="right" />
      </button>
    </div>
  );
}
