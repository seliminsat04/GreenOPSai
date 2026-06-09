import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, Sparkles, TrendingDown, RefreshCw, X, Leaf, Zap, DollarSign, Activity } from 'lucide-react';

interface KPIDiagnosticsProps {
  selectedKPI: "energy" | "carbon" | "lot" | "savings" | null;
  onClose: () => void;
  temp: number;
  indirectPct: number;
  savingEstimatedTnd: number;
}

export const KPIDiagnostics: React.FC<KPIDiagnosticsProps> = ({ 
  selectedKPI, 
  onClose, 
  temp, 
  indirectPct,
  savingEstimatedTnd
}) => {
  if (!selectedKPI) return null;

  const content = {
    energy: {
      title: "Diagnostic : Efficacité Énergétique Globale",
      concept: "Charge HVAC & Puissance Appelée",
      icon: Zap,
      colorClass: "text-amber-500 bg-amber-500/10 border-amber-500/20",
      description: `La consommation énergétique globale est influencée à ${(100 - indirectPct)}% par les procédés directs de production (autoclaves, thermoformeuses, et granulations), et à ${indirectPct}% par la régulation des CTA d'air (chauffage/refroidissement indirect).`,
      advice: temp >= 38 
        ? "⚠️ Température externe critique de " + temp + "°C détectée. L'efficacité des groupes d'eau glacée diminue. Envisager un lissage de charge de granulation (Armoire 10) aux heures creuses STEG pour limiter la pointe de puissance de l'usine d'Ariana."
        : "🟢 Température de " + temp + "°C dans la plage de régulation nominale. Les CTA fonctionnent à taux d'air de renouvellement optimisé. Maintien de l'HVAC en mode d'économie nocturne recommandé pendant les week-ends.",
      formula: "E_total = ∑ E_process_direct + (UA_cta * (T_ext - T_consigne) * P_indirect_prorata)"
    },
    carbon: {
      title: "Diagnostic : Empreinte Carbone & Ratios ANME",
      concept: "Intensité Carbone de la Vapeur & Mix Énergétique",
      icon: Leaf,
      colorClass: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
      description: "L'empreinte carbone consolidée de l'usine Opalia Recordati dépend des ratios réglementaires de l'ANME Tunisie. L'utilisation du Gasoil pour la génération de vapeur (Armoire 15) présente un ratio carbone de 2.68 kg CO₂/Litre, par rapport à l'électricité STEG à 0.52 kg CO₂/kWh.",
      advice: "💡 Afin de réduire substantiellement l'empreinte de 12.5 tonnes CO₂ mesurée ce mois-ci, l'intégration d'un économiseur thermique sur la boucle de retour de condensat vapeur (stérilisateurs autoclaves) permettrait d'économiser 8% de gasoil, soit environ 1.5 tonne CO₂ d'émissions prévenues à l'atmosphère.",
      formula: "Empreinte_CO₂ = (E_steg_kwh * 0.52) + (Gasoil_litres * 2.68) / 1000"
    },
    lot: {
      title: "Diagnostic : Coût Unitaire Direct de Production",
      concept: "Imputation Énergétique par Code Produit",
      icon: Activity,
      colorClass: "text-blue-500 bg-blue-500/10 border-blue-500/20",
      description: "Le coût par lot de production intègre l'électricité machine directe et le prorata indirect de la climatisation volumétrique. Le Paracétamol (Comprimés) présente une charge de granulation à haute intensité, tandis que les Sirops requièrent d'importantes charges de chauffe de cuves double enveloppe.",
      advice: "🔍 Recommandation : Intégrer les compteurs divisionnaires d'Ariana en temps réel sur l'Armoire 08 (Crèmes & Pommades) pour affiner la tarification analytique. Le coût actuel de 3.45 TND par millier de boîtes est influencé par une sur-imputation indirecte de CTA aux zones non critiques.",
      formula: "Coût_lot = (K_conso_direct * Tarif_STEG) + (V_lot / V_total * Coût_HVAC_indirect)"
    },
    savings: {
      title: "Diagnostic : Économies & Amortissements Thermiques",
      concept: "Gains Prédictifs sur d'Élasticité",
      icon: DollarSign,
      colorClass: "text-purple-500 bg-purple-500/10 border-purple-500/20",
      description: `Le gisement d'économies estimé à ${savingEstimatedTnd.toLocaleString('fr-FR')} TND est calculé par rapport à une température extérieure idéale de 22°C et un taux de charge CTA optimal de 15%.`,
      advice: "🚀 Plan d'action : La réduction du taux d'occupation HVAC de " + indirectPct + "% à 18% par l'ajustement dynamique de vitesse des ventilateurs CTA génère un retour sur investissement évalué à moins de 8 mois. C'est l'axe de décarbonation le plus rentable pour la direction générale d'Opalia.",
      formula: "Gains_estimes = ∑ Coût_baseline - ∑ Coût_simulé"
    }
  }[selectedKPI];

  const IconComp = content.icon;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-40 flex items-center justify-end pointer-events-none">
        {/* Underlay mask clickable */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/20 backdrop-blur-[2px] pointer-events-auto"
        />

        {/* Diagnostic Dialog sliding from right */}
        <motion.div 
          initial={{ x: "100%", opacity: 0.5 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "100%", opacity: 0.5 }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="relative h-full max-w-md w-full bg-white dark:bg-slate-950/95 border-l border-slate-200 dark:border-slate-850 p-6 shadow-2xl flex flex-col justify-between pointer-events-auto text-slate-800 dark:text-slate-100 z-10"
        >
          {/* Main info block */}
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-850">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${content.colorClass}`}>
                  <IconComp className="w-5.5 h-5.5" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm tracking-tight text-slate-900 dark:text-slate-100">{content.title}</h4>
                  <p className="text-[10px] text-slate-400 font-mono tracking-wide uppercase mt-0.5">{content.concept}</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-full hover:bg-slate-105 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* General Explanation description */}
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider">Concept Technologique</span>
                <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed mt-1">{content.description}</p>
              </div>

              {/* Advice */}
              <div className="p-4 rounded-2xl bg-gradient-to-tr from-indigo-50/50 to-emerald-50/50 dark:from-slate-900/40 dark:to-emerald-950/20 border border-indigo-100/50 dark:border-slate-800">
                <span className="text-[10px] font-mono font-bold uppercase text-emerald-600 dark:text-emerald-400 tracking-wider flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5 mr-1 text-emerald-500" />
                  Recommandation Directe d'Adnen
                </span>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed mt-2">{content.advice}</p>
              </div>

              {/* Mathematical formula container */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-900 font-mono text-[10px] text-slate-300">
                <span className="text-[9px] font-mono text-slate-500 block uppercase tracking-wide mb-1.5">Équation Thermophysique d'Imputation :</span>
                <div className="text-indigo-300 dark:text-emerald-400 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 break-words leading-normal">
                  {content.formula}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom disclaimer */}
          <div className="pt-4 border-t border-slate-150 dark:border-slate-850 text-[10px] text-slate-400 flex items-center space-x-2">
            <Info className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>Mises à jour consolidées selon audit réglementaire d'Ariana 2026.</span>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
