"use client";

import { motion } from "framer-motion";

export function SplashScreen() {
  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-[100]">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center"
      >
        {/* Logo */}
        <div className="w-32 h-32 bg-[#2563EB] rounded-3xl flex items-center justify-center text-white font-bold text-6xl shadow-xl shadow-blue-500/20 mb-8">
          EB
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-12">EquiBrain</h1>

        {/* Progress Bar */}
        <div className="w-64 h-1.5 bg-gray-100 rounded-full overflow-hidden mb-4">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
            className="h-full bg-[#2563EB] rounded-full"
          />
        </div>

        {/* Loading Text */}
        <p className="text-gray-500 text-sm font-medium">Initializing equity intelligence partner</p>
      </motion.div>
    </div>
  );
}
