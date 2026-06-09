import React from 'react';
import { motion } from 'framer-motion';
import { 
  SlidersHorizontal, Play, Sparkles, RefreshCw, Sun, 
  ChevronRight, Thermometer, Info, HelpCircle, Activity, DollarSign
} from 'lucide-react';
import { ProductMetrics } from '../types';
import { playSound } from '../utils/audio';

interface SimulatorTabProps {
  outsideTemp: number;
  setOutsideTemp: (val: number) => void;
  indirectPct: number;
  setIndirectPct: (val: number) => void;
  productLots: { [key: string]: number };
  setProductLots: React.Dispatch<React.SetStateAction<{ [key: string]: number }>>;
  products: ProductMetrics[];
  currentMetrics: any;
  baselineMetrics: any;
  themeMode: 'dark' | 'light';
}

export const SimulatorTab: React.FC<SimulatorTabProps> = ({
  outsideTemp,
  setOutsideTemp,
  indirectPct,
  setIndirectPct,
  productLots,
  setProductLots,
  products,
  currentMetrics,
  baselineMetrics,
  themeMode
}) => {

  const handleLotChange = (prodId: string, val: number) => {
    playSound('click');
    setProductLots(prev => ({
      ...prev,
      [prodId]: Math.max(0, val)
    }));
  };

  // Preset Buttons definition
  const applyPreset = (temp: number, hvacPct: number, overrideLots?: { [key: string]: number }) => {
    playSound('preset');
    setOutsideTemp(temp);
    setIndirectPct(hvacPct);
    if (overrideLots) {
      setProductLots(overrideLots);
    }
  };

  const handleTempSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    playSound('input');
    setOutsideTemp(Number(e.target.value));
  };

  const handleIndirectSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    playSound('input');
    setIndirectPct(Number(e.target.value));
  };

  const costDiff = currentMetrics.totalCost - baselineMetrics.totalCost;
  const co2Diff = currentMetrics.totalCO2 - baselineMetrics.totalCO2;
  const savings = Math.max(0, -costDiff);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      
      {/* Parameters Panel (Left - 7 columns) */}
      <div className="lg:col-span-7 space-y-6">
        
        {/* Intro */}
        <div className={`p-5 rounded-3xl border transition-all ${
          themeMode === 'light' 
            ? 'bg-white border-slate-200/80 shadow-xs' 
            : 'bg-slate-900/60 border-slate-800'
        }`}>
          <div className="flex items-center space-x-2 text-emerald-500 font-bold text-xs uppercase tracking-wider font-mono mb-2">
            <Sparkles className="w-4 h-4 text-emerald-500 animate-pulse" />
            <span>Simulateur d'Élasticité Climato-Énergétique</span>
          </div>
          <p className="text-xs text-slate-500 leading-normal">
            Ajustez en temps réel l'environnement d'Ariana (température), la charge indirecte d'HVAC comprimé et les volumes de lots programmés pour observer immédiatement les modifications budgétaires et CO₂ de l'usine pharmaceutique.
          </p>

          {/* Quick Presets row */}
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-850 flex flex-wrap gap-2 items-center">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wide mr-1 font-bold">Presets :</span>
            
            <button 
              onClick={() => applyPreset(42, 38, { 'p-para': 130, 'p-sirop': 90, 'p-amox': 105, 'p-pommade': 70, 'p-blister': 160 })}
              className="bg-amber-500/10 hover:bg-amber-500/15 border border-amber-500/20 text-amber-600 dark:text-amber-400 px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-colors cursor-pointer"
            >
              ☀️ Canicule Tunis (42°C)
            </button>

            <button 
              onClick={() => applyPreset(22, 16)}
              className="bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-colors cursor-pointer"
            >
              🟢 Mode Standard Optimal (22°C)
            </button>

            <button 
              onClick={() => applyPreset(16, 12, { 'p-para': 150, 'p-sirop': 50, 'p-amox': 120, 'p-pommade': 40, 'p-blister': 180 })}
              className="bg-blue-500/10 hover:bg-blue-500/15 border border-blue-500/20 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-colors cursor-pointer"
            >
              ❄️ Hiver Pleine Charge
            </button>
          </div>
        </div>

        {/* Sliders Container card */}
        <div className={`p-6 rounded-3xl border space-y-6 ${
          themeMode === 'light' 
            ? 'bg-white border-slate-200/80 shadow-xs' 
            : 'bg-slate-900/60 border-slate-800'
        }`}>
          <h3 className="font-display font-bold text-sm tracking-tight text-slate-900 dark:text-slate-100 flex items-center space-x-2">
            <SlidersHorizontal className="w-4 h-4 text-emerald-500" />
            <span>Leviers Technologiques & Demande</span>
          </h3>

          {/* 1. Outside temp slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-medium flex items-center space-x-1.5">
                <Thermometer className="w-4 h-4 text-amber-500" />
                <span>Température Extérieure Moyenne (°C)</span>
              </label>
              <span className="font-mono font-bold bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded-md border border-amber-500/15">
                {outsideTemp}°C
              </span>
            </div>
            <div className="relative group/slide flex items-center py-2">
              <input 
                type="range" 
                min="15" 
                max="45" 
                value={outsideTemp}
                onChange={handleTempSliderChange}
                className="w-full accent-amber-500 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <span className="text-[10px] text-slate-400 block font-normal leading-normal">
              Directement proportionnelle à l'indice d'effort thermique requis pour maintenir le gradient de pression de la CTA d'air stérile.
            </span>
          </div>

          {/* 2. HVAC prorata slider */}
          <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-850">
            <div className="flex justify-between items-center text-xs">
              <label className="font-medium flex items-center space-x-1.5">
                <Activity className="w-4 h-4 text-blue-500" />
                <span>Taux de Charge CTA & HVAC Indirect (%)</span>
              </label>
              <span className="font-mono font-bold bg-blue-500/10 text-blue-600 px-2 py-0.5 rounded-md border border-blue-500/15">
                {indirectPct}%
              </span>
            </div>
            <div className="relative group/slide flex items-center py-2">
              <input 
                type="range" 
                min="10" 
                max="40" 
                value={indirectPct}
                onChange={handleIndirectSliderChange}
                className="w-full accent-blue-500 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <span className="text-[10px] text-slate-400 block font-normal leading-normal">
              Rapport d'occupation volumétrique alloué. Une réduction signifie une régulation optimisée des CTA d'air par variateurs de vitesse.
            </span>
          </div>


          {/* 3. Products volumes inputs */}
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-850">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono flex items-center justify-between">
              <span>Lots Produits Programmé (Mensuel)</span>
              <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {products.map(p => (
                <div 
                  key={p.id} 
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-850 flex items-center justify-between"
                >
                  <div className="truncate pr-2">
                    <span className="font-semibold text-xs text-slate-800 dark:text-slate-200 block truncate">{p.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono font-medium">{p.directConsoKwh} kWh/lot std</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 shrink-0">
                    <button 
                      onClick={() => handleLotChange(p.id, (productLots[p.id] || 0) - 5)}
                      className="w-7 h-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 rounded-lg font-bold hover:bg-slate-100 flex items-center justify-center cursor-pointer text-xs"
                    >
                      -
                    </button>
                    <input 
                      type="number" 
                      value={productLots[p.id] || 0}
                      onChange={(e) => handleLotChange(p.id, Number(e.target.value))}
                      className="w-12 bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 font-mono font-bold text-center py-1 rounded-lg text-xs"
                    />
                    <button 
                      onClick={() => handleLotChange(p.id, (productLots[p.id] || 0) + 5)}
                      className="w-7 h-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 rounded-lg font-bold hover:bg-slate-100 flex items-center justify-center cursor-pointer text-xs"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Outcome Simulation Panel (Right - 5 columns) */}
      <div className="lg:col-span-5 space-y-6">
        
        {/* Visual Gaugue Circle card */}
        <div className={`p-6 rounded-3xl border flex flex-col justify-between items-center text-center relative overflow-hidden ${
          themeMode === 'light' 
            ? 'bg-white border-slate-200/80 shadow-xs' 
            : 'bg-slate-900/60 border-slate-800'
        }`}>
          <h3 className="font-display font-bold text-sm tracking-tight text-slate-900 dark:text-slate-100 w-full text-left border-b border-slate-100 dark:border-slate-850 pb-3">
            Impact Financier Déduit
          </h3>

          <div className="my-6 relative flex items-center justify-center w-36 h-36">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke={themeMode === 'light' ? '#f1f5f9' : '#1e293b'} strokeWidth="8" />
              <motion.circle 
                cx="50" 
                cy="50" 
                r="40" 
                fill="none" 
                stroke={costDiff > 0 ? '#ef4444' : '#10b981'} 
                strokeWidth="8" 
                strokeDasharray="251"
                initial={{ strokeDashoffset: 120 }}
                animate={{ strokeDashoffset: Math.max(0, 251 - (251 * Math.abs(costDiff)) / (baselineMetrics.totalCost || 10000)) }}
                transition={{ duration: 0.5 }}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center font-sans">
              <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase font-semibold">Diagnostic</span>
              <span className={`text-xl font-bold font-mono tracking-tight ${costDiff > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                {costDiff > 0 ? "+" : ""}{costDiff.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} TND
              </span>
              <span className="text-[9px] text-slate-400 font-mono">écart / baseline</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 px-4 leading-relaxed">
            {costDiff > 0 
              ? `L'élévation thermique et la charge programmée génèrent un surcoût mensuel STEG de ${costDiff.toFixed(0)} TND par rapport au fonctionnement nominal en usine.` 
              : "La régulation ventilateurs CTA de " + indirectPct + "% préserve l'équilibre et réduit substantiellement les consommations STEG de l'usine."
            }
          </p>
        </div>

        {/* Side-by-side precise stats */}
        <div className={`p-6 rounded-3xl border space-y-4 ${
          themeMode === 'light' 
            ? 'bg-white border-slate-200/80 shadow-xs' 
            : 'bg-slate-900/60 border-slate-800'
        }`}>
          <h4 className="font-display font-medium text-xs text-slate-400 uppercase tracking-widest">
            Bilan Environnemental de l'Ariana
          </h4>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs py-2 border-b border-slate-100 dark:border-slate-850">
              <span className="text-slate-500">Flux d'Eau Vaporisée Consommé :</span>
              <b className="font-mono">{currentMetrics.waterEvapM3.toFixed(1)} m³</b>
            </div>

            <div className="flex items-center justify-between text-xs py-2 border-b border-slate-100 dark:border-slate-850">
              <span className="text-slate-500">Masse Carbone STEG Émise :</span>
              <b className="font-mono text-emerald-500">{currentMetrics.elecCO2Tons.toFixed(2)} t_CO₂</b>
            </div>

            <div className="flex items-center justify-between text-xs py-2">
              <span className="text-slate-500">Vapeur Chaufferie Gasoil :</span>
              <b className="font-mono text-amber-500">{currentMetrics.gasoilCO2Tons.toFixed(2)} t_CO₂</b>
            </div>
          </div>

          {/* AI thermodynamic checklist banner */}
          <div className="p-3.5 rounded-2xl bg-indigo-50/50 dark:bg-slate-950/60 border border-indigo-100/30 dark:border-slate-850 text-[11px] leading-relaxed text-slate-500 flex items-start space-x-2.5">
            <Info className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-800 dark:text-slate-300 block">Indication ANME :</span>
              Le lissage sur la boucle vapeur d'Opalia permet de ramener l'intensité lot du Paracétamol sous la norme de 150 kWh/t de comprimés.
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
