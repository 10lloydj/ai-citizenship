"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const HeroSection = () => {
  return (
    <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-gradient-hero opacity-[0.03]" />
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23166534' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Floating decorative elements */}
      <div className="absolute top-20 right-[15%] h-24 w-24 animate-float rounded-full bg-secondary/20 blur-3xl" />
      <div className="absolute bottom-32 left-[10%] h-32 w-32 animate-float rounded-full bg-primary/10 blur-3xl delay-300" />

      <div className="container relative z-10 px-4 py-20 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex animate-fade-in-up items-center gap-2 rounded-full bg-muted/80 px-4 py-2 opacity-0 backdrop-blur-sm">
            <span className="h-2 w-2 animate-pulse rounded-full bg-secondary" />
            <span className="font-medium text-muted-foreground text-sm">
              Citizenship by Descent Made Simple
            </span>
          </div>

          {/* Headline */}
          <h1 className="mb-6 animate-fade-in-up font-bold text-4xl text-foreground leading-tight opacity-0 delay-100 md:text-6xl lg:text-7xl">
            Your Heritage Is{" "}
            <span className="text-gradient">Your Passport</span>
          </h1>

          {/* Subheadline */}
          <p className="mx-auto mb-10 max-w-2xl animate-fade-in-up text-lg text-muted-foreground leading-relaxed opacity-0 delay-200 md:text-xl">
            Discover if you qualify for citizenship by descent—and unlock
            visa-free travel, property rights, and a lifelong connection to your
            ancestral home.
          </p>

          {/* CTA Buttons */}
          <div className="flex animate-fade-in-up flex-col items-center justify-center gap-4 opacity-0 delay-300 sm:flex-row">
            <Button asChild size="lg" variant="hero">
              <Link href="#countries">
                Discover Your Eligibility
                <ArrowRight className="ml-2" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="#how-it-works">Learn How It Works</a>
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 flex animate-fade-in-up flex-wrap justify-center gap-6 border-border/50 border-t pt-8 opacity-0 delay-400">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <span className="text-secondary">✓</span> 100% Free
            </div>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <span className="text-secondary">✓</span> No Account Required
            </div>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <span className="text-secondary">✓</span> Results in Minutes
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
