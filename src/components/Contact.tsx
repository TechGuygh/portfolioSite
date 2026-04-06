import React from 'react';
import { motion } from 'motion/react';
import { Mail, Linkedin, Send } from 'lucide-react';

export default function Contact() {
  return (
    <section id="contact" className="py-32 px-6 bg-zorvyn-dark relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-zorvyn-blue/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-xs uppercase tracking-[0.4em] text-zorvyn-blue mb-6 block font-semibold">
              Contact
            </span>
            <h2 className="text-5xl md:text-7xl font-bold mb-10 leading-tight">
              Let’s Secure <br />
              <span className="text-white/40">Your Systems.</span>
            </h2>
            <p className="text-white/50 text-lg mb-12 max-w-md">
              Ready to discuss how I can help fortify your digital infrastructure? Reach out via email or LinkedIn.
            </p>

            <div className="space-y-6">
              <a href="mailto:emmanuel@aidoo.security" className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-zorvyn-blue group-hover:text-white transition-all duration-300">
                  <Mail size={20} />
                </div>
                <span className="text-white/60 group-hover:text-white transition-colors">emmanuel@aidoo.security</span>
              </a>
              <a href="#" className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-zorvyn-blue group-hover:text-white transition-all duration-300">
                  <Linkedin size={20} />
                </div>
                <span className="text-white/60 group-hover:text-white transition-colors">linkedin.com/in/emmanuelaidoo</span>
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card p-10 rounded-3xl"
          >
            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-white/40 ml-1">Name</label>
                  <input type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-zorvyn-blue transition-colors" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-white/40 ml-1">Email</label>
                  <input type="email" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-zorvyn-blue transition-colors" placeholder="john@example.com" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-white/40 ml-1">Message</label>
                <textarea rows={4} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-zorvyn-blue transition-colors resize-none" placeholder="How can I help you?" />
              </div>
              <button type="submit" className="w-full py-5 bg-white text-zorvyn-black font-bold rounded-2xl hover:bg-zorvyn-blue hover:text-white transition-all duration-500 flex items-center justify-center gap-2 group">
                Send Message <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
