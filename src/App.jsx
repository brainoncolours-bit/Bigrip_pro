import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./Pages/Home";
import Work from "./Pages/work";
import Navbar from "./componants/Navbar";
import AdminLogin from "./Pages/admin/AdminLogin";
import AdminWorks from "./Pages/admin/AdminWorks";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/work" element={<Work />} />
        <Route path="/admin" element={<Navigate to="/admin/works" replace />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/works" element={<AdminWorks />} />
      </Routes>
    </>
  );
}
