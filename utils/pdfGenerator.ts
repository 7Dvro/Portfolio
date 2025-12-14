
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { ResumeData } from "../types";

export const generateATSPdf = async (data: ResumeData, lang: 'en' | 'ar' = 'en') => {
  const isRTL = lang === 'ar';
  const fontFamily = isRTL ? 'Cairo, sans-serif' : 'Times New Roman, serif'; // Using Serif for ATS look in English, Cairo for Arabic
  
  // Create a temporary container for the PDF content
  // Width: 794px (A4 width at 96 DPI)
  // Height: Auto (to accommodate all content)
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.top = '-10000px';
  container.style.left = '-10000px';
  container.style.width = '794px'; 
  container.style.backgroundColor = '#ffffff';
  container.style.color = '#000000';
  container.style.fontFamily = fontFamily;
  container.style.padding = '40px 50px'; // Standard document margins
  container.style.boxSizing = 'border-box';
  container.style.lineHeight = '1.4';
  container.dir = isRTL ? 'rtl' : 'ltr';
  
  // Construct links string
  const links = [
    data.personalInfo.linkedin ? (isRTL ? "لينكد إن" : "LinkedIn") : "",
    data.personalInfo.github ? (isRTL ? "جيت هب" : "GitHub") : "",
    data.personalInfo.website ? (isRTL ? "معرض الأعمال" : "Portfolio") : ""
  ].filter(Boolean).join(" - ");

  // --- HTML Content Construction based on requested format ---
  const content = `
    <div style="display: flex; flex-direction: column; gap: 15px;">
        
        <!-- HEADER -->
        <div style="text-align: center; margin-bottom: 10px;">
            <h1 style="font-size: 22px; font-weight: 900; margin: 0 0 5px 0; text-transform: uppercase; letter-spacing: 0.5px;">
                ${data.personalInfo.name}
            </h1>
            <div style="font-size: 11px; margin-bottom: 5px;">
                ${data.personalInfo.location} | ${data.personalInfo.phone} | ${data.personalInfo.email}
            </div>
            <div style="font-size: 11px; font-weight: bold; color: #000;">
                ${links}
            </div>
        </div>

        <!-- SUMMARY -->
        ${data.personalInfo.objective ? `
        <div>
            <h2 style="font-size: 12px; font-weight: 800; border-bottom: 1px solid #000; padding-bottom: 2px; margin: 0 0 8px 0; text-transform: uppercase;">
                ${isRTL ? "النبذة المهنية" : "PROFESSIONAL SUMMARY"}
            </h2>
            <p style="font-size: 11px; margin: 0; text-align: justify;">
                ${data.personalInfo.objective}
            </p>
        </div>
        ` : ''}

        <!-- EXPERIENCE -->
        <div>
            <h2 style="font-size: 12px; font-weight: 800; border-bottom: 1px solid #000; padding-bottom: 2px; margin: 0 0 10px 0; text-transform: uppercase;">
                 ${isRTL ? "الخبرات العملية" : "WORK EXPERIENCE"}
            </h2>
            <div style="display: flex; flex-direction: column; gap: 12px;">
                ${data.experience.map(exp => `
                    <div>
                        <div style="display: flex; justify-content: space-between; align-items: baseline; font-weight: 800; font-size: 12px;">
                            <span>${exp.role}</span>
                            <span>${exp.period}</span>
                        </div>
                        <div style="font-size: 12px; font-style: italic; margin-bottom: 4px;">${exp.company}</div>
                        <ul style="margin: 0; padding-${isRTL ? 'right' : 'left'}: 18px; font-size: 11px;">
                            ${exp.description.map(d => `<li style="margin-bottom: 2px;">${d}</li>`).join('')}
                        </ul>
                    </div>
                `).join('')}
            </div>
        </div>

        <!-- SKILLS -->
        <div>
            <h2 style="font-size: 12px; font-weight: 800; border-bottom: 1px solid #000; padding-bottom: 2px; margin: 0 0 8px 0; text-transform: uppercase;">
                 ${isRTL ? "المهارات التقنية" : "TECHNICAL SKILLS"}
            </h2>
            <div style="font-size: 11px;">
                ${data.skills.map(cat => `
                    <div style="margin-bottom: 4px;">
                        <span style="font-weight: 800;">${cat.category}:</span>
                        <span>${cat.skills.join(', ')}</span>
                    </div>
                `).join('')}
            </div>
        </div>

        <!-- PROJECTS (ALL) -->
        <div>
            <h2 style="font-size: 12px; font-weight: 800; border-bottom: 1px solid #000; padding-bottom: 2px; margin: 0 0 10px 0; text-transform: uppercase;">
                 ${isRTL ? "أبرز المشاريع" : "KEY PROJECTS"}
            </h2>
            <div style="display: flex; flex-direction: column; gap: 8px;">
                ${data.projects.map(proj => `
                    <div>
                        <div style="font-size: 12px;">
                             <span style="font-weight: 800;">${proj.title}</span> 
                             <span style="font-style: italic;">[${proj.techStack}]</span>
                        </div>
                        ${proj.description ? `<p style="font-size: 11px; margin: 2px 0 0 0;">${proj.description}</p>` : ''}
                    </div>
                `).join('')}
            </div>
        </div>

        <!-- EDUCATION -->
        <div>
             <h2 style="font-size: 12px; font-weight: 800; border-bottom: 1px solid #000; padding-bottom: 2px; margin: 0 0 10px 0; text-transform: uppercase;">
                 ${isRTL ? "التعليم" : "EDUCATION"}
            </h2>
            <div style="display: flex; flex-direction: column; gap: 8px;">
                ${data.education.map(edu => `
                     <div>
                        <div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: 800;">
                             <span>${edu.institution}</span>
                             <span>${edu.status}</span>
                        </div>
                        <div style="font-size: 11px;">${edu.degree}</div>
                    </div>
                `).join('')}
            </div>
        </div>

        <!-- CERTIFICATIONS -->
        <div>
             <h2 style="font-size: 12px; font-weight: 800; border-bottom: 1px solid #000; padding-bottom: 2px; margin: 0 0 5px 0; text-transform: uppercase;">
                 ${isRTL ? "الشهادات" : "CERTIFICATIONS"}
            </h2>
             <ul style="margin: 0; padding-${isRTL ? 'right' : 'left'}: 18px; font-size: 11px; list-style-type: disc;">
                ${data.certifications.map(cert => `
                    <li style="margin-bottom: 2px;">${cert.title}</li>
                `).join('')}
            </ul>
        </div>

    </div>
  `;
  
  container.innerHTML = content;
  document.body.appendChild(container);

  try {
      // Wait for rendering
      await new Promise(resolve => setTimeout(resolve, 300));

      const canvas = await html2canvas(container, {
          scale: 2, // High resolution
          useCORS: true,
          logging: false
      });

      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;

      // First page
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Additional pages if content overflows
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save(`Mohamed_Elrais_CV_${lang.toUpperCase()}.pdf`);

  } catch (error) {
      console.error("PDF Generation failed:", error);
      alert("Failed to generate PDF. Please try again.");
  } finally {
      document.body.removeChild(container);
  }
};
