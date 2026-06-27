interface ContactInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
}

function htmlToBlocks(html: string): { type: "p" | "li"; text: string }[] {
  if (!html) return [];
  const div = document.createElement("div");
  div.innerHTML = html;
  const blocks: { type: "p" | "li"; text: string }[] = [];

  function walk(node: Node) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      const tag = el.tagName.toLowerCase();

      if (tag === "li") {
        const text = el.textContent?.trim();
        if (text) blocks.push({ type: "li", text });
        return;
      }
      if (tag === "p" || tag === "div") {
        const text = el.textContent?.trim();
        if (text) blocks.push({ type: "p", text });
        return;
      }
      if (tag === "ul" || tag === "ol") {
        for (const child of Array.from(node.childNodes)) walk(child);
        return;
      }
      if (tag === "br") return;
    }
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.trim();
      if (text) blocks.push({ type: "p", text });
    }
    for (const child of Array.from(node.childNodes)) walk(child);
  }

  walk(div);
  return blocks;
}

export async function exportCoverLetterToPdf(
  html: string,
  contact: ContactInfo,
): Promise<void> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  const mL = 25;
  const mR = 25;
  const mT = 25;
  const mB = 25;
  const pw = doc.internal.pageSize.getWidth();
  const ph = doc.internal.pageSize.getHeight();
  const cw = pw - mL - mR;
  let y = mT;

  const BODY = 11;
  const LH = 5;

  function checkPage(n: number) {
    if (y + n > ph - mB) {
      doc.addPage();
      y = mT;
    }
  }

  function addText(text: string, bold = false, italic = false) {
    const style = bold && italic ? "bolditalic" : bold ? "bold" : italic ? "italic" : "normal";
    doc.setFont("times", style);
    doc.setFontSize(BODY);
    doc.setTextColor(30, 30, 30);
    const lines = doc.splitTextToSize(text, cw);
    for (const line of lines) {
      checkPage(LH + 1);
      doc.text(line, mL, y);
      y += LH;
    }
  }

  function addBullet(text: string) {
    doc.setFont("times", "normal");
    doc.setFontSize(BODY);
    doc.setTextColor(30, 30, 30);
    const indent = 6;
    const lines = doc.splitTextToSize(text, cw - indent);
    for (let i = 0; i < lines.length; i++) {
      checkPage(LH + 1);
      if (i === 0) {
        doc.setFontSize(6);
        doc.text("•", mL + 1.5, y - 0.3);
        doc.setFontSize(BODY);
      }
      doc.text(lines[i], mL + indent, y);
      y += LH;
    }
  }

  // Header accent line
  doc.setDrawColor(30, 90, 145);
  doc.setLineWidth(0.7);
  doc.line(mL, y - 2, mL + cw, y - 2);
  y += 4;

  // Render blocks
  const blocks = htmlToBlocks(html);
  for (const block of blocks) {
    if (block.type === "li") {
      addBullet(block.text);
    } else {
      // Detect bold segments (simplified: treat whole block)
      const isBold = /<b>/.test(html) && block.text.includes("RE:");
      addText(block.text, isBold);
      y += 2;
    }
  }

  const safeName = contact.fullName.replace(/[^a-zA-Z0-9\s]/g, "").replace(/\s+/g, "_");
  doc.save(`${safeName}_Cover_Letter.pdf`);
}

export async function exportCoverLetterToDocx(
  html: string,
  contact: ContactInfo,
): Promise<void> {
  const {
    Document,
    Paragraph,
    TextRun,
    AlignmentType,
    Packer,
    BorderStyle,
    convertMillimetersToTwip,
  } = await import("docx");
  const { saveAs } = await import("file-saver");

  const FONT = "Palatino Linotype";
  const BODY = 22;
  const NAVY = "1A1A2E";
  const ACCENT = "1E5A91";

  const children: InstanceType<typeof Paragraph>[] = [];

  // Accent rule
  children.push(
    new Paragraph({
      spacing: { after: 200 },
      border: {
        bottom: { style: BorderStyle.SINGLE, size: 3, color: ACCENT },
      },
    }),
  );

  const blocks = htmlToBlocks(html);

  for (const block of blocks) {
    if (block.type === "li") {
      children.push(
        new Paragraph({
          bullet: { level: 0 },
          spacing: { before: 20, after: 20, line: 300 },
          children: [
            new TextRun({ text: block.text, size: BODY, font: FONT }),
          ],
        }),
      );
    } else {
      // Check for bold content
      const isBold = block.text.startsWith("RE:");
      children.push(
        new Paragraph({
          spacing: { after: 120, line: 300 },
          children: [
            new TextRun({
              text: block.text,
              size: BODY,
              font: FONT,
              bold: isBold,
              color: isBold ? NAVY : undefined,
            }),
          ],
        }),
      );
    }
  }

  const docFile = new Document({
    styles: {
      default: {
        document: {
          run: { font: FONT, size: BODY },
          paragraph: { spacing: { line: 300 } },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertMillimetersToTwip(25),
              bottom: convertMillimetersToTwip(25),
              left: convertMillimetersToTwip(25),
              right: convertMillimetersToTwip(25),
            },
          },
        },
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(docFile);
  const safeName = contact.fullName.replace(/[^a-zA-Z0-9\s]/g, "").replace(/\s+/g, "_");
  saveAs(blob, `${safeName}_Cover_Letter.docx`);
}
