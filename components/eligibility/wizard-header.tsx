"use client";

type WizardHeaderProps = {
  countryName: string;
  countryFlag: string;
};

export function WizardHeader({ countryName, countryFlag }: WizardHeaderProps) {
  return (
    <div className="mx-auto w-full max-w-2xl text-center">
      <div className="mb-2 text-5xl">{countryFlag}</div>
      <h1 className="font-bold text-2xl text-foreground">
        {countryName} Citizenship Eligibility
      </h1>
      <p className="mt-2 text-muted-foreground">
        Answer a few questions to check if you qualify for citizenship by
        descent
      </p>
    </div>
  );
}
