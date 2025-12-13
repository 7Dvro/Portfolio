
import { Experience, Education, Certification, SkillCategory, Project, ProjectCategory, ResumeData } from './types';

const COMMON_INFO = {
  phone: "+249128233909",
  email: "mohemadmuzamil@gmail.com",
  website: "https://m7m4dm0z4m1.info/",
  linkedin: "https://www.linkedin.com/in/mohamed-elrais-257ab1241",
  github: "https://github.com/7Dvro",
  facebook: "https://www.facebook.com/mohamed.muzamel.54/",
  stackoverflow: "https://stackoverflow.com/users/20082541/mohemad-muzamil",
  image: "https://picsum.photos/seed/profile/800/800", // Default placeholder
  resumeLink: "#"
};

// Helper to assign images based on ID to keep it consistent
const getProjectImage = (id: string) => `https://picsum.photos/seed/${id}project/800/600`;
// Helper for cert images - using placeholders with text until user uploads real screenshots via Admin Dashboard
const getCertImage = (text: string) => `https://placehold.co/600x400/0f172a/2dd4bf?text=${encodeURIComponent(text)}&font=roboto`;

const DEFAULT_ADMIN_CONFIG = {
  password: "admin@123"
};

const CERTIFICATIONS_LIST: Certification[] = [
  { 
    id: "1", 
    title: "CyberOps Associate", 
    issuer: "Cisco", 
    date: "20 Nov 2024",
    image: getCertImage("CyberOps Associate") 
  },
  { 
    id: "2", 
    title: "Ethical Hacker", 
    issuer: "Cisco", 
    date: "03 Nov 2024",
    image: getCertImage("Ethical Hacker") 
  },
  { 
    id: "3", 
    title: "Introduction to Cybersecurity", 
    issuer: "Cisco", 
    date: "04 Nov 2024",
    image: getCertImage("Intro Cybersecurity") 
  },
  { 
    id: "4", 
    title: "Jr Penetration Tester", 
    issuer: "TryHackMe", 
    date: "29 Dec 2024",
    image: getCertImage("Jr Penetration Tester") 
  },
  { 
    id: "5", 
    title: "Network Support and Security", 
    issuer: "Cisco", 
    date: "04 Nov 2024",
    image: getCertImage("Network Support") 
  },
  { 
    id: "6", 
    title: "Network Technician", 
    issuer: "Cisco", 
    date: "04 Nov 2024",
    image: getCertImage("Network Technician") 
  },
  { 
    id: "7", 
    title: "Operating Systems Basics", 
    issuer: "Cisco", 
    date: "03 Nov 2024",
    image: getCertImage("OS Basics") 
  },
  { 
    id: "8", 
    title: "Pre Security", 
    issuer: "TryHackMe", 
    date: "29 Dec 2024",
    image: getCertImage("Pre Security") 
  },
  { 
    id: "9", 
    title: "Web Fundamentals", 
    issuer: "TryHackMe", 
    date: "29 Dec 2024",
    image: getCertImage("Web Fundamentals") 
  }
];

