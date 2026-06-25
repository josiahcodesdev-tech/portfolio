import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";

const credentials = [
  "Responsive Web Design & Development",
  "Professional Proposal & Grant Writing",
  "ATS-Optimized CV & Cover Letters",
  "Accurate & Efficient Data Entry",
  "Job-Specific CV Tailoring",
  "Brand Identity & Graphic Design",
];

const skills = [
  "Web Design",
  "Proposal Writing",
  "Grant Writing",
  "CV Crafting",
  "Data Entry",
  "Job Matching",
  "Graphic Design",
  "UI/UX Design",
  "Project Management",
  "SEO Optimization",
];

export function About() {
  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="aspect-[4/5] bg-white rounded-3xl shadow-lg flex items-center justify-center overflow-hidden">
              <div className="text-center text-muted-foreground">
                <div className="w-32 h-32 bg-light-gray rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-4xl text-navy/30 font-sans font-bold">
                    JM
                  </span>
                </div>
                <span className="text-sm">Professional Photo</span>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 bg-gold rounded-2xl p-5 shadow-lg hidden sm:block">
              <p className="text-navy font-bold text-2xl">5+</p>
              <p className="text-navy/80 text-xs font-medium">
                Years Experience
              </p>
            </div>
          </div>

          <div>
            <p className="text-gold font-medium text-sm tracking-widest uppercase mb-3">
              About Me
            </p>
            <h2 className="font-sans text-3xl sm:text-4xl font-bold text-navy mb-6">
              Learn From Experience
            </h2>
            <p className="text-body-text leading-relaxed mb-4">
              I am a dedicated professional consultant with a passion for
              empowering businesses, job seekers, and organizations to reach
              their full potential. With years of experience across multiple
              domains, I bring a strategic and detail-oriented approach to every
              project.
            </p>
            <p className="text-body-text leading-relaxed mb-8">
              My mission is to deliver high-quality, tailored solutions — from
              building stunning websites and crafting compelling proposals to
              designing impactful brand materials and optimizing career
              documents.
            </p>

            <div className="space-y-3 mb-8">
              {credentials.map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-gold shrink-0" />
                  <span className="text-dark-text text-sm font-medium">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge
                  key={skill}
                  className="bg-gold-light text-gold border-0 hover:bg-gold hover:text-navy px-4 py-1.5 text-xs font-medium rounded-full transition-colors"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
