import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const NAV_SEQUENCE = [
  "/",            // Home
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
  const routeCooldown = useRef(true);
  const overscrollDeltaY = useRef(0);
  const boundaryEnterTime = useRef(0);

  useEffect(() => {
    isNavigating.current = false;
    overscrollDeltaY.current = 0;
    boundaryEnterTime.current = 0;
    
    // Prevent inertia/coasting from previous page from immediately triggering on new route
    routeCooldown.current = true;
    const cooldownTimer = setTimeout(() => {
      routeCooldown.current = false;
    }, 700);

    const currentPath = location.pathname;
    const currentIndex = NAV_SEQUENCE.indexOf(currentPath);

    if (currentIndex === -1) return;

    const triggerNavigation = (targetRoute, scrollToBottom = false) => {
      if (isNavigating.current || !targetRoute) return;
      isNavigating.current = true;

      setTimeout(() => {
        navigate(targetRoute);
        if (scrollToBottom) {
          setTimeout(() => {
            window.scrollTo({
              top: document.documentElement.scrollHeight,
              behavior: "instant"
            });
          }, 50);
        } else {
          window.scrollTo({ top: 0, behavior: "instant" });
        }
      }, 250);
    };

    // 1. Mouse Wheel / Trackpad Scroll Detection
    const handleWheel = (e) => {
      if (routeCooldown.current || isNavigating.current) return;

      const scrollY = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight;
      const innerHeight = window.innerHeight;

      const isAtBottom = innerHeight + scrollY >= scrollHeight - 8;
      const isAtTop = scrollY <= 5;

      const now = Date.now();

      // Check Bottom Boundary Overscroll
      if (isAtBottom && e.deltaY > 0 && currentIndex < NAV_SEQUENCE.length - 1) {
        if (!boundaryEnterTime.current) {
          boundaryEnterTime.current = now;
        }

        // Must stay at boundary for at least 300ms, and accumulate deliberate overscroll intent
        if (now - boundaryEnterTime.current > 300) {
          overscrollDeltaY.current += e.deltaY;
          if (overscrollDeltaY.current > 180) {
            triggerNavigation(NAV_SEQUENCE[currentIndex + 1], false);
          }
        }
      } 
      // Check Top Boundary Overscroll
      else if (isAtTop && e.deltaY < 0 && currentIndex > 0) {
        if (!boundaryEnterTime.current) {
          boundaryEnterTime.current = now;
        }

        if (now - boundaryEnterTime.current > 300) {
          overscrollDeltaY.current += Math.abs(e.deltaY);
          if (overscrollDeltaY.current > 180) {
            triggerNavigation(NAV_SEQUENCE[currentIndex - 1], true);
          }
        }
      } 
      // Reset if user is scrolling normally within content
      else {
        overscrollDeltaY.current = 0;
        boundaryEnterTime.current = 0;
      }
    };

    // 2. Mobile Touch Swipe Detection
    const handleTouchStart = (e) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      if (routeCooldown.current || isNavigating.current) return;

      const scrollY = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight;
      const innerHeight = window.innerHeight;

      const isAtBottom = innerHeight + scrollY >= scrollHeight - 8;
      const isAtTop = scrollY <= 5;

      const currentY = e.touches[0].clientY;
      const swipeDistance = touchStartY.current - currentY; // positive = swipe up (scroll down)

      // Swipe Up at Bottom (requires a solid, deliberate pull > 120px)
      if (isAtBottom && swipeDistance > 120 && currentIndex < NAV_SEQUENCE.length - 1) {
        triggerNavigation(NAV_SEQUENCE[currentIndex + 1], false);
      }

      // Swipe Down at Top (pull down > 120px)
      if (isAtTop && swipeDistance < -120 && currentIndex > 0) {
        triggerNavigation(NAV_SEQUENCE[currentIndex - 1], true);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    return () => {
      clearTimeout(cooldownTimer);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [location.pathname, navigate]);

  return null;
}