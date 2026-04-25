"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import GradientText from "@/components/ui/GradientText";
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";

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
  const router = useRouter();

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
          <h2 className="font-heading text-3xl font-semibold tracking-[-0.03em] lg:text-4xl">
            <GradientText
              colors={["#5227FF", "#e38de0", "#B497CF", "#5227FF"]}
              animationSpeed={3}
              showBorder={false}
            >
              Frequently asked questions
            </GradientText>
          </h2>
          <p className="mt-4 max-w-sm text-[14px] leading-relaxed text-white/40">
            Quick answers about how Argus fits into agent debugging workflows.
          </p>
          <div className="mt-6">
            <LiquidMetalButton
              label="Join Waitlist"
              onClick={() => router.push("/waitlist")}
            />
          </div>
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
