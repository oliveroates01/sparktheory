import { Suspense } from "react";
import { redirect } from "next/navigation";
import LessonClient from "./LessonClient";

export const dynamic = "force-dynamic";

type LessonPageProps = {
  params: { topic?: string; lesson?: string };
  searchParams?: Record<string, string | string[] | undefined>;
};

const INSTALLATION_WIRING_LEGACY_SLUG = "installation-wiring-systems-enclosures";
const INSTALLATION_WIRING_CANONICAL_SLUG = "installation-wiring";

export default function ElectricalLessonPage({ params, searchParams }: LessonPageProps) {
  const requestedTopic = decodeURIComponent(params?.topic || "").trim().toLowerCase();
  const requestedLesson = decodeURIComponent(params?.lesson || "").trim();
  if (requestedTopic === INSTALLATION_WIRING_LEGACY_SLUG) {
    const qs = new URLSearchParams();
    for (const [key, value] of Object.entries(searchParams ?? {})) {
      if (typeof value === "string") qs.set(key, value);
      else if (Array.isArray(value)) value.forEach((v) => qs.append(key, v));
    }
    redirect(
      `/trade/electrical/${INSTALLATION_WIRING_CANONICAL_SLUG}/${requestedLesson}${qs.toString() ? `?${qs.toString()}` : ""}`
    );
  }

  return (
    <Suspense fallback={<div className="min-h-screen bg-[#1F1F1F] text-white" />}>
      <LessonClient />
    </Suspense>
  );
}
