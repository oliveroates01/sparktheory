"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
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

  const recap = buildRecap();

  const advantages = [
    titles[0] && `Better outcomes by applying ${titles[0].toLowerCase()} correctly.`,
    titles[1] && `Improved safety and compliance through ${titles[1].toLowerCase()}.`,
    titles[2] && `More reliable results when ${titles[2].toLowerCase()} is followed.`,
    titles[3] && `More predictable performance with ${titles[3].toLowerCase()} in place.`,
  ].filter(Boolean) as string[];

  const disadvantages = [
    titles[0] && `If ${titles[0].toLowerCase()} is ignored, errors or unsafe conditions can occur.`,
    titles[1] && `Poor ${titles[1].toLowerCase()} can lead to non‑compliance or faults.`,
    titles[2] && `Weak ${titles[2].toLowerCase()} can reduce performance and quality.`,
    titles[3] && `Gaps in ${titles[3].toLowerCase()} can cause delays or rework.`,
  ].filter(Boolean) as string[]


  const quizQuestions = useMemo(() => {
    const pool = currentLesson.items.slice(0, 5);
    return pool.slice(0, 3).map((item, idx) => {
      const correct = item.detail;
      const distractors = pool
        .filter((p) => p.title !== item.title)
        .map((p) => p.detail)
        .slice(0, 2);
      const options = [correct, ...distractors].sort(() => Math.random() - 0.5);
      const correctIndex = options.indexOf(correct);
      return {
        id: idx,
        prompt: `Which statement best matches ${item.title}?`,
        options,
        correctIndex,
      };
    });
  }, [currentLesson.items]);

  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
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

            <div className="mt-6 grid gap-4">
              <div className="rounded-xl bg-white/5 px-4 py-4 ring-1 ring-white/10">
                <h3 className="text-sm font-semibold text-white">How it works (recap)</h3>
                <p className="mt-2 text-sm text-white/70">{recap}</p>
              </div>

              <div className="rounded-xl bg-white/5 px-4 py-4 ring-1 ring-white/10">
                <h3 className="text-sm font-semibold text-white">Advantages</h3>
                <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-white/70">
                  {advantages.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl bg-white/5 px-4 py-4 ring-1 ring-white/10">
                <h3 className="text-sm font-semibold text-white">Disadvantages</h3>
                <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-white/70">
                  {disadvantages.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
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

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.05] p-5">
              <div className="text-sm font-semibold">Quick quiz</div>
              <div className="mt-4 grid gap-4">
                {quizQuestions.map((q) => (
                  <div key={q.id} className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
                    <div className="text-sm font-semibold text-white">{q.prompt}</div>
                    <div className="mt-3 grid gap-2">
                      {q.options.map((opt, i) => {
                        const picked = quizAnswers[q.id] === i;
                        const isCorrect = picked && i === q.correctIndex;
                        const isWrong = picked && i !== q.correctIndex;
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setQuizAnswers((prev) => ({ ...prev, [q.id]: i }))}
                            className={`w-full rounded-lg border px-3 py-2 text-left text-xs transition ${
                              isCorrect
                                ? "border-[#3CD97A]/60 bg-[#3CD97A]/10 text-[#C9F9DD]"
                                : isWrong
                                  ? "border-[#FF6B6B]/60 bg-[#FF6B6B]/10 text-[#FFD0D0]"
                                  : "border-white/10 bg-white/5 text-white/80 hover:bg-white/10"
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                    {quizAnswers[q.id] !== undefined ? (
                      <div className="mt-2 text-xs text-white/60">
                        {quizAnswers[q.id] === q.correctIndex ? "Correct" : "Incorrect"}
                      </div>
                    ) : null}
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
