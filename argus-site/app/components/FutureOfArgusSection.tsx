"use client";

import { motion } from "framer-motion";

type Availability = "now" | "next";

type Capability = {
  title: string;
  tagline: string;
  bullets: string[];
  availability: Availability;
};

const CAPS: Capability[] = [
  {
    title: "Goal-based Evaluation",
    tagline: "Did the agent actually achieve the task?",
    bullets: ["Move beyond logs → evaluate outcomes", "Task-level pass/fail with explicit criteria"],
    availability: "next",
  },
  {
    title: "Root Cause Reasoning",
    tagline: "Not just what failed — why it failed.",
    bullets: ["Wrong tool choice", "Insufficient context", "Upstream deviation"],
    availability: "now",
  },
  {
    title: "Experimentation Layer",
    tagline: "Versioned runs, comparisons, and measurable improvement.",
    bullets: ["Versioned runs", "Compare outputs", "Score improvements"],
    availability: "next",
  },
  {
    title: "LLM-as-Judge (constrained)",
    tagline: "Structured evaluation. Controlled reasoning.",
    bullets: ["Schema-first rubrics", "No free-form hallucination", "Auditable scoring traces"],
    availability: "next",
  },
];

function AvailabilityPill({ a }: { a: Availability }) {
  const isNow = a === "now";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-mono uppercase tracking-widest ${
        isNow
          ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-300/90"
          : "border-white/14 bg-white/[0.03] text-white/55"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${isNow ? "bg-emerald-400/80" : "bg-white/35"}`} />
      {isNow ? "Available now" : "What’s coming next"}
    </span>
  );
}

function CapabilityCard({ c, index }: { c: Capability; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-90px" }}
      transition={{ duration: 0.42, delay: 0.04 + index * 0.03, ease: [0.16, 1, 0.3, 1] }}
      className="group rounded-2xl border border-white/[0.06] bg-white/[0.013] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.026)] transition-colors duration-300 hover:border-white/[0.1]"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-white/80 text-[14px] font-mono font-medium tracking-[-0.01em] truncate">
            {c.title}
          </div>
          <div className="mt-1.5 text-white/40 text-[13px] leading-relaxed">{c.tagline}</div>
        </div>
        <div className="flex-shrink-0">
          <AvailabilityPill a={c.availability} />
        </div>
      </div>

      <div className="mt-5 space-y-2.5">
        {c.bullets.map((b) => (
          <div key={b} className="flex items-start gap-2">
            <span className="mt-[6px] h-[3px] w-[3px] rounded-full bg-white/24 flex-shrink-0" />
            <span className="text-[12.5px] leading-relaxed text-white/44">{b}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default function FutureOfArgusSection() {
  return (
    <section className="relative overflow-hidden border-t border-white/[0.04] bg-[#080808] py-30">
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 opacity-[0.011]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.8) 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="absolute left-1/2 top-1/2 h-[320px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.02] blur-[140px]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          <h2 className="font-heading text-3xl font-semibold leading-[1.08] tracking-[-0.03em] text-white/85 lg:text-4xl">
            Debugging is step one. Understanding is what comes next.
          </h2>
          <p className="mt-5 font-body text-[15px] leading-relaxed text-white/40">
            Argus is evolving into a system that evaluates, reasons about, and improves agent behavior —
            with explicit criteria and traceable evidence.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-2.5">
            <span className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-emerald-300/90">
              Available now
            </span>
            <span className="rounded-full border border-white/14 bg-white/[0.03] px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-white/55">
              What’s coming next
            </span>
            <span className="text-[10px] font-mono text-white/25">
              Roadmap items are directional — not promises.
            </span>
          </div>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2">
          {CAPS.map((c, i) => (
            <CapabilityCard key={c.title} c={c} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

