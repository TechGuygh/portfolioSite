import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, ExternalLink } from 'lucide-react';
import { CERTIFICATIONS } from '../constants';
import { cn } from '../lib/utils';

const CATEGORIES = ['All', 'Cybersecurity', 'IT Support'];

export default function Certifications() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredCerts = CERTIFICATIONS.filter(
    (cert) => activeCategory === 'All' || cert.category === activeCategory
  );

  return (
    <section id="certifications" className="py-24 px-6 relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-zorvyn-blue/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Certifications & <span className="text-zorvyn-blue glow-text">Credentials</span>
            </h2>
            <p className="text-white/60 max-w-xl text-lg">
              Validated expertise in cybersecurity and IT systems through industry-recognized standards.
            </p>
          </motion.div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 p-1.5 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  "px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 relative",
                  activeCategory === category 
                    ? "text-white" 
                    : "text-white/40 hover:text-white/70"
                )}
              >
                {activeCategory === category && (
                  <motion.div
                    layoutId="active-tab"
                    className="absolute inset-0 bg-zorvyn-blue/20 border border-zorvyn-blue/30 rounded-xl"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{category}</span>
              </button>
            ))}
          </div>
        </div>

        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredCerts.map((cert, index) => (
              <motion.div
                key={cert.name}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ y: -8 }}
                className="group p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl hover:border-zorvyn-blue/50 transition-all duration-500 relative overflow-hidden"
              >
                {/* Shimmer Effect */}
                <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />
                
                {/* Gradient Border Glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute inset-0 p-[1px] bg-gradient-to-br from-zorvyn-blue/50 via-zorvyn-purple/50 to-zorvyn-blue/50 rounded-3xl [mask-image:linear-gradient(white,white)_content-box,linear-gradient(white,white)] [mask-composite:exclude]" />
                </div>

                {/* Hover Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-zorvyn-blue/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center p-3 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 overflow-hidden">
                      {cert.logo ? (
                        <img 
                          src={cert.logo} 
                          alt={cert.issuer} 
                          className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <cert.icon className="text-zorvyn-blue" size={28} />
                      )}
                    </div>
                    <span className="text-xs font-bold tracking-widest text-white/30 uppercase bg-white/5 px-3 py-1 rounded-full border border-white/5">
                      {cert.year}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold mb-2 group-hover:text-zorvyn-blue transition-colors duration-300">
                    {cert.name}
                  </h3>
                  <p className="text-white/50 text-sm mb-8 font-medium">
                    {cert.issuer}
                  </p>

                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-2 text-xs font-bold text-zorvyn-blue/80 uppercase tracking-wider">
                      <Award size={14} />
                      Verified
                    </div>
                    <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-zorvyn-blue hover:border-zorvyn-blue/30 transition-all duration-300 group/btn">
                      <ExternalLink size={18} className="group-hover/btn:scale-110 transition-transform" />
                    </button>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -bottom-1 -right-1 w-24 h-24 bg-zorvyn-blue/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
