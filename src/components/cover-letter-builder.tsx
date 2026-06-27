"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import {
  FileText,
  ArrowLeft,
  ArrowRight,
  FileDown,
  Download,
  RotateCcw,
  Sparkles,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RichEditor } from "@/components/rich-editor";
import { AiFieldAssist } from "@/components/ai-field-assist";

interface CoverLetterData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  recipientName: string;
  recipientTitle: string;
  companyName: string;
  companyAddress: string;
  jobTitle: string;
  jobDescription: string;
  qualifications: string;
  relevantExperience: string;
  whyThisCompany: string;
}

const STEPS = ["Your Details", "Job & Company", "Qualifications", "Generate & Edit"] as const;
const inputClass =
  "bg-white border-gray-200 text-dark-text placeholder:text-gray-400 focus:border-gold h-12 rounded-xl w-full";
const labelClass = "block text-sm font-semibold text-navy mb-2";

export function CoverLetterBuilder() {
  const [step, setStep] = useState(0);
  const [generatedLetter, setGeneratedLetter] = useState("");

  const { register, getValues, reset, watch, setValue } = useForm<CoverLetterData>({
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      recipientName: "",
      recipientTitle: "",
      companyName: "",
      companyAddress: "",
      jobTitle: "",
      jobDescription: "",
      qualifications: "",
      relevantExperience: "",
      whyThisCompany: "",
    },
  });

  const [isGenerating, setIsGenerating] = useState(false);

  const generateLetter = useCallback(async () => {
    setIsGenerating(true);
    const d = getValues();

    try {
      // Try AI generation first
      const res = await fetch("/api/ai/generate-cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(d),
      });
      const json = await res.json();
      if (json.result && !json.error) {
        setGeneratedLetter(json.result);
        setStep(3);
        setIsGenerating(false);
        return;
      }
    } catch {
      // AI unavailable — fall back to template
    }

    // Template fallback
    const today = new Date().toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const recipient = d.recipientName
      ? `${d.recipientName}${d.recipientTitle ? `, ${d.recipientTitle}` : ""}`
      : "The Hiring Team";

    const techPatterns = /\b(excel|sql|spss|power bi|python|java|react|node|aws|docker|agile|scrum|sap|crm|erp|hmis|m&e|data analysis|project management|budgeting|reporting|stakeholder|compliance|governance)\b/gi;
    const matches = d.jobDescription.match(techPatterns);
    const keyTerms = matches ? [...new Set(matches.map((m) => m.toLowerCase()))].slice(0, 8) : [];

    const qualLines = d.qualifications.split("\n").map((l) => l.trim()).filter(Boolean);
    const expLines = d.relevantExperience.split("\n").map((l) => l.trim()).filter(Boolean);

    let letter = `<p>${today}</p>`;
    letter += `<p>${recipient}<br>${d.companyName}${d.companyAddress ? `<br>${d.companyAddress}` : ""}</p>`;
    letter += `<p><b>RE: Application for ${d.jobTitle} at ${d.companyName}</b></p>`;
    letter += `<p>Dear ${d.recipientName || "Hiring Manager"},</p>`;
    letter += `<p>I am writing to express my strong interest in the <b>${d.jobTitle}</b> position at <b>${d.companyName}</b>. `;
    if (d.whyThisCompany) letter += `${d.whyThisCompany} `;
    letter += `I am confident that my qualifications and experience make me an excellent fit for this role.</p>`;
    if (qualLines.length) {
      letter += `<p>I bring the following qualifications:</p><ul>${qualLines.map((q) => `<li>${q}</li>`).join("")}</ul>`;
    }
    if (expLines.length) {
      letter += `<p>In my professional experience:</p><ul>${expLines.map((e) => `<li>${e}</li>`).join("")}</ul>`;
    }
    if (keyTerms.length) {
      letter += `<p>My skill set includes proficiency in <b>${keyTerms.join(", ")}</b>, which are central to success in this role.</p>`;
    }
    letter += `<p>I would welcome the opportunity to discuss how my background aligns with your team's goals. I am available at <b>${d.email}</b>${d.phone ? ` or <b>${d.phone}</b>` : ""}.</p>`;
    letter += `<p>Thank you for considering my application.</p>`;
    letter += `<p>Yours sincerely,<br><b>${d.fullName}</b>${d.location ? `<br>${d.location}` : ""}</p>`;

    setGeneratedLetter(letter);
    setStep(3);
    setIsGenerating(false);
  }, [getValues]);

  const handleExportPdf = useCallback(async () => {
    const { exportCoverLetterToPdf } = await import("@/lib/cover-letter-export");
    await exportCoverLetterToPdf(generatedLetter, getValues());
  }, [generatedLetter, getValues]);

  const handleExportDocx = useCallback(async () => {
    const { exportCoverLetterToDocx } = await import("@/lib/cover-letter-export");
    await exportCoverLetterToDocx(generatedLetter, getValues());
  }, [generatedLetter, getValues]);

  const startOver = useCallback(() => {
    reset();
    setGeneratedLetter("");
    setStep(0);
  }, [reset]);

  const data = watch();

  // Validation checks per step
  const canProceed = (s: number): boolean => {
    if (s === 0) return !!(data.fullName && data.email);
    if (s === 1) return !!(data.jobTitle && data.companyName && data.jobDescription);
    if (s === 2) return !!(data.qualifications || data.relevantExperience);
    return true;
  };

  const missingFields = (s: number): string[] => {
    const missing: string[] = [];
    if (s === 0) {
      if (!data.fullName) missing.push("Full name");
      if (!data.email) missing.push("Email address");
    }
    if (s === 1) {
      if (!data.jobTitle) missing.push("Job title");
      if (!data.companyName) missing.push("Company name");
      if (!data.jobDescription) missing.push("Job description");
    }
    if (s === 2) {
      if (!data.qualifications && !data.relevantExperience)
        missing.push("At least one qualification or experience highlight");
    }
    return missing;
  };

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
              i === step
                ? "bg-gold text-navy"
                : i < step
                  ? "bg-gold-light text-gold"
                  : "bg-light-gray text-body-text"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ═══ Step 0: Your Details ═══ */}
      {step === 0 && (
        <div className="space-y-8">
          <SectionCard title="Your Contact Information">
            <div className="grid sm:grid-cols-2 gap-5">
              <FormField label="Full Name *" reg={register("fullName")} placeholder="Josiah Kamau Mwangi" />
              <FormField label="Email *" reg={register("email")} placeholder="josiah@example.com" />
              <FormField label="Phone" reg={register("phone")} placeholder="+254 796 429 778" />
              <FormField label="Location" reg={register("location")} placeholder="Nairobi, Kenya" />
              <div className="sm:col-span-2">
                <FormField label="LinkedIn" reg={register("linkedin")} placeholder="linkedin.com/in/yourprofile" />
              </div>
            </div>
          </SectionCard>
          <StepNav step={step} setStep={setStep} canProceed={canProceed(0)} missing={missingFields(0)} />
        </div>
      )}

      {/* ═══ Step 1: Job & Company ═══ */}
      {step === 1 && (
        <div className="space-y-8">
          <SectionCard title="Job Details">
            <div className="grid sm:grid-cols-2 gap-5">
              <FormField label="Job Title *" reg={register("jobTitle")} placeholder="Data Analyst" />
              <FormField label="Company Name *" reg={register("companyName")} placeholder="Acme Corp" />
              <FormField label="Recipient Name" reg={register("recipientName")} placeholder="Jane Smith (leave blank if unknown)" />
              <FormField label="Recipient Title" reg={register("recipientTitle")} placeholder="HR Manager" />
              <div className="sm:col-span-2">
                <FormField label="Company Address" reg={register("companyAddress")} placeholder="123 Business Ave, Nairobi" />
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Job Description *">
            <Textarea
              {...register("jobDescription")}
              placeholder="Paste the full job description here. The system will extract key requirements and keywords to tailor your cover letter..."
              className="bg-white border-gray-200 text-dark-text placeholder:text-gray-400 focus:border-gold rounded-xl min-h-[180px]"
            />
            <p className="text-body-text text-xs mt-2">
              Paste the complete JD — responsibilities, requirements, and qualifications. More detail = better tailoring.
            </p>
          </SectionCard>

          <StepNav step={step} setStep={setStep} canProceed={canProceed(1)} missing={missingFields(1)} />
        </div>
      )}

      {/* ═══ Step 2: Qualifications ═══ */}
      {step === 2 && (
        <div className="space-y-8">
          <SectionCard title="Your Qualifications">
            <label className={labelClass}>
              Key qualifications relevant to this role (one per line)
            </label>
            <AiFieldAssist
              field="qualifications"
              currentValue={watch("qualifications") || ""}
              context={{ jobTitle: watch("jobTitle") || "", companyName: watch("companyName") || "" }}
              onAccept={(v) => setValue("qualifications", v)}
            >
              <Textarea
                {...register("qualifications")}
                placeholder={"Bachelor of Science in Business Information Technology\nCybersecurity Awareness Training — ICT Authority\nProficient in Excel, SQL, SPSS, Power BI"}
                className="bg-white border-gray-200 text-dark-text placeholder:text-gray-400 focus:border-gold rounded-xl min-h-[120px]"
              />
            </AiFieldAssist>
          </SectionCard>

          <SectionCard title="Relevant Experience">
            <label className={labelClass}>
              Key achievements and experience highlights (one per line)
            </label>
            <AiFieldAssist
              field="relevantExperience"
              currentValue={watch("relevantExperience") || ""}
              context={{ jobTitle: watch("jobTitle") || "", companyName: watch("companyName") || "" }}
              onAccept={(v) => setValue("relevantExperience", v)}
            >
              <Textarea
                {...register("relevantExperience")}
                placeholder={"Managed CRM systems with accurate data entry and pipeline reporting\nBuilt interactive Excel dashboards for sales analysis\nProvided IT support to 50+ hospital staff"}
                className="bg-white border-gray-200 text-dark-text placeholder:text-gray-400 focus:border-gold rounded-xl min-h-[120px]"
              />
            </AiFieldAssist>
          </SectionCard>

          <SectionCard title="Why This Company?">
            <label className={labelClass}>
              What draws you to this company? (used in the opening paragraph)
            </label>
            <AiFieldAssist
              field="whyThisCompany"
              currentValue={watch("whyThisCompany") || ""}
              context={{ jobTitle: watch("jobTitle") || "", companyName: watch("companyName") || "" }}
              onAccept={(v) => setValue("whyThisCompany", v)}
            >
              <Textarea
                {...register("whyThisCompany")}
                placeholder="I am particularly drawn to your organisation's commitment to data-driven decision-making and its impact across the region."
                className="bg-white border-gray-200 text-dark-text placeholder:text-gray-400 focus:border-gold rounded-xl min-h-[80px]"
              />
            </AiFieldAssist>
          </SectionCard>

          <div className="flex items-center justify-between pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(1)}
              className="border-2 border-navy text-navy hover:bg-navy hover:text-white font-semibold rounded-full px-6 py-5 text-sm cursor-pointer transition-all"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            <Button
              type="button"
              onClick={generateLetter}
              disabled={!canProceed(2) || isGenerating}
              className="bg-gold text-navy font-bold hover:bg-gold-hover rounded-full px-6 py-5 text-sm cursor-pointer transition-all disabled:opacity-50"
            >
              {isGenerating ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating with AI...</>
              ) : (
                <><Sparkles className="w-4 h-4 mr-2" /> Generate Cover Letter</>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* ═══ Step 3: Generated Letter (editable) ═══ */}
      {step === 3 && (
        <div className="space-y-8">
          <SectionCard title="Your Cover Letter — Edit Below">
            <RichEditor
              value={generatedLetter}
              onChange={setGeneratedLetter}
              placeholder="Your cover letter will appear here..."
              minHeight="400px"
            />
            <p className="text-body-text text-xs mt-2">
              Review and edit the letter above. Use the toolbar to format text, add bullets, or emphasise key points.
            </p>
          </SectionCard>

          {/* Download */}
          <div className="text-center py-4">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
              <Button
                type="button"
                onClick={handleExportPdf}
                className="bg-gold text-navy font-bold hover:bg-gold-hover rounded-full px-8 py-5 text-sm cursor-pointer transition-all"
              >
                <FileDown className="w-4 h-4 mr-2" /> Download PDF
              </Button>
              <Button
                type="button"
                onClick={handleExportDocx}
                className="bg-navy text-white font-bold hover:bg-navy-light rounded-full px-8 py-5 text-sm cursor-pointer transition-all"
              >
                <Download className="w-4 h-4 mr-2" /> Download Word
              </Button>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(2)}
                className="border-2 border-navy text-navy hover:bg-navy hover:text-white font-semibold rounded-full px-6 py-5 text-sm cursor-pointer transition-all"
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Edit Inputs
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={startOver}
                className="border-2 border-gray-300 text-body-text hover:bg-light-gray font-semibold rounded-full px-6 py-5 text-sm cursor-pointer transition-all"
              >
                <RotateCcw className="w-4 h-4 mr-2" /> Start Over
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Sub-components ──

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-light-gray rounded-2xl p-6 sm:p-8">
      <h3 className="font-sans text-lg font-bold text-navy mb-5">{title}</h3>
      {children}
    </div>
  );
}

function FormField({ label, reg, placeholder }: { label: string; reg: ReturnType<typeof Object>; placeholder: string }) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <Input {...reg} placeholder={placeholder} className={inputClass} />
    </div>
  );
}

