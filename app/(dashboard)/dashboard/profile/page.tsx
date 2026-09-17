"use client";

import { useEffect, useState } from "react";
import {
  UserIcon,
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  Building2Icon,
  ShieldCheckIcon,
  KeyIcon,
  SaveIcon,
  SparklesIcon,
  ImageIcon,
} from "lucide-react";
import { toast } from "sonner";

import { useAuthStore } from "@/stores/auth-store";
import { getCurrentUserProfile, updateUserProfile } from "@/lib/api/services/users";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { Badge } from "@/components/ui/badge";

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  const [title, setTitle] = useState(user?.title || "");
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
  const [location, setLocation] = useState(user?.location || "");
  const [profileImageUrl, setProfileImageUrl] = useState(user?.profileImageUrl || "");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        const latestUser = await getCurrentUserProfile();
        setUser(latestUser);
        setTitle(latestUser.title || "");
        setFullName(latestUser.fullName || "");
        setEmail(latestUser.email || "");
        setPhoneNumber(latestUser.phoneNumber || "");
        setLocation(latestUser.location || "");
        setProfileImageUrl(latestUser.profileImageUrl || "");
      } catch (err) {
        // Fallback to store user if API call fails
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

  const isOrganization = user?.accountType === 2 || !!user?.institutionName;
  const isAdmin = user?.role === "InstitutionAdmin" || user?.role === "SystemAdmin" || user?.accountType === 2;

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
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
      toast.success("Profile updated successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
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
    : "U";

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1 border-primary/30 text-primary">
            <UserIcon className="size-3.5" /> User Profile & Workspace Info
          </Badge>
        </div>
        <h1 className="font-heading text-2xl font-bold tracking-tight mt-1">Profile</h1>
        <p className="text-sm text-muted-foreground">
          Manage your personal details, academic titles, contact info, and avatar image.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Card Summary */}
        <Card className="md:col-span-1">
          <CardHeader className="text-center pb-2">
            {profileImageUrl ? (
              <img
                src={profileImageUrl}
                alt={fullName || "User Profile"}
                className="mx-auto size-20 rounded-full object-cover shadow-md border-2 border-primary/30"
              />
            ) : (
              <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold shadow-md">
                {initials}
              </div>
            )}
            <CardTitle className="text-base mt-2">
              {title ? `${title} ` : ""}{fullName || "Academic User"}
            </CardTitle>
            <CardDescription className="text-xs">{email || "No email available"}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-2 text-xs">
            <div className="rounded-xl bg-muted/40 border border-border/60 p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Account Type:</span>
                <Badge variant="secondary" className="font-medium text-[10px]">
                  {isOrganization ? "Organization" : "Individual"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Role:</span>
                <Badge variant="outline" className="font-medium text-[10px] border-primary/30 text-primary">
                  {isAdmin ? "Institution Admin" : "Lecturer"}
                </Badge>
              </div>
              {isOrganization && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Institution:</span>
                  <span className="font-semibold text-foreground truncate max-w-[120px]">
                    {user?.institutionName || "School"}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <PhoneIcon className="size-3.5" />
                <span>{phoneNumber || "No phone number added"}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPinIcon className="size-3.5" />
                <span>{location || "No location added"}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Edit Form */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Personal Information</CardTitle>
            <CardDescription className="text-xs">
              Update your display details for academic assessments and reports.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <Field className="col-span-1">
                  <FieldLabel htmlFor="title">Title</FieldLabel>
                  <Input
                    id="title"
                    placeholder="e.g. Dr. / Prof."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </Field>

                <Field className="col-span-2">
                  <FieldLabel htmlFor="fullName">Full Name</FieldLabel>
                  <Input
                    id="fullName"
                    placeholder="Enter full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </Field>
              </div>

              <Field>
                <FieldLabel htmlFor="email">Email Address (Read-only)</FieldLabel>
                <Input id="email" value={email} disabled className="bg-muted/50 cursor-not-allowed" />
              </Field>

              <div className="grid sm:grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
                  <Input
                    id="phone"
                    placeholder="+234..."
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="location">Location</FieldLabel>
                  <Input
                    id="location"
                    placeholder="City, Country"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </Field>
              </div>

              <Field>
                <FieldLabel htmlFor="profileImageUrl">Profile Avatar / Image URL</FieldLabel>
                <Input
                  id="profileImageUrl"
                  placeholder="https://example.com/avatar.jpg"
                  value={profileImageUrl}
                  onChange={(e) => setProfileImageUrl(e.target.value)}
                />
              </Field>

              <div className="pt-4 flex justify-end">
                <Button type="submit" disabled={saving || loading} className="gap-2">
                  <SaveIcon className="size-4" />
                  {saving ? "Saving Changes..." : "Save Profile"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
