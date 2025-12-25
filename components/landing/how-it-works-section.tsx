import { CheckCircle, MapPin, MessageCircle } from "lucide-react";

const steps = [
  {
    icon: MapPin,
    number: "01",
    title: "Select Your Country",
    description: "Choose from our supported countries",
  },
  {
    icon: MessageCircle,
    number: "02",
    title: "Answer Simple Questions",
    description: "Quick yes/no questions about your family history",
  },
  {
    icon: CheckCircle,
    number: "03",
    title: "Get Your Results",
    description:
      "See your eligibility status, required documents, and next steps",
  },
];

export const HowItWorksSection = () => {
  return (
    <section
      className="bg-primary py-24 text-primary-foreground md:py-32"
      id="how-it-works"
    >
      <div className="container px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 font-bold text-3xl md:text-5xl">
            Three Steps to Clarity
          </h2>
          <p className="mx-auto max-w-2xl text-lg opacity-80">
            Our simple process takes just minutes, not months
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div className="relative text-center" key={step.number}>
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="absolute top-12 left-[60%] hidden h-px w-[80%] bg-primary-foreground/20 md:block" />
              )}

              {/* Step circle */}
              <div className="relative mb-6 inline-flex h-24 w-24 items-center justify-center rounded-full border border-primary-foreground/20 bg-primary-foreground/10">
                <step.icon className="h-10 w-10" />
                <span className="-top-2 -right-2 absolute flex h-8 w-8 items-center justify-center rounded-full bg-secondary font-bold text-secondary-foreground text-sm">
                  {step.number.slice(-1)}
                </span>
              </div>

              {/* Content */}
              <h3 className="mb-3 font-semibold text-xl">{step.title}</h3>
              <p className="mx-auto max-w-xs text-primary-foreground/70">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
