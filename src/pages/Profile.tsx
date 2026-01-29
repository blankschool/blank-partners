import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentProfile } from "@/hooks/useCurrentProfile";
import { AvatarUpload } from "@/components/profile/AvatarUpload";
import { ProfileForm } from "@/components/profile/ProfileForm";

export default function Profile() {
  const {
    profile,
    positions,
    userRole,
    isLoading,
    updateProfile,
    uploadAvatar,
    isUpdating,
    isUploading,
  } = useCurrentProfile();

  const handleAvatarUpload = async (file: File) => {
    await uploadAvatar(file);
  };

  return (
    <AppLayout title="My Profile">
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="flex h-2 w-2 rounded-full bg-accent-orange" />
            <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
              Account Settings
            </span>
          </div>
          <h1 className="font-serif text-3xl font-normal text-foreground">My Profile</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage your personal information and preferences
          </p>
        </div>

        {/* Profile Details Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="flex h-2 w-2 rounded-full bg-accent-orange" />
            <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
              Profile Details
            </span>
          </div>

          <Card className="rounded-2xl bg-card border border-border shadow-sm">
            <CardHeader>
              <CardTitle className="font-serif text-xl font-normal">
                Your Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {isLoading ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-6">
                    <Skeleton className="h-24 w-24 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-9 w-32" />
                      <Skeleton className="h-4 w-40" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              ) : profile ? (
                <>
                  <AvatarUpload
                    avatarUrl={profile.avatar_url}
                    fullName={profile.full_name}
                    onUpload={handleAvatarUpload}
                    isUploading={isUploading}
                  />

                  <div className="border-t border-border pt-6">
                    <ProfileForm
                      initialData={{
                        full_name: profile.full_name,
                        email: profile.email,
                        position_id: profile.position_id,
                        team: profile.team,
                      }}
                      positions={positions}
                      userRole={userRole || "user"}
                      onSubmit={updateProfile}
                      isSubmitting={isUpdating}
                    />
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <p className="text-muted-foreground">Profile not found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
