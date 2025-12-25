"use client";

type ProgressBarProps = {
  progress: number;
  currentQuestion: number;
  totalQuestions: number;
};

export function ProgressBar({
  progress,
  currentQuestion,
  totalQuestions,
}: ProgressBarProps) {
  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="mb-2 flex items-center justify-between text-muted-foreground text-sm">
        <span>
          Question {currentQuestion} of ~{totalQuestions}
        </span>
        <span>{progress}% complete</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
