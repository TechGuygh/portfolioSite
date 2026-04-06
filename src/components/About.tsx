import React from 'react';
import { motion } from 'motion/react';
import { STATS } from '../constants';

export default function About() {
  const [isSelected, setIsSelected] = React.useState(false);

  return (
    <section id="about" className="py-32 px-6 relative overflow-hidden">
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
              I started my career in IT Support, where I developed a strong foundation in system troubleshooting, network management, and user support.
            </p>
            <p className="text-white/60 leading-relaxed mb-12">
              This experience sharpened my ability to identify system vulnerabilities and respond quickly to technical issues — skills that now enhance my effectiveness as a SOC Analyst.
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
            <div 
              className="aspect-square rounded-3xl overflow-hidden border border-white/10 relative group cursor-pointer"
              onClick={() => setIsSelected(!isSelected)}
            >
              <img
                src="https://storage.googleapis.com/m-infra.appspot.com/public/res/ais/fbyrzk6swjzhjvmk6a2uaz/input_file_1.png"
                alt="Emmanuel Aidoo"
                className={`w-full h-full object-cover transition-all duration-700 ${isSelected ? 'grayscale-0' : 'grayscale hover:grayscale-0'}`}
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zorvyn-black via-transparent to-transparent opacity-60 pointer-events-none" />
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
