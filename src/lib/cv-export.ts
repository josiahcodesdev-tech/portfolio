import type { CVData } from "./cv-parser";

function htmlToLines(html: string): string[] {
  if (!html) return [];
  if (!html.includes("<")) return html.split("\n").filter(Boolean);
  const div = document.createElement("div");
  div.innerHTML = html;
  const lines: string[] = [];
  const listItems = div.querySelectorAll("li");
  if (listItems.length > 0) {
    listItems.forEach((li) => {
      const text = li.textContent?.trim();
      if (text) lines.push(text);
    });
  } else {
    const text = div.textContent?.trim();
    if (text) lines.push(...text.split("\n").filter(Boolean));
  }
  return lines;
}

// CV Generation System Specification — aligned with Josiah's ATS standard
// Font: Palatino Linotype (Word) / Times (PDF)
// Name 22pt bold + tagline below | Contact stacked right
// Section headings 11pt bold uppercase, accent rule
// Body 10pt | Meta 8.5pt italic gray | Bullets real formatting

export async function exportToPdf(data: CVData): Promise<void> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  const mL = 20;
  const mR = 20;
  const mT = 22;
  const mB = 22;
  const pw = doc.internal.pageSize.getWidth();
  const ph = doc.internal.pageSize.getHeight();
  const cw = pw - mL - mR;
  let y = mT;

  const BODY = 10;
  const META = 8.5;
  const LH = 4.2;

  function checkPage(n: number) {
    if (y + n > ph - mB) { doc.addPage(); y = mT; }
  }

  // ── HEADER: name+tagline left, contact right ──
  const name = data.contactInfo.fullName || "Your Name";
  doc.setFont("times", "bold");
  doc.setFontSize(22);
  doc.setTextColor(26, 26, 46);
  doc.text(name, mL, y);

  // Contact stacked on the right
  const contact = [
    data.contactInfo.phone,
    data.contactInfo.email,
    data.contactInfo.linkedin,
    data.contactInfo.location,
  ].filter(Boolean);
  if (contact.length) {
    doc.setFont("times", "normal");
    doc.setFontSize(META);
    doc.setTextColor(85, 85, 85);
    let cy = mT;
    for (const line of contact) {
      doc.text(line, pw - mR, cy, { align: "right" });
      cy += 3.5;
    }
  }
  y += 8;

  // Tagline
  if (data.contactInfo.tagline) {
    doc.setFont("times", "italic");
    doc.setFontSize(BODY);
    doc.setTextColor(85, 85, 85);
    doc.text(data.contactInfo.tagline, mL, y);
    y += 5;
  }

  // Accent rule
  doc.setDrawColor(201, 151, 43);
  doc.setLineWidth(0.7);
  doc.line(mL, y, mL + cw, y);
  y += 6;

  // ── Helpers ──
  function heading(title: string) {
    checkPage(14);
    y += 3;
    doc.setFont("times", "bold");
    doc.setFontSize(11);
    doc.setTextColor(30, 90, 145);
    doc.text(title.toUpperCase(), mL, y);
    y += 1.8;
    doc.setDrawColor(30, 90, 145);
    doc.setLineWidth(0.4);
    doc.line(mL, y, mL + cw, y);
    y += 5;
  }

  function body(text: string, indent = 0) {
    doc.setFont("times", "normal");
    doc.setFontSize(BODY);
    doc.setTextColor(30, 30, 30);
    for (const line of doc.splitTextToSize(text, cw - indent)) {
      checkPage(LH + 1);
      doc.text(line, mL + indent, y);
      y += LH;
    }
  }

  function bullet(text: string) {
    doc.setFont("times", "normal");
    doc.setFontSize(BODY);
    doc.setTextColor(30, 30, 30);
    const indent = 5;
    const lines = doc.splitTextToSize(text, cw - indent);
    for (let i = 0; i < lines.length; i++) {
      checkPage(LH + 1);
      if (i === 0) { doc.setFontSize(5); doc.text("•", mL + 1.2, y - 0.2); doc.setFontSize(BODY); }
      doc.text(lines[i], mL + indent, y);
      y += LH;
    }
    y += 0.3;
  }

  function titleDate(title: string, date: string) {
    doc.setFont("times", "bold");
    doc.setFontSize(BODY);
    doc.setTextColor(26, 26, 46);
    checkPage(LH + 1);
    doc.text(title, mL, y);
    if (date) {
      doc.setFont("times", "italic");
      doc.setFontSize(META);
      doc.setTextColor(85, 85, 85);
      doc.text(date, mL + cw, y, { align: "right" });
    }
    doc.setTextColor(30, 30, 30);
    y += LH;
  }

  function meta(text: string) {
    doc.setFont("times", "italic");
    doc.setFontSize(META);
    doc.setTextColor(85, 85, 85);
    doc.text(text, mL, y);
    doc.setTextColor(30, 30, 30);
    y += LH;
  }

  // ═══ PROFESSIONAL SUMMARY ═══
  if (data.professionalSummary) {
    heading("Professional Summary");
    body(data.professionalSummary);
    y += 2;
  }

  // ═══ CORE SKILLS (categorized — fixed label column) ═══
  if (data.skillCategories.length) {
    heading("Core Skills");
    const labelCol = 45; // fixed label column width ~30% of content
    const itemsCol = cw - labelCol;
    for (const cat of data.skillCategories) {
      if (!cat.items && !cat.category) continue;
      checkPage(LH * 2 + 2);
      // Bold category label
      doc.setFont("times", "bold");
      doc.setFontSize(BODY);
      doc.setTextColor(26, 26, 46);
      doc.text(cat.category, mL, y);
      // Items flowing to the right
      if (cat.items) {
        doc.setFont("times", "normal");
        doc.setTextColor(50, 50, 50);
        const itemLines = doc.splitTextToSize(cat.items, itemsCol);
        for (let i = 0; i < itemLines.length; i++) {
          if (i > 0) { checkPage(LH + 1); }
          doc.text(itemLines[i], mL + labelCol, y);
          y += LH;
        }
      } else {
        y += LH;
      }
      y += 1.5;
    }
    y += 2;
  }

  // ═══ PROFESSIONAL EXPERIENCE ═══
  if (data.workExperience.length) {
    heading("Professional Experience");
    for (let i = 0; i < data.workExperience.length; i++) {
      const exp = data.workExperience[i];
      checkPage(18);
      const dates = [exp.startDate, exp.endDate].filter(Boolean).join(" – ");
      titleDate(exp.jobTitle, dates);
      const companyLine = [exp.company, exp.location].filter(Boolean).join(" — ");
      if (companyLine) meta(companyLine);
      y += 0.5;
      for (const b of htmlToLines(exp.responsibilities)) { bullet(b); }
      if (i < data.workExperience.length - 1) y += 2.5;
    }
    y += 2;
  }

  // ═══ PROJECTS ═══
  if (data.projects.length) {
    heading("Projects");
    for (let i = 0; i < data.projects.length; i++) {
      const proj = data.projects[i];
      checkPage(14);
      titleDate(proj.name, "");
      if (proj.context || proj.tools) {
        meta([proj.context, proj.tools].filter(Boolean).join(" — "));
      }
      y += 0.5;
      for (const d of htmlToLines(proj.details)) { bullet(d); }
      if (i < data.projects.length - 1) y += 2;
    }
    y += 2;
  }

  // ═══ EDUCATION ═══
  if (data.education.length) {
    heading("Education");
    for (let i = 0; i < data.education.length; i++) {
      const edu = data.education[i];
      checkPage(14);
      titleDate(edu.degree, edu.graduationDate);
      const inst = [edu.institution, edu.location].filter(Boolean).join(" — ");
      if (inst) meta(inst);
      if (edu.details) {
        for (const d of htmlToLines(edu.details)) { body(d, 5); }
      }
      if (i < data.education.length - 1) y += 2;
    }
    y += 2;
  }

  // ═══ CERTIFICATIONS ═══
  if (data.certifications.length) {
    heading("Certifications");
    for (const cert of data.certifications) {
      checkPage(LH + 1);
      doc.setFont("times", "bold");
      doc.setFontSize(BODY);
      doc.setTextColor(26, 26, 46);
      const certText = cert.issuer ? `${cert.name} — ${cert.issuer}` : cert.name;
      doc.text(certText, mL, y);
      y += LH + 0.5;
    }
    y += 2;
  }

  // ═══ LANGUAGES ═══
  if (data.languages) {
    heading("Languages");
    body(data.languages);
    y += 2;
  }

  // ═══ REFERENCES ═══
  if (data.references.length) {
    heading("References");
    for (const ref of data.references) {
      checkPage(LH * 4);
      doc.setFont("times", "bold");
      doc.setFontSize(BODY);
      doc.setTextColor(26, 26, 46);
      doc.text(ref.name, mL, y);
      y += LH;
      const roleLine = [ref.title, ref.organization].filter(Boolean).join(", ");
      if (roleLine) { meta(roleLine); }
      const contactLine = [ref.email, ref.phone].filter(Boolean).join("  |  ");
      if (contactLine) { meta(contactLine); }
      y += 1.5;
    }
  }

  // Save
  const parts = (data.contactInfo.fullName || "CV").split(/\s+/);
  const fileBase = parts.join("_");
  doc.save(`${fileBase}_ATS_Optimized_CV.pdf`);
}

