import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as d3 from 'd3';
import { feature } from 'topojson-client';
import { Shield, AlertCircle, Globe, Terminal, Activity, Zap } from 'lucide-react';
import { cn } from '../lib/utils';

// Simulated Threat Data
const MOCK_THREATS = [
  { id: 1, type: 'DDoS', origin: 'Beijing, China', target: 'Washington DC, USA', severity: 'High', status: 'Mitigated', coords: [[116.4, 39.9], [-77.0, 38.9]] },
  { id: 2, type: 'Malware Spreading', origin: 'Moscow, Russia', target: 'Frankfurt, Germany', severity: 'Critical', status: 'Active', coords: [[37.6, 55.8], [8.7, 50.1]] },
  { id: 3, type: 'SQL Injection', origin: 'Unknown (Tor)', target: 'London, UK', severity: 'Medium', status: 'Blocked', coords: [[0, 0], [-0.1, 51.5]] }, // Unknown origin
  { id: 4, type: 'Phishing Campaign', origin: 'Sao Paulo, Brazil', target: 'Lagos, Nigeria', severity: 'Low', status: 'Monitored', coords: [[-46.6, -23.5], [3.4, 6.5]] },
  { id: 5, type: 'Ransomware Outbreak', origin: 'Kyiv, Ukraine', target: 'New York, USA', severity: 'Critical', status: 'Active', coords: [[30.5, 50.5], [-74.0, 40.7]] },
];

const STATS = [
  { label: 'Live Threats', value: '142', icon: Activity, color: 'text-zorvyn-blue' },
  { label: 'Attacking IPs', value: '1,204', icon: Zap, color: 'text-zorvyn-purple' },
  { label: 'Detection Rate', value: '99.8%', icon: Shield, color: 'text-zorvyn-accent' },
];

