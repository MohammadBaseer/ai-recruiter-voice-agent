"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useClerk } from "@clerk/nextjs";
import Link from "next/link";
import {
  Mic2, Users, Briefcase, Calendar, Settings, Home,
  LogOut, ChevronDown, Crown, Plus, Grid3X3, List,
  Upload, Loader2, X, CheckCircle2, Mail, Phone,
  Link2, FileText, StickyNote, Search, MoreHorizontal,
  UserCircle2, Trash2, Pencil, MapPin, Globe, GitBranch,
  GraduationCap, Briefcase as BriefcaseIcon, Star,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Avatar, AvatarFallback, AvatarImage,
} from "@/components/ui/avatar";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup,
  SidebarGroupContent, SidebarHeader, SidebarInset, SidebarMenu,
  SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger,
} from "@/components/ui/sidebar";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Candidate {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  jobTitle?: string;
  location?: string;
  linkedInUrl?: string;
  portfolioUrl?: string;
  githubUrl?: string;
  resumeUrl?: string;
  skills?: string[];
  experience?: string;
  education?: string;
  status: "new" | "contacted" | "interviewed" | "hired" | "rejected";
  notes?: string;
  createdAt: string;
}

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  jobTitle: string;
  location: string;
  linkedInUrl: string;
  portfolioUrl: string;
  githubUrl: string;
  resumeUrl: string;
  skills: string;       // comma-separated in form
  experience: string;
  education: string;
  notes: string;
  status: Candidate["status"];
}

const EMPTY_FORM: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  jobTitle: "",
  location: "",
  linkedInUrl: "",
  portfolioUrl: "",
  githubUrl: "",
  resumeUrl: "",
  skills: "",
  experience: "",
  education: "",
  notes: "",
  status: "new",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  Candidate["status"],
  { label: string; className: string }
