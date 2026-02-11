import type { TopicGuide } from "@/data/electricalTopicGuides";

export const electricalTopicGuidesLevel3: TopicGuide[] = [
  {
    slug: "principles-electrical-science",
    title: "Principles of Electrical Science",
    description: "Core formulas, circuits, magnetism, AC/DC basics, transformers, and semiconductors.",
    sections: [
      {
        title: "Units and formulas",
        items: [
          { title: "Units (V, A, Ohms, W, Hz)", detail: "Know the symbols and what each quantity represents." },
          { title: "Ohm's Law", detail: "Use V = I x R to relate voltage, current, and resistance." },
          { title: "Power formulas", detail: "Apply P = VI, P = I^2R, and P = V^2/R." },
          { title: "Simple substitution", detail: "Rearrange and substitute without complex algebra." },
        ],
      },
      {
        title: "Series and parallel circuits",
        items: [
          { title: "Series rules", detail: "Current is common; voltages add across components." },
          { title: "Parallel rules", detail: "Voltage is common; currents add at junctions." },
          { title: "Total resistance", detail: "Series adds; parallel is less than the smallest branch." },
          { title: "Circuit checks", detail: "Verify totals with basic calculations." },
        ],
      },
      {
        title: "Resistance and resistivity",
        items: [
          { title: "Resistivity meaning", detail: "Material property that affects resistance." },
          { title: "R = pL/A", detail: "Resistance depends on resistivity, length, and area." },
          { title: "Length effect", detail: "Longer conductors have higher resistance." },
          { title: "Area effect", detail: "Larger cross-section reduces resistance." },
        ],
      },
      {
        title: "Magnetism and induction",
        items: [
          { title: "Magnetic fields", detail: "Fields surround conductors carrying current." },
          { title: "Electromagnets", detail: "Coils create stronger magnetic fields." },
          { title: "Induction basics", detail: "Changing fields induce voltage in conductors." },
          { title: "Practical examples", detail: "Motors, generators, and relays rely on induction." },
        ],
      },
      {
        title: "AC, DC, and transformers",
        items: [
          { title: "AC vs DC", detail: "AC alternates direction; DC flows in one direction." },
          { title: "Frequency (Hz)", detail: "UK mains is 50 Hz; frequency affects equipment." },
          { title: "Transformer basics", detail: "Step-up or step-down voltage via magnetic induction." },
          { title: "Turns ratio", detail: "Voltage ratio matches the turns ratio." },
        ],
      },
      {
        title: "Semiconductors",
        items: [
          { title: "Diodes", detail: "Allow current in one direction only." },
          { title: "LEDs", detail: "Emit light when forward biased." },
          { title: "Transistors", detail: "Used for switching and amplification." },
          { title: "Thyristors", detail: "Controlled power switching devices." },
        ],
      },
    ],
  },
  {
    slug: "electrical-technology",
    title: "Electrical Technology",
    description: "Regulations, supply characteristics, earthing, protection, and consumer units.",
    sections: [
      {
        title: "BS 7671 overview",
        items: [
          { title: "Purpose", detail: "Sets the safety rules for electrical installations." },
          { title: "Structure", detail: "Parts, chapters, and appendices guide selection and testing." },
          { title: "Scope", detail: "Applies to design, installation, and verification." },
          { title: "Using guidance", detail: "On-Site Guide and GN3 support compliance." },
        ],
      },
      {
        title: "Supply characteristics",
        items: [
          { title: "Supply type", detail: "Single-phase or three-phase supply arrangements." },
          { title: "Voltage and frequency", detail: "Nominal 230/400 V at 50 Hz." },
          { title: "Prospective fault current", detail: "Highest possible fault current at a point." },
          { title: "External earth impedance", detail: "Z(e) influences protection requirements." },
        ],
      },
      {
        title: "Earthing systems",
        items: [
          { title: "TN-S", detail: "Separate protective earth and neutral conductors." },
          { title: "TN-C-S", detail: "Combined PEN conductor; PME supply." },
          { title: "TT", detail: "Local earth electrode used at the installation." },
          { title: "System selection", detail: "Impacts protection and bonding requirements." },
        ],
      },
      {
        title: "Protective devices",
        items: [
          { title: "MCB", detail: "Overcurrent protection with resettable operation." },
          { title: "RCD", detail: "Additional protection by detecting earth leakage." },
          { title: "RCBO", detail: "Combined overcurrent and residual current protection." },
          { title: "Device selection", detail: "Match ratings to circuit design and fault levels." },
        ],
      },
      {
        title: "Fault and additional protection",
        items: [
          { title: "Fault protection", detail: "ADS to clear faults quickly." },
          { title: "Additional protection", detail: "Usually 30 mA RCD for extra safety." },
          { title: "Disconnection times", detail: "Must meet BS 7671 limits." },
          { title: "Verification", detail: "Confirm Zs and RCD performance." },
        ],
      },
      {
        title: "Consumer units and bonding",
        items: [
          { title: "Consumer units", detail: "Main distribution point for final circuits." },
          { title: "Main bonding", detail: "Connects services to the MET." },
          { title: "Supplementary bonding", detail: "Local bonding where required by risk." },
          { title: "Labeling", detail: "Identify protective devices and bonding." },
        ],
      },
    ],
  },
  {
    slug: "installation-methods",
    title: "Installation Methods",
    description: "Cables, containment, zones, terminations, IP ratings, and environments.",
    sections: [
      {
        title: "Cable types",
        items: [
          { title: "Twin & Earth", detail: "Common domestic cable for fixed wiring." },
          { title: "SWA", detail: "Armored cable for mechanical protection." },
          { title: "MICC", detail: "Mineral insulated for high heat resistance." },
          { title: "Selection factors", detail: "Environment, mechanical risk, and temperature." },
        ],
      },
      {
        title: "Containment systems",
        items: [
          { title: "Conduit", detail: "Protects cables; allows pulling and replacement." },
          { title: "Trunking", detail: "Enclosure for multiple cables; easy access." },
          { title: "Cable tray", detail: "Supports grouped cables in industrial runs." },
          { title: "Fixings", detail: "Support spacing affects sag and heat dissipation." },
        ],
      },
      {
        title: "Installation zones",
        items: [
          { title: "Safe zones", detail: "Routes for concealed cables to reduce risk." },
          { title: "Depth rules", detail: "Consider RCD protection when buried." },
          { title: "Accessory alignment", detail: "Cables run vertically and horizontally from points." },
          { title: "Avoiding damage", detail: "Plan routes away from fixings and heat." },
        ],
      },
      {
        title: "Termination methods",
        items: [
          { title: "Correct stripping", detail: "Avoid conductor damage." },
          { title: "Ferrules and lugs", detail: "Use where required by equipment." },
          { title: "Tightening torque", detail: "Prevent loose connections and overheating." },
          { title: "Inspection checks", detail: "Confirm polarity and continuity at terminations." },
        ],
      },
      {
        title: "IP ratings and environment",
        items: [
          { title: "IP code", detail: "Ingress protection against solids and liquids." },
          { title: "External use", detail: "Choose suitable enclosures for weather exposure." },
          { title: "Heat and grouping", detail: "Temperature and bunching reduce capacity." },
          { title: "Corrosion risks", detail: "Select materials for chemical or marine areas." },
        ],
      },
    ],
  },
  {
    slug: "inspection-testing-commissioning",
    title: "Inspection, Testing & Commissioning",
    description: "Sequence of tests, key measurements, and certification.",
    sections: [
      {
        title: "Sequence of testing",
        items: [
          { title: "Order of tests", detail: "Follow safe sequence from dead to live tests." },
          { title: "Dead tests", detail: "Continuity, insulation resistance, and polarity." },
          { title: "Live tests", detail: "Zs, RCD, and operational checks." },
          { title: "Recording results", detail: "Document all values on certificates." },
        ],
      },
      {
        title: "Continuity and insulation",
        items: [
          { title: "Continuity", detail: "Proves CPCs and ring finals are intact." },
          { title: "Insulation resistance", detail: "Checks cable insulation quality." },
          { title: "Polarity", detail: "Confirms line and neutral are correctly connected." },
          { title: "Safe isolation", detail: "Prove dead before any test work." },
        ],
      },
      {
        title: "Earth fault loop impedance",
        items: [
          { title: "Zs meaning", detail: "Total earth fault loop impedance at a point." },
          { title: "Disconnection", detail: "Zs must meet limits for ADS." },
          { title: "Prospective fault current", detail: "Derived from measured impedance." },
          { title: "Test method", detail: "Use appropriate loop tester settings." },
        ],
      },
      {
        title: "RCD testing",
        items: [
          { title: "Purpose", detail: "Confirms RCD trips within required time." },
          { title: "Test currents", detail: "Use 1x and 5x rated residual current." },
          { title: "Trip times", detail: "Must meet BS 7671 limits." },
          { title: "Record results", detail: "Note times and device type." },
        ],
      },
      {
        title: "Certificates and documentation",
        items: [
          { title: "EIC", detail: "Electrical Installation Certificate for new work." },
          { title: "EICR", detail: "Condition report for existing installations." },
          { title: "Minor Works", detail: "Certificate for small additions." },
          { title: "Handover", detail: "Provide results, schedules, and user info." },
        ],
      },
    ],
  },
  {
    slug: "communication-within-building-services-engineering",
    title: "Communication",
    description: "Site roles, information flow, drawings, and handover.",
    sections: [
      {
        title: "Roles on site",
        items: [
          { title: "Client and designer", detail: "Define requirements and specifications." },
          { title: "Principal contractor", detail: "Coordinates site activities and safety." },
          { title: "Supervisor", detail: "Oversees work quality and compliance." },
          { title: "Electrician", detail: "Delivers installation to spec." },
        ],
      },
      {
        title: "Communication methods",
        items: [
          { title: "Verbal updates", detail: "Daily briefings and toolbox talks." },
          { title: "Written records", detail: "Permits, RAMS, and change notes." },
          { title: "Digital systems", detail: "Email, project portals, and drawings." },
          { title: "Escalation", detail: "Report issues early to avoid rework." },
        ],
      },
      {
        title: "Drawings and specifications",
        items: [
          { title: "Plans and schematics", detail: "Show routes, circuits, and device locations." },
          { title: "Schedules", detail: "Circuit schedules and device lists." },
          { title: "Standards", detail: "Refer to BS 7671 and project specs." },
          { title: "Revisions", detail: "Use latest versions and mark changes." },
        ],
      },
      {
        title: "Handover information",
        items: [
          { title: "As-built info", detail: "Provide final drawings and schedules." },
          { title: "Certificates", detail: "Include EIC/EICR and test results." },
          { title: "O&M manuals", detail: "Provide maintenance and user guidance." },
          { title: "Client briefing", detail: "Explain operation and safety points." },
        ],
      },
    ],
  },
];
