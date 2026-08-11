import { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Home from "./Pages/Home";
//import Work from "./Pages/work";
import Sekriac from "./Pages/Sekriac";
import Artists from "./Pages/Artists";
import ArtistDetail from "./Pages/ArtistDetail";
import Navbar from "./componants/Navbar";
import AdminLogin from "./Pages/admin/AdminLogin";
import AdminDashboard from "./Pages/admin/AdminDashboard";
import AdminHomeVideos from "./Pages/admin/AdminHomeVideos";
import AdminServicesVideos from "./Pages/admin/AdminServicesVideos";
import AdminWorks from "./Pages/admin/AdminWorks";
import AdminCategories from "./Pages/admin/AdminCategories";
import AdminArtists from "./Pages/admin/AdminArtists";
import AdminArtistWorks from "./Pages/admin/AdminArtistWorks";
import Contact from "./Pages/Contact";
import Footer from "./componants/Footer";
import Production from "./Pages/Production";
import Agency from "./Pages/Agency";
import Community from "./Pages/Community";
import Journal from "./Pages/Journal";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/production" element={<Production />} />
      <Route path="/agency" element={<Agency />} />
      <Route path="/community" element={<Community />} />
      <Route path="/journal" element={<Journal />} />
      {/* <Route path="/work" element={<Work />} /> */}
      <Route path="/sekriac" element={<Sekriac />} /> 
       
      <Route path="/contact" element={<Contact />} /> 
      <Route path="/sekrick" element={<Sekriac />} />
      <Route path="/artists" element={<Artists />} />
      <Route path="/artists/:id" element={<ArtistDetail />} />
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/home-videos" element={<AdminHomeVideos />} />
      <Route path="/admin/services-videos" element={<AdminServicesVideos />} />
      <Route path="/admin/works" element={<AdminWorks />} />
      <Route path="/admin/categories" element={<AdminCategories />} />
      <Route path="/admin/artists" element={<AdminArtists />} />
      <Route path="/admin/artist-works" element={<AdminArtistWorks />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <AppRoutes />
      <Footer />
     
    </>
  );
}
