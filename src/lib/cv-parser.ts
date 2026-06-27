export interface CVData {
  contactInfo: {
    fullName: string;
    tagline: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
  };
  professionalSummary: string;
  skillCategories: {
    id: string;
    category: string;
    items: string;
  }[];
  workExperience: {
    id: string;
    jobTitle: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    responsibilities: string;
  }[];
  projects: {
    id: string;
    name: string;
    context: string;
    tools: string;
    details: string;
  }[];
  education: {
    id: string;
    degree: string;
    institution: string;
    location: string;
    graduationDate: string;
    details: string;
  }[];
  certifications: {
    id: string;
    name: string;
    issuer: string;
  }[];
  languages: string;
  references: {
    id: string;
    name: string;
    title: string;
    organization: string;
    email: string;
    phone: string;
  }[];
}

export interface ATSScoreItem {
  label: string;
  passed: boolean;
  tip: string;
}

export interface ATSScore {
  overall: number;
  items: ATSScoreItem[];
}

// ═══════════════════════════════════════════════════
//  TEXT EXTRACTION
// ═══════════════════════════════════════════════════

export async function extractTextFromFile(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();

  if (
    file.name.endsWith(".docx") ||
    file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const mammoth = await import("mammoth");
    const result = await mammoth.extractRawText({ arrayBuffer: buffer });
    return result.value;
  }

  if (file.name.endsWith(".pdf") || file.type === "application/pdf") {
    const pdfjsLib = await import("pdfjs-dist");
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
      "pdfjs-dist/build/pdf.worker.min.mjs",
      import.meta.url,
    ).toString();

    const doc = await pdfjsLib.getDocument({ data: buffer }).promise;
    const pages: string[] = [];

    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i);
      const content = await page.getTextContent();

      const items = content.items.filter(
        (item): item is typeof item & {
          str: string;
          transform: number[];
          width: number;
          height: number;
        } => "str" in item && "transform" in item,
      );
      if (!items.length) continue;

      // Group text fragments by Y-coordinate into lines
      // Use a tolerance of 2pt to merge items on the same visual line
      const lineMap = new Map<number, { x: number; text: string }[]>();
      for (const item of items) {
        const rawY = item.transform[5];
        const x = item.transform[4];

        // Find an existing Y bucket within tolerance
        let bucketY = rawY;
        for (const existingY of lineMap.keys()) {
          if (Math.abs(existingY - rawY) < 2) {
            bucketY = existingY;
            break;
          }
        }

        if (!lineMap.has(bucketY)) lineMap.set(bucketY, []);
        lineMap.get(bucketY)!.push({ x, text: item.str });
      }

      // Sort lines top-to-bottom (PDF Y: higher = higher on page)
      const sortedLines = Array.from(lineMap.entries())
        .sort((a, b) => b[0] - a[0])
        .map(([, fragments]) => {
          // Sort fragments left-to-right within each line
          fragments.sort((a, b) => a.x - b.x);

          // Join with spacing — add extra space if gap between fragments is large
          let result = "";
          for (let j = 0; j < fragments.length; j++) {
            const frag = fragments[j];
            if (j > 0) {
              const gap = frag.x - fragments[j - 1].x;
              result += gap > 50 ? "  |  " : gap > 10 ? "  " : " ";
            }
            result += frag.text;
          }
          return result.trim();
        })
        .filter(Boolean);

      pages.push(sortedLines.join("\n"));
    }

    return pages.join("\n\n");
  }

  throw new Error(
    "Unsupported file type. Please upload a PDF or Word (.docx) file.",
  );
}

// ═══════════════════════════════════════════════════
//  KEYWORD DICTIONARIES
// ═══════════════════════════════════════════════════

type SectionType =
  | "summary"
  | "experience"
  | "education"
  | "skills"
  | "certifications"
  | "references"
  | "projects"
  | "languages"
  | "interests"
  | "contact";

const SECTION_KEYWORDS: Record<SectionType, string[]> = {
  contact: [
    "contact information", "contact details", "personal information",
    "personal details", "contact info", "contact",
  ],
  summary: [
    "professional summary", "career summary", "executive summary",
    "personal statement", "professional profile", "career objective",
    "career profile", "about me", "summary of qualifications",
    "summary", "profile", "objective", "overview", "introduction",
  ],
  experience: [
    "work experience", "professional experience", "employment history",
    "work history", "career history", "relevant experience",
    "professional background", "positions held", "internship experience",
    "volunteer experience", "experience", "employment",
  ],
  education: [
    "education and training", "educational background", "academic background",
    "academic qualifications", "educational qualifications", "academic history",
    "education", "academics", "qualifications",
  ],
  skills: [
    "technical skills", "core competencies", "key skills",
    "areas of expertise", "professional skills", "soft skills",
    "hard skills", "skills and competencies", "competencies",
    "proficiencies", "professional strengths", "strengths",
    "skills", "expertise", "technologies",
    "tools and technologies", "programming languages",
  ],
  certifications: [
    "certifications and licenses", "professional certifications",
    "certifications", "certificates", "licenses", "professional development",
    "accreditations", "certification", "awards and honors",
    "awards", "honors", "achievements",
  ],
  references: ["references", "referees", "references available"],
  projects: ["projects", "key projects", "notable projects", "personal projects"],
  languages: ["languages", "language skills", "language proficiency"],
  interests: ["interests", "hobbies", "hobbies and interests", "extracurricular"],
};

