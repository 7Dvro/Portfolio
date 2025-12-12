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
  FileText
} from 'lucide-react';
import { RESUME_DATA } from './constants';
import { ChatWidget } from './components/ChatWidget';
import { ProjectCategory, Project, ResumeData } from './types';
import { AdminDashboard } from './components/AdminDashboard';
import { dataManager } from './utils/dataManager';
import { generateATSPdf } from './utils/pdfGenerator';

// --- Shared UI Components ---

const SectionHeading = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div className="mb-12 text-center">
    <motion.h2 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-cyber-400 font-medium tracking-wider uppercase text-sm mb-2"
    >
      {subtitle}
    </motion.h2>
    <motion.h3 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 }}
      className="text-3xl md:text-4xl font-display font-bold text-slate-100"
    >
      {title}
    </motion.h3>
    <motion.div 
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2, duration: 0.8 }}
      className="h-1 w-24 bg-cyber-500 mx-auto mt-4 rounded-full"
    />
  </div>
);

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className = "", onClick }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    onClick={onClick}
    className={`bg-dark-card border border-slate-800 p-6 rounded-xl hover:border-cyber-700/50 transition-colors shadow-lg ${className}`}
  >
    {children}
  </motion.div>
);

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ children, className = "" }) => (
  <span className={`px-3 py-1 bg-cyber-950/50 border border-cyber-800 text-cyber-300 text-xs rounded-full font-medium ${className}`}>
    {children}
  </span>
);

// --- Project Gallery Modal ---

