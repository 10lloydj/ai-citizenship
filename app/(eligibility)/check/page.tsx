"use client";

import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Suspense, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { ProgressBar } from "@/components/eligibility/progress-bar";
import { QuestionCard } from "@/components/eligibility/question-card";
import { ResultCard } from "@/components/eligibility/result-card";
import { WizardHeader } from "@/components/eligibility/wizard-header";
import { WizardNav } from "@/components/eligibility/wizard-nav";
import {
  getCountry,
  getCountryRules,
  isCountryActive,
} from "@/lib/eligibility/countries";
import {
  advanceWizard,
  createWizardState,
  getCurrentQuestion,
  getProgress,
  goBackInWizard,
  restartWizard,
} from "@/lib/eligibility/evaluate";
import type { WizardState } from "@/lib/eligibility/types";

function WizardContent() {
  const searchParams = useSearchParams();
  const countryCode = searchParams.get("country") ?? "";
  const { data: session } = useSession();

  const [wizardState, setWizardState] = useState<WizardState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get country info
  const country = getCountry(countryCode);
  const rules = getCountryRules(countryCode);

  // Initialize wizard when country code is available
  useEffect(() => {
    if (countryCode && rules) {
      try {
        const initialState = createWizardState(rules);
        setWizardState(initialState);
        setError(null);
      } catch (err) {
        setError("Failed to initialize eligibility checker");
        console.error(err);
      }
    }
  }, [countryCode, rules]);

  // Handle answer submission
  const handleAnswer = useCallback(
    (value: string) => {
      if (!wizardState || !rules) {
        return;
      }

      setIsLoading(true);

      // Small delay for UX
      setTimeout(() => {
        const newState = advanceWizard(
          rules,
          wizardState,
          wizardState.currentQuestionId,
          value
        );
        setWizardState(newState);
        setIsLoading(false);
      }, 300);
    },
    [wizardState, rules]
  );

  // Handle back navigation
  const handleBack = useCallback(() => {
    if (!wizardState || !rules) {
      return;
    }

    const newState = goBackInWizard(rules, wizardState);
    setWizardState(newState);
  }, [wizardState, rules]);

  // Handle restart
  const handleRestart = useCallback(() => {
    if (!rules) {
      return;
    }

    setWizardState(restartWizard(rules));
    setIsSaved(false);
  }, [rules]);

  // Handle save
  const handleSave = useCallback(async () => {
    if (!wizardState?.result || !rules) {
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch("/api/eligibility/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          countryCode,
          rulesVersion: rules.version,
          answers: wizardState.answers,
          result: wizardState.result,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save");
      }

      setIsSaved(true);
      toast.success("Results saved!", {
        description: "You can view your eligibility history anytime.",
      });
    } catch (err) {
      console.error("Failed to save:", err);
      toast.error("Failed to save results", {
        description: "Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  }, [wizardState, rules, countryCode]);

  // Invalid country handling
  if (!countryCode) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-8 text-center">
        <div className="mb-6 text-6xl">🌍</div>
        <h1 className="mb-4 font-bold text-2xl text-foreground">
          Select a Country
        </h1>
        <p className="mb-8 max-w-md text-muted-foreground">
          Please select a country from the homepage to begin your eligibility
          check.
        </p>
        <a
          className="rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground hover:bg-primary/90"
          href="/"
        >
          Go to Homepage
        </a>
      </div>
    );
  }

  if (!isCountryActive(countryCode) || !country) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-8 text-center">
        <div className="mb-6 text-6xl">🚧</div>
        <h1 className="mb-4 font-bold text-2xl text-foreground">
          Country Not Available
        </h1>
        <p className="mb-8 max-w-md text-muted-foreground">
          Eligibility checking for this country is not yet available. Check back
          soon!
        </p>
        <a
          className="rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground hover:bg-primary/90"
          href="/"
        >
          Go to Homepage
        </a>
      </div>
    );
  }

  if (error || !rules) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-8 text-center">
        <div className="mb-6 text-6xl">⚠️</div>
        <h1 className="mb-4 font-bold text-2xl text-foreground">
          Something went wrong
        </h1>
        <p className="mb-8 max-w-md text-muted-foreground">
          {error ?? "Failed to load eligibility rules. Please try again."}
        </p>
        <button
          className="rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground hover:bg-primary/90"
          onClick={() => window.location.reload()}
          type="button"
        >
          Reload Page
        </button>
      </div>
    );
  }

  if (!wizardState) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const currentQuestion = getCurrentQuestion(rules, wizardState);
  const progress = getProgress(rules, wizardState);

  // Show result if complete
  if (wizardState.isComplete && wizardState.result) {
    return (
      <div className="container px-4 py-12">
        <ResultCard
          countryFlag={country.flag}
          countryName={country.name}
          isAuthenticated={session?.user?.type === "regular"}
          isSaved={isSaved}
          isSaving={isSaving}
          onRestart={handleRestart}
          onSave={handleSave}
          result={wizardState.result}
        />
      </div>
    );
  }

  // Show question
  return (
    <div className="container space-y-8 px-4 py-12">
      <WizardHeader countryFlag={country.flag} countryName={country.name} />

      <ProgressBar
        currentQuestion={wizardState.questionHistory.length}
        progress={progress}
        totalQuestions={rules.questions.length}
      />

      <WizardNav
        canGoBack={wizardState.questionHistory.length > 1}
        onBack={handleBack}
        onRestart={handleRestart}
      />

      {currentQuestion && (
        <QuestionCard
          isLoading={isLoading}
          onAnswer={handleAnswer}
          question={currentQuestion}
        />
      )}
    </div>
  );
}

export default function WizardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      }
    >
      <WizardContent />
    </Suspense>
  );
}
