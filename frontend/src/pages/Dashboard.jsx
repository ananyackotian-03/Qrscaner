import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ShieldAlert, ShieldX, Info, ExternalLink, RefreshCw, FileText } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import AttackGraph from '../components/AttackGraph';

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = ({ scanData, sandboxData, onReset }) => {
  const finalScore = sandboxData?.final_score || scanData.pre_report.confidence;
  
  const getVerdict = () => {
    if (finalScore > 70) return { label: 'CRITICAL', color: 'text-cyber-red', icon: <ShieldX /> };
    if (finalScore > 30) return { label: 'SUSPICIOUS', color: 'text-yellow-400', icon: <ShieldAlert /> };
    return { label: 'SECURE', color: 'text-cyber-green', icon: <ShieldCheck /> };
  };

  const verdict = getVerdict();

  const chartData = {
    datasets: [{
      data: [finalScore, 100 - finalScore],
      backgroundColor: [
        finalScore > 70 ? '#ff003c' : finalScore > 30 ? '#fbbf24' : '#00ff41',
        'rgba(255, 255, 255, 0.05)'
      ],
      borderWidth: 0,
      circumference: 180,
      rotation: 270,
    }]
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tighter">THREAT INTELLIGENCE REPORT</h1>
          <p className="text-white/40 text-xs mt-1">SESSION ID: {scanData.id.toUpperCase()}</p>
        </div>
        <button onClick={onReset} className="cyber-button flex items-center gap-2">
          <RefreshCw size={16} /> NEW SCAN
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
        {/* Risk Score Gauge */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="cyber-card flex flex-col items-center justify-center relative overflow-hidden"
        >
          <div className="absolute top-4 left-4 flex items-center gap-2 opacity-40">
             <Info size={14} />
             <span className="text-[10px] font-bold uppercase">Aggregate Risk Score</span>
          </div>
          <div className="w-64 h-32 relative mt-8">
            <Doughnut data={chartData} options={{ cutout: '80%', plugins: { tooltip: { enabled: false } } }} />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
              <span className={`text-5xl font-black ${verdict.color}`}>{finalScore}</span>
              <p className="text-[10px] font-bold tracking-widest text-white/40 uppercase">THREAT LEVEL</p>
            </div>
          </div>
          <div className={`mt-8 px-6 py-2 rounded-full border ${verdict.color.replace('text', 'border')}/20 ${verdict.color.replace('text', 'bg')}/10 flex items-center gap-2`}>
             {verdict.icon}
             <span className="font-black tracking-widest text-sm">{verdict.label}</span>
          </div>
        </motion.div>

        {/* DNA vs Behavior */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="cyber-card xl:col-span-2"
        >
          <h2 className="text-xs font-bold tracking-widest text-white/40 uppercase mb-6 flex items-center gap-2">
            <FileText size={14} className="text-cyber-blue" /> Prediction vs Actual Comparison
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white/5 rounded border border-white/5">
              <span className="text-[10px] font-bold text-cyber-purple block mb-2">PREDICTED ATTACK</span>
              <p className="text-lg font-bold">{scanData.pre_report.predicted_attack}</p>
              <p className="text-xs text-white/40 mt-1 italic">Based on URL DNA profile</p>
            </div>
            <div className="p-4 bg-white/5 rounded border border-white/5">
              <span className="text-[10px] font-bold text-cyber-blue block mb-2">ACTUAL BEHAVIOR</span>
              <p className="text-lg font-bold">
                {sandboxData?.behaviors ? 
                  (sandboxData.behaviors.redirects.length > 0 ? 'ACTIVE REDIRECT' : 'STATIC CONTENT') 
                  : 'NOT OBSERVED'}
              </p>
              <p className="text-xs text-white/40 mt-1 italic">Observed in secure sandbox</p>
            </div>
          </div>
          
          <div className="mt-6 p-4 border border-cyber-blue/10 bg-cyber-blue/5 rounded">
            <p className="text-sm leading-relaxed">
              <span className="text-cyber-blue font-bold mr-2">STORY:</span>
              {sandboxData?.explanation_story || "Pre-analysis complete. URL appears low risk based on DNA signatures."}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Attack Graph and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
           <div className="cyber-card">
              <h2 className="text-xs font-bold tracking-widest text-white/40 uppercase mb-6">Attack Graph Visualization</h2>
              <AttackGraph scanData={scanData} sandboxData={sandboxData} />
           </div>

           <div className="cyber-card">
              <h2 className="text-xs font-bold tracking-widest text-white/40 uppercase mb-6">Redirect Chain</h2>
              <div className="space-y-2">
                 <div className="flex items-center gap-2 text-xs text-white/40 mb-4">
                    <ExternalLink size={12} /> Root URL: {scanData.url}
                 </div>
                 {sandboxData?.behaviors?.redirects?.map((hop, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 bg-white/5 rounded text-[10px] font-mono group">
                       <span className="w-4 h-4 flex items-center justify-center bg-cyber-blue/20 text-cyber-blue rounded text-[8px]">{i+1}</span>
                       <span className="truncate flex-1">{hop}</span>
                    </div>
                 ))}
                 {!sandboxData?.behaviors?.redirects?.length && (
                    <p className="text-xs text-white/20 italic">No redirects detected during execution.</p>
                 )}
              </div>
           </div>
        </div>

        <div className="space-y-8">
          <div className="cyber-card">
            <h2 className="text-xs font-bold tracking-widest text-white/40 uppercase mb-6">Sandbox Snapshot</h2>
            <div className="aspect-video bg-black rounded border border-white/10 overflow-hidden relative group">
              {sandboxData?.behaviors?.screenshot_path ? (
                <img 
                  src={`http://localhost:8000${sandboxData.behaviors.screenshot_path}`} 
                  alt="Sandbox Capture" 
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-white/20">
                  <ShieldCheck size={32} />
                  <span className="text-[10px] mt-2">NO SCREENSHOT TAKEN</span>
                </div>
              )}
            </div>
            <div className="mt-4 flex gap-2">
               <span className="text-[8px] bg-white/10 px-2 py-1 rounded">HEADLESS: ON</span>
               <span className="text-[8px] bg-white/10 px-2 py-1 rounded">JS_RENDER: ON</span>
            </div>
          </div>

          <div className="cyber-card">
            <h2 className="text-xs font-bold tracking-widest text-white/40 uppercase mb-6">Behavioral Metrics</h2>
            <div className="space-y-4">
               {[
                 { label: 'Scripts Detected', value: sandboxData?.behaviors?.scripts_detected || 0 },
                 { label: 'Forms Identified', value: sandboxData?.behaviors?.forms_found || 0 },
                 { label: 'Resource Requests', value: 24 }, // Mocked for UI
                 { label: 'DOM Nodes', value: 142 } // Mocked for UI
               ].map((metric, i) => (
                 <div key={i} className="flex justify-between items-end border-b border-white/5 pb-2">
                   <span className="text-[10px] text-white/40">{metric.label}</span>
                   <span className="font-bold text-cyber-blue font-mono">{metric.value}</span>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
