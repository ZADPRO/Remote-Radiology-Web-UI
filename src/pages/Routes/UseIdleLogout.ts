import { useEffect, useRef } from "react";

const expiryTime = 15 * 60 * 1000; // 15 minutes

export const useIdleLogout = (
  refreshToken: () => void,
  logout: () => void
) => {
  const refreshCountRef = useRef(0);
  const isUserActiveRef = useRef(true);

  const handleUserActivity = () => {
    isUserActiveRef.current = true;
    refreshCountRef.current = 0;
  };

  console.log(refreshCountRef)

  useEffect(() => {
    const events = ["mousemove", "keydown", "click", "scroll"];
    events.forEach((event) =>
      window.addEventListener(event, handleUserActivity)
    );

    const interval = setInterval(() => {
      const token = localStorage.getItem("token");
      if (!token) return;

      if (!isUserActiveRef.current) {
        // User is idle
        if (refreshCountRef.current >= 2) {
          logout();
          clearInterval(interval);
        } else {
          refreshToken();
          refreshCountRef.current += 1;
        }
      } else {
        // User is active - reset for next cycle
        isUserActiveRef.current = false;
        refreshCountRef.current = 0;
        // Do NOT refresh token immediately here
      }
    }, expiryTime);

    return () => {
      clearInterval(interval);
      events.forEach((event) =>
        window.removeEventListener(event, handleUserActivity)
      );
    };
  }, [refreshToken, logout]);
};
