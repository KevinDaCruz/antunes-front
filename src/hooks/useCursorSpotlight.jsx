import { useRef } from "react";

export function useCursorSpotlight(options = {}) {
  const { resetToCenterOnLeave = true } = options;
  const elementRef = useRef(null);

  function handleMouseMove(event) {
    if (!elementRef.current) {
      return;
    }

    const rect = elementRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    elementRef.current.style.setProperty("--spot-x", `${x}px`);
    elementRef.current.style.setProperty("--spot-y", `${y}px`);
  }

  function handleMouseLeave() {
    if (!elementRef.current || !resetToCenterOnLeave) {
      return;
    }

    elementRef.current.style.setProperty("--spot-x", "50%");
    elementRef.current.style.setProperty("--spot-y", "50%");
  }

  return {
    elementRef,
    spotlightHandlers: {
      onMouseMove: handleMouseMove,
      onMouseLeave: handleMouseLeave,
    },
  };
}