function StepNav({
  step,
  setStep,
  canProceed,
  missing,
}: {
  step: number;
  setStep: (s: number) => void;
  canProceed: boolean;
  missing: string[];
}) {
  return (
    <div>
      {!canProceed && missing.length > 0 && (
        <div className="flex items-start gap-3 bg-gold-light/50 border border-gold/20 rounded-xl p-4 mb-4">
          <AlertCircle className="w-5 h-5 text-gold shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-navy">Required before continuing:</p>
            <ul className="text-body-text text-xs mt-1 space-y-0.5">
              {missing.map((m) => (
                <li key={m}>• {m}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
      <div className="flex items-center justify-between pt-2">
        {step > 0 ? (
          <Button
            type="button"
            variant="outline"
            onClick={() => setStep(step - 1)}
            className="border-2 border-navy text-navy hover:bg-navy hover:text-white font-semibold rounded-full px-6 py-5 text-sm cursor-pointer transition-all"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
        ) : (
          <div />
        )}
        <Button
          type="button"
          onClick={() => setStep(step + 1)}
          disabled={!canProceed}
          className="bg-gold text-navy font-bold hover:bg-gold-hover rounded-full px-6 py-5 text-sm cursor-pointer transition-all disabled:opacity-50"
        >
          Next <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
