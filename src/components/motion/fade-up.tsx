"use client";

import { motion } from "framer-motion";

export function FadeUp({
  children, className, delay = 0, blur = true,
}: {
  children: React.ReactNode; className?: string; delay?: number; blur?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22, filter: blur ? "blur(6px)" : "none" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}