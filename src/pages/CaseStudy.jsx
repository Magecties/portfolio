import { useRef } from "react";
import { Link, useParams } from "react-router-dom";
import CaseShell from "../components/CaseShell";
import usePageFocus from "../hooks/usePageFocus";
import { CASES, findCase } from "../data/cases";

const OWNER = "Magnus Bach Billeskov Brask";
const pad = (n) => String(n).padStart(2, "0");

function Figure({ image }) {
  return (
    <figure className="case-figure" style={image.maxWidth ? { maxWidth: image.maxWidth } : undefined}>
      <img src={image.src} alt={image.alt} loading="lazy" decoding="async" />
      {image.caption && <figcaption>{image.caption}</figcaption>}
    </figure>
  );
}

const STATUS = {
  done: { mark: "✓", text: "Gennemført" },
  partial: { mark: "◐", text: "Delvist" },
  skipped: { mark: "–", text: "Fravalgt" },
};

// Prioriteret plan: grupper af forbedringer med status, nummereret fortløbende.
function Plan({ groups }) {
  // Første nummer i hver gruppe, så nummereringen fortsætter på tværs af grupperne.
  const starts = groups.map((_, k) => 1 + groups.slice(0, k).reduce((sum, g) => sum + g.items.length, 0));
  return (
    <div className="case-plan">
      {groups.map((g, k) => (
        <div key={g.group} className="case-plan-group">
          <h3 className="case-eyebrow">{g.group}</h3>
          <ol start={starts[k]}>
            {g.items.map((it, j) => (
              <li key={it.label} data-status={it.status}>
                <span className="case-plan-n" aria-hidden="true">
                  {pad(starts[k] + j)}
                </span>
                <span className="case-plan-label">{it.label}</span>
                <span className="case-plan-status">
                  <span aria-hidden="true">{STATUS[it.status].mark}</span> {STATUS[it.status].text}
                </span>
              </li>
            ))}
          </ol>
        </div>
      ))}
    </div>
  );
}

// Forbedringskort: problem → løsning → verifikation med før/efter-evidens.
function Improvement({ item, index }) {
  return (
    <article className="case-item" aria-labelledby={`item-${index}`}>
      <header className="case-item-head">
        <span className="case-num" aria-hidden="true">
          {String.fromCharCode(65 + index)}
        </span>
        <h3 id={`item-${index}`} className="brand">
          {item.title}
        </h3>
        {item.branch && <code className="case-branch">{item.branch}</code>}
      </header>
      <dl className="case-item-text">
        <div>
          <dt>Problem</dt>
          <dd>{item.problem}</dd>
        </div>
        <div>
          <dt>Løsning</dt>
          <dd>{item.fix}</dd>
        </div>
        <div>
          <dt>Verifikation</dt>
          <dd>{item.check}</dd>
        </div>
      </dl>
      <div className="case-compare" data-stack={item.stack || undefined}>
        {item.before && (
          <figure>
            <figcaption className="case-eyebrow">Før</figcaption>
            <img src={item.before.src} alt={item.before.alt} loading="lazy" decoding="async" />
          </figure>
        )}
        {(item.code || item.after) && (
          <figure>
            <figcaption className="case-eyebrow">Efter</figcaption>
            {item.code ? (
              <pre className="case-code" tabIndex={0}>
                <code>{item.code}</code>
              </pre>
            ) : (
              <img src={item.after.src} alt={item.after.alt} loading="lazy" decoding="async" />
            )}
          </figure>
        )}
      </div>
    </article>
  );
}

function Outputs({ links }) {
  return (
    <section className="case-outputs" aria-labelledby="outputs">
      <h2 id="outputs" className="case-eyebrow">
        Løsninger og outputs
      </h2>
      <ul>
        {links.map((l) => (
          <li key={l.label}>
            {l.href ? (
              <a href={l.href} target="_blank" rel="noreferrer">
                <span>{l.label}</span>
                <span aria-hidden="true">↗</span>
                <span className="sr-only"> (åbner i en ny fane)</span>
              </a>
            ) : (
              <span className="case-pending" aria-disabled="true">
                {l.label} (kommer)
              </span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

function Pager({ index }) {
  const prev = CASES[index - 1];
  const next = CASES[index + 1];
  return (
    <nav className="case-pager" aria-label="Andre cases">
      {prev ? (
        <Link to={`/case/${prev.slug}`} className="case-pager-link">
          <span className="case-eyebrow">Forrige case</span>
          <span className="brand">{prev.client}</span>
        </Link>
      ) : (
        <span />
      )}
      <Link to="/cases" className="case-pager-all">
        Alle cases
      </Link>
      {next ? (
        <Link to={`/case/${next.slug}`} className="case-pager-link case-pager-next">
          <span className="case-eyebrow">Næste case</span>
          <span className="brand">{next.client}</span>
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}

export default function CaseStudy() {
  const { slug } = useParams();
  const heading = useRef(null);
  const item = findCase(slug);
  const index = CASES.indexOf(item);

  usePageFocus(item ? `${item.client} · Case ${item.number} · ${OWNER}` : `Casen findes ikke · ${OWNER}`, heading);

  if (!item) {
    return (
      <CaseShell>
        <div className="case-hero">
          <h1 ref={heading} tabIndex={-1} className="brand case-title">
            Casen findes ikke
          </h1>
          <p className="case-lead">
            Linket peger på en case, der ikke findes. <Link to="/cases">Se alle cases</Link>.
          </p>
        </div>
      </CaseShell>
    );
  }

  const imagesAfter = (id) => item.images.filter((img) => img.after === id);

  return (
    <CaseShell right={`Case ${pad(item.number)} / ${pad(CASES.length)}`} footer={<Pager index={index} />}>
      <div className="case-hero">
        <p className="case-eyebrow">
          Case {item.number} · {item.client}
        </p>
        <h1 ref={heading} tabIndex={-1} className="brand case-title">
          {item.title}
        </h1>
        <dl className="case-meta">
          {item.meta.map((m) => (
            <div key={m.label}>
              <dt>{m.label}</dt>
              <dd>{m.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <p className="case-lead">{item.lead}</p>

      <Outputs links={item.links} />
      {imagesAfter("intro").map((img) => (
        <Figure key={img.src} image={img} />
      ))}

      {item.sections.map((s, k) => (
        <section key={s.id} className="case-section" aria-labelledby={s.id}>
          <div className="case-section-head">
            <span className="case-num" aria-hidden="true">
              {pad(k + 1)}
            </span>
            <h2 id={s.id} className="brand">
              {s.heading}
            </h2>
          </div>
          <div className="case-body">
            {s.body.map((p, j) => (
              <p key={j} data-todo={p.startsWith("SKRIV HER") || p.startsWith("UDFYLD") || undefined}>
                {p}
              </p>
            ))}
          </div>
          {s.plan && <Plan groups={s.plan} />}
          {s.items?.map((it, j) => (
            <Improvement key={it.title} item={it} index={j} />
          ))}
          {imagesAfter(s.id).map((img) => (
            <Figure key={img.src} image={img} />
          ))}
        </section>
      ))}

      {(item.sources?.length > 0 || item.declaration) && (
        <aside className="case-notes" aria-label="Kilder og deklaration">
          {item.sources?.length > 0 && (
            <>
              <h2 className="case-eyebrow">Kilder</h2>
              <ul>
                {item.sources.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </>
          )}
          {item.declaration && (
            <>
              <h2 className="case-eyebrow">Deklaration af generativ AI</h2>
              <p>{item.declaration}</p>
            </>
          )}
        </aside>
      )}
    </CaseShell>
  );
}
