import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Linkedin, Send, CheckCircle } from 'lucide-react';

export default function Contact() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 5000);
  };

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
              <a href="mailto:aidooemmanuel038@gmail.com" className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-zorvyn-blue group-hover:text-white transition-all duration-300">
                  <Mail size={20} />
                </div>
                <span className="text-white/60 group-hover:text-white transition-colors">aidooemmanuel038@gmail.com</span>
              </a>
              <a 
                href="https://www.linkedin.com/in/emmanuel-aidoo038" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-4 group"
              >
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-zorvyn-blue group-hover:text-white transition-all duration-300">
                  <Linkedin size={20} />
                </div>
                <span className="text-white/60 group-hover:text-white transition-colors">linkedin.com/in/emmanuel-aidoo038</span>
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card p-10 rounded-3xl relative"
          >
            <AnimatePresence>
              {isSubmitted && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-zorvyn-dark/95 backdrop-blur-md rounded-3xl p-10 text-center"
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ 
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                      delay: 0.1 
                    }}
                    className="w-24 h-24 rounded-full bg-zorvyn-blue/20 flex items-center justify-center mb-8 relative"
                  >
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 rounded-full bg-zorvyn-blue/10 scale-150 blur-xl"
                    />
                    <CheckCircle size={48} className="text-zorvyn-blue relative z-10" />
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h3 className="text-3xl font-bold mb-3 bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent">
                      Transmission Successful
                    </h3>
                    <p className="text-white/50 text-base max-w-[280px] mx-auto leading-relaxed">
                      Your message has been encrypted and sent. I'll respond through secure channels soon.
                    </p>
                  </motion.div>

                  <motion.button 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    onClick={() => setIsSubmitted(false)}
                    className="mt-10 px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] uppercase tracking-[0.2em] font-bold text-zorvyn-blue hover:bg-zorvyn-blue hover:text-white transition-all duration-300"
                  >
                    New Transmission
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-white/40 ml-1">Name</label>
                  <input required type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-zorvyn-blue transition-colors" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-white/40 ml-1">Email</label>
                  <input required type="email" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-zorvyn-blue transition-colors" placeholder="john@example.com" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-white/40 ml-1">Message</label>
                <textarea required rows={4} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-zorvyn-blue transition-colors resize-none" placeholder="How can I help you?" />
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
