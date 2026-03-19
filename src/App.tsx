import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";

function Header() {
  const location = useLocation();
  return (
    <header style={{ width: "100%", padding: "14px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #1a2a45", background: "#080c14", position: "sticky", top: 0, zIndex: 100 }}>
      <Link to="/" style={{ textDecoration: "none", color: "#8ba3c9", fontFamily: "monospace", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" }}>
        ⚡ InterviewAI
      </Link>
      <nav style={{ display: "flex", gap: 28 }}>
        {[{ label: "Interview", path: "/" }, { label: "Study", path: "/study" }].map(item => (
          <Link key={item.path} to={item.path} style={{ textDecoration: "none", fontFamily: "monospace", fontSize: "0.8rem", color: location.pathname === item.path ? "#60a5fa" : "#5a7299" }}>
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

import Interview from "./pages/Interview";
import Study from "./pages/Study";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Interview />} />
        <Route path="/study" element={<Study />} />
      </Routes>
    </BrowserRouter>
  );
}