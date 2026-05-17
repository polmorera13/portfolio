import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { fadeUp, staggerContainer, viewportOnce } from "../lib/motion";

interface StatCard {
  value: number;
  suffix: string;
  labelKey: string;
}

const stats: StatCard[] = [
  { value: 300, suffix: "+", labelKey: "results.brands" },
  { value: 1000, suffix: "+", labelKey: "results.videos" },
  { value: 80, suffix: "M+", labelKey: "results.views" },
];

function useCountUp(target: number, duration = 1500, active: boolean) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) { setCount(target); return; }

    let start: number | null = null;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [active, target, duration]);

  return count;
}

function StatCard({ stat, active }: { stat: StatCard; active: boolean }) {
  const { t } = useTranslation();
  const count = useCountUp(stat.value, 1500, active);

  return (
    <motion.div
      variants={fadeUp}
      className="rounded-xl p-10 text-center"
      style={{ backgroundColor: "#1a2e42", border: "1px solid rgba(74,144,217,0.2)" }}
    >
      <div
        className="font-bold leading-none mb-3"
        style={{ fontSize: "clamp(56px, 6vw, 96px)", color: "#F4F6F9" }}
      >
        {count.toLocaleString()}
        <span style={{ color: "#4A90D9" }}>{stat.suffix}</span>
      </div>
      <div
        className="text-sm font-semibold uppercase tracking-eyebrow text-center"
        style={{ color: "#8AAFCC", letterSpacing: "0.25em" }}
      >
        {t(stat.labelKey)}
      </div>
    </motion.div>
  );
}

export default function Results() {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setActive(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="pb-24 lg:pb-40 pt-12 lg:pt-20 bg-white">
      <div ref={ref} className="max-w-content mx-auto section-padding">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
          className="flex flex-col gap-12"
        >
          <motion.h2
            variants={fadeUp}
            className="font-bold text-center"
            style={{
              fontSize: "clamp(32px, 4vw, 56px)",
              letterSpacing: "-0.01em",
              color: "#0D1B2A",
            }}
          >
            {t("results.title")}
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat) => (
              <StatCard key={stat.labelKey} stat={stat} active={active} />
            ))}
          </div>

          <motion.p
            variants={fadeUp}
            className="text-center text-lg"
            style={{ color: "#2C3E50" }}
          >
            {t("results.subtitle")}
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
