import React from 'react';
import { motion } from 'motion/react';
import { TESTIMONIALS } from '../constants';
import { Quote } from 'lucide-react';

export default function Testimonials() {
  return (
    <section className="py-32 px-6 bg-zorvyn-black">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <span className="text-xs uppercase tracking-[0.4em] text-zorvyn-blue mb-4 block font-semibold">
            Trust
          </span>
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Industry <span className="text-white/40">Recognition</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="p-10 glass-card rounded-3xl relative"
            >
              <Quote className="absolute top-8 right-8 text-white/5" size={60} />
              <p className="text-xl text-white/80 leading-relaxed mb-10 italic">
                "{t.content}"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-zorvyn-blue to-zorvyn-purple" />
                <div>
                  <div className="font-bold text-white">{t.name}</div>
                  <div className="text-xs text-white/40 uppercase tracking-widest">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
