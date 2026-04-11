import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, X, ChevronLeft, ChevronRight, Maximize2, Calendar, Building2, Fingerprint } from 'lucide-react';
import { CERTIFICATIONS } from '../constants';
import { cn } from '../lib/utils';

export default function Certifications() {
  const [selectedCertIndex, setSelectedCertIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setSelectedCertIndex(index);
  const closeLightbox = () => setSelectedCertIndex(null);

  const nextCert = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedCertIndex !== null) {
      setSelectedCertIndex((selectedCertIndex + 1) % CERTIFICATIONS.length);
    }
  };

  const prevCert = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedCertIndex !== null) {
      setSelectedCertIndex((selectedCertIndex - 1 + CERTIFICATIONS.length) % CERTIFICATIONS.length);
    }
  };

  return (
    <section id="certifications" className="py-32 px-6 relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-zorvyn-blue/5 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-zorvyn-blue text-xs font-bold uppercase tracking-[0.4em] mb-4 block">
              Verified Credentials
            </span>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Certifications & <span className="text-white/40">Achievements</span>
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto text-lg">
              Professional milestones and industry-recognized standards validating expertise in cybersecurity and IT operations.
            </p>
          </motion.div>
        </div>

        {/* Grid Gallery */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {CERTIFICATIONS.map((cert, index) => (
            <motion.div
              key={cert.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              onClick={() => openLightbox(index)}
              className="group relative aspect-[4/5] rounded-3xl overflow-hidden cursor-pointer bg-white/5 border border-white/10"
            >
              {/* Image Container */}
              <div className="absolute inset-0">
                <motion.img
                  src={cert.image}
                  alt={cert.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-zorvyn-black via-zorvyn-black/40 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />
              </div>

              {/* Content Overlay */}
              <div className="absolute inset-0 p-8 flex flex-col justify-end translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <div className="flex items-center gap-2 text-zorvyn-blue mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                  <Award size={16} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">{cert.issuer}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-zorvyn-blue transition-colors duration-300">
                  {cert.title}
                </h3>
                <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                  <span className="text-white/40 text-xs font-medium">{cert.year}</span>
                  <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/60 group-hover:text-white transition-colors">
                    <Maximize2 size={18} />
                  </div>
                </div>
              </div>

              {/* Glass Border Effect */}
              <div className="absolute inset-0 border border-white/10 rounded-3xl pointer-events-none group-hover:border-zorvyn-blue/30 transition-colors duration-500" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedCertIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-zorvyn-black/95 backdrop-blur-2xl"
            onClick={closeLightbox}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-6xl w-full max-h-[90vh] flex flex-col md:flex-row gap-8 bg-[#0a0a0a] rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closeLightbox}
                className="absolute top-6 right-6 z-20 p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white/60 hover:text-white transition-all duration-300"
              >
                <X size={24} />
              </button>

              {/* Image Section */}
              <div className="relative flex-1 bg-black/40 flex items-center justify-center overflow-hidden group/modal">
                <img
                  src={CERTIFICATIONS[selectedCertIndex].image}
                  alt={CERTIFICATIONS[selectedCertIndex].title}
                  className="w-full h-full object-contain p-4 md:p-12"
                  referrerPolicy="no-referrer"
                />
                
                {/* Navigation Buttons */}
                <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
                  <button
                    onClick={prevCert}
                    className="p-4 bg-black/40 backdrop-blur-md border border-white/10 rounded-full text-white/60 hover:text-white hover:bg-zorvyn-blue/20 transition-all duration-300 pointer-events-auto"
                  >
                    <ChevronLeft size={28} />
                  </button>
                  <button
                    onClick={nextCert}
                    className="p-4 bg-black/40 backdrop-blur-md border border-white/10 rounded-full text-white/60 hover:text-white hover:bg-zorvyn-blue/20 transition-all duration-300 pointer-events-auto"
                  >
                    <ChevronRight size={28} />
                  </button>
                </div>
              </div>

              {/* Details Section */}
              <div className="w-full md:w-[400px] p-8 md:p-12 flex flex-col border-t md:border-t-0 md:border-l border-white/5">
                <div className="mb-10">
                  <div className="flex items-center gap-3 text-zorvyn-blue mb-6">
                    <Award size={24} className="glow-blue" />
                    <span className="text-xs font-bold uppercase tracking-[0.3em]">Official Credential</span>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4 leading-tight">
                    {CERTIFICATIONS[selectedCertIndex].title}
                  </h3>
                  <div className="flex items-center gap-2 text-white/40 text-sm mb-8">
                    <Building2 size={16} />
                    <span>{CERTIFICATIONS[selectedCertIndex].issuer}</span>
                  </div>
                </div>

                <div className="space-y-8 flex-grow">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zorvyn-blue">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-white/30 block mb-1 font-bold">Issue Date</span>
                      <span className="text-white font-medium">{CERTIFICATIONS[selectedCertIndex].year}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zorvyn-blue">
                      <Fingerprint size={20} />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-white/30 block mb-1 font-bold">Credential ID</span>
                      <code className="text-zorvyn-blue font-mono text-sm">{CERTIFICATIONS[selectedCertIndex].credentialId}</code>
                    </div>
                  </div>
                </div>

                <div className="mt-12 pt-8 border-t border-white/5">
                  <button className="w-full py-4 bg-white text-zorvyn-black font-bold rounded-2xl hover:bg-zorvyn-blue hover:text-white transition-all duration-500 text-xs uppercase tracking-widest shadow-xl">
                    Verify Credential
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