export const RESUME_DATA: { en: ResumeData; ar: ResumeData } = {
  en: {
    adminConfig: DEFAULT_ADMIN_CONFIG,
    personalInfo: {
      ...COMMON_INFO,
      name: "Mohamed Muzamil Elrais",
      role: "IT Professional & Full Stack Developer",
      location: "Portsudan, Sudan",
      objective: "A passionate Full Stack Software Developer with a Bachelor's in Information Technology and extensive experience in system development, programming, and technical support. Certified in Cisco Ethical Hacking and Cybersecurity, seeking to contribute technical expertise and innovative solutions as a Product Manager at Huawei."
    },
    experience: [
      {
        id: "1",
        role: "CIO",
        company: "7Days of Victory Reach Out (7Dvro)",
        period: "December 2024 – Present",
        description: [
          "Responsible for the overall management and strategic direction of the organization.",
          "Develop and implement action plans to achieve sustainable growth.",
          "Oversee various teams to ensure smooth and efficient day-to-day operations.",
          "Make key strategic decisions to enhance the organization’s impact on the community."
        ]
      },
      {
        id: "2",
        role: "IT Manager",
        company: "Alshifa Flour Mills (AFM)",
        period: "August 2023 – Present",
        description: [
          "IT Manager, Data Analyst, Web and Mobile Application Development Specialist.",
          "Expertise in Information Security, Strategic Planning and Website Management.",
          "Implemented security measures to protect systems and networks.",
          "Installed and managed surveillance camera systems."
        ]
      },
      {
        id: "3",
        role: "HR Employee",
        company: "Alshifa Flour Mills (AFM)",
        period: "May 2024 – Present",
        description: [
          "Completing and entering employee data into the electronic archive.",
          "Creating a paper archive.",
          "Drafting questionnaires to support work development."
        ]
      },
      {
        id: "4",
        role: "Teaching Assistant",
        company: "International University of Africa (IUA)",
        period: "January 2023 – Present",
        description: [
          "Teach programming principles and languages including Java and JavaScript.",
          "Instruct on database management using MySQL."
        ]
      },
      {
        id: "5",
        role: "Server Management (CS College)",
        company: "International University of Africa (IUA)",
        period: "February 2023 – Present",
        description: [
          "Providing technical support at the college.",
          "Managing the internal network and computer labs.",
          "Setting up a local server for student training."
        ]
      },
      {
        id: "6",
        role: "Freelancer - Data Analyst & Web/Mobile Developer",
        company: "Self-Employed",
        period: "September 2019 – Present",
        description: [
          "Analyzed data and created statistical programs.",
          "Designed and developed web and mobile applications."
        ]
      }
    ],
    education: [
      {
        id: "1",
        degree: "Master's Degree in Computer Science",
        institution: "International University of Africa",
        status: "In Progress"
      },
      {
        id: "2",
        degree: "Bachelor's Degree in Information Technology",
        institution: "Alsalama College of Science and Technology",
        status: "December 2022"
      }
    ],
    certifications: CERTIFICATIONS_LIST,
    skills: [
      {
        category: "Programming",
        skills: ["Python", "Java", "Dart", "HTML5", "CSS3", "JavaScript", "PHP"]
      },
      {
        category: "Frameworks & Tools",
        skills: ["Flutter", "React", "Node.js", "WordPress", "Docker", "Sass", "Git"]
      },
      {
        category: "Databases",
        skills: ["MySQL", "MongoDB", "Firebase", "SQL"]
      },
      {
        category: "Technical",
        skills: ["Ethical Hacking", "Penetration Testing", "Network Security", "System Optimization", "AWS", "Huawei Products"]
      }
    ],
    projects: [
      {
        id: "p1",
        title: "Sudanese General Authority for Imams",
        techStack: "Web Technologies, CMS",
        description: "Official website for the Sudanese General Authority for Imams and Preachers (aiuag).",
        link: "https://aiuag.org/",
        category: "web",
        image: getProjectImage("aiuag")
      },
      {
        id: "p2",
        title: "7Dvro Platform",
        techStack: "Full Stack, Web System",
        description: "A comprehensive digital platform for 7Days of Victory Reach Out.",
        link: "https://platform.7dvro.com",
        category: "web",
        image: getProjectImage("7dvro")
      },
      {
        id: "p3",
        title: "Personal Portfolio",
        techStack: "React, Tailwind, Gemini AI",
        description: "My personal interactive portfolio showcasing my work and AI assistant.",
        link: "https://m7m4dm0z4m1.info/",
        category: "web",
        image: getProjectImage("portfolio")
      },
      {
        id: "p4",
        title: "Sadiq Al-Taj Quranic School",
        techStack: "Odoo, Web Technologies",
        description: "Official website for Sadiq Al-Taj Quranic Primary School.",
        link: "https://satqs1.odoo.com",
        category: "web",
        image: getProjectImage("1")
      },
      {
        id: "p5",
        title: "Routing an Ambulance",
        techStack: "Flutter, Firebase, Google Maps",
        description: "Mobile application for emergency response optimization.",
        category: "mobile",
        image: getProjectImage("3")
      },
      {
        id: "p6",
        title: "Management System",
        techStack: "Java, NetBeans",
        description: "Desktop application for internal resource management.",
        category: "desktop",
        image: getProjectImage("6")
      }
    ],
    ui: {
      nav: {
        about: "About",
        experience: "Experience",
        skills: "Skills",
        projects: "Projects",
        certifications: "Certifications",
        contact: "Contact Me"
      },
      hero: {
        available: "Available for Hire",
        viewWork: "View Work",
        downloadCv: "Download CV",
        roleDesc: "IT Professional & Full Stack Developer specialized in creating secure, scalable web applications and managing IT infrastructure. Master's candidate in CS."
      },
      sectionTitles: {
        about: "About Me",
        journey: "My Journey",
        experience: "Professional Experience",
        careerPath: "Career Path",
        skills: "Technical Skills",
        expertise: "Expertise",
        projects: "Featured Projects",
        portfolio: "Portfolio",
        certifications: "Certifications",
        credentials: "Credentials",
        contact: "Get In Touch",
        connect: "Contact"
      },
      contact: {
        title: "Let's Connect",
        subtitle: "I'm always open to discussing product design, collaborating on projects, or partnerships.",
        desc: "I'm always open to discussing product design, collaborating on projects, or partnerships.",
        form: {
          name: "Name",
          email: "Email",
          message: "Message",
          send: "Send Message",
          sending: "Sending...",
          success: "Message sent successfully!",
          error: "Failed to send. Please try again."
        }
      },
      gallery: {
        title: "Project Gallery",
        subtitle: "A showcase of my latest work",
        close: "Close Gallery",
        filters: {
          all: "All",
          web: "Web",
          mobile: "Mobile",
          desktop: "Desktop",
          design: "Design"
        }
      },
      footer: "All rights reserved."
    }
  },
  ar: {
    adminConfig: DEFAULT_ADMIN_CONFIG,
    personalInfo: {
      ...COMMON_INFO,
      name: "محمد مزمل الريس",
      role: "متخصص تقنية معلومات ومطور شامل",
      location: "بورتسودان، السودان",
      objective: "مطور برمجيات شامل شغوف حاصل على درجة البكالوريوس في تقنية المعلومات ولديه خبرة واسعة في تطوير الأنظمة والبرمجة والدعم الفني. حاصل على شهادات معتمدة في الاختراق الأخلاقي والأمن السيبراني من سيسكو، وأسعى للمساهمة بالخبرات التقنية والحلول المبتكرة كمدير منتج في شركة هواوي."
    },
    experience: [
      {
        id: "1",
        role: "مدير المعلومات (CIO)",
        company: "7Days of Victory Reach Out (7Dvro)",
        period: "ديسمبر 2024 – الآن",
        description: [
          "مسؤول عن الإدارة العامة والتوجه الاستراتيجي للمنظمة.",
          "تطوير وتنفيذ خطط العمل لتحقيق النمو المستدام.",
          "الإشراف على فرق مختلفة لضمان عمليات يومية سلسة وفعالة.",
          "اتخاذ قرارات استراتيجية رئيسية لتعزيز تأثير المنظمة على المجتمع."
        ]
      },
      {
        id: "2",
        role: "مدير تقنية المعلومات",
        company: "مطاحن الشفاء (AFM)",
        period: "أغسطس 2023 – الآن",
        description: [
          "مدير تقنية المعلومات، محلل بيانات، ومتخصص في تطوير تطبيقات الويب والموبايل.",
          "خبرة في أمن المعلومات، التخطيط الاستراتيجي وإدارة المواقع الإلكترونية.",
          "تنفيذ تدابير أمنية لحماية الأنظمة والشبكات.",
          "تركيب وإدارة أنظمة كاميرات المراقبة."
        ]
      },
      {
        id: "3",
        role: "موظف موارد بشرية",
        company: "مطاحن الشفاء (AFM)",
        period: "مايو 2024 – الآن",
        description: [
          "إكمال وإدخال بيانات الموظفين في الأرشيف الإلكتروني.",
          "إنشاء أرشيف ورقي.",
          "صياغة استبيانات لدعم تطوير العمل."
        ]
      },
      {
        id: "4",
        role: "مساعد تدريس",
        company: "جامعة إفريقيا العالمية (IUA)",
        period: "يناير 2023 – الآن",
        description: [
          "تدريس مبادئ ولغات البرمجة بما في ذلك Java و JavaScript.",
          "تدريس إدارة قواعد البيانات باستخدام MySQL."
        ]
      },
      {
        id: "5",
        role: "إدارة الخوادم (كلية الحاسوب)",
        company: "جامعة إفريقيا العالمية (IUA)",
        period: "فبراير 2023 – الآن",
        description: [
          "تقديم الدعم الفني في الكلية.",
          "إدارة الشبكة الداخلية ومختبرات الحاسوب.",
          "إعداد خادم محلي لتدريب الطلاب."
        ]
      },
      {
        id: "6",
        role: "مستقل - محلل بيانات ومطور ويب/موبايل",
        company: "عمل حر",
        period: "سبتمبر 2019 – الآن",
        description: [
          "تحليل البيانات وإنشاء البرامج الإحصائية.",
          "تصميم وتطوير تطبيقات الويب والموبايل."
        ]
      }
    ],
    education: [
      {
        id: "1",
        degree: "ماجستير في علوم الكمبيوتر",
        institution: "جامعة إفريقيا العالمية",
        status: "قيد الدراسة"
      },
      {
        id: "2",
        degree: "بكالوريوس في تقنية المعلومات",
        institution: "كلية السلامة للعلوم والتكنولوجيا",
        status: "ديسمبر 2022"
      }
    ],
    certifications: CERTIFICATIONS_LIST,
    skills: [
      {
        category: "Programming",
        skills: ["Python", "Java", "Dart", "HTML5", "CSS3", "JavaScript", "PHP"]
      },
      {
        category: "Frameworks & Tools",
        skills: ["Flutter", "React", "Node.js", "WordPress", "Docker", "Sass", "Git"]
      },
      {
        category: "Databases",
        skills: ["MySQL", "MongoDB", "Firebase", "SQL"]
      },
      {
        category: "Technical",
        skills: ["Ethical Hacking", "Penetration Testing", "Network Security", "System Optimization", "AWS", "Huawei Products"]
      }
    ],
    projects: [
      {
        id: "p1",
        title: "الهيئة العامة السودانية للأئمة والدعاة",
        techStack: "تقنيات الويب, CMS",
        description: "الموقع الرسمي للهيئة العامة السودانية للأئمة والدعاة (aiuag).",
        link: "https://aiuag.org/",
        category: "web",
        image: getProjectImage("aiuag")
      },
      {
        id: "p2",
        title: "منصة 7Dvro",
        techStack: "Full Stack, Web System",
        description: "منصة رقمية شاملة لمنظمة 7Days of Victory Reach Out.",
        link: "https://platform.7dvro.com",
        category: "web",
        image: getProjectImage("7dvro")
      },
      {
        id: "p3",
        title: "موقعي الشخصي (البورتفوليو)",
        techStack: "React, Tailwind, Gemini AI",
        description: "موقعي الشخصي التفاعلي الذي يعرض أعمالي ومساعد الذكاء الاصطناعي.",
        link: "https://m7m4dm0z4m1.info/",
        category: "web",
        image: getProjectImage("portfolio")
      },
      {
        id: "p4",
        title: "مدارس صديق التاج القرآنية",
        techStack: "Odoo, Web Technologies",
        description: "الموقع الرسمي لمدارس صديق التاج القرآنية الأساسية.",
        link: "https://satqs1.odoo.com",
        category: "web",
        image: getProjectImage("1")
      },
      {
        id: "p5",
        title: "توجيه سيارة الإسعاف",
        techStack: "Flutter Framework, Firebase, Google Maps",
        description: "تطبيق جوال لتحسين الاستجابة للطوارئ.",
        category: "mobile",
        image: getProjectImage("3")
      },
      {
        id: "p6",
        title: "نظام إدارة (سطح مكتب)",
        techStack: "Java, NetBeans",
        description: "تطبيق سطح مكتب لإدارة الموارد الداخلية.",
        category: "desktop",
        image: getProjectImage("6")
      }
    ],
    ui: {
      nav: {
        about: "عنّي",
        experience: "الخبرات",
        skills: "المهارات",
        projects: "المشاريع",
        certifications: "الشهادات",
        contact: "تواصل معي"
      },
      hero: {
        available: "متاح للعمل",
        viewWork: "شاهد أعمالي",
        downloadCv: "تحميل السيرة الذاتية",
        roleDesc: "متخصص تقنية معلومات ومطور شامل متخصص في إنشاء تطبيقات ويب آمنة وقابلة للتطوير وإدارة البنية التحتية لتكنولوجيا المعلومات. طالب ماجستير في علوم الكمبيوتر."
      },
      sectionTitles: {
        about: "نبذة عني",
        journey: "رحلتي المهنية",
        experience: "الخبرة المهنية",
        careerPath: "المسار الوظيفي",
        skills: "المهارات التقنية",
        expertise: "الخبرات",
        projects: "مشاريع مميزة",
        portfolio: "معرض الأعمال",
        certifications: "الشهادات",
        credentials: "المؤهلات",
        contact: "تواصل معي",
        connect: "اتصال"
      },
      contact: {
        title: "دعنا نتواصل",
        subtitle: "أنا دائمًا منفتح لمناقشة تصميم المنتجات أو التعاون في المشاريع أو الشراكات.",
        desc: "أنا دائمًا منفتح لمناقشة تصميم المنتجات أو التعاون في المشاريع أو الشراكات.",
        form: {
          name: "الاسم",
          email: "البريد الإلكتروني",
          message: "الرسالة",
          send: "إرسال الرسالة",
          sending: "جاري الإرسال...",
          success: "تم إرسال الرسالة بنجاح!",
          error: "فشل الإرسال. حاول مرة أخرى."
        }
      },
      gallery: {
        title: "معرض المشاريع",
        subtitle: "عرض لأحدث أعمالي ومشاريعي التقنية",
        close: "إغلاق المعرض",
        filters: {
          all: "الكل",
          web: "مواقع ويب",
          mobile: "تطبيقات موبايل",
          desktop: "سطح المكتب",
          design: "تصميم"
        }
      },
      footer: "جميع الحقوق محفوظة."
    }
  }
};

