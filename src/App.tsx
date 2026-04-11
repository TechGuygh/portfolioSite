import React, { useState } from 'react';
import { motion } from 'motion/react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Experience from './components/Experience';
import Volunteering from './components/Volunteering';
import Certifications from './components/Certifications';
import TechStack from './components/TechStack';
import Projects from './components/Projects';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import { Copy, ArrowUp, Send, Twitter, Facebook, MessageSquare, BookOpen } from 'lucide-react';

export default function App() {
  const [copied, setCopied] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-zorvyn-black text-white selection:bg-zorvyn-blue/30 selection:text-white overflow-x-hidden relative">
      {/* Global Background Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ 
            scale: [1, 1.5, 1],
            x: [0, 200, 0],
            y: [0, 100, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[20%] -right-[10%] w-[80%] h-[80%] bg-zorvyn-purple/25 rounded-full blur-[150px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1.5, 1, 1.5],
            x: [0, -200, 0],
            y: [0, -100, 0]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-[20%] -left-[10%] w-[80%] h-[80%] bg-zorvyn-blue/20 rounded-full blur-[150px]" 
        />
        <motion.div 
          animate={{ 
            opacity: [0.2, 0.4, 0.2],
            scale: [1, 1.3, 1]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] h-[100%] bg-zorvyn-accent/15 rounded-full blur-[200px]" 
        />
        <div className="absolute inset-0 bg-zorvyn-black/50" />
      </div>

      <div className="relative z-10">
        <Navbar />
        
        <main>
        <Hero />
        <TechStack />
        <About />
        <Services />
        <Experience />
        <Volunteering />
        <Certifications />
        <Projects />
        <Testimonials />
        <Contact />
        
        {/* Footer */}
        <footer className="py-12 px-6 border-t border-white/5 relative z-10">
          <div className="max-w-7xl mx-auto">
            {/* Top Footer Section */}
            <div className="flex flex-col items-center justify-between gap-8 mb-12">
              <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 flex-wrap justify-center">
                <a 
                  href="https://github.com/TechGuygh" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 group relative"
                >
                  <Copy size={18} className="text-zorvyn-blue" />
                  <span className="text-sm text-white/60 group-hover:text-white transition-colors">GitHub</span>
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-zorvyn-blue text-white text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    GitHub
                  </div>
                </a>
                <a 
                  href="https://twitter.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 group relative"
                >
                  <Twitter size={18} className="text-zorvyn-blue" />
                  <span className="text-sm text-white/60 group-hover:text-white transition-colors">Twitter</span>
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-zorvyn-blue text-white text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    Twitter
                  </div>
                </a>
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 group relative"
                >
                  <Facebook size={18} className="text-zorvyn-blue" />
                  <span className="text-sm text-white/60 group-hover:text-white transition-colors">Facebook</span>
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-zorvyn-blue text-white text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    Facebook
                  </div>
                </a>
                <a 
                  href="https://discord.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 group relative"
                >
                  <MessageSquare size={18} className="text-zorvyn-blue" />
                  <span className="text-sm text-white/60 group-hover:text-white transition-colors">Discord</span>
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-zorvyn-blue text-white text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    Discord
                  </div>
                </a>
                <a 
                  href="https://medium.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 group relative"
                >
                  <BookOpen size={18} className="text-zorvyn-blue" />
                  <span className="text-sm text-white/60 group-hover:text-white transition-colors">Medium</span>
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-zorvyn-blue text-white text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    Medium
                  </div>
                </a>
              </div>
            </div>

            {/* Bottom Footer Section */}
            <div className="pt-8 border-t border-white/5 flex flex-col items-center justify-center gap-6 text-center">
              <p className="text-xs text-white/40 p-0">
                © 2026 Emmanuel Aidoo. All rights reserved.
              </p>
              
              <div className="flex items-center gap-8">
                <button 
                  onClick={scrollToTop}
                  className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors group"
                >
                  <ArrowUp size={20} className="text-white/60 group-hover:text-white transition-transform group-hover:-translate-y-1" />
                </button>
              </div>
            </div>
          </div>
        </footer>
      </main>
      </div>
    </div>
  );
}
