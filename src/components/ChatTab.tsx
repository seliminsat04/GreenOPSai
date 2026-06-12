import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, Send, RefreshCw, Sparkles, AlertTriangle, ArrowUpRight, Image, X, Paperclip, Mic, MicOff, Shield, Fingerprint, Check, Mail, Calendar, Lock } from 'lucide-react';
import { ChatMessage } from '../types';
import { playSound } from '../utils/audio';
import { getAccessToken } from '../utils/googleAuth';

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
  triggerChatBot: (text?: string, imageUrl?: string) => void;
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);

  // FDA 21 CFR Part 11 human interactive approval states
  const [signedActionIds, setSignedActionIds] = useState<{ 
    [msgId: string]: { status: 'approved' | 'rejected'; signatureName?: string; timestamp?: string } 
  }>(() => {
    try {
      const cached = localStorage.getItem('greenops_signed_actions');
      return cached ? JSON.parse(cached) : {};
    } catch {
      return {};
    }
  });

  const [signatureInputs, setSignatureInputs] = useState<{ [msgId: string]: string }>({});
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  const saveSignedActionState = (updated: any) => {
    setSignedActionIds(updated);
    localStorage.setItem('greenops_signed_actions', JSON.stringify(updated));
  };

  const handleApproveAction = async (msgId: string, actionName: string, args: any) => {
    playSound('preset');
    const signature = signatureInputs[msgId] || '';
    const partialAutonomy = localStorage.getItem('greenops_ia_partial_autonomy') === 'true';

    if (partialAutonomy && !signature.trim()) {
      alert("La réglementation FDA 21 CFR Part 11 en mode Autonomie Partielle exige une signature numérique. Veuillez saisir votre nom d'opérateur avant d'approuver.");
      return;
    }

    setActionInProgress(msgId);
    try {
      const token = getAccessToken();

      if (!token) {
        throw new Error("L'autorisation Google (OAuth) est requise pour déclencher les API sous votre identité d'inspecteur d'Opalia. Veuillez d'abord vous connecter dans l'onglet Synchronisation.");
      }

      if (actionName === 'sendEmail') {
        const res = await fetch('/api/gmail/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            to: args.to,
            subject: args.subject,
            htmlBody: args.htmlBody
          })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Erreur lors de l'envoi via Gmail API.");
      } else if (actionName === 'createCalendarEvent') {
        const res = await fetch('/api/calendar/events', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            summary: args.summary,
            description: args.description,
            startDateTime: args.startDateTime,
            endDateTime: args.endDateTime,
            calendarId: args.calendarId
          })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Erreur lors de la création d'événement via Google Calendar API.");
      } else {
        throw new Error(`Action inconnue : ${actionName}`);
      }

      playSound('success');
      const now = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) + ' (UTC+1)';
      const updated = {
        ...signedActionIds,
        [msgId]: { status: 'approved' as const, signatureName: signature || 'Energy Manager', timestamp: now }
      };
      saveSignedActionState(updated);
      alert("Félicitations ! L'action a été signée numériquement avec succès et transmise de manière sécurisée en temps réel.");
    } catch (err: any) {
      playSound('alert');
      console.error(err);
      alert(`Échec de la validation de signature : ${err.message || err}`);
    } finally {
      setActionInProgress(null);
    }
  };

  const handleRejectAction = (msgId: string) => {
    playSound('alert');
    const now = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) + ' (UTC+1)';
    const updated = {
      ...signedActionIds,
      [msgId]: { status: 'rejected' as const, timestamp: now }
    };
    saveSignedActionState(updated);
  };

  // Speech Recognition States
  const [isListening, setIsListening] = useState(false);
  const [recognitionError, setRecognitionError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition on component load
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'fr-FR';

      rec.onstart = () => {
        setIsListening(true);
        setRecognitionError(null);
        playSound('input');
      };

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setChatInput(chatInput ? chatInput + ' ' + transcript : transcript);
          playSound('success');
        }
      };

      rec.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        if (event.error === 'not-allowed') {
          setRecognitionError("Accès accordé au micro requis. Activez le microphone dans l'URL.");
        } else if (event.error === 'no-speech') {
          setRecognitionError("Aucune parole détectée. Parlez plus fort ou approchez-vous du micro.");
        } else {
          setRecognitionError(`Reconstitution vocale indisponible (${event.error})`);
        }
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
    
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }
    };
  }, [chatInput, setChatInput]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setRecognitionError(null);
      
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setRecognitionError("La dictée vocale WebSpeech n'est pas reconnue par ce navigateur (conseillé : Chrome/Edge).");
        return;
      }

      try {
        recognitionRef.current?.start();
      } catch (err) {
        console.error("Failed to start voice recognition:", err);
        // Force reinitialization if it was in state mismatch
        try {
          const rec = new SpeechRecognition();
          rec.continuous = false;
          rec.interimResults = false;
          rec.lang = 'fr-FR';
          rec.onstart = () => { setIsListening(true); setRecognitionError(null); playSound('input'); };
          rec.onresult = (e: any) => {
            const transcript = e.results[0][0].transcript;
            if (transcript) { setChatInput(chatInput ? chatInput + ' ' + transcript : transcript); playSound('success'); }
          };
          rec.onerror = (e: any) => { setIsListening(false); setRecognitionError(`Erreur: ${e.error}`); };
          rec.onend = () => { setIsListening(false); };
          recognitionRef.current = rec;
          rec.start();
        } catch (subErr) {
          setRecognitionError("Erreur d'initialisation du moteur de dictée.");
        }
      }
    }
  };

  // Automatically scroll messages to view
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isBotLoading]);

  const handleSend = () => {
    const trimmedInput = chatInput.trim();
    if (trimmedInput || attachedImage) {
      triggerChatBot(trimmedInput || undefined, attachedImage || undefined);
      setChatInput('');
      setAttachedImage(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert("Veuillez choisir un fichier image valide (JPG, PNG, WEBP, GIF etc.).");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAttachedImage(event.target.result as string);
          playSound('input');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
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
              {/* Optional image attachment */}
              {msg.imageUrl && (
                <div className="mb-3 max-w-full overflow-hidden rounded-xl border border-slate-200/50 dark:border-slate-800/80 shadow-xs">
                  <img 
                    src={msg.imageUrl} 
                    alt="Attachement d'usine" 
                    className="max-h-60 w-full object-cover select-none animate-fade-in"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}
              {/* Message text parsed dynamically from Markdown to styled enterprise components */}
              <div className="text-xs font-medium">
                <FormattedMessage content={msg.content} isUser={msg.role === 'user'} />
              </div>

              {/* Dynamic FDA 21 CFR Part 11 interactive validation card for pending action (Gmail, Google Calendar) */}
              {msg.role !== 'user' && msg.pendingAction && (
                <div className={`mt-4 p-4 rounded-xl border space-y-3.5 select-none ${
                    signedActionIds[msg.id]?.status === 'approved'
                      ? 'bg-emerald-500/5 border-emerald-500/25 text-emerald-800 dark:text-emerald-300'
                      : signedActionIds[msg.id]?.status === 'rejected'
                      ? 'bg-rose-500/5 border-rose-500/20 text-rose-800 dark:text-rose-300'
                      : 'bg-amber-500/5 border-amber-500/25 text-slate-800 dark:text-slate-200'
                }`}>
                  <div className="flex items-start space-x-2.5">
                    <div className={`p-1.5 rounded-lg shrink-0 ${
                      signedActionIds[msg.id]?.status === 'approved'
                        ? 'bg-emerald-500/10 text-emerald-500'
                        : signedActionIds[msg.id]?.status === 'rejected'
                        ? 'bg-rose-500/10 text-rose-500'
                        : 'bg-amber-500/15 text-amber-500'
                    }`}>
                      {msg.pendingAction.name === 'sendEmail' ? (
                        <Mail className="w-4 h-4" />
                      ) : (
                        <Calendar className="w-4 h-4" />
                      )}
                    </div>
                    <div className="flex-1 space-y-0.5">
                      <h4 className="text-xs font-bold leading-none font-display text-slate-800 dark:text-slate-100">
                        {msg.pendingAction.name === 'sendEmail' 
                          ? "Action Suspendue : Envoi d'Email Gmail" 
                          : "Action Suspendue : Agenda Google Calendar"
                        }
                      </h4>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-tight">
                        {msg.pendingAction.name === 'sendEmail'
                          ? `Envoi d'un rapport technique par email à : ${msg.pendingAction.args.to}`
                          : `Programmation d'événement dans l'agenda d'Opalia : ${msg.pendingAction.args.summary}`
                        }
                      </p>
                    </div>
                    <div className="shrink-0 flex items-center space-x-1 font-mono text-[9px] uppercase tracking-wider bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-1.5 py-0.5 text-slate-400">
                      <Lock className="w-2.5 h-2.5 text-amber-500" />
                      <span>21 CFR-11</span>
                    </div>
                  </div>

                  {/* Render content snippet to inspect */}
                  <div className="bg-slate-50 dark:bg-slate-900/40 p-2.5 rounded-lg border border-slate-150 dark:border-slate-850 text-[10.5px] font-sans leading-relaxed text-slate-500 dark:text-slate-400 overflow-hidden max-h-36 overflow-y-auto">
                    {msg.pendingAction.name === 'sendEmail' ? (
                      <div className="space-y-1">
                        <div><b>Email Destinataire :</b> {msg.pendingAction.args.to}</div>
                        <div><b>Sujet :</b> {msg.pendingAction.args.subject}</div>
                        <div className="border-t border-slate-200/50 dark:border-slate-800/50 pt-1 mt-1 font-mono text-[9.5px]">
                          Veuillez autoriser l'envoi de cette synthèse analytique à l'adresse de l'interlocuteur d'Opalia. Mode d'approbation humaine STRICT requis.
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <div><b>Sujet :</b> {msg.pendingAction.args.summary}</div>
                        <div><b>Début :</b> {new Date(msg.pendingAction.args.startDateTime).toLocaleString('fr-Fr')}</div>
                        <div><b>Description :</b> {msg.pendingAction.args.description}</div>
                      </div>
                    )}
                  </div>

                  {signedActionIds[msg.id]?.status === 'approved' ? (
                    <div className="flex items-center space-x-2 text-xs text-emerald-600 dark:text-emerald-450 font-semibold font-display bg-emerald-500/10 p-2 px-3 rounded-lg border border-emerald-500/20">
                      <Check className="w-4 h-4 text-emerald-500" />
                      <span>
                        Approuvé & Signé numériquement par « {signedActionIds[msg.id].signatureName} » à {signedActionIds[msg.id].timestamp} 
                      </span>
                    </div>
                  ) : signedActionIds[msg.id]?.status === 'rejected' ? (
                    <div className="flex items-center space-x-2 text-xs text-rose-500 font-semibold font-display bg-rose-500/10 p-2 px-3 rounded-lg border border-rose-500/20">
                      <X className="w-4 h-4 text-rose-500" />
                      <span>Action déclinée et transaction annulée le {signedActionIds[msg.id].timestamp}</span>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {/* Signature Name Input if partial autonomy is on */}
                      {localStorage.getItem('greenops_ia_partial_autonomy') === 'true' && (
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-bold text-amber-500 tracking-wider block font-mono">
                            Signature d'Habilitation d'Opérateur (Exigée) :
                          </label>
                          <div className="relative">
                            <Fingerprint className="w-4 h-4 text-slate-400 absolute left-3 top-2 pointer-events-none" />
                            <input 
                              type="text" 
                              placeholder="Saisissez votre prénom, nom ou code d'inspecteur"
                              value={signatureInputs[msg.id] || ''}
                              onChange={(e) => setSignatureInputs(prev => ({ ...prev, [msg.id]: e.target.value }))}
                              className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-amber-500 font-sans"
                            />
                          </div>
                        </div>
                      )}

                      {/* Approval controls */}
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleApproveAction(msg.id, msg.pendingAction!.name, msg.pendingAction!.args)}
                          disabled={actionInProgress === msg.id}
                          className="flex-1 bg-[#79b823] hover:bg-emerald-600 text-white font-bold font-display px-3 py-2 rounded-xl text-[11px] flex items-center justify-center space-x-1.5 shadow-sm hover:shadow-md transition-all cursor-pointer disabled:opacity-50"
                        >
                          {actionInProgress === msg.id ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              <span>Signature en cours...</span>
                            </>
                          ) : (
                            <>
                              <Fingerprint className="w-3.5 h-3.5 shrink-0" />
                              <span>Signer & Autoriser la Transaction</span>
                            </>
                          )}
                        </button>
                        <button 
                          onClick={() => handleRejectAction(msg.id)}
                          disabled={actionInProgress === msg.id}
                          className="px-3 py-2 text-[11px] font-bold font-display rounded-xl border border-rose-200 dark:border-rose-950 text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer disabled:opacity-50"
                        >
                          Décliner
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

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

      {/* Upload image thumbnail preview wrapper if attached */}
      {attachedImage && (
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-100 dark:border-slate-850 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="relative w-12 h-12 rounded-lg border border-[#79b823]/30 overflow-hidden shadow-2xs group shrink-0">
              <img 
                src={attachedImage} 
                alt="Miniature d'analyse" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#79b823] tracking-wide font-mono block uppercase">Image prête pour diagnostic IA</span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-sans block">Format d'image converti pour analyse multimodale</span>
            </div>
          </div>
          <button 
            onClick={() => setAttachedImage(null)}
            className="p-1.5 rounded-full hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
            title="Supprimer l'image"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Hidden file input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />

      {/* Voice Recognition State Panel */}
      {(isListening || recognitionError) && (
        <div className={`px-4 py-2 border-t text-[11px] flex items-center justify-between transition-all duration-300 ${
          isListening 
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400 animate-pulse' 
            : 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400'
        }`}>
          <div className="flex items-center space-x-2">
            {isListening ? (
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            ) : null}
            <span>
              {isListening 
                ? "🎙️ Assistant en écoute... Parlez dans le micro..." 
                : recognitionError
              }
            </span>
          </div>
          <button 
            type="button" 
            onClick={() => {
              setRecognitionError(null);
              if (isListening) recognitionRef.current?.stop();
            }} 
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-[10px] font-bold px-1.5 py-0.5 rounded cursor-pointer"
          >
            Masquer
          </button>
        </div>
      )}

      {/* Primary Message Input Board */}
      <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-850 flex items-center space-x-2.5 shrink-0">
        <button 
          type="button"
          onClick={triggerFileInput}
          title="Joindre une photo (Compteurs, factures, relevés...)"
          className={`p-3 rounded-xl transition-all border shrink-0 cursor-pointer ${
            attachedImage
              ? 'bg-[#79b823]/10 text-[#79b823] border-[#79b823]/25'
              : 'bg-white dark:bg-slate-950 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-850 hover:bg-slate-100 dark:hover:bg-slate-850'
          }`}
        >
          <Paperclip className="w-4 h-4" />
        </button>

        <button 
          type="button"
          onClick={toggleListening}
          title={isListening ? "Arrêter l'écoute vocale" : "Dicter votre question par commande vocale"}
          className={`p-3 rounded-xl transition-all border shrink-0 cursor-pointer ${
            isListening
              ? 'bg-red-500/15 text-red-500 border-red-500/30 shadow-xs animate-pulse'
              : 'bg-white dark:bg-slate-950 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-850 hover:bg-slate-100 dark:hover:bg-slate-850'
          }`}
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        <input 
          type="text" 
          placeholder={attachedImage ? "Ajouter un message pour analyser l'image..." : (isListening ? "Parlez et la transcription s'affiche ici..." : "Poser une question (ex: Économie si l'HVAC passe à 18%...)")}
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyDown={handleKeyPress}
          className="flex-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 focus:border-emerald-500 text-xs py-3 px-4 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-405 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition-all font-sans"
        />
        
        <button 
          onClick={handleSend}
          disabled={isBotLoading || (!chatInput.trim() && !attachedImage)}
          className="bg-[#79b823] hover:bg-[#8bc931] disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 disabled:cursor-not-allowed text-white p-3.5 rounded-2xl transition-all shadow-md shadow-emerald-500/5 shrink-0 cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
