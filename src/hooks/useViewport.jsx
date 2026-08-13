import { useEffect, useState } from "react";

export default function useViewport() {
  const [vp, setVp] = useState({ w: 1200, h: 800 });

  useEffect(() => {
    const on = () => setVp({ w: window.innerWidth, h: window.innerHeight });
    on();
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);

  return vp;
}