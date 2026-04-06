import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { PROJECTS } from '../constants';
import { ArrowUpRight } from 'lucide-react';

function ProjectCard({ project, index }: { project: typeof PROJECTS[0], index: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [-50, 50]);

  return (
    <motion.div
      ref={containerRef}
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4 }}
      className="group relative flex flex-col h-full glass-card rounded-3xl overflow-hidden"
    >
      <div className="relative h-72 overflow-hidden">
        <motion.img
          style={{ y }}
          src={project.image}
          alt={project.title}
          className="absolute inset-0 w-full h-[120%] object-cover transition-transform duration-700 group-hover:scale-105 grayscale group-hover:grayscale-0"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-zorvyn-black/60 group-hover:bg-zorvyn-blue/20 transition-colors duration-500" />
        <div className="absolute top-6 left-6">
          <span className="text-[10px] uppercase tracking-widest px-4 py-1.5 bg-zorvyn-black/80 backdrop-blur-md border border-white/10 rounded-full font-bold">
            {project.category}
          </span>
        </div>
      </div>

      <div className="p-10 flex flex-col flex-grow">
        <h3 className="text-3xl font-bold mb-6 group-hover:text-zorvyn-blue transition-colors">
          {project.title}
        </h3>
        
        <div className="space-y-6 mb-10 flex-grow">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-zorvyn-blue mb-2 block font-bold">The Problem</span>
            <p className="text-sm text-white/50 leading-relaxed">{project.problem}</p>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-zorvyn-blue mb-2 block font-bold">The Solution</span>
            <p className="text-sm text-white/50 leading-relaxed">{project.solution}</p>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-zorvyn-blue mb-2 block font-bold">The Result</span>
            <p className="text-sm text-white/80 font-medium leading-relaxed italic border-l-2 border-zorvyn-blue/30 pl-4">"{project.result}"</p>
          </div>
        </div>

        <button className="mt-auto flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-white/40 group-hover:text-white transition-colors">
          View Case Study <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
}

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState('All');
  const categories = ['All', ...Array.from(new Set(PROJECTS.map(p => p.category)))];

  const filteredProjects = activeCategory === 'All' 
    ? PROJECTS 
    : PROJECTS.filter(p => p.category === activeCategory);

  return (
    <section id="projects" className="py-32 px-6 bg-zorvyn-black">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
          <div>
            <span className="text-xs uppercase tracking-[0.4em] text-zorvyn-blue mb-4 block font-semibold">
              Intel Reports
            </span>
            <h2 className="text-4xl md:text-6xl font-bold">
              Strategic <span className="text-white/40">Case Files</span>
            </h2>
          </div>
          <div className="flex flex-col gap-6">
            <p className="text-white/40 max-w-sm text-sm leading-relaxed">
              Deep-dive analysis of security challenges, implemented solutions, and measurable outcomes.
            </p>
            
            {/* Filter UI */}
            <div className="flex flex-wrap gap-3">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all duration-300 border ${
                    activeCategory === cat 
                      ? 'bg-zorvyn-blue border-zorvyn-blue text-white glow-blue' 
                      : 'bg-white/5 border-white/10 text-white/40 hover:border-white/20 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 gap-10"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, i) => (
              <ProjectCard key={project.title} project={project} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
