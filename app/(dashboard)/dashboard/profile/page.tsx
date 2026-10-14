"use client";

import { useEffect, useState, useRef } from "react";
import {
  UserIcon,
  MailIcon,
  PhoneIcon,
  ShieldCheckIcon,
  SaveIcon,
  CameraIcon,
  CheckCircle2Icon,
  Edit3Icon,
  LockIcon,
  ShieldIcon,
  CalendarIcon,
  XIcon,
  CheckIcon,
  GiftIcon,
  CopyIcon,
  SparklesIcon,
  Building2Icon,
  Link2Icon,
  Share2Icon,
  UsersIcon,
  ExternalLinkIcon,
  MessageSquareIcon,
  ArrowRightIcon,
  PlusIcon,
} from "lucide-react";
import { toast } from "sonner";

import { useAuthStore } from "@/stores/auth-store";
import { useWorkspaceStore } from "@/stores/workspace-store";
import { getCurrentUserProfile, updateUserProfile, applyReferralCode } from "@/lib/api/services/users";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { Badge } from "@/components/ui/badge";
import { JoinWorkspaceModal } from "@/components/dashboard/join-workspace-modal";

type ProfileTab = "bio-data" | "roles" | "profile-image" | "referrals";

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  const workspaces = useWorkspaceStore((s) => s.workspaces);
  const orgWorkspaces = workspaces.filter((w) => !w.isPersonal);
  const hasOrganizations = orgWorkspaces.length > 0;

  const [activeTab, setActiveTab] = useState<ProfileTab>("bio-data");
  const [activeLinkMode, setActiveLinkMode] = useState<"personal" | "department">("personal");
  const [selectedOrgId, setSelectedOrgId] = useState<string>("");
  const [copiedPersonal, setCopiedPersonal] = useState(false);
  const [copiedDept, setCopiedDept] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [workspaceModalOpen, setWorkspaceModalOpen] = useState(false);
  const [workspaceModalTab, setWorkspaceModalTab] = useState<"create" | "join">("create");

  // Referral code claim state
  const [referralInput, setReferralInput] = useState("");
  const [claimingReferral, setClaimingReferral] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [title, setTitle] = useState(user?.title || "");
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
  const [location, setLocation] = useState(user?.location || "");
  const [profileImageUrl, setProfileImageUrl] = useState(user?.profileImageUrl || "");

  const [_loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        const latestUser = await getCurrentUserProfile();
        if (latestUser) {
          setUser(latestUser);
          setTitle(latestUser.title || "");
          setFullName(latestUser.fullName || "");
          setEmail(latestUser.email || "");
          setPhoneNumber(latestUser.phoneNumber || "");
          setLocation(latestUser.location || "");
          setProfileImageUrl(latestUser.profileImageUrl || "");
        } else if (user) {
          setTitle(user.title || "");
          setFullName(user.fullName || "");
          setEmail(user.email || "");
          setPhoneNumber(user.phoneNumber || "");
          setLocation(user.location || "");
          setProfileImageUrl(user.profileImageUrl || "");
        }
      } catch {
        if (user) {
          setTitle(user.title || "");
          setFullName(user.fullName || "");
          setEmail(user.email || "");
          setPhoneNumber(user.phoneNumber || "");
          setLocation(user.location || "");
          setProfileImageUrl(user.profileImageUrl || "");
        }
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [setUser]);

  useEffect(() => {
    if (orgWorkspaces.length > 0 && !selectedOrgId) {
      setSelectedOrgId(orgWorkspaces[0].id);
    }
  }, [orgWorkspaces, selectedOrgId]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab");
      if (tabParam === "referrals" || tabParam === "invites" || tabParam === "referral") {
        setActiveTab("referrals");
      }
    }
  }, []);

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const referralCode = user?.referralCode || "LECTURA";
  const personalInviteUrl = `${origin}/register?ref=${referralCode}`;

  const currentOrg = orgWorkspaces.find((w) => w.id === selectedOrgId) || orgWorkspaces[0];
  const deptInviteCode = currentOrg?.inviteCode || "";
  const deptInviteUrl = `${origin}/join?org=${deptInviteCode}`;

  function copyPersonalLink() {
    navigator.clipboard.writeText(personalInviteUrl);
    setCopiedPersonal(true);
    toast.success("Personal referral link copied to clipboard!", {
      description: personalInviteUrl,
    });
    setTimeout(() => setCopiedPersonal(false), 3000);
  }

  function copyPersonalCode() {
    navigator.clipboard.writeText(referralCode);
    setCopiedCode(true);
    toast.success(`Referral code copied: ${referralCode}`);
    setTimeout(() => setCopiedCode(false), 3000);
  }

  function copyDepartmentLink() {
    if (!deptInviteUrl) return;
    navigator.clipboard.writeText(deptInviteUrl);
    setCopiedDept(true);
    toast.success(`Department invite link for ${currentOrg?.name} copied!`, {
      description: deptInviteUrl,
    });
    setTimeout(() => setCopiedDept(false), 3000);
  }

  function shareOnWhatsApp() {
    const text = encodeURIComponent(
      `Hello colleague! Join me on Lectura to synthesize exam questions and Bloom's taxonomy assessments: ${personalInviteUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  }

  function shareViaEmail() {
    const subject = encodeURIComponent("Invitation to join Lectura AI Assessment Platform");
    const body = encodeURIComponent(
      `Hello colleague,\n\nI invite you to try Lectura for synthesizing exam questions and academic assessments.\n\nSign up using my personal invitation link: ${personalInviteUrl}\n\nBest regards,\n${fullName || user?.email}`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  }

  async function handleClaimReferralBonus() {
    if (!referralInput.trim()) {
      toast.error("Please enter a referral code.");
      return;
    }
    setClaimingReferral(true);
    try {
      const res = await applyReferralCode(referralInput.trim());
      toast.success("Referral code applied!", {
        description: res.message || "Your colleague was credited with +200 bonus credits.",
      });
      setReferralInput("");
      const latestUser = await getCurrentUserProfile();
      if (latestUser) setUser(latestUser);
    } catch (err: any) {
      toast.error("Referral claim failed", {
        description: err?.response?.data?.message || err?.message || "Invalid or already applied referral code.",
      });
    } finally {
      setClaimingReferral(false);
    }
  }

  const _isOrganization = user?.accountType === 2 || !!user?.institutionName;
  const isAdmin = user?.role === "InstitutionAdmin" || user?.role === "SystemAdmin" || user?.accountType === 2;
  const assignedRoleName = isAdmin ? "Institution Admin" : "Lecturer / Director";

  async function handleSaveProfile(e?: React.FormEvent) {
    if (e) e.preventDefault();
    try {
      setSaving(true);
      const updatedUser = await updateUserProfile({
        title,
        fullName,
        phoneNumber,
        location,
        profileImageUrl,
      });
      setUser(updatedUser);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to update profile. Please try again.";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image file must be under 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        // SAFETY: readAsDataURL guarantees string result when file is image/*
        const result = reader.result as string;
        setProfileImageUrl(result);
        toast.success("Profile photo preview updated. Click 'Save Changes' to apply.");
      };
      reader.readAsDataURL(file);
    }
  }

  const initials = fullName
    ? fullName
        .split(" ")
        .filter(Boolean)
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : email
    ? email[0].toUpperCase()
    : "U";

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Design System Hero Header Container */}
      <div className="relative rounded-2xl border border-border/80 bg-card overflow-hidden shadow-sm">
        {/* Signature Rainforest Moss & Botanical Gradient Banner */}
        <div className="h-36 sm:h-44 w-full bg-linear-to-r from-[#1c2914] via-[#2d3e1f] to-[#38492A] dark:from-[#0d140b] dark:via-[#162212] dark:to-[#1e2e19] relative flex items-center justify-end px-8 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(143,179,115,0.25),transparent_60%)]" />
          <div className="absolute -left-12 -bottom-12 size-48 rounded-full bg-[#80802B]/15 blur-2xl" />
          <div className="hidden sm:block text-right z-10">
            <span className="text-[#8FB373]/90 text-xs font-mono tracking-widest uppercase">Lecturra Academic Identity</span>
            <p className="text-white font-heading text-lg font-semibold">{email || "user@lectura.com"}</p>
          </div>
        </div>

        {/* User Identity & Avatar Overlay */}
        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col items-center text-center -mt-16 sm:-mt-20">
            {/* Avatar Circle with Camera Overlay */}
            <div className="relative group">
              <div className="size-28 sm:size-32 rounded-full border-4 border-card bg-[#24331a] text-white flex items-center justify-center text-3xl font-bold shadow-xl overflow-hidden ring-2 ring-[#38492A]/20 dark:ring-[#8FB373]/30">
                {profileImageUrl ? (
                  <img src={profileImageUrl} alt={fullName || "User Profile"} className="size-full object-cover" />
                ) : (
                  <span className="font-heading font-extrabold text-[#8FB373]">{initials}</span>
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-1 right-1 bg-[#38492A] hover:bg-[#2C3B20] text-white dark:bg-[#8FB373] dark:text-[#11160E] dark:hover:bg-[#A3C687] p-2 rounded-full shadow-md transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring"
                title="Upload Profile Image"
              >
                <CameraIcon className="size-4" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {/* Email / Full Name Display */}
            <h1 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-foreground mt-3">
              {title ? `${title} ` : ""}{fullName || email || "Academic User"}
            </h1>

            {/* User Meta Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
              <Badge variant="secondary" className="gap-1.5 px-3 py-1 font-semibold text-xs bg-[#38492A]/10 text-[#38492A] dark:bg-[#8FB373]/15 dark:text-[#8FB373] border border-[#38492A]/20 dark:border-[#8FB373]/30">
                <ShieldIcon className="size-3.5" /> {assignedRoleName}
              </Badge>
              <Badge variant="outline" className="gap-1.5 px-3 py-1 text-xs text-muted-foreground border-border">
                <CalendarIcon className="size-3.5" /> Joined: Active Staff
              </Badge>
            </div>

            {/* Account Status Badge */}
            <div className="mt-3">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2Icon className="size-3.5 text-emerald-600 dark:text-emerald-400" /> Account Status: Verified
              </span>
            </div>
          </div>

          {/* Navigation Bar Tabs */}
          <div className="mt-8 border-t border-border/60 pt-4 flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <button
              onClick={() => setActiveTab("bio-data")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "bio-data"
                  ? "bg-[#38492A] text-white shadow-sm dark:bg-[#8FB373] dark:text-[#11160E]"
                  : "text-muted-foreground hover:bg-[#38492A]/5 hover:text-[#38492A] dark:hover:bg-[#8FB373]/10 dark:hover:text-[#8FB373]"
              }`}
            >
              <UserIcon className="size-4" /> Bio-Data
            </button>
            <button
              onClick={() => setActiveTab("roles")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "roles"
                  ? "bg-[#38492A] text-white shadow-sm dark:bg-[#8FB373] dark:text-[#11160E]"
                  : "text-muted-foreground hover:bg-[#38492A]/5 hover:text-[#38492A] dark:hover:bg-[#8FB373]/10 dark:hover:text-[#8FB373]"
              }`}
            >
              <ShieldIcon className="size-4" /> Role Selection (1)
            </button>
            <button
              onClick={() => setActiveTab("profile-image")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "profile-image"
                  ? "bg-[#38492A] text-white shadow-sm dark:bg-[#8FB373] dark:text-[#11160E]"
                  : "text-muted-foreground hover:bg-[#38492A]/5 hover:text-[#38492A] dark:hover:bg-[#8FB373]/10 dark:hover:text-[#8FB373]"
              }`}
            >
              <CameraIcon className="size-4" /> Profile Image
            </button>
            <button
              onClick={() => setActiveTab("referrals")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "referrals"
                  ? "bg-[#38492A] text-white shadow-sm dark:bg-[#8FB373] dark:text-[#11160E]"
                  : "text-muted-foreground hover:bg-[#38492A]/5 hover:text-[#38492A] dark:hover:bg-[#8FB373]/10 dark:hover:text-[#8FB373]"
              }`}
            >
              <GiftIcon className={`size-4 ${activeTab === "referrals" ? "text-white dark:text-[#11160E]" : "text-[#80802B] dark:text-[#8FB373]"}`} /> Referrals & Invites
              {(user?.referralCount ?? 0) > 0 && (
                <Badge className={`ml-1 text-[10px] px-1.5 py-0 border-none font-mono ${
                  activeTab === "referrals"
                    ? "bg-white/20 text-white dark:bg-[#11160E]/20 dark:text-[#11160E]"
                    : "bg-[#38492A]/10 text-[#38492A] dark:bg-[#8FB373]/20 dark:text-[#8FB373]"
                }`}>
                  {user?.referralCount}
                </Badge>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: BIO-DATA */}
      {activeTab === "bio-data" && (
        <div className="space-y-6">
          {/* Personal Overview Card */}
          <Card className="border border-border/80 shadow-sm">
            <CardHeader className="pb-3 border-b border-border/40">
              <span className="text-[11px] font-mono tracking-wider text-muted-foreground uppercase">
                Personal Overview
              </span>
            </CardHeader>
            <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/40 border border-border/40">
                <div className="p-2 rounded-lg bg-[#38492A]/10 dark:bg-[#8FB373]/15 text-[#38492A] dark:text-[#8FB373]">
                  <MailIcon className="size-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase block">
                    Email
                  </span>
                  <p className="text-xs font-semibold text-foreground truncate max-w-42.5" title={email}>
                    {email || "Not provided"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/40 border border-border/40">
                <div className="p-2 rounded-lg bg-[#38492A]/10 dark:bg-[#8FB373]/15 text-[#38492A] dark:text-[#8FB373]">
                  <PhoneIcon className="size-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase block">
                    Phone
                  </span>
                  <p className="text-xs font-semibold text-foreground">
                    {phoneNumber || "Not provided"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/40 border border-border/40">
                <div className="p-2 rounded-lg bg-[#38492A]/10 dark:bg-[#8FB373]/15 text-[#38492A] dark:text-[#8FB373]">
                  <UserIcon className="size-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase block">
                    Academic Title
                  </span>
                  <p className="text-xs font-semibold text-foreground">
                    {title || "Not specified"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/40 border border-border/40">
                <div className="p-2 rounded-lg bg-[#38492A]/10 dark:bg-[#8FB373]/15 text-[#38492A] dark:text-[#8FB373]">
                  <ShieldCheckIcon className="size-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase block">
                    Assigned Roles
                  </span>
                  <Badge variant="secondary" className="mt-0.5 text-[10px] font-bold bg-[#38492A]/10 text-[#38492A] dark:bg-[#8FB373]/15 dark:text-[#8FB373] border-none">
                    {assignedRoleName}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Basic Profile Information Card */}
          <Card className="border border-border/80 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border/40">
              <div>
                <CardTitle className="text-lg font-bold">Basic Profile Information</CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  View and update your personal bio-data details.
                </CardDescription>
              </div>
              <Button
                variant={isEditing ? "outline" : "default"}
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                className="gap-2 text-xs font-semibold"
              >
                {isEditing ? (
                  <>
                    <XIcon className="size-3.5" /> Cancel Editing
                  </>
                ) : (
                  <>
                    <Edit3Icon className="size-3.5" /> Edit Profile
                  </>
                )}
              </Button>
            </CardHeader>
            <CardContent className="pt-6">
              {isEditing ? (
                /* EDIT FORM */
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Field className="col-span-1">
                      <FieldLabel htmlFor="title">Title</FieldLabel>
                      <select
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="h-9 w-full min-w-0 rounded-lg border border-input bg-background px-3 py-1.5 text-xs text-foreground transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                      >
                        <option value="">Select Title</option>
                        <option value="Prof.">Prof.</option>
                        <option value="Dr.">Dr.</option>
                        <option value="Mr.">Mr.</option>
                        <option value="Mrs.">Mrs.</option>
                        <option value="Ms.">Ms.</option>
                        <option value="Engr.">Engr.</option>
                        <option value="Arc.">Arc.</option>
                        <option value="Pharm.">Pharm.</option>
                      </select>
                    </Field>

                    <Field className="sm:col-span-2">
                      <FieldLabel htmlFor="fullName">Full Name *</FieldLabel>
                      <Input
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Enter full name"
                        required
                      />
                    </Field>
                  </div>

                  <Field>
                    <div className="flex items-center justify-between">
                      <FieldLabel htmlFor="email">Username (Email)</FieldLabel>
                      <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <LockIcon className="size-3" /> Managed by System Admin
                      </span>
                    </div>
                    <Input id="email" value={email} disabled className="bg-muted/50 cursor-not-allowed text-xs" />
                  </Field>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field>
                      <FieldLabel htmlFor="phoneNumber">Phone Number</FieldLabel>
                      <Input
                        id="phoneNumber"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+234..."
                      />
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="location">Location</FieldLabel>
                      <Input
                        id="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Lagos, Nigeria"
                      />
                    </Field>
                  </div>

                  <Field>
                    <FieldLabel htmlFor="profileImageUrl">Profile Photo URL</FieldLabel>
                    <Input
                      id="profileImageUrl"
                      value={profileImageUrl}
                      onChange={(e) => setProfileImageUrl(e.target.value)}
                      placeholder="https://example.com/photo.jpg"
                    />
                  </Field>

                  <div className="pt-4 flex justify-end gap-3 border-t border-border/40">
                    <Button type="button" variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" size="sm" disabled={saving} className="gap-2">
                      <SaveIcon className="size-4" />
                      {saving ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              ) : (
                /* READ-ONLY DISPLAY (MATCHING REFERENCE DESIGN) */
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase block font-semibold">
                      TITLE
                    </label>
                    <div className="p-2.5 rounded-lg bg-muted/30 border border-border/50 text-xs font-medium text-foreground">
                      {title || "—"}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase block font-semibold">
                        USERNAME (EMAIL)
                      </label>
                      <button
                        type="button"
                        onClick={() => toast.info("To change your email address, contact your institution administrator.")}
                        className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        Request Email Change
                      </button>
                    </div>
                    <div className="p-2.5 rounded-lg bg-muted/40 border border-border/50 text-xs font-medium text-foreground flex items-center justify-between">
                      <span>{email || "—"}</span>
                      <LockIcon className="size-3.5 text-muted-foreground" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase block font-semibold">
                      FULL NAME *
                    </label>
                    <div className="p-2.5 rounded-lg bg-muted/30 border border-border/50 text-xs font-medium text-foreground">
                      {fullName || "—"}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase block font-semibold">
                      PHONE NUMBER
                    </label>
                    <div className="p-2.5 rounded-lg bg-muted/30 border border-border/50 text-xs font-medium text-foreground">
                      {phoneNumber || "—"}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase block font-semibold">
                      LOCATION
                    </label>
                    <div className="p-2.5 rounded-lg bg-muted/30 border border-border/50 text-xs font-medium text-foreground">
                      {location || "—"}
                    </div>
                  </div>

                  {/* Highlighted Assigned System Roles Callout */}
                  <div className="mt-6 rounded-xl border border-[#38492A]/20 dark:border-[#8FB373]/30 bg-[#38492A]/5 dark:bg-[#8FB373]/10 p-4 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#38492A] dark:text-[#8FB373]">
                      <ShieldIcon className="size-4 text-[#38492A] dark:text-[#8FB373]" />
                      Assigned System Roles
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Below are all administrative & instructional roles assigned to your user account across the portal.
                    </p>
                    <div className="pt-2 flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-background border border-[#38492A]/30 dark:border-[#8FB373]/40 text-[#38492A] dark:text-[#8FB373] shadow-xs">
                        <CheckIcon className="size-3.5 text-[#38492A] dark:text-[#8FB373]" />
                        {assignedRoleName}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 2: ROLE SELECTION */}
      {activeTab === "roles" && (
        <Card className="border border-border/80 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Role Selection & Portal Permissions</CardTitle>
            <CardDescription className="text-xs">
              Manage active institutional roles and system authorization settings.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-xl border border-border/60 bg-muted/20 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold">{assignedRoleName}</h4>
                  <p className="text-xs text-muted-foreground">Primary Instructional & Examination Governance Role</p>
                </div>
                <Badge className="bg-[#38492A] text-white dark:bg-[#8FB373] dark:text-[#11160E] text-xs">Active Role</Badge>
              </div>
              <p className="text-xs text-muted-foreground border-t border-border/40 pt-2">
                This role grants permission to generate course assessments, manage question banks, review student submissions, and export exam packages (PDF, Aiken, GIFT).
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* TAB 3: PROFILE IMAGE */}
      {activeTab === "profile-image" && (
        <Card className="border border-border/80 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Profile Image Management</CardTitle>
            <CardDescription className="text-xs">
              Upload a new photo or enter an image URL for your academic profile avatar.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="size-36 rounded-full border-4 border-primary/20 bg-muted flex items-center justify-center text-4xl font-bold overflow-hidden shadow-lg">
                {profileImageUrl ? (
                  <img src={profileImageUrl} alt="Avatar Preview" className="size-full object-cover" />
                ) : (
                  <span className="font-heading text-primary">{initials}</span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <Button size="sm" onClick={() => fileInputRef.current?.click()} className="gap-2">
                  <CameraIcon className="size-4" /> Upload Image File
                </Button>
                {profileImageUrl && (
                  <Button variant="outline" size="sm" onClick={() => setProfileImageUrl("")} className="text-destructive">
                    Remove Image
                  </Button>
                )}
              </div>
            </div>

            <Field>
              <FieldLabel htmlFor="avatarUrlInput">Direct Image URL</FieldLabel>
              <Input
                id="avatarUrlInput"
                value={profileImageUrl}
                onChange={(e) => setProfileImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
              />
            </Field>

            <div className="flex justify-end pt-2">
              <Button size="sm" onClick={() => handleSaveProfile()} disabled={saving} className="gap-2 bg-[#38492A] hover:bg-[#2C3B20] text-white dark:bg-[#8FB373] dark:text-[#11160E]">
                <SaveIcon className="size-4" /> Save Profile Image
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* TAB 4: REFERRALS & INVITES */}
      {activeTab === "referrals" && (
        <div className="space-y-6">
          {/* Main Referral & Invitation Card */}
          <Card className="border border-border/80 shadow-sm overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-[#38492A]/10 via-[#80802B]/5 to-transparent pb-4 border-b border-border/40">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="gap-1 border-[#38492A]/30 text-[#38492A] dark:text-[#8FB373] font-semibold bg-[#38492A]/5">
                      <GiftIcon className="size-3.5" /> Educator Invitation Hub
                    </Badge>
                    <Badge className="bg-[#38492A]/10 text-[#38492A] dark:text-[#8FB373] border-[#38492A]/30 font-mono text-[10px]">
                      +200 Credits / Colleague
                    </Badge>
                  </div>
                  <CardTitle className="text-xl font-bold font-heading">
                    Invite Colleagues & Share Access
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Share your personal referral link to earn bonus credits, or invite faculty members directly into your department workspace.
                  </CardDescription>
                </div>

                {/* Mode Selector & Department Creator */}
                <div className="flex items-center gap-2 shrink-0">
                  {hasOrganizations && (
                    <div className="inline-flex rounded-lg border border-border/80 bg-muted/60 p-1">
                      <button
                        type="button"
                        onClick={() => setActiveLinkMode("personal")}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                          activeLinkMode === "personal"
                            ? "bg-background text-[#38492A] dark:text-[#8FB373] shadow-xs font-bold"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <UserIcon className="size-3.5 text-[#38492A] dark:text-[#8FB373]" />
                        Personal Link
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveLinkMode("department")}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                          activeLinkMode === "department"
                            ? "bg-background text-foreground shadow-xs"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <Building2Icon className="size-3.5 text-sky-600 dark:text-sky-400" />
                        Department Link
                      </button>
                    </div>
                  )}

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setWorkspaceModalTab("create");
                      setWorkspaceModalOpen(true);
                    }}
                    className="gap-1.5 text-xs font-semibold text-primary border-primary/30 hover:bg-primary/10"
                  >
                    <PlusIcon className="size-3.5" />
                    Create Department
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              {/* VIEW A: PERSONAL REFERRAL LINK */}
              {activeLinkMode === "personal" && (
                <div className="space-y-6">
                  {/* Metric Summary Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="rounded-xl border border-border/70 bg-card p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-muted-foreground">Colleagues Invited</span>
                        <div className="flex size-8 items-center justify-center rounded-lg bg-[#38492A]/10 text-[#38492A] dark:text-[#8FB373]">
                          <UsersIcon className="size-4" />
                        </div>
                      </div>
                      <p className="text-2xl font-bold font-heading mt-2">
                        {(user?.referralCount ?? 0).toLocaleString()}
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-1">Total educators who joined</p>
                    </div>

                    <div className="rounded-xl border border-border/70 bg-card p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-muted-foreground">Credits Earned</span>
                        <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                          <SparklesIcon className="size-4" />
                        </div>
                      </div>
                      <p className="text-2xl font-bold font-heading mt-2 text-emerald-600 dark:text-emerald-400 font-mono">
                        {((user?.referralCount ?? 0) * 200).toLocaleString()}
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-1">+200 credits for each friend</p>
                    </div>

                    <div className="rounded-xl border border-border/70 bg-card p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-muted-foreground">Bonus Rate</span>
                        <div className="flex size-8 items-center justify-center rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400">
                          <GiftIcon className="size-4" />
                        </div>
                      </div>
                      <p className="text-2xl font-bold font-heading mt-2 text-sky-600 dark:text-sky-400 font-mono">
                        +200
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-1">Per educator activation</p>
                    </div>

                    <div className="rounded-xl border border-border/70 bg-card p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-muted-foreground">Invite Limit</span>
                        <div className="flex size-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                          <CheckCircle2Icon className="size-4" />
                        </div>
                      </div>
                      <p className="text-2xl font-bold font-heading mt-2 text-foreground font-mono">
                        Unlimited
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-1">No cap on colleague rewards</p>
                    </div>
                  </div>

                  {/* Shareable Link Box */}
                  <div className="rounded-2xl border border-[#38492A]/30 bg-[#38492A]/5 p-5 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <Link2Icon className="size-4 text-[#38492A] dark:text-[#8FB373]" />
                          <h3 className="text-sm font-bold text-foreground">Your Personal Referral Link</h3>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Colleagues can sign up via email or 1-click Google SSO using this link.
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground font-medium">Your Code:</span>
                        <Badge
                          variant="outline"
                          onClick={copyPersonalCode}
                          className="font-mono text-xs font-bold border-[#38492A]/40 text-[#38492A] dark:text-[#8FB373] bg-background cursor-pointer hover:bg-muted"
                          title="Click to copy code"
                        >
                          {referralCode}
                        </Badge>
                      </div>
                    </div>

                    {/* Copy Input Bar */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <Input
                        readOnly
                        value={personalInviteUrl}
                        className="font-mono text-xs bg-background select-all h-10"
                      />
                      <Button
                        type="button"
                        size="sm"
                        onClick={copyPersonalLink}
                        className="h-10 px-4 shrink-0 bg-[#38492A] hover:bg-[#2C3B20] text-white dark:bg-[#8FB373] dark:text-[#11160E] font-semibold text-xs gap-1.5"
                      >
                        {copiedPersonal ? (
                          <>
                            <CheckCircle2Icon className="size-4 text-white" />
                            Copied Link
                          </>
                        ) : (
                          <>
                            <CopyIcon className="size-4" />
                            Copy Referral Link
                          </>
                        )}
                      </Button>
                    </div>

                    {/* Quick Share Buttons */}
                    <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#38492A]/20">
                      <span className="text-xs font-semibold text-muted-foreground mr-1">Share via:</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="xs"
                        onClick={shareOnWhatsApp}
                        className="gap-1.5 text-xs bg-background hover:bg-emerald-500/10 hover:text-emerald-600 hover:border-emerald-500/30"
                      >
                        <MessageSquareIcon className="size-3.5 text-emerald-600" /> WhatsApp
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="xs"
                        onClick={shareViaEmail}
                        className="gap-1.5 text-xs bg-background hover:bg-sky-500/10 hover:text-sky-600 hover:border-sky-500/30"
                      >
                        <MailIcon className="size-3.5 text-sky-600" /> Email Invitation
                      </Button>
                    </div>
                  </div>

                  {/* Program Rules Note */}
                  <div className="rounded-xl border border-border/80 bg-muted/40 p-4 space-y-1.5 text-xs">
                    <div className="flex items-center gap-2 font-semibold text-foreground">
                      <SparklesIcon className="size-4 text-[#38492A] dark:text-[#8FB373]" />
                      <span>How Bonus Attribution Works</span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      Only you receive the <strong>+200 bonus credits</strong> when an educator signs up through your personal referral link. Your colleague receives the standard 1,500 initial synthesis credits upon registration. You can refer an unlimited number of educators—every single successful registration rewards you with +200 credits immediately!
                    </p>
                  </div>
                </div>
              )}

              {/* VIEW B: DEPARTMENT / ORGANIZATION LINK */}
              {activeLinkMode === "department" && hasOrganizations && (
                <div className="space-y-6">
                  {/* Department Selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <Building2Icon className="size-4 text-sky-600 dark:text-sky-400" />
                      Select Department / Institutional Workspace
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {orgWorkspaces.map((org) => {
                        const isSelected = org.id === selectedOrgId || (!selectedOrgId && org === orgWorkspaces[0]);
                        return (
                          <div
                            key={org.id}
                            onClick={() => setSelectedOrgId(org.id)}
                            className={`p-3 rounded-xl border cursor-pointer transition-all ${
                              isSelected
                                ? "border-sky-500/80 bg-sky-500/10 ring-1 ring-sky-500/30"
                                : "border-border/80 bg-card hover:bg-muted/50"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-xs text-foreground truncate">{org.name}</span>
                              <Badge variant="outline" className="text-[10px] font-mono border-sky-500/30 text-sky-600">
                                {org.role}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between mt-2 text-[11px] text-muted-foreground">
                              <span>{org.credits.toLocaleString()} Shared Credits</span>
                              <span className="font-mono">{org.inviteCode || "ORG"}</span>
                            </div>
                          </div>
                        );
                      })}

                      <button
                        type="button"
                        onClick={() => {
                          setWorkspaceModalTab("create");
                          setWorkspaceModalOpen(true);
                        }}
                        className="p-3 rounded-xl border border-dashed border-border hover:border-primary/50 bg-muted/20 hover:bg-primary/5 text-left transition-all flex flex-col justify-center items-center gap-1 text-center min-h-[72px]"
                      >
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                          <PlusIcon className="size-3.5" />
                          <span>Add Another Department</span>
                        </div>
                        <span className="text-[10px] text-muted-foreground">Start a new shared pool</span>
                      </button>
                    </div>
                  </div>

                  {/* Department Shareable Onboarding URL */}
                  <div className="rounded-2xl border border-sky-500/30 bg-sky-500/5 p-5 space-y-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Building2Icon className="size-4 text-sky-600 dark:text-sky-400" />
                        <h3 className="text-sm font-bold text-foreground">
                          Department Onboarding URL ({currentOrg?.name})
                        </h3>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Invite colleagues to connect their accounts directly into this department&apos;s shared credit pool.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <Input
                        readOnly
                        value={deptInviteUrl}
                        className="font-mono text-xs bg-background select-all h-10"
                      />
                      <Button
                        type="button"
                        size="sm"
                        onClick={copyDepartmentLink}
                        className="h-10 px-4 shrink-0 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs gap-1.5"
                      >
                        {copiedDept ? (
                          <>
                            <CheckCircle2Icon className="size-4 text-white" />
                            Copied Link
                          </>
                        ) : (
                          <>
                            <CopyIcon className="size-4" />
                            Copy Department Link
                          </>
                        )}
                      </Button>
                    </div>

                    <div className="rounded-xl border border-sky-500/20 bg-background/80 p-3.5 space-y-1 text-xs">
                      <div className="font-semibold text-sky-700 dark:text-sky-300 flex items-center gap-1.5">
                        <SparklesIcon className="size-3.5" />
                        <span>Frictionless Google & Microsoft SSO Onboarding</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        Colleagues who open this link can sign in with 1-click Google or Microsoft SSO. Their accounts will be automatically created and enrolled into <strong>{currentOrg?.name}</strong> with immediate access to shared credits.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* RETROACTIVE CLAIM BOX: Enter Colleague's Referral Code */}
              <div className="border-t border-border/60 pt-6">
                <div className="rounded-xl border border-border/80 bg-muted/30 p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <GiftIcon className="size-3.5 text-purple-600 dark:text-purple-400" />
                      Were you invited by another educator?
                    </h4>
                    <p className="text-[11px] text-muted-foreground">
                      {user?.referredByReferralCode ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                          <CheckCircle2Icon className="size-3" /> You were invited with code:{" "}
                          <strong className="font-mono">{user.referredByReferralCode}</strong>
                        </span>
                      ) : (
                        "Enter your colleague's referral code to credit them with +200 bonus credits for introducing you."
                      )}
                    </p>
                  </div>

                  {!user?.referredByReferralCode && (
                    <div className="flex items-center gap-2 shrink-0 sm:w-80">
                      <Input
                        placeholder="e.g. REF-4A9B2C1F"
                        value={referralInput}
                        onChange={(e) => setReferralInput(e.target.value.toUpperCase())}
                        className="h-8 text-xs font-mono uppercase bg-background"
                      />
                      <Button
                        size="sm"
                        onClick={handleClaimReferralBonus}
                        disabled={claimingReferral || !referralInput.trim()}
                        className="h-8 text-xs font-semibold shrink-0 bg-[#38492A] hover:bg-[#2C3B20] text-white dark:bg-[#8FB373] dark:text-[#11160E]"
                      >
                        {claimingReferral ? "Crediting..." : "Credit Colleague"}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Manual Join / Create Workspace Modal */}
      <JoinWorkspaceModal
        open={workspaceModalOpen}
        onOpenChange={setWorkspaceModalOpen}
        initialTab={workspaceModalTab}
      />
    </div>
  );
}
