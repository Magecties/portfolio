export default function Chevron({ dir = "right" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      style={{ width: 22, height: 22, transform: dir === "left" ? "scaleX(-1)" : "none" }}
      aria-hidden="true"
    >
      <path
        d="M9 4 L17 12 L9 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.6"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </svg>
  );
}