export default function IntelReports() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [activeThreat, setActiveThreat] = useState<typeof MOCK_THREATS[0] | null>(null);
  const [currentThreatIndex, setCurrentThreatIndex] = useState(0);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 800;
    const height = 450;
    const svg = d3.select(svgRef.current)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    const projection = d3.geoMercator()
      .scale(120)
      .translate([width / 2, height / 1.5]);

    const path = d3.geoPath().projection(projection);

    // Fetch world data
    d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json').then((data: any) => {
      if (!data) return;
      const countries = feature(data, data.objects.countries);

      // Draw countries
      svg.append('g')
        .selectAll('path')
        .data((countries as any).features)
        .enter()
        .append('path')
        .attr('d', path as any)
        .attr('fill', '#0a0a0a')
        .attr('stroke', 'rgba(59, 130, 246, 0.15)')
        .attr('stroke-width', 0.5)
        .on('mouseover', function() {
          d3.select(this).attr('fill', '#1a1a1a').attr('stroke', 'rgba(59, 130, 246, 0.4)');
        })
        .on('mouseout', function() {
          d3.select(this).attr('fill', '#0a0a0a').attr('stroke', 'rgba(59, 130, 246, 0.15)');
        });

      // Simulation loop for arcs
      const drawArcs = () => {
        svg.selectAll('.attack-arc').remove();
        svg.selectAll('.attack-node').remove();

        MOCK_THREATS.forEach((threat) => {
          const start = projection(threat.coords[0] as [number, number]);
          const end = projection(threat.coords[1] as [number, number]);

          if (start && end) {
            // Draw origin and target points
            svg.append('circle')
              .attr('cx', start[0])
              .attr('cy', start[1])
              .attr('r', 2)
              .attr('fill', threat.severity === 'Critical' ? '#ff3e3e' : '#3b82f6')
              .attr('class', 'attack-node')
              .append('title').text(`Origin: ${threat.origin}`);

            svg.append('circle')
              .attr('cx', end[0])
              .attr('cy', end[1])
              .attr('r', 2)
              .attr('fill', '#8b5cf6')
              .attr('class', 'attack-node')
              .append('title').text(`Target: ${threat.target}`);

            // Draw arc
            const lineData: [number, number][] = [start, end];
            const line = d3.line().curve(d3.curveBundle.beta(1));
            
            const arcPath = svg.append('path')
              .attr('d', line(lineData))
              .attr('class', 'attack-arc')
              .attr('fill', 'none')
              .attr('stroke', threat.severity === 'Critical' ? 'rgba(255, 62, 62, 0.4)' : 'rgba(59, 130, 246, 0.4)')
              .attr('stroke-width', 1)
              .attr('stroke-dasharray', '5,5');

            // Pulse effect animation
            const totalLength = (arcPath.node() as any).getTotalLength();
            arcPath
              .attr('stroke-dasharray', totalLength + ' ' + totalLength)
              .attr('stroke-dashoffset', totalLength)
              .transition()
              .duration(3000)
              .ease(d3.easeLinear)
              .attr('stroke-dashoffset', 0)
              .on('end', function repeat() {
                 d3.select(this)
                   .attr('stroke-dashoffset', totalLength)
                   .transition()
                   .duration(3000)
                   .ease(d3.easeLinear)
                   .attr('stroke-dashoffset', 0)
                   .on('end', repeat);
              });
          }
        });
      };

      drawArcs();
    }).catch(err => {
      console.error('Failed to load world data:', err);
    });

    // Auto-cycle through threats for details view
    const interval = setInterval(() => {
      setCurrentThreatIndex((prev) => (prev + 1) % MOCK_THREATS.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setActiveThreat(MOCK_THREATS[currentThreatIndex]);
  }, [currentThreatIndex]);

  return (
    <section id="intel" className="py-24 px-6 relative overflow-hidden bg-zorvyn-black">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-zorvyn-blue/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-[10px] uppercase tracking-[0.6em] text-zorvyn-blue mb-4 block font-bold">
            Live Intelligence
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Global Threat <span className="text-white/20">Landscape</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-zorvyn-blue to-zorvyn-purple mx-auto mb-8 rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Visualization */}
          <div className="lg:col-span-2 glass-card rounded-3xl p-6 relative min-h-[400px] flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Globe className="text-zorvyn-blue animate-pulse" size={20} />
                <span className="text-sm font-semibold tracking-wider uppercase text-white/60">Live Attack Surface</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span className="text-[10px] uppercase text-red-500 font-bold tracking-tighter">Real-time Feed</span>
              </div>
            </div>

            <div className="flex-grow flex items-center justify-center">
              <svg ref={svgRef} className="w-full h-auto max-h-[500px]"></svg>
            </div>

            {/* Floating Active Threat Info */}
            <AnimatePresence mode="wait">
              {activeThreat && (
                <motion.div
                  key={activeThreat.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="absolute bottom-6 left-6 right-6 p-4 bg-zorvyn-black/80 backdrop-blur-md border border-white/10 rounded-2xl flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center",
                      activeThreat.severity === 'Critical' ? 'bg-red-500/20 text-red-500' : 'bg-zorvyn-blue/20 text-zorvyn-blue'
                    )}>
                      <AlertCircle size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold">{activeThreat.type}</h4>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest">
                        Origin: {activeThreat.origin} → Target: {activeThreat.target}
                      </p>
                    </div>
                  </div>
                  <div className="hidden sm:flex items-center gap-3">
                    <span className={cn(
                      "text-[10px] px-2 py-1 rounded-md font-bold uppercase",
                      activeThreat.severity === 'Critical' ? 'bg-red-500/10 text-red-500' : 'bg-zorvyn-blue/10 text-zorvyn-blue'
                    )}>
                      {activeThreat.severity}
                    </span>
                    <span className="text-[10px] text-white/30 uppercase tracking-widest font-bold">
                      {activeThreat.status}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Side Panels */}
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              {STATS.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card rounded-2xl p-6 flex items-center gap-4 group"
                >
                  <div className={cn("p-3 rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors", stat.color)}>
                    <stat.icon size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-white/30 mb-1">{stat.label}</p>
                    <p className="text-xl font-bold">{stat.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Intel Report List */}
            <div className="glass-card rounded-3xl p-6 flex-grow ">
              <div className="flex items-center gap-3 mb-6">
                <Terminal className="text-zorvyn-purple" size={18} />
                <span className="text-xs font-bold uppercase tracking-widest text-white/60">Forensic Logs</span>
              </div>
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10">
                {MOCK_THREATS.map((threat, i) => (
                  <div 
                    key={threat.id} 
                    className={cn(
                      "p-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/5 transition-all cursor-pointer",
                      currentThreatIndex === i ? "border-zorvyn-blue/50 bg-zorvyn-blue/5" : ""
                    )}
                    onClick={() => setCurrentThreatIndex(i)}
                  >
                    <div className="flex justify-between items-start mb-2">
                       <span className="text-[10px] font-mono text-zorvyn-blue">0x{threat.id}A-F9</span>
                       <span className={cn(
                         "text-[8px] font-bold uppercase py-0.5 px-1.5 rounded",
                         threat.severity === 'Critical' ? 'bg-red-500/10 text-red-500' : 'bg-white/10 text-white/40'
                       )}>
                         {threat.severity}
                       </span>
                    </div>
                    <p className="text-xs font-bold mb-1">{threat.type}</p>
                    <p className="text-[9px] text-white/40 font-mono underline decoration-zorvyn-blue/30 underline-offset-2">
                      Logged from {threat.origin}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
