export default function Hanger({ w, dim = 1 }) {
  return (
    <svg
      viewBox="0 0 96 46"
      style={{
        width: w * 0.38,
        display: "block",
        margin: "0 auto",
        opacity: dim,
      }}
      aria-hidden="true"
    >
      <path
        d="M48 4 q10 0 10 8.5 t-10 8.5"
        fill="none"
        stroke="#98A0A5"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M48 21 L11 41 L85 41 Z"
        fill="none"
        stroke="#A7AEB3"
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </svg>
  );
}
