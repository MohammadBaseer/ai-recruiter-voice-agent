"use client";

import { useClerk } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Mic2, Users, Briefcase, Calendar, TrendingUp, ArrowRight, LogOut, Home, Settings, ChevronDown, Crown } from "lucide-react";
import Link from "next/link";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarSeparator,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";

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
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        {/* Sidebar */}
        <Sidebar variant="sidebar" collapsible="icon">
          {/* Sidebar Header */}
          <SidebarHeader>
            <div className="flex items-center gap-2 px-2 py-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
                <Mic2 className="h-4 w-4 text-white" />
              </div>
              <div className="font-semibold text-lg text-foreground">
                Recruiter<span className="text-indigo-600">AI</span>
              </div>
            </div>
          </SidebarHeader>

          <SidebarSeparator />

          {/* Navigation Menu */}
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/dashboard" className="flex items-center gap-2">
                        <Home className="h-4 w-4" />
                        <span>Home</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/jobs" className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4" />
                        <span>Jobs</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/candidates" className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>Candidates</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/interviews" className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Interviews</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/settings" className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarSeparator />

          {/* Sidebar Footer */}
          <SidebarFooter>
            <div className="flex flex-col gap-2 px-2 py-4">
              {/* Profile Section */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="w-full justify-start gap-2 px-2 py-1.5">
                    <Avatar className="h-8 w-8">
                      {imageUrl ? (
                        <AvatarImage src={imageUrl} alt={displayName} />
                      ) : (
                        <AvatarFallback className="bg-indigo-600 text-white">
                          {(firstName?.[0] ?? email[0]).toUpperCase()}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex flex-col items-start text-left">
                      <span className="text-sm font-medium">{displayName}</span>
                      <span className="text-xs text-muted-foreground">{email}</span>
                    </div>
                    <ChevronDown className="ml-auto h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Account Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => signOut({ redirectUrl: "/" })}
                    className="text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Upgrade Plan Button */}
              <Button className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-medium">
                <Crown className="mr-2 h-4 w-4" />
                Upgrade Plan
              </Button>
            </div>
          </SidebarFooter>

          <SidebarRail />
        </Sidebar>

        {/* Main Content Area */}
        <SidebarInset>
          {/* Top Header */}
          <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-14 items-center gap-4 px-4">
              <SidebarTrigger className="md:hidden" />
              
              <div className="flex-1">
                <h1 className="text-lg font-semibold">Dashboard</h1>
              </div>

              {/* Profile Dropdown on Right */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      {imageUrl ? (
                        <AvatarImage src={imageUrl} alt={displayName} />
                      ) : (
                        <AvatarFallback className="bg-indigo-600 text-white">
                          {(firstName?.[0] ?? email[0]).toUpperCase()}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Account Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => signOut({ redirectUrl: "/" })}
                    className="text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Dashboard Content */}
          <main className="flex flex-1 flex-col gap-4 p-4">
            {/* Welcome banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700 p-6 shadow-lg shadow-indigo-500/20">
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-white/5 blur-2xl" />
                <div className="absolute -bottom-16 -left-8 h-32 w-32 rounded-full bg-violet-500/20 blur-2xl" />
              </div>
              <div className="relative flex items-center justify-between gap-6">
                <div>
                  <p className="text-indigo-200 text-sm font-medium mb-1">Welcome back</p>
                  <h1 className="text-xl sm:text-2xl font-bold text-white">
                    {displayName} 👋
                  </h1>
                  <p className="mt-2 text-indigo-200 text-sm max-w-md">
                    Your AI recruiter is ready. Import candidates, run a campaign, and let the AI handle the calls.
                  </p>
                  <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/20 px-3 py-1 text-xs font-medium text-indigo-100">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                    Account synced · {email}
                  </div>
                </div>
                <div className="hidden md:flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-white/10 border border-white/20">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link key={action.label} href={action.href}>
                    <div className="group flex items-center justify-between rounded-xl border border-border bg-card p-4 hover:border-indigo-200 hover:shadow-md hover:shadow-indigo-500/5 transition-all">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${action.color}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-semibold text-card-foreground text-sm">{action.label}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{action.description}</p>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Stats overview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Total Candidates", value: "0", color: "text-indigo-600", bg: "bg-indigo-50" },
                { label: "Active Jobs", value: "0", color: "text-emerald-600", bg: "bg-emerald-50" },
                { label: "Scheduled Interviews", value: "0", color: "text-violet-600", bg: "bg-violet-50" },
                { label: "Calls Made Today", value: "0", color: "text-amber-600", bg: "bg-amber-50" },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border border-border bg-card p-4">
                  <div className={`inline-flex h-8 w-8 items-center justify-center rounded-lg ${s.bg} mb-2`}>
                    <TrendingUp className={`h-4 w-4 ${s.color}`} />
                  </div>
                  <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Getting started */}
            <div className="rounded-xl border border-dashed border-indigo-200 bg-indigo-50/50 p-6 text-center">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100">
                <Mic2 className="h-5 w-5 text-indigo-600" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-2">
                Create your first screening campaign
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-4">
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
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
