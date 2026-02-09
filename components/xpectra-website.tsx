"use client";

import React, { useState, useRef, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowRight, CheckCircle2, Mail, DatabaseBackup, ShieldCheck, Combine, Workflow, Cpu, LayoutDashboard, ChevronDown, X, Twitter, Linkedin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const cn2 = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(' ');

const LiquidBackground = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
  }), []);

  useFrame((state) => {
    const { clock, mouse } = state;
    if (meshRef.current) {
      (meshRef.current.material as THREE.ShaderMaterial).uniforms.uTime.value = clock.getElapsedTime();
      (meshRef.current.material as THREE.ShaderMaterial).uniforms.uMouse.value.lerp(mouse, 0.05);
    }
  });

  return (
    <mesh ref={meshRef} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        transparent
        uniforms={uniforms}
        vertexShader={`varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`}
        fragmentShader={`
          uniform float uTime; uniform vec2 uMouse; varying vec2 vUv;
          void main() {
            vec2 uv = vUv; float t = uTime * 0.15;
            vec2 m = uMouse * 0.1;
            float color = smoothstep(0.0, 1.0, (sin(uv.x * 8.0 + t + m.x * 12.0) + sin(uv.y * 6.0 - t + m.y * 12.0)) * 0.5 + 0.5);
            gl_FragColor = vec4(mix(vec3(0.005), vec3(0.05), color), 1.0);
          }
        `}
      />
    </mesh>
  );
};

const Monolith = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.25;
    }
  });
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[13, 1]} />
        <MeshDistortMaterial color="#0a0a0a" speed={4} distort={0.4} roughness={0.05} metalness={1.0} />
      </mesh>
    </Float>
  );
};

interface FeatureItem {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

const XpectraWebsite = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const features: FeatureItem[] = [
    {
      id: "Smart Data Lifecycle Management ",
      icon: DatabaseBackup,
      title: "Smart Data Lifecycle Management",
      description: "Query events from terabytes of historical data in seconds using optimized database models",
    },
    {
      id: "validation",
      icon: ShieldCheck,
      title: "Real-time data validation",
      description: "Schema, timestamps, dropouts — caught instantly before they cascade into mission failures.",
    },
    {
      id: "ingestion",
      icon: Combine,
      title: "Standardized ingestion",
      description: "Across sensors and missions. No more rewriting scripts every experiment.",
    },
    {
      id: "pipelines",
      icon: Workflow,
      title: "Reusable pipelines",
      description: "That don't break every experiment. Build once, use forever.",
    },
    {
      id: "Hardware Diagnostics",
      icon: Cpu,
      title: "Hardware Diagnostics",
      description: "Tracks sensor and component performance over multiple test cycles to identify statistical drift.",
    },
    {
      id: "Real-time Observability",
      icon: LayoutDashboard,
      title: "Real-time Observability",
      description: "Dynamic dashboards that lets you choose what you want to see.",
    }
    
  ];

