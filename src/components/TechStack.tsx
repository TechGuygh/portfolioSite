import React from 'react';
import { motion } from 'motion/react';
import { TECH_STACK } from '../constants';

export default function TechStack() {
  return (
    <section className="py-24 px-6 bg-zorvyn-black border-y border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20">
          {TECH_STACK.map((tech, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-3 group relative"
            >
              <div className="p-2 bg-white/5 rounded-lg border border-white/10 group-hover:border-zorvyn-blue/50 transition-all duration-300">
                <tech.icon size={20} className="text-white/40 group-hover:text-zorvyn-blue transition-colors" />
              </div>
              <span className="text-sm font-semibold text-white/30 group-hover:text-white transition-colors uppercase tracking-widest">
                {tech.name}
              </span>

              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 px-4 py-2 bg-zorvyn-gray border border-white/10 rounded-xl text-[10px] uppercase tracking-widest text-zorvyn-blue opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-10">
                {tech.detail}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-zorvyn-gray" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
