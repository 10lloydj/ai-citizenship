import { Quote } from "lucide-react";

export const TestimonialSection = () => {
  return (
    <section className="py-24 md:py-32">
      <div className="container px-4">
        <div className="mx-auto max-w-3xl text-center">
          {/* Quote icon */}
          <div className="mb-8 inline-flex h-16 w-16 items-center justify-center rounded-full bg-secondary/20">
            <Quote className="h-8 w-8 text-secondary" />
          </div>

          {/* Quote */}
          <blockquote className="mb-8 text-2xl text-foreground leading-relaxed md:text-3xl">
            &ldquo;My grandmother left Jamaica in 1962. I returned as a citizen
            in 2024. Citizenship by descent let me complete a journey my
            ancestors started.&rdquo;
          </blockquote>

          {/* Attribution */}
          <div className="flex items-center justify-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-lg">
              👤
            </div>
            <div className="text-left">
              <p className="font-semibold text-foreground">Michael T.</p>
              <p className="text-muted-foreground text-sm">
                Jamaican Citizen by Descent
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
