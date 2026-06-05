import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, Sliders, Database, Coins, Bot, Settings, 
  Menu, X, Sun, Moon, Calendar, MapPin, Activity, HelpCircle, ShieldAlert, Sparkles, TrendingDown, Leaf, CheckCircle2,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { 
  DEFAULT_TARIFFS, 
  INITIAL_CABINETS, 
  INITIAL_PRODUCTS, 
  TEMPERATURE_ENERGY_HISTORY,
  MOCK_RELEVEE_HISTORY
} from './data';
import { Cabinet, ProductMetrics, UtilityTariffs, ChatMessage } from './types';

// Modular Components (Lazy loaded for high-performance route code splitting)
const DashboardTab = lazy(() => import('./components/DashboardTab').then(m => ({ default: m.DashboardTab })));
const SimulatorTab = lazy(() => import('./components/SimulatorTab').then(m => ({ default: m.SimulatorTab })));
const RelevesTab = lazy(() => import('./components/RelevesTab').then(m => ({ default: m.RelevesTab })));
const CostsTab = lazy(() => import('./components/CostsTab').then(m => ({ default: m.CostsTab })));
const ChatTab = lazy(() => import('./components/ChatTab').then(m => ({ default: m.ChatTab })));
const SettingsTab = lazy(() => import('./components/SettingsTab').then(m => ({ default: m.SettingsTab })));

import { ExcelImportModal } from './components/ExcelImportModal';
import { KPIDiagnostics } from './components/KPIDiagnostics';
import { AuthScreen } from './components/AuthScreen';
import { playSound } from './utils/audio';
import { LogOut } from 'lucide-react';

const LoadingFallback = () => (
  <div className="flex flex-col items-center justify-center py-24 min-h-[350px] animate-fade-in space-y-4">
    <div className="relative flex items-center justify-center">
      <div className="w-12 h-12 rounded-full border-4 border-emerald-500/10 border-t-[#79b823] animate-spin" />
      <div className="absolute w-6 h-6 rounded-full bg-[#79b823]/20 animate-ping" />
    </div>
    <div className="text-center">
      <p className="text-xs font-bold text-slate-800 dark:text-slate-205 tracking-wide uppercase">
        Chargement du module d'usine...
      </p>
      <p className="text-[10px] text-slate-400 mt-1 font-mono">
        Raccordement de l'infrastructure locale Opalia • Tunis
      </p>
    </div>
  </div>
);

