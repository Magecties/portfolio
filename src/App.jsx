import { Routes, Route } from "react-router-dom";
import Vintacool from "./pages/Vintacool";
import Web from "./pages/Web";
import Automation from "./pages/Automation";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<div>Landing</div>} />
      <Route path="/vintacool" element={<Vintacool />} />
      <Route path="/web" element={<Web />} />
      <Route path="/automation" element={<Automation />} />
    </Routes>
  );
}