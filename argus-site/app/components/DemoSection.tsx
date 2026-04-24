"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const SOFT_EASE = [0.16, 1, 0.3, 1] as const;

type Step = 1 | 2 | 3 | 4 | 5;
type Phase = "prelude" | "steps";

const STEP_META: { id: Step; title: string; cmd: string; cta: string }[] = [
  { id: 1, title: "Broken Run", cmd: "argus show", cta: "Inspect failure" },
  { id: 2, title: "Root Cause", cmd: "argus inspect run_2f8a1c WebSearchTool", cta: "Replay from here" },
  { id: 3, title: "Fix File", cmd: "agents/web_search_tool.py", cta: "Apply fix" },
  { id: 4, title: "Replay", cmd: "argus replay run_2f8a1c WebSearchTool --app app:build_graph", cta: "Compare runs" },
  { id: 5, title: "Diff", cmd: "argus diff run_a3b7d1", cta: "Run fixed" },
];

// ─── Terminal boot lines ──────────────────────────────────────────────────────

const BOOT_LINES: { text: string; colorClass: string }[] = [
  { text: "Initializing pipeline...", colorClass: "text-white/38" },
  { text: "Loading graph: build_graph()", colorClass: "text-white/32" },
  { text: "Agents: RouterAgent · WebSearchTool · SummarizerAgent · ValidatorAgent · ResponseFormatter", colorClass: "text-white/28" },
  { text: "", colorClass: "" },
  { text: 'Running:  query="latest AI research papers"', colorClass: "text-white/36" },
  { text: "", colorClass: "" },
  { text: "  RouterAgent              112ms   ✓  pass", colorClass: "text-emerald-400/55" },
  { text: "  WebSearchTool            847ms   ⚠  output warn", colorClass: "text-yellow-400/60" },
  { text: '                                 └─  "enriched_context" missing from output', colorClass: "text-yellow-400/38" },
  { text: "  SummarizerAgent         2341ms   ⚠  silent failure", colorClass: "text-yellow-400/65" },
  { text: "  ValidatorAgent           203ms   ~  degraded", colorClass: "text-amber-400/52" },
  { text: "  ResponseFormatter         88ms   ~  degraded", colorClass: "text-amber-400/52" },
  { text: "", colorClass: "" },
  { text: "Pipeline completed with errors  ·  3421ms  ·  run_2f8a1c", colorClass: "text-white/30" },
  { text: "", colorClass: "" },
  { text: "Use argus to inspect and replay ↓", colorClass: "text-white/22" },
];

const BOOT_DELAYS = [0, 320, 600, 860, 880, 1050, 1200, 1590, 1780, 2380, 2820, 3110, 3310, 3410, 3620, 3760];

// ─── Terminal prelude ─────────────────────────────────────────────────────────

function TerminalPrelude({ onDone }: { onDone: () => void }) {
  const [running, setRunning] = useState(false);
  const [visibleCount, setVisibleCount] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    return () => { timers.current.forEach(clearTimeout); };
  }, []);

  const handleRun = () => {
    if (running) return;
    setRunning(true);
    BOOT_DELAYS.forEach((delay, i) => {
      const t = setTimeout(() => setVisibleCount(i + 1), delay);
      timers.current.push(t);
    });
    const doneTimer = setTimeout(onDone, BOOT_DELAYS[BOOT_DELAYS.length - 1] + 700);
    timers.current.push(doneTimer);
  };

  return (
    <div className="min-h-[320px] px-4 py-5 font-mono text-[10.5px] leading-[1.8]">
      <div className="flex items-center">
        <span className="text-white/22 select-none mr-1.5">$</span>
        <span className="text-white/58">python -m agentic_pipeline</span>
        {!running && (
          <motion.span
            className="inline-block w-[5.5px] h-[12px] bg-white/38 ml-0.5 align-middle"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1.0, repeat: Infinity, ease: "linear" }}
          />
        )}
      </div>

      {running && (
        <div className="mt-1">
          {BOOT_LINES.slice(0, visibleCount).map((line, i) =>
            line.text === "" ? (
              <div key={i} className="h-[10px]" />
            ) : (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.18 }}
                className={`whitespace-pre ${line.colorClass}`}
              >
                {line.text}
              </motion.div>
            )
          )}
          {visibleCount < BOOT_LINES.length && (
            <motion.span
              className="inline-block w-[5px] h-[11px] bg-white/30 ml-0.5 align-middle"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
            />
          )}
        </div>
      )}

      {!running && (
        <div className="mt-10 flex justify-end pr-1">
          <motion.button
            onClick={handleRun}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-4 py-2 rounded-md border border-white/10 bg-white/[0.04] text-white/50 text-[10.5px] hover:border-white/18 hover:text-white/72 hover:bg-white/[0.07] transition-all duration-200 cursor-pointer"
          >
            <motion.span
              className="text-emerald-400/70"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            >
              ▶
            </motion.span>
            Run Pipeline
          </motion.button>
        </div>
      )}
    </div>
  );
}

