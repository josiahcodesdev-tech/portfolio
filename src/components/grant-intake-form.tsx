"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, CheckCircle2 } from "lucide-react";

interface GrantFormData {
  companyName: string;
  yearEstablished: string;
  registrationStatus: string;
  registrationNumber: string;
  physicalAddress: string;
  contactPerson: string;
  phone: string;
  email: string;
  coreServices: string[];
  coreServicesOther: string;
  projectsCompleted: string;
  annualCapacity: string;
  geographicAreas: string;
  targetClients: string[];
  pastProjects: string;
  references: string;
  referenceNames: string;
  existingMous: string;
  mouPartners: string;
  fundingName: string;
  funderName: string;
  funderType: string;
  applicationDeadline: string;
  grantAmount: string;
  funderTemplate: string;
  appliedBefore: string;
  rfpLink: string;
  projectDescription: string;
  auditedStatements: string;
  orgProfile: string;
  designatedStaff: string;
  technicalData: string;
  registrationDocs: string;
  servicesSought: string[];
  engagementType: string;
  additionalInfo: string;
  signatoryName: string;
  declarationDate: string;
}

function CheckboxGroup({
  label,
  options,
  name,
  register,
}: {
  label: string;
  options: string[];
  name: keyof GrantFormData;
  register: ReturnType<typeof useForm<GrantFormData>>["register"];
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-navy mb-3">
        {label}
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {options.map((opt) => (
          <label
            key={opt}
            className="flex items-center gap-2 text-sm text-dark-text cursor-pointer bg-white rounded-lg px-3 py-2.5 border border-gray-200 hover:border-gold/50 transition-colors has-[:checked]:border-gold has-[:checked]:bg-gold-light"
          >
            <input
              type="checkbox"
              value={opt}
              {...register(name)}
              className="accent-[#C9972B] w-4 h-4"
            />
            {opt}
          </label>
        ))}
      </div>
    </div>
  );
}

function RadioGroup({
  label,
  options,
  name,
  register,
  required,
}: {
  label: string;
  options: string[];
  name: keyof GrantFormData;
  register: ReturnType<typeof useForm<GrantFormData>>["register"];
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-navy mb-3">
        {label}
      </label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <label
            key={opt}
            className="flex items-center gap-2 text-sm text-dark-text cursor-pointer bg-white rounded-lg px-4 py-2.5 border border-gray-200 hover:border-gold/50 transition-colors has-[:checked]:border-gold has-[:checked]:bg-gold-light"
          >
            <input
              type="radio"
              value={opt}
              {...register(name, { required })}
              className="accent-[#C9972B] w-4 h-4"
            />
            {opt}
          </label>
        ))}
      </div>
    </div>
  );
}

function FormField({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-navy mb-2">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-body-text mt-1.5">{hint}</p>}
    </div>
  );
}

const inputClass =
  "bg-white border-gray-200 text-dark-text placeholder:text-gray-400 focus:border-gold h-12 rounded-xl";

