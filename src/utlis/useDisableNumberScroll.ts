import { useEffect } from "react";

export function useDisableNumberScroll() {
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const active = document.activeElement as HTMLElement;
      if (active?.tagName === "INPUT" && (active as HTMLInputElement).type === "number") {
        e.preventDefault();
      }
    };

    // Attach to the whole window
    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);
}
