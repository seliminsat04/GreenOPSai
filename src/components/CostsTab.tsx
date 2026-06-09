import React from 'react';
import { motion } from 'framer-motion';
import { Search, Info, Coins, Sparkles, TrendingDown, Layers, HelpCircle } from 'lucide-react';
import { ProductMetrics } from '../types';

interface CostsTabProps {
  products: ProductMetrics[];
  searchProductQuery: string;
  setSearchProductQuery: (val: string) => void;
  themeMode: 'dark' | 'light';
}

export const CostsTab: React.FC<CostsTabProps> = ({
  products,
  searchProductQuery,
  setSearchProductQuery,
  themeMode
}) => {

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchProductQuery.toLowerCase()) ||
    p.id.toLowerCase().includes(searchProductQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Table search filter strip */}
      <div className={`p-4 rounded-3xl border flex items-center justify-between gap-4 ${
        themeMode === 'light' 
          ? 'bg-white border-slate-200/80 shadow-xs' 
          : 'bg-slate-900/60 border-slate-800'
      }`}>
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Rechercher une référence de médicament (Amox, Sirop...)"
            value={searchProductQuery}
            onChange={(e) => setSearchProductQuery(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-850 py-2.5 pl-9 pr-4 rounded-xl text-xs focus:outline-none focus:border-indigo-500 font-sans tracking-wide transition-all"
          />
        </div>

        <div className="text-[11px] font-mono text-slate-400 flex items-center space-x-1 font-semibold">
          <Layers className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>Fiche d'imputation analytique (Forme / Galénique)</span>
        </div>
      </div>

      {/* Main analytical container */}
      <div className={`rounded-3xl border overflow-hidden transition-all ${
        themeMode === 'light' 
          ? 'bg-white border-slate-200/80 shadow-xs' 
          : 'bg-slate-900/60 border-slate-800'
      }`}>
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-850">
          <h4 className="font-display font-bold text-sm tracking-tight text-slate-900 dark:text-slate-100">Imputation des Lots de Production d'Ariana</h4>
          <p className="text-[10px] text-slate-400 mt-0.5">Ventilation des charges STEG directes de fabrication et d'HVAC indirect des zones atmosphériques classifiées</p>
        </div>

        {/* Tabular data sheet */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950/60 border-b border-slate-100 dark:border-slate-850 text-slate-500 uppercase font-mono text-[9px] tracking-widest font-semibold">
                <th className="py-3 px-6">Code Produit Target</th>
                <th className="py-3 px-6">Dénomination Spécialité</th>
                <th className="py-3 px-6 text-right">Cadence Planifiée (lots/mois)</th>
                <th className="py-3 px-6 text-right">Index Direct Propre</th>
                <th className="py-3 px-6 text-right">Prorata Indirect HVAC</th>
                <th className="py-3 px-6 text-right">Coût Consolidated</th>
                <th className="py-3 px-6 w-40">Répartition Charge Direct/Indirect</th>
                <th className="py-3 px-6 text-right">Coût Direct / 1000u</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-850 font-sans">
              {filteredProducts.map((p) => {
                const total = p.directCostTnd + p.indirectProratedTnd;
                const directPercent = total > 0 ? (p.directCostTnd / total) * 100 : 50;
                
                return (
                  <tr 
                    key={p.id} 
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors"
                  >
                    {/* ID */}
                    <td className="py-4 px-6 font-mono font-bold text-[10px] text-slate-400 capitalize">
                      {p.id.replace('p-', 'OPL-')}
                    </td>

                    {/* Technical Title */}
                    <td className="py-4 px-6 font-semibold text-slate-800 dark:text-slate-100">
                      {p.name}
                    </td>

                    {/* Lots number */}
                    <td className="py-4 px-6 text-right font-mono font-bold">
                      {p.lotsPerMonth} <span className="text-[10px] text-slate-400 font-normal">lots</span>
                    </td>

                    {/* Direct energetic cost */}
                    <td className="py-4 px-6 text-right font-mono font-bold text-slate-600 dark:text-slate-200">
                      {Math.round(p.directCostTnd).toLocaleString('fr-FR')} TND
                    </td>

                    {/* Indirect CTA cost */}
                    <td className="py-4 px-6 text-right font-mono font-bold text-slate-500">
                      {Math.round(p.indirectProratedTnd).toLocaleString('fr-FR')} TND
                    </td>

                    {/* Total cost */}
                    <td className="py-4 px-6 text-right font-mono font-extrabold text-slate-800 dark:text-slate-200">
                      {Math.round(total).toLocaleString('fr-FR')} TND
                    </td>

                    {/* Direct vs indirect ratio miniature bar gauge */}
                    <td className="py-4 px-6">
                      <div className="space-y-1.5 w-full">
                        <div className="h-2 w-full bg-slate-100 dark:bg-slate-850 rounded-full overflow-hidden flex">
                          <div 
                            className="h-full bg-emerald-500 rounded-l-full" 
                            style={{ width: `${directPercent}%` }} 
                            title={`Direct: ${directPercent.toFixed(0)}%`}
                          />
                          <div 
                            className="h-full bg-blue-600 rounded-r-full" 
                            style={{ width: `${100 - directPercent}%` }} 
                            title={`Indirect: ${(100 - directPercent).toFixed(0)}%`}
                          />
                        </div>
                        <div className="flex justify-between text-[9px] font-mono text-slate-400">
                          <span className="text-emerald-500 font-bold">{directPercent.toFixed(0)}% Dir</span>
                          <span className="text-blue-500 font-bold">{(100 - directPercent).toFixed(0)}% Ind</span>
                        </div>
                      </div>
                    </td>

                    {/* 1000 units target boxes direct cost */}
                    <td className="py-4 px-6 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-slate-50/40 dark:bg-slate-950/20">
                      {p.costPer1000Units.toFixed(2)} TND
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Dynamic calculation Methodology disclaimer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-100 dark:border-slate-850 flex items-start space-x-3 text-xs text-slate-500 leading-relaxed font-sans">
          <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-slate-850 dark:text-slate-300 block font-display">Méthodologie d'Imputation Analytique d'Opalia :</span>
            <p className="mt-0.5 text-slate-400 text-[11px]">
              Le coût direct de procédé correspond fidèlement aux index enregistrés par les armoires d'unités de production (granulateur, thermoformeuse, double-jacket cuivre, etc.) multiplié par le barème STEG en vigueur. L'overhead indirect (climatisation HVAC pour maintenir les pressions et gradients d'air des CTA) est consolidé globalement et réimputé sous forme de prorata d'occupation volumétrique aux produits actifs.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
