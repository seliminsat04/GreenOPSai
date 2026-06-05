import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Settings, Check, Droplets, Zap, Flame, Info, Volume2, VolumeX } from 'lucide-react';
import { Cabinet, UtilityTariffs } from '../types';
import { playSound, getAudioMuted, setAudioMuted } from '../utils/audio';
import { GoogleSheetsSync } from './GoogleSheetsSync';

interface SettingsTabProps {
  tariffs: UtilityTariffs;
  setTariffs: React.Dispatch<React.SetStateAction<UtilityTariffs>>;
  themeMode: 'dark' | 'light';
  setThemeMode: (theme: 'dark' | 'light') => void;
  cabinets: Cabinet[];
  setCabinets: React.Dispatch<React.SetStateAction<Cabinet[]>>;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  tariffs,
  setTariffs,
  themeMode,
  setThemeMode,
  cabinets,
  setCabinets
}) => {
  const [muted, setMuted] = useState(getAudioMuted());

  const handleTariffChange = (key: keyof UtilityTariffs, val: number) => {
    playSound('input');
    setTariffs(prev => ({
      ...prev,
      [key]: val
    }));
  };

  const handleSetTheme = (theme: 'dark' | 'light') => {
    setThemeMode(theme);
    playSound('success');
  };

  const handleToggleMute = () => {
    const nextMute = !muted;
    setAudioMuted(nextMute);
    setMuted(nextMute);
    if (!nextMute) {
      playSound('success');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-800 dark:text-slate-200">
      
      {/* Settings general banner */}
      <div className={`p-6 rounded-3xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
        themeMode === 'light' 
          ? 'bg-white border-slate-200/80 shadow-xs' 
          : 'bg-slate-900/60 border-slate-800'
      }`}>
        <div>
          <h2 className="text-sm font-bold font-display text-slate-900 dark:text-slate-100 flex items-center space-x-2">
            <Settings className="w-5 h-5 text-emerald-500 animate-spin-slow shrink-0" />
            <span>Coefficients Énergétiques de Référence & ANME</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">Saisir les barèmes de la STEG, SONEDE, les taxes hydrocarbures de l'Ariana, et les intensités carbones d'imputation légale.</p>
        </div>
      </div>

      {/* Grid of tariff sectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Box 1: Tariffs */}
        <div className={`p-6 rounded-3xl border space-y-4.5 ${
          themeMode === 'light' 
            ? 'bg-white border-slate-200/80 shadow-xs' 
            : 'bg-slate-900/40 border-slate-800'
        }`}>
          <h3 className="text-xs font-semibold text-emerald-500 uppercase tracking-widest font-mono border-b border-slate-100 dark:border-slate-850 pb-2.5">
            Barèmes Financiers Nationaux (TND Tunisie)
          </h3>

          <div className="space-y-4">
            {/* STEG */}
            <div className="space-y-1.5 shadow-5xs p-1">
              <label className="text-[11px] font-semibold text-slate-500 block">Tarif d'Électricité STEG Moyenne Tension (TND / kWh) :</label>
              <input 
                type="number" 
                step="0.001"
                value={tariffs.stegElectricity}
                onChange={(e) => handleTariffChange('stegElectricity', Number(e.target.value))}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 focus:border-emerald-500 font-mono text-xs font-bold text-slate-800 dark:text-slate-105 py-2 px-3 rounded-xl w-full focus:outline-none focus:ring-1 focus:ring-emerald-500/25 transition-all text-left"
              />
            </div>

            {/* SONEDE */}
            <div className="space-y-1.5 shadow-5xs p-1">
              <label className="text-[11px] font-semibold text-slate-500 block">Tarif d'Eau Purifiée & Station SONEDE (TND / m³) :</label>
              <input 
                type="number" 
                step="0.05"
                value={tariffs.sonedeWater}
                onChange={(e) => handleTariffChange('sonedeWater', Number(e.target.value))}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 focus:border-emerald-500 font-mono text-xs font-bold text-slate-800 dark:text-slate-105 py-2 px-3 rounded-xl w-full focus:outline-none focus:ring-1 focus:ring-emerald-500/25 transition-all text-left"
              />
            </div>

            {/* GASOIL */}
            <div className="space-y-1.5 shadow-5xs p-1">
              <label className="text-[11px] font-semibold text-slate-500 block">Tarif du Gasoil Industriel Chaudière (TND / Litre) :</label>
              <input 
                type="number" 
                step="0.05"
                value={tariffs.gasoilLiter}
                onChange={(e) => handleTariffChange('gasoilLiter', Number(e.target.value))}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 focus:border-emerald-500 font-mono text-xs font-bold text-slate-800 dark:text-slate-105 py-2 px-3 rounded-xl w-full focus:outline-none focus:ring-1 focus:ring-emerald-500/25 transition-all text-left"
              />
            </div>
          </div>
        </div>

        {/* Box 2: Ratios and Theming */}
        <div className={`p-6 rounded-3xl border space-y-4.5 ${
          themeMode === 'light' 
            ? 'bg-white border-slate-200/80 shadow-xs' 
            : 'bg-slate-900/40 border-slate-800'
        }`}>
          <h3 className="text-xs font-semibold text-blue-500 uppercase tracking-widest font-mono border-b border-slate-100 dark:border-slate-850 pb-2.5">
            Coefficients Carbone Réglementaires (ANME)
          </h3>

          <div className="space-y-4">
            {/* CO2 Elec */}
            <div className="space-y-1.5 shadow-5xs p-1">
              <label className="text-[11px] font-semibold text-slate-500 block">Intensité Carbone Électricité (kg CO₂ / kWh) :</label>
              <input 
                type="number" 
                step="0.01"
                value={tariffs.co2Electricity}
                onChange={(e) => handleTariffChange('co2Electricity', Number(e.target.value))}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 focus:border-emerald-500 font-mono text-xs font-bold text-slate-800 dark:text-slate-105 py-2 px-3 rounded-xl w-full focus:outline-none focus:ring-1 focus:ring-emerald-500/25 transition-all text-left"
              />
            </div>

            {/* CO2 Gasoil */}
            <div className="space-y-1.5 shadow-5xs p-1">
              <label className="text-[11px] font-semibold text-slate-500 block">Intensité Carbone Gasoil de Vapeur (kg CO₂ / Litre) :</label>
              <input 
                type="number" 
                step="0.01"
                value={tariffs.co2Gasoil}
                onChange={(e) => handleTariffChange('co2Gasoil', Number(e.target.value))}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 focus:border-emerald-500 font-mono text-xs font-bold text-slate-800 dark:text-slate-105 py-2 px-3 rounded-xl w-full focus:outline-none focus:ring-1 focus:ring-emerald-500/25 transition-all text-left"
              />
            </div>

            {/* Theming and Sound buttons */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-850 space-y-3">
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 block mb-1">Thème Visuel :</label>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleSetTheme('light')}
                      className={`flex-1 py-2 text-xs font-bold font-display rounded-xl border transition-all cursor-pointer ${
                        themeMode === 'light' 
                          ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 shadow-xs' 
                          : 'bg-slate-950 border-slate-850 text-slate-450 hover:text-slate-350'
                      }`}
                    >
                      Clair
                    </button>
                    
                    <button 
                      onClick={() => handleSetTheme('dark')}
                      className={`flex-1 py-2 text-xs font-bold font-display rounded-xl border transition-all cursor-pointer ${
                        themeMode === 'dark' 
                          ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' 
                          : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-500 dark:hover:text-slate-300'
                      }`}
                    >
                      Sombre
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-500 block mb-1">Retours Audio UI :</label>
                  <button
                    onClick={handleToggleMute}
                    className={`w-full py-2 px-3 text-xs font-bold font-display rounded-xl border transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                      !muted
                        ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-600 dark:text-indigo-400'
                        : 'bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-850 text-slate-400'
                    }`}
                  >
                    {!muted ? (
                      <>
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Actifs</span>
                      </>
                    ) : (
                      <>
                        <VolumeX className="w-3.5 h-3.5" />
                        <span>Muets</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Google Sheets Live Synchronization Engine */}
      <GoogleSheetsSync 
        themeMode={themeMode} 
        cabinets={cabinets} 
        setCabinets={setCabinets} 
      />

      {/* Auto propograte notes */}
      <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs p-4 rounded-2xl flex items-start space-x-2.5 max-w-2xl leading-normal font-sans shadow-inner">
        <Check className="w-5 h-5 shrink-0 mt-0.5" />
        <span>Toutes les modifications tarifaires STEG/SONEDE se répercutent dynamiquement et d'une manière instantanée sur les simulateurs thermovoltaïques, l'ensemble des 15 compteurs géographiques d'index, et la tarification lot analytique d'Opalia Ariana.</span>
      </div>

    </div>
  );
};
