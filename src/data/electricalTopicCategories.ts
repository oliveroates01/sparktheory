import { electricalTopicGuides } from "@/data/electricalTopicGuides";
import { electricalTopicGuidesLevel3 } from "@/data/electricalTopicGuidesLevel3";

export type ElectricalCategory = {
  id: string;
  title: string;
  description: string;
  tag: string;
  href?: string;
  topicHref?: string;
};

export const ELECTRICAL_LEVEL2_CATEGORIES: ElectricalCategory[] = [
  {
    id: "all-level-2",
    title: "Level 2 Mixed (All Topics)",
    description: "All Level 2 topics combined for a full mixed practice quiz.",
    tag: "Electrical Lessons",
    href: "/quiz?trade=electrical&topic=all-level-2",
  },
  {
    id: "health-safety",
    title: "Health & Safety",
    description:
      "Key laws, risk assessments, PPE, safe isolation, and site safety basics.",
    tag: "Electrical Lessons",
    href: "/quiz?trade=electrical&topic=health-safety",
    topicHref: "/trade/electrical/health-safety",
  },
  {
    id: "principles-electrical-science",
    title: "Principles of Electrical Science",
    description:
      "Ohm’s law, voltage, current, resistance, power, and AC/DC fundamentals.",
    tag: "Electrical Lessons",
    href: "/quiz?trade=electrical&topic=principles-electrical-science",
    topicHref: "/trade/electrical/principles-electrical-science",
  },
  {
    id: "electrical-installation-technology",
    title: "Electrical Installation Technology",
    description:
      "Wiring systems, containment, terminations, circuit design basics, and installation methods.",
    tag: "Electrical Lessons",
    href: "/quiz?trade=electrical&topic=electrical-installation-technology",
    topicHref: "/trade/electrical/electrical-installation-technology",
  },
  {
    id: "installation-wiring-systems-enclosures",
    title: "Installation of Wiring Systems & Enclosures",
    description:
      "Cable routes, safe zones, containment (trunking/conduit), fixings, entries, and enclosures.",
    tag: "Electrical Lessons",
    href: "/quiz?trade=electrical&topic=installation-wiring-systems-enclosures",
    topicHref: "/trade/electrical/installation-wiring",
  },
  {
    id: "communication-within-building-services-engineering",
    title: "Communication within Building Services Engineering",
    description:
      "Communication methods, documentation, teamwork, and coordinating safely on site.",
    tag: "Electrical Lessons",
    href: "/quiz?trade=electrical&topic=communication-within-building-services-engineering",
    topicHref: "/trade/electrical/communication-within-building-services-engineering",
  },
];

export const ELECTRICAL_LEVEL3_CATEGORIES: ElectricalCategory[] = [
  {
    id: "all-level-3",
    title: "Level 3 Mixed (All Topics)",
    description: "All Level 3 topics combined for a full mixed practice quiz.",
    tag: "Electrical Lessons",
    href: "/quiz?trade=electrical&topic=all-level-3&level=3",
  },
  {
    id: "principles-electrical-science",
    title: "Principles of Electrical Science",
    description:
      "Advanced theory, calculations, magnetism, induction, and electronic components.",
    tag: "Electrical Lessons",
    href: "/quiz?trade=electrical&topic=principles-electrical-science&level=3",
    topicHref: "/trade/electrical/principles-electrical-science?level=3",
  },
  {
    id: "electrical-technology",
    title: "Electrical Technology",
    description:
      "Regulations, technical information, supply systems, intake and earthing, and consumer installations.",
    tag: "Electrical Lessons",
    href: "/quiz?trade=electrical&topic=electrical-technology&level=3",
    topicHref: "/trade/electrical/electrical-technology?level=3",
  },
  {
    id: "inspection-testing-commissioning",
    title: "Inspection, Testing & Commissioning",
    description:
      "Initial verification, schedules of inspection, and key test requirements.",
    tag: "Electrical Lessons",
    href: "/quiz?trade=electrical&topic=inspection-testing-commissioning&level=3",
    topicHref: "/trade/electrical/inspection-testing-commissioning?level=3",
  },
];

export function getElectricalLevel3Categories(options?: { includeMixed?: boolean }) {
  if (options?.includeMixed === false) {
    return ELECTRICAL_LEVEL3_CATEGORIES.filter((category) => category.id !== "all-level-3");
  }
  return ELECTRICAL_LEVEL3_CATEGORIES;
}

function topicSlugFromHref(href?: string): string | null {
  if (!href) return null;
  const path = href.split("?")[0] || "";
  const parts = path.split("/").filter(Boolean);
  if (parts.length < 3) return null;
  return parts[2] || null; // /trade/electrical/:topic
}

function validateLessonLinkSlugs() {
  const checks: Array<{
    level: "L2" | "L3";
    categories: ElectricalCategory[];
    guideSlugs: Set<string>;
  }> = [
    {
      level: "L2",
      categories: ELECTRICAL_LEVEL2_CATEGORIES,
      guideSlugs: new Set(electricalTopicGuides.map((g) => g.slug)),
    },
    {
      level: "L3",
      categories: ELECTRICAL_LEVEL3_CATEGORIES,
      guideSlugs: new Set(electricalTopicGuidesLevel3.map((g) => g.slug)),
    },
  ];

  const missingByLevel = checks
    .map(({ level, categories, guideSlugs }) => {
      const missing = categories
        .map((category) => ({
          categoryId: category.id,
          slug: topicSlugFromHref(category.topicHref),
        }))
        .filter((entry) => entry.slug)
        .filter((entry) => !guideSlugs.has(entry.slug as string));

      return { level, missing };
    })
    .filter((entry) => entry.missing.length > 0);

  if (missingByLevel.length === 0) return;

  console.error(
    "[electrical-lesson-slug-check] Missing lesson topic slugs in guide registry",
    missingByLevel.map((entry) => ({
      level: entry.level,
      missingSlugs: entry.missing.map((m) => m.slug),
      categories: entry.missing.map((m) => m.categoryId),
    }))
  );
}

if (process.env.NODE_ENV !== "production") {
  validateLessonLinkSlugs();
}
