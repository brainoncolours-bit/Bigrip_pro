import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./Pages/Home";
import Work from "./Pages/work";
import Sekriac from "./Pages/Sekriac";
import Navbar from "./componants/Navbar";
import AdminLogin from "./Pages/admin/AdminLogin";
import AdminWorks from "./Pages/admin/AdminWorks";
import Contact from "./Pages/Contact";
import Footer from "./componants/Footer";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/work" element={<Work />} />
      <Route path="/sekriac" element={<Sekriac />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/sekrick" element={<Sekriac />} />
      <Route path="/admin" element={<Navigate to="/admin/works" replace />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/works" element={<AdminWorks />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <>
      <Navbar />
      <AppRoutes />
      <Footer />
    </>
  );
}
