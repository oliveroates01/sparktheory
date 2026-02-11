"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useState } from "react";
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

export default function ElectricalLessonPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const topicRaw = typeof params?.topic === "string" ? params.topic : "";
  const lessonRaw = typeof params?.lesson === "string" ? params.lesson : "";
  const topicSlug = decodeURIComponent(topicRaw || "").trim().toLowerCase();
  const lessonSlug = decodeURIComponent(lessonRaw || "").trim().toLowerCase();
  const levelParam = (searchParams.get("level") || "").trim();
  const guides = levelParam === "3" ? electricalTopicGuidesLevel3 : electricalTopicGuides;
  const guide = guides.find((g) => g.slug === topicSlug);
  const backHref = levelParam === "3" ? "/trade/electrical?level=3" : "/trade/electrical";
  const topicHref = levelParam === "3" ? `/trade/electrical/${topicSlug}?level=3` : `/trade/electrical/${topicSlug}`;

  if (!guide) {
    return (
      <main className="min-h-screen bg-[#1F1F1F] text-white">
        <div className="mx-auto w-full max-w-3xl px-6 py-12">
          <Link href={backHref} className="text-sm text-white/70 hover:text-white">
            ← Back to Electrical
          </Link>
          <h1 className="mt-6 text-2xl font-bold">Lesson Not Found</h1>
          <p className="mt-2 text-sm text-white/70">
            That topic doesn’t exist yet. Choose another topic from the Electrical page.
          </p>
        </div>
      </main>
    );
  }

  const lessons = guide.sections.map((section) => ({
    slug: slugify(section.title),
    title: section.title,
    items: section.items,
  }));

  const currentLesson = lessons.find((l) => l.slug === lessonSlug) || lessons[0];

  if (!currentLesson) {
    return (
      <main className="min-h-screen bg-[#1F1F1F] text-white">
        <div className="mx-auto w-full max-w-3xl px-6 py-12">
          <Link href={topicHref} className="text-sm text-white/70 hover:text-white">
            ← Back to {guide.title}
          </Link>
          <h1 className="mt-6 text-2xl font-bold">Lesson Not Found</h1>
          <p className="mt-2 text-sm text-white/70">
            That lesson doesn’t exist yet. Choose another lesson from the module list.
          </p>
        </div>
      </main>
    );
  }

  const objectives = currentLesson.items.slice(0, 4).map((item) => item.title);
  const titles = currentLesson.items.map((item) => item.title);
  const details = currentLesson.items.map((item) => item.detail);

  const buildRecap = () => {
    const head = details.slice(0, 4).join(" ");
    const tail = details.slice(4, 6).join(" ");
    if (head) {
      return tail ? `${head} ${tail}` : head;
    }
    const list = titles.slice(0, 5).join(", ");
    return `This lesson explains ${list}${titles.length > 5 ? " and related topics." : "."}`;
  };

  const overview = buildRecap();

  const focusAreas = currentLesson.items.map((item, index) => {
    const label = item.title;
    const advantageSeeds = [
      `Gives a clear baseline for ${label} decisions.`,
      `Improves safety and reliability when ${label} is applied consistently.`,
      `Supports compliant installation and troubleshooting for ${label}.`,
    ];
    const tradeoffSeeds = [
      `If misunderstood, ${label} can lead to incorrect choices.`,
      `${label} often needs checking against site conditions and specs.`,
      `Evidence or testing may be required to confirm ${label} on site.`,
    ];
    const reminderSeeds = [
      `Match ${label} to the installation environment and duty.`,
      `Record results or rationale for ${label} where required.`,
      `Check manufacturer guidance that affects ${label}.`,
    ];

    const pick = (list: string[], count: number) =>
      list.slice(index % list.length).concat(list).slice(0, count);

    return {
      title: item.title,
      how: item.detail,
      advantages: pick(advantageSeeds, 3),
      tradeoffs: pick(tradeoffSeeds, 3),
      reminders: pick(reminderSeeds, 2),
    };
  });


  return (
    <main className="min-h-screen bg-[#1F1F1F] text-white page-transition">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[920px] -translate-x-1/2 rounded-full bg-gradient-to-r from-[#FFC400]/25 via-[#FF9100]/20 to-[#FFC400]/20 blur-3xl" />
        <div className="absolute bottom-[-220px] right-[-200px] h-[520px] w-[520px] rounded-full bg-gradient-to-tr from-[#FFC400]/18 to-[#FF9100]/12 blur-3xl" />
      </div>
      <div className="mx-auto w-full max-w-6xl px-6 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={backHref}
              className="text-sm text-white/70 hover:text-white"
            >
              ← Back to Electrical
            </Link>
            <Link href={topicHref} className="text-sm text-white/70 hover:text-white">
              Back to {guide.title}
            </Link>
          </div>
          <Link href={backHref} className="text-sm text-white/70 hover:text-white">
            All Electrical Topics
          </Link>
        </div>

        <header className="mt-6">
          <p className="text-xs uppercase tracking-[0.2em] text-white/40">Micro Lesson</p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">{currentLesson.title}</h1>
          <p className="mt-3 text-sm text-white/70">{guide.description}</p>
        </header>

        <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/40">
              Lessons
            </div>
            <div className="mt-4 grid gap-2">
              {lessons.map((lesson, index) => {
                const href = `/trade/electrical/${topicSlug}/${lesson.slug}${levelParam === "3" ? "?level=3" : ""}`;
                const isActive = lesson.slug === currentLesson.slug;
                return (
                  <Link
                    key={lesson.slug}
                    href={href}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2 text-xs transition ${
                      isActive
                        ? "bg-[#FFC400]/20 text-[#FFC400] ring-1 ring-[#FFC400]/40"
                        : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-white/10 text-[10px] font-semibold">
                      {index + 1}
                    </span>
                    <span className="">{lesson.title}</span>
                  </Link>
                );
              })}
            </div>
          </aside>

          <section className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
            <h2 className="text-xl font-semibold">Learning objectives</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-white/80">
              {objectives.map((objective) => (
                <li key={objective}>{objective}</li>
              ))}
            </ul>

            <div className="mt-6 rounded-xl bg-white/5 px-4 py-4 ring-1 ring-white/10">
              <h3 className="text-sm font-semibold text-white">Overview</h3>
              <p className="mt-2 text-sm text-white/70">{overview}</p>
            </div>

            <div className="mt-6 grid gap-4">
              {focusAreas.map((area) => (
                <div
                  key={area.title}
                  className="rounded-2xl bg-white/5 px-4 py-4 ring-1 ring-white/10"
                >
                  <h3 className="text-sm font-semibold text-white">{area.title}</h3>
                  <div className="mt-3 grid gap-3">
                    <div className="rounded-xl bg-white/5 px-3 py-3 ring-1 ring-white/10">
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
                        How it works
                      </div>
                      <p className="mt-2 text-sm text-white/70">{area.how}</p>
                    </div>
                    <div className="rounded-xl bg-white/5 px-3 py-3 ring-1 ring-white/10">
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
                        Advantages
                      </div>
                      <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-white/70">
                        {area.advantages.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-xl bg-white/5 px-3 py-3 ring-1 ring-white/10">
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
                        Trade-offs
                      </div>
                      <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-white/70">
                        {area.tradeoffs.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-xl bg-white/5 px-3 py-3 ring-1 ring-white/10">
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
                        Design reminders
                      </div>
                      <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-white/70">
                        {area.reminders.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>


            <div className="mt-8 border-t border-white/10 pt-6">
              <h3 className="text-lg font-semibold">Key points</h3>
              <div className="mt-4 grid gap-3">
                {currentLesson.items.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-xl bg-white/5 px-4 py-3 text-sm text-white/80 ring-1 ring-white/10"
                  >
                    <div className="font-semibold text-white">{item.title}</div>
                    <div className="mt-1 text-xs text-white/60">{item.detail}</div>
                  </div>
                ))}
              </div>
            </div>

          </section>
        </div>
      </div>
    </main>
  );
}
