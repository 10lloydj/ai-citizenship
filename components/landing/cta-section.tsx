"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const CTASection = () => {
  return (
    <section className="relative overflow-hidden bg-muted/30 py-24 md:py-32">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-gradient-hero opacity-[0.02]" />
      <div className="absolute top-0 left-1/4 h-64 w-64 rounded-full bg-secondary/10 blur-3xl" />
      <div className="absolute right-1/4 bottom-0 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />

      <div className="container relative z-10 px-4">
        <div className="mx-auto max-w-3xl text-center">
          {/* Icon */}
          <div className="mb-8 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>

          {/* Headline */}
          <h2 className="mb-6 font-bold text-3xl text-foreground md:text-5xl">
            Ready to Discover What&apos;s Yours?
          </h2>

          <p className="mx-auto mb-10 max-w-xl text-lg text-muted-foreground">
            Take the first step toward unlocking your ancestral citizenship. It
            only takes a few minutes.
          </p>

          {/* CTA Button */}
          <Button asChild size="lg" variant="hero">
            <Link href="/#countries">
              Start Your Journey
              <ArrowRight className="ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
