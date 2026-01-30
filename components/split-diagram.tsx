"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export const SplitDiagram = () => {
  return (
    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="space-y-4"
      >
        <h3 className="text-xl font-semibold text-slate-300 mb-4">Today</h3>
        <div className="space-y-3 font-mono text-sm text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-400/50" />
            <span>Sensors</span>
          </div>
          <div className="flex items-center gap-2 pl-4">
            <ArrowRight className="w-4 h-4" />
            <span>scripts</span>
          </div>
          <div className="flex items-center gap-2 pl-4">
            <ArrowRight className="w-4 h-4" />
            <span>manual checks</span>
          </div>
          <div className="flex items-center gap-2 pl-4">
            <ArrowRight className="w-4 h-4" />
            <span>ad-hoc storage</span>
          </div>
          <div className="flex items-center gap-2 pl-4">
            <ArrowRight className="w-4 h-4" />
            <span className="text-red-400">late failures</span>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="space-y-4"
      >
        <h3 className="text-xl font-semibold text-cyan-300 mb-4">With xpectra</h3>
        <div className="space-y-3 font-mono text-sm text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-400/50" />
            <span>Sensors</span>
          </div>
          <div className="flex items-center gap-2 pl-4">
            <ArrowRight className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-300">xpectra</span>
          </div>
          <div className="flex items-center gap-2 pl-4">
            <ArrowRight className="w-4 h-4 text-cyan-400" />
            <span className="text-green-400">validated + standardized data</span>
          </div>
          <div className="flex items-center gap-2 pl-4">
            <ArrowRight className="w-4 h-4 text-cyan-400" />
            <span>existing pipelines</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
