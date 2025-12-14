
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Github, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin, 
  ExternalLink, 
  Download, 
  Code, 
  Server, 
  Database, 
  Shield, 
  Terminal, 
  Menu, 
  X, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Globe, 
  Send as SendIconLucide, 
  Loader2, 
  CheckCircle, 
  AlertCircle, 
  Facebook, 
  Layers, 
  LayoutGrid, 
  Monitor, 
  Smartphone, 
  PenTool, 
  ArrowRight, 
  Settings, 
  Lock, 
  FileText, 
  Eye, 
  Calendar, 
  MessageSquare, 
  User, 
  AtSign, 
  Maximize2, 
  Cpu, 
  Zap, 
  Target, 
  FileCheck, 
  FileDown,
  Check,
  Palette,
  Plus,
  MessageCircle
} from 'lucide-react';
import { RESUME_DATA } from './constants';
import { ChatWidget } from './components/ChatWidget';
import { ProjectCategory, Project, ResumeData, Certification, ThemePalette } from './types';
import { AdminDashboard } from './components/AdminDashboard';
import { dataManager } from './utils/dataManager';
import { generateATSPdf } from './utils/pdfGenerator';

// --- Default 9 Themes ---
const PRESET_THEMES: ThemePalette[] = [
  {
    id: 'cyber',
    name: 'Cyber Teal',
    primary: '#14b8a6',
    colors: {
      50: '#f0fdfa', 100: '#ccfbf1', 200: '#99f6e4', 300: '#5eead4', 400: '#2dd4bf',
      500: '#14b8a6', 600: '#0d9488', 700: '#0f766e', 800: '#115e59', 900: '#134e4a', 950: '#042f2e'
    }
  },
  {
    id: 'cosmic',
    name: 'Cosmic Purple',
    primary: '#a855f7',
    colors: {
      50: '#faf5ff', 100: '#f3e8ff', 200: '#e9d5ff', 300: '#d8b4fe', 400: '#c084fc',
      500: '#a855f7', 600: '#9333ea', 700: '#7e22ce', 800: '#6b21a8', 900: '#581c87', 950: '#3b0764'
    }
  },
  {
    id: 'royal',
    name: 'Royal Gold',
    primary: '#f59e0b',
    colors: {
      50: '#fffbeb', 100: '#fef3c7', 200: '#fde68a', 300: '#fcd34d', 400: '#fbbf24',
      500: '#f59e0b', 600: '#d97706', 700: '#b45309', 800: '#92400e', 900: '#78350f', 950: '#451a03'
    }
  },
  {
    id: 'crimson',
    name: 'Crimson Blade',
    primary: '#ef4444',
    colors: {
      50: '#fef2f2', 100: '#fee2e2', 200: '#fecaca', 300: '#fca5a5', 400: '#f87171',
      500: '#ef4444', 600: '#dc2626', 700: '#b91c1c', 800: '#991b1b', 900: '#7f1d1d', 950: '#450a0a'
    }
  },
  {
    id: 'ocean',
    name: 'Deep Ocean',
    primary: '#3b82f6',
    colors: {
      50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 300: '#93c5fd', 400: '#60a5fa',
      500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8', 800: '#1e40af', 900: '#1e3a8a', 950: '#172554'
    }
  },
  {
    id: 'emerald',
    name: 'Matrix Green',
    primary: '#22c55e',
    colors: {
      50: '#f0fdf4', 100: '#dcfce7', 200: '#bbf7d0', 300: '#86efac', 400: '#4ade80',
      500: '#22c55e', 600: '#16a34a', 700: '#15803d', 800: '#166534', 900: '#14532d', 950: '#052e16'
    }
  },
  {
    id: 'neon',
    name: 'Neon Flux',
    primary: '#ec4899',
    colors: {
      50: '#fdf2f8', 100: '#fce7f3', 200: '#fbcfe8', 300: '#f9a8d4', 400: '#f472b6',
      500: '#ec4899', 600: '#db2777', 700: '#be185d', 800: '#9d174d', 900: '#831843', 950: '#500724'
    }
  },
  {
    id: 'solar',
    name: 'Solar Flare',
    primary: '#f97316',
    colors: {
      50: '#fff7ed', 100: '#ffedd5', 200: '#fed7aa', 300: '#fdba74', 400: '#fb923c',
      500: '#f97316', 600: '#ea580c', 700: '#c2410c', 800: '#9a3412', 900: '#7c2d12', 950: '#431407'
    }
  },
  {
    id: 'steel',
    name: 'Steel Ops',
    primary: '#64748b',
    colors: {
      50: '#f8fafc', 100: '#f1f5f9', 200: '#e2e8f0', 300: '#cbd5e1', 400: '#94a3b8',
      500: '#64748b', 600: '#475569', 700: '#334155', 800: '#1e293b', 900: '#0f172a', 950: '#020617'
    }
  }
];

// --- Shared UI Components ---

