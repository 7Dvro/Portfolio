
import React, { useState, useEffect } from 'react';
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
  Maximize2
} from 'lucide-react';
import { RESUME_DATA } from './constants';
import { ChatWidget } from './components/ChatWidget';
import { ProjectCategory, Project, ResumeData, Certification } from './types';
import { AdminDashboard } from './components/AdminDashboard';
import { dataManager } from './utils/dataManager';
import { generateATSPdf } from './utils/pdfGenerator';

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
                animate={{ opacity: 1, scale: 1 }}
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

const Navbar = ({ lang, setLang, t, onOpenLogin }: { lang: Lang, setLang: (l: Lang) => void, t: any, onOpenLogin: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
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
            <button onClick={() => setLang(lang === 'en' ? 'ar' : 'en')} className="flex items-center gap-1 text-slate-300 hover:text-white border border-slate-700 hover:border-cyber-500 rounded px-2 py-1 text-sm font-mono transition-colors"><Globe size={14} /> {lang === 'en' ? 'AR' : 'EN'}</button>
          </div>
          <div className="md:hidden flex items-center gap-4">
            <button onClick={() => setLang(lang === 'en' ? 'ar' : 'en')} className="flex items-center gap-1 text-slate-300 hover:text-white border border-slate-700 rounded px-2 py-1 text-sm font-mono"><Globe size={14} /> {lang === 'en' ? 'AR' : 'EN'}</button>
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-300 hover:text-white p-2">{isOpen ? <X size={24} /> : <Menu size={24} />}</button>
          </div>
        </div>
      </div>
      {isOpen && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="md:hidden bg-dark-card border-b border-slate-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
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
  const handleDownload = (lang: 'en' | 'ar') => {
      setIsGenerating(lang);
      const atsData = dataManager.getData('en');
      setTimeout(() => { generateATSPdf(atsData, lang); setIsGenerating(null); }, 500);
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
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start items-center">
              <button onClick={onOpenGallery} className="w-full sm:w-auto px-8 py-4 bg-cyber-600 hover:bg-cyber-500 text-white rounded-xl font-bold transition-all hover:shadow-[0_0_20px_rgba(13,148,136,0.4)] flex items-center justify-center gap-2 group">
                {data.ui.hero.viewWork} <Briefcase size={20} className="group-hover:rotate-12 transition-transform"/>
              </button>
              <div className="flex gap-3 w-full sm:w-auto">
                  <button onClick={() => handleDownload('en')} disabled={!!isGenerating} className="flex-1 sm:flex-none px-6 py-4 bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-sm backdrop-blur-md">
                    {isGenerating === 'en' ? <Loader2 size={16} className="animate-spin" /> : <FileText size={18} />} CV (EN)
                  </button>
                  <button onClick={() => handleDownload('ar')} disabled={!!isGenerating} className="flex-1 sm:flex-none px-6 py-4 bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-sm backdrop-blur-md">
                    {isGenerating === 'ar' ? <Loader2 size={16} className="animate-spin" /> : <FileText size={18} />} CV (AR)
                  </button>
              </div>
            </div>
             <div className="mt-8 flex justify-center md:justify-start gap-6">
                  <a href={data.personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white hover:scale-110 transition-all"><Linkedin size={28} /></a>
                  <a href={data.personalInfo.github} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white hover:scale-110 transition-all"><Github size={28} /></a>
                  <a href={data.personalInfo.website} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white hover:scale-110 transition-all"><Globe size={28} /></a>
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
  <section id="about" className="py-24 relative">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeading title={data.ui.sectionTitles.about} subtitle={data.ui.sectionTitles.journey} />
      <div className="bg-dark-card/30 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-64 h-64 bg-cyber-900/10 rounded-full blur-3xl -z-10 group-hover:bg-cyber-900/20 transition-colors"></div>
        <p className="text-xl md:text-2xl text-slate-300 leading-relaxed font-light text-center">
          "{data.personalInfo.objective}"
        </p>
      </div>
    </div>
  </section>
);

const ExperienceSection = ({ data }: { data: ResumeData }) => (
  <section id="experience" className="py-24">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeading title={data.ui.sectionTitles.experience} subtitle={data.ui.sectionTitles.careerPath} />
      <div className="space-y-8 relative">
        <div className="absolute left-8 top-0 bottom-0 w-px bg-slate-800 hidden md:block"></div>
        {data.experience.map((exp, idx) => (
          <div key={exp.id} className="relative pl-0 md:pl-20">
             <div className="hidden md:flex absolute left-[27px] top-6 w-3 h-3 bg-cyber-500 rounded-full shadow-[0_0_10px_rgba(20,184,166,0.5)] z-10"></div>
             <Card className="group">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800/50">
                <div>
                    <h3 className="text-2xl font-bold text-white group-hover:text-cyber-400 transition-colors">{exp.role}</h3>
                    <div className="flex items-center gap-2 text-cyber-300 mt-1 font-medium">
                    <Briefcase size={16} />
                    <span>{exp.company}</span>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-slate-400 bg-slate-900/50 px-4 py-2 rounded-full text-sm font-mono border border-slate-800">
                    <div className="w-2 h-2 rounded-full bg-cyber-500 animate-pulse" />
                    {exp.period}
                </div>
                </div>
                <ul className="space-y-3">
                {exp.description.map((desc, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-400 text-base leading-relaxed">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-cyber-700 flex-shrink-0" />
                    {desc}
                    </li>
                ))}
                </ul>
            </Card>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const SkillsSection = ({ data }: { data: ResumeData }) => (
  <section id="skills" className="py-24 bg-slate-900/20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeading title={data.ui.sectionTitles.skills} subtitle={data.ui.sectionTitles.expertise} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.skills.map((category, idx) => (
          <Card key={idx} className="h-full bg-slate-900/40 border-slate-800/80">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
              <span className={`p-2 rounded-lg ${
                  idx === 0 ? 'bg-blue-900/20 text-blue-400' : 
                  idx === 1 ? 'bg-purple-900/20 text-purple-400' : 
                  idx === 2 ? 'bg-green-900/20 text-green-400' : 'bg-red-900/20 text-red-400'
              }`}>
                 {idx === 0 ? <Terminal size={20} /> : 
                  idx === 1 ? <Layers size={20} /> : 
                  idx === 2 ? <Database size={20} /> : <Shield size={20} />}
              </span>
              {category.category}
            </h3>
            <div className="flex flex-wrap gap-2">
              {category.skills.map((skill) => (
                <span key={skill} className="px-3 py-1.5 bg-slate-800 border border-slate-700 text-slate-300 text-sm rounded-md font-medium hover:bg-slate-700 hover:text-white hover:border-cyber-500/50 transition-all cursor-default">
                  {skill}
                </span>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  </section>
);

const ProjectsPreviewSection = ({ 
  data, 
  onOpenGallery,
  onPreview
}: { 
  data: ResumeData, 
  onOpenGallery: () => void,
  onPreview: (project: Project) => void
}) => (
  <section id="projects" className="py-24">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeading title={data.ui.sectionTitles.projects} subtitle={data.ui.sectionTitles.portfolio} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {data.projects.slice(0, 3).map((project) => (
          <Card key={project.id} className="group cursor-pointer h-full flex flex-col p-0 overflow-hidden border-0" onClick={onOpenGallery}>
            <div className="h-56 overflow-hidden bg-slate-800 relative">
               {project.image ? (
                   <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
               ) : (
                   <div className="flex items-center justify-center h-full text-slate-600"><Code size={40} /></div>
               )}
               <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm gap-2">
                  <span className="px-5 py-2 bg-white text-slate-900 rounded-full font-bold text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform hover:bg-slate-200">View Details</span>
                  {project.link && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); onPreview(project); }}
                        className="px-3 py-2 bg-cyber-600 text-white rounded-full font-bold text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform hover:bg-cyber-500 flex items-center gap-1"
                        title="Live Preview"
                      >
                          <Eye size={16} /> Live
                      </button>
                  )}
               </div>
            </div>
            <div className="p-6 flex-1 flex flex-col bg-slate-900/50">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyber-400 transition-colors">{project.title}</h3>
                <p className="text-slate-400 text-sm mb-4 line-clamp-2 flex-1">{project.description}</p>
                <div className="flex flex-wrap gap-2 mt-auto">
                    {project.techStack.split(',').slice(0,3).map((t, i) => (
                        <span key={i} className="text-xs text-indigo-300 bg-indigo-900/20 px-2 py-1 rounded">{t}</span>
                    ))}
                </div>
            </div>
          </Card>
        ))}
      </div>
      <div className="text-center">
        <button onClick={onOpenGallery} className="px-10 py-4 bg-transparent border border-cyber-600 text-cyber-400 hover:bg-cyber-600 hover:text-white rounded-full font-bold tracking-wide transition-all flex items-center gap-3 mx-auto group hover:shadow-[0_0_30px_rgba(13,148,136,0.3)]">
          {data.ui.gallery.title} <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  </section>
);

const CertificationsSection = ({ data }: { data: ResumeData }) => {
    const [selectedCert, setSelectedCert] = useState<Certification | null>(null);

    return (
        <section id="certifications" className="py-24 bg-slate-900/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeading title={data.ui.sectionTitles.certifications} subtitle={data.ui.sectionTitles.credentials} />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data.certifications.map((cert) => (
                        <Card key={cert.id} className="group cursor-pointer hover:border-cyber-500/50" onClick={() => setSelectedCert(cert)}>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-800 border border-slate-700 shrink-0">
                                    {cert.image ? (
                                        <img src={cert.image} alt={cert.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-600"><Award size={24}/></div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-white font-bold text-sm leading-tight group-hover:text-cyber-400 transition-colors line-clamp-2">{cert.title}</h4>
                                    {cert.issuer && <p className="text-xs text-slate-500 mt-1">{cert.issuer}</p>}
                                    {cert.date && <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 font-mono"><Calendar size={12}/> {cert.date}</p>}
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <span className="text-xs text-cyber-500 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    View Certificate <Eye size={12} />
                                </span>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
            <AnimatePresence>
                {selectedCert && <CertificateModal cert={selectedCert} onClose={() => setSelectedCert(null)} />}
            </AnimatePresence>
        </section>
    );
};

const ContactSection = ({ data }: { data: ResumeData }) => {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const { name, email, subject, message } = formData;
        const mailSubject = encodeURIComponent(subject || `Portfolio Contact: ${name}`);
        const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
        // Send email to "mohemadmuzamil@gmail.com"
        window.location.href = `mailto:mohemadmuzamil@gmail.com?subject=${mailSubject}&body=${body}`;
    };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <section id="contact" className="py-24 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-900/10 rounded-full blur-[100px] -z-10 translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyber-900/10 rounded-full blur-[100px] -z-10 -translate-x-1/2 translate-y-1/2"></div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeading title={data.ui.sectionTitles.contact} subtitle={data.ui.sectionTitles.connect} />
                
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
                    {/* Contact Info Side */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-dark-card/50 backdrop-blur-md border border-slate-800 rounded-2xl p-6 hover:border-cyber-500/30 transition-all group">
                            <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all">
                                <Mail size={24} />
                            </div>
                            <h4 className="text-lg font-bold text-white mb-1">Email</h4>
                            <a href={`mailto:${data.personalInfo.email}`} className="text-slate-400 hover:text-cyber-400 transition-colors break-all">{data.personalInfo.email}</a>
                        </div>

                        <div className="bg-dark-card/50 backdrop-blur-md border border-slate-800 rounded-2xl p-6 hover:border-cyber-500/30 transition-all group">
                            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all">
                                <Phone size={24} />
                            </div>
                            <h4 className="text-lg font-bold text-white mb-1">Phone</h4>
                            <a href={`tel:${data.personalInfo.phone}`} className="text-slate-400 hover:text-cyber-400 transition-colors">{data.personalInfo.phone}</a>
                        </div>

                        <div className="bg-dark-card/50 backdrop-blur-md border border-slate-800 rounded-2xl p-6 hover:border-cyber-500/30 transition-all group">
                            <div className="w-12 h-12 bg-rose-500/10 rounded-xl flex items-center justify-center text-rose-400 mb-4 group-hover:scale-110 group-hover:bg-rose-500/20 transition-all">
                                <MapPin size={24} />
                            </div>
                            <h4 className="text-lg font-bold text-white mb-1">Location</h4>
                            <p className="text-slate-400">{data.personalInfo.location}</p>
                        </div>
                    </div>

                    {/* Form Side */}
                    <div className="lg:col-span-3">
                        <div className="bg-dark-card border border-slate-800 rounded-3xl p-8 lg:p-10 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyber-500 via-indigo-500 to-purple-500"></div>
                            
                            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                                <MessageSquare className="text-cyber-400" /> Send a Message
                            </h3>

                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                                            <User size={14} /> {data.ui.contact.form.name}
                                        </label>
                                        <input 
                                            type="text" 
                                            name="name" 
                                            placeholder="Your Name" 
                                            value={formData.name} 
                                            onChange={handleChange} 
                                            required 
                                            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-cyber-500 focus:ring-1 focus:ring-cyber-500 outline-none transition-all placeholder:text-slate-600" 
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                                            <AtSign size={14} /> {data.ui.contact.form.email}
                                        </label>
                                        <input 
                                            type="email" 
                                            name="email" 
                                            placeholder="your@email.com" 
                                            value={formData.email} 
                                            onChange={handleChange} 
                                            required 
                                            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-cyber-500 focus:ring-1 focus:ring-cyber-500 outline-none transition-all placeholder:text-slate-600" 
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-400">Subject</label>
                                    <input 
                                        type="text" 
                                        name="subject" 
                                        placeholder="Project Inquiry / Job Opportunity" 
                                        value={formData.subject} 
                                        onChange={handleChange} 
                                        required 
                                        className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-cyber-500 focus:ring-1 focus:ring-cyber-500 outline-none transition-all placeholder:text-slate-600" 
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                                        <FileText size={14} /> {data.ui.contact.form.message}
                                    </label>
                                    <textarea 
                                        rows={6} 
                                        name="message" 
                                        placeholder="Tell me about your project..." 
                                        value={formData.message} 
                                        onChange={handleChange} 
                                        required 
                                        className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-cyber-500 focus:ring-1 focus:ring-cyber-500 outline-none transition-all placeholder:text-slate-600 resize-none" 
                                    />
                                </div>

                                <button 
                                    type="submit" 
                                    className="w-full bg-gradient-to-r from-cyber-600 to-indigo-600 hover:from-cyber-500 hover:to-indigo-500 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyber-900/20 hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    {data.ui.contact.form.send} <SendIconLucide size={20} />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const Footer = ({ text, website }: { text: string, website: string }) => (
  <footer className="py-12 bg-slate-950 border-t border-slate-900 relative overflow-hidden mt-12">
    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>
    <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
      <div className="mb-8">
        <a href="#home" className="text-2xl font-display font-bold text-white tracking-tight">M.Elrais</a>
        <p className="text-slate-500 mt-2 text-sm">Building digital experiences that matter.</p>
      </div>
      
      <div className="border-t border-slate-800/50 my-8 w-1/3 mx-auto"></div>

      <p className="text-slate-400 mb-4 text-sm">
        &copy; {new Date().getFullYear()} Mohamed Muzamil Elrais. {text}
      </p>
      
      <div className="flex items-center justify-center gap-2 text-sm text-slate-500 bg-slate-900/50 inline-flex px-4 py-2 rounded-full border border-slate-800">
        <span>Developed by</span>
        <a href={website} target="_blank" rel="noopener noreferrer" className="text-cyber-500 hover:text-cyber-400 font-medium flex items-center gap-1 transition-colors hover:underline decoration-cyber-500/30">
           <Code size={14} /> 7Dvro for IT Solutions
        </a>
      </div>
    </div>
  </footer>
);

export const App: React.FC = () => {
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const [data, setData] = useState<ResumeData>(dataManager.getData('en'));
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [previewProject, setPreviewProject] = useState<Project | null>(null);

  useEffect(() => { setData(dataManager.getData(lang)); }, [lang]);
  useEffect(() => {
    const handleUpdate = () => { setData(dataManager.getData(lang)); };
    window.addEventListener('resumeDataUpdated', handleUpdate);
    return () => window.removeEventListener('resumeDataUpdated', handleUpdate);
  }, [lang]);
  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <div className="bg-dark-bg min-h-screen text-slate-200 selection:bg-cyber-500/30 selection:text-cyber-200 font-sans">
      <Background />
      <Navbar lang={lang} setLang={setLang} t={data.ui} onOpenLogin={() => setLoginOpen(true)} />
      <main className="relative">
        <Hero data={data} onOpenGallery={() => setGalleryOpen(true)} />
        <About data={data} />
        <ExperienceSection data={data} />
        <SkillsSection data={data} />
        <ProjectsPreviewSection data={data} onOpenGallery={() => setGalleryOpen(true)} onPreview={setPreviewProject} />
        <CertificationsSection data={data} />
        <ContactSection data={data} />
      </main>
      <Footer text={data.ui.footer} website={data.personalInfo.website} />
      <ChatWidget />
      
      <ProjectGallery 
        isOpen={galleryOpen} 
        onClose={() => setGalleryOpen(false)} 
        data={data} 
        lang={lang} 
        onPreview={setPreviewProject}
      />

      <AnimatePresence>
        {previewProject && (
          <LivePreviewModal 
            url={previewProject.link || null} 
            title={previewProject.title} 
            onClose={() => setPreviewProject(null)} 
          />
        )}
      </AnimatePresence>

      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} onSuccess={() => { setLoginOpen(false); setAdminOpen(true); }} correctPassword={data.adminConfig?.password} />
      {adminOpen && <AdminDashboard currentData={data} lang={lang} onClose={() => setAdminOpen(false)} onUpdate={() => setData(dataManager.getData(lang))} />}
    </div>
  );
};
