import React from 'react';
import { motion } from 'framer-motion';
import { QrCode, Globe, Cpu, AlertCircle } from 'lucide-react';

const AttackGraph = ({ scanData, sandboxData }) => {
  const nodes = [
    { id: 'qr', icon: <QrCode size={20} />, label: 'QR SCAN' },
    { id: 'url', icon: <Globe size={20} />, label: 'URL DATA' },
    { id: 'pre', icon: <Cpu size={20} />, label: 'PRE-ANALYSIS' },
    { id: 'san', icon: <AlertCircle size={20} />, label: 'SANDBOX' },
  ];

  return (
    <div className="relative h-64 flex items-center justify-between px-12 bg-black/20 rounded-xl border border-white/5 overflow-hidden">
      {/* Background connecting line */}
      <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/10 -translate-y-1/2 z-0" />
      
      {/* Animated active line */}
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{ duration: 2, ease: "easeInOut" }}
        className="absolute top-1/2 left-0 h-[1px] bg-gradient-to-r from-cyber-blue via-cyber-purple to-cyber-red -translate-y-1/2 z-10"
      />

      {nodes.map((node, i) => (
        <motion.div
          key={node.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.4 }}
          className="relative z-20 flex flex-col items-center"
        >
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center border-2 transition-colors duration-500 ${
            i <= 2 || sandboxData ? 'bg-cyber-dark border-cyber-blue shadow-[0_0_10px_rgba(0,240,255,0.3)]' : 'bg-cyber-gray border-white/10'
          }`}>
            <div className={i <= 2 || sandboxData ? 'text-cyber-blue' : 'text-white/20'}>
              {node.icon}
            </div>
          </div>
          <span className="mt-3 text-[10px] font-bold tracking-widest text-white/40 uppercase">
            {node.label}
          </span>
          
          {/* Status indicators for specific nodes */}
          {node.id === 'pre' && (
            <div className="absolute -top-4 text-[8px] text-cyber-purple font-mono bg-cyber-purple/10 px-1 rounded">
              DNA: {scanData.pre_report.metrics.entropy}
            </div>
          )}
          {node.id === 'san' && sandboxData?.behaviors?.redirects && (
             <div className="absolute -top-4 text-[8px] text-cyber-red font-mono bg-cyber-red/10 px-1 rounded">
                REDIRECTS: {sandboxData.behaviors.redirects.length}
             </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default AttackGraph;
