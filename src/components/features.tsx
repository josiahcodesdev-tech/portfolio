import {
  GraduationCap,
  Target,
  Users,
  Clock,
  Monitor,
} from "lucide-react";

const features = [
  { icon: GraduationCap, label: "Industry-Level Expertise" },
  { icon: Target, label: "Results-Driven Approach" },
  { icon: Users, label: "Personalized Service" },
  { icon: Clock, label: "Fast Turnaround" },
  { icon: Monitor, label: "Online & Flexible" },
];

export function Features() {
  return (
    <section className="bg-white py-8 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.label}
                className="flex items-center gap-2.5 text-sm"
              >
                <div className="w-9 h-9 rounded-full bg-gold-light flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-gold" />
                </div>
                <span className="font-medium text-dark-text whitespace-nowrap">
                  {feature.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
