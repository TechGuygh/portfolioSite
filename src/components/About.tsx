import React from 'react';
import { motion } from 'motion/react';
import { STATS } from '../constants';

export default function About() {
  return (
    <section id="about" className="py-32 px-6 bg-zorvyn-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-xs uppercase tracking-[0.4em] text-zorvyn-blue mb-6 block font-semibold">
              Professional Bio
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
              A Cybersecurity Mindset Built on <br />
              <span className="text-white/40">Analytical Thinking & Real-World Impact.</span>
            </h2>
            <p className="text-white/60 leading-relaxed mb-8 text-lg">
              With several years of hands-on experience in high-pressure Security Operations Centers, I specialize in bridging the gap between complex threat data and actionable defense strategies.
            </p>
            <p className="text-white/60 leading-relaxed mb-12">
              My approach combines technical mastery of SIEM and SOAR platforms with a deep understanding of the adversary mindset, ensuring that every incident is not just handled, but learned from.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
              {STATS.map((stat, i) => (
                <div key={i}>
                  <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-[10px] uppercase tracking-widest text-white/30">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-square rounded-3xl overflow-hidden border border-white/10 relative group">
              <img
                src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000"
                alt="Emmanuel Aidoo"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zorvyn-black via-transparent to-transparent" />
            </div>
            {/* Decorative Elements */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-zorvyn-blue/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-zorvyn-purple/20 rounded-full blur-3xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
