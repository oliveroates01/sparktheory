"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import {
  electricalTopicGuides,
  type LessonSection,
  type LessonSectionType,
  type TopicGuideItem,
} from "@/data/electricalTopicGuides";
import { electricalTopicGuidesLevel3 } from "@/data/electricalTopicGuidesLevel3";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const SECTION_ORDER: LessonSectionType[] = [
  "concept",
  "realWorld",
  "formula",
  "workedExample",
  "commonMistakes",
  "siteApplication",
  "quickPractice",
];

function sortLessonSections(sections: LessonSection[]): LessonSection[] {
  const rank = new Map(SECTION_ORDER.map((type, index) => [type, index]));
  return [...sections].sort(
    (a, b) => (rank.get(a.type) ?? 999) - (rank.get(b.type) ?? 999)
  );
}

function lineArray(content?: string | string[]): string[] {
  if (!content) return [];
  return Array.isArray(content) ? content : [content];
}

function buildPlaceholderLessonSections(lessonTitle: string, items: TopicGuideItem[]): LessonSection[] {
  const itemTitles = items.map((item) => item.title);
  const itemDetails = items.map((item) => item.detail);
  const firstLabel = itemTitles[0] || lessonTitle;
  const secondLabel = itemTitles[1] || "key checks";
  const thirdLabel = itemTitles[2] || "safe practice";

  return [
    {
      title: "Concept Breakdown",
      type: "concept",
      content: [
        `${lessonTitle} covers the core ideas you need to recognise quickly in Level 2 electrical work and exam questions.`,
        itemDetails.slice(0, 2).join(" ") || `Focus on what ${firstLabel.toLowerCase()} means, when it is used, and how it affects safe work decisions.`,
      ],
      bullets: itemTitles.slice(0, 4),
    },
    {
      title: "Real-World UK Context",
      type: "realWorld",
      content: `In UK installation work, ${firstLabel.toLowerCase()} is usually applied alongside manufacturer instructions, site conditions, and safe isolation procedures before work starts.`,
      bullets: [
        `Use current site information before acting on ${firstLabel.toLowerCase()}`,
        `Check how ${secondLabel.toLowerCase()} affects safety, compliance, or usability`,
      ],
    },
    {
      title: "Formulas / key rules",
      type: "formula",
      content: `This lesson is mostly procedural. Learn the key terms and standard checks linked to ${lessonTitle.toLowerCase()}.`,
      formulaBlock: [
        `Identify: ${firstLabel}`,
        `Check: ${secondLabel}`,
        `Confirm: ${thirdLabel}`,
      ].join("\n"),
    },
    {
      title: "Worked Example",
      type: "workedExample",
      content: `Example workflow for a simple ${lessonTitle.toLowerCase()} task:`,
      exampleSteps: [
        { step: `Review the task and identify the requirement for ${firstLabel.toLowerCase()}.` },
        { step: `Select the correct method / equipment / reference information.` },
        { step: `Carry out the check or installation step carefully.` },
        { step: `Verify the result and record any important findings.` },
      ],
    },
    {
      title: "Common Exam Mistakes",
      type: "commonMistakes",
      bullets: [
        `Confusing ${firstLabel.toLowerCase()} with a similar term`,
        "Skipping the wording in the question and answering a different point",
        "Forgetting units, ratings, or sequence where the question expects them",
        "Choosing a plausible answer that ignores safety or compliance",
      ],
    },
    {
      title: "Site Application",
      type: "siteApplication",
      content: `On site, apply ${lessonTitle.toLowerCase()} using the specified method, safe working controls, and the correct documentation for the job.`,
      bullets: [
        "Follow the agreed sequence of work",
        "Check suitability before installation or testing",
        "Record outcomes clearly where required",
      ],
    },
    {
      title: "Quick Practice",
      type: "quickPractice",
      question: `Name one key check you would carry out when dealing with ${firstLabel.toLowerCase()} and explain why it matters.`,
      answer: `A valid answer should identify a relevant check (for example ${secondLabel.toLowerCase()}) and link it to safety, correct operation, or compliance.`,
    },
  ];
}

