"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { electricalTopicGuides } from "@/data/electricalTopicGuides";
import { electricalTopicGuidesLevel3 } from "@/data/electricalTopicGuidesLevel3";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function ElectricalTopicPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const raw = typeof params?.topic === "string" ? params.topic : "";
  const slug = decodeURIComponent(raw || "").trim().toLowerCase();
  const levelParam = (searchParams.get("level") || "").trim();
  const guides = levelParam === "3" ? electricalTopicGuidesLevel3 : electricalTopicGuides;
  const guide = guides.find((g) => g.slug === slug);
  const backHref = levelParam === "3" ? "/trade/electrical?level=3" : "/trade/electrical";

  if (!guide) {
    return (
      <main className="min-h-screen bg-[#1F1F1F] text-white">
        <div className="mx-auto w-full max-w-3xl px-6 py-12">
          <Link href={backHref} className="text-sm text-white/70 hover:text-white">
            ← Back to Electrical
          </Link>
          <h1 className="mt-6 text-2xl font-bold">Topic Not Found</h1>
          <p className="mt-2 text-sm text-white/70">
            That topic doesn’t exist yet. Choose another topic from the Electrical page.
          </p>
          <div className="mt-4 rounded-xl bg-white/5 p-4 text-xs text-white/60 ring-1 ring-white/10">
            <div>
              Requested slug: <b>{slug || "(empty)"}</b>
            </div>
            <div className="mt-2">
              Available: {electricalTopicGuides.map((g) => g.slug).join(", ") || "(none)"}
            </div>
          </div>
        </div>
      </main>
    );
  }

  const lessons = guide.sections.map((section) => {
    const lessonSlug = slugify(section.title);
    return {
      slug: lessonSlug,
      title: section.title,
      items: section.items,
    };
  });

  const firstLesson = lessons[0];
  const lessonCount = lessons.length;
  const topicTitle = guide.title;
  const moduleHref = firstLesson
    ? `/trade/electrical/${guide.slug}/${firstLesson.slug}${levelParam === "3" ? "?level=3" : ""}`
    : undefined;

  return (
    <main className="min-h-screen bg-[#1F1F1F] text-white page-transition">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[920px] -translate-x-1/2 rounded-full bg-gradient-to-r from-[#FFC400]/25 via-[#FF9100]/20 to-[#FFC400]/20 blur-3xl" />
        <div className="absolute bottom-[-220px] right-[-200px] h-[520px] w-[520px] rounded-full bg-gradient-to-tr from-[#FFC400]/18 to-[#FF9100]/12 blur-3xl" />
      </div>
      <div className="mx-auto w-full max-w-6xl px-6 py-12">
        <Link href={backHref} className="text-sm text-white/70 hover:text-white">
          ← Back to Electrical
        </Link>

        <header className="mt-6 flex flex-wrap items-start justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.2em] text-white/40">Micro Lessons</p>
            <h1 className="mt-2 text-3xl font-bold sm:text-4xl">{topicTitle}</h1>
            <p className="mt-3 text-sm text-white/70">{guide.description}</p>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/70 ring-1 ring-white/15">
              {lessonCount} lessons
            </span>
          </div>
        </header>

        <section className="mt-10 grid gap-4 sm:grid-cols-2">
          {lessons.map((lesson, index) => {
            const href = `/trade/electrical/${guide.slug}/${lesson.slug}${levelParam === "3" ? "?level=3" : ""}`;
            return (
              <Link
                key={lesson.slug}
                href={href}
                className="group rounded-2xl border border-white/10 bg-white/5 px-5 py-4 transition hover:border-[#FFC400]/40 hover:bg-white/10"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-white/10 text-xs font-semibold text-white/70 ring-1 ring-white/20">
                      {index + 1}
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-white">{lesson.title}</div>
                    </div>
                  </div>
                  <span className="text-xs text-white/50 transition group-hover:text-white">→</span>
                </div>
              </Link>
            );
          })}
        </section>
      </div>
    </main>
  );
}
