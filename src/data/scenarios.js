export const SCENARIOS = [
  {
    name: "Diktat → dokument",
    trigger: "Ny lydfil i /Diktater",
    stack: "Make · Whisper · GPT · Word",
    modules: [
      {
        label: "OneDrive",
        sub: "Watch files",
        tint: "#2B7CD3",
        does: "Holder øje med mappen /Diktater og henter nye lydfiler.",
        out: "memo_0412.m4a · 4 min 12 s",
      },
      {
        label: "Whisper",
        sub: "Transcribe",
        tint: "#5E9A46",
        does: "Sender lyden til transskribering på dansk.",
        out: "612 ord råtekst",
      },
      {
        label: "GPT",
        sub: "Ryd op",
        tint: "#7B62C4",
        does: "Fjerner fyldord, retter tegnsætning, opstiller i punkter.",
        out: "418 ord, seks punkter",
      },
      {
        label: "Word",
        sub: "Udfyld skabelon",
        tint: "#2B5DC0",
        does: "Skriver teksten ind i en skabelon med logo og dato.",
        out: "Notat_2026-04-12.docx",
      },
      {
        label: "OneDrive",
        sub: "Gem i /Noter",
        tint: "#2B7CD3",
        does: "Lægger dokumentet på plads og returnerer et delelink.",
        out: "Gemt · link klar",
      },
    ],
  },
];
