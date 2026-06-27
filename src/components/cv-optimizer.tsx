"use client";

import { useState, useCallback, useRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import {
  Upload,
  FileText,
  FilePlus,
  CheckCircle2,
  XCircle,
  Download,
  Plus,
  Trash2,
  ArrowLeft,
  ArrowRight,
  Loader2,
  AlertCircle,
  FileDown,
  RotateCcw,
  X,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RichEditor, linesToRichHtml } from "@/components/rich-editor";
import { AiFieldAssist, useAiReview } from "@/components/ai-field-assist";
import type { CVData, ATSScore } from "@/lib/cv-parser";

const STEPS = ["Upload", "Edit Sections", "ATS Analysis", "Download"] as const;
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const inputClass =
  "bg-white border-gray-200 text-dark-text placeholder:text-gray-400 focus:border-gold h-12 rounded-xl w-full";
const labelClass = "block text-sm font-semibold text-navy mb-2";

export function CvOptimizer() {
  const [step, setStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [atsScore, setAtsScore] = useState<ATSScore | null>(null);
  const [fileName, setFileName] = useState("");
  const [aiLoading, setAiLoading] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, control, getValues, reset, watch, setValue } = useForm<CVData>({
    defaultValues: {
      contactInfo: { fullName: "", tagline: "", email: "", phone: "", location: "", linkedin: "" },
      professionalSummary: "",
      skillCategories: [],
      workExperience: [],
      projects: [],
      education: [],
      certifications: [],
      languages: "",
      references: [],
    },
  });

  const { fields: expFields, append: appendExp, remove: removeExp } = useFieldArray({ control, name: "workExperience" });
  const { fields: eduFields, append: appendEdu, remove: removeEdu } = useFieldArray({ control, name: "education" });
  const { fields: skillFields, append: appendSkill, remove: removeSkill } = useFieldArray({ control, name: "skillCategories" });
  const { fields: projFields, append: appendProj, remove: removeProj } = useFieldArray({ control, name: "projects" });
  const { fields: certFields, append: appendCert, remove: removeCert } = useFieldArray({ control, name: "certifications" });
  const { fields: refFields, append: appendRef, remove: removeRef } = useFieldArray({ control, name: "references" });

  const { review: aiReview, loading: reviewLoading, runReview } = useAiReview();

  const processFile = useCallback(
    async (file: File) => {
      setError("");
      setIsProcessing(true);
      setFileName(file.name);
      try {
        if (!ACCEPTED_TYPES.includes(file.type) && !file.name.endsWith(".pdf") && !file.name.endsWith(".docx")) {
          throw new Error("Please upload a PDF or Word (.docx) file.");
        }
        if (file.size > MAX_FILE_SIZE) {
          throw new Error("File size exceeds 10MB.");
        }
        const { extractTextFromFile, parseRawTextToCV } = await import("@/lib/cv-parser");
        const text = await extractTextFromFile(file);
        if (text.trim().length < 30) {
          throw new Error("The file appears empty or contains very little text. It may be a scanned PDF.");
        }
        const parsed = parseRawTextToCV(text);
        // Convert plain-text responsibilities/details to HTML for the rich editor
        for (const exp of parsed.workExperience) {
          exp.responsibilities = linesToRichHtml(exp.responsibilities);
        }
        for (const proj of parsed.projects) {
          proj.details = linesToRichHtml(proj.details);
        }
        for (const edu of parsed.education) {
          edu.details = linesToRichHtml(edu.details);
        }
        reset(parsed);
        setStep(1);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to parse the file.");
      } finally {
        setIsProcessing(false);
      }
    },
    [reset],
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
    },
    [processFile],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file) processFile(file);
    },
    [processFile],
  );

  const runATSAnalysis = useCallback(async () => {
    const { calculateATSScore } = await import("@/lib/cv-parser");
    setAtsScore(calculateATSScore(getValues()));
    setStep(2);
  }, [getValues]);

  const handleExportPdf = useCallback(async () => {
    const { exportToPdf } = await import("@/lib/cv-export");
    await exportToPdf(getValues());
  }, [getValues]);

  const handleExportDocx = useCallback(async () => {
    const { exportToDocx } = await import("@/lib/cv-export");
    await exportToDocx(getValues());
  }, [getValues]);

  const startOver = useCallback(() => {
    reset({
      contactInfo: { fullName: "", tagline: "", email: "", phone: "", location: "", linkedin: "" },
      professionalSummary: "",
      skillCategories: [],
      workExperience: [],
      projects: [],
      education: [],
      certifications: [],
      languages: "",
      references: [],
    });
    setStep(0);
    setAtsScore(null);
    setError("");
    setFileName("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [reset]);

  function uid() {
    return Math.random().toString(36).slice(2, 9);
  }

  const createFromScratch = useCallback(() => {
    reset({
      contactInfo: { fullName: "", tagline: "", email: "", phone: "", location: "", linkedin: "" },
      professionalSummary: "",
      skillCategories: [
        { id: Math.random().toString(36).slice(2, 9), category: "", items: "" },
      ],
      workExperience: [
        { id: Math.random().toString(36).slice(2, 9), jobTitle: "", company: "", location: "", startDate: "", endDate: "", responsibilities: "" },
      ],
      projects: [],
      education: [
        { id: Math.random().toString(36).slice(2, 9), degree: "", institution: "", location: "", graduationDate: "", details: "" },
      ],
      certifications: [],
      languages: "",
      references: [],
    });
    setStep(1);
  }, [reset]);

  const enhanceSummary = useCallback(async () => {
    setAiLoading("summary");
    try {
      const data = getValues();
      const skills = data.skillCategories.map((c) => `${c.category}: ${c.items}`).join("; ");
      const experience = data.workExperience.map((e) => e.jobTitle).join(", ");
      const res = await fetch("/api/ai/enhance-cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "enhance-summary",
          data: {
            currentSummary: data.professionalSummary,
            jobTitle: data.contactInfo.tagline || data.workExperience[0]?.jobTitle || "",
            skills,
            experience,
          },
        }),
      });
      const json = await res.json();
      if (json.result) setValue("professionalSummary", json.result);
    } catch { /* silently fail */ }
    setAiLoading(null);
  }, [getValues, setValue]);

  const enhanceBullets = useCallback(async (index: number) => {
    setAiLoading(`exp-${index}`);
    try {
      const data = getValues();
      const exp = data.workExperience[index];
      const div = document.createElement("div");
      div.innerHTML = exp.responsibilities;
      const plainBullets = Array.from(div.querySelectorAll("li"))
        .map((li) => li.textContent?.trim())
        .filter(Boolean)
        .join("\n");
      const bullets = plainBullets || div.textContent || exp.responsibilities;

      const res = await fetch("/api/ai/enhance-cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "enhance-bullets",
          data: { bullets, jobTitle: exp.jobTitle, company: exp.company },
        }),
      });
      const json = await res.json();
      if (json.result && Array.isArray(json.result)) {
        const html = "<ul>" + json.result.map((b: string) => `<li>${b}</li>`).join("") + "</ul>";
        setValue(`workExperience.${index}.responsibilities`, html);
      }
    } catch { /* silently fail */ }
    setAiLoading(null);
  }, [getValues, setValue]);

  const suggestSkills = useCallback(async () => {
    setAiLoading("skills");
    try {
      const data = getValues();
      const experience = data.workExperience
        .map((e) => `${e.jobTitle}: ${e.responsibilities.replace(/<[^>]*>/g, "").slice(0, 200)}`)
        .join("\n");
      const currentSkills = data.skillCategories.map((c) => `${c.category}: ${c.items}`).join("; ");
      const jobTitle = data.contactInfo.tagline || data.workExperience[0]?.jobTitle || "";

      const res = await fetch("/api/ai/enhance-cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "suggest-skills",
          data: { experience, currentSkills, jobTitle },
        }),
      });
      const json = await res.json();
      if (json.result && Array.isArray(json.result)) {
        const newSkills = json.result.map((s: { category: string; items: string }) => ({
          id: uid(),
          category: s.category,
          items: s.items,
        }));
        setValue("skillCategories", newSkills);
      }
    } catch { /* silently fail */ }
    setAiLoading(null);
  }, [getValues, setValue]);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Step Indicators */}
      <div className="flex items-center justify-center gap-1 mb-10 flex-wrap">
        {STEPS.map((label, i) => (
          <button
            key={label}
            type="button"
            disabled
            className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
              i === step ? "bg-gold text-navy" : i < step ? "bg-gold-light text-gold" : "bg-light-gray text-body-text"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ═══════ Step 0: Upload ═══════ */}
      {step === 0 && (
        <div className="text-center">
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-12 sm:p-16 cursor-pointer transition-all ${
              isDragOver ? "border-gold bg-gold-light/50" : "border-gray-300 hover:border-gold/50 hover:bg-light-gray"
            }`}
          >
            <input ref={fileInputRef} type="file" accept=".pdf,.docx" onChange={handleFileSelect} className="hidden" />
            {isProcessing ? (
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-12 h-12 text-gold animate-spin" />
                <p className="text-navy font-semibold">Parsing your CV...</p>
                <p className="text-body-text text-sm">{fileName}</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-gold-light rounded-2xl flex items-center justify-center">
                  <Upload className="w-8 h-8 text-gold" />
                </div>
                <div>
                  <p className="text-navy font-semibold text-lg mb-1">Drop your CV here or click to browse</p>
                  <p className="text-body-text text-sm">Supported formats: PDF, DOCX (max 10MB)</p>
                </div>
              </div>
            )}
          </div>
          {error && (
            <div className="mt-6 flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4 text-left">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-body-text text-sm font-medium">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Create from Scratch */}
          <div
            onClick={createFromScratch}
            className="border-2 border-dashed border-gray-300 hover:border-gold/50 hover:bg-light-gray rounded-2xl p-8 sm:p-10 cursor-pointer transition-all"
          >
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 bg-navy/5 rounded-2xl flex items-center justify-center">
                <FilePlus className="w-7 h-7 text-navy/60" />
              </div>
              <div>
                <p className="text-navy font-semibold text-lg mb-1">Create a New CV from Scratch</p>
                <p className="text-body-text text-sm">
                  Fill in your details manually and build an ATS-optimized CV from the ground up
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════ Step 1: Edit ═══════ */}
      {step === 1 && (
        <div className="space-y-8">
          {/* Contact Information */}
          <Section title="Contact Information">
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Full Name" reg={register("contactInfo.fullName")} placeholder="Josiah Kamau Mwangi" />
              <AiFieldAssist
                field="tagline"
                currentValue={watch("contactInfo.tagline") || ""}
                context={{ fullName: watch("contactInfo.fullName") || "" }}
                onAccept={(v) => setValue("contactInfo.tagline", v)}
              >
                <Field label="Tagline" reg={register("contactInfo.tagline")} placeholder="Data Analyst | IT Support | BI" />
              </AiFieldAssist>
              <Field label="Email" reg={register("contactInfo.email")} placeholder="josiah@example.com" />
              <Field label="Phone" reg={register("contactInfo.phone")} placeholder="+254 796 429 778" />
              <Field label="Location" reg={register("contactInfo.location")} placeholder="Nairobi, Kenya" />
              <Field label="LinkedIn" reg={register("contactInfo.linkedin")} placeholder="linkedin.com/in/yourprofile" />
            </div>
          </Section>

          {/* Professional Summary */}
          <Section title="Professional Summary">
            <AiFieldAssist
              field="professionalSummary"
              currentValue={watch("professionalSummary") || ""}
              context={{ fullName: watch("contactInfo.fullName") || "", tagline: watch("contactInfo.tagline") || "" }}
              onAccept={(v) => setValue("professionalSummary", v)}
            >
              <Textarea
                {...register("professionalSummary")}
                placeholder="4-6 sentences summarising your professional background, key tools, and career goal..."
                className="bg-white border-gray-200 text-dark-text placeholder:text-gray-400 focus:border-gold rounded-xl min-h-[120px]"
              />
            </AiFieldAssist>
            <AiButton label="Enhance Summary with AI" loading={aiLoading === "summary"} onClick={enhanceSummary} />
          </Section>

          {/* Core Skills (categorized) */}
          <Section
            title="Core Skills"
            onAdd={() => appendSkill({ id: uid(), category: "", items: "" })}
          >
            <AiButton label="Suggest Skills from Experience" loading={aiLoading === "skills"} onClick={suggestSkills} />
            {skillFields.length === 0 && <EmptyState text="No skill categories yet." />}
            {skillFields.map((field, i) => (
              <div key={field.id} className="bg-white rounded-xl p-5 border border-gray-200 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-gold uppercase tracking-wide">Category {i + 1}</span>
                  <RemoveBtn onClick={() => removeSkill(i)} />
                </div>
                <div className="grid sm:grid-cols-[200px_1fr] gap-4">
                  <div>
                    <label className={labelClass}>Category Label</label>
                    <Input {...register(`skillCategories.${i}.category`)} placeholder="Data Analysis & BI" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Skills (comma or · separated)</label>
                    <Input {...register(`skillCategories.${i}.items`)} placeholder="Excel, SQL, SPSS, Power BI" className={inputClass} />
                  </div>
                </div>
              </div>
            ))}
          </Section>

          {/* Work Experience */}
          <Section
            title="Professional Experience"
            onAdd={() => appendExp({ id: uid(), jobTitle: "", company: "", location: "", startDate: "", endDate: "", responsibilities: "" })}
          >
            {expFields.length === 0 && <EmptyState text="No work experience entries yet." />}
            {expFields.map((field, i) => (
              <div key={field.id} className="bg-white rounded-xl p-5 border border-gray-200 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-gold uppercase tracking-wide">Position {i + 1}</span>
                  <RemoveBtn onClick={() => removeExp(i)} />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Job Title" reg={register(`workExperience.${i}.jobTitle`)} placeholder="Business Development Officer" />
                  <Field label="Company" reg={register(`workExperience.${i}.company`)} placeholder="Vantage Africa" />
                  <Field label="Location" reg={register(`workExperience.${i}.location`)} placeholder="Nairobi, Kenya" />
                  <div className="grid grid-cols-2 gap-3">
                    <DateField label="Start Date" reg={register(`workExperience.${i}.startDate`)} />
                    <DateField label="End Date" reg={register(`workExperience.${i}.endDate`)} allowPresent />
                  </div>
                </div>
                <div className="mt-4">
                  <label className={labelClass}>Responsibilities & Achievements</label>
                  <AiFieldAssist
                    field="responsibilities"
                    currentValue={watch(`workExperience.${i}.jobTitle`) || ""}
                    context={{ jobTitle: watch(`workExperience.${i}.jobTitle`) || "", company: watch(`workExperience.${i}.company`) || "" }}
                    onAccept={(v) => {
                      const html = "<ul>" + v.split("\n").filter(Boolean).map((l) => `<li>${l.replace(/^[-•]\s*/, "")}</li>`).join("") + "</ul>";
                      setValue(`workExperience.${i}.responsibilities`, html);
                    }}
                  >
                    <RichEditor
                      value={watch(`workExperience.${i}.responsibilities`) || ""}
                      onChange={(v) => setValue(`workExperience.${i}.responsibilities`, v)}
                      placeholder="Use the toolbar to format — add bullet points, bold key metrics, italicize tools..."
                      minHeight="120px"
                    />
                  </AiFieldAssist>
                  <AiButton label="Enhance Bullets with AI" loading={aiLoading === `exp-${i}`} onClick={() => enhanceBullets(i)} />
                </div>
              </div>
            ))}
          </Section>

          {/* Projects */}
          <Section
            title="Projects"
            onAdd={() => appendProj({ id: uid(), name: "", context: "", tools: "", details: "" })}
          >
            {projFields.length === 0 && <EmptyState text="No projects yet. Click Add to include one." />}
            {projFields.map((field, i) => (
              <div key={field.id} className="bg-white rounded-xl p-5 border border-gray-200 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-gold uppercase tracking-wide">Project {i + 1}</span>
                  <RemoveBtn onClick={() => removeProj(i)} />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Project Name" reg={register(`projects.${i}.name`)} placeholder="Customer Sales Analysis" />
                  <Field label="Context" reg={register(`projects.${i}.context`)} placeholder="Personal Project" />
                </div>
                <div className="mt-4">
                  <Field label="Tools Used" reg={register(`projects.${i}.tools`)} placeholder="Excel, Power Query, DAX" />
                </div>
                <div className="mt-4">
                  <label className={labelClass}>Details</label>
                  <RichEditor
                    value={watch(`projects.${i}.details`) || ""}
                    onChange={(v) => setValue(`projects.${i}.details`, v)}
                    placeholder="Describe what you did, tools used, and outcomes..."
                    minHeight="100px"
                  />
                </div>
              </div>
            ))}
          </Section>

          {/* Education */}
          <Section
            title="Education"
            onAdd={() => appendEdu({ id: uid(), degree: "", institution: "", location: "", graduationDate: "", details: "" })}
          >
            {eduFields.length === 0 && <EmptyState text="No education entries yet." />}
            {eduFields.map((field, i) => (
              <div key={field.id} className="bg-white rounded-xl p-5 border border-gray-200 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-gold uppercase tracking-wide">Entry {i + 1}</span>
                  <RemoveBtn onClick={() => removeEdu(i)} />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Degree / Qualification" reg={register(`education.${i}.degree`)} placeholder="BSc Business Information Technology" />
                  <Field label="Institution" reg={register(`education.${i}.institution`)} placeholder="South Eastern Kenya University" />
                  <Field label="Location" reg={register(`education.${i}.location`)} placeholder="Nairobi" />
                  <DateField label="Graduation Date" reg={register(`education.${i}.graduationDate`)} />
                </div>
                <div className="mt-4">
                  <label className={labelClass}>Additional Details</label>
                  <Textarea
                    {...register(`education.${i}.details`)}
                    placeholder="Major: Data/Business Analytics with IT"
                    className="bg-white border-gray-200 text-dark-text placeholder:text-gray-400 focus:border-gold rounded-xl min-h-[60px]"
                  />
                </div>
              </div>
            ))}
          </Section>

          {/* Certifications */}
          <Section
            title="Certifications"
            onAdd={() => appendCert({ id: uid(), name: "", issuer: "" })}
          >
            {certFields.length === 0 && <EmptyState text="No certifications yet." />}
            {certFields.map((field, i) => (
              <div key={field.id} className="bg-white rounded-xl p-5 border border-gray-200 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-gold uppercase tracking-wide">Cert {i + 1}</span>
                  <RemoveBtn onClick={() => removeCert(i)} />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Certificate Name" reg={register(`certifications.${i}.name`)} placeholder="Cybersecurity Awareness Training" />
                  <Field label="Issuing Body" reg={register(`certifications.${i}.issuer`)} placeholder="ICT Authority, Kenya" />
                </div>
              </div>
            ))}
          </Section>

          {/* Languages */}
          <Section title="Languages">
            <Input
              {...register("languages")}
              placeholder="English — Proficient | Swahili — Native"
              className={inputClass}
            />
          </Section>

          {/* References (dynamic add/remove) */}
          <Section
            title="References"
            onAdd={() => appendRef({ id: uid(), name: "", title: "", organization: "", email: "", phone: "" })}
          >
            {refFields.length === 0 && <EmptyState text="No referees yet. Click Add to include one." />}
            {refFields.map((field, i) => (
              <div key={field.id} className="bg-white rounded-xl p-5 border border-gray-200 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-gold uppercase tracking-wide">Referee {i + 1}</span>
                  <RemoveBtn onClick={() => removeRef(i)} />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Full Name" reg={register(`references.${i}.name`)} placeholder="Francis Murimi" />
                  <Field label="Job Title" reg={register(`references.${i}.title`)} placeholder="ICT Administrator" />
                  <Field label="Organization" reg={register(`references.${i}.organization`)} placeholder="Muriranjas Sub-County Hospital" />
                  <Field label="Email" reg={register(`references.${i}.email`)} placeholder="fmurimi2000@gmail.com" />
                  <Field label="Phone" reg={register(`references.${i}.phone`)} placeholder="+254 742 597 479" />
                </div>
              </div>
            ))}
          </Section>

          {/* Recommendations before analysis */}
          <Recommendations getValues={getValues} />

          {/* AI Structure Review */}
          {aiReview && (
            <div className="bg-light-gray rounded-2xl p-6 sm:p-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-sans text-base font-bold text-navy">AI Quality Review</h3>
                <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                  aiReview.score >= 80 ? "bg-green-100 text-green-700" :
                  aiReview.score >= 50 ? "bg-yellow-100 text-yellow-700" :
                  "bg-red-100 text-red-700"
                }`}>
                  {aiReview.score}/100
                </span>
              </div>
              <ul className="space-y-2">
                {aiReview.issues.map((issue, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className={`mt-0.5 text-xs ${
                      issue.severity === "error" ? "text-red-500" :
                      issue.severity === "warning" ? "text-yellow-500" : "text-blue-400"
                    }`}>
                      {issue.severity === "error" ? "●" : issue.severity === "warning" ? "▲" : "ℹ"}
                    </span>
                    <span className="text-dark-text">
                      <span className="font-medium">{issue.field}:</span> {issue.message}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4">
            <Button type="button" variant="outline" onClick={startOver} className="border-2 border-navy text-navy hover:bg-navy hover:text-white font-semibold rounded-full px-6 py-5 text-sm cursor-pointer transition-all">
              <ArrowLeft className="w-4 h-4 mr-2" /> Start Over
            </Button>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => runReview(getValues() as unknown as Record<string, unknown>)}
                disabled={reviewLoading}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-gold bg-gold-light hover:bg-gold hover:text-navy rounded-full transition-all cursor-pointer disabled:opacity-50"
              >
                {reviewLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                AI Review
              </button>
              <Button type="button" onClick={runATSAnalysis} className="bg-gold text-navy font-bold hover:bg-gold-hover rounded-full px-6 py-5 text-sm cursor-pointer transition-all">
                Analyse CV <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════ Step 2: ATS Analysis ═══════ */}
      {step === 2 && atsScore && (
        <div className="space-y-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-28 h-28 rounded-full border-4 border-gold bg-gold-light mb-4">
              <span className="text-3xl font-bold text-navy">{atsScore.overall}</span>
            </div>
            <p className="text-navy font-semibold text-lg">ATS Score</p>
            <p className="text-body-text text-sm mt-1">
              {atsScore.overall >= 80 ? "Great! Your CV is well-optimized." : atsScore.overall >= 50 ? "Good start — some improvements will help." : "Your CV needs more optimization."}
            </p>
          </div>
          <div className="bg-light-gray rounded-2xl p-6 sm:p-8">
            <h3 className="font-sans text-lg font-bold text-navy mb-5">ATS Checklist</h3>
            <div className="space-y-4">
              {atsScore.items.map((item) => (
                <div key={item.label} className="flex items-start gap-3">
                  {item.passed ? <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" /> : <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />}
                  <div>
                    <p className={`text-sm font-medium ${item.passed ? "text-navy" : "text-red-700"}`}>{item.label}</p>
                    {!item.passed && <p className="text-body-text text-xs mt-0.5">{item.tip}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between pt-4">
            <Button type="button" variant="outline" onClick={() => setStep(1)} className="border-2 border-navy text-navy hover:bg-navy hover:text-white font-semibold rounded-full px-6 py-5 text-sm cursor-pointer transition-all">
              <ArrowLeft className="w-4 h-4 mr-2" /> Edit CV
            </Button>
            <Button type="button" onClick={() => setStep(3)} className="bg-gold text-navy font-bold hover:bg-gold-hover rounded-full px-6 py-5 text-sm cursor-pointer transition-all">
              Download <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {/* ═══════ Step 3: Download ═══════ */}
      {step === 3 && (
        <div className="text-center py-8">
          <div className="w-20 h-20 bg-gold-light rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="w-10 h-10 text-gold" />
          </div>
          <h2 className="font-sans text-2xl sm:text-3xl font-bold text-navy mb-3">Your ATS-Optimized CV Is Ready</h2>
          <p className="text-body-text max-w-md mx-auto mb-10">Download in your preferred format. Both versions are ATS-compliant.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <Button type="button" onClick={handleExportPdf} className="bg-gold text-navy font-bold hover:bg-gold-hover rounded-full px-8 py-5 text-sm cursor-pointer transition-all">
              <FileDown className="w-4 h-4 mr-2" /> Download PDF
            </Button>
            <Button type="button" onClick={handleExportDocx} className="bg-navy text-white font-bold hover:bg-navy-light rounded-full px-8 py-5 text-sm cursor-pointer transition-all">
              <Download className="w-4 h-4 mr-2" /> Download Word
            </Button>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button type="button" variant="outline" onClick={() => setStep(1)} className="border-2 border-navy text-navy hover:bg-navy hover:text-white font-semibold rounded-full px-6 py-5 text-sm cursor-pointer transition-all">
              <ArrowLeft className="w-4 h-4 mr-2" /> Edit Again
            </Button>
            <Button type="button" variant="outline" onClick={startOver} className="border-2 border-gray-300 text-body-text hover:bg-light-gray font-semibold rounded-full px-6 py-5 text-sm cursor-pointer transition-all">
              <RotateCcw className="w-4 h-4 mr-2" /> Start Over
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Reusable sub-components ──

function Section({ title, children, onAdd }: { title: string; children: React.ReactNode; onAdd?: () => void }) {
  return (
    <div className="bg-light-gray rounded-2xl p-6 sm:p-8">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-sans text-lg font-bold text-navy">{title}</h3>
        {onAdd && (
          <Button type="button" onClick={onAdd} className="bg-gold text-navy font-semibold hover:bg-gold-hover rounded-full px-4 py-2 text-xs cursor-pointer transition-all">
            <Plus className="w-3.5 h-3.5 mr-1" /> Add
          </Button>
        )}
      </div>
      {children}
    </div>
  );
}

function Field({ label, reg, placeholder }: { label: string; reg: ReturnType<typeof Object>; placeholder: string }) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <Input {...reg} placeholder={placeholder} className={inputClass} />
    </div>
  );
}

function DateField({ label, reg, allowPresent }: { label: string; reg: ReturnType<typeof Object>; allowPresent?: boolean }) {
  const [isPresent, setIsPresent] = useState(false);

  return (
    <div>
      <label className={labelClass}>{label}</label>
      {allowPresent && isPresent ? (
        <div className="flex items-center gap-2">
          <Input value="Present" disabled className={inputClass + " bg-light-gray"} />
          <button
            type="button"
            onClick={() => setIsPresent(false)}
            className="text-xs text-gold font-medium hover:underline cursor-pointer whitespace-nowrap"
          >
            Set date
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Input type="month" {...reg} className={inputClass} />
          {allowPresent && (
            <button
              type="button"
              onClick={() => {
                setIsPresent(true);
                const input = document.querySelector(`input[name="${(reg as { name: string }).name}"]`) as HTMLInputElement;
                if (input) {
                  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
                  nativeInputValueSetter?.call(input, "Present");
                  input.dispatchEvent(new Event("input", { bubbles: true }));
                }
              }}
              className="text-xs text-gold font-medium hover:underline cursor-pointer whitespace-nowrap"
            >
              Present
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function Recommendations({ getValues }: { getValues: () => CVData }) {
  const data = getValues();
  const tips: string[] = [];

  if (!data.contactInfo.fullName) tips.push("Add your full name to the contact section.");
  if (!data.contactInfo.email) tips.push("Include an email address so employers can reach you.");
  if (!data.contactInfo.phone) tips.push("Add a phone number for direct contact.");
  if (!data.contactInfo.tagline) tips.push("Add a tagline (e.g. \"Data Analyst | IT Support\") to frame your profile.");
  if (!data.professionalSummary || data.professionalSummary.split(/\s+/).length < 15) {
    tips.push("Write a professional summary of 4-6 sentences highlighting your key qualifications.");
  }
  if (data.skillCategories.length === 0) tips.push("Add at least one skill category with relevant tools and competencies.");
  if (data.workExperience.length === 0) tips.push("Add your work experience — even internships count.");
  if (data.workExperience.some((e) => !e.responsibilities)) {
    tips.push("Add responsibilities and achievements for each role. Start bullets with action verbs.");
  }
  if (data.workExperience.some((e) => !e.startDate || !e.endDate)) {
    tips.push("Set start and end dates for all positions to improve ATS compatibility.");
  }
  if (data.education.length === 0) tips.push("Add your educational background.");
  if (!data.languages) tips.push("List your language proficiencies (e.g. \"English — Proficient | Swahili — Native\").");

  if (tips.length === 0) return null;

  return (
    <div className="bg-gold-light/50 border border-gold/20 rounded-2xl p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-4">
        <AlertCircle className="w-5 h-5 text-gold shrink-0" />
        <h3 className="font-sans text-base font-bold text-navy">Recommended Changes</h3>
      </div>
      <ul className="space-y-2">
        {tips.map((tip) => (
          <li key={tip} className="flex items-start gap-2 text-sm text-dark-text">
            <span className="text-gold mt-0.5">•</span>
            {tip}
          </li>
        ))}
      </ul>
    </div>
  );
}

function RemoveBtn({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="text-red-400 hover:text-red-600 transition-colors cursor-pointer">
      <Trash2 className="w-4 h-4" />
    </button>
  );
}

function AiButton({ label, loading, onClick }: { label: string; loading: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="inline-flex items-center gap-2 mt-3 px-4 py-2 text-xs font-semibold text-gold bg-gold-light hover:bg-gold hover:text-navy rounded-full transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <Sparkles className="w-3.5 h-3.5" />
      )}
      {loading ? "Enhancing..." : label}
    </button>
  );
}

function EmptyState({ text }: { text: string }) {
  return <p className="text-body-text text-sm text-center py-4">{text}</p>;
}
