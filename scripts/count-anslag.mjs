// Tæller anslag (tegn inkl. mellemrum) i casesidernes brødtekst: lead + alle
// afsnit. Overskrifter, links og billedtekster tælles ikke med i grænsen.
import { CASES } from "../src/data/cases.js";

const LIMIT = 12000;
const PER_CASE = 3800;
const PLACEHOLDER = /SKRIV HER|SKIV HER|UDFYLD|TODO/;

const len = (s) => [...s].length;
const pad = (v, n) => String(v).padStart(n);

let total = 0;
const todos = [];

console.log("\nCase                 Brødtekst   Guide   Overskr.+tekster");
console.log("-".repeat(60));

for (const c of CASES) {
  // Brødtekst: lead, afsnit, punkterne i planen og teksten i forbedringskortene.
  // Kodeeksempler, billeder og overskrifter tæller ikke med.
  const paragraphs = [
    c.lead,
    ...c.sections.flatMap((s) => s.body),
    ...c.sections.flatMap((s) => (s.bullets ?? []).map((b) => `${b.lead}: ${b.text}`)),
    ...c.sections.flatMap((s) => (s.plan ?? []).flatMap((g) => g.items.map((it) => it.label))),
    ...c.sections.flatMap((s) => (s.items ?? []).flatMap((it) => [it.problem, it.fix, it.check])),
  ].filter(Boolean);
  const body = paragraphs.reduce((sum, p) => sum + len(p), 0);
  const extra =
    len(c.title) +
    c.sections.reduce((sum, s) => sum + len(s.heading), 0) +
    c.images.reduce((sum, img) => sum + len(img.caption ?? ""), 0);
  total += body;

  const strings = [c.lead, ...c.sections.flatMap((s) => s.body), ...c.meta.map((m) => m.value)];
  const open = strings.filter((s) => PLACEHOLDER.test(s)).length;
  const missingLinks = c.links.filter((l) => !l.href).map((l) => l.label);
  if (open) todos.push(`${c.client}: ${open} pladsholder(e) tilbage`);
  if (missingLinks.length) todos.push(`${c.client}: mangler link til ${missingLinks.join(", ")}`);

  const flag = body > PER_CASE ? "  (over guide)" : "";
  console.log(`${c.client.padEnd(20)} ${pad(body, 9)}   ${pad(PER_CASE, 5)}   ${pad(extra, 6)}${flag}`);
}

console.log("-".repeat(60));
const left = LIMIT - total;
console.log(`${"I alt".padEnd(20)} ${pad(total, 9)}   ${pad(LIMIT, 5)}   ${left >= 0 ? `${left} tilbage` : `${-left} FOR MEGET`}`);

if (todos.length) {
  console.log("\nIkke færdigt:");
  for (const t of todos) console.log(`  - ${t}`);
}
console.log("");
