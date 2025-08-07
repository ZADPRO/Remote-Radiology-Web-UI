import { tokenService } from "@/lib/tokenService";
import { useEffect, useRef } from "react";

const REFRESH_INTERVAL = 180 * 60 * 1000; // 180 minutes = 3 Hours

export const useIdleLogout = (refreshToken: () => void, logout: () => void) => {
  const isUserActiveRef = useRef(true);
  const hasRefreshedOnceRef = useRef(false);

  const handleUserActivity = () => {
    isUserActiveRef.current = true;
    hasRefreshedOnceRef.current = false;
  };


  console.log(isUserActiveRef, hasRefreshedOnceRef)
  useEffect(() => {
    const events = ["mousemove", "keydown", "click", "scroll"];
    events.forEach((event) =>
      window.addEventListener(event, handleUserActivity)
    );

    const interval = setInterval(() => {
      const token = tokenService.getToken();
      const lastUpdated = tokenService.getLastUpdated();

      if (!token || !lastUpdated) {
        logout();
        clearInterval(interval);
        return;
      }

      const now = Date.now();
      const timeSinceLastUpdate = now - lastUpdated;

      if (isUserActiveRef.current) {
        if (timeSinceLastUpdate >= REFRESH_INTERVAL) {
          refreshToken();
        }
        isUserActiveRef.current = false;
        hasRefreshedOnceRef.current = false;
      } else {
        // Inactive
        if (!hasRefreshedOnceRef.current) {
          refreshToken(); // 1st refresh on inactivity
          hasRefreshedOnceRef.current = true;
        } else {
          logout(); // 2nd interval of inactivity
          clearInterval(interval);
        }
      }
    }, REFRESH_INTERVAL);

    return () => {
      clearInterval(interval);
      events.forEach((event) =>
        window.removeEventListener(event, handleUserActivity)
      );
    };
  }, [refreshToken, logout]);
};
