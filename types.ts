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
}