
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { ResumeData } from "../types";

export const generateATSPdf = async (data: ResumeData, lang: 'en' | 'ar' = 'en') => {
  const isRTL = lang === 'ar';
  
  // Create a temporary container for the PDF content
  // We use standard A4 proportions (approx 794px width at 96 DPI)
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.top = '-10000px';
  container.style.left = '-10000px';
  container.style.width = '794px'; // A4 Width in pixels (96 DPI)
  container.style.minHeight = '1123px'; // A4 Height
  container.style.backgroundColor = '#ffffff';
  container.style.color = '#000000';
  container.style.fontFamily = isRTL ? 'Cairo, sans-serif' : 'Inter, sans-serif';
  container.style.padding = '40px';
  container.style.boxSizing = 'border-box';
  container.dir = isRTL ? 'rtl' : 'ltr';
  
  // Construct the HTML content string
  // Using simple inline styles to ensure exact replication in canvas
  const content = `
    <div style="display: flex; flex-direction: column; gap: 24px;">
        <!-- Header -->
        <div style="text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 20px;">
            <h1 style="font-size: 32px; font-weight: 800; margin: 0 0 8px 0; color: #0f172a; text-transform: uppercase;">
                ${data.personalInfo.name}
            </h1>
            <p style="font-size: 16px; margin: 0; color: #475569; font-weight: 500;">
                ${data.personalInfo.role}
            </p>
            <div style="font-size: 12px; margin-top: 12px; color: #334155; display: flex; justify-content: center; gap: 16px; flex-wrap: wrap;">
                <span>${data.personalInfo.phone}</span> • 
                <span>${data.personalInfo.email}</span> • 
                <span>${data.personalInfo.location}</span>
            </div>
             <div style="font-size: 12px; margin-top: 8px; color: #2563eb;">
                ${[data.personalInfo.linkedin, data.personalInfo.github, data.personalInfo.website].filter(Boolean).join(' • ')}
            </div>
        </div>

        <!-- Summary -->
        ${data.personalInfo.objective ? `
        <div>
            <h2 style="font-size: 18px; font-weight: 700; color: #0f766e; margin: 0 0 10px 0; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">
                ${data.ui.sectionTitles.about.toUpperCase()}
            </h2>
            <p style="font-size: 12px; line-height: 1.6; margin: 0; color: #1e293b; text-align: justify;">
                ${data.personalInfo.objective}
            </p>
        </div>
        ` : ''}

        <!-- Experience -->
        <div>
            <h2 style="font-size: 18px; font-weight: 700; color: #0f766e; margin: 0 0 12px 0; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">
                 ${data.ui.sectionTitles.experience.toUpperCase()}
            </h2>
            <div style="display: flex; flex-direction: column; gap: 16px;">
                ${data.experience.map(exp => `
                    <div>
                        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px;">
                            <h3 style="font-size: 14px; font-weight: 700; margin: 0; color: #0f172a;">${exp.role}</h3>
                            <span style="font-size: 11px; font-weight: 600; color: #64748b; white-space: nowrap;">${exp.period}</span>
                        </div>
                        <div style="font-size: 12px; font-weight: 600; color: #0d9488; margin-bottom: 6px;">${exp.company}</div>
                        <ul style="margin: 0; padding-${isRTL ? 'right' : 'left'}: 16px; font-size: 11px; color: #334155; line-height: 1.5;">
                            ${exp.description.map(d => `<li style="margin-bottom: 2px;">${d}</li>`).join('')}
                        </ul>
                    </div>
                `).join('')}
            </div>
        </div>

        <!-- Skills -->
        <div>
            <h2 style="font-size: 18px; font-weight: 700; color: #0f766e; margin: 0 0 12px 0; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">
                 ${data.ui.sectionTitles.skills.toUpperCase()}
            </h2>
            <div style="display: flex; flex-wrap: wrap; gap: 12px;">
                ${data.skills.map(cat => `
                    <div style="flex: 1; min-width: 45%;">
                        <span style="font-size: 12px; font-weight: 700; color: #0f172a;">${cat.category}:</span>
                        <span style="font-size: 12px; color: #334155;">${cat.skills.join(', ')}</span>
                    </div>
                `).join('')}
            </div>
        </div>

        <!-- Projects (Limit 4) -->
        <div>
            <h2 style="font-size: 18px; font-weight: 700; color: #0f766e; margin: 0 0 12px 0; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">
                 ${data.ui.sectionTitles.projects.toUpperCase()}
            </h2>
            <div style="display: flex; flex-direction: column; gap: 12px;">
                ${data.projects.slice(0, 4).map(proj => `
                    <div>
                        <div style="display: flex; justify-content: space-between; align-items: baseline;">
                             <h3 style="font-size: 13px; font-weight: 700; margin: 0; color: #0f172a;">${proj.title}</h3>
                             <span style="font-size: 10px; color: #64748b;">${proj.techStack}</span>
                        </div>
                        ${proj.description ? `<p style="font-size: 11px; margin: 2px 0 0 0; color: #334155;">${proj.description}</p>` : ''}
                    </div>
                `).join('')}
            </div>
        </div>

        <!-- Education -->
        <div>
             <h2 style="font-size: 18px; font-weight: 700; color: #0f766e; margin: 0 0 12px 0; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">
                 ${isRTL ? 'التعليم والمؤهلات' : 'EDUCATION'}
            </h2>
            <div style="display: flex; flex-direction: column; gap: 10px;">
                ${data.education.map(edu => `
                     <div style="display: flex; justify-content: space-between;">
                        <div>
                             <div style="font-size: 13px; font-weight: 700; color: #0f172a;">${edu.institution}</div>
                             <div style="font-size: 12px; color: #334155;">${edu.degree}</div>
                        </div>
                        <div style="font-size: 11px; color: #64748b; font-weight: 600;">${edu.status}</div>
                    </div>
                `).join('')}
            </div>
        </div>

        <!-- Certifications (Condensed) -->
        <div>
             <h2 style="font-size: 18px; font-weight: 700; color: #0f766e; margin: 0 0 8px 0; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">
                 ${data.ui.sectionTitles.certifications.toUpperCase()}
            </h2>
             <div style="font-size: 11px; color: #334155; line-height: 1.6;">
                ${data.certifications.map(cert => `
                    <span style="display: inline-block; margin-${isRTL ? 'left' : 'right'}: 12px;">• ${cert.title}</span>
                `).join('')}
            </div>
        </div>
    </div>
  `;
  
  container.innerHTML = content;
  document.body.appendChild(container);

  try {
      // Wait for images to load if any (though currently text-heavy)
      await new Promise(resolve => setTimeout(resolve, 100));

      const canvas = await html2canvas(container, {
          scale: 2, // 2x scale for sharper text
          useCORS: true, // Allow fetching profile images if CORS headers allow
          logging: false
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      
      // A4 dimensions in mm
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Calculate aspect ratio to fit
      const imgProps = pdf.getImageProperties(imgData);
      const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, imgHeight);
      
      // If content is longer than one page (rare for this ATS layout but possible), handle multipage logic?
      // For this specific compact layout, it fits on one page. 
      // If it overflows, users generally prefer a concise 1-page resume anyway.
      
      pdf.save(`Mohamed_Elrais_Resume_${lang.toUpperCase()}.pdf`);

  } catch (error) {
      console.error("PDF Generation failed:", error);
      alert("Failed to generate PDF. Please try again.");
  } finally {
      document.body.removeChild(container);
  }
};
