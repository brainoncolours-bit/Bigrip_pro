import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Work from "./Pages/work";
import Navbar from "./componants/Navbar";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/work" element={<Work />} />
      </Routes>
    </>
  );
}
