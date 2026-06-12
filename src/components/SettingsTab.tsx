import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Check, Droplets, Zap, Flame, Info, Volume2, VolumeX, Shield, Fingerprint, Lock } from 'lucide-react';
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
  const [strictApproval, setStrictApproval] = useState<boolean>(() => {
    return localStorage.getItem('greenops_ia_strict_approval') !== 'false';
  });
  const [partialAutonomy, setPartialAutonomy] = useState<boolean>(() => {
    return localStorage.getItem('greenops_ia_partial_autonomy') === 'true';
  });

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

  const handleToggleStrict = () => {
    const nextVal = !strictApproval;
    setStrictApproval(nextVal);
    localStorage.setItem('greenops_ia_strict_approval', String(nextVal));
    
    // Mutual exclusivity
    if (nextVal && partialAutonomy) {
      setPartialAutonomy(false);
      localStorage.setItem('greenops_ia_partial_autonomy', 'false');
    }
    playSound('click');
  };

  const handleTogglePartial = () => {
    const nextVal = !partialAutonomy;
    setPartialAutonomy(nextVal);
    localStorage.setItem('greenops_ia_partial_autonomy', String(nextVal));
    
    // Mutual exclusivity
    if (nextVal && strictApproval) {
      setStrictApproval(false);
      localStorage.setItem('greenops_ia_strict_approval', 'false');
    }
    playSound('click');
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
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 focus:border-emerald-500 font-mono text-xs font-bold text-slate-800 dark:text-slate-100 py-2 px-3 rounded-xl w-full focus:outline-none focus:ring-1 focus:ring-emerald-500/25 transition-all text-left"
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
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 focus:border-emerald-500 font-mono text-xs font-bold text-slate-800 dark:text-slate-100 py-2 px-3 rounded-xl w-full focus:outline-none focus:ring-1 focus:ring-emerald-500/25 transition-all text-left"
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
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 focus:border-emerald-500 font-mono text-xs font-bold text-slate-800 dark:text-slate-100 py-2 px-3 rounded-xl w-full focus:outline-none focus:ring-1 focus:ring-emerald-500/25 transition-all text-left"
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
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 focus:border-emerald-500 font-mono text-xs font-bold text-slate-800 dark:text-slate-100 py-2 px-3 rounded-xl w-full focus:outline-none focus:ring-1 focus:ring-emerald-500/25 transition-all text-left"
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
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 focus:border-emerald-500 font-mono text-xs font-bold text-slate-800 dark:text-slate-100 py-2 px-3 rounded-xl w-full focus:outline-none focus:ring-1 focus:ring-emerald-500/25 transition-all text-left"
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

      {/* Dynamic IA Autonomy control panel (FDA / GMP / Human-in-the-Loop) */}
      <div className={`p-6 rounded-3xl border space-y-5 ${
        themeMode === 'light' 
          ? 'bg-white border-slate-200/80 shadow-xs' 
          : 'bg-slate-900/40 border-slate-800'
      }`}>
        <div className="flex items-start space-x-3 border-b border-slate-100 dark:border-slate-850 pb-4">
          <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-500 shrink-0">
            <Shield className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-amber-500 uppercase tracking-widest font-mono">
              Contrôle de l'Autonomie de l'IA (Human-in-the-Loop)
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Pour garantir la conformité réglementaire pharmaceutique (normes GMP / GAMP 5 / FDA 21 CFR Part 11) et la sécurité opérationnelle d'Opalia Ariana, définissez le niveau de contrôle ou d'autonomie accordé à l'assistant GreenOpsAI.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5.5">
          {/* Toggle 1: Approach mode strict */}
          <div className={`p-4.5 rounded-2xl border transition-all ${
            strictApproval 
              ? 'bg-emerald-500/5 border-emerald-500/20 dark:border-emerald-500/30' 
              : 'bg-slate-50/50 dark:bg-slate-950/40 border-slate-200/50 dark:border-slate-850'
          }`}>
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className={`w-2 h-2 rounded-full ${strictApproval ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                  <b className="text-xs text-slate-800 dark:text-slate-100 font-display">Mode d'Approbation Strict (Par défaut)</b>
                </div>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-normal font-sans">
                  Oblige l'IA à afficher une carte de confirmation interactive dans le chat (ex: <i>« Voulez-vous que j'envoie ce rapport à Selim Manai ? »</i>) avant de déclencher l'API Gmail ou de planifier des réunions de maintenance sur Google Calendar.
                </p>
              </div>

              {/* IOS Styled Toggle Switch */}
              <button
                onClick={handleToggleStrict}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  strictApproval ? 'bg-[#79b823]' : 'bg-slate-200 dark:bg-slate-800'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    strictApproval ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Toggle 2: Autonomie partielle */}
          <div className={`p-4.5 rounded-2xl border transition-all ${
            partialAutonomy 
              ? 'bg-blue-500/5 border-blue-500/20 dark:border-blue-500/30' 
              : 'bg-slate-50/50 dark:bg-slate-950/40 border-slate-200/50 dark:border-slate-850'
          }`}>
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className={`w-2 h-2 rounded-full ${partialAutonomy ? 'bg-blue-500' : 'bg-slate-400'}`} />
                  <b className="text-xs text-slate-800 dark:text-slate-100 font-display">Mode Autonomie Partielle</b>
                </div>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-normal font-sans">
                  L'IA est autorisée à éditer les feuilles Google Sheets en arrière-plan en temps réel, mais requiert une signature ou validation numérique sécurisée (double authentification d'opérateur) pour l'envoi d'emails officiels ou la planification d'inspections critiques.
                </p>
              </div>

              {/* IOS Styled Toggle Switch */}
              <button
                onClick={handleTogglePartial}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  partialAutonomy ? 'bg-blue-500' : 'bg-slate-200 dark:bg-slate-800'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    partialAutonomy ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-950/50 rounded-2xl p-4 border border-slate-150 dark:border-slate-850 text-[11px] text-slate-400 dark:text-slate-500 space-y-1.5 font-sans leading-relaxed">
          <div className="flex items-center space-x-1.5 text-xs text-slate-700 dark:text-slate-350 font-bold font-display">
            <Lock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>Cadre de Traçabilité FDA 21 CFR Part 11</span>
          </div>
          <p>
            Tout contournement ou désactivation de l'approbation humaine sur les systèmes d'exploitation d'Opalia invalidera le certificat de libération d'énergie. Les signatures sont consignées avec horodatage immuable (Tunis UTC+1) dans l'Audit Trail.
          </p>
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
