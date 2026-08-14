const BASE = import.meta.env.BASE_URL;

export const GARMENTS = [
  {
    name: "Tirsdags Depression Klub",
    image: `${BASE}garments/tirsdags.webp`,
    note: "Idé, opsætning og klargøring til tryk. Jeg holdt skriften skæv og lidt slidt, så trøjen ligner en man har haft længe i skabet.",
  },
  {
    name: "Jeg Elsker Heste",
    image: `${BASE}garments/heste.webp`,
    note: "Første design i serien, hvor kun motivet skifter. Ét fast layout gav genkendelse på tværs af trøjerne og gjorde nye designs hurtige at lave.",
  },
  {
    name: "Jeg Elsker Anime",
    image: `${BASE}garments/anime.webp`,
    note: "Samme skabelon som resten af serien. Motivet er tegnet op i store flader, så det står rent i ét lag og ikke drukner på mørkt stof.",
  },
  {
    name: "Jeg Elsker Jord",
    image: `${BASE}garments/jord.webp`,
    note: "Sat i to farver for at holde trykprisen nede. Jeg justerede stregtykkelsen, så detaljerne ikke lukker sig på de mindste størrelser.",
  },
];

export const FLOOR_SHADOW = `${BASE}garments/shadow.webp`;
