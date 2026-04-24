"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const SOFT_EASE = [0.16, 1, 0.3, 1] as const;

const FAQS = [
  {
    question: "Isn’t LangSmith the same thing?",
    answer:
      "Not exactly. LangSmith focuses on tracing and evaluation. Argus focuses on root-cause debugging — explaining why failures happen across the entire agent graph.",
  },
  {
    question: "What main problem does Argus solve?",
    answer:
      "LLM systems don’t fail loudly. They degrade silently — missing context, wrong tool use, or incomplete state. Argus surfaces where and why that happens.",
  },
  {
    question: "Is it fully developed?",
    answer: "The MVP is ready. Beta testing will roll out in a few days.",
  },
  {
    question: "What frameworks are compatible?",
    answer:
      "Right now we’re focused on LangGraph. Future versions will include CrewAI and Google ADK.",
  },
  {
    question: "How is this different from logs or tracing tools?",
    answer:
      "Logs show what happened. Argus explains why it happened — across nodes, decisions, and state transitions.",
  },
  {
    question: "Do I need to change my existing pipeline?",
    answer:
      "No. Argus is designed to sit on top of your existing system with minimal changes.",
  },
] as const;

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="relative overflow-hidden border-t border-white/[0.04] bg-[#080808] py-24">
      <div className="mx-auto grid w-full max-w-5xl gap-10 px-6 lg:grid-cols-[0.9fr_1.4fr] lg:items-center lg:gap-16 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.42, ease: SOFT_EASE }}
          className="max-w-sm"
        >
          <motion.h2
            animate={{
              opacity: [0.78, 0.96, 0.78],
              textShadow: [
                "0 0 0px rgba(255,255,255,0.0)",
                "0 0 18px rgba(255,255,255,0.2), 0 0 36px rgba(138,180,255,0.12)",
                "0 0 0px rgba(255,255,255,0.0)",
              ],
            }}
            transition={{
              duration: 5.2,
              ease: SOFT_EASE,
              repeat: Infinity,
            }}
            className="font-heading text-3xl font-semibold tracking-[-0.03em] text-white/85 lg:text-4xl"
          >
            Frequently asked questions
          </motion.h2>
          <p className="mt-4 max-w-sm text-[14px] leading-relaxed text-white/40">
            Quick answers about how Argus fits into agent debugging workflows.
          </p>
        </motion.div>

        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6">
          <div className="space-y-2">
          {FAQS.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={item.question}
                className={`rounded-lg border border-transparent border-b-white/[0.04] transition-colors duration-300 ${
                  isOpen ? "border-white/[0.06] bg-white/[0.03]" : ""
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-6 rounded-lg px-4 py-6 text-left transition-colors duration-300 hover:bg-white/[0.02]"
                  aria-expanded={isOpen}
                >
                  <span className="text-[15px] font-medium text-white/70">
                    {item.question}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.28, ease: SOFT_EASE }}
                    className="flex h-6 w-6 flex-shrink-0 items-center justify-center text-white/35"
                  >
                    ↓
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: SOFT_EASE }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-2xl px-4 pb-6 text-[14px] leading-relaxed text-white/40">
                        {item.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
          </div>
        </div>
      </div>
    </section>
  );
}
