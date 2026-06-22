import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";

function About() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <h1 className="text-6xl font-bold text-white">
        ABOUT PAGE
      </h1>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
    </Routes>
  );
}