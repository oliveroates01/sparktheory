import type { TopicGuide } from "@/data/electricalTopicGuides";

export const electricalTopicGuidesLevel3: TopicGuide[] = [
  
  {
    slug: "principles-electrical-science",
    title: "Principles of Electrical Science",
    description: "Advanced theory, calculations, magnetism, induction, and electronic components.",
    sections: [
      {
        title: "Resistivity and resistance",
        items: [
          { title: "Resistivity meaning", detail: "Material property that affects resistance." },
          { title: "Units", detail: "Resistivity uses ohm-meters." },
          { title: "R = pL/A", detail: "Resistance depends on resistivity, length, and area." },
          { title: "Length effect", detail: "Longer conductors have higher resistance." },
          { title: "Area effect", detail: "Larger cross-section reduces resistance." },
        ],
      },
      {
        title: "Insulation resistance",
        items: [
          { title: "What it shows", detail: "Indicates the quality of insulation." },
          { title: "Typical values", detail: "Higher readings indicate better insulation." },
          { title: "Low readings", detail: "Suggest moisture, damage, or contamination." },
          { title: "Recording results", detail: "Record as greater than scale if exceeded." },
        ],
      },
      {
        title: "Temperature and resistance",
        items: [
          { title: "Temperature coefficient", detail: "Shows how resistance changes with temperature." },
          { title: "Copper behavior", detail: "Resistance increases as temperature rises." },
          { title: "Calculation", detail: "Use the temperature formula to adjust resistance." },
        ],
      },
      {
        title: "Series and parallel circuits",
        items: [
          { title: "Series total", detail: "Total resistance is the sum of all resistors." },
          { title: "Parallel total", detail: "Total resistance is less than the smallest branch." },
          { title: "Constant values", detail: "Series current is constant; parallel voltage is constant." },
          { title: "Conductance", detail: "Reciprocal of resistance, measured in siemens." },
        ],
      },
      {
        title: "Power and energy",
        items: [
          { title: "Power formulas", detail: "Use P = VI, I^2R, and V^2/R." },
          { title: "Energy", detail: "Energy equals power multiplied by time." },
          { title: "Efficiency", detail: "Useful output divided by input." },
        ],
      },
      {
        title: "Magnetism and induction",
        items: [
          { title: "Magnetic fields", detail: "Fields surround conductors carrying current." },
          { title: "Electromagnets", detail: "Coils create stronger magnetic fields." },
          { title: "Induction", detail: "Changing fields induce voltage in conductors." },
        ],
      },
      {
        title: "Electronic components",
        items: [
          { title: "Diodes", detail: "Allow current flow in one direction." },
          { title: "Transistors", detail: "Used for switching and amplification." },
          { title: "Thyristors", detail: "Controlled power switching devices." },
          { title: "Relays", detail: "Electromagnetic switching devices." },
        ],
      },
    ],
  },
  
  {
    slug: "electrical-technology",
    title: "Electrical Technology",
    description: "Regulations, technical information, supply systems, intake and earthing, and consumer installations.",
    sections: [
      {
        title: "Legal framework",
        items: [
          { title: "Statutory regulations", detail: "Legal requirements for electrical work." },
          { title: "HSW Act", detail: "Sets employer and employee duties." },
          { title: "EAWR", detail: "Electrical safety duties under HSW Act." },
          { title: "ESQCR", detail: "Covers safety of the public supply." },
        ],
      },
      {
        title: "Other regulations",
        items: [
          { title: "PUWER", detail: "Work equipment must be suitable and maintained." },
          { title: "COSHH", detail: "Controls risks from hazardous substances." },
          { title: "ACoPs", detail: "Approved codes show accepted compliance methods." },
        ],
      },
      {
        title: "BS 7671 and guidance",
        items: [
          { title: "Part 6", detail: "Covers inspection and testing." },
          { title: "Part 5", detail: "Selection and erection of equipment." },
          { title: "Guidance Notes", detail: "GN3 focuses on inspection and testing." },
          { title: "On-Site Guide", detail: "Provides practical installation guidance." },
        ],
      },
      {
        title: "Technical information",
        items: [
          { title: "Drawings", detail: "Plans, schematics, and circuit schedules." },
          { title: "Manufacturer data", detail: "Ratings, installation, and maintenance details." },
          { title: "Information sources", detail: "Manuals, standards, and online portals." },
          { title: "CPD", detail: "Updates technical knowledge and competence." },
        ],
      },
      {
        title: "HSE enforcement",
        items: [
          { title: "Inspection powers", detail: "Entry, investigation, and issue of notices." },
          { title: "Improvement notice", detail: "Requires correction within a set time." },
          { title: "Prohibition notice", detail: "Stops dangerous work immediately." },
        ],
      },
    ],
  },
  
  {
    slug: "inspection-testing-commissioning",
    title: "Inspection, Testing & Commissioning",
    description: "Initial verification, schedules of inspection, and key test requirements.",
    sections: [
      {
        title: "Schedules and certificates",
        items: [
          { title: "Schedule marking", detail: "Use tick or N/A; defects must be corrected." },
          { title: "Test results", detail: "Record values for each circuit." },
          { title: "Certification", detail: "Issue the correct certificate after completion." },
        ],
      },
      {
        title: "Alternative supplies",
        items: [
          { title: "Standby generators", detail: "Changeover must prevent back-feeding." },
          { title: "PV systems", detail: "Grid-tie inverters must shut down on loss of supply." },
          { title: "Changeover switches", detail: "Prevent unsafe energizing of the public supply." },
        ],
      },
      {
        title: "Earthing and bonding",
        items: [
          { title: "Supply earthing", detail: "Check MET connection to distributor earthing." },
          { title: "TT systems", detail: "Confirm earth electrode connection." },
          { title: "Bonding sizes", detail: "Follow sizing rules for TN-S, TT, and TN-C-S." },
          { title: "Conductor color", detail: "Protective bonding uses green/yellow." },
        ],
      },
      {
        title: "Bonding clamps and labels",
        items: [
          { title: "BS 951 clamps", detail: "Use compliant clamps for pipework." },
          { title: "Color coding", detail: "Clamp color shows suitable environment." },
          { title: "Labels", detail: "Label bonding connections to prevent removal." },
          { title: "Accessibility", detail: "Keep connections accessible for inspection." },
        ],
      },
      {
        title: "Protection measures",
        items: [
          { title: "Basic protection", detail: "Insulation or barriers to prevent contact." },
          { title: "Enclosure rating", detail: "Typically IP2X or IPXXB for accessible parts." },
          { title: "SELV", detail: "Separated extra-low voltage, no earth connection." },
          { title: "PELV", detail: "Similar to SELV but may be earthed." },
          { title: "FELV", detail: "Extra-low voltage without SELV/PELV separation." },
          { title: "RCD protection", detail: "Additional protection usually 30 mA." },
        ],
      },
      {
        title: "Disconnection and ADS",
        items: [
          { title: "ADS", detail: "Automatic disconnection of supply for fault protection." },
          { title: "Zs limits", detail: "Earth fault loop impedance must meet limits." },
          { title: "Local bonding", detail: "May reduce touch voltage when ADS not feasible." },
        ],
      },
    ],
  },
];
