"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { StarshipShader } from "@/components/ui/starship-shader";
import { ButtonCta } from "@/components/ui/button-shiny";

const SOFT_EASE = [0.16, 1, 0.3, 1] as const;

// ─── Types ────────────────────────────────────────────────────────────────────

type KVEntry = { key: string; value: string; vtype: "string" | "number" | "boolean" | "null" };

type FailDetail = {
  errorType: string;
  errorField: string;
  expected: string;
  received: string;
  toolCall: string;
  toolExitCode: string;
  toolMessage: string;
  downstreamCount: number;
  downstreamNodes: string[];
};

type TraceNode = {
  id: string;
  label: string;
  status: "pass" | "fail" | "warn";
  latency: string;
  ts: string;
  output: KVEntry[];
  rootCause?: true;
  downstream?: true;
  downstreamFrom?: string;
  outputWarn?: string;
  detail?: FailDetail;
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const TRACE: TraceNode[] = [
  {
    id: "n1",
    label: "RouterAgent",
    status: "pass",
    latency: "112ms",
    ts: "09:42:01.003",
    output: [
      { key: "route", value: '"research"', vtype: "string" },
      { key: "confidence", value: "0.94", vtype: "number" },
    ],
  },
  {
    id: "n2",
    label: "WebSearchTool",
    status: "warn",
    latency: "847ms",
    ts: "09:42:01.850",
    rootCause: true,
    outputWarn: '"enriched_context" missing from output schema',
    output: [
      { key: "results", value: "12", vtype: "number" },
      { key: "topK", value: "3", vtype: "number" },
      { key: "enriched_context", value: "undefined", vtype: "null" },
    ],
  },
  {
    id: "n3",
    label: "SummarizerAgent",
    status: "fail",
    latency: "2341ms",
    ts: "09:42:04.191",
    output: [
      { key: "summary", value: "null", vtype: "null" },
      { key: "tokens", value: "0", vtype: "number" },
    ],
    detail: {
      errorType: "StateContractViolation",
      errorField: '"enriched_context"',
      expected: "object",
      received: "undefined",
      toolCall: "context_enricher_v2",
      toolExitCode: "1",
      toolMessage: 'ToolError: required field "enriched_context" missing from input payload',
      downstreamCount: 2,
      downstreamNodes: ["ValidatorAgent", "ResponseFormatter"],
    },
  },
  {
    id: "n4",
    label: "ValidatorAgent",
    status: "warn",
    latency: "203ms",
    ts: "09:42:04.394",
    downstream: true,
    downstreamFrom: "SummarizerAgent",
    output: [
      { key: "valid", value: "false", vtype: "boolean" },
      { key: "reason", value: '"missing_enriched_context"', vtype: "string" },
    ],
  },
  {
    id: "n5",
    label: "ResponseFormatter",
    status: "warn",
    latency: "88ms",
    ts: "09:42:04.482",
    downstream: true,
    downstreamFrom: "SummarizerAgent",
    output: [
      { key: "formatted", value: '""', vtype: "string" },
      { key: "fallback", value: "true", vtype: "boolean" },
    ],
  },
];

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CFG = {
  pass: {
    dot: "bg-emerald-400",
    badge: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    label: "PASS",
  },
  fail: {
    dot: "bg-red-400",
    badge: "text-red-400 bg-red-400/10 border-red-400/20",
    label: "FAIL",
  },
  warn: {
    dot: "bg-amber-400",
    badge: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    label: "WARN",
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function useElapsed(startMs: number): string {
  const [ms, setMs] = useState(startMs);
  useEffect(() => {
    const t = setInterval(() => setMs((n) => n + 17), 17);
    return () => clearInterval(t);
  }, []);
  const totalSeconds = ms / 1000;
  const seconds = Math.floor(totalSeconds) % 60;
  const fraction = (totalSeconds % 1).toFixed(3).slice(1);
  return `00:00:${String(seconds).padStart(2, "0")}${fraction}`;
}

// ─── NodeRow ──────────────────────────────────────────────────────────────────

function NodeRow({
  node,
  index,
  detailVisible,
}: {
  node: TraceNode;
  index: number;
  detailVisible: boolean;
}) {
  const cfg = STATUS_CFG[node.status];

  return (
    <motion.div
      initial={{ opacity: 0, x: 6 }}
      animate={
        node.rootCause
          ? {
              opacity: 1,
              x: 0,
              boxShadow: [
                "0 0 0 1px rgba(239,68,68,0.08)",
                "0 0 0 1px rgba(239,68,68,0.18), 0 0 20px rgba(239,68,68,0.07)",
                "0 0 0 1px rgba(239,68,68,0.08)",
              ],
            }
          : { opacity: node.downstream ? 0.70 : 1, x: 0 }
      }
      transition={{
        delay: 0.42 + index * 0.09,
        duration: 0.36,
        ease: SOFT_EASE,
        boxShadow: { duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 1 },
      }}
      className={`relative rounded-lg border px-3.5 py-2.5 transition-colors ${
        node.rootCause
          ? "border-red-500/28 bg-red-500/[0.042]"
          : node.downstream
          ? "border-amber-500/10 bg-amber-500/[0.012]"
          : "border-white/[0.04] bg-white/[0.008]"
      }`}
    >
      {node.rootCause && (
        <div className="absolute -top-px left-6 right-6 h-px bg-gradient-to-r from-transparent via-red-500/38 to-transparent" />
      )}

      <div className="flex items-center gap-2.5">
        {node.downstream && (
          <span className="text-amber-500/28 text-[10px] font-mono select-none flex-shrink-0">↳</span>
        )}
        <motion.div
          className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`}
          animate={node.status === "fail" ? { opacity: [1, 0.2, 1] } : {}}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <span className="text-white/74 text-[11.5px] font-mono font-medium flex-1 truncate">
          {node.label}
        </span>
        {node.rootCause && (
          <span className="flex-shrink-0 text-[7.5px] font-mono font-semibold px-1.5 py-[2px] rounded bg-red-500/10 border border-red-500/22 text-red-400/80 uppercase tracking-widest">
            root cause
          </span>
        )}
        <span className="text-white/20 text-[10px] font-mono flex-shrink-0">{node.latency}</span>
        <span className={`text-[7.5px] font-mono font-semibold px-1.5 py-[2px] rounded border flex-shrink-0 ${cfg.badge}`}>
          {cfg.label}
        </span>
      </div>

      {/* Minimal error detail for root cause */}
      {node.rootCause && node.detail && (
        <AnimatePresence>
          {detailVisible && (
            <motion.div
              key="detail"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, delay: 0.1, ease: SOFT_EASE }}
              className="overflow-hidden"
            >
              <div className="mt-2 pl-[18px] space-y-0.5">
                <div className="text-red-400/50 text-[9.5px] font-mono leading-relaxed">
                  StateContractViolation · &ldquo;enriched_context&rdquo; missing · tool exit_code=1
                </div>
                <div className="text-amber-400/38 text-[9px] font-mono">
                  2 downstream nodes degraded
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Output schema warning */}
      {node.outputWarn && (
        <AnimatePresence>
          {detailVisible && (
            <motion.div
              key="outputwarn"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, delay: 0.08, ease: SOFT_EASE }}
              className="overflow-hidden"
            >
              <div className="mt-1.5 pl-[18px] text-amber-400/48 text-[9px] font-mono">
                ⚠ {node.outputWarn}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Downstream label */}
      {node.downstream && node.downstreamFrom && (
        <div className="mt-1 pl-[18px] text-amber-500/30 text-[9px] font-mono">
          degraded by {node.downstreamFrom}
        </div>
      )}
    </motion.div>
  );
}

// ─── Footer Ticker ────────────────────────────────────────────────────────────

const COMMANDS = [
  "argus replay --from node-003 --freeze-upstream",
  "argus diff --run run_2f8a1c --compare run_2f8a1b",
  "argus trace --node node-003 --depth 2",
];

function FooterTicker() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((n) => (n + 1) % COMMANDS.length), 3400);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex items-center gap-2">
      <span className="text-emerald-400/45 text-[9.5px] font-mono select-none">▶</span>
      <AnimatePresence mode="wait">
        <motion.span
          key={idx}
          initial={{ opacity: 0, y: 3 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -3 }}
          transition={{ duration: 0.32, ease: SOFT_EASE }}
          className="text-white/16 text-[9.5px] font-mono"
        >
          {COMMANDS[idx]}
        </motion.span>
      </AnimatePresence>
      <motion.span
        className="inline-block w-[5px] h-[11px] bg-emerald-400/55 ml-0.5 align-middle"
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 1.05, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

// ─── Debug Panel ──────────────────────────────────────────────────────────────

function DebugPanel() {
  const [detailVisible, setDetailVisible] = useState(false);
  const elapsed = useElapsed(3479);

  useEffect(() => {
    const t = setTimeout(() => setDetailVisible(true), 1080);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.48, delay: 0.24, ease: SOFT_EASE }}
      className="relative w-full max-w-[500px] rounded-xl overflow-hidden pt-[50px]"
      style={{
        background:
          "linear-gradient(150deg, rgba(255,255,255,0.028) 0%, rgba(255,255,255,0.006) 100%)",
        boxShadow:
          "0 0 0 1px rgba(255,255,255,0.055), 0 26px 56px rgba(0,0,0,0.50), 0 0 44px rgba(239,68,68,0.036)",
      }}
    >
      {/* Floating glass header */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20">
        <div className="relative flex items-center justify-between px-4 py-2.5 border-b border-white/[0.05] bg-black/40 backdrop-blur-xl">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/55" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/55" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/55" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-white/20 text-[9.5px] font-mono">argus</span>
            <span className="text-white/10 text-[9.5px] font-mono">/</span>
            <span className="text-white/20 text-[9.5px] font-mono">run_2f8a1c</span>
          </div>
          <div className="flex items-center gap-1.5">
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-emerald-400"
              animate={{ opacity: [1, 0.35, 1] }}
              transition={{ duration: 2.2, repeat: Infinity }}
            />
            <span className="text-emerald-400/55 text-[9.5px] font-mono">{elapsed}</span>
          </div>
        </div>
        <div className="h-6 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.55),rgba(0,0,0,0.15),transparent)]" />
      </div>

      {/* Stats bar */}
      <div className="flex items-center gap-2.5 px-4 py-2 border-b border-white/[0.03] bg-black/10">
        <span className="text-white/25 text-[9px] font-mono">5 nodes</span>
        <span className="text-white/10 text-[9px] font-mono">·</span>
        <span className="text-red-400/55 text-[9px] font-mono">1 failed</span>
        <span className="text-white/10 text-[9px] font-mono">·</span>
        <span className="text-amber-400/55 text-[9px] font-mono">1 warned</span>
        <span className="text-white/10 text-[9px] font-mono">·</span>
        <span className="text-amber-400/38 text-[9px] font-mono">2 degraded</span>
        <div className="ml-auto flex items-center gap-3">
          <button className="text-white/18 text-[9px] font-mono hover:text-white/40 transition-colors duration-300 cursor-pointer">
            replay ↺
          </button>
          <button className="text-white/18 text-[9px] font-mono hover:text-white/40 transition-colors duration-300 cursor-pointer">
            diff ⊕
          </button>
        </div>
      </div>

      {/* Node list */}
      <div className="p-3.5 space-y-2">
        {TRACE.map((node, i) => (
          <NodeRow key={node.id} node={node} index={i} detailVisible={detailVisible} />
        ))}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-white/[0.03] bg-black/[0.05]">
        <FooterTicker />
      </div>
    </motion.div>
  );
}

// ─── HeroSection ──────────────────────────────────────────────────────────────

export default function HeroSection() {
  const router = useRouter();

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden bg-[#080808]"
      style={{
        background:
          "radial-gradient(105% 74% at 50% 0%, rgba(255,255,255,0.145), transparent 74%), radial-gradient(128% 96% at 50% 52%, transparent 44%, rgba(0,0,0,0.7) 100%), linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.97))",
      }}
    >
      {/* Shader background */}
      <div className="absolute inset-0 pointer-events-none">
        <StarshipShader className="absolute inset-0 opacity-[0.55]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/50" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 py-28 lg:py-0">
        <div className="flex flex-col lg:flex-row items-center gap-[68px] lg:gap-24">

          {/* Copy */}
          <div className="flex-1 max-w-[33rem]">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.36, ease: SOFT_EASE }}
              className="inline-flex items-center gap-2.5 mb-8"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
              <span className="text-white/32 text-[9.5px] font-mono tracking-widest uppercase">
                LLM Observability
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.46, delay: 0.08, ease: SOFT_EASE }}
              className="font-heading text-4xl lg:text-[52px] font-semibold leading-[1.04] tracking-[-0.03em] text-white/85 mb-7"
            >
              Your agents are failing silently.{" "}
              <span className="text-white/25">You just don&apos;t know it yet.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.46, delay: 0.14, ease: SOFT_EASE }}
              className="font-body text-white/40 text-[17px] leading-relaxed mb-11"
            >
              Argus detects silent failures, traces root cause across nodes, and lets you
              replay any run from any point — with full frozen state.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2, ease: SOFT_EASE }}
              className="flex items-center gap-4 flex-wrap"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.3, ease: SOFT_EASE }}
                className="inline-flex"
                style={{ opacity: 0.7 }}
              >
                <ButtonCta
                  label="Join Waitlist"
                  className="h-12 px-6"
                  onClick={() => router.push("/waitlist")}
                />
              </motion.div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.3, ease: SOFT_EASE }}
                onClick={() =>
                  document.querySelector("#simulate")?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  })
                }
                className="px-6 py-3 rounded-lg text-white/55 text-[13px] font-medium border border-white/[0.06] cursor-pointer transition-all duration-300 hover:border-white/[0.12] hover:text-white/74 bg-white/[0.018]"
              >
                See demo →
              </motion.button>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.44, duration: 0.4, ease: SOFT_EASE }}
              className="mt-9 text-white/25 text-[10px] font-mono"
            >
              Works with LangGraph · LangChain · CrewAI · AutoGen · any REST endpoint
            </motion.p>
          </div>

          {/* Panel */}
          <div className="flex-1 flex justify-center lg:justify-end w-full lg:pr-1">
            <motion.div
              initial={{ opacity: 0, scale: 0.985 }}
              animate={{ opacity: 1, scale: 1.008 }}
              transition={{ duration: 0.46, delay: 0.22, ease: SOFT_EASE }}
              className="origin-center lg:origin-right lg:scale-[1.03]"
            >
              <DebugPanel />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
