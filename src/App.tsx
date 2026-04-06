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
import TerminalStatusBar from './components/TerminalStatusBar';
import { Copy } from 'lucide-react';

export default function App() {
  const [copied, setCopied] = useState(false);

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
        <footer className="py-20 px-6 bg-zorvyn-black border-t border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-12">
              <div className="text-left">
                <span className="text-[10px] uppercase tracking-[0.4em] text-zorvyn-blue mb-4 block font-semibold">
                  Direct Channel
                </span>
                <div className="flex items-center gap-4 group">
                  <a 
                    href="mailto:emmanuel.aidoo@example.com" 
                    className="text-2xl md:text-4xl font-bold hover:text-zorvyn-blue transition-colors duration-500"
                  >
                    emmanuel.aidoo@example.com
                  </a>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText('emmanuel.aidoo@example.com');
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="p-3 rounded-full bg-white/5 border border-white/10 hover:border-zorvyn-blue transition-all group-hover:glow-blue"
                    title="Copy to clipboard"
                  >
                    {copied ? <span className="text-[10px] text-green-500 font-bold px-2">COPIED</span> : <Copy size={16} className="text-white/40" />}
                  </button>
                </div>
              </div>
              
              <div className="flex gap-12">
                <div className="flex flex-col gap-4">
                  <span className="text-[10px] uppercase tracking-widest text-white/20 font-bold">Social</span>
                  <a href="#" className="text-sm hover:text-zorvyn-blue transition-colors">LinkedIn</a>
                  <a href="#" className="text-sm hover:text-zorvyn-blue transition-colors">GitHub</a>
                </div>
                <div className="flex flex-col gap-4">
                  <span className="text-[10px] uppercase tracking-widest text-white/20 font-bold">Location</span>
                  <span className="text-sm text-white/60">Remote / Global</span>
                </div>
              </div>
            </div>

            <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 text-[10px] uppercase tracking-[0.3em] text-white/20">
              <p>© 2026 Emmanuel Aidoo. All Rights Reserved.</p>
              <div className="flex gap-8">
                <a href="#" className="hover:text-zorvyn-blue transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-zorvyn-blue transition-colors">Terms of Service</a>
              </div>
            </div>
          </div>
        </footer>
      </main>

      <TerminalStatusBar />
    </div>
  );
}