// ─── Terminal primitives ─────────────────────────────────────────────────────

function Line({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`font-mono text-[10.5px] leading-[1.75] whitespace-pre text-white/60 ${className}`}>{children}</div>;
}

function Dim({ children }: { children: React.ReactNode }) {
  return <span className="text-white/25">{children}</span>;
}

function Rule() {
  return <Line className="text-white/10">{"  " + "─".repeat(52)}</Line>;
}

function Blank() {
  return <div className="h-[10px]" />;
}

// ─── Status rendering ────────────────────────────────────────────────────────

function StatusIcon({ status }: { status: string }) {
  if (status === "pass") return <span className="text-emerald-400 font-bold">✓</span>;
  if (status === "fail") return <span className="text-yellow-400 font-bold">⚠</span>;
  if (status === "warn") return <span className="text-yellow-400 font-bold">~</span>;
  if (status === "crashed") return <span className="text-red-400 font-bold">✗</span>;
  return <span className="text-white/30">●</span>;
}

function StatusLabel({ status }: { status: string }) {
  if (status === "pass") return <span className="text-emerald-400 font-bold">pass</span>;
  if (status === "fail") return <span className="text-yellow-400 font-bold">silent failure</span>;
  if (status === "warn") return <><span className="text-emerald-400 font-bold">pass</span><span className="text-yellow-400/60"> (warnings)</span></>;
  if (status === "crashed") return <span className="text-red-400 font-bold">crashed</span>;
  return <span className="text-white/40">{status}</span>;
}

function OverallDot({ status }: { status: string }) {
  if (status === "clean") return <span className="text-emerald-400 font-bold">●</span>;
  if (status === "silent_failure") return <span className="text-yellow-400 font-bold">●</span>;
  if (status === "crashed") return <span className="text-red-400 font-bold">●</span>;
  return <span className="text-white/30">●</span>;
}

function OverallLabel({ status }: { status: string }) {
  if (status === "clean") return <span className="text-emerald-400 font-bold">clean</span>;
  if (status === "silent_failure") return <span className="text-yellow-400 font-bold">silent_failure</span>;
  if (status === "crashed") return <span className="text-red-400 font-bold">crashed</span>;
  return <span className="text-white/40">{status}</span>;
}

const NAME_COL = 20;

function NodeLine({
  num,
  name,
  durationMs,
  status,
  suffix,
}: {
  num: number;
  name: string;
  durationMs: number;
  status: string;
  suffix?: React.ReactNode;
}) {
  const pad = " ".repeat(Math.max(1, NAME_COL - name.length));
  const durStr = `${durationMs} ms`;
  return (
    <Line>
      {"  "}
      <Dim>{String(num).padStart(2, " ")}</Dim>
      {"  "}
      <span className="text-white font-bold">{name}</span>
      {pad}
      <span className="text-white/30 italic">{durStr}</span>
      {"   "}
      <StatusIcon status={status} />
      {"  "}
      <StatusLabel status={status} />
      {suffix}
    </Line>
  );
}

function DetailLine({ children, indent = "      " }: { children: React.ReactNode; indent?: string }) {
  return (
    <Line>
      {indent}<Dim>└─</Dim>{"  "}{children}
    </Line>
  );
}

function SubDetailLine({ children, indent = "      " }: { children: React.ReactNode; indent?: string }) {
  return (
    <Line>
      {indent}<Dim>   </Dim>{"  "}{children}
    </Line>
  );
}

// ─── Steps ───────────────────────────────────────────────────────────────────

