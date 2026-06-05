import React, { useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Bot, Send, RefreshCw, Sparkles, AlertTriangle, ArrowUpRight } from 'lucide-react';
import { ChatMessage } from '../types';

const renderTextContent = (text: string) => {
  if (!text) return '';
  let processed = text;
  // Replace standard LaTeX symbols
  processed = processed.replace(/\\rightarrow/g, '→');
  processed = processed.replace(/\\times/g, '×');
  processed = processed.replace(/\\approx/g, '≈');
  processed = processed.replace(/\\pm/g, '±');
  
  // Format CO_2, $CO_2$ or CO2 beautifully with real subscripts
  processed = processed.replace(/\$?CO_2\$?/g, 'CO₂');
  
  // Split the text to handle inline subscript _{...} or _[...] or _x or superscript ^2, ^3
  const parts = processed.split(/(_\{[^}]+\}|_[a-zA-Z0-9]+|\^3|\^2|\$[a-zA-Z0-9_]+\$)/g);
  
  return parts.map((part, index) => {
    // Check for inline math variables wrapped in $...$
    if (part.startsWith('$') && part.endsWith('$')) {
      const varVal = part.slice(1, -1);
      return <span key={index} className="italic font-mono font-bold text-slate-800 dark:text-emerald-400">{varVal}</span>;
    }
    if (part.startsWith('_{') && part.endsWith('}')) {
      const subVal = part.slice(2, -1);
      return <sub key={index} className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 font-sans">{subVal}</sub>;
    }
    if (part.startsWith('_')) {
      const subVal = part.slice(1);
      return <sub key={index} className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 font-sans">{subVal}</sub>;
    }
    if (part === '^3') {
      return <sup key={index} className="text-[10px] font-bold text-emerald-500 dark:text-emerald-400 font-sans">3</sup>;
    }
    if (part === '^2') {
      return <sup key={index} className="text-[10px] font-bold text-emerald-500 dark:text-emerald-400 font-sans">2</sup>;
    }
    
    return part;
  });
};

const parseBoldText = (text: string, isUser: boolean) => {
  const parts = text.split(/\*\*([\s\S]*?)\*\*/g);
  return parts.map((part, i) => {
    if (i % 2 === 1) {
      if (isUser) {
        return (
          <strong key={i} className="font-extrabold text-white underline decoration-white/30 underline-offset-2">
            {renderTextContent(part)}
          </strong>
        );
      }
      
      if (part.startsWith('[') && part.endsWith(']')) {
        return (
          <span key={i} className="font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-600 dark:text-amber-450 border border-amber-500/25 inline-block my-0.5 animate-pulse">
            {renderTextContent(part)}
          </span>
        );
      }

      return (
        <span key={i} className="font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/8 dark:bg-emerald-500/12 px-1.5 py-0.5 rounded border border-emerald-500/10 inline-block my-0.5 shadow-2xs">
          {renderTextContent(part)}
        </span>
      );
    }
    return <span key={i}>{renderTextContent(part)}</span>;
  });
};

