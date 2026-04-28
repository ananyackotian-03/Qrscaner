import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Shield, Zap, AlertTriangle } from 'lucide-react';
import axios from 'axios';

const Scan = ({ onScanComplete }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileUpload = async (file) => {
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:8000/scan', formData);
      onScanComplete(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to scan QR code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl font-black mb-4 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-cyber-blue to-cyber-purple">
          ZERO-INTERACTION SCAN
        </h1>
        <p className="text-white/60 text-lg">Analyze and predict threat profiles before engagement.</p>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`w-full max-w-2xl cyber-card border-2 border-dashed cursor-pointer transition-colors ${
          isDragging ? 'border-cyber-blue bg-cyber-blue/5' : 'border-white/10'
        }`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (e.dataTransfer.files[0]) handleFileUpload(e.dataTransfer.files[0]);
        }}
        onClick={() => document.getElementById('qr-upload').click()}
      >
        <input 
          id="qr-upload" 
          type="file" 
          hidden 
          onChange={(e) => e.target.files[0] && handleFileUpload(e.target.files[0])} 
        />
        
        <div className="flex flex-col items-center py-12">
          {loading ? (
            <div className="relative">
              <div className="w-16 h-16 border-4 border-cyber-blue/20 border-t-cyber-blue rounded-full animate-spin" />
              <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-cyber-blue" size={24} />
            </div>
          ) : (
            <>
              <div className="w-20 h-20 bg-cyber-blue/10 rounded-full flex items-center justify-center mb-6 glow-blue">
                <Upload className="text-cyber-blue" size={32} />
              </div>
              <h2 className="text-2xl font-bold mb-2">Initialize Scanner</h2>
              <p className="text-white/40">Drag and drop or click to upload QR image</p>
            </>
          )}
        </div>
      </motion.div>

      {error && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="mt-6 flex items-center gap-2 text-cyber-red bg-cyber-red/10 px-4 py-2 rounded border border-cyber-red/20"
        >
          <AlertTriangle size={18} />
          <span>{error}</span>
        </motion.div>
      )}

      <div className="mt-16 grid grid-cols-3 gap-8 max-w-4xl w-full">
        {[
          { icon: <Shield size={20} />, title: "PRE-ANALYSIS", desc: "URL DNA profile matching" },
          { icon: <Zap size={20} />, title: "SANDBOX", desc: "Isolated browser execution" },
          { icon: <AlertTriangle size={20} />, title: "PREDICTION", desc: "Behavioral risk modeling" },
        ].map((feat, i) => (
          <div key={i} className="flex flex-col items-center text-center opacity-40 hover:opacity-100 transition-opacity">
            <div className="text-cyber-purple mb-2">{feat.icon}</div>
            <h3 className="text-xs font-bold tracking-widest uppercase mb-1">{feat.title}</h3>
            <p className="text-[10px] text-white/50">{feat.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Scan;
