"use client";

import { Navbar } from "@/components/landing/navbar";

type WizardLayoutProps = {
  children: React.ReactNode;
};

export function WizardLayout({ children }: WizardLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      {/* Add padding-top to account for fixed navbar (h-16 = 64px) */}
      <div className="flex-1 pt-16">{children}</div>
    </div>
  );
}
