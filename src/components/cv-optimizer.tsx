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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, control, getValues, reset, watch } = useForm<CVData>({
    defaultValues: {
      contactInfo: { fullName: "", tagline: "", email: "", phone: "", location: "", linkedin: "" },
      professionalSummary: "",
      skillCategories: [],
      workExperience: [],
      projects: [],
      education: [],
      certifications: [],
      languages: "",
      references: "",
    },
  });

  const { fields: expFields, append: appendExp, remove: removeExp } = useFieldArray({ control, name: "workExperience" });
  const { fields: eduFields, append: appendEdu, remove: removeEdu } = useFieldArray({ control, name: "education" });
  const { fields: skillFields, append: appendSkill, remove: removeSkill } = useFieldArray({ control, name: "skillCategories" });
  const { fields: projFields, append: appendProj, remove: removeProj } = useFieldArray({ control, name: "projects" });
  const { fields: certFields, append: appendCert, remove: removeCert } = useFieldArray({ control, name: "certifications" });

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
      references: "",
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
      references: "",
    });
    setStep(1);
  }, [reset]);

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
              <Field label="Tagline" reg={register("contactInfo.tagline")} placeholder="Data Analyst | IT Support | BI" />
              <Field label="Email" reg={register("contactInfo.email")} placeholder="josiah@example.com" />
              <Field label="Phone" reg={register("contactInfo.phone")} placeholder="+254 796 429 778" />
              <Field label="Location" reg={register("contactInfo.location")} placeholder="Nairobi, Kenya" />
              <Field label="LinkedIn" reg={register("contactInfo.linkedin")} placeholder="linkedin.com/in/yourprofile" />
            </div>
          </Section>

          {/* Professional Summary */}
          <Section title="Professional Summary">
            <Textarea
              {...register("professionalSummary")}
              placeholder="4-6 sentences summarising your professional background, key tools, and career goal..."
              className="bg-white border-gray-200 text-dark-text placeholder:text-gray-400 focus:border-gold rounded-xl min-h-[120px]"
            />
          </Section>

          {/* Core Skills (categorized) */}
          <Section
            title="Core Skills"
            onAdd={() => appendSkill({ id: uid(), category: "", items: "" })}
          >
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
                    <Field label="Start Date" reg={register(`workExperience.${i}.startDate`)} placeholder="May 2025" />
                    <Field label="End Date" reg={register(`workExperience.${i}.endDate`)} placeholder="Present" />
                  </div>
                </div>
                <div className="mt-4">
                  <label className={labelClass}>Responsibilities & Achievements (one per line)</label>
                  <Textarea
                    {...register(`workExperience.${i}.responsibilities`)}
                    placeholder={"Managed CRM systems ensuring accurate data entry\nCreated performance tracking sheets in Excel"}
                    className="bg-white border-gray-200 text-dark-text placeholder:text-gray-400 focus:border-gold rounded-xl min-h-[100px]"
                  />
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
                  <label className={labelClass}>Details (one per line)</label>
                  <Textarea
                    {...register(`projects.${i}.details`)}
                    placeholder="Cleaned and transformed customer sales data using Power Query"
                    className="bg-white border-gray-200 text-dark-text placeholder:text-gray-400 focus:border-gold rounded-xl min-h-[80px]"
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
                  <Field label="Graduation Date" reg={register(`education.${i}.graduationDate`)} placeholder="Oct 2025" />
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

          {/* References */}
          <Section title="References">
            <Textarea
              {...register("references")}
              placeholder={"Francis Murimi — ICT Administrator, Muriranjas Sub-County Hospital\nfmurimi2000@gmail.com | +254 742 597 479"}
              className="bg-white border-gray-200 text-dark-text placeholder:text-gray-400 focus:border-gold rounded-xl min-h-[80px]"
            />
          </Section>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4">
            <Button type="button" variant="outline" onClick={startOver} className="border-2 border-navy text-navy hover:bg-navy hover:text-white font-semibold rounded-full px-6 py-5 text-sm cursor-pointer transition-all">
              <ArrowLeft className="w-4 h-4 mr-2" /> Start Over
            </Button>
            <Button type="button" onClick={runATSAnalysis} className="bg-gold text-navy font-bold hover:bg-gold-hover rounded-full px-6 py-5 text-sm cursor-pointer transition-all">
              Analyse CV <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
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

function RemoveBtn({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="text-red-400 hover:text-red-600 transition-colors cursor-pointer">
      <Trash2 className="w-4 h-4" />
    </button>
  );
}

function EmptyState({ text }: { text: string }) {
  return <p className="text-body-text text-sm text-center py-4">{text}</p>;
}
