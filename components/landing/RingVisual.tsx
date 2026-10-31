"use client";

import { motion } from "framer-motion";
import { Radio } from "lucide-react";

export function RingVisual({ size = 320 }: { size?: number }) {
  const bandThickness = Math.round(size * 0.11);
  const outerDiameter = Math.round(size * 0.86);
  const innerDiameter = outerDiameter - bandThickness * 2;

  return (
    <div
      className="relative flex items-center justify-center select-none"
      style={{ width: size, height: size }}
    >
      {/* Ambient background aura glow */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: size * 1.1,
          height: size * 1.1,
          background:
            "radial-gradient(circle, rgba(201, 166, 112, 0.22) 0%, rgba(201, 166, 112, 0.05) 45%, transparent 70%)",
          filter: "blur(24px)",
        }}
        animate={{
          scale: [0.95, 1.05, 0.95],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Pulsing NFC electromagnetic field waves */}
      <motion.div
        className="absolute rounded-full border border-accent/20"
        style={{ width: outerDiameter + 36, height: outerDiameter + 36 }}
        animate={{
          scale: [1, 1.18, 1],
          opacity: [0.3, 0.05, 0.3],
        }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeOut" }}
      />
      <motion.div
        className="absolute rounded-full border border-accent/30"
        style={{ width: outerDiameter + 16, height: outerDiameter + 16 }}
        animate={{
          scale: [1, 1.12, 1],
          opacity: [0.4, 0.1, 0.4],
        }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeOut", delay: 0.4 }}
      />

      {/* Main Luxury Ring Structure: Multi-layer circular gradient with 3D bevel */}
      <motion.div
        className="relative rounded-full flex items-center justify-center shadow-2xl"
        style={{
          width: outerDiameter,
          height: outerDiameter,
          background:
            "conic-gradient(from 45deg, #e0c08c 0deg, #9a7846 60deg, #ffd99f 120deg, #7c5d2e 180deg, #f2dcba 240deg, #8f6e3c 300deg, #e0c08c 360deg)",
          boxShadow:
            "0 18px 45px -8px rgba(0, 0, 0, 0.8), 0 0 25px rgba(201, 166, 112, 0.25), inset 0 2px 4px rgba(255, 255, 255, 0.4)",
        }}
        initial={{ rotate: -12, scale: 0.92, opacity: 0 }}
        animate={{ rotate: 0, scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}
      >
        {/* Specular light shimmer sweep */}
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background:
              "conic-gradient(from 0deg, transparent 0deg, rgba(255, 255, 255, 0.55) 20deg, transparent 45deg)",
            mixBlendMode: "overlay",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        />

        {/* Ring inner void / Core cavity with dark graphite depth */}
        <div
          className="relative rounded-full flex flex-col items-center justify-center overflow-hidden"
          style={{
            width: innerDiameter,
            height: innerDiameter,
            background: "radial-gradient(circle at 45% 40%, #1a1a1e 0%, #0c0c0e 80%, #050506 100%)",
            boxShadow:
              "inset 0 4px 14px rgba(0, 0, 0, 0.95), inset 0 -2px 6px rgba(201, 166, 112, 0.15), 0 1px 2px rgba(255,255,255,0.1)",
          }}
        >
          {/* Micro antenna etched track inside bezel */}
          <div
            className="absolute rounded-full border border-accent/20"
            style={{ width: innerDiameter * 0.76, height: innerDiameter * 0.76 }}
          />
          <div
            className="absolute rounded-full border border-dashed border-accent/15"
            style={{ width: innerDiameter * 0.62, height: innerDiameter * 0.62 }}
          />

          {/* Central NFC emblem & chip label */}
          <div className="z-10 flex flex-col items-center justify-center text-center px-2">
            <Radio className="size-4 text-accent-strong mb-1 animate-pulse" />
            <span className="font-mono text-[10px] tracking-[0.22em] text-accent-strong uppercase font-semibold">
              NTAG213
            </span>
            <span className="font-mono text-[8px] tracking-[0.16em] text-text-faint uppercase mt-0.5">
              13.56 MHz
            </span>
          </div>

          {/* Soft inner glow */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none opacity-30"
            style={{
              background: "radial-gradient(circle at 50% 50%, rgba(201, 166, 112, 0.25), transparent 70%)",
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}
