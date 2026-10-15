import { useState } from "react";

const pad = (n) => String(n).padStart(2, "0");

const STATUS = {
  done: { mark: "✓", text: "Gennemført" },
  partial: { mark: "◐", text: "Delvist" },
  skipped: { mark: "–", text: "Fravalgt" },
  high: { mark: "●", text: "Høj" },
  medium: { mark: "◐", text: "Mellem" },
  met: { mark: "✓", text: "Opfyldt" },
  fix: { mark: "!", text: "Skal forbedres" },
  na: { mark: "–", text: "Ikke vurderet" },
};

// Ét billede eller ét kodeudsnit. `light` giver lys baggrund til skærmbilleder af UI.
function Shot({ media }) {
  if (media.code) {
    return (
      <pre className="case-code" tabIndex={0}>
        <code>{media.code}</code>
      </pre>
    );
  }
  return <img src={media.src} alt={media.alt} loading="lazy" decoding="async" />;
}

function Single({ media }) {
  return (
    <figure className="story-figure" data-light={media.light || undefined}>
      <div className="story-frame">
        <Shot media={media} />
      </div>
      {media.caption && <figcaption>{media.caption}</figcaption>}
    </figure>
  );
}

// To billeder side om side, hver med sin egen billedtekst (fx før og efter).
function Pair({ items }) {
  return (
    <div className="story-pair" data-count={items.length}>
      {items.map((m) => (
        <figure key={m.label} className="story-figure" data-light={m.light || undefined}>
          <p className="case-eyebrow">{m.label}</p>
          <div className="story-frame">
            <Shot media={m} />
          </div>
          {m.caption && <figcaption>{m.caption}</figcaption>}
        </figure>
      ))}
    </div>
  );
}

function Carousel({ slides, label, ratio }) {
  const [i, setI] = useState(0);
  const go = (d) => setI((v) => (v + d + slides.length) % slides.length);
  const s = slides[i];

  return (
    <figure
      className="story-carousel"
      role="group"
      aria-roledescription="karrusel"
      aria-label={label}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(1);
        if (e.key === "ArrowLeft") go(-1);
      }}
    >
      <div
        className="story-frame story-carousel-frame"
        data-light={s.light || undefined}
        style={ratio ? { aspectRatio: ratio } : undefined}
      >
        <Shot media={s} />
      </div>
      <div className="story-carousel-bar">
        <button type="button" onClick={() => go(-1)} aria-label="Forrige billede">
          ←
        </button>
        <p className="story-carousel-count" aria-live="polite">
          {pad(i + 1)} / {pad(slides.length)} · {s.title}
        </p>
        <button type="button" onClick={() => go(1)} aria-label="Næste billede">
          →
        </button>
      </div>
      {s.caption && <figcaption>{s.caption}</figcaption>}
    </figure>
  );
}

function Plan({ groups }) {
  const starts = groups.map((_, k) => 1 + groups.slice(0, k).reduce((sum, g) => sum + g.items.length, 0));
  return (
    <div className="story-plan">
      {groups.map((g, k) => (
        <div key={g.group}>
          <h3 className="case-eyebrow">{g.group}</h3>
          <ol start={starts[k]}>
            {g.items.map((it, j) => (
              <li key={it.label} data-status={it.status}>
                <span className="case-plan-n" aria-hidden="true">
                  {pad(starts[k] + j)}
                </span>
                <span>{it.label}</span>
                {it.status && (
                  <span className="case-plan-status">
                    <span aria-hidden="true">{STATUS[it.status].mark}</span> {STATUS[it.status].text}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </div>
      ))}
    </div>
  );
}

function OneMedia({ m, label }) {
  if (m.type === "carousel") return <Carousel slides={m.slides} label={m.label ?? label} ratio={m.ratio} />;
  if (m.type === "pair") return <Pair items={m.items} />;
  return <Single media={m} />;
}

// En sektion kan have ét medie eller en liste af medier, der vises under hinanden.
function Media({ section }) {
  if (section.plan) return <Plan groups={section.plan} />;
  if (!section.media) return null;
  const list = Array.isArray(section.media) ? section.media : [section.media];
  return (
    <div className="story-media-list">
      {list.map((m, k) => (
        <OneMedia key={k} m={m} label={section.heading} />
      ))}
    </div>
  );
}

function Text({ section }) {
  return (
    <div className="story-text">
      {section.body.map((p, j) => (
        <p key={j} data-todo={p.startsWith("UDFYLD") || undefined}>
          {p}
        </p>
      ))}
      {section.bullets && (
        <ul className="case-bullets">
          {section.bullets.map((b) => (
            <li key={b.lead}>
              <strong>{b.lead}:</strong> {b.text}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Head({ section, n }) {
  return (
    <div className="story-head">
      <span className="case-num" aria-hidden="true">
        {pad(n)}
      </span>
      <h2 id={section.id} className="brand">
        {section.heading}
      </h2>
    </div>
  );
}

// Sektioner: "split" (tekst + medie side om side), "wide" (tekst øverst, medie i fuld bredde)
// og ren tekst, hvor overskriften står til venstre og teksten til højre.
export function StorySection({ section, n }) {
  const hasMedia = Boolean(section.media || section.plan);
  const layout = !hasMedia ? "text" : section.wide ? "wide" : "split";

  return (
    <section
      className="story-section"
      data-layout={layout}
      aria-labelledby={section.id}
    >
      {layout === "split" ? (
        <>
          <div>
            <Head section={section} n={n} />
            <Text section={section} />
          </div>
          <div className="story-media">
            <Media section={section} />
          </div>
        </>
      ) : (
        <>
          <Head section={section} n={n} />
          <Text section={section} />
          {layout === "wide" && (
            <div className="story-media">
              <Media section={section} />
            </div>
          )}
        </>
      )}
    </section>
  );
}

export function StoryIntro({ item, headingRef }) {
  return (
    <header className="story-intro">
      {item.cover && (
        <img
          className="story-cover"
          src={item.cover.src}
          alt={item.cover.alt}
          decoding="async"
          style={item.cover.position ? { objectPosition: item.cover.position } : undefined}
        />
      )}
      <div className="story-top">
        <span className="case-eyebrow">
          Case {pad(item.number)} · {item.client}
        </span>
        <span className="case-eyebrow">{item.year}</span>
      </div>
      <h1 ref={headingRef} tabIndex={-1} className="brand case-title">
        {item.title}
      </h1>
      {item.tags && (
        <ul className="story-tags" aria-label="Tags">
          {item.tags.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      )}
      <div className="story-overview">
        <dl className="story-meta">
          {item.meta.map((m) => (
            <div key={m.label}>
              <dt>{m.label}</dt>
              <dd>{m.value}</dd>
            </div>
          ))}
        </dl>
        <div>
          <p className="case-eyebrow">Om projektet</p>
          <p className="story-lead">{item.lead}</p>
          <ul className="story-links" aria-label="Løsninger og outputs">
            {item.links.map((l) => (
              <li key={l.label}>
                {l.href ? (
                  <a href={l.href} target="_blank" rel="noreferrer">
                    {l.label} <span aria-hidden="true">↗</span>
                    <span className="sr-only"> (åbner i en ny fane)</span>
                  </a>
                ) : (
                  <span className="case-pending">{l.label} (kommer)</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
}
