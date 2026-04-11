import React from 'react';
import { motion } from 'motion/react';
import { TESTIMONIALS } from '../constants';
import { Quote } from 'lucide-react';

export default function Testimonials() {
  return (
    <section className="py-24 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[10px] uppercase tracking-[0.4em] text-zorvyn-blue mb-4 block font-semibold">
            Trust
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Industry <span className="text-white/40">Recognition</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="p-8 glass-card rounded-2xl relative"
            >
              <Quote className="absolute top-6 right-6 text-white/5" size={48} />
              <p className="text-lg text-white/80 leading-relaxed mb-8 italic">
                "{t.content}"
              </p>
              <div className="flex items-center gap-3.5">
                {t.image ? (
                  <img 
                    src={t.image} 
                    alt={t.name} 
                    loading="lazy"
                    className="w-10 h-10 rounded-full object-cover border border-zorvyn-blue/20"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zorvyn-blue to-zorvyn-purple" />
                )}
                <div>
                  <div className="font-bold text-white text-sm">{t.name}</div>
                  <div className="text-[10px] text-white/40 uppercase tracking-widest">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
