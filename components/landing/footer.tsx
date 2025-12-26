import Image from "next/image";

const CURRENT_YEAR = 2025;

export const Footer = () => {
  return (
    <footer className="border-border/50 border-t py-12">
      <div className="container px-4">
        {/* Logo and tagline */}
        <div className="mb-8 flex flex-col items-center text-center">
          <Image
            alt="Citizenship Eligibility Checker"
            className="mb-3 h-12 w-12"
            height={48}
            src="/images/logo.png"
            width={48}
          />
          <h3 className="mb-2 font-bold text-foreground text-xl">
            Citizenship Eligibility Checker
          </h3>
          <p className="text-muted-foreground text-sm">
            Your heritage. Your passport. Your future.
          </p>
        </div>

        {/* Disclaimer */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-muted-foreground/70 text-xs leading-relaxed">
            This tool provides indicative guidance only and does not constitute
            legal advice. We are not affiliated with any government. Always
            verify requirements with official sources before proceeding with an
            application.
          </p>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-border/30 border-t pt-8 text-center">
          <p className="text-muted-foreground text-xs">
            © {CURRENT_YEAR} Citizenship Eligibility Checker. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
