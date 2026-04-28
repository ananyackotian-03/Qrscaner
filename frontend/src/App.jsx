import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Scan from './pages/Scan';
import Prediction from './pages/Prediction';
import Dashboard from './pages/Dashboard';
import { Shield } from 'lucide-react';

const App = () => {
  const [currentStep, setCurrentStep] = useState('scan'); // scan, prediction, dashboard
  const [scanData, setScanData] = useState(null);
  const [sandboxData, setSandboxData] = useState(null);

  const handleScanComplete = (data) => {
    setScanData(data);
    setCurrentStep('prediction');
  };

  const handleSandboxComplete = (data) => {
    setSandboxData(data);
    setCurrentStep('dashboard');
  };

  const handleReset = () => {
    setScanData(null);
    setSandboxData(null);
    setCurrentStep('scan');
  };

  return (
    <div className="min-h-screen bg-cyber-black text-white selection:bg-cyber-blue selection:text-black">
      {/* Header */}
      <nav className="border-b border-white/5 bg-cyber-dark/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={handleReset}>
            <div className="w-8 h-8 bg-gradient-to-br from-cyber-blue to-cyber-purple rounded-lg flex items-center justify-center glow-blue">
               <Shield size={18} className="text-white" />
            </div>
            <span className="font-black tracking-tighter text-xl">QR ZERO-INTERACTION</span>
          </div>
          <div className="flex items-center gap-6">
            <div className={`text-[10px] font-bold tracking-widest ${currentStep === 'scan' ? 'text-cyber-blue' : 'text-white/20'}`}>01 SCAN</div>
            <div className={`text-[10px] font-bold tracking-widest ${currentStep === 'prediction' ? 'text-cyber-blue' : 'text-white/20'}`}>02 PREDICT</div>
            <div className={`text-[10px] font-bold tracking-widest ${currentStep === 'dashboard' ? 'text-cyber-blue' : 'text-white/20'}`}>03 REPORT</div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 pt-12 pb-24">
        <AnimatePresence mode="wait">
          {currentStep === 'scan' && (
            <motion.div
              key="scan"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Scan onScanComplete={handleScanComplete} />
            </motion.div>
          )}

          {currentStep === 'prediction' && (
            <motion.div
              key="prediction"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
            >
              <Prediction 
                scanData={scanData} 
                onSandboxComplete={handleSandboxComplete} 
              />
            </motion.div>
          )}

          {currentStep === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Dashboard 
                scanData={scanData} 
                sandboxData={sandboxData} 
                onReset={handleReset} 
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Background elements */}
      <div className="fixed bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-cyber-purple/5 to-transparent pointer-events-none -z-10" />
    </div>
  );
};

export default App;
