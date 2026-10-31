import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { ProfileEditor } from "@/components/profile/ProfileEditor";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (!user.profile) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-10">
        <PageHeader title="My Profile" subtitle="No profile found for your account." />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <PageHeader title="My Profile" subtitle="Edit what visitors see when they tap your ring." />
      <ProfileEditor profile={user.profile} />
    </div>
  );
}
