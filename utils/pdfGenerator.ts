import { jsPDF } from "jspdf";
import { ResumeData } from "../types";

export const generateATSPdf = (data: ResumeData, lang: 'en' | 'ar' = 'en') => {
  // NOTE: Standard jsPDF does not support Arabic characters without a custom font.
  // We default to English data to ensure the PDF is readable and ATS compliant.
  // If you strictly need Arabic, you must load a Base64 font file that supports UTF-8.
  
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20; // Standard 1 inch approx margin
  const contentWidth = pageWidth - (margin * 2);
  let cursorY = 20;

  // --- Helpers ---
  
  const checkPageBreak = (spaceNeeded: number) => {
    if (cursorY + spaceNeeded > pageHeight - margin) {
      doc.addPage();
      cursorY = margin;
      return true;
    }
    return false;
  };

  const addHeading = (text: string) => {
    checkPageBreak(15);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor("#000000");
    doc.text(text.toUpperCase(), margin, cursorY);
    
    // Underline
    cursorY += 2;
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(margin, cursorY, pageWidth - margin, cursorY);
    cursorY += 6;
  };

  const addBullet = (text: string) => {
    doc.setFont("times", "normal");
    doc.setFontSize(10);
    doc.setTextColor("#000000");

    const bullet = "• ";
    const indent = 5;
    const textWidth = contentWidth - indent;
    
    const lines = doc.splitTextToSize(text, textWidth);
    
    checkPageBreak(lines.length * 5);

    doc.text(bullet, margin, cursorY);
    doc.text(lines, margin + indent, cursorY);
    
    cursorY += (lines.length * 5); 
  };

  // --- DOCUMENT CONTENT ---

  // 1. HEADER (Name & Contact)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.text(data.personalInfo.name.toUpperCase(), pageWidth / 2, cursorY, { align: "center" });
  cursorY += 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor("#444444");
  
  const contactParts = [
      data.personalInfo.location,
      data.personalInfo.phone,
      data.personalInfo.email
  ].filter(Boolean);
  
  doc.text(contactParts.join("  |  "), pageWidth / 2, cursorY, { align: "center" });
  cursorY += 6;

  // Links
  doc.setFontSize(10);
  doc.setTextColor("#0000EE");
  const linkParts = [
    data.personalInfo.linkedin ? "LinkedIn" : "",
    data.personalInfo.github ? "GitHub" : "",
    data.personalInfo.website ? "Portfolio" : ""
  ].filter(Boolean);
  
  // Note: We just print text for simplicity in printing, usually hyperlinks in PDFs can be tricky with positioning
  // but we can add real links if needed. For print/ATS, text is fine.
  doc.text(linkParts.join("  -  "), pageWidth / 2, cursorY, { align: "center" });
  
  cursorY += 10;

  // 2. SUMMARY
  if (data.personalInfo.objective) {
      addHeading("Professional Summary");
      doc.setFont("times", "normal");
      doc.setFontSize(10);
      doc.setTextColor("#000000");
      const summaryLines = doc.splitTextToSize(data.personalInfo.objective, contentWidth);
      doc.text(summaryLines, margin, cursorY);
      cursorY += (summaryLines.length * 5) + 5;
  }

  // 3. EXPERIENCE
  addHeading("Work Experience");
  data.experience.forEach((exp) => {
      checkPageBreak(25); // Minimum space for a role block
      
      // Role & Date
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text(exp.role, margin, cursorY);
      
      doc.setFont("helvetica", "bold");
      doc.text(exp.period, pageWidth - margin, cursorY, { align: "right" });
      cursorY += 5;
      
      // Company
      doc.setFont("helvetica", "italic");
      doc.setFontSize(10);
      doc.text(exp.company, margin, cursorY);
      cursorY += 6;
      
      // Description
      exp.description.forEach(desc => {
          addBullet(desc);
      });
      cursorY += 4; // Spacing between jobs
  });
  cursorY += 2;

  // 4. SKILLS
  addHeading("Technical Skills");
  data.skills.forEach(skill => {
      checkPageBreak(10);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      const catWidth = doc.getTextWidth(skill.category + ": ");
      doc.text(skill.category + ": ", margin, cursorY);
      
      doc.setFont("times", "normal");
      const skillsStr = skill.skills.join(", ");
      const skillsLines = doc.splitTextToSize(skillsStr, contentWidth - catWidth);
      doc.text(skillsLines, margin + catWidth, cursorY);
      cursorY += (skillsLines.length * 5);
  });
  cursorY += 8;

  // 5. PROJECTS
  addHeading("Key Projects");
  data.projects.slice(0, 4).forEach(proj => {
      checkPageBreak(20);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text(proj.title, margin, cursorY);
      
      // Tech Stack inline or below
      doc.setFont("helvetica", "italic");
      doc.setFontSize(9);
      doc.setTextColor("#555555");
      const techWidth = doc.getTextWidth(proj.title) + 5;
      if (techWidth + doc.getTextWidth(proj.techStack) < contentWidth) {
         doc.text(`[${proj.techStack}]`, margin + techWidth, cursorY);
      }
      cursorY += 5;
      
      // Description
      if (proj.description) {
          doc.setFont("times", "normal");
          doc.setFontSize(10);
          doc.setTextColor("#000000");
          const lines = doc.splitTextToSize(proj.description, contentWidth);
          doc.text(lines, margin, cursorY);
          cursorY += (lines.length * 5) + 3;
      } else {
          cursorY += 3;
      }
  });
  cursorY += 5;

  // 6. EDUCATION
  addHeading("Education");
  data.education.forEach(edu => {
      checkPageBreak(15);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text(edu.institution, margin, cursorY);
      
      doc.setFont("helvetica", "bold");
      doc.text(edu.status, pageWidth - margin, cursorY, { align: "right" });
      cursorY += 5;
      
      doc.setFont("times", "normal");
      doc.setFontSize(10);
      doc.text(edu.degree, margin, cursorY);
      cursorY += 8;
  });

  // 7. CERTIFICATIONS
  addHeading("Certifications");
  checkPageBreak(data.certifications.length * 5);
  data.certifications.forEach(cert => {
      doc.setFont("times", "normal");
      doc.setFontSize(10);
      doc.text(`• ${cert.title}`, margin, cursorY);
      cursorY += 5;
  });

  // Save
  doc.save(`Mohamed_Elrais_CV_${lang.toUpperCase()}.pdf`);
};