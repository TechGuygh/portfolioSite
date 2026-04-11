import React from 'react';
import { motion } from 'motion/react';
import { SERVICES } from '../constants';
import { cn } from '../lib/utils';

export default function Services() {
  return (
    <section id="services" className="py-24 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <span className="text-[10px] uppercase tracking-[0.4em] text-zorvyn-blue mb-4 block font-semibold">
            Expertise
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Defensive <span className="text-white/40">Capabilities</span>
          </h2>
          <p className="text-white/40 max-w-2xl mx-auto text-sm">
            Specialized security services designed to detect, respond, and automate in a rapidly evolving threat landscape.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((service, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative p-8 glass-card rounded-2xl overflow-hidden"
            >
              <div className={cn(
                "absolute -top-24 -right-24 w-40 h-40 rounded-full blur-[70px] transition-all duration-700 group-hover:scale-150 opacity-20",
                service.color === 'blue' ? "bg-zorvyn-blue" : "bg-zorvyn-purple"
              )} />
              
              <div className="relative z-10">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center mb-6 border border-white/10 group-hover:scale-110 transition-transform duration-500",
                  service.color === 'blue' ? "bg-zorvyn-blue/10 text-zorvyn-blue" : "bg-zorvyn-purple/10 text-zorvyn-purple"
                )}>
                  <service.icon size={24} />
                </div>
                
                <h3 className="text-xl font-bold mb-3 group-hover:text-white transition-colors">
                  {service.title}
                </h3>
                <p className="text-white/50 leading-relaxed text-[13px]">
                  {service.description}
                </p>
              </div>

              <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-zorvyn-blue to-zorvyn-purple group-hover:w-full transition-all duration-700" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
