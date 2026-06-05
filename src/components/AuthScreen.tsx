import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, KeyRound, Mail, User, Briefcase, Eye, EyeOff, Sparkles, Check, AlertCircle, ArrowRight } from 'lucide-react';
import { playSound } from '../utils/audio';

interface UserProfile {
  name: string;
  email: string;
  role: string;
}

interface AuthScreenProps {
  onLoginSuccess: (user: UserProfile) => void;
  themeMode: 'light' | 'dark';
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess, themeMode }) => {
  const [isRegister, setIsRegister] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [role, setRole] = useState<string>('Chef Énergie');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Default accounts database stored in localStorage (or initialized on first load)
  const getRegisteredUsers = (): { [key: string]: { name: string; password: string; role: string } } => {
    try {
      const stored = localStorage.getItem('greenops_users');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    // Pre-configured default users
    return {
      'adnen@opalia.com': { name: 'Adnen', password: 'password123', role: 'Chef Énergie • Ariana' },
      'selim.manai@insat.ucar.tn': { name: 'Sélim Manaï', password: 'password123', role: 'Chef Énergie • Ariana' }
    };
  };

  const handleToggleMode = () => {
    playSound('click');
    setIsRegister(!isRegister);
    setError(null);
    setSuccess(null);
    setEmail('');
    setPassword('');
    setName('');
    setConfirmPassword('');
  };

  const handlePresetFill = (presetEmail: string) => {
    playSound('preset');
    setEmail(presetEmail);
    setPassword('password123');
    setError(null);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      playSound('alert');
      setError('Veuillez remplir tous les champs requit.');
      return;
    }

    const db = getRegisteredUsers();
    const userEmailNormalized = email.trim().toLowerCase();
    const account = db[userEmailNormalized];

    if (!account) {
      playSound('alert');
      setError('Aucun compte trouvé avec cette adresse email. Veuillez vous enregistrer.');
      return;
    }

    if (account.password !== password) {
      playSound('alert');
      setError('Mot de passe incorrect. Réessayez ou utilisez un profil pré-configuré.');
      return;
    }

    // Success Authentication
    playSound('success');
    setSuccess('Authentification réussie ! Lancement du cockpit...');
    
    setTimeout(() => {
      onLoginSuccess({
        name: account.name,
        email: userEmailNormalized,
        role: account.role
      });
    }, 1200);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email || !password || !name || !confirmPassword) {
      playSound('alert');
      setError('Veuillez remplir tous les champs.');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      playSound('alert');
      setError('Veuillez entrer une adresse email valide.');
      return;
    }

    if (password.length < 6) {
      playSound('alert');
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    if (password !== confirmPassword) {
      playSound('alert');
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    const db = getRegisteredUsers();
    const userEmailNormalized = email.trim().toLowerCase();

    if (db[userEmailNormalized]) {
      playSound('alert');
      setError('Cette adresse email est déjà enregistrée. Veuillez vous connecter.');
      return;
    }

    // Save register account
    db[userEmailNormalized] = {
      name: name.trim(),
      password: password,
      role: `${role} • Ariana`
    };

    try {
      localStorage.setItem('greenops_users', JSON.stringify(db));
    } catch (e) {
      console.error(e);
    }

    playSound('success');
    setSuccess('Compte créé avec succès ! Redirection vers la connexion...');
    
    setTimeout(() => {
      setIsRegister(false);
      setSuccess(null);
      setPassword('');
      setConfirmPassword('');
    }, 1500);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 sm:p-6 transition-colors duration-300 ${
      themeMode === 'light' ? 'bg-slate-50 text-slate-800' : 'bg-[#060913] text-slate-100'
    }`} id="auth-screen-container">
      
      {/* Decorative colored fluid ambient backdrops */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[15%] w-72 h-72 rounded-full bg-emerald-500/10 blur-[100px] animate-pulse" />
        <div className="absolute bottom-[20%] right-[10%] w-96 h-96 rounded-full bg-indigo-500/10 blur-[130px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        
        {/* Opalia Logo Banner */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center bg-white/95 backdrop-blur-md w-16 h-16 rounded-2xl shadow-xl border border-white/20 mb-4 hover:scale-[1.03] transition-all">
            <img 
              src="https://www.keejob.com/media/recruiter/recruiter_151/logo-opalia-pharma-recordati-group-20160202-085534.png"
              alt="Opalia Recordati" 
              className="w-12 h-12 object-contain shrink-0 filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
              referrerPolicy="no-referrer"
              id="auth-opalia-logo"
            />
          </div>
          <h2 className="text-xl font-bold font-display tracking-tight flex items-center justify-center space-x-2">
            <span>Cockpit GreenOpsAI</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1.5 max-w-xs mx-auto">
            Portail de gestion de l'efficacité énergétique de l'usine d'Ariana Tunisie.
          </p>
        </div>

        {/* Credentials Form Card */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", damping: 25, stiffness: 280 }}
          className={`rounded-3xl border p-6 sm:p-8 shadow-2xl overflow-hidden relative ${
            themeMode === 'light' 
              ? 'bg-white border-slate-200/80 shadow-slate-100' 
              : 'bg-[#090e1e]/90 border-slate-800/80'
          }`}
          id="auth-card"
        >
          {/* Decorative glowing header card border */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500" />
          
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-850">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-emerald-500 font-bold uppercase block mb-1">
                Connexion Sécurisée
              </span>
              <h3 className="font-display font-bold text-lg select-none">
                {isRegister ? 'Créer un compte' : 'S\'authentifier'}
              </h3>
            </div>

            {/* Shield Icon indicator */}
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20">
              <Shield className="w-5 h-5" />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl p-3.5 mb-5 text-xs flex items-start space-x-2"
                id="auth-error-banner"
              >
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            {success && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-2xl p-3.5 mb-5 text-xs flex items-start space-x-2"
                id="auth-success-banner"
              >
                <Check className="w-4 h-4 mt-0.5 shrink-0 animate-bounce" />
                <span>{success}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={isRegister ? handleRegister : handleLogin} className="space-y-4" id="auth-form">
            {isRegister && (
              <div className="space-y-1.5" id="auth-field-name">
                <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block font-mono uppercase tracking-wider">
                  Nom Complet
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="ex. Sélim Manaï"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-xs font-semibold pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 focus:outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-950 transition-all font-display text-slate-800 dark:text-slate-200"
                    id="input-full-name"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5" id="auth-field-email">
              <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block font-mono uppercase tracking-wider">
                Adresse Email Professionnelle
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input 
                  type="email" 
                  placeholder="ex. selim.manai@insat.ucar.tn"
                  value={email}
                  onChange={(e) => {
                    setError(null);
                    setEmail(e.target.value);
                  }}
                  className="w-full text-xs font-semibold pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 focus:outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-950 transition-all font-display text-slate-800 dark:text-slate-200"
                  id="input-email-field"
                />
              </div>
            </div>

            {isRegister && (
              <div className="space-y-1.5" id="auth-field-role">
                <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block font-mono uppercase tracking-wider">
                  Rôle Industriel
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <select 
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full text-xs font-semibold pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 focus:outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-950 transition-all font-sans text-slate-800 dark:text-slate-200 appearance-none"
                    id="input-role-select"
                  >
                    <option value="Chef Énergie">Chef Énergie</option>
                    <option value="Ingénieur Procédés">Ingénieur Procédés</option>
                    <option value="Directeur Technique">Directeur Technique</option>
                    <option value="Auditeur ANME">Auditeur ANME</option>
                    <option value="Directeur Opalia">Directeur Opalia</option>
                  </select>
                </div>
              </div>
            )}

            <div className="space-y-1.5" id="auth-field-password">
              <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block font-mono uppercase tracking-wider">
                Mot de Passe
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setError(null);
                    setPassword(e.target.value);
                  }}
                  className="w-full text-xs font-semibold pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 focus:outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-950 transition-all font-display text-slate-800 dark:text-slate-200"
                  id="input-password-field"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 focus:outline-none"
                  id="btn-toggle-password-visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {isRegister && (
              <div className="space-y-1.5" id="auth-field-confirm-password">
                <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block font-mono uppercase tracking-wider">
                  Confirmer le Mot de Passe
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full text-xs font-semibold pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 focus:outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-950 transition-all font-display text-slate-800 dark:text-slate-200"
                    id="input-confirm-password-field"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-tr from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-bold font-display text-xs p-3 rounded-xl transition-all shadow-md shadow-emerald-500/10 cursor-pointer flex items-center justify-center space-x-2 mt-4 hover:translate-y-[-1px]"
              id="submit-auth-btn"
            >
              <span>{isRegister ? "S'enregistrer maintenant" : "Se connecter au cockpit"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Preset Switcher (Very helpful for trial & checkouts) */}
          {!isRegister && (
            <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-850 space-y-3" id="auth-presets">
              <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 font-mono uppercase tracking-wider block">
                Comptes Démo Instantanés :
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handlePresetFill('selim.manai@insat.ucar.tn')}
                  className="p-2 text-[10px] font-bold rounded-xl border border-slate-250/50 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950/30 text-slate-600 dark:text-slate-400 hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all text-left flex items-start flex-col truncate cursor-pointer"
                  id="preset-user-selim"
                >
                  <span className="text-emerald-600 dark:text-emerald-400 block truncate">Profil Sélim Manaï</span>
                  <span className="text-[8px] text-slate-400 truncate w-full font-mono">selim.manai@insat.ucar.tn</span>
                </button>

                <button
                  type="button"
                  onClick={() => handlePresetFill('adnen@opalia.com')}
                  className="p-2 text-[10px] font-bold rounded-xl border border-slate-250/50 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950/30 text-slate-600 dark:text-slate-400 hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all text-left flex items-start flex-col truncate cursor-pointer"
                  id="preset-user-adnen"
                >
                  <span className="text-emerald-600 dark:text-emerald-400 block truncate">Profil Adnen</span>
                  <span className="text-[8px] text-slate-400 truncate w-full font-mono">adnen@opalia.com</span>
                </button>
              </div>
            </div>
          )}

          {/* Bottom toggle anchor */}
          <div className="mt-5 text-center text-xs">
            <button
              onClick={handleToggleMode}
              className="text-slate-500 hover:text-emerald-500 dark:text-slate-400 dark:hover:text-emerald-400 font-medium transition-colors cursor-pointer inline-flex items-center space-x-1.5"
              id="auth-toggle-view"
            >
              <span>{isRegister ? "Déjà un compte ? Connectez-vous." : "Inscrivez un nouveau collaborateur."}</span>
            </button>
          </div>

        </motion.div>
      </div>
    </div>
  );
};
