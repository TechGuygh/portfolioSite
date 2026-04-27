import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { SERVICES } from '../constants';
import { cn } from '../lib/utils';

function ServiceCard({ service, index }: { service: any, index: number }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-5deg", "5deg"]);
  
  // Parallax for the background image - moves opposite to the mouse
  const bgX = useTransform(mouseX, [-0.5, 0.5], ["-5%", "5%"]);
  const bgY = useTransform(mouseY, [-0.5, 0.5], ["-5%", "5%"]);

  function onMouseMove(event: React.MouseEvent) {
    const { currentTarget, clientX, clientY } = event;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    
    // Calculate normalized mouse position from -0.5 to 0.5
    const xPct = (clientX - left) / width - 0.5;
    const yPct = (clientY - top) / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  }

  function onMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="group relative p-8 rounded-2xl overflow-hidden glass-card h-full cursor-pointer perspective-1000"
    >
      {/* Background Image with Parallax */}
      <motion.div 
        style={{ x: bgX, y: bgY, scale: 1.1 }}
        className="absolute inset-0 z-0 opacity-10 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none"
      >
        <img 
          src={service.image} 
          alt="" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-zorvyn-black/60" />
      </motion.div>

      {/* Intensifying Glow Effect */}
      <div className={cn(
        "absolute -top-24 -right-24 w-64 h-64 rounded-full blur-[80px] transition-all duration-1000 group-hover:scale-150 group-hover:opacity-40 opacity-20",
        service.color === 'blue' ? "bg-zorvyn-blue" : "bg-zorvyn-purple"
      )} />
      
      <div className="relative z-10 h-full flex flex-col">
        <motion.div 
          style={{ translateZ: 50 }}
          className={cn(
            "w-14 h-14 rounded-xl flex items-center justify-center mb-8 border border-white/10 group-hover:border-white/20 transition-all duration-500",
            service.color === 'blue' 
              ? "bg-zorvyn-blue/10 text-zorvyn-blue group-hover:bg-zorvyn-blue/20" 
              : "bg-zorvyn-purple/10 text-zorvyn-purple group-hover:bg-zorvyn-purple/20"
          )}
        >
          <motion.div
            animate={{ 
              rotate: [0, 5, -5, 0],
              scale: [1, 1.1, 1.1, 1]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            whileHover={{ 
              rotate: [0, -15, 15, 0],
              scale: 1.2,
              transition: { duration: 0.5 }
            }}
          >
            <service.icon size={28} />
          </motion.div>
        </motion.div>
        
        <motion.h3 
          style={{ translateZ: 40 }}
          className="text-2xl font-bold mb-4 group-hover:text-white transition-colors"
        >
          {service.title}
        </motion.h3>
        <motion.p 
          style={{ translateZ: 30 }}
          className="text-white/50 leading-relaxed text-sm group-hover:text-white/70 transition-colors"
        >
          {service.description}
        </motion.p>
        
        {/* Subtle detail text for premium look */}
        <div className="mt-auto pt-8 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 text-[10px] uppercase tracking-widest text-zorvyn-blue font-bold">
          Learn More
          <div className="w-10 h-[1px] bg-zorvyn-blue/40" />
        </div>
      </div>

      {/* Animated bottom border */}
      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-zorvyn-blue to-zorvyn-purple group-hover:w-full transition-all duration-1000 ease-out" />
    </motion.div>
  );
}

export default function Services() {
  return (
    <section id="services" className="py-24 px-6 relative bg-zorvyn-black">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-zorvyn-blue/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-20"
        >
          <span className="text-[11px] uppercase tracking-[0.6em] text-zorvyn-blue mb-6 block font-bold">
            Areas of Expertise
          </span>
          <h2 className="text-4xl md:text-6xl font-bold mb-8 tracking-tight">
            Advanced <span className="text-white/20">Defensive Architecture</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-zorvyn-blue to-zorvyn-purple mx-auto mb-8 rounded-full" />
          <p className="text-white/40 max-w-3xl mx-auto text-lg font-light leading-relaxed">
            Protecting enterprise environments with a multi-layered approach to detection, 
            rapid response, and orchestrated security engineering.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map((service, i) => (
            <ServiceCard key={i} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
