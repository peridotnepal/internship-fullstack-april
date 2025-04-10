"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

// Fade in animation component
export const FadeIn = ({
  children,
  delay = 0,
  duration = 0.5,
}: { children: ReactNode; delay?: number; duration?: number }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration, delay, ease: "easeOut" }}>
    {children}
  </motion.div>
)

// Slide up animation component
export const SlideUp = ({
  children,
  delay = 0,
  duration = 0.5,
}: { children: ReactNode; delay?: number; duration?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration, delay, ease: "easeOut" }}
  >
    {children}
  </motion.div>
)

// Staggered children animation
export const StaggerContainer = ({
  children,
  staggerChildren = 0.1,
  delayChildren = 0,
}: {
  children: ReactNode
  staggerChildren?: number
  delayChildren?: number
}) => (
  <motion.div
    variants={{
      hidden: { opacity: 0 },
      show: {
        opacity: 1,
        transition: {
          staggerChildren,
          delayChildren,
        },
      },
    }}
    initial="hidden"
    animate="show"
  >
    {children}
  </motion.div>
)

// Item for staggered animation
export const StaggerItem = ({ children }: { children: ReactNode }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 10 },
      show: { opacity: 1, y: 0, transition: { ease: "easeOut" } },
    }}
  >
    {children}
  </motion.div>
)

// Pulse animation for loading states
export const Pulse = ({ children }: { children: ReactNode }) => (
  <motion.div
    animate={{
      scale: [1, 1.02, 1],
      opacity: [0.7, 1, 0.7],
    }}
    transition={{
      duration: 2,
      repeat: Number.POSITIVE_INFINITY,
      ease: "easeInOut",
    }}
  >
    {children}
  </motion.div>
)

// Refresh animation
export const RefreshSpin = ({ children }: { children: ReactNode }) => (
  <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.6, ease: "easeInOut" }}>
    {children}
  </motion.div>
)

// Page transition for pagination
export const PageTransition = ({ children, direction = 0 }: { children: ReactNode; direction?: number }) => (
  <motion.tr
    initial={{ opacity: 0, x: direction * 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: direction * -20 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.tr>
)
