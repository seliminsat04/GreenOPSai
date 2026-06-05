import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileSpreadsheet, RefreshCw, CheckCircle2, ChevronRight, X, AlertTriangle } from 'lucide-react';

interface ExcelImportModalProps {
  isOpen: boolean;
  step: number;
  onClose: () => void;
}

export const ExcelImportModal: React.FC<ExcelImportModalProps> = ({ isOpen, step, onClose }) => {
  if (!isOpen) return null;

  const steps = [
    { title: "Connexion sécurisée", desc: "Authentification auprès du serveur d'Ariana Tunis..." },
    { title: "Parsing de la feuille de calcul", desc: "Lecture de 'releves_comptage_opalia_2026.xlsx'..." },
    { title: "Validation des index technologiques", desc: "Vérification des 15 compteurs de l'usine..." },
    { title: "Intégration d'index complétée", desc: "Mise à jour immédiate du cockpit énergétique." }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop glass */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={step === 3 ? onClose : undefined}
          className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
        />

        {/* Modal body */}
        <motion.div 
          initial={{ scale: 0.95, y: 15, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.95, y: 15, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 350 }}
          className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl max-w-md w-full overflow-hidden text-slate-800 dark:text-slate-200 z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                <FileSpreadsheet className="w-5.5 h-5.5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base">Passerelle Excel Opalia</h3>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">Synchronisation d'usine automatisée</p>
              </div>
            </div>
            {step === 3 && (
              <button 
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-850 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Stepper Progress Bar */}
          <div className="my-6">
            <div className="flex items-center justify-between mb-2 text-xs font-mono">
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                {step === 3 ? "Processus complété" : `Phase ${step + 1} sur 4...`}
              </span>
              <span className="text-slate-400">
                {Math.round(((step + 1) / 4) * 100)}%
              </span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-emerald-500 to-blue-600"
                initial={{ width: "25%" }}
                animate={{ width: `${((step + 1) / 4) * 100}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </div>

          {/* Steps List */}
          <div className="space-y-4">
            {steps.map((s, index) => {
              const isPassed = step > index;
              const isActive = step === index;
              const isFuture = step < index;

              return (
                <div 
                  key={index}
                  className={`flex items-start space-x-3 p-3 rounded-2xl transition-colors ${
                    isActive 
                      ? 'bg-slate-50 dark:bg-slate-850/60 border border-slate-100 dark:border-slate-800' 
                      : 'border border-transparent'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {isPassed ? (
                      <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                    ) : isActive ? (
                      <div className="w-5 h-5 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 flex items-center justify-center text-[10px] font-bold font-mono text-slate-400">
                        {index + 1}
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <h5 className={`text-xs font-semibold ${
                      isActive 
                        ? 'text-slate-900 dark:text-slate-100' 
                        : isPassed 
                        ? 'text-slate-500 dark:text-slate-400 line-through decoration-slate-300/40' 
                        : 'text-slate-400'
                    }`}>
                      {s.title}
                    </h5>
                    {isActive && (
                      <motion.p 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-normal font-sans"
                      >
                        {s.desc}
                      </motion.p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer of modal */}
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-850 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Chiffrement SSL Actif</span>
            </div>
            {step === 3 ? (
              <button 
                onClick={onClose}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold font-display text-xs px-4 py-2 rounded-xl transition-all shadow-md shadow-emerald-500/10 cursor-pointer"
              >
                Fermer la passerelle
              </button>
            ) : (
              <span className="font-mono text-[10px] animate-pulse">Extraction de données ...</span>
            )}
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
