"use client";

import { History, Home, LogIn, LogOut, Moon, Sun, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type WizardLayoutProps = {
  children: React.ReactNode;
};

export function WizardLayout({ children }: WizardLayoutProps) {
  const { data: session, status } = useSession();
  const { setTheme, resolvedTheme } = useTheme();

  const isAuthenticated = session?.user?.type === "regular";

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-border/50 border-b bg-background/80 backdrop-blur-md">
        <div className="container flex h-14 items-center justify-between px-4">
          {/* Logo */}
          <Link className="flex items-center gap-2" href="/">
            <Home className="h-5 w-5 text-muted-foreground" />
            <span className="font-semibold text-foreground">
              Citizenship Check
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-2">
            {isAuthenticated && (
              <Button asChild size="sm" variant="ghost">
                <Link href="/history">
                  <History className="mr-1.5 h-4 w-4" />
                  <span className="hidden sm:inline">History</span>
                </Link>
              </Button>
            )}

            {status === "loading" ? (
              <div className="h-8 w-20 animate-pulse rounded-md bg-muted" />
            ) : isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="gap-2" size="sm" variant="ghost">
                    <Image
                      alt={session.user.email ?? "User"}
                      className="rounded-full"
                      height={20}
                      src={`https://avatar.vercel.sh/${session.user.email}`}
                      width={20}
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() =>
                      setTheme(resolvedTheme === "dark" ? "light" : "dark")
                    }
                  >
                    {resolvedTheme === "dark" ? (
                      <Sun className="mr-2 h-4 w-4" />
                    ) : (
                      <Moon className="mr-2 h-4 w-4" />
                    )}
                    {resolvedTheme === "dark" ? "Light mode" : "Dark mode"}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-destructive focus:text-destructive"
                    onClick={() => signOut({ redirectTo: "/" })}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-1">
                <Button
                  onClick={() =>
                    setTheme(resolvedTheme === "dark" ? "light" : "dark")
                  }
                  size="icon"
                  variant="ghost"
                >
                  {resolvedTheme === "dark" ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Moon className="h-4 w-4" />
                  )}
                </Button>
                <Button asChild size="sm" variant="ghost">
                  <Link href="/login">
                    <LogIn className="mr-1.5 h-4 w-4" />
                    Sign in
                  </Link>
                </Button>
              </div>
            )}
          </nav>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1">{children}</div>
    </div>
  );
}