const Background = () => (
    <div className="fixed inset-0 w-full h-full -z-50 overflow-hidden pointer-events-none">
        {/* Dark Grain Overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
        
        {/* Gradient Blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyber-900/20 rounded-full blur-[120px] mix-blend-screen animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-900/20 rounded-full blur-[120px] mix-blend-screen"></div>
        <div className="absolute top-[40%] left-[60%] w-[300px] h-[300px] bg-teal-900/10 rounded-full blur-[100px] mix-blend-screen"></div>
    </div>
);

const SectionHeading = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div className="mb-16 text-center">
    <motion.h2 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-cyber-400 font-mono tracking-widest text-xs mb-3 uppercase"
    >
      {subtitle}
    </motion.h2>
    <motion.h3 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 }}
      className="text-3xl md:text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-slate-400"
    >
      {title}
    </motion.h3>
    <motion.div 
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2, duration: 0.8 }}
      className="h-1 w-20 bg-gradient-to-r from-cyber-500 to-indigo-500 mx-auto mt-6 rounded-full"
    />
  </div>
);

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  noHover?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className = "", onClick, noHover }) => (
  <motion.div 
    whileHover={!noHover ? { y: -8, boxShadow: "0 20px 40px -15px rgba(20, 184, 166, 0.15)" } : {}}
    onClick={onClick}
    className={`bg-dark-card/50 backdrop-blur-md border border-slate-800 p-6 rounded-2xl hover:border-cyber-600/50 transition-all duration-300 shadow-xl ${className}`}
  >
    {children}
  </motion.div>
);

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ children, className = "" }) => (
  <span className={`px-3 py-1 bg-cyber-950/30 border border-cyber-800/50 text-cyber-300 text-xs rounded-full font-medium backdrop-blur-sm ${className}`}>
    {children}
  </span>
);

// --- Modals ---

const LivePreviewModal = ({ url, title, onClose }: { url: string | null; title: string; onClose: () => void }) => {
    if (!url) return null;

    return (
        <div className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 md:p-8">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="w-full max-w-6xl h-[85vh] bg-slate-900 rounded-xl overflow-hidden border border-slate-700 flex flex-col shadow-2xl"
            >
                {/* Browser Window Header */}
                <div className="bg-slate-950 p-3 flex items-center gap-4 border-b border-slate-800">
                    <div className="flex gap-2">
                        <button onClick={onClose} className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    <div className="flex-1 bg-slate-800 rounded-md px-4 py-1.5 text-xs text-slate-400 font-mono text-center truncate relative group cursor-text select-all">
                        <Lock size={10} className="inline mr-2" />
                        {url}
                    </div>
                    <div className="flex gap-2">
                        <a href={url} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white" title="Open in new tab">
                            <ExternalLink size={16} />
                        </a>
                        <button onClick={onClose} className="text-slate-400 hover:text-white">
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* Iframe Content */}
                <div className="flex-1 bg-white relative">
                   <div className="absolute inset-0 flex items-center justify-center text-slate-400 z-0">
                       <div className="flex flex-col items-center gap-2">
                           <Loader2 className="animate-spin text-cyber-600" size={32} />
                           <span className="text-sm">Loading Preview...</span>
                       </div>
                   </div>
                   <iframe 
                        src={url} 
                        className="w-full h-full relative z-10" 
                        title={`Preview of ${title}`}
                        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                        onError={(e) => console.log("Iframe load error", e)}
                   />
                   {/* Fallback overlay if iframe is blocked by X-Frame-Options (can't detect easily, but provides UX hint) */}
                   <div className="absolute bottom-0 left-0 right-0 bg-slate-900/90 text-slate-300 text-xs p-2 text-center z-20 backdrop-blur">
                        If the site refuses to connect, it may block embedding. <a href={url} target="_blank" rel="noreferrer" className="text-cyber-400 hover:underline">Click here to open externally.</a>
                   </div>
                </div>
            </motion.div>
        </div>
    );
};