const ProjectGallery = ({ 
  isOpen, 
  onClose, 
  data, 
  lang 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  data: ResumeData;
  lang: 'en' | 'ar'; 
}) => {
  const [filter, setFilter] = useState<ProjectCategory>('all');
  
  const filteredProjects = data.projects.filter(p => 
    filter === 'all' ? true : p.category === filter
  );

  const categories: ProjectCategory[] = ['all', 'web', 'mobile', 'desktop', 'design'];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-dark-bg/95 backdrop-blur-md overflow-y-auto"
        >
          <div className="min-h-screen p-4 md:p-8">
            {/* Header */}
            <div className="max-w-7xl mx-auto flex justify-between items-center mb-12 sticky top-0 bg-dark-bg/90 p-4 rounded-xl border-b border-slate-800 z-10 backdrop-blur-xl">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">{data.ui.gallery.title}</h2>
                <p className="text-slate-400 text-sm hidden md:block">{data.ui.gallery.subtitle}</p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 rounded-full bg-slate-800 hover:bg-red-500/20 text-slate-300 hover:text-red-400 transition-colors border border-slate-700 hover:border-red-500/50 group flex items-center gap-2"
              >
                <span className="hidden md:block text-sm font-medium px-2">{data.ui.gallery.close}</span>
                <X size={24} />
              </button>
            </div>

            {/* Filters */}
            <div className="max-w-7xl mx-auto mb-12">
               <div className="flex flex-wrap justify-center gap-2 md:gap-4">
                 {categories.map(cat => (
                   <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                      filter === cat 
                        ? 'bg-cyber-600 border-cyber-500 text-white shadow-lg shadow-cyber-900/40' 
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                    }`}
                   >
                     {data.ui.gallery.filters[cat]}
                   </button>
                 ))}
               </div>
            </div>

            {/* Grid */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
              <AnimatePresence mode='popLayout'>
                {filteredProjects.map((project) => (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="group"
                  >
                    <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800 hover:border-cyber-600/50 transition-all hover:shadow-2xl hover:shadow-cyber-900/20 flex flex-col h-full">
                      {/* Image Placeholder */}
                      <div className="h-48 overflow-hidden relative bg-slate-800">
                        {project.image ? (
                          <img 
                            src={project.image} 
                            alt={project.title} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                            <Code size={40} className="text-slate-700" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />
                        <div className="absolute bottom-4 left-4 right-4 rtl:left-auto rtl:right-4 flex justify-between items-end">
                           <Badge className="bg-black/50 backdrop-blur text-white border-none">
                              {data.ui.gallery.filters[project.category]}
                           </Badge>
                        </div>
                      </div>

                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-xl font-bold text-white group-hover:text-cyber-400 transition-colors">{project.title}</h3>
                          {project.link && (
                            <a 
                              href={project.link}
                              target="_blank"
                              rel="noreferrer" 
                              className="text-slate-500 hover:text-white transition-colors p-1"
                            >
                              <ExternalLink size={18} />
                            </a>
                          )}
                        </div>
                        
                        <p className="text-slate-400 text-sm mb-4 line-clamp-3">{project.description}</p>
                        
                        <div className="mt-auto pt-4 border-t border-slate-800/50">
                           <div className="flex flex-wrap gap-2">
                             {project.techStack.split(',').slice(0, 3).map((tech, i) => (
                               <span key={i} className="text-xs font-mono text-indigo-400 bg-indigo-900/10 px-2 py-1 rounded">
                                 {tech.trim()}
                               </span>
                             ))}
                           </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            {filteredProjects.length === 0 && (
                <div className="text-center py-20 text-slate-500">
                    <p>No projects found in this category.</p>
                </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// --- Login Modal ---

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
        
        // Default password is 'admin' if config is missing. 
        // For this specific request, we check hardcoded email and the configured password
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
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
                    <X size={20} />
                </button>
                <div className="flex flex-col items-center mb-6">
                    <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mb-3">
                        <Lock size={24} className="text-cyber-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Admin Access</h3>
                    <p className="text-sm text-slate-400">Verify your identity</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white outline-none focus:border-cyber-500 transition-colors"
                            placeholder="Email"
                            autoFocus
                        />
                    </div>
                    <div>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white outline-none focus:border-cyber-500 transition-colors"
                            placeholder="Password"
                        />
                    </div>
                    {error && <p className="text-red-400 text-xs mt-1 text-center">{error}</p>}
                    <button 
                        type="submit"
                        className="w-full bg-cyber-600 hover:bg-cyber-500 text-white font-medium py-2 rounded-lg transition-colors"
                    >
                        Login
                    </button>
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
      // Calculate offset to account for fixed navbar
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      
      setIsOpen(false);
    }
  };

  const scrollToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      window.scrollTo({
          top: 0,
          behavior: "smooth"
      });
      setIsOpen(false);
  }

  return (
    <nav className="fixed top-0 w-full z-50 bg-dark-bg/90 backdrop-blur-md border-b border-slate-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
             <a 
               href="#home" 
               onClick={(e) => { 
                   if (e.ctrlKey) {
                       // Keep Ctrl+Click behavior for normal link just in case
                       scrollToTop(e);
                   } else {
                       // Trigger Login on Click
                       e.preventDefault(); 
                       onOpenLogin();
                   }
               }}
               className="text-xl font-display font-bold bg-gradient-to-r from-cyber-400 to-indigo-400 bg-clip-text text-transparent cursor-pointer hover:opacity-80 transition-opacity"
               title="Admin Login"
             >
               M.Elrais
             </a>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-baseline space-x-1 lg:space-x-4 rtl:space-x-reverse">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-slate-300 hover:text-cyber-400 hover:bg-slate-800/50 px-3 py-2 rounded-md text-sm font-medium transition-all"
                >
                  {link.name}
                </a>
              ))}
              <a 
                href="#contact" 
                onClick={(e) => handleNavClick(e, '#contact')}
                className="bg-cyber-600 hover:bg-cyber-500 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-md shadow-cyber-900/20"
              >
                {t.nav.contact}
              </a>
            </div>
            
            {/* Language Switcher */}
            <button 
              onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
              className="flex items-center gap-1 text-slate-300 hover:text-white border border-slate-700 hover:border-cyber-500 rounded px-2 py-1 text-sm font-mono transition-colors"
            >
              <Globe size={14} /> {lang === 'en' ? 'AR' : 'EN'}
            </button>
          </div>

          <div className="md:hidden flex items-center gap-4">
            <button 
              onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
              className="flex items-center gap-1 text-slate-300 hover:text-white border border-slate-700 rounded px-2 py-1 text-sm font-mono"
            >
              <Globe size={14} /> {lang === 'en' ? 'AR' : 'EN'}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-300 hover:text-white p-2"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="md:hidden bg-dark-card border-b border-slate-800"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-slate-300 hover:text-cyber-400 block px-3 py-2 rounded-md text-base font-medium"
              >
                {link.name}
              </a>
            ))}
            <a 
              href="#contact" 
              onClick={(e) => handleNavClick(e, '#contact')} 
              className="text-cyber-400 font-bold block px-3 py-2"
            >
              {t.nav.contact}
            </a>
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
      // We always use English data for ATS PDF generation to ensure compatibility
      // as standard fonts do not support Arabic characters.
      const atsData = dataManager.getData('en');
      
      setTimeout(() => {
          generateATSPdf(atsData, lang);
          setIsGenerating(null);
      }, 500);
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyber-900/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-indigo-900/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 text-center md:text-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-950/50 border border-cyber-800 text-cyber-400 text-sm mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyber-500"></span>
              </span>
              {data.ui.hero.available}
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-white mb-6">
              {data.personalInfo.name.split(' ').slice(0, 1)} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-400 to-indigo-400">
                {data.personalInfo.name.split(' ').slice(1).join(' ')}
              </span>
            </h1>
            <p className="text-lg text-slate-400 mb-8 max-w-xl mx-auto md:mx-0 leading-relaxed">
              {data.ui.hero.roleDesc}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start items-center">
              <button 
                onClick={onOpenGallery}
                className="w-full sm:w-auto px-6 py-3 bg-cyber-600 hover:bg-cyber-500 text-white rounded-lg font-medium transition-all hover:shadow-lg hover:shadow-cyber-500/25 flex items-center justify-center gap-2"
              >
                {data.ui.hero.viewWork} <Briefcase size={18} />
              </button>
              
              <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => handleDownload('en')}
                    disabled={!!isGenerating}
                    className="flex-1 sm:flex-none px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
                  >
                    {isGenerating === 'en' ? <Loader2 size={16} className="animate-spin" /> : <FileText size={16} />}
                    CV (EN)
                  </button>
                  <button
                    onClick={() => handleDownload('ar')}
                    disabled={!!isGenerating}
                    className="flex-1 sm:flex-none px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
                  >
                    {isGenerating === 'ar' ? <Loader2 size={16} className="animate-spin" /> : <FileText size={16} />}
                    CV (AR)
                  </button>
              </div>
            </div>
            
             <div className="mt-6 flex justify-center md:justify-start gap-4">
                  <a href={data.personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors"><Linkedin size={24} /></a>
                  <a href={data.personalInfo.github} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors"><Github size={24} /></a>
                  <a href={data.personalInfo.website} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors"><Globe size={24} /></a>
             </div>
          </motion.div>
        </div>

        <div className="md:w-1/2 mt-12 md:mt-0 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative w-72 h-72 md:w-96 md:h-96 mx-auto"
          >
             {/* Profile Image */}
             <div className="w-full h-full rounded-2xl overflow-hidden border-2 border-cyber-500/30 relative z-10 bg-slate-800">
                <img 
                  src={data.personalInfo.image || "https://picsum.photos/800/800?grayscale"} 
                  alt={data.personalInfo.name} 
                  className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-500 hover:scale-105 transform"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-40"></div>
             </div>
             {/* Decor elements */}
             <div className="absolute -top-4 -right-4 rtl:right-auto rtl:-left-4 w-full h-full border-2 border-cyber-700/50 rounded-2xl -z-10" />
             <div className="absolute -bottom-4 -left-4 rtl:left-auto rtl:-right-4 w-full h-full border-2 border-indigo-700/50 rounded-2xl -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const About = ({ data }: { data: ResumeData }) => (
  <section id="about" className="py-20 relative">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeading title={data.ui.sectionTitles.about} subtitle={data.ui.sectionTitles.journey} />
      <div className="bg-dark-card border border-slate-800 rounded-2xl p-8 md:p-12 shadow-xl">
        <p className="text-lg text-slate-300 leading-relaxed">
          {data.personalInfo.objective}
        </p>
      </div>
    </div>
  </section>
);

const ExperienceSection = ({ data }: { data: ResumeData }) => (
  <section id="experience" className="py-20 bg-slate-900/30">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeading title={data.ui.sectionTitles.experience} subtitle={data.ui.sectionTitles.careerPath} />
      <div className="space-y-8">
        {data.experience.map((exp) => (
          <Card key={exp.id} className="relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-cyber-600/50 group-hover:bg-cyber-500 transition-colors" />
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4 pl-4">
              <div>
                <h3 className="text-xl font-bold text-white group-hover:text-cyber-400 transition-colors">{exp.role}</h3>
                <div className="flex items-center gap-2 text-cyber-300 mt-1">
                  <Briefcase size={16} />
                  <span className="font-medium">{exp.company}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-slate-400 bg-slate-900/50 px-3 py-1 rounded-full text-sm whitespace-nowrap">
                <div className="w-2 h-2 rounded-full bg-cyber-500 animate-pulse" />
                {exp.period}
              </div>
            </div>
            <ul className="space-y-2 pl-4">
              {exp.description.map((desc, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-400 text-sm md:text-base">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cyber-700 flex-shrink-0" />
                  {desc}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  </section>
);

const SkillsSection = ({ data }: { data: ResumeData }) => (
  <section id="skills" className="py-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeading title={data.ui.sectionTitles.skills} subtitle={data.ui.sectionTitles.expertise} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.skills.map((category, idx) => (
          <Card key={idx} className="h-full">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="p-1.5 bg-cyber-900/50 rounded text-cyber-400">
                 {idx === 0 ? <Terminal size={18} /> : 
                  idx === 1 ? <Layers size={18} /> : 
                  idx === 2 ? <Database size={18} /> : <Shield size={18} />}
              </span>
              {category.category}
            </h3>
            <div className="flex flex-wrap gap-2">
              {category.skills.map((skill) => (
                <Badge key={skill} className="hover:bg-cyber-900 transition-colors cursor-default">
                  {skill}
                </Badge>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  </section>
);

const ProjectsPreviewSection = ({ data, onOpenGallery }: { data: ResumeData, onOpenGallery: () => void }) => (
  <section id="projects" className="py-20 bg-slate-900/30">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeading title={data.ui.sectionTitles.projects} subtitle={data.ui.sectionTitles.portfolio} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {data.projects.slice(0, 3).map((project) => (
          <Card key={project.id} className="group cursor-pointer h-full flex flex-col" onClick={onOpenGallery}>
            <div className="h-48 -mx-6 -mt-6 mb-6 overflow-hidden bg-slate-800 relative">
               {project.image ? (
                   <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
               ) : (
                   <div className="flex items-center justify-center h-full text-slate-600"><Code size={40} /></div>
               )}
               <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white font-medium flex items-center gap-2"><ExternalLink size={16} /> View Details</span>
               </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyber-400 transition-colors">{project.title}</h3>
            <p className="text-slate-400 text-sm mb-4 line-clamp-2 flex-1">{project.description}</p>
            <div className="flex flex-wrap gap-2 mt-auto">
                {project.techStack.split(',').slice(0,3).map((t, i) => (
                    <span key={i} className="text-xs text-indigo-300 bg-indigo-900/20 px-2 py-1 rounded">{t}</span>
                ))}
            </div>
          </Card>
        ))}
      </div>
      
      <div className="text-center">
        <button 
          onClick={onOpenGallery}
          className="px-8 py-3 bg-transparent border border-cyber-600 text-cyber-400 hover:bg-cyber-600 hover:text-white rounded-full font-medium transition-all flex items-center gap-2 mx-auto group"
        >
          {data.ui.gallery.title} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  </section>
);

const CertificationsSection = ({ data }: { data: ResumeData }) => (
  <section id="certifications" className="py-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeading title={data.ui.sectionTitles.certifications} subtitle={data.ui.sectionTitles.credentials} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.certifications.map((cert) => (
          <div key={cert.id} className="flex items-start gap-4 p-4 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-cyber-700/50 transition-colors">
            <div className="p-2 bg-cyber-900/30 rounded-lg text-cyber-400 shrink-0">
              <Award size={24} />
            </div>
            <div>
              <h4 className="text-white font-medium">{cert.title}</h4>
              {cert.issuer && <p className="text-sm text-slate-500 mt-1">{cert.issuer}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const ContactSection = ({ data }: { data: ResumeData }) => (
    <section id="contact" className="py-20 bg-slate-900/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <SectionHeading title={data.ui.sectionTitles.contact} subtitle={data.ui.sectionTitles.connect} />
            <p className="text-slate-400 mb-12">{data.ui.contact.subtitle}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <a href={`mailto:${data.personalInfo.email}`} className="flex flex-col items-center p-6 bg-dark-card border border-slate-800 rounded-xl hover:border-cyber-500 transition-colors group">
                    <div className="w-12 h-12 bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
                        <Mail size={24} />
                    </div>
                    <span className="text-sm text-slate-400">Email</span>
                    <span className="text-white font-medium mt-1">{data.personalInfo.email}</span>
                </a>
                <a href={`tel:${data.personalInfo.phone}`} className="flex flex-col items-center p-6 bg-dark-card border border-slate-800 rounded-xl hover:border-cyber-500 transition-colors group">
                    <div className="w-12 h-12 bg-green-900/30 rounded-full flex items-center justify-center text-green-400 mb-4 group-hover:scale-110 transition-transform">
                        <Phone size={24} />
                    </div>
                    <span className="text-sm text-slate-400">Phone</span>
                    <span className="text-white font-medium mt-1">{data.personalInfo.phone}</span>
                </a>
                <div className="flex flex-col items-center p-6 bg-dark-card border border-slate-800 rounded-xl hover:border-cyber-500 transition-colors group">
                    <div className="w-12 h-12 bg-red-900/30 rounded-full flex items-center justify-center text-red-400 mb-4 group-hover:scale-110 transition-transform">
                        <MapPin size={24} />
                    </div>
                    <span className="text-sm text-slate-400">Location</span>
                    <span className="text-white font-medium mt-1">{data.personalInfo.location}</span>
                </div>
            </div>

            <form className="max-w-lg mx-auto space-y-4 text-left" onSubmit={(e) => e.preventDefault()}>
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">{data.ui.contact.form.name}</label>
                    <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:border-cyber-500 focus:ring-1 focus:ring-cyber-500 outline-none transition-all" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">{data.ui.contact.form.email}</label>
                    <input type="email" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:border-cyber-500 focus:ring-1 focus:ring-cyber-500 outline-none transition-all" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">{data.ui.contact.form.message}</label>
                    <textarea rows={4} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:border-cyber-500 focus:ring-1 focus:ring-cyber-500 outline-none transition-all" />
                </div>
                <button className="w-full bg-cyber-600 hover:bg-cyber-500 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
                    {data.ui.contact.form.send} <SendIconLucide size={18} />
                </button>
            </form>
        </div>
    </section>
);

const Footer = ({ text }: { text: string }) => (
    <footer className="py-8 border-t border-slate-800 bg-slate-950 text-center text-slate-500 text-sm">
        <p className="mb-2">© {new Date().getFullYear()} Mohamed Muzamil Elrais. {text}</p>
        <p className="text-xs text-slate-600 flex items-center justify-center gap-1">
            Created by <a href="#" className="text-cyber-600 hover:text-cyber-500 font-medium">7Dvro for IT Solutions</a>
        </p>
    </footer>
);

export const App: React.FC = () => {
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const [data, setData] = useState<ResumeData>(dataManager.getData('en'));
  
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);

  // Update data when language changes
  useEffect(() => {
    setData(dataManager.getData(lang));
  }, [lang]);

  // Listen for data updates (from Admin)
  useEffect(() => {
    const handleUpdate = () => {
      setData(dataManager.getData(lang));
    };
    window.addEventListener('resumeDataUpdated', handleUpdate);
    return () => window.removeEventListener('resumeDataUpdated', handleUpdate);
  }, [lang]);

  // Set HTML direction based on language
  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <div className="bg-dark-bg min-h-screen text-slate-200 selection:bg-cyber-500/30 selection:text-cyber-200">
      <Navbar 
        lang={lang} 
        setLang={setLang} 
        t={data.ui} 
        onOpenLogin={() => setLoginOpen(true)}
      />
      
      <main>
        <Hero data={data} onOpenGallery={() => setGalleryOpen(true)} />
        <About data={data} />
        <ExperienceSection data={data} />
        <SkillsSection data={data} />
        <ProjectsPreviewSection data={data} onOpenGallery={() => setGalleryOpen(true)} />
        <CertificationsSection data={data} />
        <ContactSection data={data} />
      </main>

      <Footer text={data.ui.footer} />

      {/* Modals & Widgets */}
      <ChatWidget />
      
      <ProjectGallery 
        isOpen={galleryOpen} 
        onClose={() => setGalleryOpen(false)} 
        data={data}
        lang={lang}
      />
      
      <LoginModal 
        isOpen={loginOpen} 
        onClose={() => setLoginOpen(false)} 
        onSuccess={() => {
            setLoginOpen(false);
            setAdminOpen(true);
        }}
        correctPassword={data.adminConfig?.password}
      />

      {adminOpen && (
          <AdminDashboard 
            currentData={data} 
            lang={lang} 
            onClose={() => setAdminOpen(false)}
            onUpdate={() => setData(dataManager.getData(lang))} 
          />
      )}
    </div>
  );
};
