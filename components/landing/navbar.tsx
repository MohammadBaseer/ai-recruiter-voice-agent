"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  Mic2,
  Menu,
  X,
  Zap,
  LayoutGrid,
  Workflow,
  DollarSign,
  HelpCircle,
} from "lucide-react";

const navLinks = [
  {
    label: "Features",
    href: "#features",
    icon: LayoutGrid,
  },
  {
    label: "How It Works",
    href: "#how-it-works",
    icon: Workflow,
  },
  {
    label: "Integrations",
    href: "#integrations",
    icon: Zap,
  },
  {
    label: "Pricing",
    href: "#pricing",
    icon: DollarSign,
    badge: "New",
  },
  {
    label: "FAQ",
    href: "#faq",
    icon: HelpCircle,
  },
];

// Desktop Auth Component
function DesktopAuth({ scrolled }: { scrolled: boolean }) {
  const { isSignedIn, user, isLoaded } = useUser();
  const router = useRouter();

  const handleSignInClick = () => {
    if (isSignedIn) {
      router.push("/dashboard");
    } else {
      router.push("/sign-in");
    }
  };

  const handleGetStartedClick = () => {
    if (isSignedIn) {
      router.push("/dashboard");
    } else {
      router.push("/sign-up");
    }
  };

  if (isLoaded && isSignedIn && user) {
    return (
      <div className="hidden md:flex items-center gap-2.5 flex-shrink-0">
        <Link href="/dashboard">
          <Button
            variant="ghost"
            size="sm"
            className={`font-medium transition-colors duration-300 ${
              scrolled
                ? "text-slate-600 hover:text-slate-900"
                : "text-slate-300 hover:text-white hover:bg-white/10"
            }`}
          >
            Dashboard
          </Button>
        </Link>
        <img
          src={user.imageUrl}
          alt={user.fullName || "User"}
          className="w-8 h-8 rounded-full ring-2 ring-indigo-500/20 cursor-pointer hover:ring-indigo-500 transition-all"
          onClick={() => router.push("/dashboard")}
        />
      </div>
    );
  }

  return (
    <div className="hidden md:flex items-center gap-2.5 flex-shrink-0">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleSignInClick}
        className={`font-medium transition-colors duration-300 ${
          scrolled
            ? "text-slate-600 hover:text-slate-900"
            : "text-slate-300 hover:text-white hover:bg-white/10"
        }`}
      >
        Sign in
      </Button>
      <Button
        size="sm"
        onClick={handleGetStartedClick}
        className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-md shadow-indigo-500/30 px-4"
      >
        Get Started Free
      </Button>
    </div>
  );
}

// Mobile Auth Component
function MobileAuth() {
  const { isSignedIn, user, isLoaded } = useUser();
  const router = useRouter();

  const handleSignInClick = () => {
    if (isSignedIn) {
      router.push("/dashboard");
    } else {
      router.push("/sign-in");
    }
  };

  const handleGetStartedClick = () => {
    if (isSignedIn) {
      router.push("/dashboard");
    } else {
      router.push("/sign-up");
    }
  };

  if (isLoaded && isSignedIn && user) {
    return (
      <div className="flex flex-col gap-2 pt-3 border-t border-slate-100">
        <Link href="/dashboard" className="w-full">
          <Button variant="outline" size="sm" className="w-full border-slate-200 text-slate-700">
            Dashboard
          </Button>
        </Link>
        <div className="flex items-center gap-3 py-2 px-2">
          <img
            src={user.imageUrl}
            alt={user.fullName || "User"}
            className="w-8 h-8 rounded-full cursor-pointer"
            onClick={() => router.push("/dashboard")}
          />
          <span className="text-sm font-medium text-slate-700">Account</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 pt-3 border-t border-slate-100">
      <Button
        variant="outline"
        size="sm"
        className="w-full border-slate-200 text-slate-700"
        onClick={handleSignInClick}
      >
        Sign in
      </Button>
      <Button
        size="sm"
        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold"
        onClick={handleGetStartedClick}
      >
        Get Started Free
      </Button>
    </div>
  );
}

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight active section on scroll
  useEffect(() => {
    const sectionIds = navLinks.map((l) => l.href.replace("#", ""));
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { rootMargin: "-40% 0px -55% 0px" }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const scrolledStyles = scrolled
    ? "border-b border-slate-200/80 bg-white/90 shadow-sm"
    : "border-b border-transparent bg-transparent";

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 backdrop-blur-xl transition-all duration-300 ${scrolledStyles}`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-6">

          {/* ── Logo ──────────────────────────────────── */}
          <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 shadow-md shadow-indigo-500/40 group-hover:bg-indigo-500 transition-colors">
              <Mic2 className="h-4 w-4 text-white" />
              {/* Live dot */}
              <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-400 ring-1 ring-white" />
              </span>
            </div>
            <span
              className={`text-lg font-semibold tracking-tight transition-colors duration-300 ${
                scrolled ? "text-slate-900" : "text-white"
              }`}
            >
              Recruiter<span className="text-indigo-400">AI</span>
            </span>
          </Link>

          {/* ── Desktop Nav ───────────────────────────── */}
          <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.replace("#", "");
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`relative flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? scrolled
                        ? "text-indigo-600 bg-indigo-50"
                        : "text-white bg-white/15"
                      : scrolled
                      ? "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                      : "text-slate-300 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {link.label}
                  {link.badge && (
                    <span className="rounded-full bg-indigo-600 px-1.5 py-0.5 text-[10px] font-bold text-white leading-none">
                      {link.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 w-4 rounded-full bg-indigo-500" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* ── Desktop CTAs ──────────────────────────── */}
          <DesktopAuth scrolled={scrolled} />

          {/* ── Mobile Toggle ─────────────────────────── */}
          <button
            className={`md:hidden rounded-lg p-2 transition-colors ${
              scrolled
                ? "text-slate-600 hover:bg-slate-100"
                : "text-slate-300 hover:bg-white/10"
            }`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ─────────────────────────────────── */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t border-slate-100 bg-white/95 backdrop-blur-xl px-4 pb-5 pt-3">
          <nav className="flex flex-col gap-1 mb-4">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeSection === link.href.replace("#", "");
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon className={`h-4 w-4 flex-shrink-0 ${isActive ? "text-indigo-500" : "text-slate-400"}`} />
                  {link.label}
                  {link.badge && (
                    <span className="ml-auto rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-600">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <MobileAuth />

          {/* Mobile social proof */}
          <p className="mt-4 text-center text-xs text-slate-400">
            Trusted by <span className="font-semibold text-slate-600">500+</span> recruiting teams worldwide
          </p>
        </div>
      </div>
    </header>
  );
}
