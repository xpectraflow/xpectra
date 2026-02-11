"use client";

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useFrame, useThree } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Linkedin } from 'lucide-react';
import Link from 'next/link';

const Canvas = dynamic(() => import('@react-three/fiber').then(mod => mod.Canvas), { ssr: false });

const LiquidBackground = () => {
  const meshRef = React.useRef<THREE.Mesh>(null);
  const { viewport } = useThree();
  const uniforms = React.useMemo(() => ({
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
  const meshRef = React.useRef<THREE.Mesh>(null);
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

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
  linkedin: string;
}

const TeamPage = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const teamMembers: TeamMember[] = [
    {
      name: "Arush Kumar Singh",
      role: "Co-Founder",
      bio: "Ex-ButterCutAI, Ex-Galaxeye, Ex-Nabhdrishti Aerospace",
      image: "/arush.jpg",
      linkedin: "https://www.linkedin.com/in/arush-kumar-singh/"
    },
    {
      name: "Aaryansh M. Bansal",
      role: "Co-Founder",
      bio: "Ex-Jaguar Land Rover",
      image: "/aaryansh.jpg",
      linkedin: "https://www.linkedin.com/in/aaryansh-m-bansal-457474385/"
    }
  ];

  return (
    <div className="relative min-h-screen w-full bg-[#020202] text-white overflow-x-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none">
        {mounted && (
          <Canvas camera={{ position: [0, 0, 60], fov: 35 }}>
            <ambientLight intensity={0.4} />
            <spotLight position={[50, 50, 50]} intensity={3} />
            <LiquidBackground />
            <Monolith />
          </Canvas>
        )}
      </div>

      <div className="relative z-10">
        <nav className="w-full border-b border-white/10 bg-black/20 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <Link href="/" className="flex items-center gap-3">
                <Image
                  src="/logo.svg"
                  alt="xpectra logo"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
                <span className="font-mono text-sm font-bold text-white tracking-wider">xpectra</span>
              </Link>
              <Button 
                size="sm" 
                className="bg-white text-black hover:bg-gray-100 font-semibold"
                onClick={() => window.location.href = '/#contact'}
              >
                Request pilot
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </nav>

        <section className="relative min-h-screen flex items-center justify-center px-6 py-24">
          <div className="max-w-6xl mx-auto w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6">
                Our Team
              </h1>
              <p className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto">
                Building the infrastructure to make sensor data reusable across missions
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.6 }}
                  className="group"
                >
                  <div className="p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 h-full">
                    <div className="flex flex-col items-center text-center">
                      <div className="relative w-32 h-32 mb-6 rounded-full overflow-hidden border-2 border-white/20 group-hover:border-white/40 transition-all duration-300">
                        <Image
                          src={member.image}
                          alt={member.name}
                          fill
                          className="object-cover"
                          sizes="128px"
                        />
                      </div>
                      <h3 className="text-2xl font-bold mb-2">{member.name}</h3>
                      <p className="text-lg text-white/80 mb-3 font-semibold">{member.role}</p>
                      <p className="text-sm text-white/60 leading-relaxed mb-4">{member.bio}</p>
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors"
                        aria-label={`${member.name} LinkedIn`}
                      >
                        <Linkedin className="h-5 w-5" />
                        <span className="text-sm">LinkedIn</span>
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>


          </div>
        </section>
      </div>
    </div>
  );
};

export default TeamPage;
