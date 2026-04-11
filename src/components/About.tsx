import React from 'react';
import { motion } from 'motion/react';
import { STATS, KEY_SKILLS } from '../constants';
import profile1 from '../assets/profile1.png';

export default function About() {
  const [isSelected, setIsSelected] = React.useState(false);

  return (
    <section id="about" className="py-24 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="text-[10px] uppercase tracking-[0.4em] text-zorvyn-blue mb-4 block font-semibold">
                Professional Bio
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
                A Cybersecurity Mindset Built on <br />
                <span className="text-white/40">Analytical Thinking & Real-World Impact.</span>
              </h2>
              <p className="text-white/60 leading-relaxed mb-6 text-base">
                I started my career in IT Support, where I developed a strong foundation in system troubleshooting, network management, and user support.
              </p>
              <p className="text-white/60 leading-relaxed mb-10 text-sm">
                This experience sharpened my ability to identify system vulnerabilities and respond quickly to technical issues — skills that now enhance my effectiveness as a SOC Analyst.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-12">
                {STATS.map((stat, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 + i * 0.1 }}
                  >
                    <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-[9px] uppercase tracking-widest text-white/30">{stat.label}</div>
                  </motion.div>
                ))}
              </div>

              {/* Key Skills Section */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-[10px] uppercase tracking-[0.3em] text-zorvyn-blue mb-4 font-bold">Technical Proficiencies</h3>
                  <div className="flex flex-wrap gap-2.5">
                    {KEY_SKILLS.technical.map((skill, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 * i }}
                        className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl hover:border-zorvyn-blue/50 transition-colors group"
                      >
                        <skill.icon size={12} className="text-zorvyn-blue group-hover:scale-110 transition-transform" />
                        <span className="text-[11px] text-white/80 font-medium">{skill.name}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-[10px] uppercase tracking-[0.3em] text-zorvyn-purple mb-4 font-bold">Soft Skills</h3>
                  <div className="flex flex-wrap gap-2.5">
                    {KEY_SKILLS.soft.map((skill, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 * i }}
                        className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl hover:border-zorvyn-purple/50 transition-colors group"
                      >
                        <skill.icon size={12} className="text-zorvyn-purple group-hover:scale-110 transition-transform" />
                        <span className="text-[11px] text-white/80 font-medium">{skill.name}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 30 }}
              whileInView={{ opacity: 1, scale: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
            <div 
              className="aspect-square rounded-2xl overflow-hidden border border-white/10 relative group cursor-pointer"
              onClick={() => setIsSelected(!isSelected)}
            >
              <img
                src={profile1}
                alt="Emmanuel Aidoo"
                loading="lazy"
                className={`w-full h-full object-cover transition-all duration-700 ${isSelected ? 'grayscale-0' : 'grayscale hover:grayscale-0'}`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zorvyn-black via-transparent to-transparent opacity-60 pointer-events-none" />
            </div>
            {/* Decorative Elements */}
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-zorvyn-blue/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-zorvyn-purple/20 rounded-full blur-3xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
