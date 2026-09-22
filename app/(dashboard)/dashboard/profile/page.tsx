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
} from "lucide-react";
import { toast } from "sonner";

import { useAuthStore } from "@/stores/auth-store";
import { getCurrentUserProfile, updateUserProfile } from "@/lib/api/services/users";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { Badge } from "@/components/ui/badge";

type ProfileTab = "bio-data" | "roles" | "profile-image";

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  const [activeTab, setActiveTab] = useState<ProfileTab>("bio-data");
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
        {/* Deep Navy Gradient Banner */}
        <div className="h-36 sm:h-44 w-full bg-linear-to-r from-[#0a1128] via-[#101b42] to-[#1e1b4b] relative flex items-center justify-end px-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.2),transparent_50%)]" />
          <div className="hidden sm:block text-right z-10">
            <span className="text-white/40 text-xs font-mono tracking-widest uppercase">Lecturra Academic Identity</span>
            <p className="text-white/80 font-heading text-lg font-medium">{email || "user@lectura.com"}</p>
          </div>
        </div>

        {/* User Identity & Avatar Overlay */}
        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col items-center text-center -mt-16 sm:-mt-20">
            {/* Avatar Circle with Camera Overlay */}
            <div className="relative group">
              <div className="size-28 sm:size-32 rounded-full border-4 border-card bg-[#0b132b] text-white flex items-center justify-center text-3xl font-bold shadow-xl overflow-hidden">
                {profileImageUrl ? (
                  <img src={profileImageUrl} alt={fullName || "User Profile"} className="size-full object-cover" />
                ) : (
                  <span className="font-heading font-extrabold text-indigo-400">{initials}</span>
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-1 right-1 bg-primary hover:bg-primary/90 text-primary-foreground p-2 rounded-full shadow-md transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring"
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
              <Badge variant="secondary" className="gap-1.5 px-3 py-1 font-medium text-xs bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
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
                  ? "bg-[#0b132b] text-white shadow-sm dark:bg-primary dark:text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <UserIcon className="size-4" /> Bio-Data
            </button>
            <button
              onClick={() => setActiveTab("roles")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "roles"
                  ? "bg-[#0b132b] text-white shadow-sm dark:bg-primary dark:text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <ShieldIcon className="size-4" /> Role Selection (1)
            </button>
            <button
              onClick={() => setActiveTab("profile-image")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "profile-image"
                  ? "bg-[#0b132b] text-white shadow-sm dark:bg-primary dark:text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <CameraIcon className="size-4" /> Profile Image
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
                <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
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
                <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
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
                <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
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
                <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                  <ShieldCheckIcon className="size-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase block">
                    Assigned Roles
                  </span>
                  <Badge variant="secondary" className="mt-0.5 text-[10px] font-bold">
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
                  <div className="mt-6 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/50 dark:bg-indigo-950/20 p-4 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-indigo-950 dark:text-indigo-200">
                      <ShieldIcon className="size-4 text-indigo-600 dark:text-indigo-400" />
                      Assigned System Roles
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Below are all administrative & instructional roles assigned to your user account across the portal.
                    </p>
                    <div className="pt-2 flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-background border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 shadow-xs">
                        <CheckIcon className="size-3.5 text-indigo-600 dark:text-indigo-400" />
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
                <Badge className="bg-emerald-600 text-white text-xs">Active Role</Badge>
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
              <Button size="sm" onClick={() => handleSaveProfile()} disabled={saving} className="gap-2">
                <SaveIcon className="size-4" /> Save Profile Image
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