export default function App() {
  // ---- Global Application State ----
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; role: string } | null>(() => {
    try {
      const saved = localStorage.getItem('greenops_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });
  const [activeTab, setActiveTab] = useState<'dashboard' | 'simulator' | 'releves' | 'costs' | 'chat' | 'settings'>('dashboard');
  const [tariffs, setTariffs] = useState<UtilityTariffs>(DEFAULT_TARIFFS);
  const [cabinets, setCabinets] = useState<Cabinet[]>([]);
  const [products, setProducts] = useState<ProductMetrics[]>(INITIAL_PRODUCTS);
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>('light');
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });

  // Setup connection detection listeners for Opalia factory plant
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setImportNotification("🔌 Réseau rétabli ! L'intelligence artificielle GreenOpsAI est pleinement opérationnelle.");
      setTimeout(() => setImportNotification(null), 4500);
    };
    const handleOffline = () => {
      setIsOnline(false);
      setImportNotification("📶 Perte de signal temporaire dans l'usine. Passage automatique en mode Service Worker local.");
      setTimeout(() => setImportNotification(null), 5500);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // ---- Simulator Slider State ----
  const [outsideTemp, setOutsideTemp] = useState<number>(31); // In °C
  const [indirectPct, setIndirectPct] = useState<number>(24); // In %
  const [productLots, setProductLots] = useState<{ [key: string]: number }>({
    'p-para': 120,
    'p-sirop': 80,
    'p-amox': 95,
    'p-pommade': 60,
    'p-blister': 150
  });

  // ---- Advanced UX Interactive States ----
  const [isImportingExcel, setIsImportingExcel] = useState<boolean>(false);
  const [importExcelStep, setImportExcelStep] = useState<number>(0);
  const [searchCabinetQuery, setSearchCabinetQuery] = useState<string>('');
  const [searchProductQuery, setSearchProductQuery] = useState<string>('');
  const [selectedKPI, setSelectedKPI] = useState<"energy" | "carbon" | "lot" | "savings" | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

  // ---- Saisie des Relevés States ----
  const [releveTab, setReleveTab] = useState<'electricite' | 'eau' | 'gasoil'>('electricite');
  const [editableCabinets, setEditableCabinets] = useState<Cabinet[]>([]);
  const [importNotification, setImportNotification] = useState<string | null>(null);

  // ---- Chat state ----
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'assistant',
      content: "👋 Bonjour Adnen ! Bienvenue sur l'Assistant IA **GreenOpsAI**. Je suis connecté aux capteurs d'Opalia Recordati. Je peux vous aider à formuler des recommandations d'effacement thermique pour les CTA de l'**Armoire 2**, analyser vos consommations de vapeur (Vapeur Gasoil), ou simuler l'impact d'une canicule à Tunis sur votre puissance STEG souscrite.",
      timestamp: new Date()
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isBotLoading, setIsBotLoading] = useState(false);
  const [botLoaderTip, setBotLoaderTip] = useState('');

  // Real-time ticking clock for Tunis
  const [currentTime, setCurrentTime] = useState<string>('');
  useEffect(() => {
    setCurrentTime(new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    const ticker = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(ticker);
  }, []);

  // Sync custom greeting message when user logs in
  useEffect(() => {
    if (currentUser) {
      setChatMessages([
        {
          id: 'init-1',
          role: 'assistant',
          content: `👋 Bonjour **${currentUser.name}** ! Bienvenue sur l'Assistant IA **GreenOpsAI**. Je suis connecté aux capteurs d'Opalia Recordati. Je peux vous aider à formuler des recommandations d'effacement thermique pour les CTA de l'**Armoire 2**, analyser vos consommations de vapeur (Vapeur Gasoil), ou simuler l'impact d'une canicule à Tunis sur votre puissance STEG souscrite. Vous êtes authentifié en tant que **${currentUser.role}**.`,
          timestamp: new Date()
        }
      ]);
    }
  }, [currentUser]);

  // Loading animation tips for industry realism
  const botTips = [
    "Analyse thermodynamique des Centrales de Traitement d'Air (CTA)...",
    "Calcul en temps réel du facteur de charge des compresseurs d'eau glacée...",
    "Évaluation du prorata énergétique indirect par lot d'Amoxicilline...",
    "Vérification des taux de récupération de chaleur sur le réseau vapeur gasoil...",
    "Connexion au modèle d'analyse prédictive Opalia Core..."
  ];

  // Initialize cabinets from local storage if existing, otherwise from baseline on mount
  useEffect(() => {
    let base = INITIAL_CABINETS;
    try {
      const saved = localStorage.getItem('greenops_cabinets');
      if (saved) {
        base = JSON.parse(saved);
      }
    } catch (e) {
      console.warn("Could not load cabinets from localStorage. Using baseline data.", e);
    }
    const updated = base.map(c => {
      const consumption = (c.endIndex - c.startIndex) * c.multiplier;
      return { ...c, consumption };
    });
    setCabinets(updated);
    setEditableCabinets(updated);
  }, []);

  const saveReleves = () => {
    setCabinets(editableCabinets);
    try {
      localStorage.setItem('greenops_cabinets', JSON.stringify(editableCabinets));
    } catch (e) {
      console.error("Could not persist cabinets to localStorage", e);
    }
    setImportNotification("📈 Relevés manuels enregistrés avec succès ! Données globales de l'usine synchronisées localement.");
    setTimeout(() => setImportNotification(null), 4000);
  };


  const handleExcelImportMock = () => {
    setIsImportingExcel(true);
    setImportExcelStep(0);
    
    // Step 0 -> Step 1 (600ms)
    setTimeout(() => {
      setImportExcelStep(1);
      
      // Step 1 -> Step 2 (1000ms)
      setTimeout(() => {
        setImportExcelStep(2);
        
        // Step 2 -> Step 3 (1200ms)
        setTimeout(() => {
          setImportExcelStep(3);
          
          setEditableCabinets(prev => {
            const updated = prev.map(c => {
              const bonus = Math.floor(Math.random() * 80) + 10;
              const start = c.startIndex;
              const end = c.endIndex + bonus;
              return {
                ...c,
                endIndex: end,
                consumption: (end - start) * c.multiplier
              };
            });
            setCabinets(updated);
            try {
              localStorage.setItem('greenops_cabinets', JSON.stringify(updated));
            } catch (e) {
              console.warn("Could not sync excel import values to localStorage", e);
            }
            return updated;
          });
          
          // Close and notify
          setTimeout(() => {
            setIsImportingExcel(false);
            setImportNotification("✅ Import Excel réussi ! Index de comptage et consommation des 15 armoires mis à jour.");
            setTimeout(() => setImportNotification(null), 5050);
          }, 1200);

        }, 1200);
      }, 1000);
    }, 600);
  };

  // ---- Simulation Physics Engine ----
  const currentMetrics = computeSimulation(outsideTemp, productLots, indirectPct, tariffs);
  const baselineLots = { 'p-para': 120, 'p-sirop': 80, 'p-amox': 95, 'p-pommade': 60, 'p-blister': 150 };
  const baselineMetrics = computeSimulation(22, baselineLots, 25, tariffs);

  function computeSimulation(temp: number, lots: { [key: string]: number }, indirect: number, currentTariffs: UtilityTariffs) {
    const para = lots['p-para'] ?? 0;
    const sirop = lots['p-sirop'] ?? 0;
    const amox = lots['p-amox'] ?? 0;
    const pommade = lots['p-pommade'] ?? 0;
    const blister = lots['p-blister'] ?? 0;

    const directElec = (para * 140) + (sirop * 210) + (amox * 320) + (pommade * 180) + (blister * 92);
    const directCost = directElec * currentTariffs.stegElectricity;

    const directGasoilLiters = (sirop * 40) + (amox * 35) + (pommade * 20);
    const directGasoilCost = directGasoilLiters * currentTariffs.gasoilLiter;

    const hvacBaseKwh = 44000;
    const tempExcess = Math.max(0, temp - 22);
    const tempFactor = 1 + (tempExcess * 0.015) + (tempExcess * tempExcess * 0.0008);
    const indirectElecKwh = hvacBaseKwh * tempFactor * (indirect / 25);
    const indirectElecCost = indirectElecKwh * currentTariffs.stegElectricity;

    const waterBaseM3 = 850;
    const waterEvapM3 = waterBaseM3 * (1 + tempExcess * 0.022) * (directElec / 100000);
    const waterCost = waterEvapM3 * currentTariffs.sonedeWater;

    const totalCost = directCost + directGasoilCost + indirectElecCost + waterCost;
    
    const totalElecKwh = directElec + indirectElecKwh;
    const elecCO2Tons = (totalElecKwh * currentTariffs.co2Electricity) / 1000;
    const gasoilCO2Tons = (directGasoilLiters * currentTariffs.co2Gasoil) / 1000;
    const totalCO2 = elecCO2Tons + gasoilCO2Tons;

    return {
      totalCost,
      totalCO2,
      directElec,
      directCost,
      directGasoilLiters,
      directGasoilCost,
      indirectElecKwh,
      indirectElecCost,
      waterEvapM3,
      waterCost,
      totalElecKwh,
      elecCO2Tons,
      gasoilCO2Tons,
    };
  }

  const totalProcessLots = (Object.values(productLots) as number[]).reduce((a, b) => a + b, 0) || 1;

  const updatedProductStructure = products.map(p => {
    const lotCount = productLots[p.id] ?? p.lotsPerMonth;
    const directKwh = p.directConsoKwh;
    const directCost = directKwh * tariffs.stegElectricity * lotCount;
    
    const lotRatio = lotCount / totalProcessLots;
    const indirectShareTnd = currentMetrics.indirectElecCost * lotRatio;
    
    const totalItemCost = directCost + indirectShareTnd;
    const costPer1000 = p.costPer1000Units * (tariffs.stegElectricity / 0.285);

    return {
      ...p,
      lotsPerMonth: lotCount,
      directCostTnd: directCost,
      indirectProratedTnd: indirectShareTnd,
      totalCostTnd: totalItemCost,
      costPer1000Units: costPer1000
    };
  });

  const savingEstimatedTnd = Math.max(0, baselineMetrics.totalCost - currentMetrics.totalCost);

  // ---- AI Interaction Chat Trigger ----
  const triggerChatBot = async (customQueryText?: string) => {
    const query = customQueryText || chatInput;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: query,
      timestamp: new Date()
    };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsBotLoading(true);

    let tipIndex = 0;
    setBotLoaderTip(botTips[0]);
    const timer = setInterval(() => {
      tipIndex = (tipIndex + 1) % botTips.length;
      setBotLoaderTip(botTips[tipIndex]);
    }, 1205);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: [...chatMessages, userMsg],
          currentMetrics: {
            temperature: outsideTemp,
            products: productLots,
            indirectPct: indirectPct,
            totalCost: Math.round(currentMetrics.totalCost),
            totalCO2: Math.round(currentMetrics.totalCO2)
          }
        })
      });

      const data = await response.json();
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || "Désolé, j'ai rencontré un problème pour interroger les capteurs d'Opalia en temps réel.",
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      const errMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "⚠️ **Erreur de flux** : Impossible de contacter la station de calcul locale. Veuillez réessayer.",
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, errMsg]);
    } finally {
      clearInterval(timer);
      setIsBotLoading(false);
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Tableau de Bord', icon: LayoutDashboard },
    { id: 'simulator', label: "Simulateur d'Élasticité", icon: Sliders },
    { id: 'releves', label: 'Saisie des Relevés', icon: Database },
    { id: 'costs', label: 'Structure Coûts & Lots', icon: Coins },
    { id: 'chat', label: 'Assistant IA & Conseil', icon: Bot },
    { id: 'settings', label: 'Paramètres Généraux', icon: Settings }
  ];

  const activeTabLabel = navItems.find(i => i.id === activeTab)?.label;

  const getInitials = (fullName: string) => {
    return fullName
      .split(' ')
      .map(n => n ? n[0] : '')
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  const handleLoginSuccess = (user: { name: string; email: string; role: string }) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('greenops_current_user', JSON.stringify(user));
    } catch (e) {}
  };

  const handleLogout = () => {
    playSound('alert');
    setCurrentUser(null);
    try {
      localStorage.removeItem('greenops_current_user');
    } catch (e) {}
  };

  if (!currentUser) {
    return <AuthScreen onLoginSuccess={handleLoginSuccess} themeMode={themeMode} />;
  }

  return (
    <div className={`h-[100dvh] overflow-hidden transition-colors duration-300 flex flex-col font-sans ${
      themeMode === 'light' ? 'bg-slate-50 text-slate-800' : 'bg-[#060913] text-slate-100 dark'
    }`}>
      
      {/* 🚀 Interactive modal overlays */}
      <ExcelImportModal isOpen={isImportingExcel} step={importExcelStep} onClose={() => setIsImportingExcel(false)} />
      <KPIDiagnostics selectedKPI={selectedKPI} onClose={() => setSelectedKPI(null)} temp={outsideTemp} indirectPct={indirectPct} savingEstimatedTnd={savingEstimatedTnd} />

      {/* Main Container frame */}
      <div className="flex-1 flex flex-col md:flex-row relative overflow-hidden">
        
        {/* LEFT EXECUTIVE SIDEBAR (Desktop only) */}
        <aside className={`hidden md:flex shrink-0 transition-all duration-300 ease-in-out flex-col border-r h-full ${
          sidebarCollapsed ? 'w-20' : 'w-68'
        } ${
          themeMode === 'light' ? 'bg-[#0f172a] border-slate-250 text-slate-200' : 'bg-[#070b16] border-slate-850/80'
        }`}>
          {/* Logo brand block */}
          <div className="p-4 border-b border-white/5 flex flex-col items-center justify-center transition-all duration-300">
            {sidebarCollapsed ? (
              <div className="flex flex-col items-center justify-center space-y-1.5 py-1">
                <div className="bg-white p-1 rounded-lg flex items-center justify-center border border-white/10 w-10 h-10 select-none shadow-xs hover:scale-105 transition-all">
                  <img 
                    src="https://www.keejob.com/media/recruiter/recruiter_151/logo-opalia-pharma-recordati-group-20160202-085534.png"
                    alt="Opalia" 
                    className="h-6.5 w-auto object-contain shrink-0"
                    referrerPolicy="no-referrer"
                    title="Opalia Recordati"
                  />
                </div>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" title="GreenOpsAI Actif" />
              </div>
            ) : (
              <div className="flex flex-col space-y-2 w-full pt-2">
                {/* Branded Opalia Pharma logo image with fallback text */}
                <div className="bg-white hover:scale-[1.01] hover:shadow-md transition-all px-3 py-1.5 rounded-xl flex items-center justify-center border border-white/10 w-32 mx-auto mb-1 select-none shadow-xs">
                  <img 
                    src="https://www.keejob.com/media/recruiter/recruiter_151/logo-opalia-pharma-recordati-group-20160202-085534.png"
                    alt="Opalia Recordati" 
                    className="h-8.5 w-auto object-contain shrink-0 filter drop-shadow-[0_1px_1px_rgba(0,0,0,0.02)]"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex items-center space-x-1 justify-center mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <span className="text-[10px] font-mono tracking-widest text-[#10b981] font-bold uppercase">GreenOpsAI Cockpit</span>
                </div>
              </div>
            )}
          </div>

          {/* Active user Profile summary badge */}
          {currentUser && (
            <div className={`py-4 border-b border-white/5 flex justify-center transition-all duration-300 ${sidebarCollapsed ? 'px-2' : 'px-6'}`}>
              {sidebarCollapsed ? (
                <div 
                  className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold font-display text-xs tracking-tight shrink-0 cursor-pointer hover:border-emerald-400/40 transition-all"
                  title={`${currentUser.name} - ${currentUser.role}`}
                >
                  {getInitials(currentUser.name)}
                </div>
              ) : (
                <div className="flex items-center space-x-3 w-full">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold font-display text-sm tracking-tight shrink-0">
                    {getInitials(currentUser.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <b className="text-xs text-white block truncate">{currentUser.name}</b>
                    <span className="text-[10px] text-slate-450 font-mono block truncate" title={currentUser.role}>{currentUser.role}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Navigation link list */}
          <nav className="px-3 py-4 space-y-1.5 flex-1 overflow-y-auto scrollbar-none min-h-0">
            {navItems.map((item) => {
              const IconComp = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    playSound('click');
                    setActiveTab(item.id as any);
                  }}
                  title={sidebarCollapsed ? item.label : undefined}
                  className={`w-full relative rounded-xl text-left text-xs font-semibold flex items-center transition-all outline-none group cursor-pointer ${
                    sidebarCollapsed ? 'p-3.5 justify-center' : 'px-4 py-3 space-x-3.5'
                  } ${
                    isActive 
                      ? 'text-white bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/15' 
                      : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
                  }`}
                >
                  {/* Sliding highlight indicator background */}
                  {isActive && (
                    <motion.div 
                      layoutId="activeTabPill"
                      className="absolute inset-0 bg-[#10b981]/10 rounded-xl -z-10 border border-[#10b981]/20"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <IconComp className={`w-4.5 h-4.5 shrink-0 transition-transform group-hover:scale-105 ${isActive ? 'text-emerald-400 font-bold' : 'text-slate-500 group-hover:text-slate-300'}`} />
                  {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                </button>
              );
            })}

            {/* Logout trigger directly appended at the list bottom */}
            <button
              onClick={handleLogout}
              title={sidebarCollapsed ? "Déconnexion" : undefined}
              className={`w-full mt-5 rounded-xl text-left text-xs font-semibold flex items-center transition-all outline-none text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer border border-transparent hover:border-red-500/15 ${
                sidebarCollapsed ? 'p-3.5 justify-center' : 'px-4 py-3 space-x-3.5'
              }`}
              id="sidebar-signout-btn"
            >
              <LogOut className="w-4.5 h-4.5 shrink-0 text-red-400 transition-transform group-hover:scale-105" />
              {!sidebarCollapsed && <span>Déconnexion</span>}
            </button>
          </nav>

          {/* Environmental carbon offset sidebar widget */}
          {!sidebarCollapsed && (
            <div className="p-4 mx-4 mb-4 bg-gradient-to-tr from-emerald-950/40 to-slate-900 border border-emerald-500/15 rounded-2xl text-xs shrink-0">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold mb-1">
                <Leaf className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
                <span>Label Éco-Usine 2026</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-normal">
                Opalia Recordati compense {(baselineMetrics.totalCO2 - currentMetrics.totalCO2).toFixed(1)} t_CO₂ sous l'égide de l'ANME Tunisie.
              </p>
            </div>
          )}

          {/* Collapsible Trigger Section */}
          <div className="p-3 border-t border-white/5 flex items-center justify-center bg-white/[0.01]">
            <button
              onClick={() => {
                playSound('click');
                setSidebarCollapsed(!sidebarCollapsed);
              }}
              className="w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all duration-255 flex items-center justify-center space-x-2 text-[11px] font-bold group cursor-pointer border border-white/5"
              title={sidebarCollapsed ? "Agrandir" : "Réduire le menu"}
            >
              {sidebarCollapsed ? (
                <ChevronRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
              ) : (
                <>
                  <ChevronLeft className="w-4 h-4 text-emerald-400 group-hover:-translate-x-0.5 transition-transform" />
                  <span className="truncate">Réduire Cockpit</span>
                </>
              )}
            </button>
          </div>
        </aside>

        {/* CONTROLLER WORKSPACE FRAME (Right) */}
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
          
          {/* HEADER CONSOLE BAR */}
          <header className={`px-6 py-4.5 border-b shrink-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-colors duration-300 ${
            themeMode === 'light' ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-slate-850'
          }`}>
            <div className="space-y-0.5">
              <h1 className="text-base font-bold font-display tracking-tight flex items-center space-x-2">
                <span>GreenOpsAI</span>
                <span className="text-[11px] font-mono bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 px-1.5 py-0.5 rounded-md font-bold uppercase transition-all">Ariana 🇹🇳</span>
              </h1>
              <p className="text-[11px] text-slate-400 font-medium">Cabinet d'effacement thermique & tarification carbone analytique • Opalia Recordati</p>
            </div>

            {/* Geographical Clock Widget & Connection Status */}
            <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono select-none">
              <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-950 px-3 py-2 rounded-xl border border-slate-200/60 dark:border-slate-850 shrink-0">
                <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span className="font-semibold text-[10px] font-sans">Tunis (Ariana)</span>
              </div>
              <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-950 px-3 py-2 rounded-xl border border-slate-200/60 dark:border-slate-850 shrink-0 font-bold">
                <Calendar className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span>{currentTime || "08:15:00"}</span>
              </div>

              {/* Service Worker Resilient Offline / Online Status */}
              <div 
                title={isOnline ? "Réseau industriel Opalia stable" : "Service Worker d'Opalia actif. Index de relevés éco-usine modifiables et consultables."} 
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl border shrink-0 transition-all duration-300 font-bold ${
                  isOnline 
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' 
                    : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 animate-pulse'
                }`}
              >
                <span className={`w-2 h-2 rounded-full shrink-0 ${
                  isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                }`} />
                <span className="text-[10px] font-sans">
                  {isOnline ? 'Réseau Usine OK' : 'Mode Offline SW'}
                </span>
              </div>
            </div>
          </header>

          {/* USER NOTIFICATION CHIPS TRIGGER */}
          {importNotification && (
            <div className="px-6 pt-4 shrink-0">
              <motion.div 
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300 border border-emerald-500/25 p-4 rounded-2xl text-xs flex items-center space-x-2 font-medium"
              >
                <CheckCircle2 className="w-4.5 h-4.5 shrink-0" />
                <span>{importNotification}</span>
              </motion.div>
            </div>
          )}

          {/* MAIN TABS PANEL TRANSITION WRAPPER */}
          <main className={`flex-1 p-4 md:p-6 flex flex-col min-h-0 ${
            activeTab === 'chat' ? 'overflow-hidden pb-18 md:pb-0' : 'overflow-y-auto pb-28 md:pb-8'
          }`}>
            <div className={`w-full ${activeTab === 'chat' ? 'flex-1 min-h-0 h-full flex flex-col' : 'flex-grow'}`}>
              <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -12, filter: 'blur(4px)' }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
                className={`w-full ${activeTab === 'chat' ? 'flex-1 min-h-0 h-full flex flex-col' : ''}`}
              >
                <Suspense fallback={<LoadingFallback />}>
                  {activeTab === 'dashboard' && (
                    <DashboardTab 
                      cabinets={cabinets}
                      currentMetrics={currentMetrics}
                      baselineMetrics={baselineMetrics}
                      savingEstimatedTnd={savingEstimatedTnd}
                      outsideTemp={outsideTemp}
                      onKpiClick={(kpi) => setSelectedKPI(kpi)}
                      themeMode={themeMode}
                      products={updatedProductStructure}
                    />
                  )}

                  {activeTab === 'simulator' && (
                    <SimulatorTab 
                      outsideTemp={outsideTemp}
                      setOutsideTemp={setOutsideTemp}
                      indirectPct={indirectPct}
                      setIndirectPct={setIndirectPct}
                      productLots={productLots}
                      setProductLots={setProductLots}
                      products={updatedProductStructure}
                      currentMetrics={currentMetrics}
                      baselineMetrics={baselineMetrics}
                      themeMode={themeMode}
                    />
                  )}

                  {activeTab === 'releves' && (
                    <RelevesTab 
                      releveTab={releveTab}
                      setReleveTab={setReleveTab}
                      editableCabinets={editableCabinets}
                      setEditableCabinets={setEditableCabinets}
                      searchCabinetQuery={searchCabinetQuery}
                      setSearchCabinetQuery={setSearchCabinetQuery}
                      handleExcelImportMock={handleExcelImportMock}
                      saveReleves={saveReleves}
                      themeMode={themeMode}
                      currentUser={currentUser}
                    />
                  )}

                  {activeTab === 'costs' && (
                    <CostsTab 
                      products={updatedProductStructure}
                      searchProductQuery={searchProductQuery}
                      setSearchProductQuery={setSearchProductQuery}
                      themeMode={themeMode}
                    />
                  )}

                  {activeTab === 'chat' && (
                    <ChatTab 
                      chatMessages={chatMessages}
                      chatInput={chatInput}
                      setChatInput={setChatInput}
                      isBotLoading={isBotLoading}
                      botLoaderTip={botLoaderTip}
                      triggerChatBot={triggerChatBot}
                      themeMode={themeMode}
                    />
                  )}

                  {activeTab === 'settings' && (
                    <SettingsTab 
                      tariffs={tariffs}
                      setTariffs={setTariffs}
                      themeMode={themeMode}
                      setThemeMode={setThemeMode}
                      cabinets={cabinets}
                      setCabinets={setCabinets}
                    />
                  )}
                </Suspense>
              </motion.div>
            </AnimatePresence>
            </div>

            {/* INTEGRATED ECO-COCKPIT FOOTER INSIDE SCROLLABLE AREA */}
            {activeTab !== 'chat' && (
              <footer className={`border-t py-4 px-2 mt-12 text-center text-[10px] sm:text-xs tracking-wide shrink-0 opacity-80 ${
                themeMode === 'light' ? 'text-slate-400 border-slate-200/80' : 'text-slate-500 border-slate-850'
              }`}>
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5">
                  <div>Version 1.0 - GreenOpsAI © Opalia Recordati 2026</div>
                  <div className="font-mono text-[9px] opacity-80">Développé en partenariat avec l'ANME Tunisie et STEG • Ariana Tunis</div>
                </div>
              </footer>
            )}
          </main>

        </div>

        {/* 📱 MOBILE / TABLET PERSISTENT BOTTOM NAVIGATION BAR */}
        <div className={`md:hidden fixed bottom-2 left-3 right-3 rounded-2xl border backdrop-blur-xl shadow-2xl z-50 flex items-center justify-around px-2 py-2 transition-all duration-300 ${
          themeMode === 'light' 
            ? 'bg-white/95 border-slate-250 text-slate-800 shadow-slate-900/10' 
            : 'bg-[#0b0f19]/90 border-slate-800/80 text-slate-200'
        }`}>
          {navItems.map((item) => {
            const IconComp = item.icon;
            const isActive = activeTab === item.id;
            
            const shortLabels: Record<string, string> = {
              'dashboard': 'Tableau',
              'simulator': 'Simulateur',
              'releves': 'Saisie',
              'costs': 'Coûts',
              'chat': 'Assistant',
              'settings': 'Param'
            };
            const displayLabel = shortLabels[item.id] || item.label;

            return (
              <button
                key={item.id}
                onClick={() => {
                  playSound('click');
                  setActiveTab(item.id as any);
                }}
                className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all relative outline-none select-none cursor-pointer ${
                  isActive 
                    ? 'text-[#79b823] font-bold' 
                    : themeMode === 'light' ? 'text-slate-500 hover:text-slate-800' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {isActive && (
                  <motion.span 
                    layoutId="activeMobileBarTab"
                    className="absolute inset-0 bg-[#79b823]/10 rounded-xl -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <IconComp className={`w-4.5 h-4.5 mb-0.5 ${isActive ? 'text-emerald-500' : 'text-slate-500'}`} />
                <span className="text-[9.5px] tracking-tight">{displayLabel}</span>
              </button>
            );
          })}
        </div>

      </div>

    </div>
  );
}
