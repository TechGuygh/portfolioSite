import React from 'react';
import { motion } from 'motion/react';
import { ChevronDown, ArrowRight } from 'lucide-react';
import profile1 from '../assets/profile1.png';

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden grid-bg pt-32 pb-12">
      {/* Animated Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-zorvyn-blue/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-zorvyn-purple/20 rounded-full blur-[120px] animate-pulse delay-700" />

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
              x: [0, Math.random() * 100 - 50, 0],
              y: [0, Math.random() * 100 - 50, 0]
            }}
            transition={{ 
              duration: 10 + Math.random() * 10, 
              repeat: Infinity, 
              ease: "linear",
              delay: i * 2
            }}
            className="absolute border border-white/5 rounded-lg"
            style={{
              width: `${20 + Math.random() * 60}px`,
              height: `${20 + Math.random() * 60}px`,
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
              y: [0, -100, 0],
              opacity: [0, 0.5, 0],
              scale: [0, 1, 0]
            }}
            transition={{ 
              duration: 5 + Math.random() * 5, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: Math.random() * 5
            }}
            className="absolute w-1 h-1 bg-zorvyn-blue/30 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-zorvyn-blue animate-ping" />
            <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-white/60">Available for Strategic Operations</span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1] text-white">
            Securing Digital <br />
            Infrastructure with <br />
            <span className="text-gradient">Intelligence & Precision</span>
          </h1>
          
          <p className="text-lg text-white/50 font-light max-w-xl leading-relaxed mb-12 tracking-wide">
            Emmanuel Aidoo is a Senior SOC Analyst with years of experience in threat detection, incident response, and security automation.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-6">
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

        <motion.div
          initial={{ opacity: 0, scale: 0.8, x: 30 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="hidden lg:block relative"
        >
          <div className="relative aspect-square max-w-[500px] ml-auto">
            <div className="absolute inset-0 bg-gradient-to-br from-zorvyn-blue/20 to-zorvyn-purple/20 rounded-full blur-[80px] animate-pulse" />
            <div className="relative h-full w-full rounded-[3rem] overflow-hidden border border-white/10 glow-blue">
              <img 
                src={profile1} 
                alt="Emmanuel Aidoo" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zorvyn-black/60 via-transparent to-transparent" />
            </div>
            
            {/* Floating Stats or Badges */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -left-6 p-4 bg-zorvyn-black/80 backdrop-blur-md border border-white/10 rounded-2xl"
            >
              <div className="text-zorvyn-blue font-bold text-xl">5+</div>
              <div className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Years Exp</div>
            </motion.div>
            
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-6 -right-6 p-4 bg-zorvyn-black/80 backdrop-blur-md border border-white/10 rounded-2xl"
            >
              <div className="text-zorvyn-purple font-bold text-xl">1.2k+</div>
              <div className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Incidents</div>
            </motion.div>
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