function SectionCard({
  title,
  eyebrow,
  children,
  accent = "default",
}: {
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
  accent?: "default" | "warning" | "practice";
}) {
  const accentClasses =
    accent === "warning"
      ? "ring-rose-400/20 bg-rose-500/[0.05]"
      : accent === "practice"
      ? "ring-[#FFC400]/20 bg-[#FFC400]/[0.04]"
      : "ring-white/10 bg-white/5";

  return (
    <div className={`rounded-2xl px-4 py-4 ring-1 ${accentClasses}`}>
      {eyebrow ? (
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
          {eyebrow}
        </div>
      ) : null}
      <h3 className="mt-1 text-sm font-semibold text-white">{title}</h3>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function FormulaBlock({ formulaBlock }: { formulaBlock: string }) {
  return (
    <pre className="overflow-x-auto rounded-xl bg-black/25 px-4 py-3 text-xs leading-6 text-[#FFE9A0] ring-1 ring-white/10 whitespace-pre-wrap">
      {formulaBlock}
    </pre>
  );
}

function WorkedExample({
  intro,
  steps,
}: {
  intro?: string | string[];
  steps: NonNullable<LessonSection["exampleSteps"]>;
}) {
  const lines = lineArray(intro);
  return (
    <div className="grid gap-3">
      {lines.length > 0 ? (
        <div className="text-sm leading-6 text-white/75">
          {lines.map((line, idx) => (
            <p key={`${line}-${idx}`} className={idx > 0 ? "mt-2" : ""}>
              {line}
            </p>
          ))}
        </div>
      ) : null}
      <ol className="grid gap-2">
        {steps.map((entry, index) => (
          <li key={`${entry.step}-${index}`} className="rounded-xl bg-white/5 px-3 py-3 ring-1 ring-white/10">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white/10 text-[11px] font-semibold text-white/80 ring-1 ring-white/15">
                {index + 1}
              </span>
              <div className="min-w-0">
                <p className="text-sm text-white/80">{entry.step}</p>
                {entry.result ? (
                  <p className="mt-1 text-xs font-semibold text-[#FFD86B]">{entry.result}</p>
                ) : null}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function MistakesCallout({ bullets }: { bullets: string[] }) {
  return (
    <ul className="grid gap-2">
      {bullets.map((item) => (
        <li key={item} className="rounded-xl bg-white/5 px-3 py-2.5 text-sm text-white/75 ring-1 ring-white/10">
          {item}
        </li>
      ))}
    </ul>
  );
}

function QuickPractice({
  section,
  answerVisible,
  onToggle,
}: {
  section: LessonSection;
  answerVisible: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="grid gap-3">
      {section.question ? (
        <div className="rounded-xl bg-white/5 px-4 py-3 ring-1 ring-white/10">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
            Practice question
          </div>
          <p className="mt-2 text-sm leading-6 text-white/80">{section.question}</p>
        </div>
      ) : null}

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggle}
          className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-white/80 transition hover:bg-white/10"
        >
          {answerVisible ? "Hide answer" : "Show answer"}
        </button>
      </div>

      {answerVisible && section.answer ? (
        <div className="rounded-xl bg-[#FFC400]/[0.06] px-4 py-3 ring-1 ring-[#FFC400]/20">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#FFE083]">
            Answer
          </div>
          <p className="mt-2 text-sm leading-6 text-white/85">{section.answer}</p>
        </div>
      ) : null}
    </div>
  );
}

function renderTextAndBullets(section: LessonSection) {
  const lines = lineArray(section.content);
  return (
    <>
      {lines.length > 0 ? (
        <div className="text-sm leading-6 text-white/75">
          {lines.map((line, idx) => (
            <p key={`${line}-${idx}`} className={idx > 0 ? "mt-2" : ""}>
              {line}
            </p>
          ))}
        </div>
      ) : null}
      {section.bullets?.length ? (
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-white/75">
          {section.bullets.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}
    </>
  );
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
  const [openPracticeAnswers, setOpenPracticeAnswers] = useState<Record<string, boolean>>({});

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
    sections: section.sections,
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

  const structuredSections = useMemo(() => {
    const source = currentLesson.sections?.length
      ? currentLesson.sections
      : buildPlaceholderLessonSections(currentLesson.title, currentLesson.items);
    return sortLessonSections(source);
  }, [currentLesson]);

  const objectives = currentLesson.items.slice(0, 4).map((item) => item.title);

  return (
    <main className="min-h-screen bg-[#1F1F1F] text-white page-transition">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[920px] -translate-x-1/2 rounded-full bg-gradient-to-r from-[#FFC400]/25 via-[#FF9100]/20 to-[#FFC400]/20 blur-3xl" />
        <div className="absolute bottom-[-220px] right-[-200px] h-[520px] w-[520px] rounded-full bg-gradient-to-tr from-[#FFC400]/18 to-[#FF9100]/12 blur-3xl" />
      </div>

      <div className="mx-auto w-full max-w-6xl px-6 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <Link href={backHref} className="text-sm text-white/70 hover:text-white">
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
                    <span>{lesson.title}</span>
                  </Link>
                );
              })}
            </div>
          </aside>

          <section className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
            <div className="rounded-xl bg-white/5 px-4 py-4 ring-1 ring-white/10">
              <h2 className="text-sm font-semibold text-white">Lesson objectives</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-white/80">
                {objectives.map((objective) => (
                  <li key={objective}>{objective}</li>
                ))}
              </ul>
            </div>

            <div className="mt-6 grid gap-4">
              {structuredSections.map((section, index) => {
                const key = `${currentLesson.slug}-${section.type}-${index}`;

                if (section.type === "formula") {
                  return (
                    <SectionCard key={key} title={section.title} eyebrow="Formulas">
                      {lineArray(section.content).length > 0 ? (
                        <div className="mb-3 text-sm leading-6 text-white/75">
                          {lineArray(section.content).map((line, idx) => (
                            <p key={`${line}-${idx}`} className={idx > 0 ? "mt-2" : ""}>
                              {line}
                            </p>
                          ))}
                        </div>
                      ) : null}
                      {section.formulaBlock ? <FormulaBlock formulaBlock={section.formulaBlock} /> : null}
                      {section.bullets?.length ? (
                        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-white/75">
                          {section.bullets.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      ) : null}
                    </SectionCard>
                  );
                }

                if (section.type === "workedExample") {
                  return (
                    <SectionCard key={key} title={section.title} eyebrow="Worked example">
                      <WorkedExample intro={section.content} steps={section.exampleSteps ?? []} />
                    </SectionCard>
                  );
                }

                if (section.type === "commonMistakes") {
                  return (
                    <SectionCard key={key} title={section.title} eyebrow="Exam focus" accent="warning">
                      {lineArray(section.content).length > 0 ? (
                        <div className="mb-3 text-sm leading-6 text-white/75">
                          {lineArray(section.content).map((line, idx) => (
                            <p key={`${line}-${idx}`} className={idx > 0 ? "mt-2" : ""}>
                              {line}
                            </p>
                          ))}
                        </div>
                      ) : null}
                      <MistakesCallout bullets={section.bullets ?? []} />
                    </SectionCard>
                  );
                }

                if (section.type === "quickPractice") {
                  const answerVisible = Boolean(openPracticeAnswers[key]);
                  return (
                    <SectionCard key={key} title={section.title} eyebrow="Quick practice" accent="practice">
                      <QuickPractice
                        section={section}
                        answerVisible={answerVisible}
                        onToggle={() =>
                          setOpenPracticeAnswers((prev) => ({ ...prev, [key]: !prev[key] }))
                        }
                      />
                    </SectionCard>
                  );
                }

                const eyebrow =
                  section.type === "concept"
                    ? "Concept breakdown"
                    : section.type === "realWorld"
                    ? "Real-world UK context"
                    : section.type === "siteApplication"
                    ? "Site application"
                    : undefined;

                return (
                  <SectionCard key={key} title={section.title} eyebrow={eyebrow}>
                    {renderTextAndBullets(section)}
                  </SectionCard>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
