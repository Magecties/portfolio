import { useEffect } from "react";

// SPA-navigation: sæt document.title, start fra toppen og flyt fokus til sidens
// overskrift, så skærmlæsere annoncerer den nye side. Titlen gendannes, når
// siden forlades, da de øvrige sider ikke selv sætter den.
export default function usePageFocus(title, headingRef) {
  useEffect(() => {
    const prev = document.title;
    document.title = title;
    window.scrollTo(0, 0);
    headingRef.current?.focus({ preventScroll: true });
    return () => {
      document.title = prev;
    };
  }, [title, headingRef]);
}
