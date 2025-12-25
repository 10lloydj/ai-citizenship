import { WizardLayout } from "@/components/eligibility/wizard-layout";

export default function EligibilityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <WizardLayout>{children}</WizardLayout>;
}
