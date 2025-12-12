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
  ArrowRight
} from 'lucide-react';
import { RESUME_DATA } from './constants';
import { ChatWidget } from './components/ChatWidget';
import { ProjectCategory, Project } from './types';

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
  data: typeof RESUME_DATA['en'];
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

// --- Sections ---

type Lang = 'en' | 'ar';

const Navbar = ({ lang, setLang, t }: { lang: Lang, setLang: (l: Lang) => void, t: any }) => {
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
               onClick={scrollToTop}
               className="text-xl font-display font-bold bg-gradient-to-r from-cyber-400 to-indigo-400 bg-clip-text text-transparent"
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

const Hero = ({ data }: { data: typeof RESUME_DATA['en'] }) => {
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
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <a 
                href="#projects" 
                className="px-8 py-3 bg-cyber-600 hover:bg-cyber-500 text-white rounded-lg font-medium transition-all hover:shadow-lg hover:shadow-cyber-500/25 flex items-center justify-center gap-2"
              >
                {data.ui.hero.viewWork} <Briefcase size={18} />
              </a>
              <a 
                href={data.personalInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
              >
                LinkedIn <Linkedin size={18} />
              </a>
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
             {/* Profile Image Placeholder using Picsum or style if no real image */}
             <div className="w-full h-full rounded-2xl overflow-hidden border-2 border-cyber-500/30 relative z-10 bg-slate-800">
                <img 
                  src="https://picsum.photos/800/800?grayscale" 
                  alt="Mohamed Elrais" 
                  className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-500 hover:scale-105 transform"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-60"></div>
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

const About = ({ data }: { data: typeof RESUME_DATA['en'] }) => {
  return (
    <section id="about" className="py-20 bg-dark-bg">
      <div className="max-w-4xl mx-auto px-4">
        <SectionHeading title={data.ui.sectionTitles.about} subtitle={data.ui.sectionTitles.journey} />
        <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-cyber-900/50">
           <div className="prose prose-invert max-w-none text-slate-300">
             <p className="text-lg leading-relaxed mb-6">
               {data.personalInfo.objective}
             </p>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
               <div className="flex items-start gap-4">
                 <div className="p-3 rounded-lg bg-cyber-900/30 text-cyber-400">
                   <GraduationCap size={24} />
                 </div>
                 <div>
                   <h4 className="font-bold text-slate-100 mb-1">{data.ui.sectionTitles.credentials}</h4>
                   {data.education.map(edu => (
                     <div key={edu.id} className="mb-2">
                       <p className="text-sm font-semibold text-slate-200">{edu.degree}</p>
                       <p className="text-xs text-slate-400">{edu.institution} | {edu.status}</p>
                     </div>
                   ))}
                 </div>
               </div>
               
               <div className="flex items-start gap-4">
                 <div className="p-3 rounded-lg bg-indigo-900/30 text-indigo-400">
                   <Globe size={24} />
                 </div>
                 <div>
                   <h4 className="font-bold text-slate-100 mb-1">Languages</h4>
                   <p className="text-sm text-slate-300">Arabic (Native)</p>
                   <p className="text-sm text-slate-300">English (Intermediate)</p>
                 </div>
               </div>
             </div>
           </div>
        </Card>
      </div>
    </section>
  );
};

const Experience = ({ data }: { data: typeof RESUME_DATA['en'] }) => {
  return (
    <section id="experience" className="py-20 bg-slate-900/50">
      <div className="max-w-5xl mx-auto px-4">
        <SectionHeading title={data.ui.sectionTitles.experience} subtitle={data.ui.sectionTitles.careerPath} />
        <div className="relative border-l-2 border-slate-800 ms-3 md:ms-6 space-y-12">
          {data.experience.map((exp, index) => (
            <motion.div 
              key={exp.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative ps-8 md:ps-12"
            >
              <span className="absolute -start-[9px] top-0 h-4 w-4 rounded-full bg-cyber-500 border-4 border-slate-900" />
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                <h4 className="text-xl font-bold text-slate-100">{exp.role}</h4>
                <span className="text-sm text-cyber-400 font-medium px-2 py-1 bg-cyber-950/30 rounded border border-cyber-900/50 inline-block w-fit mt-1 sm:mt-0">
                  {exp.period}
                </span>
              </div>
              
              <h5 className="text-indigo-400 font-medium mb-4">{exp.company}</h5>
              
              <ul className="space-y-2">
                {exp.description.map((desc, i) => (
                  <li key={i} className="flex items-start gap-2 text-slate-400 text-sm">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-slate-600 flex-shrink-0" />
                    {desc}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Skills = ({ data }: { data: typeof RESUME_DATA['en'] }) => {
  const getIcon = (category: string) => {
    // Basic Keyword matching for Arabic/English compatibility
    if (category.includes('Programming') || category.includes('برمجة')) return <Terminal size={20} />;
    if (category.includes('Frameworks') || category.includes('أطر')) return <Code size={20} />;
    if (category.includes('Databases') || category.includes('بيانات')) return <Database size={20} />;
    return <Server size={20} />;
  };

  return (
    <section id="skills" className="py-20 bg-dark-bg">
      <div className="max-w-6xl mx-auto px-4">
        <SectionHeading title={data.ui.sectionTitles.skills} subtitle={data.ui.sectionTitles.expertise} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.skills.map((skillGroup, idx) => (
            <motion.div
              key={skillGroup.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="h-full hover:bg-slate-800/50">
                <div className="flex items-center gap-3 mb-6 border-b border-slate-700 pb-3">
                  <div className="text-cyber-400">{getIcon(skillGroup.category)}</div>
                  <h4 className="font-bold text-slate-100">{skillGroup.category}</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skillGroup.skills.map(skill => (
                    <Badge key={skill}>{skill}</Badge>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Projects = ({ data, onOpenGallery }: { data: typeof RESUME_DATA['en'], onOpenGallery: () => void }) => {
  return (
    <section id="projects" className="py-20 bg-slate-900/50">
      <div className="max-w-6xl mx-auto px-4">
        <SectionHeading title={data.ui.sectionTitles.projects} subtitle={data.ui.sectionTitles.portfolio} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Display only first 3 projects in the preview */}
          {data.projects.slice(0, 3).map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="h-full flex flex-col justify-between group cursor-pointer hover:shadow-cyber-900/20">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-slate-800 rounded-lg text-cyber-400 group-hover:text-cyber-300 transition-colors">
                      <Code size={24} />
                    </div>
                    {project.link && (
                      <a href={project.link} target="_blank" rel="noopener noreferrer" className="flex gap-2 text-slate-500 hover:text-white transition-colors" title="Visit">
                        <ExternalLink size={18} />
                      </a>
                    )}
                  </div>
                  
                  <h4 className="text-xl font-bold text-slate-100 mb-2 group-hover:text-cyber-400 transition-colors">
                    {project.title}
                  </h4>
                  <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                    {project.description}
                  </p>
                </div>
                
                <div className="mt-4 pt-4 border-t border-slate-800">
                  <p className="text-xs font-mono text-indigo-400 truncate">
                    {project.techStack}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center">
            <button 
              onClick={onOpenGallery}
              className="group flex items-center gap-2 px-8 py-3 bg-transparent border border-cyber-500 text-cyber-400 rounded-full hover:bg-cyber-500 hover:text-white transition-all duration-300 shadow-lg hover:shadow-cyber-500/25"
            >
              <LayoutGrid size={20} />
              <span className="font-medium">{data.ui.gallery.title}</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
            </button>
        </div>
      </div>
    </section>
  );
};

const Certifications = ({ data }: { data: typeof RESUME_DATA['en'] }) => {
  return (
    <section id="certifications" className="py-20 bg-dark-bg">
      <div className="max-w-6xl mx-auto px-4">
        <SectionHeading title={data.ui.sectionTitles.certifications} subtitle={data.ui.sectionTitles.credentials} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.certifications.map((cert, idx) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="flex items-center gap-3 p-4 bg-slate-800/30 border border-slate-800 rounded-lg hover:border-cyber-600/50 transition-colors"
            >
              <div className="text-green-500 flex-shrink-0">
                <Shield size={18} />
              </div>
              <span className="text-slate-300 text-sm font-medium">{cert.title}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Contact = ({ data }: { data: typeof RESUME_DATA['en'] }) => {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Use FormSubmit.co via AJAX
      const response = await fetch("https://formsubmit.co/ajax/mohemadmuzamil@gmail.com", {
        method: "POST",
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            name: formState.name,
            email: formState.email,
            message: formState.message,
            _subject: `Portfolio Contact from ${formState.name}`
        })
      });

      if (response.ok) {
        setIsSuccess(true);
        setFormState({ name: '', email: '', message: '' });
      } else {
        setError(data.ui.contact.form.error);
      }
    } catch (err) {
      setError(data.ui.contact.form.error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-slate-900/50 border-t border-slate-800">
      <div className="max-w-4xl mx-auto px-4">
        <SectionHeading title={data.ui.sectionTitles.contact} subtitle={data.ui.sectionTitles.connect} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h4 className="text-2xl font-bold text-white mb-6">{data.ui.contact.title}</h4>
            <p className="text-slate-400 mb-8">
              {data.ui.contact.subtitle}
            </p>
            
            <div className="space-y-6">
              <a href={`mailto:${data.personalInfo.email}`} className="flex items-center gap-4 text-slate-300 hover:text-cyber-400 transition-colors">
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Email</p>
                  <p className="font-medium">{data.personalInfo.email}</p>
                </div>
              </a>
              
              <a href={`tel:${data.personalInfo.phone}`} className="flex items-center gap-4 text-slate-300 hover:text-cyber-400 transition-colors">
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Phone</p>
                  <p className="font-medium">{data.personalInfo.phone}</p>
                </div>
              </a>
              
              <div className="flex items-center gap-4 text-slate-300">
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Location</p>
                  <p className="font-medium">{data.personalInfo.location}</p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4 mt-8 flex-wrap">
              <a href={data.personalInfo.website} target="_blank" rel="noreferrer" className="p-3 bg-slate-800 rounded-lg hover:bg-cyber-600 text-white transition-colors">
                <Globe size={20} />
              </a>
              <a href={data.personalInfo.linkedin} target="_blank" rel="noreferrer" className="p-3 bg-slate-800 rounded-lg hover:bg-blue-600 text-white transition-colors">
                <Linkedin size={20} />
              </a>
              <a href={data.personalInfo.github} target="_blank" rel="noreferrer" className="p-3 bg-slate-800 rounded-lg hover:bg-gray-700 text-white transition-colors">
                <Github size={20} />
              </a>
              <a href={data.personalInfo.facebook} target="_blank" rel="noreferrer" className="p-3 bg-slate-800 rounded-lg hover:bg-blue-700 text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href={data.personalInfo.stackoverflow} target="_blank" rel="noreferrer" className="p-3 bg-slate-800 rounded-lg hover:bg-orange-600 text-white transition-colors">
                <Layers size={20} />
              </a>
            </div>
          </div>

          <Card className="bg-slate-800/30">
             {isSuccess ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center h-full py-12 text-center"
              >
                <div className="w-16 h-16 bg-green-900/30 rounded-full flex items-center justify-center mb-4 text-green-400">
                  <CheckCircle size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{data.ui.contact.form.success}</h3>
                <button 
                  onClick={() => setIsSuccess(false)}
                  className="text-cyber-400 hover:text-cyber-300 text-sm mt-4 underline"
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">{data.ui.contact.form.name}</label>
                <input 
                  type="text" 
                  value={formState.name}
                  onChange={e => setFormState({...formState, name: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-1 focus:ring-cyber-500 focus:border-cyber-500 outline-none" 
                  placeholder=""
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">{data.ui.contact.form.email}</label>
                <input 
                  type="email" 
                  value={formState.email}
                  onChange={e => setFormState({...formState, email: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-1 focus:ring-cyber-500 focus:border-cyber-500 outline-none" 
                  placeholder=""
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">{data.ui.contact.form.message}</label>
                <textarea 
                  rows={4} 
                  value={formState.message}
                  onChange={e => setFormState({...formState, message: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-1 focus:ring-cyber-500 focus:border-cyber-500 outline-none" 
                  placeholder=""
                  required
                />
              </div>
              
              {error && (
                <div className="flex items-center gap-2 text-red-400 text-sm bg-red-900/20 p-3 rounded-lg">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-cyber-600 hover:bg-cyber-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    {data.ui.contact.form.sending}
                  </>
                ) : (
                  <>
                    {data.ui.contact.form.send} <SendIconLucide size={16} />
                  </>
                )}
              </button>
            </form>
            )}
          </Card>
        </div>
      </div>
    </section>
  );
};

const Footer = ({ data }: { data: typeof RESUME_DATA['en'] }) => (
  <footer className="bg-dark-bg border-t border-slate-800 py-8 text-center text-slate-500 text-sm">
    <p>© {new Date().getFullYear()} {data.personalInfo.name}. {data.ui.footer}</p>
  </footer>
);

export default function App() {
  const [lang, setLang] = useState<Lang>('en');
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  // Update document direction when language changes
  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    
    // Optional: Switch font for Arabic
    if (lang === 'ar') {
      document.body.classList.add('font-arabic');
      document.body.classList.remove('font-sans');
    } else {
      document.body.classList.add('font-sans');
      document.body.classList.remove('font-arabic');
    }
  }, [lang]);

  const currentData = RESUME_DATA[lang];

  return (
    <div className={`bg-dark-bg text-slate-200 selection:bg-cyber-500/30 selection:text-cyber-200 ${lang === 'ar' ? 'font-arabic' : 'font-sans'}`}>
      <Navbar lang={lang} setLang={setLang} t={currentData.ui} />
      <main>
        <Hero data={currentData} />
        <About data={currentData} />
        <Experience data={currentData} />
        <Skills data={currentData} />
        <Projects data={currentData} onOpenGallery={() => setIsGalleryOpen(true)} />
        <Certifications data={currentData} />
        <Contact data={currentData} />
      </main>
      <Footer data={currentData} />
      <ChatWidget />
      
      {/* Full Screen Gallery Modal */}
      <ProjectGallery 
        isOpen={isGalleryOpen} 
        onClose={() => setIsGalleryOpen(false)} 
        data={currentData}
        lang={lang}
      />
    </div>
  );
}