> = {
  new:         { label: "New",         className: "bg-blue-100 text-blue-700 border-blue-200" },
  contacted:   { label: "Contacted",   className: "bg-amber-100 text-amber-700 border-amber-200" },
  interviewed: { label: "Interviewed", className: "bg-violet-100 text-violet-700 border-violet-200" },
  hired:       { label: "Hired",       className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  rejected:    { label: "Rejected",    className: "bg-red-100 text-red-700 border-red-200" },
};

function initials(c: Candidate) {
  return `${c.firstName[0] ?? ""}${c.lastName[0] ?? ""}`.toUpperCase();
}

function candidateToForm(c: Candidate): FormState {
  return {
    firstName:   c.firstName,
    lastName:    c.lastName,
    email:       c.email,
    phone:       c.phone        ?? "",
    jobTitle:    c.jobTitle     ?? "",
    location:    c.location     ?? "",
    linkedInUrl: c.linkedInUrl  ?? "",
    portfolioUrl:c.portfolioUrl ?? "",
    githubUrl:   c.githubUrl    ?? "",
    resumeUrl:   c.resumeUrl    ?? "",
    skills:      c.skills?.join(", ") ?? "",
    experience:  c.experience   ?? "",
    education:   c.education    ?? "",
    notes:       c.notes        ?? "",
    status:      c.status,
  };
}

// ─── Section divider ─────────────────────────────────────────────────────────

function Section({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="flex items-center gap-2 pt-2">
      <Icon className="h-3.5 w-3.5 text-indigo-500" />
      <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">{title}</span>
      <div className="flex-1 border-t border-border" />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface Props {
  firstName: string | null;
  lastName: string | null;
  email: string;
  imageUrl: string;
}

export default function CandidatesClient({ firstName, lastName, email, imageUrl }: Props) {
  const { signOut } = useClerk();
  const displayName = firstName ? `${firstName}${lastName ? ` ${lastName}` : ""}` : email;

  // ── State ──
  const [candidates, setCandidates]     = useState<Candidate[]>([]);
  const [isLoading, setIsLoading]       = useState(true);
  const [viewMode, setViewMode]         = useState<"grid" | "list">("grid");
  const [search, setSearch]             = useState("");
  const [dialogOpen, setDialogOpen]     = useState(false);
  const [dialogStep, setDialogStep]     = useState<"choose" | "upload" | "form">("choose");
  const [form, setForm]                 = useState<FormState>(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isParsing, setIsParsing]       = useState(false);
  const [parsedOk, setParsedOk]         = useState(false);
  const [dragOver, setDragOver]         = useState(false);
  const [editingId, setEditingId]       = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Fetch ──
  const fetchCandidates = useCallback(async () => {
    try {
      const res = await fetch("/api/candidates");
      if (!res.ok) throw new Error();
      setCandidates(await res.json());
    } catch {
      toast.error("Failed to load candidates");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchCandidates(); }, [fetchCandidates]);

  // ── Open dialog helpers ──
  function openAdd() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setParsedOk(false);
    setDialogStep("choose");
    setDialogOpen(true);
  }

  function openEdit(c: Candidate) {
    setEditingId(c._id);
    setForm(candidateToForm(c));
    setParsedOk(false);
    setDialogStep("form");
    setDialogOpen(true);
  }

  function closeDialog() {
    setDialogOpen(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setParsedOk(false);
    setDialogStep("choose");
  }

  // ── Resume parsing ──
  async function handleFile(file: File) {
    const allowed = ["application/pdf", "text/plain"];
    if (!allowed.includes(file.type) && !file.name.endsWith(".txt")) {
      toast.error("Please upload a PDF or plain text file");
      return;
    }
    setIsParsing(true);
    setParsedOk(false);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/candidates/parse-resume", {
        method: "POST",
        body: formData,           // raw binary — no Base64, no JSON
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Parse failed");
      const data = await res.json();
      setForm((prev) => ({
        ...prev,
        firstName:    data.firstName    || prev.firstName,
        lastName:     data.lastName     || prev.lastName,
        email:        data.email        || prev.email,
        phone:        data.phone        || prev.phone,
        jobTitle:     data.jobTitle     || prev.jobTitle,
        location:     data.location     || prev.location,
        linkedInUrl:  data.linkedInUrl  || prev.linkedInUrl,
        portfolioUrl: data.portfolioUrl || prev.portfolioUrl,
        githubUrl:    data.githubUrl    || prev.githubUrl,
        skills:       data.skills       || prev.skills,
        experience:   data.experience   || prev.experience,
        education:    data.education    || prev.education,
        notes:        data.notes        || prev.notes,
      }));
      setParsedOk(true);
      setDialogStep("form");
      toast.success("Resume parsed — form filled automatically");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Resume parsing failed");
    } finally {
      setIsParsing(false);
    }
  }

  // ── Submit ──
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email) {
      toast.error("First name, last name, and email are required");
      return;
    }
    setIsSubmitting(true);
    try {
      const url    = editingId ? `/api/candidates/${editingId}` : "/api/candidates";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Request failed");
      }
      toast.success(editingId ? "Candidate updated" : "Candidate saved");
      closeDialog();
      fetchCandidates();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to save candidate");
    } finally {
      setIsSubmitting(false);
    }
  }

  // ── Delete ──
  async function handleDelete(id: string) {
    if (!confirm("Delete this candidate?")) return;
    try {
      const res = await fetch(`/api/candidates/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Candidate deleted");
      setCandidates((prev) => prev.filter((c) => c._id !== id));
    } catch {
      toast.error("Failed to delete candidate");
    }
  }

  // ── Filtered candidates ──
  const filtered = candidates.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      c.firstName.toLowerCase().includes(q) ||
      c.lastName.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      (c.jobTitle ?? "").toLowerCase().includes(q)
    );
  });

  // ── Stats ──
  const stats = [
    { label: "Total",       value: candidates.length,                                           color: "text-indigo-600",  bg: "bg-indigo-50"  },
    { label: "New",         value: candidates.filter((c) => c.status === "new").length,         color: "text-blue-600",    bg: "bg-blue-50"    },
    { label: "Interviewed", value: candidates.filter((c) => c.status === "interviewed").length, color: "text-violet-600",  bg: "bg-violet-50"  },
    { label: "Hired",       value: candidates.filter((c) => c.status === "hired").length,       color: "text-emerald-600", bg: "bg-emerald-50" },
  ];

  // ── Field helpers ──
  const f = <K extends keyof FormState>(key: K) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((p) => ({ ...p, [key]: e.target.value })),
  });

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">

        {/* ── Sidebar ── */}
        <Sidebar variant="sidebar" collapsible="icon">
          <SidebarHeader className="border-b border-sidebar-border">
            <div className="flex h-14 items-center gap-3 px-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600">
                <Mic2 className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-base tracking-tight group-data-[collapsible=icon]:hidden">
                Recruiter<span className="text-indigo-600">AI</span>
              </span>
            </div>
          </SidebarHeader>

          <SidebarContent className="py-2">
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {[
                    { href: "/dashboard",  icon: Home,      label: "Home"       },
                    { href: "/jobs",       icon: Briefcase, label: "Jobs"       },
                    { href: "/candidates", icon: Users,     label: "Candidates" },
                    { href: "/interviews", icon: Calendar,  label: "Interviews" },
                    { href: "/settings",   icon: Settings,  label: "Settings"   },
                  ].map(({ href, icon: Icon, label }) => (
                    <SidebarMenuItem key={label}>
                      <SidebarMenuButton asChild size="lg" tooltip={label} isActive={label === "Candidates"}>
                        <Link href={href}>
                          <Icon />
                          <span className="group-data-[collapsible=icon]:hidden">{label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-sidebar-border py-2">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  size="lg"
                  tooltip="Upgrade Plan"
                  className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white hover:text-white"
                >
                  <Crown />
                  <span className="group-data-[collapsible=icon]:hidden">Upgrade Plan</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton size="lg" tooltip={displayName}>
                      <Avatar className="h-7 w-7 shrink-0">
                        {imageUrl
                          ? <AvatarImage src={imageUrl} alt={displayName} />
                          : <AvatarFallback className="bg-indigo-600 text-white text-xs">
                              {(firstName?.[0] ?? email[0]).toUpperCase()}
                            </AvatarFallback>
                        }
                      </Avatar>
                      <div className="flex min-w-0 flex-col items-start text-left group-data-[collapsible=icon]:hidden">
                        <span className="truncate text-sm font-medium">{displayName}</span>
                        <span className="truncate text-xs text-muted-foreground">{email}</span>
                      </div>
                      <ChevronDown className="ml-auto h-4 w-4 shrink-0 text-muted-foreground group-data-[collapsible=icon]:hidden" />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="top" align="start" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Profile Settings</DropdownMenuItem>
                    <DropdownMenuItem>Account Settings</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut({ redirectUrl: "/" })} className="text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        {/* ── Main ── */}
        <SidebarInset>
          <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-14 items-center gap-3 px-4">
              <SidebarTrigger />
              <h1 className="text-lg font-semibold flex-1">Candidates</h1>

              <div className="flex items-center rounded-lg border border-border overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 transition-colors ${viewMode === "grid" ? "bg-indigo-600 text-white" : "hover:bg-muted text-muted-foreground"}`}
                  title="Grid view"
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 transition-colors ${viewMode === "list" ? "bg-indigo-600 text-white" : "hover:bg-muted text-muted-foreground"}`}
                  title="List view"
                >
                  <List className="h-4 w-4" />
                </button>
              </div>

              <Button onClick={openAdd} className="bg-indigo-600 hover:bg-indigo-500 text-white gap-2">
                <Plus className="h-4 w-4" />
                Add Candidate
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      {imageUrl
                        ? <AvatarImage src={imageUrl} alt={displayName} />
                        : <AvatarFallback className="bg-indigo-600 text-white">
                            {(firstName?.[0] ?? email[0]).toUpperCase()}
                          </AvatarFallback>
                      }
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile Settings</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut({ redirectUrl: "/" })} className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <main className="flex flex-1 flex-col gap-4 p-4">
            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {stats.map((s) => (
                <div key={s.label} className="rounded-xl border border-border bg-card p-4">
                  <div className={`inline-flex h-8 w-8 items-center justify-center rounded-lg ${s.bg} mb-2`}>
                    <Users className={`h-4 w-4 ${s.color}`} />
                  </div>
                  <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email or title…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Candidates */}
            {isLoading ? (
              <div className="flex flex-1 items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
              </div>
            ) : filtered.length === 0 ? (
              <EmptyState search={search} onAdd={openAdd} />
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.map((c) => (
                  <CandidateCard key={c._id} candidate={c} onEdit={() => openEdit(c)} onDelete={() => handleDelete(c._id)} />
                ))}
              </div>
            ) : (
              <CandidateTable candidates={filtered} onEdit={openEdit} onDelete={(id) => handleDelete(id)} />
            )}
          </main>
        </SidebarInset>
      </div>

      {/* ── Dialog ── */}
      <Dialog open={dialogOpen} onOpenChange={(open) => { if (!open) closeDialog(); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {editingId ? "Edit Candidate" : "Add New Candidate"}
            </DialogTitle>
            <DialogDescription>
              {editingId
                ? "Update the candidate's details below."
                : dialogStep === "choose"
                ? "How would you like to add this candidate?"
                : dialogStep === "upload"
                ? "Upload a resume — AI will extract and fill all fields automatically."
                : parsedOk
                ? "Resume parsed! Review the auto-filled details, edit if needed, then save."
                : "Fill in the candidate's details below."}
            </DialogDescription>
          </DialogHeader>

          {/* ── Step 1: Choose ── */}
          {!editingId && dialogStep === "choose" && (
            <div className="grid grid-cols-2 gap-4 py-2">
              <button
                type="button"
                onClick={() => setDialogStep("upload")}
                className="flex flex-col items-center gap-3 rounded-xl border-2 border-border hover:border-indigo-400 hover:bg-indigo-50/60 p-6 text-center transition-all group"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 group-hover:bg-indigo-200 transition-colors">
                  <Upload className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Upload Resume</p>
                  <p className="text-xs text-muted-foreground mt-0.5">AI reads & fills all fields automatically</p>
                </div>
                <span className="text-xs font-medium text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-full px-2.5 py-0.5">
                  Recommended
                </span>
              </button>

              <button
                type="button"
                onClick={() => setDialogStep("form")}
                className="flex flex-col items-center gap-3 rounded-xl border-2 border-border hover:border-indigo-400 hover:bg-indigo-50/60 p-6 text-center transition-all group"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted group-hover:bg-indigo-100 transition-colors">
                  <Pencil className="h-6 w-6 text-muted-foreground group-hover:text-indigo-600 transition-colors" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Fill Manually</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Enter candidate details by hand</p>
                </div>
              </button>
            </div>
          )}

          {/* ── Step 2a: Upload ── */}
          {!editingId && dialogStep === "upload" && (
            <div className="space-y-4">
              <div
                className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 text-center transition-colors cursor-pointer ${
                  dragOver ? "border-indigo-500 bg-indigo-50" : "border-border hover:border-indigo-300 hover:bg-muted/40"
                }`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  const file = e.dataTransfer.files[0];
                  if (file) handleFile(file);
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.txt,text/plain,application/pdf"
                  className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }}
                />
                {isParsing ? (
                  <div className="flex flex-col items-center gap-3 text-indigo-600">
                    <Loader2 className="h-10 w-10 animate-spin" />
                    <p className="font-medium">AI is reading the resume…</p>
                    <p className="text-xs text-muted-foreground">Extracting all fields — this takes a few seconds</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3 text-muted-foreground">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-50">
                      <FileText className="h-7 w-7 text-indigo-500" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Drag & drop or click to upload</p>
                      <p className="text-xs mt-1">PDF or TXT · Max 10 MB</p>
                    </div>
                    <Button type="button" variant="outline" size="sm" className="mt-1 gap-2" onClick={(e) => e.stopPropagation()}>
                      <Upload className="h-4 w-4" />
                      Choose File
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setDialogStep("choose")}
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => setDialogStep("form")}
                  className="text-xs text-indigo-600 hover:underline"
                >
                  Skip — fill manually instead
                </button>
              </div>
            </div>
          )}

          {/* ── Step 2b / Edit: Form ── */}
          {(dialogStep === "form" || !!editingId) && (
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* AI success banner */}
              {parsedOk && !editingId && (
                <div className="flex items-center gap-2.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <p className="text-xs text-emerald-700 font-medium flex-1">
                    AI auto-filled all fields from your resume — review and edit before saving.
                  </p>
                  <button
                    type="button"
                    onClick={() => { setDialogStep("upload"); setParsedOk(false); setForm(EMPTY_FORM); }}
                    className="text-xs text-emerald-600 hover:underline shrink-0"
                  >
                    Re-upload
                  </button>
                </div>
              )}

              {/* ── Personal Info ── */}
              <Section icon={UserCircle2} title="Personal Info" />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="firstName">First Name <span className="text-destructive">*</span></Label>
                  <Input id="firstName" placeholder="Jane" required {...f("firstName")} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lastName">Last Name <span className="text-destructive">*</span></Label>
                  <Input id="lastName" placeholder="Smith" required {...f("lastName")} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="jobTitle" className="flex items-center gap-1.5">
                    <BriefcaseIcon className="h-3.5 w-3.5 text-muted-foreground" />
                    Job Title
                  </Label>
                  <Input id="jobTitle" placeholder="Senior Software Engineer" {...f("jobTitle")} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="location" className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                    Location
                  </Label>
                  <Input id="location" placeholder="New York, NY" {...f("location")} />
                </div>
              </div>

              {/* ── Contact ── */}
              <Section icon={Mail} title="Contact" />

              <div className="space-y-1.5">
                <Label htmlFor="email" className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input id="email" type="email" placeholder="jane@example.com" required {...f("email")} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                    Phone
                  </Label>
                  <Input id="phone" placeholder="+1 555 000 0000" {...f("phone")} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="status">Status</Label>
                  <Select value={form.status} onValueChange={(v) => setForm((p) => ({ ...p, status: v as Candidate["status"] }))}>
                    <SelectTrigger id="status"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(STATUS_CONFIG).map(([value, { label }]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="linkedInUrl" className="flex items-center gap-1.5">
                    <Link2 className="h-3.5 w-3.5 text-muted-foreground" />
                    LinkedIn URL
                  </Label>
                  <Input id="linkedInUrl" placeholder="https://linkedin.com/in/janesmith" {...f("linkedInUrl")} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="portfolioUrl" className="flex items-center gap-1.5">
                    <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                    Portfolio / Website
                  </Label>
                  <Input id="portfolioUrl" placeholder="https://janesmith.dev" {...f("portfolioUrl")} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="githubUrl" className="flex items-center gap-1.5">
                    <GitBranch className="h-3.5 w-3.5 text-muted-foreground" />
                    GitHub URL
                  </Label>
                  <Input id="githubUrl" placeholder="https://github.com/janesmith" {...f("githubUrl")} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="resumeUrl" className="flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                    Resume URL
                  </Label>
                  <Input id="resumeUrl" placeholder="https://drive.google.com/…" {...f("resumeUrl")} />
                </div>
              </div>

              {/* ── Skills ── */}
              <Section icon={Star} title="Skills" />

              <div className="space-y-1.5">
                <Label htmlFor="skills" className="flex items-center gap-1.5">
                  <Star className="h-3.5 w-3.5 text-muted-foreground" />
                  Skills
                  <span className="text-xs text-muted-foreground font-normal ml-1">— comma-separated</span>
                </Label>
                <Textarea
                  id="skills"
                  rows={2}
                  placeholder="React, TypeScript, Node.js, Python, AWS, Docker, Agile…"
                  {...f("skills")}
                />
                {form.skills && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {form.skills.split(",").map((s) => s.trim()).filter(Boolean).map((skill) => (
                      <span key={skill} className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-xs text-indigo-700">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* ── Experience ── */}
              <Section icon={BriefcaseIcon} title="Work Experience" />

              <div className="space-y-1.5">
                <Label htmlFor="experience" className="flex items-center gap-1.5">
                  <BriefcaseIcon className="h-3.5 w-3.5 text-muted-foreground" />
                  Work Experience
                </Label>
                <Textarea
                  id="experience"
                  rows={5}
                  placeholder={"Acme Corp | Senior Engineer | 2021–Present | Led migration to microservices\nStartup Inc | Engineer | 2019–2021 | Built React dashboard"}
                  {...f("experience")}
                />
              </div>

              {/* ── Education ── */}
              <Section icon={GraduationCap} title="Education" />

              <div className="space-y-1.5">
                <Label htmlFor="education" className="flex items-center gap-1.5">
                  <GraduationCap className="h-3.5 w-3.5 text-muted-foreground" />
                  Education
                </Label>
                <Textarea
                  id="education"
                  rows={3}
                  placeholder={"MIT | B.Sc. Computer Science | 2019\nCoursera | AWS Certified Solutions Architect | 2021"}
                  {...f("education")}
                />
              </div>

              {/* ── Summary ── */}
              <Section icon={StickyNote} title="Professional Summary" />

              <div className="space-y-1.5">
                <Label htmlFor="notes" className="flex items-center gap-1.5">
                  <StickyNote className="h-3.5 w-3.5 text-muted-foreground" />
                  Summary / Notes
                </Label>
                <Textarea
                  id="notes"
                  rows={3}
                  placeholder="Senior engineer with 6+ years in full-stack development. Strong background in React and Node.js. Passionate about developer experience and open source."
                  {...f("notes")}
                />
              </div>

              <DialogFooter className="gap-2 pt-2">
                {!editingId && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setDialogStep("choose")}
                    className="mr-auto text-muted-foreground"
                  >
                    ← Back
                  </Button>
                )}
                <Button type="button" variant="outline" onClick={closeDialog}>
                  <X className="mr-2 h-4 w-4" />Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="bg-indigo-600 hover:bg-indigo-500 text-white">
                  {isSubmitting ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving…</>
                  ) : editingId ? (
                    <><Pencil className="mr-2 h-4 w-4" />Update Candidate</>
                  ) : (
                    <><Plus className="mr-2 h-4 w-4" />Save Candidate</>
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}

// ─── Candidate Card ───────────────────────────────────────────────────────────

function CandidateCard({
  candidate: c,
  onEdit,
  onDelete,
}: {
  candidate: Candidate;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const cfg = STATUS_CONFIG[c.status];
  return (
    <div className="group relative rounded-xl border border-border bg-card p-4 hover:border-indigo-200 hover:shadow-md hover:shadow-indigo-500/5 transition-all flex flex-col gap-3">
      <div className="absolute top-3 right-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}><Pencil className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onDelete} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-semibold text-sm">
          {initials(c)}
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-sm truncate">{c.firstName} {c.lastName}</p>
          {c.jobTitle && <p className="text-xs text-indigo-600 truncate">{c.jobTitle}</p>}
          <p className="text-xs text-muted-foreground truncate">{c.email}</p>
        </div>
      </div>

      <Badge className={`w-fit text-xs border ${cfg.className}`} variant="outline">{cfg.label}</Badge>

      {c.location && (
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" />{c.location}
        </p>
      )}
      {c.phone && (
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Phone className="h-3 w-3" />{c.phone}
        </p>
      )}

      {c.skills && c.skills.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {c.skills.slice(0, 3).map((s) => (
            <span key={s} className="rounded-full bg-indigo-50 border border-indigo-100 px-2 py-0.5 text-xs text-indigo-600">{s}</span>
          ))}
          {c.skills.length > 3 && (
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">+{c.skills.length - 3}</span>
          )}
        </div>
      )}

      <div className="flex gap-3 border-t border-border pt-2">
        {c.linkedInUrl && (
          <a href={c.linkedInUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-indigo-500 hover:underline" onClick={(e) => e.stopPropagation()}>
            <Link2 className="h-3 w-3" />LinkedIn
          </a>
        )}
        {c.githubUrl && (
          <a href={c.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-muted-foreground hover:underline" onClick={(e) => e.stopPropagation()}>
            <GitBranch className="h-3 w-3" />GitHub
          </a>
        )}
        {c.portfolioUrl && (
          <a href={c.portfolioUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-muted-foreground hover:underline" onClick={(e) => e.stopPropagation()}>
            <Globe className="h-3 w-3" />Portfolio
          </a>
        )}
      </div>
    </div>
  );
}

// ─── Candidate Table ──────────────────────────────────────────────────────────

function CandidateTable({
  candidates,
  onEdit,
  onDelete,
}: {
  candidates: Candidate[];
  onEdit: (c: Candidate) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 border-b border-border">
          <tr>
            <th className="text-left px-4 py-3 font-medium text-muted-foreground">Candidate</th>
            <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">Contact</th>
            <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">Skills</th>
            <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {candidates.map((c) => {
            const cfg = STATUS_CONFIG[c.status];
            return (
              <tr key={c._id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-semibold text-xs">
                      {initials(c)}
                    </div>
                    <div>
                      <p className="font-medium">{c.firstName} {c.lastName}</p>
                      {c.jobTitle && <p className="text-xs text-indigo-600">{c.jobTitle}</p>}
                      {c.location && <p className="text-xs text-muted-foreground">{c.location}</p>}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                  <p className="text-xs">{c.email}</p>
                  {c.phone && <p className="text-xs">{c.phone}</p>}
                </td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {c.skills?.slice(0, 3).map((s) => (
                      <span key={s} className="rounded-full bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 text-xs text-indigo-600">{s}</span>
                    ))}
                    {(c.skills?.length ?? 0) > 3 && (
                      <span className="text-xs text-muted-foreground">+{(c.skills?.length ?? 0) - 3}</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge className={`text-xs border ${cfg.className}`} variant="outline">{cfg.label}</Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(c)}><Pencil className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onDelete(c._id)} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ search, onAdd }: { search: string; onAdd: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-indigo-200 bg-indigo-50/50 py-16 text-center">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100">
        <UserCircle2 className="h-6 w-6 text-indigo-600" />
      </div>
      {search ? (
        <>
          <h3 className="text-base font-semibold mb-1">No results for &ldquo;{search}&rdquo;</h3>
          <p className="text-sm text-muted-foreground">Try a different name, email or job title</p>
        </>
      ) : (
        <>
          <h3 className="text-base font-semibold mb-1">No candidates yet</h3>
          <p className="text-sm text-muted-foreground max-w-xs mb-4">
            Add your first candidate — upload a resume and AI fills all fields automatically.
          </p>
          <Button onClick={onAdd} className="bg-indigo-600 hover:bg-indigo-500 text-white gap-2">
            <Plus className="h-4 w-4" />Add Candidate
          </Button>
        </>
      )}
    </div>
  );
}

