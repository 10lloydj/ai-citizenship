"use client";

import { History, LogIn, LogOut, Moon, Sun, User } from "lucide-react";
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

export function Navbar() {
  const { data: session, status } = useSession();
  const { setTheme, resolvedTheme } = useTheme();

  const isAuthenticated = session?.user?.type === "regular";

  return (
    <header className="fixed top-0 right-0 left-0 z-50 border-border/50 border-b bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link className="flex items-center gap-2" href="/">
          <span className="text-2xl">🌍</span>
          <span className="font-bold text-foreground text-lg">
            Citizenship Check
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-2">
          {/* History link - only for authenticated users */}
          {isAuthenticated && (
            <Button asChild size="sm" variant="ghost">
              <Link href="/history">
                <History className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">History</span>
              </Link>
            </Button>
          )}

          {/* Auth state */}
          {status === "loading" ? (
            <div className="h-9 w-24 animate-pulse rounded-md bg-muted" />
          ) : isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="gap-2" size="sm" variant="outline">
                  <Image
                    alt={session.user.email ?? "User"}
                    className="rounded-full"
                    height={20}
                    src={`https://avatar.vercel.sh/${session.user.email}`}
                    width={20}
                  />
                  <span className="hidden max-w-[120px] truncate sm:inline">
                    {session.user.email}
                  </span>
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
            <div className="flex items-center gap-2">
              {/* Theme toggle for guests */}
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

              <Button asChild size="sm" variant="outline">
                <Link href="/login">
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign in
                </Link>
              </Button>

              <Button asChild className="hidden sm:inline-flex" size="sm">
                <Link href="/register">
                  <User className="mr-2 h-4 w-4" />
                  Sign up
                </Link>
              </Button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