const ProjectGallery = ({ 
  isOpen, 
  onClose, 
  data, 
  lang,
  onPreview
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  data: ResumeData;
  lang: 'en' | 'ar'; 
  onPreview: (project: Project) => void;
}) => {
  const [filter, setFilter] = useState<ProjectCategory>('all');
  const filteredProjects = data.projects.filter(p => filter === 'all' ? true : p.category === filter);
  const categories: ProjectCategory[] = ['all', 'web', 'mobile', 'desktop', 'design'];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-dark-bg/95 backdrop-blur-xl overflow-y-auto"
        >
          <div className="min-h-screen p-4 md:p-8">
            <div className="max-w-7xl mx-auto flex justify-between items-center mb-12 sticky top-0 bg-dark-bg/90 p-4 rounded-xl border-b border-slate-800 z-10 backdrop-blur-xl">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">{data.ui.gallery.title}</h2>
                <p className="text-slate-400 text-sm hidden md:block">{data.ui.gallery.subtitle}</p>
              </div>
              <button onClick={onClose} className="p-2 rounded-full bg-slate-800 hover:bg-red-500/20 text-slate-300 hover:text-red-400 border border-slate-700 hover:border-red-500/50 flex items-center gap-2 transition-all">
                <span className="hidden md:block text-sm font-medium px-2">{data.ui.gallery.close}</span>
                <X size={24} />
              </button>
            </div>
            <div className="max-w-7xl mx-auto mb-12 flex flex-wrap justify-center gap-2">
                 {categories.map(cat => (
                   <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                      filter === cat ? 'bg-cyber-600 border-cyber-500 text-white shadow-[0_0_20px_rgba(13,148,136,0.4)]' : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                   >
                     {data.ui.gallery.filters[cat]}
                   </button>
                 ))}
            </div>
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
              <AnimatePresence mode='popLayout'>
                {filteredProjects.map((project) => (
                  <motion.div key={project.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
                    <div className="bg-slate-900/50 rounded-2xl overflow-hidden border border-slate-800 hover:border-cyber-600/50 transition-all hover:shadow-2xl hover:shadow-cyber-900/20 flex flex-col h-full group">
                      <div className="h-56 overflow-hidden relative bg-slate-800">
                        {project.image ? (
                          <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center"><Code size={40} className="text-slate-700" /></div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                        <div className="absolute bottom-4 left-4 right-4 rtl:left-auto rtl:right-4 flex justify-between items-end">
                           <Badge className="bg-black/50 backdrop-blur text-white border-none">{data.ui.gallery.filters[project.category]}</Badge>
                           {project.link && (
                                <button 
                                    onClick={(e) => { e.stopPropagation(); onPreview(project); }}
                                    className="bg-cyber-600 hover:bg-cyber-500 text-white p-2 rounded-full shadow-lg transition-transform hover:scale-110"
                                    title="Live Preview"
                                >
                                    <Eye size={16} />
                                </button>
                           )}
                        </div>
                      </div>
                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-xl font-bold text-white group-hover:text-cyber-400 transition-colors">{project.title}</h3>
                          {project.link && (
                            <a href={project.link} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-white transition-colors p-1"><ExternalLink size={18} /></a>
                          )}
                        </div>
                        <p className="text-slate-400 text-sm mb-4 line-clamp-3 leading-relaxed">{project.description}</p>
                        <div className="mt-auto pt-4 border-t border-slate-800/50 flex flex-wrap gap-2">
                             {project.techStack.split(',').slice(0, 3).map((tech, i) => (
                               <span key={i} className="text-xs font-mono text-indigo-400 bg-indigo-900/10 px-2 py-1 rounded">{tech.trim()}</span>
                             ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const CertificateModal = ({ cert, onClose }: { cert: Certification | null, onClose: () => void }) => {
    if (!cert) return null;
    return (
        <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center p-4" onClick={onClose}>
            <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="max-w-4xl w-full max-h-[90vh] bg-slate-900 rounded-xl overflow-hidden border border-slate-700 relative flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950">
                    <div>
                        <h3 className="text-white font-bold">{cert.title}</h3>
                        {cert.date && <p className="text-xs text-slate-500 flex items-center gap-1"><Calendar size={12}/> {cert.date}</p>}
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white"><X size={24}/></button>
                </div>
                <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-slate-950/50">
                    {cert.image ? (
                        <img src={cert.image} alt={cert.title} className="max-w-full max-h-[70vh] rounded shadow-2xl" />
                    ) : (
                         <div className="text-slate-500 flex flex-col items-center gap-4 py-20">
                            <Award size={64} />
                            <p>No Image Available</p>
                         </div>
                    )}
                </div>
                {cert.link && (
                    <div className="p-4 border-t border-slate-800 bg-slate-950 text-center">
                        <a href={cert.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-cyber-400 hover:text-cyber-300">
                            View Verify Link <ExternalLink size={16} />
                        </a>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

const LoginModal = ({ 
    isOpen, 
    onClose, 
    onSuccess, 
    correctPassword 
}: { 
    isOpen: boolean; 
    onClose: () => void; 
    onSuccess: () => void; 
    correctPassword?: string;
}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const targetPass = correctPassword || 'admin@123';
        const targetEmail = "mohemadmuzamil@gmail.com";
        if (email.toLowerCase() === targetEmail.toLowerCase() && password === targetPass) {
            onSuccess();
            setEmail('');
            setPassword('');
            setError('');
        } else {
            setError('Invalid credentials');
        }
    };

    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-sm shadow-2xl relative"
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X size={20} /></button>
                <div className="flex flex-col items-center mb-6">
                    <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mb-3"><Lock size={24} className="text-cyber-400" /></div>
                    <h3 className="text-xl font-bold text-white">Admin Access</h3>
                    <p className="text-sm text-slate-400">Verify your identity</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white outline-none focus:border-cyber-500 transition-colors" placeholder="Email" autoFocus />
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white outline-none focus:border-cyber-500 transition-colors" placeholder="Password" />
                    {error && <p className="text-red-400 text-xs mt-1 text-center">{error}</p>}
                    <button type="submit" className="w-full bg-cyber-600 hover:bg-cyber-500 text-white font-medium py-2 rounded-lg transition-colors">Login</button>
                </form>
            </motion.div>
        </div>
    );
};

// --- Sections ---

type Lang = 'en' | 'ar';

const Navbar = ({ 
    lang, 
    setLang, 
    t, 
    onOpenLogin, 
    currentThemeId, 
    setThemeId, 
    allThemes 
}: { 
    lang: Lang, 
    setLang: (l: Lang) => void, 
    t: any, 
    onOpenLogin: () => void, 
    currentThemeId: string, 
    setThemeId: (id: string) => void,
    allThemes: ThemePalette[]
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);
  const themePickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (themePickerRef.current && !themePickerRef.current.contains(event.target as Node)) {
            setShowThemePicker(false);
        }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { name: t.nav.about, href: '#about' },
    { name: t.nav.experience, href: '#experience' },
    { name: t.nav.skills, href: '#skills' },
    { name: t.nav.projects, href: '#projects' },
    { name: t.nav.certifications, href: '#certifications' },
  ];
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
      setIsOpen(false);
    }
  };
  const scrollToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      setIsOpen(false);
  }

  const currentTheme = allThemes.find(t => t.id === currentThemeId) || PRESET_THEMES[0];

  return (
    <nav className="fixed top-0 w-full z-50 bg-dark-bg/80 backdrop-blur-lg border-b border-slate-800/50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
             <a href="#home" onClick={(e) => { if (e.ctrlKey) { scrollToTop(e); } else { e.preventDefault(); onOpenLogin(); } }} className="text-2xl font-display font-bold bg-gradient-to-r from-cyber-400 to-indigo-400 bg-clip-text text-transparent cursor-pointer hover:opacity-80 transition-opacity" title="Admin Login">M.Elrais</a>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-baseline space-x-1 lg:space-x-4 rtl:space-x-reverse">
              {navLinks.map((link) => (
                <a key={link.name} href={link.href} onClick={(e) => handleNavClick(e, link.href)} className="text-slate-300 hover:text-cyber-400 hover:bg-slate-800/50 px-3 py-2 rounded-md text-sm font-medium transition-all">{link.name}</a>
              ))}
              <a href="#contact" onClick={(e) => handleNavClick(e, '#contact')} className="bg-cyber-600 hover:bg-cyber-500 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all shadow-lg shadow-cyber-900/30 hover:shadow-cyber-500/20">{t.nav.contact}</a>
            </div>
            
            {/* Theme Picker */}
            <div className="relative" ref={themePickerRef}>
                <button 
                    onClick={() => setShowThemePicker(!showThemePicker)}
                    className="p-2 rounded-full text-slate-300 hover:text-white hover:bg-slate-800 border border-transparent hover:border-cyber-500/30 transition-all"
                    title={`Current Theme: ${currentTheme.name}`}
                >
                    <Palette size={18} className="text-cyber-400" />
                </button>
                <AnimatePresence>
                    {showThemePicker && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 top-12 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-4 grid grid-cols-3 gap-3 z-[60]"
                        >
                            <div className="col-span-3 text-xs text-slate-400 font-medium mb-1">Select Theme</div>
                            {allThemes.map(theme => (
                                <button
                                    key={theme.id}
                                    onClick={() => { setThemeId(theme.id); setShowThemePicker(false); }}
                                    className={`relative group rounded-lg p-2 flex flex-col items-center gap-1 transition-all border ${currentThemeId === theme.id ? 'bg-slate-800 border-white/30' : 'border-transparent hover:bg-slate-800 hover:border-slate-600'}`}
                                    title={theme.name}
                                >
                                    <div className="w-8 h-8 rounded-full border border-white/10 shadow-sm" style={{ backgroundColor: theme.primary }} />
                                    {currentThemeId === theme.id && (
                                        <div className="absolute top-0 right-0 p-0.5 bg-white text-black rounded-full shadow-sm"><Check size={8} strokeWidth={4} /></div>
                                    )}
                                    <span className="text-[9px] text-slate-400 truncate w-full text-center group-hover:text-white">{theme.name}</span>
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <button onClick={() => setLang(lang === 'en' ? 'ar' : 'en')} className="flex items-center gap-1 text-slate-300 hover:text-white border border-slate-700 hover:border-cyber-500 rounded px-2 py-1 text-sm font-mono transition-colors"><Globe size={14} /> {lang === 'en' ? 'AR' : 'EN'}</button>
          </div>
          <div className="md:hidden flex items-center gap-4">
             <button onClick={() => setShowThemePicker(!showThemePicker)} className="text-slate-300 hover:text-white"><Palette size={20} /></button>
            <button onClick={() => setLang(lang === 'en' ? 'ar' : 'en')} className="flex items-center gap-1 text-slate-300 hover:text-white border border-slate-700 rounded px-2 py-1 text-sm font-mono"><Globe size={14} /> {lang === 'en' ? 'AR' : 'EN'}</button>
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-300 hover:text-white p-2">{isOpen ? <X size={24} /> : <Menu size={24} />}</button>
          </div>
        </div>
      </div>
      {isOpen && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="md:hidden bg-dark-card border-b border-slate-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
             {/* Mobile Theme List */}
             <div className="px-3 py-2 border-b border-slate-800 mb-2">
                 <div className="text-xs text-slate-400 mb-2 font-medium">Themes</div>
                 <div className="flex gap-2 overflow-x-auto pb-2">
                     {allThemes.map(theme => (
                        <button
                            key={theme.id}
                            onClick={() => { setThemeId(theme.id); }}
                            className={`w-8 h-8 rounded-full border shrink-0 ${currentThemeId === theme.id ? 'border-white ring-2 ring-white/20' : 'border-transparent'}`}
                            style={{ backgroundColor: theme.primary }}
                        />
                     ))}
                 </div>
             </div>
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} onClick={(e) => handleNavClick(e, link.href)} className="text-slate-300 hover:text-cyber-400 block px-3 py-2 rounded-md text-base font-medium">{link.name}</a>
            ))}
            <a href="#contact" onClick={(e) => handleNavClick(e, '#contact')} className="text-cyber-400 font-bold block px-3 py-2">{t.nav.contact}</a>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

const Hero = ({ data, onOpenGallery }: { data: ResumeData, onOpenGallery: () => void }) => {
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  
  const handleDownload = async (targetLang: 'en' | 'ar') => {
      setIsGenerating(targetLang);
      try {
          const atsData = dataManager.getData(targetLang);
          await generateATSPdf(atsData, targetLang);
      } catch (e) {
          console.error(e);
      } finally {
          setIsGenerating(null);
      }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-12 md:gap-20">
        <div className="md:w-1/2 text-center md:text-start z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyber-950/40 border border-cyber-500/30 text-cyber-300 text-sm mb-8 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyber-500"></span>
              </span>
              {data.ui.hero.available}
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-white mb-6 tracking-tight leading-tight">
              {data.personalInfo.name.split(' ').slice(0, 1)} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-400 via-teal-300 to-indigo-400 filter drop-shadow-lg">
                {data.personalInfo.name.split(' ').slice(1).join(' ')}
              </span>
            </h1>
            <p className="text-xl text-slate-400 mb-10 max-w-xl mx-auto md:mx-0 leading-relaxed font-light">
              {data.ui.hero.roleDesc}
            </p>
            
            <div className="flex flex-col gap-6 justify-center md:justify-start items-center md:items-start w-full sm:w-[400px]">
              
              {/* 1. View Work - Primary Action */}
              <button onClick={onOpenGallery} className="w-full px-8 py-4 bg-cyber-600 hover:bg-cyber-500 text-white rounded-xl font-bold transition-all hover:shadow-[0_0_20px_rgba(13,148,136,0.4)] flex items-center justify-center gap-3 group text-lg shadow-lg shadow-cyber-900/20 z-20">
                {data.ui.hero.viewWork} <Briefcase size={22} className="group-hover:-rotate-12 transition-transform"/>
              </button>

              {/* 2. ATS Resume System - Secondary Action Panel */}
              <div className="w-full bg-slate-900/80 border border-slate-700/50 rounded-xl overflow-hidden backdrop-blur-md shadow-xl group/card hover:border-cyber-500/30 transition-colors">
                  
                  {/* Panel Header */}
                  <div className="bg-slate-950/80 px-4 py-2 border-b border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                          <FileCheck className="text-cyber-500" size={14} />
                          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">ATS Compliance System</span>
                      </div>
                      <div className="flex gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-500/50"></div>
                          <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/50"></div>
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500/50"></div>
                      </div>
                  </div>
                  
                  <div className="p-4 space-y-3">
                      {/* Generation Buttons */}
                      <div className="grid grid-cols-2 gap-3">
                          <button 
                            onClick={() => handleDownload('en')} 
                            disabled={!!isGenerating} 
                            className="relative h-14 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-cyber-500/50 rounded-lg flex flex-col items-center justify-center gap-1 transition-all group/btn disabled:opacity-50"
                          >
                            {isGenerating === 'en' ? (
                                <Loader2 size={20} className="animate-spin text-cyber-400" />
                            ) : (
                                <>
                                    <span className="text-xs font-bold text-slate-200 group-hover/btn:text-cyber-400 transition-colors">English CV</span>
                                    <span className="text-[9px] text-slate-500 uppercase tracking-wide">Standard Format</span>
                                </>
                            )}
                          </button>
                          
                          <button 
                            onClick={() => handleDownload('ar')} 
                            disabled={!!isGenerating} 
                            className="relative h-14 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-cyber-500/50 rounded-lg flex flex-col items-center justify-center gap-1 transition-all group/btn disabled:opacity-50"
                          >
                             {isGenerating === 'ar' ? (
                                <Loader2 size={20} className="animate-spin text-cyber-400" />
                            ) : (
                                <>
                                    <span className="text-xs font-bold text-slate-200 group-hover/btn:text-cyber-400 transition-colors font-arabic">السيرة الذاتية</span>
                                    <span className="text-[9px] text-slate-500 uppercase tracking-wide">نسخة عربية</span>
                                </>
                            )}
                          </button>
                      </div>

                      {/* Original File Link */}
                      {data.personalInfo.resumeLink && data.personalInfo.resumeLink !== '#' && (
                          <div className="pt-2 border-t border-slate-800/50 flex justify-center">
                               <a 
                                href={data.personalInfo.resumeLink} 
                                download
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2 text-[10px] text-slate-500 hover:text-indigo-400 transition-colors py-1 hover:underline decoration-indigo-500/30"
                              >
                                <FileDown size={12} /> 
                                <span>Download Original Upload / تحميل الملف الأصلي</span>
                              </a>
                          </div>
                      )}
                  </div>
              </div>

             <div className="mt-4 flex justify-center md:justify-start gap-6">
                  <a href={data.personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white hover:scale-110 transition-all"><Linkedin size={28} /></a>
                  <a href={data.personalInfo.github} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white hover:scale-110 transition-all"><Github size={28} /></a>
                  <a href={data.personalInfo.website} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white hover:scale-110 transition-all"><Globe size={28} /></a>
             </div>
             
             </div>
          </motion.div>
        </div>
        <div className="md:w-1/2 mt-12 md:mt-0 relative z-10">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, type: "spring" }} className="relative w-80 h-80 md:w-[450px] md:h-[450px] mx-auto">
             <div className="w-full h-full rounded-[2rem] overflow-hidden border border-cyber-500/20 relative z-10 bg-slate-900 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
                <img src={data.personalInfo.image || "https://picsum.photos/800/800?grayscale"} alt={data.personalInfo.name} className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-500 scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-40"></div>
             </div>
             <div className="absolute top-4 -right-4 w-full h-full border border-cyber-500/30 rounded-[2rem] -z-10 animate-pulse" />
             <div className="absolute -bottom-6 -left-6 w-full h-full border border-indigo-500/30 rounded-[2rem] -z-20" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const About = ({ data }: { data: ResumeData }) => (
  <section id="about" className="py-24 relative overflow-hidden">
    {/* Abstract Shapes */}
    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyber-900/10 rounded-full blur-[100px] -z-10" />
    <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-900/10 rounded-full blur-[80px] -z-10" />

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeading title={data.ui.sectionTitles.about} subtitle={data.ui.sectionTitles.journey} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Column: Text & Quote */}
        <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-8"
        >
            <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-8 rounded-3xl relative">
                <div className="absolute top-6 left-6 text-cyber-600/20"><Code size={40} /></div>
                <p className="text-lg md:text-xl text-slate-300 leading-relaxed font-light relative z-10 pl-6 border-l-2 border-cyber-500">
                   "{data.personalInfo.objective}"
                </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-900/30 rounded-2xl border border-slate-800 flex items-center gap-4">
                    <div className="p-3 bg-cyber-900/30 rounded-xl text-cyber-400">
                        <GraduationCap size={24} />
                    </div>
                    <div>
                        <h4 className="text-white font-bold text-sm">Master's Candidate</h4>
                        <p className="text-slate-500 text-xs">Computer Science</p>
                    </div>
                </div>
                <div className="p-4 bg-slate-900/30 rounded-2xl border border-slate-800 flex items-center gap-4">
                     <div className="p-3 bg-indigo-900/30 rounded-xl text-indigo-400">
                        <Award size={24} />
                    </div>
                    <div>
                        <h4 className="text-white font-bold text-sm">Certified</h4>
                        <p className="text-slate-500 text-xs">Cisco & Ethical Hacking</p>
                    </div>
                </div>
            </div>
        </motion.div>

        {/* Right Column: Visual Highlights Grid */}
        <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
            <div className="space-y-4 md:translate-y-8">
                <div className="p-6 bg-slate-800/40 border border-slate-700 rounded-2xl hover:bg-slate-800/60 hover:border-cyber-500/50 transition-all group cursor-default">
                    <Zap className="text-yellow-400 mb-3 group-hover:scale-110 transition-transform" size={28} />
                    <h3 className="text-white font-bold text-lg mb-2">Problem Solver</h3>
                    <p className="text-slate-400 text-sm">Turning complex requirements into seamless digital solutions.</p>
                </div>
                <div className="p-6 bg-slate-800/40 border border-slate-700 rounded-2xl hover:bg-slate-800/60 hover:border-indigo-500/50 transition-all group cursor-default">
                    <Cpu className="text-indigo-400 mb-3 group-hover:scale-110 transition-transform" size={28} />
                    <h3 className="text-white font-bold text-lg mb-2">Full Stack</h3>
                    <p className="text-slate-400 text-sm">End-to-end development from database design to frontend UI.</p>
                </div>
            </div>
            <div className="space-y-4">
                 <div className="p-6 bg-slate-800/40 border border-slate-700 rounded-2xl hover:bg-slate-800/60 hover:border-teal-500/50 transition-all group cursor-default">
                    <Target className="text-teal-400 mb-3 group-hover:scale-110 transition-transform" size={28} />
                    <h3 className="text-white font-bold text-lg mb-2">Strategic</h3>
                    <p className="text-slate-400 text-sm">Aligning technical implementation with business goals and growth.</p>
                </div>
                 <div className="p-6 bg-slate-800/40 border border-slate-700 rounded-2xl hover:bg-slate-800/60 hover:border-pink-500/50 transition-all group cursor-default">
                    <Shield className="text-pink-400 mb-3 group-hover:scale-110 transition-transform" size={28} />
                    <h3 className="text-white font-bold text-lg mb-2">Secure</h3>
                    <p className="text-slate-400 text-sm">Prioritizing data protection and system integrity in every build.</p>
                </div>
            </div>
        </motion.div>
      </div>
    </div>
  </section>
);

const Experience = ({ data }: { data: ResumeData }) => (
  <section id="experience" className="py-24 bg-dark-card/30 relative overflow-hidden">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <SectionHeading title={data.ui.sectionTitles.experience} subtitle={data.ui.sectionTitles.careerPath} />
      
      <div className="relative mt-20">
        {/* Continuous Gradient Line */}
        <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-transparent via-cyber-500 to-transparent opacity-40 shadow-[0_0_15px_rgba(20,184,166,0.5)]" />
        
        <div className="space-y-24">
          {data.experience.map((exp, index) => (
            <motion.div 
              key={exp.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              viewport={{ once: true, margin: "-50px" }}
              className={`relative flex items-center justify-between md:justify-normal gap-8 group ${
                index % 2 === 0 ? 'md:flex-row-reverse' : ''
              }`}
            >
              
              {/* Timeline Node (Dot) */}
              <div className="absolute left-[30px] md:left-1/2 transform md:-translate-x-1/2 w-4 h-4 rounded-full border-2 border-cyber-400 bg-dark-bg z-20 transition-all duration-300 group-hover:scale-150 group-hover:bg-cyber-400 group-hover:shadow-[0_0_20px_rgba(45,212,191,0.8)]"></div>
              
              {/* Date Badge (Opposite Side) */}
              <div className={`hidden md:block absolute top-0 w-1/2 ${index % 2 === 0 ? 'left-0 text-right pr-12' : 'right-0 text-left pl-12'}`}>
                   <span className="inline-block px-4 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-cyber-400 text-sm font-mono tracking-wider backdrop-blur-sm group-hover:border-cyber-500/50 transition-colors">
                       {exp.period}
                   </span>
              </div>

              {/* Content Card */}
              <div className={`w-[calc(100%-80px)] ml-20 md:ml-0 md:w-[45%] ${index % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>
                  <div className="relative p-6 bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl hover:border-cyber-500/40 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-cyber-900/10 hover:-translate-y-2">
                       {/* Mobile Date */}
                       <span className="md:hidden inline-block mb-3 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-cyber-400 text-xs font-mono">
                           {exp.period}
                       </span>

                       <div className={`flex flex-col gap-1 mb-4 ${index % 2 === 0 ? 'md:items-start' : 'md:items-end'}`}>
                            <h3 className="text-2xl font-bold text-white group-hover:text-cyber-300 transition-colors">{exp.role}</h3>
                            <div className="flex items-center gap-2 text-indigo-400 font-medium text-sm">
                                <Briefcase size={14} />
                                {exp.company}
                            </div>
                       </div>
                       
                       <ul className={`space-y-3 ${index % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>
                          {exp.description.map((item, i) => (
                            <li key={i} className={`flex ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-3 text-slate-400 text-sm leading-relaxed`}>
                               <span className="mt-2 w-1.5 h-1.5 rounded-full bg-slate-600 shrink-0 group-hover:bg-cyber-500 transition-colors" />
                               <span>{item}</span>
                            </li>
                          ))}
                       </ul>

                       <div className="absolute inset-0 bg-gradient-to-r from-cyber-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />
                  </div>
              </div>

            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const Skills = ({ data }: { data: ResumeData }) => (
  <section id="skills" className="py-24 relative">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeading title={data.ui.sectionTitles.skills} subtitle={data.ui.sectionTitles.expertise} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {data.skills.map((category, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            viewport={{ once: true }}
          >
            <Card className="h-full hover:bg-slate-800/80">
              <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center mb-6 text-cyber-400 group-hover:scale-110 transition-transform duration-300">
                {idx === 0 && <Terminal size={24} />}
                {idx === 1 && <LayoutGrid size={24} />}
                {idx === 2 && <Database size={24} />}
                {idx === 3 && <Shield size={24} />}
              </div>
              <h3 className="text-xl font-bold text-white mb-6 border-b border-slate-700 pb-3">{category.category}</h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <Badge key={skill} className="hover:bg-cyber-900/50 hover:text-cyber-200 transition-colors cursor-default">
                    {skill}
                  </Badge>
                ))}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const Projects = ({ data, onOpenGallery, onPreview }: { data: ResumeData, onOpenGallery: () => void, onPreview: (p: Project) => void }) => (
  <section id="projects" className="py-24 bg-dark-card/30">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeading title={data.ui.sectionTitles.projects} subtitle={data.ui.sectionTitles.portfolio} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {data.projects.slice(0, 3).map((project, index) => (
          <motion.div 
            key={project.id}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
            className="group"
          >
            <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 hover:border-cyber-600/50 transition-all hover:shadow-2xl hover:shadow-cyber-900/10 flex flex-col h-full">
              <div className="h-48 overflow-hidden relative bg-slate-800">
                {project.image ? (
                   <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center"><Code size={40} className="text-slate-700" /></div>
                )}
                <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                     {project.link && (
                        <button 
                            onClick={(e) => { e.stopPropagation(); onPreview(project); }}
                            className="bg-cyber-600 text-white p-3 rounded-full hover:bg-cyber-500 hover:scale-110 transition-all"
                            title="Quick Preview"
                        >
                            <Eye size={20} />
                        </button>
                     )}
                     <a href={project.link || "#"} target="_blank" rel="noreferrer" className="bg-white text-slate-900 p-3 rounded-full hover:bg-slate-200 hover:scale-110 transition-all">
                        <ExternalLink size={20} />
                     </a>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyber-400 transition-colors">{project.title}</h3>
                <p className="text-slate-400 text-sm mb-4 flex-1 line-clamp-3">{project.description}</p>
                <div className="flex flex-wrap gap-2 mt-auto">
                    {project.techStack.split(',').slice(0, 3).map((t, i) => (
                        <span key={i} className="text-[10px] font-mono text-indigo-300 bg-indigo-900/20 px-2 py-1 rounded">{t}</span>
                    ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="text-center">
        <button 
            onClick={onOpenGallery}
            className="px-8 py-3 border border-cyber-600 text-cyber-400 hover:bg-cyber-600 hover:text-white rounded-full transition-all font-medium inline-flex items-center gap-2 group"
        >
            {data.ui.gallery.title} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  </section>
);

const Certifications = ({ data, onSelectCert }: { data: ResumeData, onSelectCert: (c: Certification) => void }) => (
  <section id="certifications" className="py-24 relative">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
       <SectionHeading title={data.ui.sectionTitles.certifications} subtitle={data.ui.sectionTitles.credentials} />
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
           {data.certifications.map((cert, idx) => (
               <motion.div
                 key={cert.id}
                 initial={{ opacity: 0, scale: 0.95 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 transition={{ delay: idx * 0.05 }}
                 viewport={{ once: true }}
                 onClick={() => onSelectCert(cert)}
                 className="cursor-pointer"
               >
                   <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-xl flex items-center gap-4 hover:bg-slate-800 hover:border-cyber-500/30 transition-all group">
                       <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center shrink-0 border border-slate-700 group-hover:border-cyber-500/50">
                           {cert.image ? (
                               <img src={cert.image} alt="cert" className="w-full h-full object-cover rounded-lg" />
                           ) : (
                               <Award className="text-slate-500 group-hover:text-cyber-400 transition-colors" size={24} />
                           )}
                       </div>
                       <div className="min-w-0">
                           <h4 className="text-white font-medium text-sm truncate group-hover:text-cyber-300 transition-colors">{cert.title}</h4>
                           <p className="text-slate-500 text-xs truncate">{cert.issuer}</p>
                           <p className="text-slate-600 text-[10px] mt-0.5">{cert.date}</p>
                       </div>
                       <ExternalLink size={14} className="ml-auto text-slate-600 group-hover:text-white opacity-0 group-hover:opacity-100 transition-all" />
                   </div>
               </motion.div>
           ))}
       </div>
    </div>
  </section>
);

const Contact = ({ data }: { data: ResumeData }) => {
  const form = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const SERVICES_LIST = [
      { id: 'mobile', label: 'Mobile Application', arLabel: 'تطبيق موبايل' },
      { id: 'web', label: 'Web Application', arLabel: 'تطبيق ويب' },
      { id: 'erp', label: 'ERP System', arLabel: 'نظام ERP' },
      { id: 'personal', label: 'Personal Website', arLabel: 'موقع شخصي' },
      { id: 'security', label: 'Security Assessment', arLabel: 'تقييم أمني' },
      { id: 'brand', label: 'Visual Identity', arLabel: 'هوية بصرية' },
  ];

  const toggleService = (service: string) => {
      setSelectedServices(prev => 
          prev.includes(service) ? prev.filter(s => s !== service) : [...prev, service]
      );
  };

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.current) return;

    setStatus('sending');
    const formData = new FormData(form.current);
    
    // Add custom subject and configuration for FormSubmit
    formData.append('_subject', `New Portfolio Inquiry from ${formData.get('name')}`);
    formData.append('_template', 'table');
    formData.append('_captcha', 'false');
    // Important: We send services as a comma-separated string because FormData handles duplicate keys as array which might look messy in table view
    // The hidden input already does this, but ensure it's synced.
    
    // Use AJAX to send to FormSubmit without redirecting the user
    fetch("https://formsubmit.co/ajax/mohemadmuzamil@gmail.com", {
        method: "POST",
        body: formData
    })
    .then(response => {
        if (response.ok) {
            setStatus('success');
            if (form.current) form.current.reset();
            setSelectedServices([]);
            setTimeout(() => setStatus('idle'), 5000);
        } else {
            console.error("FormSubmit Error");
            setStatus('error');
        }
    })
    .catch(error => {
        console.error(error);
        setStatus('error');
    });
  };

  return (
    <section id="contact" className="py-24 bg-dark-card/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <SectionHeading title={data.ui.sectionTitles.contact} subtitle={data.ui.sectionTitles.connect} />
        <p className="text-slate-400 mb-12 text-lg">{data.ui.contact.subtitle}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <a href={`mailto:${data.personalInfo.email}`} className="flex flex-col items-center gap-4 p-6 bg-slate-900 rounded-2xl border border-slate-800 hover:border-cyber-500/50 transition-all group">
                <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center group-hover:bg-cyber-600 transition-colors">
                    <Mail className="text-cyber-400 group-hover:text-white" size={24} />
                </div>
                <div>
                    <h4 className="text-white font-medium">Email</h4>
                    <p className="text-slate-500 text-sm mt-1 break-all">{data.personalInfo.email}</p>
                </div>
            </a>
            <a href={`tel:${data.personalInfo.phone}`} className="flex flex-col items-center gap-4 p-6 bg-slate-900 rounded-2xl border border-slate-800 hover:border-cyber-500/50 transition-all group">
                <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center group-hover:bg-cyber-600 transition-colors">
                    <Phone className="text-cyber-400 group-hover:text-white" size={24} />
                </div>
                <div>
                    <h4 className="text-white font-medium">Phone</h4>
                    <p className="text-slate-500 text-sm mt-1" dir="ltr">{data.personalInfo.phone}</p>
                </div>
            </a>
            <a href={`https://wa.me/${data.personalInfo.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-4 p-6 bg-slate-900 rounded-2xl border border-slate-800 hover:border-cyber-500/50 transition-all group">
                <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center group-hover:bg-cyber-600 transition-colors">
                    <MessageCircle className="text-cyber-400 group-hover:text-white" size={24} />
                </div>
                <div>
                    <h4 className="text-white font-medium">WhatsApp</h4>
                    <p className="text-slate-500 text-sm mt-1" dir="ltr">{data.personalInfo.phone}</p>
                </div>
            </a>
            <div className="flex flex-col items-center gap-4 p-6 bg-slate-900 rounded-2xl border border-slate-800 hover:border-cyber-500/50 transition-all group">
                <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center group-hover:bg-cyber-600 transition-colors">
                    <MapPin className="text-cyber-400 group-hover:text-white" size={24} />
                </div>
                <div>
                    <h4 className="text-white font-medium">Location</h4>
                    <p className="text-slate-500 text-sm mt-1">{data.personalInfo.location}</p>
                </div>
            </div>
        </div>

        <Card className="max-w-xl mx-auto text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none"><SendIconLucide size={100} /></div>
            
            <form ref={form} onSubmit={sendEmail} className="space-y-6 relative z-10">
                
                {/* Feedback Messages */}
                {status === 'success' && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-300 text-sm flex items-center gap-2">
                        <CheckCircle size={16} /> {data.ui.contact.form.success}
                    </motion.div>
                )}
                {status === 'error' && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm flex items-center gap-2">
                        <AlertCircle size={16} /> {data.ui.contact.form.error}
                    </motion.div>
                )}
                
                {/* Services Checkboxes */}
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-3 text-center md:text-start">
                        {document.documentElement.lang === 'ar' ? 'نوع الخدمة المطلوبة' : 'Service Required'}
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {SERVICES_LIST.map((service) => {
                            const isSelected = selectedServices.includes(service.label);
                            return (
                                <button
                                    key={service.id}
                                    type="button"
                                    onClick={() => toggleService(service.label)}
                                    className={`relative px-3 py-2 rounded-lg border text-xs font-medium transition-all flex items-center justify-center gap-2 ${
                                        isSelected 
                                            ? 'bg-cyber-600/20 border-cyber-500 text-cyber-300 shadow-[0_0_10px_rgba(20,184,166,0.2)]' 
                                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600'
                                    }`}
                                >
                                    {isSelected && <Check size={12} />}
                                    {document.documentElement.lang === 'ar' ? service.arLabel : service.label}
                                </button>
                            );
                        })}
                    </div>
                    {/* Hidden input to send selected services */}
                    <input type="hidden" name="services" value={selectedServices.join(', ')} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">{data.ui.contact.form.name}</label>
                    <input type="text" name="name" required className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:border-cyber-500 outline-none transition-colors" />
                    </div>
                    <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">{data.ui.contact.form.email}</label>
                    <input type="email" name="email" required className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:border-cyber-500 outline-none transition-colors" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">{data.ui.contact.form.message}</label>
                    <textarea name="message" required rows={4} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:border-cyber-500 outline-none transition-colors"></textarea>
                </div>
                
                <button 
                    type="submit" 
                    disabled={status === 'sending' || status === 'success'}
                    className="w-full bg-cyber-600 hover:bg-cyber-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyber-900/20"
                >
                    {status === 'sending' ? (
                        <> <Loader2 className="animate-spin" size={18} /> {data.ui.contact.form.sending} </>
                    ) : (
                        <> <SendIconLucide size={18} /> {data.ui.contact.form.send} </>
                    )}
                </button>
            </form>
        </Card>
        </div>
    </section>
  );
};

const Footer = ({ data }: { data: ResumeData }) => (
  <footer className="bg-slate-950 py-8 border-t border-slate-900">
    <div className="max-w-7xl mx-auto px-4 text-center">
      <p className="text-slate-500 text-sm">
        © {new Date().getFullYear()} {data.personalInfo.name}. {data.ui.footer}
      </p>
      
      {/* 7Dvro Credit */}
      <p className="text-slate-600 text-xs mt-2 flex items-center justify-center gap-1">
          Designed by 
          <a 
            href="https://platform.7dvro.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-cyber-600 hover:text-cyber-400 font-medium transition-colors"
          >
              7Dvro for IT Solutions
          </a>
      </p>

      <div className="flex justify-center gap-4 mt-4">
           <a href={data.personalInfo.facebook} className="text-slate-600 hover:text-blue-500 transition-colors"><Facebook size={20} /></a>
           <a href={data.personalInfo.linkedin} className="text-slate-600 hover:text-blue-400 transition-colors"><Linkedin size={20} /></a>
           <a href={data.personalInfo.github} className="text-slate-600 hover:text-white transition-colors"><Github size={20} /></a>
      </div>
    </div>
  </footer>
);

export const App = () => {
  const [lang, setLang] = useState<Lang>('en');
  // Initialize with data from LocalStorage if available
  const [resumeData, setResumeData] = useState<ResumeData>(dataManager.getData('en'));
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);
  
  // Theme State
  const [themeId, setThemeId] = useState<string>('cyber');
  
  // Login & Admin State
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  
  // Preview State
  const [previewProject, setPreviewProject] = useState<Project | null>(null);

  useEffect(() => {
    // When lang changes, re-fetch data for that lang
    setResumeData(dataManager.getData(lang));
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  // Combine Presets with Custom Themes from Data
  const allThemes = [...PRESET_THEMES, ...(resumeData.customThemes || [])];

  // --- Theme Application Effect ---
  useEffect(() => {
    const root = document.documentElement;
    const selectedTheme = allThemes.find(t => t.id === themeId) || PRESET_THEMES[0];
    
    // Apply CSS variables for the selected theme
    Object.entries(selectedTheme.colors).forEach(([shade, value]) => {
      root.style.setProperty(`--cyber-${shade}`, value);
    });
  }, [themeId, resumeData.customThemes]);

  const handleDataUpdate = () => {
      setResumeData(dataManager.getData(lang));
  };

  return (
    <div className={`min-h-screen bg-dark-bg text-slate-200 selection:bg-cyber-500/30 ${lang === 'ar' ? 'font-arabic' : 'font-sans'}`}>
      <Background />
      <Navbar 
        lang={lang} 
        setLang={setLang} 
        t={resumeData.ui} 
        onOpenLogin={() => setIsLoginOpen(true)} 
        currentThemeId={themeId} 
        setThemeId={setThemeId} 
        allThemes={allThemes}
      />
      
      <main>
        <Hero data={resumeData} onOpenGallery={() => setGalleryOpen(true)} />
        <About data={resumeData} />
        <Experience data={resumeData} />
        <Skills data={resumeData} />
        <Projects data={resumeData} onOpenGallery={() => setGalleryOpen(true)} onPreview={setPreviewProject} />
        <Certifications data={resumeData} onSelectCert={setSelectedCert} />
        <Contact data={resumeData} />
      </main>

      <Footer data={resumeData} />
      <ChatWidget />
      
      <ProjectGallery 
        isOpen={galleryOpen} 
        onClose={() => setGalleryOpen(false)} 
        data={resumeData} 
        lang={lang}
        onPreview={setPreviewProject}
      />

      <AnimatePresence>
          {selectedCert && (
              <CertificateModal cert={selectedCert} onClose={() => setSelectedCert(null)} />
          )}
          {isLoginOpen && (
              <LoginModal 
                isOpen={isLoginOpen} 
                onClose={() => setIsLoginOpen(false)} 
                onSuccess={() => { setIsLoginOpen(false); setIsAdminOpen(true); }}
                correctPassword={resumeData.adminConfig?.password}
              />
          )}
          {isAdminOpen && (
              <AdminDashboard 
                currentData={resumeData} 
                lang={lang} 
                onUpdate={handleDataUpdate} 
                onClose={() => setIsAdminOpen(false)} 
              />
          )}
          {previewProject && (
              <LivePreviewModal 
                url={previewProject.link || null} 
                title={previewProject.title} 
                onClose={() => setPreviewProject(null)} 
              />
          )}
      </AnimatePresence>
    </div>
  );
};
