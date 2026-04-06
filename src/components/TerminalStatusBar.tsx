import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Wifi, Clock } from 'lucide-react';

export default function TerminalStatusBar() {
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-zorvyn-black/90 backdrop-blur-md border-t border-white/5 px-6 py-2">
      <div className="max-w-7xl mx-auto flex items-center justify-between text-[10px] font-mono tracking-widest text-white/40">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="uppercase">Live System Status: <span className="text-green-500">Secure</span></span>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <ShieldCheck size={12} className="text-zorvyn-blue" />
            <span className="uppercase">Threat Level: <span className="text-white/60">Low</span></span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-2">
            <Wifi size={12} />
            <span>ENCRYPTED_LINK_STABLE</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={12} />
            <span>{time} UTC</span>
          </div>
        </div>
      </div>
    </div>
  );
}