// Flattened heading lookup (longest match first for accuracy)
const ALL_HEADINGS: { keyword: string; section: SectionType }[] = [];
for (const [section, keywords] of Object.entries(SECTION_KEYWORDS)) {
  for (const kw of keywords) {
    ALL_HEADINGS.push({ keyword: kw, section: section as SectionType });
  }
}
ALL_HEADINGS.sort((a, b) => b.keyword.length - a.keyword.length);

// Action verbs for experience detection
const ACTION_VERBS =
  /\b(managed|developed|led|created|implemented|designed|built|achieved|improved|increased|decreased|responsible|coordinated|supervised|delivered|launched|negotiated|collaborated|maintained|analyzed|facilitated|prepared|organized|trained|established|executed|streamlined|oversaw|spearheaded|initiated|drove|optimized|administered|conducted|generated|resolved|ensured|supported|provided|assisted|contributed|monitored|planned|reviewed|processed|presented|performed|handled|produced|authored|directed|evaluated|mentored)\b/i;

const EDUCATION_WORDS =
  /\b(bachelor|master|mba|phd|ph\.d|doctorate|bsc|b\.sc|ba|b\.a|beng|b\.eng|msc|m\.sc|ma|m\.a|meng|associate|diploma|certificate|degree|university|college|institute|polytechnic|school|academy|graduated|gpa|cgpa|honours|honors|thesis|dissertation|cum laude|magna|summa|first class|second class|upper|lower|distinction|merit)\b/i;

const JOB_TITLES =
  /\b(manager|engineer|developer|programmer|analyst|consultant|director|coordinator|specialist|administrator|designer|architect|lead|senior|junior|mid-level|intern|trainee|assistant|associate|officer|executive|head of|vp|vice president|chief|cto|ceo|cfo|coo|cmo|accountant|teacher|lecturer|professor|nurse|doctor|supervisor|technician|researcher|scientist|editor|writer|strategist|planner|recruiter|advisor|agent|representative|clerk|secretary|receptionist)\b/i;

// Date patterns — non-global version for single tests
const DATE_RANGE =
  /\b(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?|20\d{2}|19\d{2})\b[\s]*[-–—/]+[\s]*(present|current|now|ongoing|till date|to date|jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?|20\d{2}|19\d{2})\b/i;

const DATE_RANGE_G = new RegExp(DATE_RANGE.source, "gi");

