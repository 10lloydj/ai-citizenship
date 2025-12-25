import { BookOpen, Cpu, DollarSign, Lock } from "lucide-react";

const badges = [
  {
    icon: DollarSign,
    title: "100% Free",
    description: "No hidden costs",
  },
  {
    icon: Lock,
    title: "Private & Secure",
    description: "Your data stays yours",
  },
  {
    icon: BookOpen,
    title: "Expert-Researched",
    description: "Verified against official sources",
  },
  {
    icon: Cpu,
    title: "No AI Guesswork",
    description: "Deterministic rules, not predictions",
  },
];

export const TrustSection = () => {
  return (
    <section className="border-border/50 border-y bg-muted/20 py-16">
      <div className="container px-4">
        <div className="flex flex-wrap justify-center gap-8 md:gap-16">
          {badges.map((badge) => (
            <div
              className="flex items-center gap-3 text-center md:text-left"
              key={badge.title}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/5 text-primary">
                <badge.icon className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground text-sm">
                  {badge.title}
                </h4>
                <p className="text-muted-foreground text-xs">
                  {badge.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
