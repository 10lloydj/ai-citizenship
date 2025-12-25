"use client";

import { ArrowRight, Bell, Clock } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { WaitlistModal } from "./waitlist-modal";

type Country = {
  code: string;
  name: string;
  flag: string;
  subtitle: string;
  active: boolean;
  link?: string;
};

const countries: Country[] = [
  {
    code: "jm",
    name: "Jamaica",
    flag: "🇯🇲",
    subtitle:
      "Visa-free access to 80+ countries. The right to live, work, and own property in the Caribbean.",
    active: true,
    link: "/check?country=jm",
  },
  {
    code: "it",
    name: "Italy",
    flag: "🇮🇹",
    subtitle: "EU citizenship. Live anywhere in Europe. Pass it down forever.",
    active: false,
  },
  {
    code: "pl",
    name: "Poland",
    flag: "🇵🇱",
    subtitle: "EU passport. Deep roots. A growing economy.",
    active: false,
  },
];

export const CountrySection = () => {
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<{
    name: string;
    flag: string;
  } | null>(null);

  const handleWaitlistClick = (country: { name: string; flag: string }) => {
    setSelectedCountry(country);
    setWaitlistOpen(true);
  };

  return (
    <section className="py-24 md:py-32" id="countries">
      <div className="container px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 font-bold text-3xl text-foreground md:text-5xl">
            Choose Your Country
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Select from our supported countries to check your eligibility
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
          {countries.map((country, index) => (
            <div
              className={`relative overflow-hidden rounded-2xl border-2 transition-all duration-300 ${
                country.active
                  ? "hover:-translate-y-2 border-primary/20 bg-card shadow-card hover:border-primary/40 hover:shadow-lg"
                  : "border-border/50 bg-muted/50 hover:border-border hover:bg-muted/70"
              }`}
              key={country.code}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Coming Soon Badge */}
              {!country.active && (
                <div className="absolute top-4 right-4 z-10">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 font-medium text-muted-foreground text-xs">
                    <Clock className="h-3 w-3" />
                    Coming Soon
                  </span>
                </div>
              )}

              {/* Active indicator */}
              {country.active && (
                <div className="absolute top-4 right-4 z-10">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 font-medium text-primary text-xs">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                    Available Now
                  </span>
                </div>
              )}

              <div className="p-8">
                {/* Flag */}
                <div className="mb-6 text-6xl">{country.flag}</div>

                {/* Country Name */}
                <h3 className="mb-3 font-bold text-2xl text-foreground">
                  {country.name}
                </h3>

                {/* Subtitle */}
                <p
                  className={`mb-6 text-sm leading-relaxed ${
                    country.active
                      ? "text-muted-foreground"
                      : "text-muted-foreground/70"
                  }`}
                >
                  {country.subtitle}
                </p>

                {/* CTA */}
                {country.active && country.link ? (
                  <Button asChild className="group w-full" variant="default">
                    <Link href={country.link}>
                      Am I Eligible?
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                ) : (
                  <Button
                    className="group w-full"
                    onClick={() =>
                      handleWaitlistClick({
                        name: country.name,
                        flag: country.flag,
                      })
                    }
                    type="button"
                    variant="outline"
                  >
                    <Bell className="mr-2 h-4 w-4" />
                    Notify Me
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <WaitlistModal
        country={selectedCountry}
        onOpenChange={setWaitlistOpen}
        open={waitlistOpen}
      />
    </section>
  );
};
