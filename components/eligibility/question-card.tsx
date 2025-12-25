"use client";

import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Question } from "@/lib/eligibility/types";

type QuestionCardProps = {
  question: Question;
  onAnswer: (value: string) => void;
  isLoading?: boolean;
};

export function QuestionCard({
  question,
  onAnswer,
  isLoading = false,
}: QuestionCardProps) {
  return (
    <div className="mx-auto w-full max-w-2xl animate-fade-in-up">
      <div className="rounded-2xl border border-border/50 bg-card p-8 shadow-card">
        {/* Question text */}
        <h2 className="mb-4 font-semibold text-2xl text-foreground">
          {question.text}
        </h2>

        {/* Help text */}
        {question.helpText && (
          <div className="mb-6 flex items-start gap-2 rounded-lg bg-muted/50 p-4">
            <HelpCircle className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
            <p className="text-muted-foreground text-sm">{question.helpText}</p>
          </div>
        )}

        {/* Answer options */}
        <div className="space-y-3">
          {question.type === "boolean" && (
            <>
              <Button
                className="h-auto w-full justify-start px-6 py-4 text-left"
                disabled={isLoading}
                onClick={() => onAnswer("true")}
                size="lg"
                variant="outline"
              >
                <span className="mr-3 text-xl">✓</span>
                <span className="font-medium">Yes</span>
              </Button>
              <Button
                className="h-auto w-full justify-start px-6 py-4 text-left"
                disabled={isLoading}
                onClick={() => onAnswer("false")}
                size="lg"
                variant="outline"
              >
                <span className="mr-3 text-xl">✗</span>
                <span className="font-medium">No</span>
              </Button>
            </>
          )}

          {question.type === "select" &&
            question.options?.map((option) => (
              <Button
                className="h-auto w-full justify-start px-6 py-4 text-left"
                disabled={isLoading}
                key={option.value}
                onClick={() => onAnswer(option.value)}
                size="lg"
                variant="outline"
              >
                <div>
                  <span className="font-medium">{option.label}</span>
                  {option.description && (
                    <p className="mt-1 font-normal text-muted-foreground text-sm">
                      {option.description}
                    </p>
                  )}
                </div>
              </Button>
            ))}
        </div>
      </div>
    </div>
  );
}
