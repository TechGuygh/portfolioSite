import React from 'react';
import { motion } from 'motion/react';
import { VOLUNTEERING } from '../constants';

export default function Volunteering() {
  return (
    <section id="volunteering" className="py-32 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-24"
        >
          <span className="text-xs uppercase tracking-[0.4em] text-zorvyn-blue mb-4 block font-semibold">
            Community & Impact
          </span>
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Volunteering & <span className="text-white/40">Leadership</span>
          </h2>
          <p className="text-white/40 max-w-2xl mx-auto">
            Beyond the SOC: My commitment to mentoring, community building, and contributing to the global security ecosystem.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12">
          {VOLUNTEERING.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              className="group relative rounded-[2rem] overflow-hidden bg-[#0a0a0a] border border-white/5 shadow-2xl"
            >
              {/* Image Section */}
              <div className="relative h-[400px] overflow-hidden">
                <motion.img 
                  src={item.image} 
                  alt={item.organization}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                
                {/* Top Badge */}
                <div className="absolute top-6 left-6">
                  <div className="px-4 py-1.5 bg-black/40 backdrop-blur-md border border-white/10 rounded-lg text-[10px] font-bold text-white/90 uppercase tracking-widest">
                    {i === 0 ? 'Active Role' : 'Leadership'}
                  </div>
                </div>

                {/* Pagination Dots (Decorative) */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-white" />
                  <div className="w-2 h-2 rounded-full bg-white/30" />
                  <div className="w-2 h-2 rounded-full bg-white/30" />
                  <div className="w-2 h-2 rounded-full bg-white/30" />
                </div>
              </div>

              {/* Content Section */}
              <div className="p-8">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-2xl font-bold text-white">
                    {item.role}
                  </h3>
                  <span className="text-lg font-bold text-white/90">
                    {item.period.split(' ')[0]}
                  </span>
                </div>
                
                <p className="text-white/40 text-sm mb-8 font-medium">
                  {item.organization}
                </p>

                {/* Divider */}
                <div className="h-[1px] w-full bg-white/5 mb-6" />

                {/* Stats Row */}
                <div className="flex items-center justify-between">
                  {item.stats?.map((stat, index) => (
                    <React.Fragment key={index}>
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-widest text-white/30 mb-1 font-bold">
                          {stat.label}
                        </span>
                        <span className="text-sm font-bold text-white/80">
                          {stat.value}
                        </span>
                      </div>
                      {index < (item.stats?.length || 0) - 1 && (
                        <div className="h-8 w-[1px] bg-white/5" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Hover Overlay for Description */}
              <div className="absolute inset-0 bg-zorvyn-black/95 backdrop-blur-xl p-10 flex flex-col justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 pointer-events-none group-hover:pointer-events-auto">
                <h4 className="text-zorvyn-blue text-xs font-bold uppercase tracking-[0.3em] mb-4">Contribution & Impact</h4>
                <p className="text-white/70 text-lg mb-8 leading-relaxed">
                  {item.description}
                </p>
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 italic text-white/90 text-sm border-l-4 border-l-zorvyn-blue">
                  "{item.impact}"
                </div>
                <button className="mt-10 w-full py-4 bg-white text-zorvyn-black font-bold rounded-xl hover:bg-zorvyn-blue hover:text-white transition-all duration-300 text-xs uppercase tracking-widest">
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
