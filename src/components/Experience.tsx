import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EXPERIENCE } from '../constants';
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

export default function Experience() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  return (
    <section id="experience" className="py-24 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8"
        >
          <div className="max-w-2xl">
            <span className="text-[10px] uppercase tracking-[0.4em] text-zorvyn-blue mb-4 block font-semibold">
              Professional Journey
            </span>
            <h2 className="text-3xl md:text-5xl font-bold">
              Operational <span className="text-white/40">History</span>
            </h2>
          </div>
          <p className="text-white/40 max-w-sm text-xs leading-relaxed">
            A track record of defending critical infrastructure and orchestrating complex incident responses.
          </p>
        </motion.div>

        <div className="relative grid grid-cols-1 gap-5">
          {/* Vertical Timeline Line */}
          <div className="absolute left-0 lg:left-[calc(16.666%-0.5px)] top-0 bottom-0 w-px bg-white/5 hidden lg:block" />

          {EXPERIENCE.map((exp, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              className="group relative glass-card rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
                className="w-full text-left p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
              >
                <div className="lg:col-span-4">
                  <span className="text-[10px] font-mono text-zorvyn-blue mb-2 block">{exp.period}</span>
                  <h3 className="text-xl font-bold group-hover:text-zorvyn-blue transition-colors duration-500">
                    {exp.role}
                  </h3>
                  <p className="text-white/40 text-[9px] uppercase tracking-widest font-semibold">{exp.company}</p>
                </div>

                <div className="lg:col-span-7 hidden lg:block">
                  <p className="text-white/50 text-xs line-clamp-1">
                    {exp.description}
                  </p>
                </div>

                <div className="lg:col-span-1 flex justify-end">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-zorvyn-blue/20 transition-all">
                    {expandedIndex === i ? <ChevronUp size={16} className="text-zorvyn-blue" /> : <ChevronDown size={16} className="text-white/20" />}
                  </div>
                </div>
              </button>

              <AnimatePresence>
                {expandedIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.04, 0.62, 0.23, 0.98] }}
                  >
                    <div className="px-8 pb-8 grid grid-cols-1 lg:grid-cols-12 gap-8 border-t border-white/5 pt-8">
                      <div className="lg:col-span-4 hidden lg:block" />
                      <div className="lg:col-span-5">
                        <p className="text-white/70 leading-relaxed mb-6 text-base">
                          {exp.description}
                        </p>
                        
                        <div className="space-y-5">
                          <div>
                            <span className="text-[9px] uppercase tracking-[0.2em] text-zorvyn-blue mb-3 block font-bold">Core Technologies</span>
                            <div className="flex flex-wrap gap-2">
                              {exp.technologies?.map((tech) => (
                                <span key={tech} className="text-[9px] px-2.5 py-1 bg-zorvyn-blue/10 border border-zorvyn-blue/20 rounded-md text-zorvyn-blue font-medium">
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <span className="text-[9px] uppercase tracking-[0.2em] text-zorvyn-blue mb-2 block font-bold">The Challenge</span>
                            <p className="text-xs text-white/50 leading-relaxed">
                              {exp.challenges}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="lg:col-span-3 flex flex-col justify-center border-l border-white/5 lg:pl-8">
                        <span className="text-[9px] uppercase tracking-[0.2em] text-zorvyn-blue mb-3 block font-bold">Key Impact</span>
                        <p className="text-xs italic text-white/50 leading-relaxed border-l-2 border-zorvyn-blue/30 pl-4">
                          "{exp.impact}"
                        </p>
                        <button className="mt-6 flex items-center gap-2 text-[9px] uppercase tracking-widest font-bold text-zorvyn-blue hover:text-white transition-colors">
                          View Case Study <ExternalLink size={10} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
