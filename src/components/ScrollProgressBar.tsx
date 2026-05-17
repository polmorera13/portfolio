import { useScroll, useSpring, motion } from "framer-motion";

export default function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

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
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          borderRadius: "9999px",
          background: "oklch(58% 0.14 240)",
          boxShadow: "0 0 12px oklch(58% 0.14 240 / 0.5)",
          transformOrigin: "top",
          scaleY,
          height: "100%",
        }}
      />
    </div>
  );
}
