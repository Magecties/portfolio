import { Link } from "react-router-dom";
import Chevron from "./Chevron";

// Ramme om de scrollende eksamenssider: topbar med tilbage-link, indhold og footer.
export default function CaseShell({ right, children, footer }) {
  return (
    <div className="case" lang="da">
      <a className="case-skip" href="#indhold">
        Spring til indhold
      </a>
      <header className="case-wrap case-top">
        <Link className="case-back" to="/">
          <Chevron dir="left" />
          <span>Forside</span>
        </Link>
        {right && <span className="case-count">{right}</span>}
      </header>
      <main id="indhold" className="case-wrap">
        {children}
      </main>
      <footer className="case-wrap case-foot">
        {footer}
        <p className="case-credit">Magnus Bach Billeskov Brask · Multimediedesigner · 2026</p>
      </footer>
    </div>
  );
}