const renderBlockFormula = (formula: string) => {
  let clean = formula;
  if (clean.startsWith('$$')) clean = clean.substring(2);
  if (clean.endsWith('$$')) clean = clean.substring(0, clean.length - 2);
  clean = clean.trim();

  return (
    <div className="my-3 p-4 bg-slate-50 dark:bg-slate-900/60 border border-slate-200/65 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center shadow-3xs relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-1.5 h-full bg-[#79b823]" />
      <span className="text-[9px] uppercase font-mono tracking-widest font-extrabold text-slate-400 dark:text-emerald-500/85 mb-2">
        Axe de Calcul Physique CTA (Lois d'Affinité)
      </span>
      <div className="text-xs md:text-[13px] font-mono font-bold text-slate-800 dark:text-emerald-450 tracking-wide select-all leading-relaxed max-w-full overflow-x-auto whitespace-normal">
        {renderTextContent(clean)}
      </div>
    </div>
  );
};

const parseLabelLine = (line: string, isUser: boolean) => {
  const match = line.match(/^(?:-\s*|\*\s*|•\s*)?(Action|Contrainte GMP|Calcul de[^:]*|Gain financier estimé|Gain|Paramètre critique|Indicateur Financier|Levier de décarbonation|Valorisation ANME)\s*(\([^)]+\))?\s*:\s*(.*)$/i);
  if (match) {
    const labelOriginal = match[1];
    const extra = match[2];
    const textPart = match[3];

    // Normalize label for comparison
    const labelLower = labelOriginal.toLowerCase();
    
    let style = { bg: "bg-slate-100 dark:bg-slate-900/40", text: "text-slate-600 dark:text-slate-400", border: "border-slate-200 dark:border-slate-800" };
    if (labelLower.includes('action')) {
      style = { bg: "bg-blue-50/70 dark:bg-blue-950/20", text: "text-blue-600 dark:text-blue-400 font-extrabold", border: "border-blue-500/10 dark:border-blue-500/20" };
    } else if (labelLower.includes('contrainte') || labelLower.includes('critique')) {
      style = { bg: "bg-red-50/70 dark:bg-red-950/20", text: "text-red-500 dark:text-red-400 font-extrabold", border: "border-red-500/10 dark:border-red-500/20" };
    } else if (labelLower.includes('calcul')) {
      style = { bg: "bg-purple-50/70 dark:bg-purple-950/20", text: "text-purple-600 dark:text-purple-400 font-extrabold", border: "border-purple-500/10 dark:border-purple-500/20" };
    } else if (labelLower.includes('gain') || labelLower.includes('décarbonation') || labelLower.includes('anme')) {
      style = { bg: "bg-emerald-50/40 dark:bg-emerald-950/20", text: "text-emerald-600 dark:text-[#79b823] font-black", border: "border-[#79b823]/10 dark:border-[#79b823]/20" };
    } else if (labelLower.includes('financier')) {
      style = { bg: "bg-amber-50/70 dark:bg-amber-950/20", text: "text-amber-500 dark:text-amber-400 font-extrabold", border: "border-amber-500/10 dark:border-amber-500/20" };
    }

    return (
      <div className={`p-3.5 rounded-2xl border ${style.bg} ${style.border} my-2 shadow-3xs flex items-start space-x-1`}>
        <div className="flex-1 text-[11.5px] leading-relaxed font-sans">
          <div className="flex items-center flex-wrap gap-1 mb-1.5">
            <span className={`text-[9px] uppercase font-mono tracking-wider ${style.text} px-2 py-0.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800`}>
              {labelOriginal}
            </span>
            {extra && (
              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 font-medium">
                {extra}
              </span>
            )}
          </div>
          <span className="text-slate-850 dark:text-slate-300 leading-relaxed font-sans font-medium">
            {parseBoldText(textPart, isUser)}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

const FormattedMessage: React.FC<{ content: string; isUser: boolean }> = ({ content, isUser }) => {
  const lines = content.split('\n');
  return (
    <div className="space-y-1.5 font-sans">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={idx} className="h-1" />;
        }

        // 1. Math formulas starting and ending with $$
        if (trimmed.startsWith('$$') || trimmed.endsWith('$$')) {
          return <div key={idx}>{renderBlockFormula(trimmed)}</div>;
        }

        // 2. Markdown headers (e.g., "###", "##", "#")
        if (trimmed.startsWith('### ')) {
          return (
            <h4 key={idx} className="text-[11px] font-bold text-slate-800 dark:text-slate-150 mt-2.5 mb-1 pl-1.5 border-l-2 border-emerald-500 tracking-tight font-display">
              {parseBoldText(trimmed.substring(4), isUser)}
            </h4>
          );
        }
        if (trimmed.startsWith('## ')) {
          return (
            <h3 key={idx} className="text-xs font-bold text-slate-900 dark:text-white mt-3.5 mb-1.5 pl-2 border-l-3 border-[#79b823] tracking-tight font-display">
              {parseBoldText(trimmed.substring(3), isUser)}
            </h3>
          );
        }
        if (trimmed.startsWith('# ')) {
          return (
            <h2 key={idx} className="text-sm font-black text-slate-900 dark:text-white mt-4 mb-2 border-b pb-0.5 border-slate-200 dark:border-slate-800 tracking-tight font-display">
              {parseBoldText(trimmed.substring(2), isUser)}
            </h2>
          );
        }

        // 3. Structured numbered report points, e.g. "1. HVAC & Salles Blanches..."
        const numberMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
        if (numberMatch) {
          const num = numberMatch[1];
          const titleText = numberMatch[2];
          
          // Split into main head and sub-action description using colon if present
          const markerSplit = titleText.split(/:\s*(.*)/);
          const mainPart = markerSplit[0];
          const subPart = markerSplit[1];

          return (
            <div key={idx} className="mt-5 mb-3 bg-gradient-to-r from-emerald-500/5 to-transparent p-3.5 rounded-2xl border border-emerald-500/10 flex items-start space-x-3 shadow-3xs">
              <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-[#79b823] text-white font-mono font-black text-xs shrink-0 shadow-xs">
                {num}
              </span>
              <div className="flex-grow min-w-0">
                <h3 className="text-[12px] font-black text-slate-900 dark:text-white leading-tight font-display tracking-tight uppercase">
                  {parseBoldText(mainPart, isUser)}
                </h3>
                {subPart && (
                  <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-1 pl-0.5 tracking-tight">
                    {parseBoldText(subPart, isUser)}
                  </p>
                )}
              </div>
            </div>
          );
        }

        // 4. Specific Industrial Audit labels (Action, Contrainte, Gain, etc.)
        const labelBlock = parseLabelLine(trimmed, isUser);
        if (labelBlock) {
          return <div key={idx}>{labelBlock}</div>;
        }

        // 5. Standard bullet items
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const rawItem = trimmed.substring(2);
          return (
            <div key={idx} className="flex items-start space-x-1.5 pl-1.5 my-1">
              <span className="w-1.5 h-1.5 rounded bg-[#79b823] mt-1.5 shrink-0" />
              <div className="flex-1 text-[11.5px] leading-relaxed">
                {parseBoldText(rawItem, isUser)}
              </div>
            </div>
          );
        }

        // 6. Default paragraph
        return (
          <p key={idx} className="text-[11.5px] leading-relaxed my-1">
            {parseBoldText(line, isUser)}
          </p>
        );
      })}
    </div>
  );
};

