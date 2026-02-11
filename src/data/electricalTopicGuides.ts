export type TopicGuideItem = {
  title: string;
  detail: string;
};

export type TopicGuideSection = {
  title: string;
  items: TopicGuideItem[];
};

export type TopicGuide = {
  slug: string;
  title: string;
  description: string;
  sections: TopicGuideSection[];
};

export const electricalTopicGuides: TopicGuide[] = [
  {
    slug: "health-safety",
    title: "Health & Safety",
    description: "Legal duties, risk control, and safe working practices for electrical work.",
    sections: [
      {
        title: "Health and Safety at Work",
        items: [
          { title: "Purpose of the Act", detail: "Sets the legal framework for safe working standards." },
          { title: "Employer duties", detail: "Provide safe systems, training, supervision, and equipment." },
          { title: "Employee duties", detail: "Take reasonable care and cooperate with safety rules." },
          { title: "Penalties", detail: "Breaches can lead to prosecution, fines, or imprisonment." },
        ],
      },
      {
        title: "Risk assessment and control",
        items: [
          { title: "Hazard identification", detail: "Spot electrical, mechanical, and environmental hazards early." },
          { title: "Risk evaluation", detail: "Judge likelihood and severity before starting work." },
          { title: "Control measures", detail: "Eliminate, reduce, or isolate hazards where possible." },
          { title: "Method statements", detail: "Document the safe sequence of work." },
        ],
      },
      {
        title: "Safe isolation",
        items: [
          { title: "Prove dead", detail: "Test before touch using approved test equipment." },
          { title: "Lock off", detail: "Prevent inadvertent re-energization." },
          { title: "Warning notices", detail: "Tag and label isolation points." },
          { title: "Re-test", detail: "Confirm isolation after interruptions." },
        ],
      },
      {
        title: "PPE and tools",
        items: [
          { title: "PPE selection", detail: "Choose PPE suited to the hazard (eyes, hands, hearing)." },
          { title: "Tool inspection", detail: "Check tools, leads, and test equipment before use." },
          { title: "Portable equipment", detail: "Use inspection and testing routines." },
          { title: "Housekeeping", detail: "Keep work areas tidy to reduce trips and contact risks." },
        ],
      },
      {
        title: "Fire and emergencies",
        items: [
          { title: "Fire types", detail: "Select the correct extinguisher for the class." },
          { title: "Evacuation", detail: "Know escape routes and assembly points." },
          { title: "First aid", detail: "Know how to summon help and where equipment is stored." },
          { title: "Reporting", detail: "Report incidents and near misses promptly." },
        ],
      },
    ],
  },
  {
    slug: "principles-electrical-science",
    title: "Principles of Electrical Science",
    description: "Core quantities, AC/DC fundamentals, and circuit principles.",
    sections: [
      {
        title: "Units and quantities",
        items: [
          { title: "Current (A)", detail: "Rate of flow of electric charge." },
          { title: "Voltage (V)", detail: "Potential difference that drives current." },
          { title: "Resistance (Ohms)", detail: "Opposition to current flow." },
          { title: "Power (W)", detail: "Rate of energy transfer." },
        ],
      },
      {
        title: "Ohm's law and power",
        items: [
          { title: "V = I x R", detail: "Relates voltage, current, and resistance." },
          { title: "Rearranging", detail: "Solve for I or R using transposition." },
          { title: "P = VI", detail: "Power equals voltage times current." },
          { title: "P = I^2R", detail: "Alternative power relationship." },
        ],
      },
      {
        title: "Series and parallel",
        items: [
          { title: "Series circuits", detail: "Current is common; voltages add." },
          { title: "Parallel circuits", detail: "Voltage is common; currents add." },
          { title: "Total resistance", detail: "Series adds; parallel is less than smallest branch." },
          { title: "Basic checks", detail: "Confirm totals with simple calculations." },
        ],
      },
      {
        title: "AC and DC",
        items: [
          { title: "DC supply", detail: "Flows in one direction." },
          { title: "AC supply", detail: "Alternates direction at a frequency." },
          { title: "Frequency (Hz)", detail: "UK mains at 50 Hz." },
          { title: "Waveform basics", detail: "Know the sinusoidal shape and key points." },
        ],
      },
      {
        title: "Magnetism and induction",
        items: [
          { title: "Magnetic fields", detail: "Fields surround conductors carrying current." },
          { title: "Electromagnets", detail: "Coils create stronger magnetic fields." },
          { title: "Induction", detail: "Changing fields induce voltage." },
          { title: "Applications", detail: "Used in relays, motors, and transformers." },
        ],
      },
    ],
  },
  {
    slug: "electrical-installation-technology",
    title: "Electrical Installation Technology",
    description: "Wiring systems, accessories, protection, and installation practices.",
    sections: [
      {
        title: "Cables and wiring",
        items: [
          { title: "Cable types", detail: "T&E, SWA, flex, and data cabling use cases." },
          { title: "Cable selection", detail: "Consider environment, current, and protection." },
          { title: "Grouping and insulation", detail: "Impacts current-carrying capacity." },
          { title: "Voltage drop", detail: "Keep within limits for performance and safety." },
        ],
      },
      {
        title: "Protection and switching",
        items: [
          { title: "Fuses and MCBs", detail: "Provide overcurrent protection." },
          { title: "RCDs", detail: "Additional protection against electric shock." },
          { title: "Isolation", detail: "Switching and isolation requirements." },
          { title: "Labels", detail: "Clear identification of circuits and devices." },
        ],
      },
      {
        title: "Accessories and equipment",
        items: [
          { title: "Sockets and switches", detail: "Correct ratings and installation." },
          { title: "Luminaires", detail: "Support, protection, and IP requirements." },
          { title: "Consumer units", detail: "Main distribution point for final circuits." },
          { title: "Earthing", detail: "Ensure continuity of CPC and bonding." },
        ],
      },
      {
        title: "Testing basics",
        items: [
          { title: "Continuity", detail: "Verify CPCs and ring circuits." },
          { title: "Insulation resistance", detail: "Check cable insulation quality." },
          { title: "Polarity", detail: "Confirm correct line/neutral connections." },
          { title: "Functional checks", detail: "Verify switches and safety devices." },
        ],
      },
    ],
  },
  {
    slug: "installation-wiring",
    title: "Installation of Wiring Systems & Enclosures",
    description: "Containment, routes, terminations, enclosures, and environmental factors.",
    sections: [
      {
        title: "Containment systems",
        items: [
          { title: "Conduit", detail: "Protects cables and allows replacement." },
          { title: "Trunking", detail: "Encloses multiple cables with accessible covers." },
          { title: "Cable tray", detail: "Supports grouped cables in industrial runs." },
          { title: "Fixings", detail: "Support spacing affects sag and heat." },
        ],
      },
      {
        title: "Cable routes and zones",
        items: [
          { title: "Safe zones", detail: "Routes for concealed cables to reduce risk." },
          { title: "Depth rules", detail: "RCD protection when buried in walls." },
          { title: "Accessory alignment", detail: "Cables run vertical/horizontal from points." },
          { title: "Avoiding damage", detail: "Plan away from fixings and heat sources." },
        ],
      },
      {
        title: "Terminations and joints",
        items: [
          { title: "Stripping", detail: "Avoid conductor damage and nicking." },
          { title: "Glands", detail: "Maintain mechanical protection and IP rating." },
          { title: "Torque", detail: "Tighten to manufacturer specification." },
          { title: "Inspection", detail: "Check for secure terminations and correct polarity." },
        ],
      },
      {
        title: "Enclosures and IP",
        items: [
          { title: "IP ratings", detail: "Ingress protection against dust and water." },
          { title: "Environmental factors", detail: "Heat, corrosion, and moisture affect choices." },
          { title: "Sealing", detail: "Maintain rating at entries and joints." },
          { title: "External use", detail: "Choose suitable materials and fixings." },
        ],
      },
    ],
  },
  {
    slug: "communication-within-building-services-engineering",
    title: "Communication within Building Services Engineering",
    description: "Working with others, documentation, and handover information.",
    sections: [
      {
        title: "Roles and responsibilities",
        items: [
          { title: "Site roles", detail: "Client, designer, contractor, and supervisor." },
          { title: "Coordination", detail: "Plan work with other trades." },
          { title: "Permits", detail: "Understand permit-to-work procedures." },
          { title: "Briefings", detail: "Toolbox talks and daily updates." },
        ],
      },
      {
        title: "Communication methods",
        items: [
          { title: "Verbal", detail: "Clear, timely updates on site." },
          { title: "Written", detail: "RAMS, permits, and change notes." },
          { title: "Digital", detail: "Email, portals, and drawing management." },
          { title: "Escalation", detail: "Report issues early to avoid rework." },
        ],
      },
      {
        title: "Drawings and specs",
        items: [
          { title: "Plans and schematics", detail: "Show circuits, routes, and device locations." },
          { title: "Schedules", detail: "Circuit schedules and device lists." },
          { title: "Standards", detail: "Follow BS 7671 and project specifications." },
          { title: "Revisions", detail: "Work to the latest issue." },
        ],
      },
      {
        title: "Handover",
        items: [
          { title: "As-built info", detail: "Provide final drawings and schedules." },
          { title: "Certificates", detail: "Issue relevant test certificates." },
          { title: "User guidance", detail: "Explain operation and safety points." },
          { title: "O&M manuals", detail: "Provide maintenance documentation." },
        ],
      },
    ],
  },
];
