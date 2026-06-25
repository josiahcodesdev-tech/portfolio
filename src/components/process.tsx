import { MessageSquare, ClipboardList, Rocket } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: MessageSquare,
    title: "Book a Free Consultation",
    description:
      "Reach out to discuss your needs. We will understand your goals, timeline, and requirements through an initial conversation.",
  },
  {
    number: "02",
    icon: ClipboardList,
    title: "Get a Personalised Plan",
    description:
      "Receive a tailored proposal with clear deliverables, timelines, and pricing. Every plan is custom-built for your unique situation.",
  },
  {
    number: "03",
    icon: Rocket,
    title: "Start Your Success Journey",
    description:
      "We execute the plan with precision and keep you updated at every stage. Your satisfaction and results are our top priority.",
  },
];

export function Process() {
  return (
    <section className="py-20 lg:py-28 bg-light-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-gold font-medium text-sm tracking-widest uppercase mb-3">
            How It Works
          </p>
          <h2 className="font-sans text-3xl sm:text-4xl font-bold text-navy">
            Simple, Structured Support
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow text-center"
              >
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-10 h-10 bg-gold rounded-full flex items-center justify-center text-navy font-bold text-sm shadow-md">
                  {step.number}
                </div>
                <div className="w-16 h-16 bg-gold-light rounded-2xl flex items-center justify-center mx-auto mt-4 mb-5">
                  <Icon className="w-7 h-7 text-gold" />
                </div>
                <h3 className="text-lg font-bold text-navy mb-3">
                  {step.title}
                </h3>
                <p className="text-body-text text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
