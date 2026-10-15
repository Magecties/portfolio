import { Routes, Route } from "react-router-dom";
import Vintacool from "./pages/Vintacool";
import Web from "./pages/Web";
import Automation from "./pages/Automation";
import Landing from "./pages/Landing";
import Cases from "./pages/Cases";
import CaseStudy from "./pages/CaseStudy";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/vintacool" element={<Vintacool />} />
      <Route path="/web" element={<Web />} />
      <Route path="/automation" element={<Automation />} />
      <Route path="/cases" element={<Cases />} />
      <Route path="/case/:slug" element={<CaseStudy />} />
    </Routes>
  );
}