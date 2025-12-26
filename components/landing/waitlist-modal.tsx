"use client";

import { Mail, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type WaitlistModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  country: {
    name: string;
    flag: string;
  } | null;
};

export const WaitlistModal = ({
  open,
  onOpenChange,
  country,
}: WaitlistModalProps) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedEmail = email.trim();

    // Basic email validation
    if (!trimmedEmail || !EMAIL_REGEX.test(trimmedEmail)) {
      toast.error("Invalid email", {
        description: "Please enter a valid email address.",
      });
      return;
    }

    if (trimmedEmail.length > 255) {
      toast.error("Email too long", {
        description: "Please enter a shorter email address.",
      });
      return;
    }

    setIsSubmitting(true);

    // TODO: Add mailerLite + DB. Simulate API call - in production, this would save to a database
    await new Promise((resolve) => setTimeout(resolve, 800));

    toast.success("You're on the list!", {
      description: `We'll notify you when ${country?.name} is available.`,
    });

    setEmail("");
    setIsSubmitting(false);
    onOpenChange(false);
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 text-5xl">{country?.flag}</div>
          <DialogTitle className="text-2xl">
            Get Notified for {country?.name}
          </DialogTitle>
          <DialogDescription className="text-base">
            We&apos;re working hard to bring {country?.name} eligibility
            checking. Join the waitlist to be the first to know when it
            launches.
          </DialogDescription>
        </DialogHeader>

        <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
          <div className="relative">
            <Mail className="-translate-y-1/2 absolute top-1/2 left-3 h-5 w-5 text-muted-foreground" />
            <Input
              className="pl-10"
              maxLength={255}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              type="email"
              value={email}
            />
          </div>

          <Button className="w-full" disabled={isSubmitting} type="submit">
            {isSubmitting ? (
              "Joining..."
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Join the Waitlist
              </>
            )}
          </Button>

          <p className="text-center text-muted-foreground text-xs">
            No spam, ever. We&apos;ll only email you when {country?.name}{" "}
            launches.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};