function StepOne() {
  return (
    <div>
      <Line>
        {"  "}<span className="text-white font-bold italic">argus</span>
        <span className="text-white/30 italic">{"  run_2f8a1c  ·  2024-04-22  13:45  ·  3421 ms"}</span>
      </Line>
      <Line>
        {"  "}<Dim>status</Dim>{"    "}
        <OverallDot status="silent_failure" />{"  "}
        <OverallLabel status="silent_failure" />
      </Line>
      <Blank />
      <Rule />
      <Blank />
      <NodeLine num={1} name="RouterAgent" durationMs={112} status="pass" />
      <Blank />
      <NodeLine num={2} name="WebSearchTool" durationMs={847} status="warn" />
      <DetailLine>
        <Dim>Field <span className="font-bold">&quot;enriched_context&quot;</span> missing from output schema</Dim>
      </DetailLine>
      <Blank />
      <NodeLine num={3} name="SummarizerAgent" durationMs={2341} status="fail" />
      <Line>
        {"                                                  "}
        <span className="text-yellow-400 underline">context error</span>
      </Line>
      <Line>
        {"                                                  "}
        <span className="text-yellow-400 underline">tool failure</span>
      </Line>
      <DetailLine><Dim>missing fields</Dim></DetailLine>
      <SubDetailLine>
        <span className="italic">Field <span className="font-bold">&quot;enriched_context&quot;</span> is missing</span>
      </SubDetailLine>
      <SubDetailLine>
        <span className="text-white/30 italic">ValidatorAgent received bad state</span>
      </SubDetailLine>
      <DetailLine><Dim>tool failures</Dim></DetailLine>
      <SubDetailLine>
        <span className="text-red-400 font-bold">⚠</span>{" "}
        <Dim>Tool exit_code_nonzero: field <span className="font-bold">&quot;enriched_context&quot;</span> — exit_code=1</Dim>
      </SubDetailLine>
      <Blank />
      <NodeLine num={4} name="ValidatorAgent" durationMs={203} status="warn" />
      <DetailLine>
        <Dim>Field <span className="font-bold">&quot;enriched_context&quot;</span> is empty</Dim>
      </DetailLine>
      <DetailLine>
        <Dim>ResponseFormatter may receive degraded state</Dim>
      </DetailLine>
      <Blank />
      <NodeLine num={5} name="ResponseFormatter" durationMs={88} status="warn" />
      <DetailLine>
        <Dim>Output key <span className="font-bold">&quot;formatted&quot;</span> is empty (may degrade downstream)</Dim>
      </DetailLine>
      <Blank />
      <Rule />
      <Line>
        {"  "}<span className="text-white/30 italic">root cause</span>{"    "}
        <span className="text-yellow-400 font-bold">WebSearchTool</span>
        <span className="text-white/30 font-bold">  →  </span>
        <span className="text-red-400 font-bold">SummarizerAgent  →  ValidatorAgent  →  ResponseFormatter</span>
      </Line>
    </div>
  );
}

// Step 2: Inspect WebSearchTool — shows the broken output schema
function StepTwo() {
  return (
    <div>
      <Line>
        {"  "}<span className="text-white font-bold">WebSearchTool</span>
        <span className="text-white/30">{"  #2  ·  "}</span>
        <span className="text-yellow-400 font-bold">output warn</span>
      </Line>
      <Blank />
      <Rule />
      <Blank />
      <Line>{"  "}<Dim>input</Dim></Line>
      <Blank />
      <div className="pl-2">
        <Line className="text-white/50">{"  {"}</Line>
        <Line className="text-white/50">{"    "}<span className="text-sky-300">&quot;query&quot;</span>: <span className="text-amber-300">&quot;latest AI research papers&quot;</span>,</Line>
        <Line className="text-white/50">{"    "}<span className="text-sky-300">&quot;top_k&quot;</span>: <span className="text-violet-300">3</span></Line>
        <Line className="text-white/50">{"  }"}</Line>
      </div>
      <Blank />
      <Rule />
      <Blank />
      <Line>{"  "}<Dim>output</Dim></Line>
      <Blank />
      <div className="pl-2">
        <Line className="text-white/50">{"  {"}</Line>
        <Line className="text-white/50">{"    "}<span className="text-sky-300">&quot;search_results&quot;</span>: <span className="text-white/30">[...12 items]</span>,</Line>
        <Line className="text-white/50">{"    "}<span className="text-sky-300">&quot;enriched_context&quot;</span>: <span className="text-red-400">undefined</span>,</Line>
        <Line className="text-white/50">{"    "}<span className="text-sky-300">&quot;query&quot;</span>: <span className="text-amber-300">&quot;latest AI research papers&quot;</span></Line>
        <Line className="text-white/50">{"  }"}</Line>
      </div>
      <Blank />
      <Rule />
      <Blank />
      <Line>{"  "}<Dim>inspection</Dim></Line>
      <Blank />
      <Line>
        {"  "}<span className="text-yellow-400/80 font-bold">⚠</span>{" "}
        <span className="text-white/30 italic">OutputSchemaViolation: required field <span className="font-bold">&quot;enriched_context&quot;</span> missing</span>
      </Line>
      <Line>
        {"  "}<span className="text-white/30 italic">context_enricher_v2 returned exit_code=1 — enrichment skipped</span>
      </Line>
      <Blank />
      <Rule />
      <Line>
        {"  "}<span className="text-white/30 italic">root cause</span>{"    "}
        <span className="text-yellow-400 font-bold">WebSearchTool</span>
        <span className="text-white/30 font-bold">  →  </span>
        <span className="text-red-400/80 font-bold">SummarizerAgent  →  ValidatorAgent  →  ResponseFormatter</span>
      </Line>
    </div>
  );
}

