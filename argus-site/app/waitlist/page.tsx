"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { StarshipShader } from "@/components/ui/starship-shader";
import { ButtonCta } from "@/components/ui/button-shiny";

type SubmitState = "idle" | "submitting" | "success" | "error";

export default function WaitlistPage() {
  const router = useRouter();
  const [state, setState] = useState<SubmitState>("idle");
  const [error, setError] = useState("");
  const redirectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (redirectTimer.current) {
        clearTimeout(redirectTimer.current);
      }
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setError("");

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "");
    const email = String(formData.get("email") ?? "");

    const website = String(formData.get("website") ?? "");
    let response: Response;

    try {
      response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, website }),
      });
    } catch {
      setError("Network error. Please check your connection and try again.");
      setState("error");
      return;
    }

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as {
        error?: string;
        detail?: string;
      } | null;
      const base = data?.error ?? "Something went wrong. Please try again.";
      setError(data?.detail ? `${base} (${data.detail})` : base);
      setState("error");
      return;
    }

    setState("success");
    redirectTimer.current = setTimeout(() => router.push("/"), 1200);
  }

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

      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-xl items-center px-6 py-28 lg:px-12">
        <div className="w-full rounded-2xl border border-white/[0.06] bg-white/[0.025] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.38)] md:p-8">
          <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.32em] text-white/25">
            Early access
          </p>
          <h1 className="font-heading text-4xl font-semibold tracking-[-0.04em] text-white/85">
            Join the waitlist
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-white/40">
            Get notified when Argus beta opens. No spam, just product access and
            launch updates.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
            <input
              aria-hidden="true"
              autoComplete="off"
              className="hidden"
              name="website"
              tabIndex={-1}
              type="text"
            />

            <label className="flex flex-col gap-2">
              <span className="text-sm text-white/55">Name</span>
              <input
                name="name"
                type="text"
                required
                minLength={2}
                maxLength={80}
                autoComplete="name"
                className="h-12 rounded-lg border border-white/[0.08] bg-black/30 px-4 text-sm text-white/80 outline-none transition-colors placeholder:text-white/20 focus:border-white/[0.16]"
                placeholder="Your full name"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm text-white/55">Email</span>
              <input
                name="email"
                type="email"
                required
                maxLength={160}
                autoComplete="email"
                className="h-12 rounded-lg border border-white/[0.08] bg-black/30 px-4 text-sm text-white/80 outline-none transition-colors placeholder:text-white/20 focus:border-white/[0.16]"
                placeholder="you@example.com"
              />
            </label>

            {state === "success" ? (
              <div className="rounded-lg border border-emerald-400/15 bg-emerald-400/[0.06] px-4 py-3 text-sm text-emerald-200/80">
                You’re on the waitlist.
              </div>
            ) : null}

            {state === "error" ? (
              <div className="rounded-lg border border-red-400/15 bg-red-400/[0.06] px-4 py-3 text-sm text-red-200/80">
                {error}
              </div>
            ) : null}

            <ButtonCta
              label={state === "submitting" ? "Joining..." : "Submit"}
              className="mt-2 w-full"
              disabled={state === "submitting" || state === "success"}
            />
          </form>
        </div>
      </section>
    </main>
  );
}