// ═══════════════════════════════════════════════════
//  WORD (.docx) EXPORT
// ═══════════════════════════════════════════════════

export async function exportToDocx(data: CVData): Promise<void> {
  const {
    Document, Paragraph, TextRun, HeadingLevel, AlignmentType,
    Packer, BorderStyle, TabStopType, TabStopPosition, convertMillimetersToTwip,
  } = await import("docx");
  const { saveAs } = await import("file-saver");

  const FONT = "Palatino Linotype";
  const NAME = 44;
  const HEAD = 22;
  const BODY = 20;
  const META = 17;
  const ACCENT = "1E5A91";
  const NAVY = "1A1A2E";
  const GRAY = "555555";

  const children: InstanceType<typeof Paragraph>[] = [];

  // ── Header: Name + tagline left, contact right ──
  // Name
  children.push(new Paragraph({
    spacing: { after: 40 },
    children: [
      new TextRun({ text: data.contactInfo.fullName || "Your Name", bold: true, size: NAME, font: FONT, color: NAVY }),
    ],
  }));

  // Tagline
  if (data.contactInfo.tagline) {
    children.push(new Paragraph({
      spacing: { after: 60 },
      children: [
        new TextRun({ text: data.contactInfo.tagline, italics: true, size: BODY, font: FONT, color: GRAY }),
      ],
    }));
  }

  // Contact line
  const contactParts = [
    data.contactInfo.phone, data.contactInfo.email,
    data.contactInfo.linkedin, data.contactInfo.location,
  ].filter(Boolean);
  if (contactParts.length) {
    children.push(new Paragraph({
      spacing: { after: 100 },
      children: [new TextRun({ text: contactParts.join("   |   "), size: META, font: FONT, color: GRAY })],
    }));
  }

  // Accent rule
  children.push(new Paragraph({
    spacing: { after: 160 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 3, color: ACCENT } },
  }));

  // ── Helpers ──
  function addHeading(title: string) {
    children.push(new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 200, after: 80 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: ACCENT } },
      children: [new TextRun({ text: title.toUpperCase(), bold: true, size: HEAD, font: FONT, color: ACCENT })],
    }));
  }

  function addBody(text: string) {
    children.push(new Paragraph({
      spacing: { after: 80, line: 276 },
      children: [new TextRun({ text, size: BODY, font: FONT })],
    }));
  }

  function addBullet(text: string) {
    children.push(new Paragraph({
      bullet: { level: 0 },
      spacing: { before: 20, after: 20, line: 276 },
      children: [new TextRun({ text, size: BODY, font: FONT })],
    }));
  }

  function addTitleDate(title: string, date: string) {
    const runs: InstanceType<typeof TextRun>[] = [
      new TextRun({ text: title, bold: true, size: BODY, font: FONT, color: NAVY }),
    ];
    if (date) {
      runs.push(new TextRun({ text: "\t" + date, italics: true, size: META, font: FONT, color: GRAY }));
    }
    children.push(new Paragraph({
      spacing: { before: 120, after: 20 },
      tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
      children: runs,
    }));
  }

  function addMeta(text: string) {
    children.push(new Paragraph({
      spacing: { after: 40 },
      children: [new TextRun({ text, italics: true, size: META, font: FONT, color: GRAY })],
    }));
  }

  // ═══ PROFESSIONAL SUMMARY ═══
  if (data.professionalSummary) {
    addHeading("Professional Summary");
    addBody(data.professionalSummary);
  }

  // ═══ CORE SKILLS (categorized — label + items with tab stop) ═══
  if (data.skillCategories.length) {
    addHeading("Core Skills");
    for (const cat of data.skillCategories) {
      if (!cat.items && !cat.category) continue;
      children.push(new Paragraph({
        spacing: { after: 80, line: 276 },
        tabStops: [{ type: TabStopType.LEFT, position: convertMillimetersToTwip(45) }],
        children: [
          new TextRun({ text: cat.category, bold: true, size: BODY, font: FONT, color: NAVY }),
          new TextRun({ text: cat.items ? "\t" + cat.items : "", size: BODY, font: FONT }),
        ],
      }));
    }
  }

  // ═══ PROFESSIONAL EXPERIENCE ═══
  if (data.workExperience.length) {
    addHeading("Professional Experience");
    for (const exp of data.workExperience) {
      const dates = [exp.startDate, exp.endDate].filter(Boolean).join(" – ");
      addTitleDate(exp.jobTitle, dates);
      const companyLine = [exp.company, exp.location].filter(Boolean).join(" — ");
      if (companyLine) addMeta(companyLine);
      for (const b of htmlToLines(exp.responsibilities)) { addBullet(b); }
    }
  }

  // ═══ PROJECTS ═══
  if (data.projects.length) {
    addHeading("Projects");
    for (const proj of data.projects) {
      addTitleDate(proj.name, "");
      if (proj.context || proj.tools) {
        addMeta([proj.context, proj.tools].filter(Boolean).join(" — "));
      }
      for (const d of htmlToLines(proj.details)) { addBullet(d); }
    }
  }

  // ═══ EDUCATION ═══
  if (data.education.length) {
    addHeading("Education");
    for (const edu of data.education) {
      addTitleDate(edu.degree, edu.graduationDate);
      const inst = [edu.institution, edu.location].filter(Boolean).join(" — ");
      if (inst) addMeta(inst);
      if (edu.details) {
        for (const d of htmlToLines(edu.details)) { addBody(d); }
      }
    }
  }

  // ═══ CERTIFICATIONS ═══
  if (data.certifications.length) {
    addHeading("Certifications");
    for (const cert of data.certifications) {
      children.push(new Paragraph({
        spacing: { after: 60 },
        children: [
          new TextRun({ text: cert.name, bold: true, size: BODY, font: FONT }),
          ...(cert.issuer ? [new TextRun({ text: " — " + cert.issuer, size: BODY, font: FONT, color: GRAY })] : []),
        ],
      }));
    }
  }

  // ═══ LANGUAGES ═══
  if (data.languages) {
    addHeading("Languages");
    addBody(data.languages);
  }

  // ═══ REFERENCES ═══
  if (data.references.length) {
    addHeading("References");
    for (const ref of data.references) {
      children.push(new Paragraph({
        spacing: { after: 20 },
        children: [new TextRun({ text: ref.name, bold: true, size: BODY, font: FONT, color: NAVY })],
      }));
      const roleLine = [ref.title, ref.organization].filter(Boolean).join(", ");
      if (roleLine) addMeta(roleLine);
      const contactLine = [ref.email, ref.phone].filter(Boolean).join("  |  ");
      if (contactLine) addMeta(contactLine);
    }
  }

  // Build and save
  const docFile = new Document({
    styles: {
      default: {
        document: {
          run: { font: FONT, size: BODY },
          paragraph: { spacing: { line: 276 } },
        },
      },
    },
    sections: [{
      properties: {
        page: {
          margin: {
            top: convertMillimetersToTwip(25),
            bottom: convertMillimetersToTwip(25),
            left: convertMillimetersToTwip(20),
            right: convertMillimetersToTwip(20),
          },
        },
      },
      children,
    }],
  });

  const blob = await Packer.toBlob(docFile);
  const parts = (data.contactInfo.fullName || "CV").split(/\s+/);
  saveAs(blob, `${parts.join("_")}_ATS_Optimized_CV.docx`);
}
