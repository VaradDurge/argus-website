"use client";

import GradualBlur from "@/components/ui/GradualBlur";

export default function BottomBlur() {
  return (
    <GradualBlur
      target="page"
      position="bottom"
      height="7rem"
      strength={2.5}
      divCount={6}
      curve="bezier"
      exponential
      opacity={1}
    />
  );
}
