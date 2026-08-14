const BASE = import.meta.env.BASE_URL;

export const SITES = [
  {
    name: "WE-CRUIT",
    url: "we-cruit.com",
    stack: "WordPress · Yoast · Make",
    accent: "#2F7A5B",
    shot: `${BASE}shots/we-cruit.webp`,
    role: "Design · Opbygning · SEO",
    note: "Jeg byggede siden op i WordPress og lagde struktur, tekst og SEO på plads med Yoast. Kontaktformularen sender videre til et Make-scenarie, så nye henvendelser bliver til opgaver i stedet for at ligge i en indbakke.",
    blocks: ["hero", "text", "cards", "band", "text", "cards", "foot"],
  },
  {
    name: "Vintacool",
    url: "vintacool.dk",
    stack: "Shopify · Liquid",
    accent: "#B4653F",
    shot: `${BASE}shots/vintacool.webp`,
    role: "Webshop · Foto · Drift",
    note: "Webshoppen kører på Shopify med et tema, jeg har rettet til i Liquid. Jeg står selv for produktbilleder, opsætning af kollektioner og den daglige drift — fra nye varer kommer ind til pakken er sendt.",
    blocks: ["hero", "grid", "text", "grid", "band", "foot"],
  },
];
