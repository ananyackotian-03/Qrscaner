import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ShieldAlert, Cpu, Network, ArrowRight, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

const Prediction = ({ scanData, onSandboxComplete }) => {
  const { url, risk_level, pre_report } = scanData;
  const [isSandboxing, setIsSandboxing] = useState(false);
  const [status, setStatus] = useState("Awaiting sandbox authorization...");

  useEffect(() => {
    if (risk_level !== "LOW") {
      runSandbox();
    }
  }, []);

  const runSandbox = async () => {
    setIsSandboxing(true);
    setStatus("Initializing isolated browser...");
    try {
      await new Promise(r => setTimeout(r, 1500)); // UX delay
      setStatus("Simulating human behavior & tracking redirects...");
      const response = await axios.post(`http://localhost:8000/sandbox?url=${encodeURIComponent(url)}&risk_level=${risk_level}`);
      onSandboxComplete(response.data);
    } catch (err) {
      console.error(err);
      setStatus("Sandbox error. Finalizing report...");
    } finally {
      setIsSandboxing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: DNA Analysis */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="cyber-card"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-cyber-purple/20 rounded-lg">
              <Activity className="text-cyber-purple" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">DNA PRE-ANALYSIS</h2>
              <p className="text-white/40 text-sm">Non-interactive profile generated</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-center p-4 bg-white/5 rounded border border-white/5">
              <span className="text-white/60">Entropy Score</span>
              <span className="text-cyber-blue font-bold text-lg">{pre_report.metrics.entropy}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-white/5 rounded border border-white/5">
              <span className="text-white/60">Risk Prediction</span>
              <span className={`font-bold px-3 py-1 rounded text-sm ${
                risk_level === 'HIGH' ? 'bg-cyber-red/20 text-cyber-red border border-cyber-red/30' :
                risk_level === 'MEDIUM' ? 'bg-cyber-warning/20 text-yellow-400 border border-yellow-400/30' :
                'bg-cyber-green/20 text-cyber-green border border-cyber-green/30'
              }`}>
                {risk_level} RISK
              </span>
            </div>
            
            <div>
              <h3 className="text-xs font-bold text-white/40 mb-3 tracking-widest uppercase">Anomalies Detected</h3>
              <div className="space-y-2">
                {pre_report.reasons.map((reason, i) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={i} 
                    className="flex items-start gap-2 text-sm text-white/70"
                  >
                    <ShieldAlert size={16} className="text-cyber-red mt-1 shrink-0" />
                    <span>{reason}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right: Sandbox Status */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col gap-8"
        >
          <div className="cyber-card flex-1">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-cyber-blue/20 rounded-lg">
                <Cpu className="text-cyber-blue" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">SANDBOX ENGINE</h2>
                <p className="text-white/40 text-sm">Dynamic behavioral execution</p>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center h-48 border border-white/5 rounded-xl bg-black/40 relative overflow-hidden">
              <AnimatePresence mode="wait">
                {isSandboxing ? (
                  <motion.div 
                    key="scanning"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="flex flex-col items-center"
                  >
                    <div className="w-12 h-12 border-2 border-cyber-blue border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="text-cyber-blue text-sm font-bold animate-pulse">{status}</p>
                  </motion.div>
                ) : risk_level === "LOW" ? (
                  <motion.div 
                    key="skipped"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="flex flex-col items-center text-cyber-green"
                  >
                    <CheckCircle2 size={48} className="mb-4" />
                    <p className="font-bold">SANDBOX SKIPPED (LOW RISK)</p>
                    <button 
                      onClick={onSandboxComplete}
                      className="mt-4 text-xs underline opacity-50 hover:opacity-100"
                    >
                      Generate Final Report Anyway
                    </button>
                  </motion.div>
                ) : (
                  <motion.div key="ready" className="text-white/40 text-sm italic">
                    Analysis complete. Synthesizing results...
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="mt-8 space-y-4">
               <div className="flex items-center gap-3 text-sm opacity-50">
                  <Network size={16} />
                  <span>Intercepting network traffic...</span>
               </div>
               <div className="flex items-center gap-3 text-sm opacity-50">
                  <Activity size={16} />
                  <span>Monitoring DOM mutations...</span>
               </div>
            </div>
          </div>

          {risk_level === "LOW" && (
            <motion.button
              whileHover={{ x: 5 }}
              onClick={() => onSandboxComplete({ message: "Low risk bypass", final_score: 5, explanation_story: "Safe URL detected by pre-analyzer." })}
              className="cyber-card py-4 flex items-center justify-between group"
            >
              <span className="font-bold tracking-widest text-cyber-blue">PROCEED TO DASHBOARD</span>
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Prediction;
