import { Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<div>Landing</div>} />
      <Route path="/vintacool" element={<div>Vintacool</div>} />
      <Route path="/web" element={<div>Web</div>} />
      <Route path="/automation" element={<div>Automation</div>} />
    </Routes>
  );
}