// Step 3: Fix File — simulated code editor for web_search_tool.py
function StepThree({ fixed, onApplyFix }: { fixed: boolean; onApplyFix: () => void }) {
  const lineNums = [14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26];

  return (
    <div>
      {/* Warning badge */}
      <div className="flex items-center gap-2 mb-3 px-1">
        <span className="inline-flex items-center gap-1.5 rounded border border-yellow-400/20 bg-yellow-400/[0.06] px-2.5 py-1 font-mono text-[9.5px] text-yellow-400/80">
          <span className="font-bold">⚠</span>
          WebSearchTool · <span className="font-bold">&quot;enriched_context&quot;</span> missing from output
        </span>
        {fixed && (
          <motion.span
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.28 }}
            className="inline-flex items-center gap-1.5 rounded border border-emerald-400/20 bg-emerald-400/[0.06] px-2.5 py-1 font-mono text-[9.5px] text-emerald-400/80"
          >
            <span className="font-bold">✓</span> fixed
          </motion.span>
        )}
      </div>

      {/* Code editor body */}
      <div
        className="rounded-lg overflow-hidden"
        style={{
          background: "rgba(0,0,0,0.32)",
          border: "1px solid rgba(255,255,255,0.055)",
        }}
      >
        {/* Editor tab bar */}
        <div className="flex items-center gap-0 border-b border-white/[0.055] bg-white/[0.018]">
          <div className="flex items-center gap-1.5 px-3 py-1.5 border-r border-white/[0.055] bg-white/[0.04]">
            <span className="text-[8.5px] text-amber-400/60">●</span>
            <span className="font-mono text-[9.5px] text-white/55">web_search_tool.py</span>
          </div>
        </div>

        {/* Code lines */}
        <div className="px-0 py-2 font-mono text-[10px] leading-[1.8]">
          {/* Line 14 */}
          <CodeLine num={lineNums[0]} className="text-white/30">
            <span className="text-sky-300/60">def</span>{" "}
            <span className="text-amber-300/70">run</span>
            <span className="text-white/40">(self, query: </span>
            <span className="text-sky-300/60">str</span>
            <span className="text-white/40">, top_k: </span>
            <span className="text-sky-300/60">int</span>
            <span className="text-white/40"> = 3) -&gt; </span>
            <span className="text-sky-300/60">dict</span>
            <span className="text-white/40">:</span>
          </CodeLine>

          {/* Line 15 */}
          <CodeLine num={lineNums[1]} className="text-white/30">
            {"    "}<span className="text-white/45">results = self.search_api.fetch(query, top_k)</span>
          </CodeLine>

          {/* Line 16 - blank */}
          <CodeLine num={lineNums[2]} className="text-white/30">{""}</CodeLine>

          {/* Line 17 - comment */}
          <CodeLine num={lineNums[3]} className="text-white/25">
            {"    "}<span className="text-white/22 italic"># Enrich results with additional context</span>
          </CodeLine>

          {/* Line 18 - THE BUG LINE */}
          <BugLine num={lineNums[4]} fixed={fixed} onFix={onApplyFix} />

          {/* Line 19 - blank */}
          <CodeLine num={lineNums[5]} className="text-white/30">{""}</CodeLine>

          {/* Line 20 */}
          <CodeLine num={lineNums[6]} className="text-white/30">
            {"    "}<span className="text-sky-300/60">return</span>{" "}
            <span className="text-white/40">{"{"}</span>
          </CodeLine>

          {/* Line 21 */}
          <CodeLine num={lineNums[7]} className="text-white/30">
            {"        "}<span className="text-amber-300/60">&quot;search_results&quot;</span>
            <span className="text-white/40">: results,</span>
          </CodeLine>

          {/* Line 22 - enriched_context return value */}
          <EnrichedReturnLine num={lineNums[8]} fixed={fixed} />

          {/* Line 23 */}
          <CodeLine num={lineNums[9]} className="text-white/30">
            {"        "}<span className="text-amber-300/60">&quot;query&quot;</span>
            <span className="text-white/40">: query,</span>
          </CodeLine>

          {/* Line 24 */}
          <CodeLine num={lineNums[10]} className="text-white/30">
            {"    "}<span className="text-white/40">{"}"}</span>
          </CodeLine>
        </div>
      </div>

      {/* Fix instruction — only shown when not yet fixed */}
      {!fixed && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-3 flex items-start gap-2 rounded border border-yellow-400/15 bg-yellow-400/[0.04] px-3 py-2"
        >
          <span className="mt-0.5 text-yellow-400/60 font-bold text-[10px]">→</span>
          <span className="font-mono text-[9.5px] text-white/40">
            Line 18: uncomment <span className="text-yellow-400/70 font-bold">enriched_context = enrich_context(results)</span> to restore output schema
          </span>
        </motion.div>
      )}
    </div>
  );
}

