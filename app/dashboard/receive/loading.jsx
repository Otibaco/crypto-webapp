"use client"

import { motion } from "framer-motion"

export default function Loading() {
  return (
    <div className="relative flex items-center justify-center h-screen w-full bg-white dark:bg-[#111827] transition-colors duration-300">
      {/* Gradient Ring Spinner */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
        className="h-20 w-20 rounded-full border-4 border-t-transparent border-r-[#2563EB] border-b-[#7C3AED] border-l-[#06B6D4] shadow-[0_0_30px_rgba(37,99,235,0.6)]"
      />

      {/* Brand Text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-16 text-center"
      >
        <h1 className="text-lg font-semibold bg-gradient-to-r from-[#2563EB] via-[#7C3AED] to-[#06B6D4] text-transparent bg-clip-text">
          Loading...
        </h1>
      </motion.div>
    </div>
  )
}
