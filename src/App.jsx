import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import PreviousNews from "./pages/PreviousNews.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/history" element={<PreviousNews />} />
      </Routes>
    </BrowserRouter>
  );
}
