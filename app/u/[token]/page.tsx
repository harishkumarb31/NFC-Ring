import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { trackEvent, normalizeSource } from "@/lib/analytics";
import { PublicProfileView } from "@/components/profile/PublicProfileView";
import { ErrorState } from "@/components/ui/ErrorState";

interface PageProps {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ source?: string }>;
}

async function getProfileData(token: string) {
  const ring = await prisma.ring.findUnique({
    where: { token },
    include: { user: { include: { profile: true } } },
  });
  if (!ring || !ring.user.profile) return { notFound: true as const };
  if (ring.status !== "ACTIVE") return { inactive: true as const };
  return { ring, profile: ring.user.profile };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { token } = await params;
  const data = await getProfileData(token);
  if ("notFound" in data || "inactive" in data) {
    return { title: "Profile — NFC Business Ring" };
  }
  const { profile } = data;
  const title = `${profile.name}${profile.designation ? ` — ${profile.designation}` : ""}`;
  const description = `Connect with ${profile.name} and explore their professional profile.`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: profile.photoUrl ? [profile.photoUrl] : undefined,
    },
  };
}

export default async function PublicProfilePage({ params, searchParams }: PageProps) {
  const { token } = await params;
  const { source } = await searchParams;
  const data = await getProfileData(token);

  if ("notFound" in data) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <ErrorState title="Profile not found" description="This link doesn't match an active NFC Business Ring profile." />
      </div>
    );
  }

  if ("inactive" in data) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <ErrorState title="This ring is currently inactive" description="The owner has temporarily deactivated this profile. Please check back later." />
      </div>
    );
  }

  const normalizedSource = normalizeSource(source ?? null);
  await trackEvent(data.profile.id, normalizedSource === "NFC" ? "TAP" : "VIEW", normalizedSource);
  if (normalizedSource === "QR") {
    await trackEvent(data.profile.id, "QR", normalizedSource);
  }

  return <PublicProfileView profile={data.profile} token={token} source={normalizedSource} />;
}
