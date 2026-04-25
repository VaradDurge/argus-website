"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import "./GradualBlur.css";

type Position = "top" | "bottom" | "left" | "right";
type Curve = "linear" | "bezier" | "ease-in" | "ease-out" | "ease-in-out";
type Target = "parent" | "page";

interface GradualBlurProps {
  position?: Position;
  strength?: number;
  height?: string;
  width?: string;
  divCount?: number;
  exponential?: boolean;
  curve?: Curve;
  opacity?: number;
  animated?: boolean | "scroll";
  duration?: string;
  easing?: string;
  hoverIntensity?: number;
  target?: Target;
  zIndex?: number;
  onAnimationComplete?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

const CURVE_FUNCTIONS: Record<string, (p: number) => number> = {
  linear: (p) => p,
  bezier: (p) => p * p * (3 - 2 * p),
  "ease-in": (p) => p * p,
  "ease-out": (p) => 1 - Math.pow(1 - p, 2),
  "ease-in-out": (p) =>
    p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2,
};

const getGradientDirection = (position: Position) =>
  ({ top: "to top", bottom: "to bottom", left: "to left", right: "to right" })[
    position
  ] || "to bottom";

function GradualBlur({
  position = "bottom",
  strength = 2,
  height = "6rem",
  width,
  divCount = 5,
  exponential = false,
  curve = "linear",
  opacity: layerOpacity = 1,
  animated = false,
  duration = "0.3s",
  easing = "ease-out",
  hoverIntensity,
  target = "parent",
  zIndex = 1000,
  onAnimationComplete,
  className = "",
  style: styleProp = {},
}: GradualBlurProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(animated !== "scroll");

  useEffect(() => {
    if (animated !== "scroll" || !containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [animated]);

  useEffect(() => {
    if (isVisible && animated === "scroll" && onAnimationComplete) {
      const ms = parseFloat(duration) * 1000;
      const t = setTimeout(onAnimationComplete, ms);
      return () => clearTimeout(t);
    }
  }, [isVisible, animated, onAnimationComplete, duration]);

  const blurDivs = useMemo(() => {
    const divs: React.ReactElement[] = [];
    const increment = 100 / divCount;
    const currentStrength =
      isHovered && hoverIntensity ? strength * hoverIntensity : strength;
    const curveFunc = CURVE_FUNCTIONS[curve] || CURVE_FUNCTIONS.linear;

    for (let i = 1; i <= divCount; i++) {
      let progress = i / divCount;
      progress = curveFunc(progress);

      const blurValue = exponential
        ? Math.pow(2, progress * 4) * 0.0625 * currentStrength
        : 0.0625 * (progress * divCount + 1) * currentStrength;

      const p1 = Math.round((increment * i - increment) * 10) / 10;
      const p2 = Math.round(increment * i * 10) / 10;
      const p3 = Math.round((increment * i + increment) * 10) / 10;
      const p4 = Math.round((increment * i + increment * 2) * 10) / 10;

      let gradient = `transparent ${p1}%, black ${p2}%`;
      if (p3 <= 100) gradient += `, black ${p3}%`;
      if (p4 <= 100) gradient += `, transparent ${p4}%`;

      const direction = getGradientDirection(position);

      divs.push(
        <div
          key={i}
          style={{
            position: "absolute",
            inset: "0",
            maskImage: `linear-gradient(${direction}, ${gradient})`,
            WebkitMaskImage: `linear-gradient(${direction}, ${gradient})`,
            backdropFilter: `blur(${blurValue.toFixed(3)}rem)`,
            WebkitBackdropFilter: `blur(${blurValue.toFixed(3)}rem)`,
            opacity: layerOpacity,
            transition:
              animated && animated !== "scroll"
                ? `backdrop-filter ${duration} ${easing}`
                : undefined,
          }}
        />
      );
    }
    return divs;
  }, [
    divCount,
    strength,
    exponential,
    curve,
    position,
    layerOpacity,
    animated,
    duration,
    easing,
    isHovered,
    hoverIntensity,
  ]);

  const containerStyle = useMemo<React.CSSProperties>(() => {
    const isVertical = position === "top" || position === "bottom";
    const isHorizontal = position === "left" || position === "right";
    const isPage = target === "page";

    const base: React.CSSProperties = {
      position: isPage ? "fixed" : "absolute",
      pointerEvents: hoverIntensity ? "auto" : "none",
      opacity: isVisible ? 1 : 0,
      transition: animated ? `opacity ${duration} ${easing}` : undefined,
      zIndex: isPage ? zIndex + 100 : zIndex,
      ...styleProp,
    };

    if (isVertical) {
      base.height = height;
      base.width = width || "100%";
      base[position] = 0;
      base.left = 0;
      base.right = 0;
    } else if (isHorizontal) {
      base.width = width || height;
      base.height = "100%";
      base[position] = 0;
      base.top = 0;
      base.bottom = 0;
    }

    return base;
  }, [position, target, height, width, isVisible, animated, duration, easing, zIndex, hoverIntensity, styleProp]);

  return (
    <div
      ref={containerRef}
      className={`gradual-blur ${target === "page" ? "gradual-blur-page" : "gradual-blur-parent"} ${className}`}
      style={containerStyle}
      onMouseEnter={hoverIntensity ? () => setIsHovered(true) : undefined}
      onMouseLeave={hoverIntensity ? () => setIsHovered(false) : undefined}
    >
      <div className="gradual-blur-inner">{blurDivs}</div>
    </div>
  );
}

export default React.memo(GradualBlur);
