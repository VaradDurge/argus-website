import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ButtonCtaProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  className?: string;
}

function ButtonCta({ label = "Join Waitlist", className, ...props }: ButtonCtaProps) {
  return (
    <Button
      variant="ghost"
      className={cn(
        "group relative h-12 w-fit overflow-hidden rounded-lg px-6 transition-all duration-500 hover:bg-transparent",
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 rounded-lg bg-gradient-to-b from-white/20 via-sky-400/10 to-white/[0.06] p-[1px]">
        <div className="absolute inset-0 rounded-lg bg-[#07101d]/90" />
      </div>

      <div className="absolute inset-[1px] rounded-lg bg-[#07101d]/88" />
      <div className="absolute inset-[1px] rounded-lg bg-gradient-to-r from-[#07101d] via-[#0c1b30] to-[#07101d] opacity-90" />
      <div className="absolute inset-[1px] rounded-lg bg-gradient-to-b from-white/[0.08] via-sky-300/[0.05] to-blue-500/[0.08]" />
      <div className="absolute inset-[1px] rounded-lg bg-gradient-to-br from-white/[0.08] via-transparent to-sky-400/[0.08]" />
      <div className="absolute inset-[1px] rounded-lg shadow-[inset_0_0_18px_rgba(148,190,255,0.14)]" />

      <div className="relative flex items-center justify-center gap-2">
        <span className="bg-gradient-to-b from-white/90 to-sky-200/75 bg-clip-text text-[13px] font-medium tracking-[-0.02em] text-transparent drop-shadow-[0_0_12px_rgba(148,190,255,0.26)]">
          {label}
        </span>
      </div>

      <div className="absolute inset-[1px] rounded-lg bg-gradient-to-r from-sky-300/[0.04] via-white/[0.08] to-sky-300/[0.04] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </Button>
  );
}

export { ButtonCta };
