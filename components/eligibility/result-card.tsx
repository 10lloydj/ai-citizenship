"use client";

import {
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  ExternalLink,
  FileText,
  HelpCircle,
  RotateCcw,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { EligibilityResult } from "@/lib/eligibility/types";

type ResultCardProps = {
  result: EligibilityResult;
  countryName: string;
  countryFlag: string;
  onRestart: () => void;
  onSave?: () => void;
  isSaving?: boolean;
  isSaved?: boolean;
  isAuthenticated?: boolean;
};

const statusConfig = {
  eligible: {
    icon: CheckCircle,
    bgColor: "bg-green-50 dark:bg-green-950/30",
    borderColor: "border-green-200 dark:border-green-800",
    iconColor: "text-green-600 dark:text-green-400",
    title: "Likely Eligible",
  },
  not_eligible: {
    icon: XCircle,
    bgColor: "bg-red-50 dark:bg-red-950/30",
    borderColor: "border-red-200 dark:border-red-800",
    iconColor: "text-red-600 dark:text-red-400",
    title: "Not Eligible",
  },
  needs_info: {
    icon: HelpCircle,
    bgColor: "bg-amber-50 dark:bg-amber-950/30",
    borderColor: "border-amber-200 dark:border-amber-800",
    iconColor: "text-amber-600 dark:text-amber-400",
    title: "More Information Needed",
  },
};

export function ResultCard({
  result,
  countryName,
  countryFlag,
  onRestart,
  onSave,
  isSaving = false,
  isSaved = false,
  isAuthenticated = false,
}: ResultCardProps) {
  const config = statusConfig[result.status];
  const StatusIcon = config.icon;

  return (
    <div className="mx-auto w-full max-w-3xl animate-fade-in-up space-y-6">
      {/* Status Header */}
      <div
        className={`rounded-2xl border-2 p-8 ${config.bgColor} ${config.borderColor}`}
      >
        <div className="flex items-center gap-4">
          <div
            className={`flex h-16 w-16 items-center justify-center rounded-full bg-white/80 dark:bg-black/20 ${config.iconColor}`}
          >
            <StatusIcon className="h-8 w-8" />
          </div>
          <div>
            <p className="mb-1 font-medium text-muted-foreground text-sm">
              {countryFlag} {countryName} Citizenship by Descent
            </p>
            <h2 className="font-bold text-2xl text-foreground">
              {config.title}
            </h2>
          </div>
        </div>

        <p className="mt-6 text-foreground text-lg leading-relaxed">
          {result.explanation}
        </p>

        {result.reasoning && (
          <p className="mt-4 text-muted-foreground">{result.reasoning}</p>
        )}
      </div>

      {/* Documents Required */}
      {result.documents.length > 0 && (
        <div className="rounded-2xl border border-border/50 bg-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground text-lg">
              Required Documents
            </h3>
          </div>

          <div className="space-y-4">
            {result.documents.map((doc) => (
              <div
                className="rounded-lg border border-border/50 bg-muted/30 p-4"
                key={doc.name}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-foreground">{doc.name}</p>
                    <p className="mt-1 text-muted-foreground text-sm">
                      {doc.description}
                    </p>
                    {doc.tips && (
                      <p className="mt-2 text-muted-foreground text-xs italic">
                        💡 {doc.tips}
                      </p>
                    )}
                  </div>
                  {doc.mandatory && (
                    <span className="shrink-0 rounded-full bg-primary/10 px-2 py-1 font-medium text-primary text-xs">
                      Required
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Next Steps */}
      {result.nextSteps.length > 0 && (
        <div className="rounded-2xl border border-border/50 bg-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <ArrowRight className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground text-lg">
              Next Steps
            </h3>
          </div>

          <div className="space-y-4">
            {result.nextSteps.map((step) => (
              <div className="flex gap-4" key={step.order}>
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary text-sm">
                  {step.order}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{step.title}</p>
                  <p className="mt-1 text-muted-foreground text-sm">
                    {step.description}
                  </p>
                  {step.link && (
                    <a
                      className="mt-2 inline-flex items-center gap-1 text-primary text-sm hover:underline"
                      href={step.link}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      Learn more <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Caveats */}
      {result.caveats && result.caveats.length > 0 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/30">
          <div className="mb-2 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <p className="font-medium text-amber-800 text-sm dark:text-amber-200">
              Important Notes
            </p>
          </div>
          <ul className="space-y-1">
            {result.caveats.map((caveat) => (
              <li
                className="text-amber-700 text-sm dark:text-amber-300"
                key={caveat}
              >
                • {caveat}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          className="flex-1"
          onClick={onRestart}
          size="lg"
          variant="outline"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Start Over
        </Button>

        {isAuthenticated && onSave && (
          <Button
            className="flex-1"
            disabled={isSaving || isSaved}
            onClick={onSave}
            size="lg"
            variant="default"
          >
            {isSaved ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Saved
              </>
            ) : isSaving ? (
              "Saving..."
            ) : (
              "Save Results"
            )}
          </Button>
        )}

        {!isAuthenticated && (
          <Button asChild className="flex-1" size="lg" variant="default">
            <a href="/login">Sign in to Save Results</a>
          </Button>
        )}
      </div>
    </div>
  );
}
