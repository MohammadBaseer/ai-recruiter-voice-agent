"use client";

import { useClerk } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Mic2, Users, Briefcase, Calendar, TrendingUp, ArrowRight, LogOut } from "lucide-react";
import Link from "next/link";

interface DashboardClientProps {
  firstName: string | null;
  lastName: string | null;
  email: string;
  imageUrl: string;
  dbId: string;
}

export default function DashboardClient({
  firstName,
  lastName,
  email,
  imageUrl,
  dbId,
}: DashboardClientProps) {
  const { signOut } = useClerk();
  const displayName = firstName ? `${firstName}${lastName ? ` ${lastName}` : ""}` : email;

  const quickActions = [
    {
      label: "Candidates",
      description: "Manage your candidate pipeline",
      href: "/candidates",
      icon: Users,
      color: "bg-indigo-100 text-indigo-600",
    },
    {
      label: "Jobs",
      description: "Post and manage job openings",
      href: "/jobs",
      icon: Briefcase,
      color: "bg-emerald-100 text-emerald-600",
    },
    {
      label: "Interviews",
      description: "Schedule and track interviews",
      href: "/interviews",
      icon: Calendar,
      color: "bg-violet-100 text-violet-600",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
                <Mic2 className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-semibold text-slate-900">
                Recruiter<span className="text-indigo-600">AI</span>
              </span>
            </Link>

            <div className="flex items-center gap-3">
              {imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imageUrl}
                  alt={displayName}
                  className="h-8 w-8 rounded-full ring-2 ring-indigo-500/20"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                  {(firstName?.[0] ?? email[0]).toUpperCase()}
                </div>
              )}
              <span className="hidden sm:block text-sm font-medium text-slate-700">
                {displayName}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 text-slate-500 hover:text-slate-700"
                onClick={() => signOut({ redirectUrl: "/" })}
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sign out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Welcome banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700 p-8 mb-8 shadow-lg shadow-indigo-500/20">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/5 blur-2xl" />
            <div className="absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-violet-500/20 blur-2xl" />
          </div>
          <div className="relative flex items-center justify-between gap-6">
            <div>
              <p className="text-indigo-200 text-sm font-medium mb-1">Welcome back</p>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                {displayName} 👋
              </h1>
              <p className="mt-2 text-indigo-200 text-sm max-w-md">
                Your AI recruiter is ready. Import candidates, run a campaign, and let the AI handle the calls.
              </p>
              <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/20 px-3 py-1 text-xs font-medium text-indigo-100">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                Account synced · {email}
              </div>
            </div>
            <div className="hidden md:flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-white/10 border border-white/20">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.label} href={action.href}>
                <div className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white p-5 hover:border-indigo-200 hover:shadow-md hover:shadow-indigo-500/5 transition-all">
                  <div className="flex items-center gap-4">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${action.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{action.label}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{action.description}</p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Stats overview */}
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4">
          Overview
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Candidates", value: "0", color: "text-indigo-600", bg: "bg-indigo-50" },
            { label: "Active Jobs", value: "0", color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "Scheduled Interviews", value: "0", color: "text-violet-600", bg: "bg-violet-50" },
            { label: "Calls Made Today", value: "0", color: "text-amber-600", bg: "bg-amber-50" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-slate-200 bg-white p-5">
              <div className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${s.bg} mb-3`}>
                <TrendingUp className={`h-4 w-4 ${s.color}`} />
              </div>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-slate-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Getting started */}
        <div className="rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/50 p-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100">
            <Mic2 className="h-6 w-6 text-indigo-600" />
          </div>
          <h3 className="text-base font-semibold text-slate-900 mb-2">
            Create your first screening campaign
          </h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto mb-5">
            Add a job role, import candidates from CSV, and the AI starts calling within minutes.
          </p>
          <Link href="/jobs">
            <Button className="bg-indigo-600 hover:bg-indigo-500 text-white gap-2">
              Add a Job Role
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
