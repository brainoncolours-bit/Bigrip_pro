import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// Order of your navbar routes
const NAV_SEQUENCE = [
  "/",            // Home (Sekrick)
  "/production",
  "/agency",
  "/community",
  "/artists",
  "/journal",
  "/contact"
];

export default function AutoScrollNavigator() {
  const location = useLocation();
  const navigate = useNavigate();
  const isNavigating = useRef(false);
  const touchStartY = useRef(0);

  useEffect(() => {
    // Reset navigating flag and scroll to top on route change
    isNavigating.current = false;
    window.scrollTo(0, 0);

    const currentPath = location.pathname;
    const currentIndex = NAV_SEQUENCE.indexOf(currentPath);

    // If on the last route or an admin/detail route, don't auto-navigate
    if (currentIndex === -1 || currentIndex === NAV_SEQUENCE.length - 1) {
      return;
    }

    const nextRoute = NAV_SEQUENCE[currentIndex + 1];

    const triggerNextPage = () => {
      if (isNavigating.current) return;
      isNavigating.current = true;

      // Small delay for smooth visual cue before transition
      setTimeout(() => {
        navigate(nextRoute);
      }, 400);
    };

    // 1. Wheel / Trackpad Scroll Detection at Bottom
    const handleWheel = (e) => {
      const isAtBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 15;

      // User scrolls downward while already at the bottom
      if (isAtBottom && e.deltaY > 30) {
        triggerNextPage();
      }
    };

    // 2. Mobile Touch Swipe Detection at Bottom
    const handleTouchStart = (e) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      const isAtBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 15;

      const currentY = e.touches[0].clientY;
      const swipeDistance = touchStartY.current - currentY;

      // User swipes up while at the bottom
      if (isAtBottom && swipeDistance > 60) {
        triggerNextPage();
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [location.pathname, navigate]);

  return null;
}