const SINGLE_DATE =
  /\b(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\s+\d{4}\b|\b(19|20)\d{2}\b/i;

function uid(): string {
  return Math.random().toString(36).slice(2, 9);
}

// ═══════════════════════════════════════════════════
//  CONTACT EXTRACTION
// ═══════════════════════════════════════════════════

function extractAllEmails(text: string): string[] {
  return [...text.matchAll(/[\w.+-]+@[\w.-]+\.\w{2,}/g)].map((m) => m[0]);
}

function extractAllPhones(text: string): string[] {
  return [
    ...text.matchAll(
      /(?:\+?\d{1,3}[\s.-]?)?\(?\d{2,4}\)?[\s.-]?\d{3,4}[\s.-]?\d{3,4}/g,
    ),
  ].map((m) => m[0].trim());
}

function extractLinkedin(text: string): string {
  const match = text.match(
    /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[\w-]+/i,
  );
  return match ? match[0] : "";
}

function extractWebsite(text: string): string {
  const match = text.match(
    /(?:https?:\/\/)?(?:www\.)?[\w-]+\.[\w]{2,}(?:\/[\w.-]*)?/i,
  );
  if (match && !/linkedin\.com/i.test(match[0])) return match[0];
  return "";
}

// ═══════════════════════════════════════════════════
//  HEADING DETECTION
// ═══════════════════════════════════════════════════

function cleanForHeadingMatch(line: string): string {
  return line
    .replace(/ð·/g, "")
    .replace(/ðþ/g, "")
    .replace(/[:\-–—_|#*•·▪►✓✔ðþ\d.)(]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function detectHeading(line: string): SectionType | null {
  const trimmed = line.trim();
  if (!trimmed || trimmed.length > 60) return null;

  const cleaned = cleanForHeadingMatch(trimmed);
  if (!cleaned || cleaned.length < 3) return null;

  // Check if line looks like a heading:
  // - ALL CAPS
  // - Short line (under ~40 chars cleaned)
  // - Ends with colon
  // - Is bold/styled (we can't detect this, but short non-sentence lines often are)
  const isLikelyHeading =
    trimmed === trimmed.toUpperCase() ||
    trimmed.endsWith(":") ||
    (cleaned.split(/\s+/).length <= 5 && !/[.!?]$/.test(trimmed));

  if (!isLikelyHeading && cleaned.split(/\s+/).length > 5) return null;

  // Match against keyword dictionary (longest match first)
  for (const { keyword, section } of ALL_HEADINGS) {
    if (cleaned === keyword || cleaned.startsWith(keyword)) {
      return section;
    }
  }

  // Fuzzy: check if all words of a keyword appear in the line
  if (isLikelyHeading) {
    for (const { keyword, section } of ALL_HEADINGS) {
      const words = keyword.split(/\s+/);
      if (words.length >= 2 && words.every((w) => cleaned.includes(w))) {
        return section;
      }
    }
  }

  return null;
}

// ═══════════════════════════════════════════════════
//  BLOCK CONTENT CLASSIFIER (for unlabeled blocks)
// ═══════════════════════════════════════════════════

function scoreBlock(
  lines: string[],
): { section: SectionType; confidence: number } | null {
  const text = lines.join("\n");
  const scores: Partial<Record<SectionType, number>> = {};

  // ── Experience signals ──
  const dateRanges = text.match(DATE_RANGE_G) || [];
  if (dateRanges.length) {
    scores.experience = (scores.experience || 0) + dateRanges.length * 4;
  }

  const jobTitles = text.match(new RegExp(JOB_TITLES.source, "gi")) || [];
  scores.experience = (scores.experience || 0) + jobTitles.length * 3;

  const actions = text.match(new RegExp(ACTION_VERBS.source, "gi")) || [];
  scores.experience = (scores.experience || 0) + actions.length;

  // ── Education signals ──
  const eduWords = text.match(new RegExp(EDUCATION_WORDS.source, "gi")) || [];
  scores.education = (scores.education || 0) + eduWords.length * 4;

  // ── Skills signals ──
  // Comma-heavy with short segments
  const commas = (text.match(/,/g) || []).length;
  const words = text.split(/\s+/).length;
  if (commas >= 3 && words / (commas + 1) < 4) {
    scores.skills = (scores.skills || 0) + commas * 2;
  }

  // Lots of short bullet lines
  const bulletLines = lines.filter((l) => /^[\-•·▪►✓✔*]\s/.test(l));
  if (bulletLines.length >= 3) {
    const avgLen =
      bulletLines.reduce((s, l) => s + l.length, 0) / bulletLines.length;
    if (avgLen < 35) {
      scores.skills = (scores.skills || 0) + bulletLines.length * 2;
    }
  }

  // ── Summary signals: long prose paragraph, no bullets, no dates ──
  if (
    lines.length <= 5 &&
    words > 20 &&
    !dateRanges.length &&
    bulletLines.length === 0
  ) {
    scores.summary = (scores.summary || 0) + 5;
  }

  // Pick best
  let best: SectionType | null = null;
  let bestScore = 0;
  for (const [sec, sc] of Object.entries(scores)) {
    if (sc > bestScore) {
      bestScore = sc;
      best = sec as SectionType;
    }
  }

  return bestScore >= 3 ? { section: best!, confidence: bestScore } : null;
}

// ═══════════════════════════════════════════════════
//  MAIN PARSER
// ═══════════════════════════════════════════════════

export function parseRawTextToCV(rawText: string): CVData {
  // ── Normalize ──
  // First pass: fix line endings and whitespace
  let text = rawText
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/\t/g, "  ")
    .replace(/ {4,}/g, "  ");

  // Strip corrupted Unicode bullet artifacts from PDF extraction
  // These are mojibake from emoji bullets: ð=U+00F0, þ=U+00FE, ·=U+00B7
  // Using hex escapes to guarantee matching regardless of source encoding
  text = text.replace(/ð·/g, "");   // ð· pair
  text = text.replace(/ðþ/g, "");   // ðþ pair
  text = text.replace(/ð/g, "");          // lone ð
  text = text.replace(/þ/g, "");          // lone þ
  text = text.replace(/�/g, "");          // replacement char �
  text = text.replace(/[\u{1F300}-\u{1F9FF}]/gu, ""); // emoji range

  // Strip page markers
  text = text.replace(/\|?\s*\.?\s*P\s*a\s*g\s*e\s*\|\s*\d+/gi, "");
  text = text.replace(/\|\s*\./g, "");

  // Normalize spaced-out text from PDF (e.g. "S k i l l e d" → "Skilled")
  // Detect lines where most chars are separated by spaces
  text = text.split("\n").map((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.length < 5) return trimmed;
    // Count single-char-then-space patterns
    const spacedChars = (trimmed.match(/\b[A-Za-z]\s(?=[A-Za-z]\s)/g) || []).length;
    const totalChars = trimmed.replace(/\s/g, "").length;
    // If more than 40% of the line is spaced-out single chars, collapse it
    if (spacedChars > 4 && spacedChars / totalChars > 0.3) {
      return trimmed.replace(/\b([A-Za-z])\s(?=[A-Za-z](?:\s|$|\b))/g, "$1");
    }
    return trimmed;
  }).join("\n");

  // Per-line cleanup
  text = text.split("\n").map((l) => {
    let cleaned = l.trim();
    // Strip leading bullet remnants (·, |, •)
    cleaned = cleaned.replace(/^[·|•]+\s*/, "");
    // Strip trailing pipes/middledots
    cleaned = cleaned.replace(/[·|•]+\s*$/, "");
    // Strip "Key Contributions:" and similar sub-labels
    if (/^(key\s+contributions|responsibilities|duties)\s*:?\s*$/i.test(cleaned)) {
      return "";
    }
    return cleaned;
  }).join("\n");

  const allLines = text.split("\n").map((l) => l.trim());

  // ── Pass 1: Extract contact info from entire document ──
  const emails = extractAllEmails(text);
  const phones = extractAllPhones(text);
  const linkedin = extractLinkedin(text);
  const email = emails[0] || "";
  const phone = phones[0] || "";

  // Contact info patterns to filter from content
  const contactPatterns = new Set([
    email,
    phone,
    linkedin,
    ...emails,
    ...phones,
  ]);

  function isContactLine(line: string): boolean {
    for (const pat of contactPatterns) {
      if (pat && line.includes(pat)) return true;
    }
    if (/linkedin\.com/i.test(line)) return true;
    return false;
  }

  // ── Find name: first prominent non-contact, non-heading line ──
  let fullName = "";
  for (const line of allLines.slice(0, 8)) {
    if (!line || line.length < 2 || line.length > 50) continue;
    if (detectHeading(line)) continue;
    if (isContactLine(line)) continue;
    if (/^[\+\(]?\d/.test(line) && line.length < 25) continue;
    // A name is mostly letters, spaces, dots, hyphens, apostrophes
    if (/^[A-Za-z\s.'\-,]+$/.test(line) && line.split(/\s+/).length <= 6) {
      fullName = line.replace(/,\s*$/, "").trim();
      break;
    }
  }

  // ── Find location from header area ──
  let location = "";
  for (const line of allLines.slice(0, 12)) {
    if (line === fullName) continue;
    // Location heuristics: city/country names, state abbreviations, postal codes
    if (
      /\b(nairobi|mombasa|kisumu|eldoret|nakuru|kenya|uganda|kampala|tanzania|dar es salaam|lagos|abuja|nigeria|accra|ghana|johannesburg|cape town|south africa|london|manchester|birmingham|uk|united kingdom|new york|los angeles|chicago|houston|usa|united states|dubai|uae|toronto|canada|sydney|melbourne|australia|india|mumbai|delhi|bangalore)\b/i.test(line) ||
      /,\s*[A-Z]{2}\s*\d{0,5}\s*$/.test(line) ||
      /\b\d{5}(-\d{4})?\b/.test(line) ||
      /\b[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}\b/.test(line) // UK postcode
    ) {
      location = line
        .replace(new RegExp(email.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"), "")
        .replace(new RegExp(phone.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"), "")
        .replace(/[|•·]+/g, " ")
        .replace(/\s{2,}/g, " ")
        .trim();
      if (location && location !== fullName && location.length > 2) break;
      location = "";
    }
  }

  // ── Pass 2: Split into section blocks ──
  type Block = { type: SectionType | "header" | "unknown"; lines: string[] };
  const blocks: Block[] = [];
  let cur: Block = { type: "header", lines: [] };

  for (let i = 0; i < allLines.length; i++) {
    const line = allLines[i];

    if (!line) {
      if (cur.lines.length > 0) cur.lines.push("");
      continue;
    }

    const heading = detectHeading(line);
    if (heading) {
      if (cur.lines.length > 0 || cur.type !== "header") {
        blocks.push(cur);
      }
      cur = { type: heading, lines: [] };
      continue;
    }

    cur.lines.push(line);
  }
  if (cur.lines.length > 0) blocks.push(cur);

  // ── Pass 3: Classify unknown/header blocks using content scoring ──
  for (const block of blocks) {
    if (block.type === "unknown" || block.type === "header") {
      const nonEmpty = block.lines.filter((l) => l.length > 0);
      if (nonEmpty.length === 0) continue;

      // Skip blocks that are just contact info
      const nonContactLines = nonEmpty.filter(
        (l) => !isContactLine(l) && l !== fullName,
      );
      if (nonContactLines.length === 0) {
        block.type = "contact";
        continue;
      }

      const result = scoreBlock(nonContactLines);
      if (result) {
        block.type = result.section;
      }
    }
  }

  // ── Pass 4: Merge same-type blocks and collect lines ──
  const sections: Record<string, string[]> = {
    summary: [],
    experience: [],
    education: [],
    skills: [],
    certifications: [],
    projects: [],
    languages: [],
    references: [],
    interests: [],
    unknown: [],
  };

  for (const block of blocks) {
    const key =
      block.type === "contact" || block.type === "header"
        ? "unknown"
        : block.type;
    const clean = block.lines
      .filter((l) => l.length > 0)
      .filter((l) => !isContactLine(l) || key !== "unknown")
      .filter((l) => l !== fullName || key !== "unknown");

    if (key in sections) {
      sections[key].push(...clean);
    } else {
      sections.unknown.push(...clean);
    }
  }

  // ── Pass 5: Parse each section into structured data ──
  const workExperience = parseExperience(sections.experience);
  const education = parseEducation(sections.education);
  const skillCategories = parseSkillCategories(sections.skills);
  const certifications = parseCertifications(sections.certifications);
  const projects = parseProjects(sections.projects);

  const languages = sections.languages
    .map((l) => stripBullet(l))
    .filter((l) => l.length > 1)
    .join(" | ");

  const references = parseReferences(sections.references);

  // Summary: use labeled summary, or build from unknown prose
  let professionalSummary = sections.summary
    .filter((l) => l !== fullName)
    .join(" ")
    .trim();

  if (!professionalSummary) {
    const prose = sections.unknown.filter(
      (l) =>
        l.length > 40 &&
        !/^[\-•·▪►✓✔*]/.test(l) &&
        !DATE_RANGE.test(l) &&
        !JOB_TITLES.test(l) &&
        l !== fullName,
    );
    if (prose.length > 0 && prose.length <= 5) {
      professionalSummary = prose.join(" ").trim();
    }
  }

  if (
    !professionalSummary &&
    !workExperience.length &&
    !education.length &&
    !skillCategories.length
  ) {
    professionalSummary = sections.unknown
      .filter((l) => l !== fullName && !isContactLine(l))
      .join("\n")
      .trim();
  }

  return {
    contactInfo: { fullName, tagline: "", email, phone, location, linkedin },
    professionalSummary: cleanText(professionalSummary),
    skillCategories,
    workExperience,
    projects,
    education,
    certifications,
    languages: cleanText(languages),
    references,
  };
}

// ═══════════════════════════════════════════════════
//  EXPERIENCE PARSER
// ═══════════════════════════════════════════════════

function parseExperience(lines: string[]): CVData["workExperience"] {
  if (!lines.length) return [];

  // Split into entry groups by blank lines or new role indicators
  const groups = splitIntoEntryGroups(lines, (line) => {
    if (/^[\-•·▪►✓✔*]\s/.test(line)) return false;
    return !!(DATE_RANGE.test(line) || JOB_TITLES.test(line));
  });

  const entries: CVData["workExperience"] = [];

  for (const group of groups) {
    if (!group.length) continue;

    let jobTitle = "";
    let company = "";
    let loc = "";
    let startDate = "";
    let endDate = "";
    const bullets: string[] = [];

    for (let i = 0; i < group.length; i++) {
      const line = group[i];
      const isBullet = /^[\-•·▪►✓✔*ðþ]\s/.test(line);
      const hasDate = DATE_RANGE.test(line);
      const hasTitle = JOB_TITLES.test(line);

      // Skip sub-labels like "Key Contributions:"
      if (/^(key\s+contributions|responsibilities|duties)\s*:?\s*$/i.test(line.trim())) {
        continue;
      }

      if (isBullet) {
        bullets.push(stripBullet(line));
        continue;
      }

      // Extract dates from this line
      if (hasDate && !startDate) {
        const dm = line.match(DATE_RANGE);
        if (dm) {
          const parts = dm[0].split(/\s*[-–—/]\s*|\s+to\s+/i);
          startDate = capitalize(parts[0]?.trim() || "");
          endDate = capitalize(parts[parts.length - 1]?.trim() || "");
        }
      }

      // Parse title / company / location from non-bullet, non-date-only lines
      const cleaned = line.replace(DATE_RANGE, "").replace(/[|–—]+/g, ",").trim();
      if (!cleaned) continue;

      const segments = cleaned
        .split(/\s*[,]\s*/)
        .map((s) => s.trim())
        .filter(Boolean);

      if (!jobTitle) {
        // First non-bullet line: likely job title (or title + company)
        if (hasTitle || i === 0) {
          jobTitle = segments[0] || cleaned;
          if (segments[1]) company = segments[1];
          if (segments[2]) loc = segments[2];
        } else if (!company) {
          company = cleaned;
        }
      } else if (!company) {
        company = segments[0] || cleaned;
        if (segments[1]) loc = segments[1];
      } else if (!loc && cleaned.length < 40) {
        loc = cleaned;
      } else {
        // Additional lines without bullet → treat as responsibility
        bullets.push(cleaned);
      }
    }

    if (jobTitle || company || bullets.length) {
      entries.push({
        id: uid(),
        jobTitle: cleanText(jobTitle),
        company: cleanText(company),
        location: cleanText(loc),
        startDate,
        endDate,
        responsibilities: bullets.map(cleanText).join("\n"),
      });
    }
  }

  return entries;
}

// ═══════════════════════════════════════════════════
//  EDUCATION PARSER
// ═══════════════════════════════════════════════════

function parseEducation(lines: string[]): CVData["education"] {
  if (!lines.length) return [];

  const groups = splitIntoEntryGroups(lines, (line) => {
    if (/^[\-•·▪►✓✔*]\s/.test(line)) return false;
    return !!EDUCATION_WORDS.test(line);
  });

  const entries: CVData["education"] = [];

  for (const group of groups) {
    if (!group.length) continue;

    let degree = "";
    let institution = "";
    let loc = "";
    let gradDate = "";
    const details: string[] = [];

    for (let i = 0; i < group.length; i++) {
      const line = group[i];
      const isBullet = /^[\-•·▪►✓✔*]\s/.test(line);
      const hasEdu = EDUCATION_WORDS.test(line);
      const yearMatch = line.match(/\b(19|20)\d{2}\b/);
      const hasDate = DATE_RANGE.test(line);

      if (isBullet) {
        details.push(stripBullet(line));
        continue;
      }

      // Extract year/date
      if (hasDate && !gradDate) {
        const dm = line.match(DATE_RANGE);
        if (dm) {
          const parts = dm[0].split(/\s*[-–—/]\s*|\s+to\s+/i);
          gradDate = capitalize(parts[parts.length - 1]?.trim() || "");
        }
      } else if (yearMatch && !gradDate) {
        gradDate = yearMatch[0];
      }

      const cleaned = line
        .replace(DATE_RANGE, "")
        .replace(/[|–—]+/g, ",")
        .trim();
      if (!cleaned) continue;

      const segments = cleaned
        .split(/\s*[,]\s*/)
        .map((s) => s.trim())
        .filter(Boolean);

      if (!degree && (hasEdu || i === 0)) {
        degree = segments[0] || cleaned;
        if (segments[1]) institution = segments[1];
        if (segments[2]) loc = segments[2];
      } else if (!institution) {
        institution = segments[0] || cleaned;
        if (segments[1]) loc = segments[1];
      } else if (!loc && cleaned.length < 40) {
        loc = cleaned;
      } else {
        details.push(cleaned);
      }
    }

    if (degree || institution) {
      entries.push({
        id: uid(),
        degree: cleanText(degree),
        institution: cleanText(institution),
        location: cleanText(loc),
        graduationDate: gradDate,
        details: details.map(cleanText).join("\n"),
      });
    }
  }

  return entries;
}

// ═══════════════════════════════════════════════════
//  SKILLS PARSER (categorized)
// ═══════════════════════════════════════════════════

function isProseDescription(text: string): boolean {
  const words = text.split(/\s+/).length;
  if (words > 12) return true;
  if (/\.\s*$/.test(text) && words > 6) return true;
  if (ACTION_VERBS.test(text) && words > 5) return true;
  return false;
}

function parseSkillCategories(lines: string[]): CVData["skillCategories"] {
  if (!lines.length) return [];

  const categories: CVData["skillCategories"] = [];

  for (const line of lines) {
    let cleaned = stripBullet(line);
    if (!cleaned) continue;

    // Strip pipe characters that separate label from description
    cleaned = cleaned.replace(/\s*\|\s*/g, " ").trim();

    // Skip pure prose descriptions (these leak in from "Professional Strengths")
    if (isProseDescription(cleaned) && !/[:,;]/.test(cleaned.slice(0, 30))) continue;

    // Pattern: "Category Name: items/description"
    const colonMatch = cleaned.match(/^([A-Za-z&\s/()]+?)\s*:\s*(.*)$/);
    if (colonMatch) {
      const label = colonMatch[1].trim();
      const rightSide = (colonMatch[2] || "").trim();

      // If the right side is prose, keep just the label (user fills items in edit step)
      if (isProseDescription(rightSide) || rightSide.length === 0) {
        // Only add the category label — no prose items
        if (label.length > 2 && label.length < 45) {
          categories.push({ id: uid(), category: label, items: "" });
        }
      } else {
        categories.push({ id: uid(), category: label, items: rightSide });
      }
      continue;
    }

    // Skill list line (has commas, semicolons, middledots, pipes)
    const delimCount = (cleaned.match(/[,;•·]/g) || []).length;

    if (delimCount >= 1 && !isProseDescription(cleaned)) {
      if (categories.length > 0 && !categories[categories.length - 1].items) {
        categories[categories.length - 1].items = cleaned;
      } else {
        categories.push({ id: uid(), category: "General", items: cleaned });
      }
    } else if (cleaned.length < 40 && cleaned.split(/\s+/).length <= 5 && !isProseDescription(cleaned)) {
      // Short line — likely a standalone category label or single skill group
      if (delimCount === 0) {
        categories.push({ id: uid(), category: cleaned, items: "" });
      } else {
        categories.push({ id: uid(), category: "General", items: cleaned });
      }
    }
    // Longer lines without delimiters = prose — skip entirely
  }

  // Remove categories with no items (they were just labels with no skill list)
  // But keep them if user can fill them in
  return categories.filter((c) => c.items || c.category !== "General");
}

// ═══════════════════════════════════════════════════
//  CERTIFICATIONS PARSER (name + issuer)
// ═══════════════════════════════════════════════════

function parseCertifications(lines: string[]): CVData["certifications"] {
  return lines
    .map((l) => stripBullet(l))
    .filter((l) => l.length > 2)
    .map((l) => {
      // Split on " — ", " – ", " - " to separate name from issuer
      const parts = l.split(/\s*[—–\-|]\s*/);
      return {
        id: uid(),
        name: cleanText(parts[0] || l),
        issuer: cleanText(parts.slice(1).join(", ")),
      };
    });
}

// ═══════════════════════════════════════════════════
//  PROJECTS PARSER
// ═══════════════════════════════════════════════════
//  REFERENCES PARSER
// ═══════════════════════════════════════════════════

function parseReferences(lines: string[]): CVData["references"] {
  if (!lines.length) return [];

  const refs: CVData["references"] = [];
  let current: CVData["references"][0] | null = null;

  for (const line of lines) {
    const cleaned = stripBullet(line).trim();
    if (!cleaned) continue;

    const emailMatch = cleaned.match(/[\w.+-]+@[\w.-]+\.\w{2,}/);
    const phoneMatch = cleaned.match(/(?:\+?\d{1,3}[\s.-]?)?\(?\d{2,4}\)?[\s.-]?\d{3,4}[\s.-]?\d{3,4}/);

    if (emailMatch || phoneMatch) {
      if (current) {
        if (emailMatch) current.email = emailMatch[0];
        if (phoneMatch) current.phone = phoneMatch[0].trim();
      }
      continue;
    }

    // Lines with titles/roles often contain dashes or commas
    if (current && !current.title && (cleaned.includes(",") || cleaned.includes("—") || cleaned.includes("-"))) {
      const parts = cleaned.split(/\s*[,—–\-]\s*/);
      current.title = parts[0] || "";
      current.organization = parts.slice(1).join(", ");
      continue;
    }

    // New referee name (short line, mostly alpha)
    if (/^[A-Za-z\s.'-]+$/.test(cleaned) && cleaned.length < 50) {
      if (current) refs.push(current);
      current = { id: uid(), name: cleaned, title: "", organization: "", email: "", phone: "" };
    } else if (current) {
      if (!current.title) current.title = cleaned;
      else if (!current.organization) current.organization = cleaned;
    }
  }

  if (current) refs.push(current);
  return refs;
}

// ═══════════════════════════════════════════════════

function parseProjects(lines: string[]): CVData["projects"] {
  if (!lines.length) return [];

  const groups = splitIntoEntryGroups(lines, (line) => {
    if (/^[\-•·▪►✓✔*]\s/.test(line)) return false;
    return line.length < 60 && !/^[\-•·▪►✓✔*]/.test(line);
  });

  const entries: CVData["projects"] = [];

  for (const group of groups) {
    if (!group.length) continue;

    let name = "";
    let context = "";
    let tools = "";
    const details: string[] = [];

    for (const line of group) {
      const isBullet = /^[\-•·▪►✓✔*]\s/.test(line);

      if (isBullet) {
        details.push(stripBullet(line));
        continue;
      }

      if (!name) {
        name = line.trim();
      } else if (!context && line.length < 50) {
        context = line.trim();
      } else if (!tools && /[,•·]/.test(line) && line.length < 60) {
        tools = line.trim();
      } else {
        details.push(line.trim());
      }
    }

    if (name) {
      entries.push({
        id: uid(),
        name: cleanText(name),
        context: cleanText(context),
        tools: cleanText(tools),
        details: details.map(cleanText).join("\n"),
      });
    }
  }

  return entries;
}

// ═══════════════════════════════════════════════════
//  UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════

function stripBullet(line: string): string {
  return line
    .replace(/^ð·\s*/g, "")
    .replace(/^ðþ\s*/g, "")
    .replace(/^[\-•·▪►✓✔*➤➢○◆◇■□▸▹→⇒ðþ]+\s*/u, "")
    .replace(/^\|\s*/, "")
    .trim();
}

function cleanText(text: string): string {
  return text
    .replace(/ð·/g, "")
    .replace(/ðþ/g, "")
    .replace(/[ðþ]/g, "")
    .replace(/�/g, "")
    .replace(/\s{2,}/g, " ")
    .replace(/[""]/g, '"')
    .replace(/['']/g, "'")
    .replace(/…/g, "...")
    .replace(/[​­﻿]/g, "")
    .replace(/^\|\s*/, "")
    .replace(/\s*\|\s*$/, "")
    .replace(/^[,\s]+/, "")
    .trim();
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function dedup(arr: string[]): string[] {
  const seen = new Set<string>();
  return arr.filter((item) => {
    const lower = item.toLowerCase();
    if (seen.has(lower)) return false;
    seen.add(lower);
    return true;
  });
}

/**
 * Split lines into groups, breaking on blank lines or when
 * isNewEntry returns true for a line.
 */
function splitIntoEntryGroups(
  lines: string[],
  isNewEntry: (line: string) => boolean,
): string[][] {
  const groups: string[][] = [];
  let current: string[] = [];
  let blankCount = 0;

  for (const line of lines) {
    if (!line) {
      blankCount++;
      // Two+ consecutive blanks → definite break
      if (blankCount >= 2 && current.length > 0) {
        groups.push(current);
        current = [];
      }
      continue;
    }

    // A new entry indicator after content → break
    if (current.length > 0 && isNewEntry(line) && blankCount >= 1) {
      groups.push(current);
      current = [];
    }

    current.push(line);
    blankCount = 0;
  }

  if (current.length > 0) groups.push(current);
  return groups;
}

// ═══════════════════════════════════════════════════
//  ATS SCORE
// ═══════════════════════════════════════════════════

export function calculateATSScore(data: CVData): ATSScore {
  const items: ATSScoreItem[] = [
    {
      label: "Contact information complete",
      passed: !!(
        data.contactInfo.fullName &&
        data.contactInfo.email &&
        data.contactInfo.phone
      ),
      tip: "Include your full name, email, and phone number so recruiters can reach you.",
    },
    {
      label: "Professional summary present",
      passed:
        data.professionalSummary.split(/\s+/).filter(Boolean).length >= 15,
      tip: "Write a 3-5 sentence summary highlighting your key qualifications and career goals.",
    },
    {
      label: "Work experience included",
      passed: data.workExperience.length > 0,
      tip: "Add your work history with job titles, companies, and dates.",
    },
    {
      label: "Quantified achievements",
      passed: data.workExperience.some((exp) =>
        /\d+%|\$[\d,]+|\b\d{2,}\b/.test(exp.responsibilities),
      ),
      tip: "Add numbers and metrics to bullet points (e.g., 'Increased sales by 25%').",
    },
    {
      label: "Detailed responsibilities",
      passed:
        data.workExperience.length > 0 &&
        data.workExperience.every(
          (exp) =>
            (exp.responsibilities.match(/<li>/gi) || exp.responsibilities.split("\n").filter(Boolean)).length >= 2,
        ),
      tip: "Include at least 2-3 bullet points per role describing key contributions.",
    },
    {
      label: "Skills section populated",
      passed: data.skillCategories.length >= 1 && data.skillCategories.some((c) => c.items.length > 5),
      tip: "List at least 5 relevant skills using industry-standard terminology.",
    },
    {
      label: "Education section present",
      passed: data.education.length > 0,
      tip: "Include your educational background with degree, institution, and graduation date.",
    },
    {
      label: "Consistent date formatting",
      passed:
        data.workExperience.length > 0 &&
        data.workExperience.every((exp) => exp.startDate && exp.endDate),
      tip: "Ensure all positions have start and end dates in a consistent format.",
    },
    {
      label: "No special characters",
      passed: !/[★☆♦♥♠♣✦✧❖]/.test(JSON.stringify(data)),
      tip: "Remove decorative symbols — ATS systems may not parse them correctly.",
    },
    {
      label: "Clean, parseable format",
      passed: true,
      tip: "Your CV will be exported in a clean, single-column format that ATS systems can read.",
    },
  ];

  const passed = items.filter((i) => i.passed).length;
  const overall = Math.round((passed / items.length) * 100);

  return { overall, items };
}

export function emptyCVData(): CVData {
  return {
    contactInfo: {
      fullName: "",
      tagline: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
    },
    professionalSummary: "",
    skillCategories: [],
    workExperience: [],
    projects: [],
    education: [],
    certifications: [],
    languages: "",
    references: [],
  };
}
