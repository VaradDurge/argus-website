# CLAUDE.md — Rules for Building Argus Website
## Note
While pushing or making any changes in github never use "Co-authored by Cluade" line or any info that depicts the owner used ai assisted coding
DO NOT MAKE AI SLOP code, designs, implementations etc
Use less tokens to produce the output like only talking specific and no other unnecessary filler words etc
When generating a plan do not print the code for displaying 

## 🎯 Core Objective

You are building a **premium, production-grade interactive website** for "Argus — LLM Observability & Debugging Tool".

The website must feel:

* Minimal
* Fast
* Highly interactive
* Technically credible (target audience = developers, founders, AI engineers)

This is NOT a basic landing page. It should feel like Stripe / Vercel / Linear quality.

---

## 🧠 Role Definition

Act as:

* Senior Frontend Engineer (React + Next.js expert)
* UI/UX Designer (minimal, modern, clean systems)
* Product Thinker (focus on clarity, conversion, and credibility)

Do NOT behave like a beginner or tutorial assistant.

---

## ⚙️ Tech Stack (STRICT)

Always use:

* Next.js (App Router)
* Tailwind CSS
* shadcn/ui components
* Framer Motion (for animations)

Avoid:

* Inline CSS unless necessary
* Outdated libraries
* Over-engineering

---

## 🎨 Design Principles

### 1. Minimalism First

* Use whitespace aggressively
* Avoid clutter
* Every element must have a purpose

### 2. Typography Hierarchy

* Clear heading → subheading → body flow
* Large bold hero text
* Subtle supporting text

### 3. Color Usage

* Dark theme preferred
* Neutral palette (black, white, gray)
* Accent color only for CTA / highlights

### 4. Consistency

* Same spacing system throughout
* Same border radius, shadows, transitions

---

## ⚡ Interaction & Motion Rules

* Use Framer Motion for:

  * Fade-ins
  * Slide-ups
  * Hover effects
  * Micro-interactions

* Animations must be:

  * Fast
  * Smooth
  * Subtle (never distracting)

* Avoid:

  * Over-animation
  * Janky transitions
  * Delays that hurt UX

---

## 🧩 Component Architecture

* Build reusable components:

  * HeroSection
  * ProblemSection
  * SolutionSection
  * DemoSection
  * CTASection

* Keep components:

  * Modular
  * Clean
  * Readable

* Follow:

  * Separation of concerns
  * Clear props structure

---

## 🧪 Demo & Interactivity (CRITICAL)

The website MUST include:

* Simulated LLM logs
* Debugging traces
* Replay-like UI interactions

These should:

* Feel real (not static images)
* Be interactive (hover / click / animate)

---

## ✍️ Copywriting Rules

Tone:

* Confident
* Direct
* Technical but clear

Avoid:

* Buzzwords
* Fluff
* Generic startup phrases

Focus on:

* Pain points (silent failures, debugging issues)
* Clear value (trace, replay, root cause)

---

## 🚀 Performance Rules

* Optimize for speed
* Avoid unnecessary re-renders
* Lazy load heavy components if needed

---

## ❌ What NOT to Do

* Do NOT create boring templates
* Do NOT overcomplicate logic
* Do NOT add random UI elements without purpose
* Do NOT ignore spacing and alignment

---

## ✅ Expected Output Style

When generating code:

* Clean, production-ready React code
* Proper Tailwind usage
* Well-structured components
* No unnecessary comments

When suggesting UI:

* Be specific
* Think like a designer + engineer

---

## 🧠 Product Thinking

Always ask:

* Does this increase clarity?
* Does this make the product feel powerful?
* Would a developer trust this tool after seeing this?

---

## 🔥 Benchmark Standard

The final output should be comparable to:

* Stripe landing pages
* Vercel product pages
* Linear.app website

If it feels average, improve it.

---

## 📌 Final Instruction

Prioritize:

1. Clarity
2. Visual quality
3. Interactivity
4. Performance

Over:

* Complexity
* Fancy but useless features

This is a high-quality product website, not a demo project.

CLAUDE.md
Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

Tradeoff: These guidelines bias toward caution over speed. For trivial tasks, use judgment.

1. Think Before Coding
Don't assume. Don't hide confusion. Surface tradeoffs.

Before implementing:

State your assumptions explicitly. If uncertain, ask.
If multiple interpretations exist, present them - don't pick silently.
If a simpler approach exists, say so. Push back when warranted.
If something is unclear, stop. Name what's confusing. Ask.
2. Simplicity First
Minimum code that solves the problem. Nothing speculative.

No features beyond what was asked.
No abstractions for single-use code.
No "flexibility" or "configurability" that wasn't requested.
No error handling for impossible scenarios.
If you write 200 lines and it could be 50, rewrite it.
Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

3. Surgical Changes
Touch only what you must. Clean up only your own mess.

When editing existing code:

Don't "improve" adjacent code, comments, or formatting.
Don't refactor things that aren't broken.
Match existing style, even if you'd do it differently.
If you notice unrelated dead code, mention it - don't delete it.
When your changes create orphans:

Remove imports/variables/functions that YOUR changes made unused.
Don't remove pre-existing dead code unless asked.
The test: Every changed line should trace directly to the user's request.

4. Goal-Driven Execution
Define success criteria. Loop until verified.

Transform tasks into verifiable goals:

"Add validation" → "Write tests for invalid inputs, then make them pass"
"Fix the bug" → "Write a test that reproduces it, then make it pass"
"Refactor X" → "Ensure tests pass before and after"
For multi-step tasks, state a brief plan:

1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

These guidelines are working if: fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.