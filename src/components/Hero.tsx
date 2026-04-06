import React from 'react';
import { motion } from 'motion/react';
import { ChevronDown, ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden grid-bg">
      {/* Animated Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-zorvyn-blue/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-zorvyn-purple/20 rounded-full blur-[120px] animate-pulse delay-700" />

      <div className="relative z-10 text-center max-w-5xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-zorvyn-blue animate-ping" />
            <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-white/60">Available for Strategic Security Operations</span>
          </motion.div>

          <h1 className="text-5xl md:text-8xl font-bold tracking-tight mb-8 leading-[1.1] text-white">
            Securing Digital Infrastructure with <br />
            <span className="text-gradient">Intelligence & Precision</span>
          </h1>
          
          <p className="text-lg md:text-xl text-white/50 font-light max-w-2xl mx-auto leading-relaxed mb-12 tracking-wide">
            Emmanuel Aidoo is a Senior SOC Analyst with years of experience in threat detection, incident response, and security automation.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <motion.a
              href="#projects"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-10 py-4 bg-white text-zorvyn-black text-sm font-bold rounded-full hover:bg-zorvyn-blue hover:text-white transition-all duration-500 flex items-center gap-2 group"
            >
              View Work <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </motion.a>
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-10 py-4 bg-white/5 border border-white/10 text-sm font-bold rounded-full hover:bg-white/10 transition-all duration-500"
            >
              Contact Me
            </motion.a>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white/20"
      >
        <ChevronDown className="animate-bounce" size={32} />
      </motion.div>
    </section>
  );
}
