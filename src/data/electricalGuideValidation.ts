type GuideItem = { title: string; detail: string };
type GuideSection = { title: string; items: GuideItem[] };
type Guide = { title: string; slug: string; sections: GuideSection[] };

type Level = "L2" | "L3";

const L2_FORBIDDEN = [
  "rms",
  "peak-to-peak",
  "reactive",
  "apparent power",
  "power factor",
  "impedance",
  "kvar",
  "kva",
];

const L3_FORBIDDEN = [
  "dc only",
  "simple recall",
];

function collectText(guides: Guide[]) {
  return guides
    .flatMap((guide) => [
      guide.title,
      guide.slug,
      ...guide.sections.flatMap((section) => [
        section.title,
        ...section.items.flatMap((item) => [item.title, item.detail]),
      ]),
    ])
    .join(" ")
    .toLowerCase();
}

export function validateGuideLevelBoundaries(level: Level, guides: Guide[]) {
  if (process.env.NODE_ENV === "production") return;

  const text = collectText(guides);
  const forbidden = level === "L2" ? L2_FORBIDDEN : L3_FORBIDDEN;
  const hit = forbidden.find((token) => text.includes(token));

  if (hit) {
    throw new Error(
      `[electrical guides] ${level} content boundary breach: found forbidden token "${hit}"`,
    );
  }
}