interface ChatTabProps {
  chatMessages: ChatMessage[];
  chatInput: string;
  setChatInput: (val: string) => void;
  isBotLoading: boolean;
  botLoaderTip: string;
  triggerChatBot: (text?: string) => void;
  themeMode: 'dark' | 'light';
}

export const ChatTab: React.FC<ChatTabProps> = ({
  chatMessages,
  chatInput,
  setChatInput,
  isBotLoading,
  botLoaderTip,
  triggerChatBot,
  themeMode
}) => {
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Automatically scroll messages to view
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isBotLoading]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && chatInput.trim()) {
      triggerChatBot();
    }
  };

  const actionChips = [
    { title: "Canicule & CTA 🌫️", prompt: "Quels réglages pour l'HVAC (Armoire 2) afin de minimiser le coût d'une canicule à Ariana ?" },
    { title: "Dérive Armoire 8 ⚠️", prompt: "Pourquoi l'Armoire 8 (Ligne Pommade) montre une augmentation de consommation de 13% ?" },
    { title: "Station Neutralisation 💧", prompt: "Explique-moi comment Opalia Recordati peut réduire ses rejets à la station d'épuration Armoire 14." },
    { title: "Structure Sirop Toux 💰", prompt: "Quelle est la composition de notre coût direct par lot de Sirop contre la Toux ?" }
  ];

  return (
    <div className={`border rounded-3xl flex flex-col h-full w-full flex-1 overflow-hidden ${
      themeMode === 'light' 
        ? 'bg-white border-slate-200/85 shadow-xs' 
        : 'bg-slate-950/80 border-slate-800'
    }`}>
      
      {/* Dynamic Sub-header */}
      <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-850 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3 truncate">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20 shadow-xs">
            <Bot className="w-5.5 h-5.5 shrink-0" />
          </div>
          <div className="truncate">
            <h3 className="text-xs font-bold font-display text-slate-800 dark:text-slate-100">GreenOpsAI - Conseiller Énergétique Pharmaceutique</h3>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono tracking-wide">Modèle actif: Gemini 1.5 Flash (Opalia Context)</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold font-mono px-2 py-0.5 rounded-lg border border-emerald-500/20">
            Capteurs Ariana Synced
          </span>
        </div>
      </div>

      {/* Suggested Quick Prompt badges row */}
      <div className="px-6 py-3 bg-slate-100/50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-900 flex items-center space-x-2.5 overflow-x-auto text-[11px] shrink-0 font-sans mask-right scrollbar-none select-none">
        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mr-2">Analyses Rapides :</span>
        
        {actionChips.map((chip, idx) => (
          <button 
            key={idx}
            onClick={() => triggerChatBot(chip.prompt)}
            className="bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300 px-3.5 py-1.5 rounded-full shrink-0 transition-colors text-[11px] font-medium border border-slate-205 dark:border-slate-800 cursor-pointer flex items-center space-x-1"
          >
            <span>{chip.title}</span>
            <ArrowUpRight className="w-3 h-3 text-slate-400" />
          </button>
        ))}
      </div>

      {/* Messages Scrolling Grid */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/20 dark:bg-slate-950/20">
        {chatMessages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[75%] rounded-2xl p-4 text-xs font-sans shadow-xs border leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-gradient-to-tr from-blue-600 to-blue-500 text-white border-blue-500 rounded-br-none font-medium' 
                : themeMode === 'light'
                ? 'bg-white border-slate-200 text-slate-800 rounded-bl-none font-normal'
                : 'bg-slate-900/60 border-slate-800 text-slate-200 rounded-bl-none font-normal'
            }`}>
              {/* Message text parsed dynamically from Markdown to styled enterprise components */}
              <div className="text-xs font-medium">
                <FormattedMessage content={msg.content} isUser={msg.role === 'user'} />
              </div>

              {/* Message Timestamp */}
              <div className={`text-[9px] mt-2.5 font-mono text-right opacity-60 ${
                msg.role === 'user' ? 'text-white/80' : 'text-slate-400'
              }`}>
                {new Date(msg.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}

        {/* Dynamic Typing/Loader Animation */}
        {isBotLoading && (
          <div className="flex justify-start">
            <div className={`rounded-2xl p-4 rounded-bl-none text-xs max-w-[75%] flex items-center space-x-3.5 border shadow-inner ${
              themeMode === 'light' ? 'bg-white border-slate-200 text-slate-805' : 'bg-slate-900/40 border-slate-800 text-slate-300'
            }`}>
              <RefreshCw className="w-4.5 h-4.5 text-emerald-500 animate-spin shrink-0" />
              <div className="space-y-0.5">
                <span className="font-display font-semibold text-emerald-500 block">GreenOpsAI procède au diagnostic...</span>
                <span className="text-[10px] text-slate-400 font-mono italic block">{botLoaderTip}</span>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Primary Message Input Board */}
      <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-850 flex items-center space-x-3 shrink-0">
        <input 
          type="text" 
          placeholder="Poser une question (ex: Économie si l'HVAC passe à 18%...)"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyDown={handleKeyPress}
          className="flex-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 focus:border-emerald-500 text-xs py-3 px-4 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-405 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition-all font-sans"
        />
        
        <button 
          onClick={() => triggerChatBot()}
          disabled={isBotLoading || !chatInput.trim()}
          className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 disabled:cursor-not-allowed text-white p-3.5 rounded-2xl transition-all shadow-md shadow-emerald-500/5 shrink-0 cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
