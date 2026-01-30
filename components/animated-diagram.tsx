"use client"

import React from 'react';
import { motion } from 'framer-motion';

export const AnimatedDiagram = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.5 }}
      className="flex items-center justify-center gap-4 md:gap-8 text-sm md:text-base font-mono"
    >
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        className="text-slate-400"
      >
        Sensors
      </motion.div>
      
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="h-px w-8 md:w-16 bg-gradient-to-r from-slate-400 to-cyan-400"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="relative px-4 py-2 rounded-lg border border-cyan-400/30 bg-cyan-400/5"
      >
        <div className="absolute inset-0 rounded-lg bg-cyan-400/10 blur-xl" />
        <span className="relative text-cyan-300 font-semibold">xpectra</span>
        <div className="text-xs text-slate-500 mt-1">validate + standardize</div>
      </motion.div>
      
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.6, delay: 1.4 }}
        className="h-px w-8 md:w-16 bg-gradient-to-r from-cyan-400 to-slate-400"
      />
      
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 1.6 }}
        className="text-slate-400"
      >
        Pipelines / ML
      </motion.div>
    </motion.div>
  );
};