function CodeLine({ num, children, className = "" }: { num: number; children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex ${className}`}>
      <span className="select-none w-8 text-right pr-3 text-white/15 flex-shrink-0">{num}</span>
      <span className="flex-1">{children}</span>
    </div>
  );
}

function BugLine({ num, fixed, onFix }: { num: number; fixed: boolean; onFix: () => void }) {
  return (
    <div
      className="flex items-center relative"
      style={{
        background: fixed ? "rgba(52,211,153,0.05)" : "rgba(251,191,36,0.07)",
        borderLeft: fixed ? "2px solid rgba(52,211,153,0.35)" : "2px solid rgba(251,191,36,0.35)",
      }}
    >
      <span className="select-none w-8 text-right pr-3 text-white/15 flex-shrink-0 font-mono text-[10px]">{num}</span>
      <span className="flex-1 font-mono text-[10px] leading-[1.8]">
        {"    "}
        <AnimatePresence mode="wait">
          {!fixed ? (
            <motion.span
              key="commented"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <span className="text-white/22 italic"># enriched_context = enrich_context(results)</span>
              <span className="ml-2 text-yellow-400/45 italic text-[9px]">← uncomment this</span>
            </motion.span>
          ) : (
            <motion.span
              key="uncommented"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.35 }}
            >
              <span className="text-white/65">enriched_context = enrich_context(results)</span>
              <span className="ml-2 text-emerald-400/60 italic text-[9px]">← fixed ✓</span>
            </motion.span>
          )}
        </AnimatePresence>
      </span>
      {!fixed && (
        <motion.button
          onClick={onFix}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          className="mr-2 flex-shrink-0 rounded border border-yellow-400/25 bg-yellow-400/[0.09] px-2 py-0.5 font-mono text-[8.5px] text-yellow-400/70 hover:border-yellow-400/40 hover:bg-yellow-400/[0.14] hover:text-yellow-400/90 transition-all duration-150 cursor-pointer"
        >
          uncomment
        </motion.button>
      )}
    </div>
  );
}

function EnrichedReturnLine({ num, fixed }: { num: number; fixed: boolean }) {
  return (
    <div
      className="flex"
      style={fixed ? { background: "rgba(52,211,153,0.04)" } : {}}
    >
      <span className="select-none w-8 text-right pr-3 text-white/15 flex-shrink-0 font-mono text-[10px] leading-[1.8]">{num}</span>
      <span className="flex-1 font-mono text-[10px] leading-[1.8] text-white/30">
        {"        "}<span className="text-amber-300/60">&quot;enriched_context&quot;</span>
        <span className="text-white/40">: </span>
        <AnimatePresence mode="wait">
          {!fixed ? (
            <motion.span key="null" exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
              <span className="text-red-400/70">None</span>
              <span className="text-white/40">,</span>
              <span className="ml-2 text-red-400/40 italic text-[9px]"># BUG: enrichment disabled</span>
            </motion.span>
          ) : (
            <motion.span key="val" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <span className="text-emerald-400/70">enriched_context</span>
              <span className="text-white/40">,</span>
              <span className="ml-2 text-emerald-400/40 italic text-[9px]"># ✓</span>
            </motion.span>
          )}
        </AnimatePresence>
      </span>
    </div>
  );
}

// Step 4: Replay — from WebSearchTool, all nodes pass
function StepFourContent({ animate }: { animate: boolean }) {
  const [showFixed, setShowFixed] = useState(false);
  useEffect(() => {
    if (!animate) return;
    const t = setTimeout(() => setShowFixed(true), 1200);
    return () => clearTimeout(t);
  }, [animate]);

  return (
    <div>
      <Line>
        {"  "}<span className="text-white font-bold italic">argus replay</span>
        <span className="text-white/30 italic">{"  run_2f8a1c"}</span>
        <Dim>{"  ↺  from  "}</Dim>
        <span className="text-white font-bold">WebSearchTool</span>
        <span className="text-white/25 italic">{"  --app app:build_graph"}</span>
      </Line>
      <Blank />
      <Rule />
      <Blank />
      <Line>
        {"  "}<Dim>Replaying with frozen LLM responses from <span className="font-bold">run_2f8a1c</span></Dim>
      </Line>
      <Line>
        {"  "}<Dim>Frozen: RouterAgent (node 1)  ·  Re-running: nodes 2–5</Dim>
      </Line>
      <Blank />
      <NodeLine num={1} name="RouterAgent" durationMs={112} status="pass"
        suffix={<span className="text-white/20 italic">{"    frozen · not re-run  ·  "}<span className="text-emerald-400/40">saves compute & cost</span></span>}
      />
      <Blank />
      <NodeLine
        num={2}
        name="WebSearchTool"
        durationMs={791}
        status="pass"
        suffix={
          showFixed ? (
            <motion.span
              initial={{ opacity: 0, x: 4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="text-emerald-400/80"
            >
              {"        ← Fixed!"}
            </motion.span>
          ) : (
            <span className="text-white/20">{"        ..."}</span>
          )
        }
      />
      <Blank />
      <NodeLine num={3} name="SummarizerAgent" durationMs={2156} status="pass" />
      <Blank />
      <NodeLine num={4} name="ValidatorAgent" durationMs={198} status="pass" />
      <Blank />
      <NodeLine num={5} name="ResponseFormatter" durationMs={81} status="pass" />
      <Blank />
      <Rule />
      <Blank />
      <AnimatePresence>
        {showFixed && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.1 }}
          >
            <Line>
              {"  "}<OverallDot status="clean" />{"  "}
              <OverallLabel status="clean" />
              <span className="text-white/25">{"    run_a3b7d1"}</span>
            </Line>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Step 5: Diff
function StepFive() {
  return (
    <div>
      <Line>
        {"  "}<span className="text-white font-bold italic">argus diff</span>
      </Line>
      <Blank />
      <Line>
        {"  "}<Dim>before</Dim>{"  "}
        <Dim>run_2f8a</Dim>{"  "}
        <Dim>2024-04-22  13:45</Dim>{"  "}
        <span className="text-yellow-400 font-bold">silent_failure</span>
      </Line>
      <Line>
        {"  "}<Dim>after </Dim>{"  "}
        <Dim>run_a3b7</Dim>{"  "}
        <Dim>2024-04-22  13:52</Dim>{"  "}
        <span className="text-emerald-400 font-bold">clean</span>
        <span className="text-white/30 italic">{"  replay from: WebSearchTool"}</span>
      </Line>
      <Blank />
      <Rule />
      <Blank />
      <Line>
        {"  "}<span className="text-white font-bold">RouterAgent</span>
        {"         "}
        <span className="text-emerald-400 font-bold">pass</span>
        {"  "}<Dim>frozen · not re-run  ·  </Dim><span className="text-emerald-400/40 italic">saves compute & cost</span>
      </Line>
      <Blank />
      <Line>
        {"  "}<span className="text-white font-bold">WebSearchTool</span>
        {"        "}
        <span className="text-yellow-400 font-bold">pass</span>{" "}
        <span className="text-yellow-400/60">(warnings)</span>
        {"  "}<Dim>→</Dim>{"  "}
        <span className="text-emerald-400 font-bold">pass</span>
        {"  "}<span className="text-emerald-400 font-bold">FIXED</span>
      </Line>
      <DetailLine indent="       ">
        <span className="text-emerald-400 font-bold">✓</span>{" "}
        <Dim>missing field <span className="font-bold">&quot;enriched_context&quot;</span> now populated</Dim>
      </DetailLine>
      <DetailLine indent="       ">
        <span className="text-emerald-400 font-bold">✓</span>{" "}
        <Dim>exit_code_nonzero on context_enricher_v2 resolved</Dim>
      </DetailLine>
      <Blank />
      <Line>
        {"  "}<span className="text-white font-bold">SummarizerAgent</span>
        {"       "}
        <span className="text-yellow-400 font-bold">silent failure</span>
        {"  "}<Dim>→</Dim>{"  "}
        <span className="text-emerald-400 font-bold">pass</span>
        {"  "}<span className="text-emerald-400 font-bold">FIXED</span>
      </Line>
      <DetailLine indent="       ">
        <span className="text-emerald-400 font-bold">✓</span>{" "}
        <Dim>2341 ms → 2156 ms  (-8%)</Dim>
      </DetailLine>
      <DetailLine indent="       ">
        <span className="text-emerald-400 font-bold">✓</span>{" "}
        <Dim>StateContractViolation on <span className="font-bold">&quot;enriched_context&quot;</span> resolved</Dim>
      </DetailLine>
      <Blank />
      <Line>
        {"  "}<span className="text-white font-bold">ValidatorAgent</span>
        {"        "}
        <span className="text-yellow-400 font-bold">pass</span>{" "}
        <span className="text-yellow-400/60">(warnings)</span>
        {"  "}<Dim>→</Dim>{"  "}
        <span className="text-emerald-400 font-bold">pass</span>
        {"  "}<span className="text-emerald-400 font-bold">FIXED</span>
      </Line>
      <DetailLine indent="       ">
        <span className="text-emerald-400 font-bold">✓</span>{" "}
        <Dim>empty field <span className="font-bold">&quot;enriched_context&quot;</span> now populated</Dim>
      </DetailLine>
      <Blank />
      <Line>
        {"  "}<span className="text-white font-bold">ResponseFormatter</span>
        {"     "}
        <span className="text-yellow-400 font-bold">pass</span>{" "}
        <span className="text-yellow-400/60">(warnings)</span>
        {"  "}<Dim>→</Dim>{"  "}
        <span className="text-emerald-400 font-bold">pass</span>
        {"  "}<span className="text-emerald-400 font-bold">FIXED</span>
      </Line>
      <DetailLine indent="       ">
        <span className="text-emerald-400 font-bold">✓</span>{" "}
        <Dim>&quot;formatted&quot; · data changed</Dim>
      </DetailLine>
      <Blank />
      <Rule />
      <Blank />
      <Line>
        {"  "}<span className="text-white font-bold">4</span>
        <span className="text-white/50">{" nodes changed"}</span>
        {"  ·  "}
        <span className="text-emerald-400 font-bold">4</span>
        <span className="text-white/50">{" fixed"}</span>
        {"  ·  "}
        <Dim>1 frozen</Dim>
      </Line>
    </div>
  );
}

function StepView({ step, step3Fixed, onApplyFix }: { step: Step; step3Fixed: boolean; onApplyFix: () => void }) {
  if (step === 1) return <StepOne />;
  if (step === 2) return <StepTwo />;
  if (step === 3) return <StepThree fixed={step3Fixed} onApplyFix={onApplyFix} />;
  if (step === 4) return <StepFourContent animate />;
  return <StepFive />;
}

// ─── Main ────────────────────────────────────────────────────────────────────

export default function DemoSection() {
  const [phase, setPhase] = useState<Phase>("prelude");
  const [step, setStep] = useState<Step>(1);
  const [step3Fixed, setStep3Fixed] = useState(false);
  const current = STEP_META.find((s) => s.id === step) ?? STEP_META[0];

  const handleNext = () => {
    if (step === 3 && !step3Fixed) {
      setStep3Fixed(true);
      return;
    }
    setStep((prev) => (prev === 5 ? 5 : ((prev + 1) as Step)));
  };

  const handleBack = () => {
    if (step === 3 && step3Fixed) {
      setStep3Fixed(false);
    }
    setStep((prev) => (prev === 1 ? 1 : ((prev - 1) as Step)));
  };

  const ctaLabel = step === 3 && step3Fixed ? "Run Replay →" : current.cta;
  const nextDisabled = step === 5;

  return (
    <section id="simulate" className="relative overflow-hidden border-t border-white/[0.04] bg-[#080808] py-30">
      {/* Background layers — monochromatic, matches hero palette */}
      <div className="pointer-events-none absolute inset-0">
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.011]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.8) 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* White radial from top-center — mirrors hero top-light */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 90% 52% at 50% 0%, rgba(255,255,255,0.055) 0%, transparent 70%)",
          }}
        />

        {/* Soft center glow — lifts the terminal off the page */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 48% at 50% 52%, rgba(255,255,255,0.028) 0%, transparent 68%)",
          }}
        />

        {/* Vignette — deepens edges like hero */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 110% 110% at 50% 50%, transparent 40%, rgba(0,0,0,0.62) 100%)",
          }}
        />

        {/* Faint warm-white blur orb behind the terminal card */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: 700,
            height: 340,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.022)",
            filter: "blur(100px)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-5xl px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.42, ease: SOFT_EASE }}
          className="mx-auto max-w-2xl text-center"
        >
          <motion.h2
            animate={{
              opacity: [0.78, 0.96, 0.78],
              textShadow: [
                "0 0 0px rgba(255,255,255,0.0)",
                "0 0 18px rgba(255,255,255,0.22), 0 0 36px rgba(138,180,255,0.14)",
                "0 0 0px rgba(255,255,255,0.0)",
              ],
            }}
            transition={{
              duration: 4.8,
              ease: [0.16, 1, 0.3, 1],
              repeat: Infinity,
            }}
            className="font-heading text-3xl font-semibold leading-[1.08] tracking-[-0.03em] text-white/85 lg:text-4xl"
          >
            See what actually went wrong
          </motion.h2>
          <p className="mt-5 font-body text-[15px] leading-relaxed text-white/40">
            A single failed run — from detection to root cause to fix to verified replay.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.48, delay: 0.08, ease: SOFT_EASE }}
          className="mx-auto mt-12 w-full max-w-4xl overflow-hidden rounded-xl"
          style={{
            background: "linear-gradient(150deg, rgba(255,255,255,0.032) 0%, rgba(255,255,255,0.006) 100%)",
            boxShadow:
              "0 0 0 1px rgba(255,255,255,0.07), 0 32px 72px rgba(0,0,0,0.62), 0 0 80px rgba(255,255,255,0.03)",
          }}
        >
          {/* Window chrome */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.05] bg-white/[0.011]">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/55" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/55" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/55" />
            </div>
            <span className="text-white/18 text-[9.5px] font-mono">
              {phase === "prelude" ? "terminal" : current.cmd}
            </span>
            <div className="w-[52px]" />
          </div>

          {/* Phase content */}
          <AnimatePresence mode="wait">
            {phase === "prelude" ? (
              <motion.div
                key="prelude"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.28, ease: SOFT_EASE }}
                className="bg-black/22"
              >
                <TerminalPrelude onDone={() => setPhase("steps")} />
              </motion.div>
            ) : (
              <motion.div
                key="steps"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.36, ease: SOFT_EASE }}
              >
                {/* Step pills */}
                <div className="flex flex-wrap items-center gap-3 px-4 py-3 border-b border-white/[0.04] bg-black/12">
                  {STEP_META.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        if (s.id !== 3) setStep3Fixed(false);
                        setStep(s.id);
                      }}
                      className={`rounded-full border px-3.5 py-1.5 text-[10px] font-mono tracking-wide transition-all duration-300 ${
                        step === s.id
                          ? "border-white/24 bg-white/[0.1] text-white/85"
                          : "border-white/[0.06] bg-white/[0.018] text-white/40 hover:text-white/62 hover:border-white/[0.12]"
                      }`}
                    >
                      {s.id}. {s.title}
                    </button>
                  ))}
                </div>

                {/* Terminal / editor body */}
                <div className="min-h-[360px] overflow-x-auto px-3 py-5 bg-black/22">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={step === 3 ? `3-${step3Fixed}` : step}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.36, ease: SOFT_EASE }}
                    >
                      <StepView step={step} step3Fixed={step3Fixed} onApplyFix={() => setStep3Fixed(true)} />
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Footer nav */}
                <div className="flex items-center justify-between gap-3 border-t border-white/[0.05] px-4 py-3 bg-white/[0.011]">
                  <div className="text-[10px] font-mono text-white/24">
                    step {step}/5
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleBack}
                      disabled={step === 1}
                      className="rounded-md border border-white/[0.06] px-3.5 py-1.5 text-[10px] font-mono text-white/45 transition-all duration-300 hover:border-white/[0.12] hover:text-white/62 disabled:cursor-not-allowed disabled:border-white/[0.05] disabled:text-white/22"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleNext}
                      disabled={nextDisabled}
                      className="rounded-md border border-white/18 bg-white/90 px-3.5 py-1.5 text-[10px] font-mono font-semibold text-black/90 transition-all duration-300 hover:bg-white/84 disabled:cursor-not-allowed disabled:border-white/[0.08] disabled:bg-white/30 disabled:text-black/45"
                    >
                      {ctaLabel}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
