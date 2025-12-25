"use client";

import { ArrowLeft, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

type WizardNavProps = {
  canGoBack: boolean;
  onBack: () => void;
  onRestart: () => void;
};

export function WizardNav({ canGoBack, onBack, onRestart }: WizardNavProps) {
  return (
    <div className="mx-auto flex w-full max-w-2xl items-center justify-between">
      <Button
        className="gap-2"
        disabled={!canGoBack}
        onClick={onBack}
        size="sm"
        variant="ghost"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      <Button
        className="gap-2 text-muted-foreground"
        onClick={onRestart}
        size="sm"
        variant="ghost"
      >
        <RotateCcw className="h-4 w-4" />
        Start over
      </Button>
    </div>
  );
}
