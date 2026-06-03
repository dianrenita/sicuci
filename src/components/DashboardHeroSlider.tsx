import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Wind, 
  Activity, 
  Award, 
  Smile, 
  ShieldCheck, 
  Layers, 
  Database,
  ArrowRight,
  Droplet,
  Smartphone,
  CheckCircle,
  Clock,
  Play,
  Pause,
  RotateCw,
  Compass,
  Zap
} from 'lucide-react';

interface SlideItem {
  id: number;
  title: string;
  subtitle: string;
  badge: {
    text: string;
    icon: React.ReactNode;
    colorClass: string;
  };
  description: string;
  accentColor: string;
  bgGradient: string;
}

export const DashboardHeroSlider: React.FC = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  
  // Interactive States for Slide 1 (Washing machine)
  const [washCycle, setWashCycle] = useState<'soap' | 'rinse' | 'spin'>('soap');
  const [spinSpeed, setSpinSpeed] = useState<number>(3); // 1 = slow, 3 = regular, 5 = turbo
  const [isWashingActive, setIsWashingActive] = useState(true);

  // Interactive States for Slide 2 (Branch Nodes)
  const [selectedBranchNode, setSelectedBranchNode] = useState<'ID-JKT' | 'ID-BDG' | 'ID-SUB'>('ID-JKT');
  const [pingLatency, setPingLatency] = useState<number>(14);
  const [isPinging, setIsPinging] = useState(false);

  // Interactive States for Slide 3 (Fragrance Aroma-Mist)
  const [selectedAroma, setSelectedAroma] = useState<'sakura' | 'lavender' | 'ocean'>('sakura');

  // Slide content data
  const slides: SlideItem[] = [
    {
      id: 0,
      title: "Smart Laundry Workflow Engine",
      subtitle: "REAL-TIME MONITORING",
      badge: {
        text: "WORKFLOW AUTOMATION",
        icon: <RotateCw size={12} className="animate-spin-slow" />,
        colorClass: "bg-blue-600 text-white"
      },
      description: "Mesin optimasi AI melacak cucian dari masuk timbangan, pencucian, pemutaran sentrifugal, penyetrikaan uap hingga pengantaran kurir.",
      accentColor: "blue",
      bgGradient: "from-slate-900 via-blue-950 to-slate-900"
    },
    {
      id: 1,
      title: "Komando Multi-Cabang Instan",
      subtitle: "REAL-TIME SYNC",
      badge: {
        text: "CLOUD SYNCHRONIZATION",
        icon: <Database size={12} />,
        colorClass: "bg-teal-600 text-white"
      },
      description: "Teknologi database terdistribusi menjaga keselarasan kas kasir, stok deterjen, dan log aktivitas operator di semua outlet secara live.",
      accentColor: "teal",
      bgGradient: "from-slate-900 via-teal-950 to-slate-900"
    },
    {
      id: 2,
      title: "Aroma Premium & Serat Eco-Care",
      subtitle: "PREMIUM EXPERIENCE",
      badge: {
        text: "WANGI MEWAH & RAMAH LINGKUNGAN",
        icon: <Sparkles size={12} />,
        colorClass: "bg-pink-600 text-white"
      },
      description: "Formula konsentrat biodegradable dan wewangian premium bersertifikasi untuk keharuman tahan hingga 14 hari tanpa merusak serat kain.",
      accentColor: "pink",
      bgGradient: "from-slate-900 via-pink-950 to-slate-900"
    }
  ];

  // Auto scroll effect
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [isPlaying, slides.length]);

  // Simulated ping rate fluctuation
  useEffect(() => {
    if (activeSlide !== 1) return;
    const interval = setInterval(() => {
      setPingLatency(() => Math.floor(8 + Math.random() * 15));
    }, 2500);
    return () => clearInterval(interval);
  }, [activeSlide]);

  const handleManualNav = (idx: number) => {
    setActiveSlide(idx);
    setIsPlaying(false); // Pause autoplay on manual interaction
  };

  const handlePingBranch = (branch: 'ID-JKT' | 'ID-BDG' | 'ID-SUB') => {
    setSelectedBranchNode(branch);
    setIsPinging(true);
    setTimeout(() => {
      setIsPinging(false);
    }, 6000);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-slate-950 border border-slate-800 text-white shadow-xl">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.1),transparent_70%)] pointer-events-none" />
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      
      {/* Absolute top bar with status controls */}
      <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          title={isPlaying ? "Jeda Rotasi" : "Mainkan Rotasi"}
          className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white transition"
          id="btn-play-pause-slider"
        >
          {isPlaying ? <Pause size={14} /> : <Play size={14} />}
        </button>
      </div>

      <div className="relative min-h-[460px] md:min-h-[400px] flex flex-col justify-between">
        
        {/* Carousel Slide Area */}
        <div className="grid md:grid-cols-12 gap-8 p-6 md:p-8 items-center flex-grow">
          
          {/* Main Content Side - Left (Col 7) */}
          <div className="md:col-span-7 space-y-5 relative z-10 flex flex-col justify-center h-full">
            
            <div className="flex flex-wrap gap-2 items-center">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[10px] uppercase font-black tracking-widest rounded-full ${slides[activeSlide].badge.colorClass}`}>
                {slides[activeSlide].badge.icon}
                {slides[activeSlide].badge.text}
              </span>
              <span className="text-[10px] font-mono tracking-widest text-slate-400 font-bold uppercase">
                {slides[activeSlide].subtitle}
              </span>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl md:text-4xl font-extrabold font-display leading-tight tracking-tight text-white drop-shadow-sm">
                {slides[activeSlide].title}
              </h1>
              <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-xl font-medium">
                {slides[activeSlide].description}
              </p>
            </div>

            {/* Quick Live Interactive Options inside Left Panel to make it look highly professional */}
            <div className="pt-2 border-t border-slate-800/80">
              {activeSlide === 0 && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider flex items-center gap-1">
                      <Zap size={11} className="text-amber-400 animate-pulse" /> Simulasi Putaran Drum Pencuci
                    </span>
                    <span className="text-[10px] font-mono font-bold text-blue-400 bg-blue-950/80 border border-blue-900 px-2 py-0.5 rounded">
                      {isWashingActive ? `${spinSpeed * 250} RPM Active` : 'Idle'}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    <button
                      onClick={() => { setIsWashingActive(!isWashingActive); }}
                      className={`px-3 py-2 text-center rounded-xl text-[10px] font-bold transition uppercase ${
                        !isWashingActive 
                          ? 'bg-red-600/30 border border-red-500 text-red-200' 
                          : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                      }`}
                      id="btn-toggle-washer-sim"
                    >
                      {isWashingActive ? "Matikan" : "Nyalakan"}
                    </button>
                    <button
                      onClick={() => { setSpinSpeed(2); setIsWashingActive(true); }}
                      className={`px-2 py-2 text-center rounded-xl text-[10px] font-bold transition ${
                        spinSpeed === 2 && isWashingActive
                          ? 'bg-blue-600/20 border border-blue-500 text-blue-300' 
                          : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:bg-slate-800'
                      }`}
                      id="btn-spin-speed-slow"
                    >
                      Gentle (Slow)
                    </button>
                    <button
                      onClick={() => { setSpinSpeed(3); setIsWashingActive(true); }}
                      className={`px-2 py-2 text-center rounded-xl text-[10px] font-bold transition ${
                        spinSpeed === 3 && isWashingActive
                          ? 'bg-blue-600/20 border border-blue-500 text-blue-300' 
                          : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:bg-slate-800'
                      }`}
                      id="btn-spin-speed-regular"
                    >
                      Medium
                    </button>
                    <button
                      onClick={() => { setSpinSpeed(5); setIsWashingActive(true); }}
                      className={`px-2 py-2 text-center rounded-xl text-[10px] font-bold transition ${
                        spinSpeed === 5 && isWashingActive
                          ? 'bg-amber-600/20 border border-amber-500 text-amber-300' 
                          : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:bg-slate-800'
                      }`}
                      id="btn-spin-speed-turbo"
                    >
                      Turbo Spin
                    </button>
                  </div>
                </div>
              )}

              {activeSlide === 1 && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider flex items-center gap-1">
                      <Activity size={11} className="text-teal-400" /> Ping Sync Latency Seluruh Cabang
                    </span>
                    <span className="text-[10px] font-mono font-bold text-teal-400">
                      Sync: <span className="text-white">{pingLatency} ms</span> {isPinging ? '(Pinging...)' : '(Stabil)'}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handlePingBranch('ID-JKT')}
                      className={`px-3 py-1.5 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1 border transition ${
                        selectedBranchNode === 'ID-JKT'
                          ? 'bg-teal-600/20 border-teal-500 text-teal-200'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-900'
                      }`}
                      id="btn-ping-branch-jkt"
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${selectedBranchNode === 'ID-JKT' ? 'bg-teal-400 animate-ping' : 'bg-slate-500'}`} />
                      Outlet A (Bdg)
                    </button>
                    <button
                      onClick={() => handlePingBranch('ID-BDG')}
                      className={`px-3 py-1.5 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1 border transition ${
                        selectedBranchNode === 'ID-BDG'
                          ? 'bg-teal-600/20 border-teal-500 text-teal-200'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-900'
                      }`}
                      id="btn-ping-branch-bdg"
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${selectedBranchNode === 'ID-BDG' ? 'bg-teal-400 animate-ping' : 'bg-slate-500'}`} />
                      Outlet B (Jkt)
                    </button>
                    <button
                      onClick={() => handlePingBranch('ID-SUB')}
                      className={`px-3 py-1.5 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1 border transition ${
                        selectedBranchNode === 'ID-SUB'
                          ? 'bg-teal-600/20 border-teal-500 text-teal-200'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-900'
                      }`}
                      id="btn-ping-branch-sub"
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${selectedBranchNode === 'ID-SUB' ? 'bg-teal-400 animate-ping' : 'bg-slate-500'}`} />
                      Outlet C (Sby)
                    </button>
                  </div>
                </div>
              )}

              {activeSlide === 2 && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider flex items-center gap-1">
                      <Droplet size={11} className="text-pink-400 animate-bounce" /> Eksperimen Wewangian Finisher
                    </span>
                    <span className="text-[10px] font-semibold text-pink-300">
                      Scent Aura: <strong className="text-white uppercase font-black">{selectedAroma}</strong>
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setSelectedAroma('sakura')}
                      className={`px-2 py-1.5 rounded-xl text-[10px] font-bold border transition ${
                        selectedAroma === 'sakura'
                          ? 'bg-pink-600/20 border-pink-500 text-pink-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-950'
                      }`}
                      id="btn-aroma-sakura"
                    >
                      🌸 Sakura Blossom
                    </button>
                    <button
                      onClick={() => setSelectedAroma('lavender')}
                      className={`px-2 py-1.5 rounded-xl text-[10px] font-bold border transition ${
                        selectedAroma === 'lavender'
                          ? 'bg-purple-600/20 border-purple-500 text-purple-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-950'
                      }`}
                      id="btn-aroma-lavender"
                    >
                      🪻 Pure Lavender
                    </button>
                    <button
                      onClick={() => setSelectedAroma('ocean')}
                      className={`px-2 py-1.5 rounded-xl text-[10px] font-bold border transition ${
                        selectedAroma === 'ocean'
                          ? 'bg-cyan-600/20 border-cyan-500 text-cyan-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-950'
                      }`}
                      id="btn-aroma-ocean"
                    >
                      🌊 Ocean Breezy
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Interactive Illustration Area - Right (Col 5) */}
          <div className="md:col-span-5 flex items-center justify-center relative min-h-[180px] md:min-h-[220px]">
            
            {/* Slide 1 Illustration (Washing Machine Engine) */}
            {activeSlide === 0 && (
              <div className="relative w-full max-w-[200px] h-[200px] flex items-center justify-center">
                
                {/* Background wash glow aura */}
                <div className={`absolute inset-0 rounded-full blur-3xl transition-all duration-700 ${
                  isWashingActive ? 'bg-blue-500/20 scale-110' : 'bg-indigo-500/5'
                }`} />

                {/* Washing Machine Physical Frame */}
                <div className="relative w-44 h-48 bg-gradient-to-b from-slate-200 to-slate-400 rounded-3xl p-3 border-2 border-slate-100 shadow-2xl flex flex-col justify-between text-slate-800 overflow-hidden">
                  
                  {/* Dashboard Panel */}
                  <div className="h-9 w-full bg-slate-800 rounded-xl p-1.5 flex justify-between items-center text-white border border-slate-700">
                    <div className="flex gap-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${isWashingActive ? 'bg-green-400 animate-ping' : 'bg-red-400'}`} />
                      <span className="text-[7px] font-mono font-bold tracking-widest uppercase">Auto-Wash</span>
                    </div>
                    <div className="text-[8px] font-mono text-green-400 font-extrabold flex items-center gap-0.5">
                      <Clock size={8} />
                      <span>{isWashingActive ? `00:${15 * (6 - spinSpeed)}` : 'Hold'}</span>
                    </div>
                  </div>

                  {/* Window Glass Container */}
                  <div className="relative w-32 h-32 rounded-full border-4 border-slate-350 bg-slate-900 mx-auto flex items-center justify-center overflow-hidden shadow-inner">
                    
                    {/* Floating Soap Bubbles Simulator */}
                    {isWashingActive && (
                      <div className="absolute inset-0 pointer-events-none z-10">
                        <div className="bubble-mist select-none">
                          <span className="absolute w-2 h-2 bg-white/40 rounded-full top-[30%] left-[25%] animate-bounce" style={{ animationDelay: '0.1s' }} />
                          <span className="absolute w-3 h-3 bg-white/35 rounded-full top-[60%] left-[40%] animate-ping" style={{ animationDelay: '0.5s', animationDuration: '3s' }} />
                          <span className="absolute w-1.5 h-1.5 bg-white/50 rounded-full top-[45%] left-[70%] animate-bounce" style={{ animationDelay: '0.25s' }} />
                          <span className="absolute w-2.5 h-2.5 bg-white/30 rounded-full top-[15%] left-[55%] animate-pulse" />
                        </div>
                      </div>
                    )}

                    {/* Water Fluid Filter */}
                    <div className={`absolute inset-0 opacity-40 transition-colors duration-500 bg-gradient-to-t ${
                      isWashingActive ? 'from-blue-400 via-sky-300 to-transparent' : 'from-slate-700 to-transparent'
                    }`} />

                    {/* Inner Rotating Drum */}
                    <div 
                      className="w-24 h-24 rounded-full border-2 border-dotted border-slate-600/40 flex items-center justify-center"
                      style={{ 
                        transform: isWashingActive ? `rotate(360deg)` : 'rotate(0deg)',
                        transition: isWashingActive ? `transform ${6 - spinSpeed}s linear infinite` : 'transform 1s ease-out'
                      }}
                    >
                      {/* Swirling Clothes Vector */}
                      <svg viewBox="0 5 100 100" className="w-16 h-16 opacity-90 drop-shadow-md">
                        {/* Shirt/Clothing A */}
                        <path d="M 30,50 Q 50,30 70,50 Q 80,70 50,80 Q 20,70 30,50 Z" fill="#3b82f6" opacity="0.85" />
                        {/* Towel B */}
                        <path d="M 45,65 Q 60,50 75,65" fill="none" stroke="#fed7aa" strokeWidth="6" strokeLinecap="round" />
                        {/* Spinning Center hub */}
                        <circle cx="50" cy="50" r="10" fill="#ffffff" stroke="#64748b" strokeWidth="3" />
                        <path d="M 50,40 L 50,30 M 50,60 L 50,70 M 40,50 L 30,50 M 60,50 L 70,50" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" />
                      </svg>
                    </div>

                  </div>

                  {/* Feet of washer */}
                  <div className="h-1.5 w-[92%] mx-auto bg-slate-600 rounded-b-md" />
                </div>

                <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-blue-600 to-sky-500 text-white p-2 rounded-2xl flex items-center gap-1.5 text-[9px] font-black uppercase shadow-lg border border-white/20">
                  <Wind size={11} className="animate-pulse" /> RPM Turbo-Care
                </div>
              </div>
            )}

            {/* Slide 2 Illustration (Enterprise Multibranch Nodes) */}
            {activeSlide === 1 && (
              <div className="relative w-full max-w-[220px] h-[200px] flex items-center justify-center">
                
                {/* Connection lines connecting nodes in triangular cloud topology */}
                <svg className="absolute inset-0 w-full h-full text-teal-500/20" viewBox="0 0 200 200" fill="none">
                  <path 
                    d="M 100 45 L 45 130 L 155 130 Z" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeDasharray="4 4" 
                    className="animate-pulse"
                  />
                  {/* Direct real-time signal radiation from center active node */}
                  {selectedBranchNode === 'ID-JKT' && <line x1="100" y1="45" x2="45" y2="130" stroke="#14b8a6" strokeWidth="2" className="animate-pulse" />}
                  {selectedBranchNode === 'ID-BDG' && <line x1="100" y1="45" x2="155" y2="130" stroke="#14b8a6" strokeWidth="2" className="animate-pulse" />}
                  {selectedBranchNode === 'ID-SUB' && <line x1="45" y1="130" x2="155" y2="130" stroke="#14b8a6" strokeWidth="2" className="animate-pulse" />}
                </svg>

                {/* Cloud Node Center */}
                <div className="absolute top-[20px] left-[50%] -translate-x-[50%] flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-slate-900 border-2 border-teal-500 shadow-xl flex items-center justify-center text-teal-400">
                    <Database size={16} />
                  </div>
                  <span className="text-[8px] font-mono font-bold mt-1.5 bg-teal-950 px-1.5 py-0.5 rounded border border-teal-900 whitespace-nowrap text-teal-300">
                    CLOUD REPLICA
                  </span>
                </div>

                {/* Node Outlet A: Jakarta */}
                <div className="absolute left-[20px] bottom-[30px] flex flex-col items-center">
                  <div 
                    onClick={() => handlePingBranch('ID-JKT')}
                    className={`w-11 h-11 rounded-full cursor-pointer flex items-center justify-center transition ${
                      selectedBranchNode === 'ID-JKT' 
                        ? 'bg-teal-500 text-slate-950 scale-110 shadow-lg ring-4 ring-teal-500/20' 
                        : 'bg-slate-900 text-slate-400 border border-slate-700 hover:border-teal-500'
                    }`}
                  >
                    <span className="font-extrabold text-[9px]">OUT A</span>
                  </div>
                  <span className="text-[7px] font-black mt-1 text-slate-400 uppercase">Jkt HQ</span>
                </div>

                {/* Node Outlet B: Bandung */}
                <div className="absolute right-[20px] bottom-[30px] flex flex-col items-center">
                  <div 
                    onClick={() => handlePingBranch('ID-BDG')}
                    className={`w-11 h-11 rounded-full cursor-pointer flex items-center justify-center transition ${
                      selectedBranchNode === 'ID-BDG' 
                        ? 'bg-teal-500 text-slate-950 scale-110 shadow-lg ring-4 ring-teal-500/20' 
                        : 'bg-slate-900 text-slate-400 border border-slate-700 hover:border-teal-500'
                    }`}
                  >
                    <span className="font-extrabold text-[9px]">OUT B</span>
                  </div>
                  <span className="text-[7px] font-black mt-1 text-slate-400 uppercase">Bdg Clean</span>
                </div>

                {/* Floating Ping latency badge */}
                <div className="absolute top-[48%] left-[24%] bg-slate-900/95 border border-teal-800 text-teal-400 px-2 py-0.5 rounded-lg text-[7px] font-mono font-extrabold shadow-md">
                  {selectedBranchNode === 'ID-JKT' ? `${pingLatency}ms sync` : '18ms'}
                </div>
                <div className="absolute top-[48%] right-[24%] bg-slate-900/95 border border-teal-800 text-teal-400 px-2 py-0.5 rounded-lg text-[7px] font-mono font-extrabold shadow-md">
                  {selectedBranchNode === 'ID-BDG' ? `${pingLatency + 3}ms sync` : '21ms'}
                </div>
              </div>
            )}

            {/* Slide 3 Illustration (Fragrance Aromatherapy Mist Cup) */}
            {activeSlide === 2 && (
              <div className="relative w-full max-w-[200px] h-[200px] flex items-center justify-center">
                
                {/* Dynamically colored background aura */}
                <div className={`absolute inset-4 rounded-full blur-2xl opacity-40 transition-all duration-700 ${
                  selectedAroma === 'sakura' ? 'bg-pink-500' :
                  selectedAroma === 'lavender' ? 'bg-purple-500' : 'bg-cyan-500'
                }`} />

                {/* Animated Floating Scent Bubbles */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
                  <div className="absolute w-2 h-2 rounded-full bg-white/70 animate-bounce top-[20%] left-[30%]" />
                  <div className={`absolute w-3 h-3 rounded-full animate-pulse top-[45%] right-[25%] transition-colors duration-500 ${
                    selectedAroma === 'sakura' ? 'bg-pink-300/60' :
                    selectedAroma === 'lavender' ? 'bg-purple-300/60' : 'bg-cyan-300/60'
                  }`} />
                  <div className="absolute w-1.5 h-1.5 rounded-full bg-slate-200 animate-ping top-[70%] left-[45%]" />
                </div>

                {/* Hanging Folded Soft Towels & Fragrance Vial Illustration */}
                <div className="relative w-36 h-40 flex flex-col items-center justify-center">
                  
                  {/* Stacked Fresh Towels */}
                  <div className="relative space-y-[-10px] w-full z-10">
                    {/* Pink/Aroma Accent Top Layer */}
                    <div className={`h-6 w-32 rounded-lg shadow-sm border border-white/20 transition-all duration-500 ${
                      selectedAroma === 'sakura' ? 'bg-pink-500 translate-y-[-2px]' :
                      selectedAroma === 'lavender' ? 'bg-purple-500 translate-y-[-2px]' : 'bg-cyan-500 translate-y-[-2px]'
                    }`} />
                    {/* Soft White Middle Layer */}
                    <div className="h-6 w-[124px] bg-slate-100 border border-slate-300 mx-auto rounded-lg shadow-sm relative z-25 flex items-center justify-between px-3 text-slate-700 font-bold text-[8px]">
                      <span>100% Cotton</span>
                      <Sparkles size={8} className="text-amber-500 animate-pulse" />
                    </div>
                    {/* Gentle Blue Bottom Layer */}
                    <div className="h-6 w-[116px] bg-sky-200 border border-sky-300 mx-auto rounded-lg shadow-sm" />
                  </div>

                  {/* Premium Seal Emblem */}
                  <div className="absolute bottom-[10px] right-[10px] z-30 bg-amber-500 text-slate-950 w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-2 border-white scale-105 animate-pulse">
                    <Award size={15} />
                  </div>

                </div>
              </div>
            )}

          </div>

        </div>

        {/* Carousel Footer & Progress Indicators */}
        <div className="border-t border-slate-800/60 px-6 py-4 bg-slate-950/95 flex items-center justify-between z-20">
          
          {/* Manual Page Buttons */}
          <div className="flex gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => handleManualNav(idx)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  activeSlide === idx 
                    ? 'w-8 bg-blue-500 shadow-md' 
                    : 'w-2.5 bg-slate-700 hover:bg-slate-600'
                }`}
                title={`Lihat Slide ${idx + 1}`}
                id={`btn-manual-slide-${idx}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
            <span className="hidden sm:inline-flex items-center gap-1">
              <Compass size={12} className="text-blue-500" /> Cabang Aktif Tersinkronisasi Cepat
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => handleManualNav((activeSlide - 1 + slides.length) % slides.length)}
                className="p-1 px-2.5 bg-slate-900 hover:bg-slate-800 rounded-lg text-white border border-slate-800 transition"
                id="btn-prev-slide"
              >
                ‹
              </button>
              <button
                onClick={() => handleManualNav((activeSlide + 1) % slides.length)}
                className="p-1 px-2.5 bg-slate-900 hover:bg-slate-800 rounded-lg text-white border border-slate-800 transition"
                id="btn-next-slide"
              >
                ›
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