// Flatten English data for AI Context to keep it simple and high quality
const EN = RESUME_DATA.en;
export const SYSTEM_PROMPT = `
You are an AI Assistant living in the portfolio website of Mohamed Muzamil Elrais. 
Your goal is to answer questions about Mohamed based strictly on his resume.

RESUME DATA:
Name: ${EN.personalInfo.name}
Role: ${EN.personalInfo.role}
Contact: ${EN.personalInfo.email}, ${EN.personalInfo.phone}, ${EN.personalInfo.location}
Objective: ${EN.personalInfo.objective}

Education:
${EN.education.map(e => `- ${e.degree} at ${e.institution} (${e.status})`).join('\n')}

Experience:
${EN.experience.map(e => `- ${e.role} at ${e.company} (${e.period}). Key tasks: ${e.description.join(', ')}`).join('\n')}

Skills:
${EN.skills.map(s => `- ${s.category}: ${s.skills.join(', ')}`).join('\n')}

Certifications:
${EN.certifications.map(c => `- ${c.title} (${c.issuer}, ${c.date})`).join('\n')}

Projects:
${EN.projects.map(p => `- ${p.title} using ${p.techStack}`).join('\n')}

Languages: Arabic (Native), English (Intermediate).

Be professional, concise, and enthusiastic about Mohamed's skills. If asked about something not in the resume, politelty state you don't have that information.
`;
