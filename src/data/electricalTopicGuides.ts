import { validateGuideLevelBoundaries } from "@/data/electricalGuideValidation";

export type TopicGuideItem = {
  title: string;
  detail: string;
};

export type TopicGuideSection = {
  title: string;
  items: TopicGuideItem[];
};

export type ContentLevelTag = "L2" | "L3";

export type TopicGuide = {
  slug: string;
  title: string;
  description: string;
  levelTag: ContentLevelTag;
  sections: TopicGuideSection[];
};

export const electricalTopicGuides: TopicGuide[] = [
  {
    slug: "health-safety",
    title: "Health & Safety",
    description: "Safe working routines, risk control, and legal duties for everyday electrical work.",
    levelTag: "L2",
    sections: [
      {
        title: "Health and Safety at Work",
        items: [
          { title: "Purpose of the Act", detail: "Sets the legal framework for safe working standards." },
          { title: "Employer duties", detail: "Provide safe systems, training, supervision, and suitable equipment." },
          { title: "Employee duties", detail: "Take reasonable care and follow site safety rules." },
          { title: "Penalties", detail: "Breaches can lead to enforcement action, fines, or prosecution." },
        ],
      },
      {
        title: "Risk assessment and control",
        items: [
          { title: "Hazard identification", detail: "Spot electrical, mechanical, and environmental hazards before work starts." },
          { title: "Risk evaluation", detail: "Judge likelihood and severity so controls match the task." },
          { title: "Control measures", detail: "Use elimination, reduction, isolation, and supervision to lower risk." },
          { title: "Method statements", detail: "Follow a clear safe sequence of work from start to finish." },
        ],
      },
      {
        title: "Safe isolation",
        items: [
          { title: "Prove dead", detail: "Test before touch using approved voltage indicators and proving units." },
          { title: "Lock off", detail: "Secure isolation points so circuits cannot be re-energised accidentally." },
          { title: "Warning notices", detail: "Use tags and labels to show circuits are isolated for work." },
          { title: "Re-test", detail: "Reconfirm isolation after any break in the task." },
        ],
      },
      {
        title: "PPE and tools",
        items: [
          { title: "PPE selection", detail: "Choose eye, hand, and hearing protection to match the hazard." },
          { title: "Tool inspection", detail: "Check tools, test leads, and instruments before use." },
          { title: "Portable equipment", detail: "Use simple inspection and testing routines to keep equipment safe." },
          { title: "Housekeeping", detail: "Keep work areas tidy to reduce trips, falls, and contact risks." },
        ],
      },
      {
        title: "Fire and emergencies",
        items: [
          { title: "Fire types", detail: "Choose the correct extinguisher for each class of fire." },
          { title: "Evacuation", detail: "Know escape routes and assembly points on every site." },
          { title: "First aid", detail: "Know how to summon help and where first aid equipment is kept." },
          { title: "Reporting", detail: "Report incidents and near misses promptly and clearly." },
        ],
      },
    ],
  },
  {
    slug: "principles-electrical-science",
    title: "Principles of Electrical Science",
    description: "DC basics, simple power, series and parallel circuits, and straightforward calculations.",
    levelTag: "L2",
    sections: [
      {
        title: "Units and quantities",
        items: [
          { title: "Current (A)", detail: "Understand current as the flow of electric charge in a circuit." },
          { title: "Voltage (V)", detail: "Understand voltage as the electrical push that drives current." },
          { title: "Resistance (Ohms)", detail: "Understand resistance as opposition to current flow." },
          { title: "Power (W)", detail: "Understand power as the rate electrical energy is used." },
        ],
      },
      {
        title: "Ohm's law and simple power",
        items: [
          { title: "V = I x R", detail: "Apply Ohm's Law to find one unknown from two known values." },
          { title: "Rearranging", detail: "Rearrange formulas correctly for straightforward calculation questions." },
          { title: "P = VI", detail: "Use the basic power formula in simple DC and single-load questions." },
          { title: "P = I^2R", detail: "Use I squared R for simple conductor heating or power checks." },
        ],
      },
      {
        title: "Series and parallel circuits",
        items: [
          { title: "Series circuits", detail: "Recognise that current is common and voltages add in series circuits." },
          { title: "Parallel circuits", detail: "Recognise that voltage is common and currents add in parallel circuits." },
          { title: "Total resistance", detail: "Calculate basic total resistance for simple series and parallel networks." },
          { title: "Basic checks", detail: "Check answers with simple substitutions and unit checks." },
        ],
      },
      {
        title: "Safe working and basic testing",
        items: [
          { title: "Safe isolation", detail: "Use safe isolation before testing or working on electrical equipment." },
          { title: "Continuity basics", detail: "Carry out basic continuity checks to confirm complete conductors." },
          { title: "Polarity basics", detail: "Confirm basic line and neutral connections are correct." },
          { title: "Simple fault finding", detail: "Use straightforward tests and readings to identify common faults." },
        ],
      },
    ],
  },
  {
    slug: "electrical-installation-technology",
    title: "Electrical Installation Technology",
    description: "Core installation practice, basic protection, and simple verification for Level 2 work.",
    levelTag: "L2",
    sections: [
      {
        title: "Cables and wiring",
        items: [
          { title: "Cable types", detail: "Identify common cable types such as T&E, flex, and SWA by use." },
          { title: "Basic cable choice", detail: "Select suitable cables for simple indoor and outdoor tasks." },
          { title: "Mechanical protection", detail: "Use suitable containment or protection where damage risk exists." },
          { title: "Route planning", detail: "Plan simple cable runs to avoid heat, damage, and poor access." },
        ],
      },
      {
        title: "Protection and switching",
        items: [
          { title: "Fuses and MCBs", detail: "Identify basic overcurrent protection devices and their purpose." },
          { title: "RCD basics", detail: "Recognise where additional shock protection is required." },
          { title: "Isolation", detail: "Apply correct switching and isolation for maintenance and safety." },
          { title: "Labels", detail: "Use clear circuit labels for safe operation and fault finding." },
        ],
      },
      {
        title: "Accessories and equipment",
        items: [
          { title: "Sockets and switches", detail: "Install and check accessories with correct ratings and secure fixing." },
          { title: "Luminaires", detail: "Fit luminaires with suitable support and protection." },
          { title: "Consumer units", detail: "Recognise the consumer unit as the main distribution point." },
          { title: "Earthing basics", detail: "Confirm CPC continuity and basic bonding presence." },
        ],
      },
      {
        title: "Testing basics",
        items: [
          { title: "Continuity", detail: "Verify continuity of protective conductors and simple circuits." },
          { title: "Insulation resistance", detail: "Carry out insulation checks using standard test procedures." },
          { title: "Polarity", detail: "Confirm line and neutral are connected correctly at points of use." },
          { title: "Functional checks", detail: "Confirm switches and protective devices operate as expected." },
        ],
      },
    ],
  },
  {
    slug: "installation-wiring",
    title: "Installation of Wiring Systems & Enclosures",
    description: "Basic containment, safe cable routes, and good termination practice.",
    levelTag: "L2",
    sections: [
      {
        title: "Containment systems",
        items: [
          { title: "Conduit", detail: "Use conduit where cables need mechanical protection." },
          { title: "Trunking", detail: "Use trunking to contain and access grouped cables." },
          { title: "Cable tray", detail: "Use tray for supported runs in open service areas." },
          { title: "Fixings", detail: "Space fixings correctly to keep containment secure." },
        ],
      },
      {
        title: "Cable routes and zones",
        items: [
          { title: "Safe zones", detail: "Run concealed cables in recognised safe zones." },
          { title: "Depth rules", detail: "Apply basic depth and protection rules in walls." },
          { title: "Accessory alignment", detail: "Route cables vertically or horizontally from accessories." },
          { title: "Avoiding damage", detail: "Keep routes clear of likely screw, nail, and heat hazards." },
        ],
      },
      {
        title: "Terminations and joints",
        items: [
          { title: "Stripping", detail: "Strip insulation without damaging conductors." },
          { title: "Glands", detail: "Fit glands correctly to secure and protect cable entries." },
          { title: "Torque", detail: "Tighten terminations to manufacturer guidance." },
          { title: "Inspection", detail: "Check joints for tightness, polarity, and neat finish." },
        ],
      },
      {
        title: "Enclosures and IP basics",
        items: [
          { title: "IP ratings", detail: "Use basic IP ratings to select suitable enclosures." },
          { title: "Environmental factors", detail: "Choose equipment suitable for damp, dusty, or outdoor areas." },
          { title: "Sealing", detail: "Seal entries correctly to maintain enclosure protection." },
          { title: "External use", detail: "Use suitable materials and fixings for external installations." },
        ],
      },
    ],
  },
  {
    slug: "communication-within-building-services-engineering",
    title: "Communication within Building Services Engineering",
    description: "Clear site communication, correct documents, and practical handover basics.",
    levelTag: "L2",
    sections: [
      {
        title: "Roles and responsibilities",
        items: [
          { title: "Site roles", detail: "Recognise the roles of client, designer, contractor, and supervisor." },
          { title: "Coordination", detail: "Coordinate work with other trades to avoid clashes and delays." },
          { title: "Permits", detail: "Follow permit-to-work requirements where tasks demand control." },
          { title: "Briefings", detail: "Use toolbox talks and daily briefings to share safety and task updates." },
        ],
      },
      {
        title: "Communication methods",
        items: [
          { title: "Verbal", detail: "Give clear verbal updates on progress, risks, and access needs." },
          { title: "Written", detail: "Use RAMS, permits, and notes to record instructions and changes." },
          { title: "Digital", detail: "Use email and digital systems to share current information." },
          { title: "Escalation", detail: "Raise issues early so they can be resolved before rework is needed." },
        ],
      },
      {
        title: "Drawings and specs",
        items: [
          { title: "Plans and schematics", detail: "Read drawings to locate circuits, routes, and accessories." },
          { title: "Schedules", detail: "Use circuit schedules and device lists to plan installation work." },
          { title: "Standards", detail: "Follow BS 7671 and the project specification for installed work." },
          { title: "Revisions", detail: "Check revision status and always work to the latest issue." },
        ],
      },
      {
        title: "Handover",
        items: [
          { title: "As-built info", detail: "Provide final drawings and schedules that match installed work." },
          { title: "Certificates", detail: "Issue required certificates with clear and complete test results." },
          { title: "User guidance", detail: "Explain safe operation and key controls to the end user." },
          { title: "O&M manuals", detail: "Provide maintenance information for future service and repairs." },
        ],
      },
    ],
  },
];


validateGuideLevelBoundaries("L2", electricalTopicGuides);
