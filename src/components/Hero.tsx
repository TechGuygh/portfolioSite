import React from 'react';
import { motion } from 'motion/react';
import { ChevronDown, ArrowRight } from 'lucide-react';
import profile1 from '../assets/profile1.png';

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden grid-bg pt-24 pb-8">
      {/* Animated Glows */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-zorvyn-blue/20 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-zorvyn-purple/20 rounded-full blur-[100px] animate-pulse delay-700" />

      {/* Floating Geometric Shapes */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0.1, 0.3, 0.1],
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
              x: [0, Math.random() * 80 - 40, 0],
              y: [0, Math.random() * 80 - 40, 0]
            }}
            transition={{ 
              duration: 10 + Math.random() * 10, 
              repeat: Infinity, 
              ease: "linear",
              delay: i * 2
            }}
            className="absolute border border-white/5 rounded-lg"
            style={{
              width: `${15 + Math.random() * 45}px`,
              height: `${15 + Math.random() * 45}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}
        
        {/* Subtle Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`p-${i}`}
            animate={{ 
              y: [0, -80, 0],
              opacity: [0, 0.5, 0],
              scale: [0, 1, 0]
            }}
            transition={{ 
              duration: 5 + Math.random() * 5, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: Math.random() * 5
            }}
            className="absolute w-0.5 h-0.5 bg-zorvyn-blue/30 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-left"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-zorvyn-blue animate-ping" />
            <span className="text-[9px] uppercase tracking-[0.2em] font-semibold text-white/60">Available for Strategic Operations</span>
          </motion.div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-[1.1] text-white">
            Securing Digital <br />
            Infrastructure with <br />
            <span className="text-gradient">Intelligence & Precision</span>
          </h1>
          
          <p className="text-base text-white/50 font-light max-w-xl leading-relaxed mb-10 tracking-wide">
            Emmanuel Aidoo is a Senior SOC Analyst with years of experience in threat detection, incident response, and security automation.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <motion.a
              href="#projects"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-3.5 bg-white text-zorvyn-black text-xs font-bold rounded-full hover:bg-zorvyn-blue hover:text-white transition-all duration-500 flex items-center gap-2 group"
            >
              View Work <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </motion.a>
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-3.5 bg-white/5 border border-white/10 text-xs font-bold rounded-full hover:bg-white/10 transition-all duration-500"
            >
              Contact Me
            </motion.a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8, x: 30 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="hidden lg:block relative"
        >
          <div className="relative aspect-square max-w-[420px] ml-auto">
            <div className="absolute inset-0 bg-gradient-to-br from-zorvyn-blue/20 to-zorvyn-purple/20 rounded-full blur-[60px] animate-pulse" />
            <div className="relative h-full w-full rounded-[2.5rem] overflow-hidden border border-white/10 glow-blue">
              <img 
                src={profile1} 
                alt="Emmanuel Aidoo" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zorvyn-black/60 via-transparent to-transparent" />
            </div>
            
            {/* Floating Stats or Badges */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -left-4 p-3 bg-zorvyn-black/80 backdrop-blur-md border border-white/10 rounded-xl"
            >
              <div className="text-zorvyn-blue font-bold text-lg">5+</div>
              <div className="text-[9px] text-white/40 uppercase tracking-widest font-bold">Years Exp</div>
            </motion.div>
            
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-4 -right-4 p-3 bg-zorvyn-black/80 backdrop-blur-md border border-white/10 rounded-xl"
            >
              <div className="text-zorvyn-purple font-bold text-lg">1.2k+</div>
              <div className="text-[9px] text-white/40 uppercase tracking-widest font-bold">Incidents</div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/20"
      >
        <ChevronDown className="animate-bounce" size={28} />
      </motion.div>
    </section>
  );
}
