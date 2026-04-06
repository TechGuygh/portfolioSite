import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Experience from './components/Experience';
import TechStack from './components/TechStack';
import Projects from './components/Projects';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import { Copy, Mail, Linkedin, ArrowUp, Send, Twitter, Facebook, MessageSquare, BookOpen } from 'lucide-react';

export default function App() {
  const [copied, setCopied] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-zorvyn-black text-white selection:bg-zorvyn-blue/30 selection:text-white overflow-x-hidden">
      <Navbar />
      
      <main>
        <Hero />
        <TechStack />
        <About />
        <Services />
        <Experience />
        <Projects />
        <Testimonials />
        <Contact />
        
        {/* Footer */}
        <footer className="py-12 px-6 bg-zorvyn-black border-t border-white/5">
          <div className="max-w-7xl mx-auto">
            {/* Top Footer Section */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-16">
              <div className="flex flex-col md:flex-row items-center gap-8 w-full lg:w-auto">
                <span className="text-sm font-medium text-white/80 whitespace-nowrap">Subscribe to Updates</span>
                <div className="relative w-full md:w-96">
                  <input 
                    type="email" 
                    placeholder="Enter your work email" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-sm focus:outline-none focus:border-zorvyn-blue transition-colors"
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-zorvyn-blue rounded-lg hover:bg-zorvyn-blue/80 transition-colors">
                    <Send size={18} className="text-white" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-8 flex-wrap justify-center">
                <div className="flex items-center gap-2 group cursor-pointer" onClick={() => {
                  navigator.clipboard.writeText('aidooemmanuel038@gmail.com');
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}>
                  <Mail size={18} className="text-zorvyn-blue" />
                  <span className="text-sm text-white/60 group-hover:text-white transition-colors">
                    {copied ? 'Copied!' : 'aidooemmanuel038@gmail.com'}
                  </span>
                </div>
                <a 
                  href="https://www.linkedin.com/in/emmanuel-aidoo038" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 group"
                >
                  <Linkedin size={18} className="text-zorvyn-blue" />
                  <span className="text-sm text-white/60 group-hover:text-white transition-colors">LinkedIn</span>
                </a>
                <a 
                  href="https://github.com/TechGuygh" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 group"
                >
                  <Copy size={18} className="text-zorvyn-blue" />
                  <span className="text-sm text-white/60 group-hover:text-white transition-colors">GitHub</span>
                </a>
                <a 
                  href="https://twitter.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 group"
                >
                  <Twitter size={18} className="text-zorvyn-blue" />
                  <span className="text-sm text-white/60 group-hover:text-white transition-colors">Twitter</span>
                </a>
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 group"
                >
                  <Facebook size={18} className="text-zorvyn-blue" />
                  <span className="text-sm text-white/60 group-hover:text-white transition-colors">Facebook</span>
                </a>
                <a 
                  href="https://discord.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 group"
                >
                  <MessageSquare size={18} className="text-zorvyn-blue" />
                  <span className="text-sm text-white/60 group-hover:text-white transition-colors">Discord</span>
                </a>
                <a 
                  href="https://medium.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 group"
                >
                  <BookOpen size={18} className="text-zorvyn-blue" />
                  <span className="text-sm text-white/60 group-hover:text-white transition-colors">Medium</span>
                </a>
              </div>
            </div>

            {/* Bottom Footer Section */}
            <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
              <p className="text-xs text-white/40">
                © 2026 Emmanuel Aidoo. All rights reserved.
              </p>
              
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-6 text-xs text-white/40">
                  <a href="#" className="hover:text-white transition-colors">Terms</a>
                  <span className="w-1 h-1 bg-white/20 rounded-full" />
                  <a href="#" className="hover:text-white transition-colors">Privacy</a>
                </div>
                
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
  );
}
