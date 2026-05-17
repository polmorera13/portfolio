import { useRef, useState, useLayoutEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useTranslation } from "react-i18next";
import { fadeUp, staggerContainer, viewportOnce } from "../lib/motion";

type Step = { n?: string; title: string; desc?: string; description?: string };

function getDesc(step: Step) {
  return step.description ?? step.desc ?? "";
}

// ── Shared hook: measure circle centers relative to a container ───────────────
function useCircleCenters(count: number) {
  const containerRef = useRef<HTMLDivElement>(null);
  const circleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [points, setPoints] = useState<{ x: number; y: number }[]>([]);

  useLayoutEffect(() => {
    const measure = () => {
      const container = containerRef.current;
      if (!container) return;
      const containerBox = container.getBoundingClientRect();
      const pts = circleRefs.current
        .filter(Boolean)
        .map((el) => {
          const b = el!.getBoundingClientRect();
          return {
            x: b.left + b.width / 2 - containerBox.left,
            y: b.top + b.height / 2 - containerBox.top,
          };
        });
      if (pts.length === count) setPoints(pts);
    };

    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    circleRefs.current.forEach((el) => el && ro.observe(el));
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [count]);

  return { containerRef, circleRefs, points };
}

// ── Desktop horizontal timeline ───────────────────────────────────────────────
function DesktopTimeline({ steps }: { steps: Step[] }) {
  const { containerRef, circleRefs, points } = useCircleCenters(steps.length);

  const pathD =
    points.length === steps.length
      ? `M ${points.map((p) => `${p.x} ${p.y}`).join(" L ")}`
      : "";

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.8", "end 0.5"],
  });
  const rawProgress = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const drawProgress = useSpring(rawProgress, { stiffness: 60, damping: 20 });

  return (
    <div ref={containerRef} className="hidden lg:block relative">
      {pathD && (
        <svg
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            overflow: "visible",
            zIndex: 0,
            pointerEvents: "none",
          }}
        >
          {/* Track */}
          <path
            d={pathD}
            stroke="oklch(30% 0.03 240)"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Animated fill */}
          <motion.path
            d={pathD}
            stroke="oklch(58% 0.14 240 / 0.4)"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            style={{ pathLength: drawProgress }}
          />
        </svg>
      )}

      <div className="grid grid-cols-5 gap-4 relative z-10">
        {steps.map((step, i) => (
          <motion.div key={i} variants={fadeUp} className="flex flex-col gap-4">
            <div
              ref={(el) => { circleRefs.current[i] = el; }}
              className="w-16 h-16 rounded-full bg-navy border-2 border-charcoal flex items-center justify-center"
            >
              <span className="text-brand-blue font-bold text-lg">
                {step.n ?? String(i + 1).padStart(2, "0")}
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              <h3 className="text-off-white font-semibold text-base">{step.title}</h3>
              <p className="text-steel-blue text-sm leading-relaxed">{getDesc(step)}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ── Mobile vertical timeline ──────────────────────────────────────────────────
function MobileTimeline({ steps }: { steps: Step[] }) {
  const { containerRef, circleRefs, points } = useCircleCenters(steps.length);

  const pathD =
    points.length === steps.length
      ? `M ${points.map((p) => `${p.x} ${p.y}`).join(" L ")}`
      : "";

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.85", "end 0.6"],
  });
  const rawProgress = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const drawProgress = useSpring(rawProgress, { stiffness: 60, damping: 20 });

  return (
    <div ref={containerRef} className="lg:hidden relative flex flex-col gap-0">
      {pathD && (
        <svg
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            overflow: "visible",
            zIndex: 0,
            pointerEvents: "none",
          }}
        >
          {/* Track */}
          <path
            d={pathD}
            stroke="oklch(30% 0.03 240)"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Animated fill */}
          <motion.path
            d={pathD}
            stroke="oklch(58% 0.14 240 / 0.5)"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            style={{ pathLength: drawProgress }}
          />
        </svg>
      )}

      {steps.map((step, i) => (
        <motion.div key={i} variants={fadeUp} className="flex gap-6 relative">
          <div
            ref={(el) => { circleRefs.current[i] = el; }}
            className="w-16 h-16 rounded-full bg-navy border-2 border-charcoal flex items-center justify-center shrink-0 z-10"
          >
            <span className="text-brand-blue font-bold text-base">
              {step.n ?? String(i + 1).padStart(2, "0")}
            </span>
          </div>

          <div className="flex flex-col gap-1.5 pb-10">
            <h3 className="text-off-white font-semibold text-base mt-4">{step.title}</h3>
            <p className="text-steel-blue text-sm leading-relaxed">{getDesc(step)}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ── Main section ─────────────────────────────────────────────────────────────
export default function Process() {
  const { t } = useTranslation();
  const steps = t("process.steps", { returnObjects: true }) as Step[];

  return (
    <section id="proceso" className="section-gap bg-charcoal/30">
      <div className="max-w-content mx-auto section-padding">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
          className="flex flex-col gap-12"
        >
          {/* Header */}
          <div className="flex flex-col gap-4 max-w-2xl">
            <motion.span variants={fadeUp} className="eyebrow">
              {t("process.eyebrow")}
            </motion.span>
            <motion.h2
              variants={fadeUp}
              className="text-off-white font-bold"
              style={{ fontSize: "clamp(28px, 4vw, 56px)", letterSpacing: "-0.01em" }}
            >
              {t("process.title")}
            </motion.h2>
            <motion.p variants={fadeUp} className="text-steel-blue text-lg">
              {t("process.intro")}
            </motion.p>
          </div>

          <DesktopTimeline steps={steps} />
          <MobileTimeline steps={steps} />
        </motion.div>
      </div>
    </section>
  );
}
