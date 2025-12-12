export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string[];
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  status: string;
}

export interface Certification {
  id: string;
  title: string;
  issuer?: string;
}

export interface SkillCategory {
  category: string;
  skills: string[];
}

export type ProjectCategory = 'all' | 'web' | 'mobile' | 'desktop' | 'design';

export interface Project {
  id: string;
  title: string;
  techStack: string;
  description?: string;
  link?: string;
  category: ProjectCategory;
  image?: string; // Optional URL for project screenshot/thumbnail
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
  hasAttachment?: boolean;
}

export interface ResumeData {
  adminConfig?: {
    password?: string;
  };
  personalInfo: {
    name: string;
    role: string;
    location: string;
    phone: string;
    email: string;
    website: string;
    linkedin: string;
    github: string;
    facebook: string;
    stackoverflow: string;
    objective: string;
    image?: string; // Profile picture URL or Base64
    resumeLink?: string; // Link to download CV
  };
  experience: Experience[];
  education: Education[];
  certifications: Certification[];
  skills: SkillCategory[];
  projects: Project[];
  ui: {
    nav: { [key: string]: string };
    hero: { available: string; viewWork: string; downloadCv: string; roleDesc: string; };
    sectionTitles: { [key: string]: string };
    contact: { 
      title: string; 
      subtitle: string; 
      desc: string; 
      form: { 
        name: string; 
        email: string; 
        message: string; 
        send: string; 
        sending: string;
        success: string;
        error: string;
      } 
    };
    gallery: {
      title: string;
      subtitle: string;
      close: string;
      filters: { [key in ProjectCategory]: string };
    };
    footer: string;
  }
}