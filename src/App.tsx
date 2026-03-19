import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
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