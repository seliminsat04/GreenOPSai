import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, Leaf, Activity, DollarSign, AlertTriangle, 
  CheckCircle2, Sparkles, TrendingUp, TrendingDown, Info, ShieldAlert, Sun, Droplets
} from 'lucide-react';
import { Cabinet, ProductMetrics } from '../types';
import { StackedBarChart, DonutChart, LineTempEnergyChart, YearlyComparisonChart, CabinetTreemap, SolarVsNetworkChart } from './Charts';
import { TEMPERATURE_ENERGY_HISTORY, MONTHLY_ENERGY_COMPARISON_HISTORY, MONTHLY_SOLAR_HISTORY } from '../data';
import { playSound } from '../utils/audio';

interface DashboardTabProps {
  cabinets: Cabinet[];
  currentMetrics: any;
  baselineMetrics: any;
  savingEstimatedTnd: number;
  outsideTemp: number;
  onKpiClick: (kpi: "energy" | "carbon" | "lot" | "savings") => void;
  themeMode: 'dark' | 'light';
  products: ProductMetrics[];
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  cabinets,
  currentMetrics,
  baselineMetrics,
  savingEstimatedTnd,
  outsideTemp,
  onKpiClick,
  themeMode,
  products
}) => {
  const isHotAlert = outsideTemp >= 38;

  const handleKpiClickInternal = (kpi: "energy" | "carbon" | "lot" | "savings") => {
    playSound('ai');
    onKpiClick(kpi);
  };

  // Compute stats
  const co2SavingTons = Math.max(0, baselineMetrics.totalCO2 - currentMetrics.totalCO2);
  const costDiffPercent = ((currentMetrics.totalCost - baselineMetrics.totalCost) / (baselineMetrics.totalCost || 1)) * 100;
  
  // Format numeric values safety
  const formattedCost = Math.round(currentMetrics.totalCost).toLocaleString('fr-FR');
  const formattedCO2 = currentMetrics.totalCO2.toFixed(1);
  const formattedLotCost = products.length > 0 
    ? (products.reduce((acc, p) => acc + p.totalCostTnd, 0) / products.reduce((acc, p) => acc + p.lotsPerMonth, 0)).toFixed(2)
    : "0.00";

  // Data for direct vs indirect costs stacked bar chart
  const barChartData = products.slice(0, 5).map(p => ({
    name: p.name,
    direct: Math.round(p.directCostTnd),
    indirect: Math.round(p.indirectProratedTnd)
  }));

  return (
    <div className="space-y-6">
      {/* ⚠️ Industrial canicule alert banner */}
      {isHotAlert && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-gradient-to-r from-red-500 via-amber-500 to-red-600 text-white rounded-3xl p-5 shadow-lg shadow-red-500/10 border border-red-400/20"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none transform translate-x-4 -translate-y-4">
            <ShieldAlert className="w-40 h-40" />
          </div>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
            <div className="flex items-start space-x-3.5">
              <div className="w-12 h-12 rounded-2xl bg-white/15 text-white flex items-center justify-center shrink-0 border border-white/20 shadow-inner">
                <AlertTriangle className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <b className="font-display text-lg tracking-tight block">Alerte Canicule Active • Ariana Tunis ({outsideTemp}°C)</b>
                <p className="text-xs text-white/90 font-sans mt-1 max-w-xl">
                  La température extérieure dépasse le seuil critique d'efficacité des Centrale de Traitement d'Air (CTA). La charge de climatisation indirecte augmente de {(outsideTemp * 0.8).toFixed(1)}%. Ajustez les vannes et priorisez la ventilation nocturne.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 bg-black/10 px-4 py-2 rounded-2xl border border-white/10 text-xs shrink-0 font-mono">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400 animate-ping inline-block" />
              <span className="font-semibold uppercase text-[10px]">EER Dégradé - Groupes Froid</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* 4 Premium KPIs Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Monthly Cost */}
        <motion.div 
          whileHover={{ y: -5, scale: 1.015 }}
          whileTap={{ scale: 0.985 }}
          onClick={() => handleKpiClickInternal("energy")}
          className={`group relative overflow-hidden p-6 rounded-3xl border transition-all duration-300 cursor-pointer shimmer-element ${
            themeMode === 'light' 
              ? 'bg-white border-slate-200 hover:border-amber-400 hover:shadow-xl shadow-sm' 
              : 'glass-panel-dark border-slate-800/80 hover:border-amber-500/40 hover:bg-slate-900/80 hover:shadow-amber-500/10 hover:shadow-lg'
          }`}
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-bl-full pointer-events-none group-hover:bg-amber-500/10 transition-colors" />
          <div className="flex items-center justify-between mb-4">
            <span className={`text-[10px] font-mono font-bold uppercase tracking-widest ${themeMode === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>COÛT ÉNERGÉTIQUE ESTIMÉ</span>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-md ${themeMode === 'light' ? 'bg-amber-100/60 text-amber-600' : 'bg-amber-500/15 text-amber-400 border border-amber-500/20'}`}>
              <Zap className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="space-y-1">
            <h4 className="text-3xl font-display font-bold tracking-tight">
              {formattedCost} <span className="text-base font-normal text-slate-400">TND</span>
            </h4>
            <div className="flex items-center space-x-1.5 text-[11px] font-mono">
              {costDiffPercent > 0 ? (
                <>
                  <span className="inline-block w-2 h-2 rounded-full bg-red-500 shrink-0" />
                  <TrendingUp className="w-3.5 h-3.5 text-red-500" />
                  <span className="text-red-500 font-bold">+{costDiffPercent.toFixed(1)}%</span>
                  <span className="text-slate-400">vs nominal</span>
                </>
              ) : (
                <>
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <TrendingDown className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-500 font-bold">{costDiffPercent.toFixed(1)}%</span>
                  <span className="text-slate-400">nominal</span>
                </>
              )}
            </div>
          </div>
          <div className="absolute right-4 bottom-3 opacity-0 group-hover:opacity-100 transform translate-y-1 group-hover:translate-y-0 transition-all text-[9px] uppercase font-mono tracking-widest font-bold text-amber-500 flex items-center">
            Analyser <Sparkles className="w-3 h-3 ml-1" />
          </div>
        </motion.div>

        {/* KPI 2: Carbon Footprint */}
        <motion.div 
          whileHover={{ y: -5, scale: 1.015 }}
          whileTap={{ scale: 0.985 }}
          onClick={() => handleKpiClickInternal("carbon")}
          className={`group relative overflow-hidden p-6 rounded-3xl border transition-all duration-300 cursor-pointer shimmer-element ${
            themeMode === 'light' 
              ? 'bg-white border-slate-200 hover:border-emerald-400 hover:shadow-xl shadow-sm' 
              : 'glass-panel-dark border-slate-800/80 hover:border-emerald-500/40 hover:bg-slate-900/80 hover:shadow-emerald-500/10 hover:shadow-lg'
          }`}
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full pointer-events-none group-hover:bg-emerald-500/10 transition-colors" />
          <div className="flex items-center justify-between mb-4">
            <span className={`text-[10px] font-mono font-bold uppercase tracking-widest ${themeMode === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>EMPREINTE CO₂ GLOBALE</span>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-md ${themeMode === 'light' ? 'bg-emerald-100/60 text-emerald-600' : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'}`}>
              <Leaf className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="space-y-1">
            <h4 className="text-3xl font-display font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
              {formattedCO2} <span className="text-base font-normal text-slate-450 dark:text-slate-500">t_CO₂</span>
            </h4>
            <div className="flex items-center space-x-1.5 text-[11px] font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 neon-green-pulse inline-block" />
              <span className="text-slate-500 font-medium">Cadre ANME Tunisie</span>
            </div>
          </div>
          <div className="absolute right-4 bottom-3 opacity-0 group-hover:opacity-100 transform translate-y-1 group-hover:translate-y-0 transition-all text-[9px] uppercase font-mono tracking-widest font-bold text-emerald-500 flex items-center">
            Analyser <Sparkles className="w-3 h-3 ml-1" />
          </div>
        </motion.div>

        {/* KPI 3: Cost per lot */}
        <motion.div 
          whileHover={{ y: -5, scale: 1.015 }}
          whileTap={{ scale: 0.985 }}
          onClick={() => handleKpiClickInternal("lot")}
          className={`group relative overflow-hidden p-6 rounded-3xl border transition-all duration-300 cursor-pointer shimmer-element ${
            themeMode === 'light' 
              ? 'bg-white border-slate-200 hover:border-blue-400 hover:shadow-xl shadow-sm' 
              : 'glass-panel-dark border-slate-800/80 hover:border-blue-500/40 hover:bg-slate-900/80 hover:shadow-blue-500/10 hover:shadow-lg'
          }`}
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-full pointer-events-none group-hover:bg-blue-500/10 transition-colors" />
          <div className="flex items-center justify-between mb-4">
            <span className={`text-[10px] font-mono font-bold uppercase tracking-widest ${themeMode === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>COÛT DIRECT UNITAIRE LOT</span>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-md ${themeMode === 'light' ? 'bg-blue-100/60 text-blue-600' : 'bg-blue-500/15 text-blue-400 border border-blue-500/20'}`}>
              <Activity className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="space-y-1">
            <h4 className="text-3xl font-display font-bold tracking-tight text-blue-600 dark:text-blue-400">
              {formattedLotCost} <span className="text-base font-normal text-slate-400">TND</span>
            </h4>
            <div className="flex items-center space-x-1.5 text-[11px] font-mono text-slate-500">
              <Info className="w-3.5 h-3.5" />
              <span>Répartition CTA active</span>
            </div>
          </div>
          <div className="absolute right-4 bottom-3 opacity-0 group-hover:opacity-100 transform translate-y-1 group-hover:translate-y-0 transition-all text-[9px] uppercase font-mono tracking-widest font-bold text-blue-500 flex items-center">
            Analyser <Sparkles className="w-3 h-3 ml-1" />
          </div>
        </motion.div>

        {/* KPI 4: Savings Potential */}
        <motion.div 
          whileHover={{ y: -5, scale: 1.015 }}
          whileTap={{ scale: 0.985 }}
          onClick={() => handleKpiClickInternal("savings")}
          className={`group relative overflow-hidden p-6 rounded-3xl border transition-all duration-300 cursor-pointer shimmer-element ${
            themeMode === 'light' 
              ? 'bg-white border-slate-200 hover:border-purple-400 hover:shadow-xl shadow-sm' 
              : 'glass-panel-dark border-slate-800/80 hover:border-purple-500/40 hover:bg-slate-900/80 hover:shadow-purple-500/10 hover:shadow-lg'
          }`}
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-bl-full pointer-events-none group-hover:bg-purple-500/10 transition-colors" />
          <div className="flex items-center justify-between mb-4">
            <span className={`text-[10px] font-mono font-bold uppercase tracking-widest ${themeMode === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>ÉCONOMIES RÉALISABLES</span>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-md ${themeMode === 'light' ? 'bg-purple-100/60 text-purple-600' : 'bg-purple-500/15 text-purple-400 border border-purple-500/20'}`}>
              <DollarSign className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="space-y-1">
            <h4 className="text-3xl font-display font-bold tracking-tight text-purple-600 dark:text-purple-400">
              {savingEstimatedTnd.toLocaleString('fr-FR')} <span className="text-base font-normal text-slate-400">TND</span>
            </h4>
            <div className="flex items-center space-x-1.5 text-[11px] font-mono text-emerald-500 dark:text-emerald-400 font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Gisements CTA identifiés</span>
            </div>
          </div>
          <div className="absolute right-4 bottom-3 opacity-0 group-hover:opacity-100 transform translate-y-1 group-hover:translate-y-0 transition-all text-[9px] uppercase font-mono tracking-widest font-bold text-purple-500 flex items-center">
            Analyser <Sparkles className="w-3 h-3 ml-1" />
          </div>
        </motion.div>

      </div>

      {/* ☀️ Green Energy Solar KPI Banner */}
      {currentMetrics.pvProductionKwh > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -5, scale: 1.015 }}
          className={`group relative overflow-hidden grid grid-cols-1 md:grid-cols-3 gap-4 p-5 rounded-3xl border transition-all duration-300 shimmer-element ${
            themeMode === 'light' 
              ? 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 hover:border-amber-400 hover:shadow-xl shadow-sm' 
              : 'bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/20 hover:border-amber-500/40 hover:bg-slate-900/80 hover:shadow-amber-500/10 hover:shadow-lg'
          }`}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-bl-full pointer-events-none group-hover:bg-amber-500/20 transition-colors" />
          <div className="col-span-1 md:col-span-3 flex items-center mb-1 relative z-10">
            <Sun className={`w-5 h-5 mr-2 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12 animate-pulse ${themeMode === 'light' ? 'text-amber-500' : 'text-amber-400'}`} />
            <h3 className={`font-display font-bold text-sm tracking-tight ${themeMode === 'light' ? 'text-amber-800' : 'text-amber-300'}`}>
              Impact Énergie Verte (Photovoltaïque)
            </h3>
            <Sparkles className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-amber-500" />
          </div>
          
          {/* Autoconsommation */}
          <div className={`p-4 rounded-2xl border transition-all duration-300 group-hover:border-amber-300/50 ${themeMode === 'light' ? 'bg-white/80 backdrop-blur border-amber-100 shadow-sm' : 'bg-black/20 backdrop-blur border-amber-500/20'}`}>
            <p className="text-[10px] font-mono font-bold uppercase text-slate-500 mb-1">Auto-consommation</p>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold text-amber-500">{currentMetrics.autoConsumptionRate.toFixed(1)}%</span>
              <span className="text-xs text-slate-400 font-mono mb-1">{currentMetrics.pvProductionKwh.toLocaleString('fr-FR')} kWh générés</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 mt-3 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${currentMetrics.autoConsumptionRate}%` }}
                transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                className="bg-amber-500 h-1.5 rounded-full" 
              />
            </div>
          </div>
          
          {/* Savings TND */}
          <div className={`p-4 rounded-2xl border transition-all duration-300 group-hover:border-emerald-300/50 ${themeMode === 'light' ? 'bg-white/80 backdrop-blur border-amber-100 shadow-sm' : 'bg-black/20 backdrop-blur border-amber-500/20'}`}>
            <p className="text-[10px] font-mono font-bold uppercase text-slate-500 mb-1">Économies (Solaire)</p>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold text-emerald-500">{Math.round(currentMetrics.pvSavingsCost).toLocaleString('fr-FR')} TND</span>
              <span className="text-xs text-slate-400 font-mono mb-1">économisés / mois</span>
            </div>
          </div>
          
          {/* CO2 Avoided */}
          <div className={`p-4 rounded-2xl border transition-all duration-300 group-hover:border-teal-300/50 ${themeMode === 'light' ? 'bg-white/80 backdrop-blur border-amber-100 shadow-sm' : 'bg-black/20 backdrop-blur border-amber-500/20'}`}>
            <p className="text-[10px] font-mono font-bold uppercase text-slate-500 mb-1">Empreinte Carbone Évitée</p>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold text-teal-500">-{currentMetrics.pvSavingsCO2.toFixed(1)} t</span>
              <span className="text-xs text-slate-400 font-mono mb-1">de CO₂ évitées</span>
            </div>
          </div>
          
        </motion.div>
      )}

      {/* 💧 Water Efficiency KPI Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5, scale: 1.015 }}
        className={`group relative overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-4 p-5 rounded-3xl border transition-all duration-300 shimmer-element ${
          themeMode === 'light' 
            ? 'bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-200 hover:border-cyan-400 hover:shadow-xl shadow-sm' 
            : 'bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-cyan-500/20 hover:border-cyan-500/40 hover:bg-slate-900/80 hover:shadow-cyan-500/10 hover:shadow-lg'
        }`}
      >
        <div className="absolute top-0 left-0 w-32 h-32 bg-cyan-500/10 rounded-br-full pointer-events-none group-hover:bg-cyan-500/20 transition-colors" />
        <div className="col-span-1 md:col-span-2 flex items-center mb-1 relative z-10">
          <Droplets className={`w-5 h-5 mr-2 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12 animate-pulse ${themeMode === 'light' ? 'text-cyan-500' : 'text-cyan-400'}`} />
          <h3 className={`font-display font-bold text-sm tracking-tight ${themeMode === 'light' ? 'text-cyan-800' : 'text-cyan-300'}`}>
            Rendement Station d'Eau Purifiée
          </h3>
        </div>
        
        {/* Rendement / Efficacité */}
        <div className={`p-4 rounded-2xl border transition-all duration-300 group-hover:border-cyan-300/50 ${themeMode === 'light' ? 'bg-white/80 backdrop-blur border-cyan-100 shadow-sm' : 'bg-black/20 backdrop-blur border-cyan-500/20'}`}>
          <p className="text-[10px] font-mono font-bold uppercase text-slate-500 mb-1">Efficacité de Conversion</p>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-cyan-500">70.0%</span>
            <span className="text-xs text-slate-400 font-mono mb-1">de rendement standard GMP</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 mt-3 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `70%` }}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
              className="bg-cyan-500 h-1.5 rounded-full" 
            />
          </div>
        </div>
        
        {/* Production vs Consommation */}
        <div className={`p-4 rounded-2xl border transition-all duration-300 group-hover:border-blue-300/50 ${themeMode === 'light' ? 'bg-white/80 backdrop-blur border-cyan-100 shadow-sm' : 'bg-black/20 backdrop-blur border-cyan-500/20'}`}>
          <p className="text-[10px] font-mono font-bold uppercase text-slate-500 mb-1">Ratio de Production</p>
          <div className="flex items-center gap-4 mt-2">
            <div>
              <span className="text-xl font-bold text-slate-700 dark:text-slate-200">{Math.round(currentMetrics.waterEvapM3).toLocaleString('fr-FR')}</span>
              <span className="text-xs text-slate-500 font-mono ml-1 block">m³ Eau Brute (SONEDE)</span>
            </div>
            <div className="text-slate-400">→</div>
            <div>
              <span className="text-xl font-bold text-cyan-600 dark:text-cyan-400">{Math.round(currentMetrics.waterEvapM3 * 0.7).toLocaleString('fr-FR')}</span>
              <span className="text-xs text-cyan-700/70 dark:text-cyan-500/80 font-mono ml-1 block">m³ Eau Purifiée (EP)</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Bento Grid: Charts & Alarms Console */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Row 1 / Col 1 & 2: Stacked Bar Chart, Yearly Comparison, & correlation graph */}
        <div className="lg:col-span-2 space-y-6">
          <YearlyComparisonChart data={MONTHLY_ENERGY_COMPARISON_HISTORY} themeMode={themeMode} />
          <StackedBarChart data={barChartData} themeMode={themeMode} />
          <LineTempEnergyChart data={TEMPERATURE_ENERGY_HISTORY} themeMode={themeMode} />
        </div>

        {/* Row 1 / Col 3: Donut & Alarms Panel */}
        <div className="space-y-6">
          <DonutChart 
            elecCO2={currentMetrics.elecCO2Tons}
            waterCO2={0} // Sonede CO2 ratio is 0
            gasoilCO2={currentMetrics.gasoilCO2Tons}
            themeMode={themeMode}
          />

          {/* Core equipment alarms panel */}
          <div className={`p-5 rounded-3xl border transition-all ${
            themeMode === 'light' 
              ? 'bg-white border-slate-200/80 shadow-xs' 
              : 'bg-slate-900/60 border-slate-800'
          }`}>
            <h3 className="font-display font-bold text-sm tracking-tight mb-4 flex items-center justify-between">
              <span>Sécurité des Unités Industrielles</span>
              <span className={`h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse`} />
            </h3>

            <div className="space-y-3.5">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-850">
                <div>
                  <span className="font-semibold text-xs block">Armoire 02 (HVAC Classé A/B)</span>
                  <span className="text-[10px] text-slate-400 font-mono">Formes Stériles Injectables</span>
                </div>
                {isHotAlert ? (
                  <span className="bg-red-500/10 text-red-500 border border-red-500/20 text-[10px] font-bold font-mono px-2 py-1 rounded-lg animate-pulse">
                    COOLDOWN MAXIMUM
                  </span>
                ) : (
                  <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[10px] font-bold font-mono px-2 py-1 rounded-lg">
                    NOMINAL
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-850">
                <div>
                  <span className="font-semibold text-xs block">Armoire 04 (Eau Glacée Process)</span>
                  <span className="text-[10px] text-slate-400 font-mono">Refroidissement Double-Jacket</span>
                </div>
                <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[10px] font-bold font-mono px-2 py-1 rounded-lg">
                  SURCHARGE MODÉRÉE
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-850">
                <div>
                  <span className="font-semibold text-xs block">Armoire 15 (Chaudière de Vapeur)</span>
                  <span className="text-[10px] text-slate-400 font-mono">Fluides Thermiques & autoclave</span>
                </div>
                <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[10px] font-bold font-mono px-2 py-1 rounded-lg">
                  STABLE
                </span>
              </div>
            </div>
            
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-sans mt-4 leading-normal">
              Les alarmes se basent sur l'index d'utilisation enregistré manuellement ou synchronisé via la passerelle de comptage Excel.
            </p>
          </div>
        </div>

      </div>

      {/* Capacity Audit / Load Anomalies Panel */}
      <div className={`p-6 rounded-3xl border transition-all ${
        themeMode === 'light' 
          ? 'bg-white border-slate-200/80 shadow-sm' 
          : 'bg-slate-900/60 border-slate-800 backdrop-blur-md'
      }`}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className={`font-display text-sm font-semibold flex items-center ${
              themeMode === 'light' ? 'text-slate-800' : 'text-slate-200'
            }`}>
              Audit de Capacité & Détection d'Anomalies <Sparkles className="w-3.5 h-3.5 ml-2 text-indigo-500" />
            </h3>
            <p className="text-[11px] font-mono text-slate-500 mt-1">Analyse du Taux de Charge vs. Calibre Maximum (Max A)</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(() => {
            const unusedAnomalies = cabinets.flatMap(c => 
              (c.equipments || []).map(eq => {
                const maxKVA = (eq.maxAmpere * 400 * 1.732) / 1000;
                const theoMaxKWh = maxKVA * 24 * 30;
                const loadFactor = ((eq.consumption / (theoMaxKWh || 1)) * 100).toFixed(2);
                return { ...eq, cabinetName: c.name, loadFactor: parseFloat(loadFactor) };
              })
            ).filter(eq => eq.consumption === 0 && eq.maxAmpere > 100).slice(0, 3);

            const highLoadAnomalies = cabinets.flatMap(c => 
              (c.equipments || []).map(eq => {
                const loadFactor = eq.consumption / eq.maxAmpere;
                return { ...eq, cabinetName: c.name, ratio: loadFactor };
              })
            ).filter(eq => eq.consumption > 0).sort((a, b) => b.ratio - a.ratio).slice(0, 2);

            const hasAnomalies = unusedAnomalies.length > 0 || highLoadAnomalies.length > 0;

            if (!hasAnomalies) {
              return (
                <div className="col-span-full flex flex-col items-center justify-center py-6 px-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl mx-auto w-full">
                  <div className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 mb-3">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">Aucune anomalie détectée</p>
                  <p className="text-xs font-mono text-emerald-500/70 mt-1 text-center">Taux de charge nominaux sur 100% du parc.</p>
                </div>
              );
            }

            return (
              <>
                {unusedAnomalies.map((eq, i) => (
                  <div key={`unused-${i}`} className="flex items-start space-x-3 p-3 rounded-2xl bg-amber-500/5 border border-amber-500/20">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                      <ShieldAlert className="w-4 h-4 text-amber-500" />
                    </div>
                    <div>
                      <p className={`text-xs font-bold ${themeMode === 'light' ? 'text-slate-800' : 'text-slate-200'}`}>{eq.name}</p>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5">{eq.cabinetName}</p>
                      <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium mt-1">Capacité non exploitée ou équipement en panne : Calibre {eq.maxAmpere}A avec 0 kWh consommés.</p>
                    </div>
                  </div>
                ))}
                
                {highLoadAnomalies.map((eq, i) => (
                  <div key={`highload-${i}`} className="flex items-start space-x-3 p-3 rounded-2xl bg-indigo-500/5 border border-indigo-500/20">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0">
                      <Activity className="w-4 h-4 text-indigo-500" />
                    </div>
                    <div>
                      <p className={`text-xs font-bold ${themeMode === 'light' ? 'text-slate-800' : 'text-slate-200'}`}>{eq.name}</p>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5">{eq.cabinetName}</p>
                      <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium mt-1">Ratio de charge élevé détecté : {eq.consumption.toLocaleString('fr-FR')} kWh pour seulement {eq.maxAmpere}A.</p>
                    </div>
                  </div>
                ))}
              </>
            );
          })()}
        </div>
      </div>

      {/* Solar vs Network &  Arborescence Treemap View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
         <SolarVsNetworkChart data={MONTHLY_SOLAR_HISTORY} themeMode={themeMode} />
         <CabinetTreemap cabinets={cabinets} themeMode={themeMode} />
      </div>
    </div>
  );
};
