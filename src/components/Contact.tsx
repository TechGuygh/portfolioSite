import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Linkedin, Send, CheckCircle } from 'lucide-react';

export default function Contact() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({ name: '', email: '', message: '' });

  const validate = () => {
    const newErrors = { name: '', email: '', message: '' };
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
      isValid = false;
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setStatus('loading');
      setErrorMessage('');
      
      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (response.ok) {
          setIsSubmitted(true);
          setStatus('success');
          setFormData({ name: '', email: '', message: '' });
          setTimeout(() => {
            setIsSubmitted(false);
            setStatus('idle');
          }, 5000);
        } else {
          setStatus('error');
          setErrorMessage(data.error || 'Failed to send message');
        }
      } catch (error) {
        console.error('Submission error:', error);
        setStatus('error');
        setErrorMessage('Network error. Please try again later.');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <section id="contact" className="py-32 px-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-zorvyn-blue/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
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
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
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

            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-white/40 ml-1">Name</label>
                  <input 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    type="text" 
                    className={`w-full bg-white/5 border rounded-2xl px-6 py-4 focus:outline-none transition-colors ${errors.name ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-zorvyn-blue'}`} 
                    placeholder="John Doe" 
                  />
                  {errors.name && <p className="text-[10px] text-red-500 ml-1">{errors.name}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-white/40 ml-1">Email</label>
                  <input 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    type="email" 
                    className={`w-full bg-white/5 border rounded-2xl px-6 py-4 focus:outline-none transition-colors ${errors.email ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-zorvyn-blue'}`} 
                    placeholder="john@example.com" 
                  />
                  {errors.email && <p className="text-[10px] text-red-500 ml-1">{errors.email}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-white/40 ml-1">Message</label>
                <textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4} 
                  className={`w-full bg-white/5 border rounded-2xl px-6 py-4 focus:outline-none transition-colors resize-none ${errors.message ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-zorvyn-blue'}`} 
                  placeholder="How can I help you?" 
                />
                {errors.message && <p className="text-[10px] text-red-500 ml-1">{errors.message}</p>}
              </div>
              
              {status === 'error' && (
                <p className="text-xs text-red-500 text-center bg-red-500/10 py-3 rounded-xl border border-red-500/20">
                  {errorMessage}
                </p>
              )}

              <button 
                type="submit" 
                disabled={status === 'loading'}
                className="w-full py-5 bg-white text-zorvyn-black font-bold rounded-2xl hover:bg-zorvyn-blue hover:text-white transition-all duration-500 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? (
                  <span className="flex items-center gap-2">
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-zorvyn-black border-t-transparent rounded-full"
                    />
                    Transmitting...
                  </span>
                ) : (
                  <>
                    Send Message <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
