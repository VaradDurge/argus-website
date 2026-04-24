import Link from "next/link";
import { StarshipShader } from "@/components/ui/starship-shader";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy & Terms | Argus",
  description: "Argus privacy policy and terms of service.",
};

const privacyItems = [
  "Argus only uses information needed to provide access, respond to requests, and improve the product experience.",
  "We do not sell personal information or use private customer data for unrelated advertising.",
  "If you share debugging traces, logs, or pipeline metadata with Argus, they are handled as product data and should not include secrets unless explicitly supported by your plan.",
  "You can request deletion or correction of your personal information by contacting Varad Durge through the email link in the footer.",
];

const termsItems = [
  "Argus is provided as an early-stage product for evaluating and debugging LLM agent behavior.",
  "You are responsible for ensuring that any logs, traces, prompts, or outputs you connect to Argus comply with your own privacy and security requirements.",
  "The product may change during beta as features, integrations, and pricing are refined.",
  "Do not use Argus to process data you are not authorized to inspect, debug, or transmit.",
];

export default function LegalPage() {
  return (
    <main
      className="relative min-h-screen overflow-hidden bg-[#080808]"
      style={{
        background:
          "radial-gradient(105% 74% at 50% 0%, rgba(255,255,255,0.145), transparent 74%), radial-gradient(128% 96% at 50% 52%, transparent 44%, rgba(0,0,0,0.7) 100%), linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.97))",
      }}
    >
      <div className="pointer-events-none absolute inset-0">
        <StarshipShader className="absolute inset-0 opacity-[0.35]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/45 to-black/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/50" />
      </div>

      <section className="relative z-10 mx-auto w-full max-w-4xl px-6 py-28 lg:px-12">
        <div className="mb-14">
          <Link
            href="/"
            className="mb-8 inline-flex text-sm text-white/35 transition-colors duration-300 hover:text-white/60"
          >
            ← Back home
          </Link>
          <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.32em] text-white/25">
            Legal
          </p>
          <h1 className="font-heading text-4xl font-semibold tracking-[-0.04em] text-white/85 lg:text-5xl">
            Privacy & Terms
          </h1>
          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-white/40">
            A plain-language overview for the Argus website and early access
            product. This page keeps both policies together for easier review.
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 md:p-8">
          <section id="privacy" className="scroll-mt-28">
            <h2 className="font-heading text-2xl font-semibold tracking-[-0.03em] text-white/85">
              Privacy Policy
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/40">
              Last updated: April 25, 2026
            </p>
            <div className="mt-7 flex flex-col gap-4">
              {privacyItems.map((item, index) => (
                <p key={index} className="text-[15px] leading-relaxed text-white/48">
                  {item}
                </p>
              ))}
            </div>
          </section>

          <div className="my-10 h-px bg-white/[0.05]" />

          <section id="terms" className="scroll-mt-28">
            <h2 className="font-heading text-2xl font-semibold tracking-[-0.03em] text-white/85">
              Terms of Service
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/40">
              Last updated: April 25, 2026
            </p>
            <div className="mt-7 flex flex-col gap-4">
              {termsItems.map((item, index) => (
                <p key={index} className="text-[15px] leading-relaxed text-white/48">
                  {item}
                </p>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