export function GrantIntakeForm() {
  const [submitted, setSubmitted] = useState(false);
  const [step, setStep] = useState(0);
  const { register, handleSubmit, reset } = useForm<GrantFormData>();

  function onSubmit() {
    setSubmitted(true);
    reset();
  }

  if (submitted) {
    return (
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="w-20 h-20 bg-gold-light rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-gold" />
          </div>
          <h2 className="font-display text-3xl font-bold text-navy mb-4">
            Form Submitted Successfully
          </h2>
          <p className="text-body-text mb-8">
            Thank you for completing the Grant Writing Client Intake Form.
            We&apos;ll review your information and get back to you within 24–48
            hours.
          </p>
          <Button
            onClick={() => setSubmitted(false)}
            className="bg-gold text-navy font-bold hover:bg-gold-hover rounded-full px-8 py-5 text-sm cursor-pointer"
          >
            Submit Another Form
          </Button>
        </div>
      </section>
    );
  }

  const sections = [
    "Organisation Profile",
    "Services & Operations",
    "Target Clients & Past Projects",
    "Funding Opportunity",
    "Capacity & Documents",
    "Scope & Declaration",
  ];

  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-gold font-medium text-sm tracking-widest uppercase mb-3">
            Client Intake
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-navy mb-4">
            Grant Writing Intake Form
          </h2>
          <p className="text-body-text max-w-2xl mx-auto">
            Please provide your details so we can prepare an appropriate
            proposal package tailored to your needs.
          </p>
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-center gap-1 mb-10 flex-wrap">
          {sections.map((s, i) => (
            <button
              key={s}
              onClick={() => setStep(i)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors cursor-pointer ${
                i === step
                  ? "bg-gold text-navy"
                  : i < step
                    ? "bg-gold-light text-gold"
                    : "bg-light-gray text-body-text"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-light-gray rounded-2xl p-8 sm:p-10">
            {/* Section 1: Organisation Profile */}
            {step === 0 && (
              <div className="space-y-6">
                <h3 className="font-display text-xl font-bold text-navy border-b border-gray-200 pb-3">
                  Section 1: Organisation Profile
                </h3>
                <div className="grid sm:grid-cols-2 gap-5">
                  <FormField label="Company / Organisation Name">
                    <Input
                      placeholder="Your organisation name"
                      className={inputClass}
                      {...register("companyName", { required: true })}
                    />
                  </FormField>
                  <FormField label="Year of Establishment">
                    <Input
                      placeholder="e.g. 2010"
                      className={inputClass}
                      {...register("yearEstablished")}
                    />
                  </FormField>
                </div>
                <RadioGroup
                  label="Legal Registration Status"
                  options={["Registered Company", "NGO / CBO", "Trust"]}
                  name="registrationStatus"
                  register={register}
                />
                <FormField label="Registration Number">
                  <Input
                    placeholder="e.g. CPR/2020/12345"
                    className={inputClass}
                    {...register("registrationNumber")}
                  />
                </FormField>
                <FormField
                  label="Physical Address / Counties of Operation"
                  hint="Include your physical address and/or the counties where you operate."
                >
                  <Input
                    placeholder="e.g. Nairobi, Kitui, Machakos"
                    className={inputClass}
                    {...register("physicalAddress")}
                  />
                </FormField>
                <div className="grid sm:grid-cols-2 gap-5">
                  <FormField label="Contact Person & Title">
                    <Input
                      placeholder="Full name and title"
                      className={inputClass}
                      {...register("contactPerson")}
                    />
                  </FormField>
                  <FormField label="Phone Number">
                    <Input
                      placeholder="+254 700 000 000"
                      className={inputClass}
                      {...register("phone")}
                    />
                  </FormField>
                </div>
                <FormField label="Email Address">
                  <Input
                    type="email"
                    placeholder="you@organisation.com"
                    className={inputClass}
                    {...register("email", { required: true })}
                  />
                </FormField>
              </div>
            )}

            {/* Section 2: Services & Operations */}
            {step === 1 && (
              <div className="space-y-6">
                <h3 className="font-display text-xl font-bold text-navy border-b border-gray-200 pb-3">
                  Section 2: Services & Operations
                </h3>
                <CheckboxGroup
                  label="Core Services Offered"
                  options={[
                    "Borehole Drilling",
                    "Pump Installation",
                    "Solarization",
                    "Water Testing",
                    "Pipe Laying",
                    "Irrigation",
                    "Maintenance",
                  ]}
                  name="coreServices"
                  register={register}
                />
                <FormField label="If Other, please specify">
                  <Input
                    placeholder="Other services..."
                    className={inputClass}
                    {...register("coreServicesOther")}
                  />
                </FormField>
                <div className="grid sm:grid-cols-2 gap-5">
                  <FormField label="Number of Projects Completed to Date">
                    <Input
                      type="number"
                      placeholder="e.g. 12"
                      className={inputClass}
                      {...register("projectsCompleted")}
                    />
                  </FormField>
                  <FormField label="Approximate Annual Project Capacity">
                    <Input
                      placeholder="Projects per year"
                      className={inputClass}
                      {...register("annualCapacity")}
                    />
                  </FormField>
                </div>
                <FormField label="Geographic Areas / Counties Where You Operate">
                  <Input
                    placeholder="e.g. Nairobi, Mombasa, Kitui"
                    className={inputClass}
                    {...register("geographicAreas")}
                  />
                </FormField>
              </div>
            )}

            {/* Section 3: Target Clients & Past Projects */}
            {step === 2 && (
              <div className="space-y-6">
                <h3 className="font-display text-xl font-bold text-navy border-b border-gray-200 pb-3">
                  Section 3: Target Clients & Past Projects
                </h3>
                <CheckboxGroup
                  label="Primary Target Clients"
                  options={[
                    "NGOs / INGOs",
                    "Donor Agencies",
                    "County Governments",
                    "National Government",
                    "Schools / Institutions",
                    "Communities",
                    "Faith-Based Orgs",
                    "Private Sector",
                  ]}
                  name="targetClients"
                  register={register}
                />
                <FormField
                  label="Notable Past Projects (up to 3)"
                  hint="Include: project name, client, location, and value (if available)."
                >
                  <Textarea
                    rows={4}
                    placeholder="1. Project name — Client — Location — Value&#10;2. ...&#10;3. ..."
                    className="bg-white border-gray-200 text-dark-text placeholder:text-gray-400 focus:border-gold rounded-xl resize-none"
                    {...register("pastProjects")}
                  />
                </FormField>
                <RadioGroup
                  label="References from Past Clients"
                  options={[
                    "Yes, available on request",
                    "Yes, to be included in proposal",
                    "No",
                  ]}
                  name="references"
                  register={register}
                />
                <FormField label="If yes, please name the references">
                  <Input
                    placeholder="Names of referees"
                    className={inputClass}
                    {...register("referenceNames")}
                  />
                </FormField>
                <RadioGroup
                  label="Existing Partnership Agreements / MoUs"
                  options={["Yes", "No", "In progress"]}
                  name="existingMous"
                  register={register}
                />
                <FormField label="If yes, please name the partners (MoUs)">
                  <Textarea
                    rows={2}
                    placeholder="Partner names..."
                    className="bg-white border-gray-200 text-dark-text placeholder:text-gray-400 focus:border-gold rounded-xl resize-none"
                    {...register("mouPartners")}
                  />
                </FormField>
              </div>
            )}

            {/* Section 4: Funding Opportunity */}
            {step === 3 && (
              <div className="space-y-6">
                <h3 className="font-display text-xl font-bold text-navy border-b border-gray-200 pb-3">
                  Section 4: The Funding Opportunity
                </h3>
                <div className="grid sm:grid-cols-2 gap-5">
                  <FormField label="Name of the Funding Opportunity / Grant">
                    <Input
                      placeholder="Grant / opportunity name"
                      className={inputClass}
                      {...register("fundingName")}
                    />
                  </FormField>
                  <FormField label="Name of the Funder / Donor">
                    <Input
                      placeholder="Funder name"
                      className={inputClass}
                      {...register("funderName")}
                    />
                  </FormField>
                </div>
                <RadioGroup
                  label="Type of Funder"
                  options={[
                    "Bilateral (e.g. USAID, EU, DFID)",
                    "Multilateral (e.g. UN, World Bank)",
                    "Private Foundation",
                    "Government (County or National)",
                    "Corporate / CSR",
                  ]}
                  name="funderType"
                  register={register}
                />
                <div className="grid sm:grid-cols-2 gap-5">
                  <FormField label="Application Deadline">
                    <Input
                      type="date"
                      className={inputClass}
                      {...register("applicationDeadline")}
                    />
                  </FormField>
                  <FormField
                    label="Approximate Grant Amount"
                    hint="Include the amount and currency if known."
                  >
                    <Input
                      placeholder="e.g. KES 2,000,000"
                      className={inputClass}
                      {...register("grantAmount")}
                    />
                  </FormField>
                </div>
                <RadioGroup
                  label="Does the Funder Require a Specific Format or Template?"
                  options={[
                    "Yes, I will provide the template",
                    "Yes, format is on funder website",
                    "No / Not sure",
                  ]}
                  name="funderTemplate"
                  register={register}
                />
                <RadioGroup
                  label="Have You Applied to This Funder Before?"
                  options={[
                    "Yes — Successful",
                    "Yes — Unsuccessful",
                    "No — First application",
                  ]}
                  name="appliedBefore"
                  register={register}
                />
                <FormField label="Link to the Call for Proposals / RFP">
                  <Input
                    placeholder="https://..."
                    className={inputClass}
                    {...register("rfpLink")}
                  />
                </FormField>
                <FormField
                  label="Brief Description of the Project You Are Proposing"
                  hint="Include the problem statement, target beneficiaries, proposed activities, and expected outcomes."
                >
                  <Textarea
                    rows={5}
                    placeholder="Describe your proposed project..."
                    className="bg-white border-gray-200 text-dark-text placeholder:text-gray-400 focus:border-gold rounded-xl resize-none"
                    {...register("projectDescription")}
                  />
                </FormField>
              </div>
            )}

            {/* Section 5: Capacity & Documents */}
            {step === 4 && (
              <div className="space-y-6">
                <h3 className="font-display text-xl font-bold text-navy border-b border-gray-200 pb-3">
                  Section 5: Organisational Capacity & Documents
                </h3>
                <RadioGroup
                  label="Audited Financial Statements"
                  options={[
                    "Yes — last 1 year",
                    "Yes — last 2–3 years",
                    "No",
                  ]}
                  name="auditedStatements"
                  register={register}
                />
                <RadioGroup
                  label="Organisational Profile / Capability Statement"
                  options={[
                    "Yes — up to date",
                    "Yes — needs updating",
                    "No — needs to be created",
                  ]}
                  name="orgProfile"
                  register={register}
                />
                <RadioGroup
                  label="Designated Staff Member for Quick Response During Proposal Development"
                  options={["Yes", "No", "Partially available"]}
                  name="designatedStaff"
                  register={register}
                />
                <RadioGroup
                  label="Technical Data Available (e.g. site surveys, hydrogeological reports)"
                  options={[
                    "Yes — all available",
                    "Partially available",
                    "No — needs to be sourced",
                  ]}
                  name="technicalData"
                  register={register}
                />
                <RadioGroup
                  label="Registration / Compliance Documents Current (e.g. certificate of incorporation, PIN, CR12)"
                  options={[
                    "Yes — all current",
                    "Some need renewal",
                    "Not sure",
                  ]}
                  name="registrationDocs"
                  register={register}
                />
              </div>
            )}

            {/* Section 6: Scope & Declaration */}
            {step === 5 && (
              <div className="space-y-6">
                <h3 className="font-display text-xl font-bold text-navy border-b border-gray-200 pb-3">
                  Section 6: Scope of Work & Declaration
                </h3>
                <CheckboxGroup
                  label="Services Sought"
                  options={[
                    "Grant Proposal Writing",
                    "Budget Development",
                    "Logframe / Results Framework",
                    "Organisational Profile",
                    "M&E Framework",
                    "Full Proposal Package",
                  ]}
                  name="servicesSought"
                  register={register}
                />
                <RadioGroup
                  label="Engagement Type"
                  options={[
                    "One-off proposal",
                    "Multiple proposals",
                    "Retainer / ongoing partnership",
                  ]}
                  name="engagementType"
                  register={register}
                />
                <FormField label="Additional Information or Special Requirements">
                  <Textarea
                    rows={4}
                    placeholder="Any additional details..."
                    className="bg-white border-gray-200 text-dark-text placeholder:text-gray-400 focus:border-gold rounded-xl resize-none"
                    {...register("additionalInfo")}
                  />
                </FormField>

                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <h4 className="font-bold text-navy mb-2">Declaration</h4>
                  <p className="text-body-text text-sm mb-5">
                    I confirm that the information provided in this form is
                    accurate and complete to the best of my knowledge.
                  </p>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <FormField label="Authorised Signatory Name">
                      <Input
                        placeholder="Full name"
                        className={inputClass}
                        {...register("signatoryName", { required: true })}
                      />
                    </FormField>
                    <FormField label="Date">
                      <Input
                        type="date"
                        className={inputClass}
                        {...register("declarationDate", { required: true })}
                      />
                    </FormField>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(Math.max(0, step - 1))}
                disabled={step === 0}
                className="border-gray-300 text-dark-text hover:bg-gray-100 rounded-full px-6 py-5 text-sm disabled:opacity-30 cursor-pointer"
              >
                Previous
              </Button>

              <span className="text-xs text-body-text">
                Step {step + 1} of {sections.length}
              </span>

              {step < sections.length - 1 ? (
                <Button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  className="bg-gold text-navy font-bold hover:bg-gold-hover rounded-full px-6 py-5 text-sm cursor-pointer"
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="bg-gold text-navy font-bold hover:bg-gold-hover rounded-full px-6 py-5 text-sm cursor-pointer"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Submit Form
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
