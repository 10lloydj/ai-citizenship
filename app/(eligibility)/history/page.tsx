"use client";

import {
  ArrowRight,
  CheckCircle,
  Clock,
  FileText,
  HelpCircle,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import type { EligibilityStatus } from "@/lib/eligibility/types";

type HistoryItem = {
  id: string;
  countryCode: string;
  countryName: string;
  countryFlag: string;
  status: EligibilityStatus;
  rulesVersion: string;
  createdAt: string;
};

const statusConfig = {
  eligible: {
    icon: CheckCircle,
    label: "Likely Eligible",
    color: "text-green-600 dark:text-green-400",
    bg: "bg-green-50 dark:bg-green-950/30",
  },
  not_eligible: {
    icon: XCircle,
    label: "Not Eligible",
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-950/30",
  },
  needs_info: {
    icon: HelpCircle,
    label: "More Info Needed",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-950/30",
  },
};

export default function HistoryPage() {
  const { data: session, status: authStatus } = useSession();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      if (authStatus === "loading") {
        return;
      }

      if (session?.user?.type !== "regular") {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/eligibility/history");
        if (!response.ok) {
          throw new Error("Failed to fetch history");
        }

        const data = await response.json();
        setHistory(data.history);
      } catch (err) {
        console.error("Failed to fetch history:", err);
        setError("Failed to load your eligibility history");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [session, authStatus]);

  // Not authenticated (guests don't get history)
  if (authStatus !== "loading" && session?.user?.type !== "regular") {
    return (
      <div className="container flex min-h-[60vh] flex-col items-center justify-center px-4 py-12 text-center">
        <div className="mb-6 text-6xl">🔒</div>
        <h1 className="mb-4 font-bold text-2xl text-foreground">
          Sign In Required
        </h1>
        <p className="mb-8 max-w-md text-muted-foreground">
          Please sign in to view your saved eligibility checks.
        </p>
        <Button asChild size="lg">
          <Link href="/login">Sign In</Link>
        </Button>
      </div>
    );
  }

  // Loading
  if (isLoading) {
    return (
      <div className="container flex min-h-[60vh] items-center justify-center px-4 py-12">
        <div className="text-muted-foreground">Loading your history...</div>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="container flex min-h-[60vh] flex-col items-center justify-center px-4 py-12 text-center">
        <div className="mb-6 text-6xl">⚠️</div>
        <h1 className="mb-4 font-bold text-2xl text-foreground">
          Something went wrong
        </h1>
        <p className="mb-8 max-w-md text-muted-foreground">{error}</p>
        <Button
          onClick={() => window.location.reload()}
          size="lg"
          type="button"
        >
          Try Again
        </Button>
      </div>
    );
  }

  // Empty state
  if (history.length === 0) {
    return (
      <div className="container flex min-h-[60vh] flex-col items-center justify-center px-4 py-12 text-center">
        <div className="mb-6 text-6xl">📋</div>
        <h1 className="mb-4 font-bold text-2xl text-foreground">
          No History Yet
        </h1>
        <p className="mb-8 max-w-md text-muted-foreground">
          You haven't saved any eligibility checks yet. Start by checking your
          eligibility for a country.
        </p>
        <Button asChild size="lg">
          <Link href="/">
            Check Eligibility
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    );
  }

  // History list
  return (
    <div className="container px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <h1 className="mb-2 font-bold text-2xl text-foreground">
            Your Eligibility History
          </h1>
          <p className="text-muted-foreground">
            View your saved citizenship eligibility checks
          </p>
        </div>

        <div className="space-y-4">
          {history.map((item) => {
            const config = statusConfig[item.status];
            const StatusIcon = config.icon;
            const date = new Date(item.createdAt);

            return (
              <div
                className="group rounded-xl border border-border/50 bg-card p-6 transition-all hover:border-border hover:shadow-md"
                key={item.id}
              >
                <div className="flex items-start gap-4">
                  {/* Flag */}
                  <div className="text-4xl">{item.countryFlag}</div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <h3 className="font-semibold text-foreground text-lg">
                        {item.countryName}
                      </h3>
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-medium text-xs ${config.bg} ${config.color}`}
                      >
                        <StatusIcon className="h-3 w-3" />
                        {config.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-muted-foreground text-sm">
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        {date.toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <FileText className="h-3.5 w-3.5" />
                        Rules v{item.rulesVersion}
                      </span>
                    </div>
                  </div>

                  {/* Action */}
                  <Button
                    asChild
                    className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                    size="sm"
                    variant="ghost"
                  >
                    <Link href={`/check?country=${item.countryCode}`}>
                      Check Again
                      <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <Button asChild variant="outline">
            <Link href="/">
              Check Another Country
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
