const BASE = import.meta.env.BASE_URL;

export const SITES = [
  {
    name: "WE-CRUIT",
    url: "we-cruit.com",
    stack: "WordPress · Yoast · Make",
    accent: "#2F7A5B",
    shot: `${BASE}shots/we-cruit.webp`,
    blocks: ["hero", "text", "cards", "band", "text", "cards", "foot"],
  },
  {
    name: "Vintacool",
    url: "vintacool.dk",
    stack: "Shopify · Liquid",
    accent: "#B4653F",
    shot: `${BASE}shots/vintacool.webp`,
    blocks: ["hero", "grid", "text", "grid", "band", "foot"],
  },
];
