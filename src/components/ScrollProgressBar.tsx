import { useEffect, useRef } from "react";

/** Barra lateral de progreso de lectura (escritorio). Se mueve con el scroll, sin librerías. */
export default function ScrollProgressBar() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      if (barRef.current) barRef.current.style.transform = `scaleY(${p})`;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="hidden md:block"
      style={{
        position: "fixed",
        right: "18px",
        top: "50%",
        transform: "translateY(-50%)",
        width: "6px",
        height: "38vh",
        borderRadius: "9999px",
        background: "oklch(30% 0.03 240 / 0.55)",
        zIndex: 50,
        pointerEvents: "none",
      }}
    >
      <div
        ref={barRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          borderRadius: "9999px",
          background: "oklch(58% 0.14 240)",
          boxShadow: "0 0 12px oklch(58% 0.14 240 / 0.5)",
          transformOrigin: "top",
          transform: "scaleY(0)",
          transition: "transform 120ms linear",
          height: "100%",
        }}
      />
    </div>
  );
}