  const faqs: FAQItem[] = [
    {
      question: "How long does a pilot take?",
      answer: "30–45 days with one live sensor workflow. You'll get real-time validation and standardized storage, with a clear decision point at the end."
    },
    {
      question: "Does xpectra replace our existing tools?",
      answer: "No. xpectra sits between raw sensors and your downstream pipelines. It strengthens what you already run without replacing algorithms, firmware, or workflows."
    },
    {
      question: "What kind of sensors does xpectra support?",
      answer: "We work with teams across space, drones, and aerospace. Our infrastructure is designed for real mission constraints and can adapt to various sensor types."
    },
    {
      question: "Do you add heavy dashboards or change our workflow?",
      answer: "No. xpectra does not add heavy dashboards, change sensor firmware, or lock you into a new workflow. It's infrastructure, not overhead."
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = `mailto:xpectraflow@gmail.com?subject=Pilot Request from ${formData.name}&body=${formData.message}`;
  };

  return (
    <div className="relative min-h-screen w-full bg-[#020202] text-white overflow-x-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 60], fov: 35 }}>
          <ambientLight intensity={0.4} />
          <spotLight position={[50, 50, 50]} intensity={3} />
          <LiquidBackground />
          <Monolith />
        </Canvas>
      </div>

      <div className="relative z-10">
        <nav className="w-full border-b border-white/10 bg-black/20 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center gap-3">
                <Image
                  src="/logo.svg"
                  alt="xpectra logo"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
                <span className="font-mono text-sm font-bold text-white tracking-wider">xpectra</span>
              </div>
              <Button 
                size="sm" 
                className="bg-white text-black hover:bg-gray-100 font-semibold"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Request pilot
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </nav>

        <section className="relative min-h-screen flex items-center justify-center px-6 py-20">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-balance text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tighter mb-6">
                Make sensor data<br />
                <span className="bg-gradient-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent md:whitespace-nowrap">
                  reusable across missions
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-white/70 max-w-3xl mx-auto mb-10 leading-relaxed">
              Xpectra validates, standardizes, and stores sensor data in real-time - so your pipelines don't break, your ML models don't starve, and your historical data stays usable
              </p>
              <Button 
                size="lg" 
                className="bg-white text-black hover:bg-gray-100 font-semibold text-lg px-10 py-7"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Request pilot
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mt-20 p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10"
            >
              <div className="flex flex-col md:flex-row items-center justify-center gap-8 text-sm font-mono">
                <div className="flex items-center gap-3">
                  <span className="text-white/50">Sensor Telemetry</span>
                  <ArrowRight className="h-4 w-4 text-white/30" />
                </div>
                <div className="px-6 py-3 rounded-full bg-white/10 border border-white/20 flex flex-col items-center gap-1">
                  <span className="font-bold text-l">xpectra</span>
                  <span className="text-white/50 text-xs">(validate + diagnose + standardize)</span>
                </div>
                <div className="flex items-center gap-3">
                  <ArrowRight className="h-4 w-4 text-white/30" />
                  <span className="text-white/50">Engineering-Ready Data</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="problem" className="relative py-24 px-6 bg-black/40 backdrop-blur-sm border-y border-white/10">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl sm:text-5xl font-bold mb-12 text-center">
                Real sensor operations are<br />messy by default
              </h2>

              <div className="grid md:grid-cols-2 gap-8 mb-16">
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-white/90 mb-6">Today</h3>
                  {[
                    "One erroneous sensor invalidates the entire dataset",
                    "Engineers rewrite ingestion and validation scripts every experiment",
                    "Failures surface 2-3 days post-operation, when it's too late",
                    "Data formats and metadata drift across missions",
                    "6 months later, historical data is unreadable for ML training"
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 rounded-lg bg-red-500/5 border border-red-500/20">
                      <X className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <p className="text-white/70">{item}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-white/90 mb-6">With xpectra</h3>
                  {[
                    "One bad sensor doesn't break the dataset",
                    "Reusable ingestion and validation across experiments",
                    "Failures caught in real-time, before operations end",
                    "Consistent data formats and metadata across missions",
                    "Historical data remains usable for ML training"
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 rounded-lg bg-green-500/5 border border-green-500/20">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <p className="text-white/70">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-center text-white/60 mb-8 text-lg">
                These are not edge cases — they happen every week in real operations.
              </p>

              <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent mb-8" />
              
              <p className="text-center text-white/80 text-xl mb-12 italic">
                The issue isn't talent or tooling. It's missing infrastructure.
              </p>

            </motion.div>
          </div>
        </section>

        <section id="features" className="relative py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl sm:text-5xl font-bold mb-6">What xpectra does</h2>
            </motion.div>

            <div className="grid gap-8 md:grid-cols-3">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                >
                  <Card className="h-full p-6 bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                    <CardHeader className="p-0 pb-4">
                      <div className="mb-4 p-3 w-fit rounded-lg bg-white/10 border border-white/20">
                        {React.createElement(feature.icon, { className: "h-6 w-6 text-white" })}
                      </div>
                      <CardTitle className="text-xl text-white">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <CardDescription className="text-white/60">{feature.description}</CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="pilot" className="relative py-24 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl sm:text-5xl font-bold mb-8">Start with a pilot</h2>
              
              <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {[
                  { label: "Duration", value: "30-45 days" },
                  { label: "Scope", value: "One live sensor workflow (your choice)"},
                  { label: "Deliverable", value: "Real-time validation, standardized storage, historical data access" },
                  { label: "Outcome", value: "Clear go/no-go decision with measurable results" }
                ].map((item, i) => (
                  <div key={i} className="p-6 rounded-lg bg-white/5 border border-white/10">
                    <div className="text-sm text-white/50 mb-2 font-mono uppercase tracking-wider">{item.label}</div>
                    <div className="text-lg font-semibold text-white">{item.value}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <section id="faq" className="relative py-24 px-6 bg-black/40 backdrop-blur-sm border-y border-white/10">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl sm:text-5xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
              
              <div className="space-y-4">
                {faqs.map((faq, i) => (
                  <div key={i} className="rounded-lg bg-white/5 border border-white/10 overflow-hidden">
                    <button
                      onClick={() => setOpenFAQ(openFAQ === i ? null : i)}
                      className="w-full p-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
                    >
                      <span className="font-semibold text-white pr-4">{faq.question}</span>
                      <ChevronDown className={cn2(
                        "h-5 w-5 text-white/50 transition-transform flex-shrink-0",
                        openFAQ === i && "rotate-180"
                      )} />
                    </button>
                    <AnimatePresence>
                      {openFAQ === i && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="px-6 pb-6 text-white/70">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <section id="contact" className="relative py-24 px-6">
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl sm:text-5xl font-bold mb-8 text-center">Request a pilot</h2>
              <p className="text-white/60 text-center mb-12">
                Let's discuss how xpectra can strengthen your sensor operations.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Input
                    placeholder="Your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                  />
                </div>
                <div>
                  <Input
                    type="email"
                    placeholder="Your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                  />
                </div>
                <div>
                  <Textarea
                    placeholder="Tell us about your sensor operations and challenges"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={5}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                  />
                </div>
                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full bg-white text-black hover:bg-gray-100 font-semibold"
                >
                  Send request
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </form>
              
              <div className="mt-8 text-center">
                <p className="text-white/50 text-sm mb-2">or email us directly:</p>
                <a 
                  href="mailto:xpectraflow@gmail.com" 
                  className="text-white hover:text-white/80 transition-colors inline-flex items-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  xpectraflow@gmail.com
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        <footer className="relative py-12 px-6 border-t border-white/10 bg-black/40 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <Image
                  src="/logo.svg"
                  alt="xpectra logo"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
                <span className="font-mono text-sm font-bold text-white tracking-wider">xpectra</span>
              </div>
              <div className="flex items-center gap-6">
                <a
                  href="https://x.com/XpectraF3662"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/50 hover:text-white transition-colors"
                  aria-label="Follow us on Twitter"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a
                  href="https://www.linkedin.com/company/xpectraflow"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/50 hover:text-white transition-colors"
                  aria-label="Follow us on LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
                <p className="text-white/50 text-sm">
                  © 2026 Xpectra. Making sensor data reusable across missions.
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default XpectraWebsite;
