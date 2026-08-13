import { INK } from "../theme";

export default function MockPage({ site, w }) {
  const u = w / 100;

  const block = (kind, i) => {
    if (kind === "hero")
      return (
        <div key={i} style={{ padding: `${u * 7}px ${u * 6}px`, display: "flex", flexDirection: "column", gap: u * 2 }}>
          <div style={{ height: u * 9, width: "62%", background: site.accent, borderRadius: 2 }} />
          <div style={{ height: u * 1.6, width: "78%", background: "#E9E9E5", borderRadius: 3 }} />
          <div style={{ height: u * 1.6, width: "56%", background: "#E9E9E5", borderRadius: 3 }} />
          <div style={{ height: u * 4, width: u * 22, background: INK, borderRadius: 2, marginTop: u * 2 }} />
        </div>
      );
    if (kind === "text")
      return (
        <div key={i} style={{ padding: `${u * 4}px ${u * 6}px`, display: "flex", flexDirection: "column", gap: u * 1.4 }}>
          {[92, 84, 88, 60].map((wd, k) => (
            <div key={k} style={{ height: u * 1.4, width: `${wd}%`, background: "#EDEDE9", borderRadius: 3 }} />
          ))}
        </div>
      );
    if (kind === "cards")
      return (
        <div key={i} style={{ padding: `${u * 4}px ${u * 6}px`, display: "flex", gap: u * 2 }}>
          {[0, 1, 2].map((k) => (
            <div key={k} style={{ flex: 1, height: u * 20, background: k === 1 ? `${site.accent}1A` : "#F5F5F2", borderRadius: 3 }} />
          ))}
        </div>
      );
    if (kind === "grid")
      return (
        <div key={i} style={{ padding: `${u * 4}px ${u * 6}px`, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: u * 1.6 }}>
          {Array.from({ length: 8 }, (_, k) => (
            <div key={k} style={{ height: u * 16, background: "#F2F2EF", borderRadius: 2 }} />
          ))}
        </div>
      );
    if (kind === "band")
      return <div key={i} style={{ height: u * 26, background: site.accent, opacity: 0.9, margin: `${u * 3}px 0` }} />;
    return (
      <div key={i} style={{ padding: `${u * 5}px ${u * 6}px`, background: "#F7F7F4", display: "flex", gap: u * 3 }}>
        {[0, 1, 2, 3].map((k) => (
          <div key={k} style={{ flex: 1, display: "flex", flexDirection: "column", gap: u }}>
            {[0, 1, 2].map((j) => (
              <div key={j} style={{ height: u * 1.2, background: "#E4E4E0", borderRadius: 3 }} />
            ))}
          </div>
        ))}
      </div>
    );
  };

  return <div style={{ background: "#fff" }}>{site.blocks.map(block)}</div>;
}
