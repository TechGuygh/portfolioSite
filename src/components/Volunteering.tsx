import React from 'react';
import { motion } from 'motion/react';
import { VOLUNTEERING } from '../constants';

export default function Volunteering() {
  return (
    <section id="volunteering" className="py-24 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <span className="text-[10px] uppercase tracking-[0.4em] text-zorvyn-blue mb-4 block font-semibold">
            Community & Impact
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Volunteering & <span className="text-white/40">Leadership</span>
          </h2>
          <p className="text-white/40 max-w-2xl mx-auto text-sm">
            Beyond the SOC: My commitment to mentoring, community building, and contributing to the global security ecosystem.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {VOLUNTEERING.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              className="group relative rounded-2xl overflow-hidden bg-[#0a0a0a] border border-white/5 shadow-2xl"
            >
              {/* Image Section */}
              <div className="relative h-[240px] overflow-hidden">
                <motion.img 
                  src={item.image} 
                  alt={item.organization}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                
                {/* Top Badge */}
                <div className="absolute top-4 left-4">
                  <div className="px-2.5 py-1 bg-black/40 backdrop-blur-md border border-white/10 rounded-lg text-[8px] font-bold text-white/90 uppercase tracking-widest">
                    {i === 0 ? 'Active Role' : 'Leadership'}
                  </div>
                </div>

                {/* Pagination Dots (Decorative) */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
                  <div className="w-1 h-1 rounded-full bg-white" />
                  <div className="w-1 h-1 rounded-full bg-white/30" />
                  <div className="w-1 h-1 rounded-full bg-white/30" />
                  <div className="w-1 h-1 rounded-full bg-white/30" />
                </div>
              </div>

              {/* Content Section */}
              <div className="p-5 bg-[#1c1b1b]">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-lg font-bold text-white truncate pr-2">
                    {item.role}
                  </h3>
                  <span className="text-sm font-bold text-white/90">
                    {item.period.split(' ')[0]}
                  </span>
                </div>
                
                <p className="text-white/40 text-[10px] mb-5 font-medium truncate">
                  {item.organization}
                </p>

                {/* Divider */}
                <div className="h-[1px] w-full bg-white/5 mb-4" />

                {/* Stats Row */}
                <div className="flex items-center justify-between">
                  {item.stats?.map((stat, index) => (
                    <React.Fragment key={index}>
                      <div className="flex flex-col">
                        <span className="text-[8px] uppercase tracking-widest text-white/30 mb-0.5 font-bold">
                          {stat.label}
                        </span>
                        <span className="text-[10px] font-bold text-white/80">
                          {stat.value}
                        </span>
                      </div>
                      {index < (item.stats?.length || 0) - 1 && (
                        <div className="h-5 w-[1px] bg-white/5" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Hover Overlay for Description */}
              <div className="absolute inset-0 bg-zorvyn-black/95 backdrop-blur-xl p-6 flex flex-col justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 pointer-events-none group-hover:pointer-events-auto">
                <h4 className="text-zorvyn-blue text-[9px] font-bold uppercase tracking-[0.3em] mb-3">Contribution & Impact</h4>
                <p className="text-white/70 text-xs mb-5 leading-relaxed line-clamp-4">
                  {item.description}
                </p>
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 italic text-white/90 text-[11px] border-l-4 border-l-zorvyn-blue">
                  "{item.impact}"
                </div>
                <button className="mt-5 w-full py-2.5 bg-white text-zorvyn-black font-bold rounded-lg hover:bg-zorvyn-blue hover:text-white transition-all duration-300 text-[9px] uppercase tracking-widest">
                  View Case Study
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
