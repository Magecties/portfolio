import { useRef } from "react";
import { Link } from "react-router-dom";
import CaseShell from "../components/CaseShell";
import Chevron from "../components/Chevron";
import usePageFocus from "../hooks/usePageFocus";
import { CASES } from "../data/cases";

export default function Cases() {
  const heading = useRef(null);
  usePageFocus("Eksamenscases · Magnus Bach Billeskov Brask", heading);

  return (
    <CaseShell>
      <div className="case-hero">
        <p className="case-eyebrow">Product Optimization · 3. semester</p>
        <h1 ref={heading} tabIndex={-1} className="brand case-title">
          Eksamenscases
        </h1>
      </div>
      <ul className="case-cards">
        {CASES.map((c) => (
          <li key={c.slug}>
            <Link to={`/case/${c.slug}`} className="case-card">
              <span className="case-num" aria-hidden="true">
                {String(c.number).padStart(2, "0")}
              </span>
              <span className="case-eyebrow">
                Case {c.number} · {c.client}
              </span>
              <span className="brand case-card-title">{c.title}</span>
              <span className="case-card-go" aria-hidden="true">
                <Chevron />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </CaseShell>
  );
}
