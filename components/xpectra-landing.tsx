"use client"

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Mail, Github, Linkedin, Twitter, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BGPattern } from './bg-pattern';
import { AnimatedDiagram } from './animated-diagram';
import { SplitDiagram } from './split-diagram';

export const XpectraLanding = () => {
  const [activeAccordion, setActiveAccordion] = useState<number | null>(null);

  const faqs = [
    {
      q: "How long does a pilot take?",
      a: "30-45 days with one live sensor workflow. You'll get real-time validation and standardized storage, with a clear decision point at the end."
    },
    {
      q: "Will xpectra replace our existing tools?",
      a: "No. xpectra sits between raw sensors and your downstream pipelines. It strengthens what you already run without replacing your algorithms or changing sensor firmware."
    },
    {
      q: "What sensors do you support?",
      a: "We work with most common sensor types used in space, drones, and aerospace operations. During the pilot, we'll validate compatibility with your specific hardware."
    },
    {
      q: "Do you add heavy dashboards or change our workflow?",
      a: "No. xpectra provides infrastructure-level validation and standardization. No heavy dashboards, no workflow changes, no vendor lock-in."
    }
  ];

  return (
    <div className="min-h-screen bg-[#030303] text-slate-100">
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <BGPattern variant="grid" mask="fade-edges" fill="#1e293b" size={40} />
        
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-slate-500/5" />

        <div className="relative z-10 container mx-auto px-6 py-20">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-sm text-cyan-300"
            >
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              Infrastructure for sensor data
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="text-5xl md:text-7xl font-bold tracking-tight"
            >
              Make sensor data
              <br />
              <span className="bg-gradient-to-r from-cyan-300 via-cyan-400 to-cyan-300 bg-clip-text text-transparent">
                reusable across missions
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed"
            >
              xpectra is the data infrastructure layer that ingests, validates, and standardizes sensor data so teams can reuse it like code.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <button className="group px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-black rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/25 flex items-center gap-2 mx-auto">
                Request pilot
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>

            <div className="pt-16">
              <AnimatedDiagram />
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <ChevronDown className="w-6 h-6 text-slate-500 animate-bounce" />
        </motion.div>
      </section>

      {/* Problem Section */}
      <section className="relative py-32 overflow-hidden">
        <BGPattern variant="dots" mask="fade-y" fill="#1e293b" size={30} />
        
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto space-y-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center space-y-4"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-slate-200">
                Real sensor operations are messy by default
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                "One sensor failure can invalidate an entire operation",
                "Engineers rewrite ingestion and validation scripts every experiment",
                "Failures are discovered days after data collection",
                "Data formats and metadata drift across missions",
                "Historical data becomes unusable for ML"
              ].map((problem, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className="flex items-start gap-3 p-4 rounded-lg bg-slate-800/30 border border-slate-700/50"
                >
                  <div className="w-2 h-2 rounded-full bg-red-400 mt-2 flex-shrink-0" />
                  <p className="text-slate-300">{problem}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center space-y-6"
            >
              <p className="text-lg text-slate-400 italic">
                These are not edge cases — they happen every week in real operations.
              </p>
              
              <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-600 to-transparent" />
              
              <p className="text-xl text-slate-300 font-medium">
                The issue isn't talent or tooling. It's missing infrastructure.
              </p>
            </motion.div>

            <div className="pt-8">
              <SplitDiagram />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto space-y-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-slate-200 mb-6">
                What xpectra provides
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Real-time data validation",
                  desc: "Schema, timestamps, dropouts"
                },
                {
                  title: "Standardized ingestion",
                  desc: "Across sensors and missions"
                },
                {
                  title: "Reusable pipelines",
                  desc: "That don't break every experiment"
                }
              ].map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.2 }}
                  className="group p-8 rounded-xl bg-slate-800/30 border border-slate-700/50 hover:border-cyan-500/50 transition-all duration-300"
                >
                  <CheckCircle2 className="w-8 h-8 text-cyan-400 mb-4" />
                  <h3 className="text-xl font-semibold text-slate-200 mb-2">{feature.title}</h3>
                  <p className="text-slate-400">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="relative py-32 overflow-hidden">
        <BGPattern variant="horizontal-lines" mask="fade-x" fill="#1e293b" size={40} />
        
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto space-y-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center space-y-6"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-slate-200">
                Built for real operations
              </h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                Built based on interviews with engineers across space, drones, and aerospace teams. Designed with real mission constraints in mind.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-semibold text-slate-300 text-center">xpectra does NOT:</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  "Replace your algorithms",
                  "Change sensor firmware",
                  "Add heavy dashboards",
                  "Lock you into a new workflow"
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    className="flex items-center gap-3 p-4 rounded-lg bg-slate-800/30 border border-slate-700/50"
                  >
                    <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0">
                      <span className="text-slate-400 text-sm">✗</span>
                    </div>
                    <p className="text-slate-300">{item}</p>
                  </motion.div>
                ))}
              </div>
              <p className="text-center text-lg text-cyan-300 font-medium pt-4">
                It strengthens what you already run.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="p-8 rounded-xl bg-gradient-to-br from-cyan-500/10 to-slate-800/30 border border-cyan-500/20"
            >
              <h3 className="text-2xl font-semibold text-slate-200 mb-6 text-center">Start with a pilot</h3>
              <div className="grid md:grid-cols-4 gap-6 text-center">
                {[
                  { label: "Duration", value: "30-45 days" },
                  { label: "Scope", value: "One live sensor workflow" },
                  { label: "Output", value: "Real-time validation" },
                  { label: "Decision", value: "Clear at the end" }
                ].map((item, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="text-3xl font-bold text-cyan-300">{item.value}</div>
                    <div className="text-sm text-slate-400">{item.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto space-y-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-5xl font-bold text-slate-200 text-center"
            >
              Frequently asked questions
            </motion.h2>

            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className="border border-slate-700/50 rounded-lg overflow-hidden bg-slate-800/30"
                >
                  <button
                    onClick={() => setActiveAccordion(activeAccordion === idx ? null : idx)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-800/50 transition-colors"
                  >
                    <span className="text-lg font-medium text-slate-200">{faq.q}</span>
                    <ChevronDown
                      className={cn(
                        "w-5 h-5 text-slate-400 transition-transform",
                        activeAccordion === idx && "rotate-180"
                      )}
                    />
                  </button>
                  {activeAccordion === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 pb-4"
                    >
                      <p className="text-slate-400">{faq.a}</p>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="relative py-32 overflow-hidden">
        <BGPattern variant="grid" mask="fade-edges" fill="#1e293b" size={40} />
        
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-4"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-slate-200">
                Ready to start?
              </h2>
              <p className="text-xl text-slate-400">
                Request a pilot and see how xpectra can strengthen your sensor operations.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <button className="group px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-black rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/25 flex items-center gap-2">
                Request a pilot
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <a
                href="mailto:founders@xpectra.xyz"
                className="flex items-center gap-2 text-slate-400 hover:text-cyan-300 transition-colors"
              >
                <Mail className="w-5 h-5" />
                founders@xpectra.xyz
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-slate-800 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-slate-400 text-sm">
              © 2024 xpectra. Built for real operations.
            </div>
            
            <div className="flex items-center gap-6">
              <a href="#" className="text-slate-400 hover:text-cyan-300 transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-cyan-300 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-cyan-300 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
