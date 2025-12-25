import { Gift, Globe, Home, Shield } from "lucide-react";

const benefits = [
  {
    icon: Globe,
    title: "Freedom",
    description:
      "Visa-free travel to 80+ countries. Live, work, and invest without restrictions.",
    emoji: "🌍",
  },
  {
    icon: Home,
    title: "Belonging",
    description:
      "Legal right to live in your ancestral homeland. Return not as a tourist, but as a citizen.",
    emoji: "🏠",
  },
  {
    icon: Shield,
    title: "Security",
    description:
      "A second passport is a hedge against uncertainty—political, economic, and personal.",
    emoji: "🔐",
  },
  {
    icon: Gift,
    title: "Legacy",
    description:
      "Pass down more than stories. Pass citizenship to your children and grandchildren.",
    emoji: "🎁",
  },
];

export const BenefitsSection = () => {
  return (
    <section className="bg-muted/30 py-24 md:py-32">
      <div className="container px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 font-bold text-3xl text-foreground md:text-5xl">
            More Than a Document
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Citizenship by descent opens doors that money can&apos;t buy
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, index) => (
            <div
              className="group hover:-translate-y-1 relative rounded-2xl border border-border/50 bg-card p-8 shadow-soft transition-all duration-300 hover:shadow-card"
              key={benefit.title}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Decorative corner */}
              <div className="absolute top-0 right-0 h-20 w-20 rounded-tr-2xl rounded-bl-[4rem] bg-gradient-gold opacity-5" />

              {/* Icon */}
              <div className="mb-6">
                <span className="text-4xl">{benefit.emoji}</span>
              </div>

              {/* Content */}
              <h3 className="mb-3 font-semibold text-foreground text-xl">
                {benefit.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
