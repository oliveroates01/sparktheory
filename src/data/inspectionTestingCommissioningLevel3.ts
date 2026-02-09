export const inspectionTestingCommissioningLevel3Questions = [
  {
    id: "itc3-001",
    question: "On an Electrical Installation Certificate schedule of inspection, boxes should be marked:",
    options: [
      "Ticked for compliance or N/A, and defects corrected before certification",
      "Unsatisfactory and left for later",
      "Only with dates",
      "Only for new installations",
    ],
    correctIndex: 0,
    explanation:
      "The schedule uses ticks or N/A; unsatisfactory items must be corrected before certification.",
  },
  {
    id: "itc3-002",
    question: "If an installation has a standby generator as an alternative supply, inspection should confirm:",
    options: [
      "A changeover arrangement prevents back‑feeding the public supply",
      "It is connected directly to the intake without isolation",
      "It shares the same neutral without any control",
      "It bypasses the main switch",
    ],
    correctIndex: 0,
    explanation:
      "A changeover switch should prevent the generator energising the public supply.",
  },
  {
    id: "itc3-003",
    question: "For a PV system operating in parallel with the public supply, inspection checks should confirm:",
    options: [
      "The inverter disconnects on supply loss",
      "The PV keeps energising the supply during outages",
      "The PV has no earthing",
      "The PV bypasses protective devices",
    ],
    correctIndex: 0,
    explanation:
      "Grid‑tie inverters must shut down if the public supply fails.",
  },
  {
    id: "itc3-004",
    question: "Which item checks the distributor’s earthing arrangement?",
    options: [
      "Correct connection of the MET to the supply earthing",
      "Position of light switches",
      "Number of socket outlets",
      "Type of lamp holders",
    ],
    correctIndex: 0,
    explanation:
      "The MET must be correctly connected to the supply earthing arrangement.",
  },
  {
    id: "itc3-005",
    question: "For TT systems, inspection should confirm:",
    options: [
      "A correctly selected and installed earth electrode",
      "A direct connection to the supply PEN",
      "No earthing at all",
      "A neutral‑earth link in the installation",
    ],
    correctIndex: 0,
    explanation:
      "TT systems require an earth electrode connected to the MET.",
  },
  {
    id: "itc3-006",
    question: "Main protective bonding conductors should be connected:",
    options: [
      "Within 600 mm of service entry or meter (if practicable)",
      "At the furthest branch",
      "On flexible pipe sections",
      "After any tee joints",
    ],
    correctIndex: 0,
    explanation:
      "Bonding is normally within 600 mm of entry or meter and before branches.",
  },
  {
    id: "itc3-007",
    question: "Protective bonding conductor sizes for TN‑S and TT are based on:",
    options: [
      "Half the earthing conductor, minimum 6 mm², maximum 25 mm²",
      "Equal to line conductor size only",
      "Fixed at 10 mm² always",
      "Based on breaker rating only",
    ],
    correctIndex: 0,
    explanation:
      "TN‑S/TT bonding uses half the earthing conductor with 6–25 mm² limits.",
  },
  {
    id: "itc3-008",
    question: "For TN‑C‑S (PME), bonding conductor size is determined by:",
    options: [
      "Supply neutral size and Table 54.8",
      "Circuit length only",
      "RCD rating",
      "Switchgear type",
    ],
    correctIndex: 0,
    explanation:
      "TN‑C‑S bonding uses the supply neutral size per Table 54.8.",
  },
  {
    id: "itc3-009",
    question: "Main protective bonding conductors should be coloured:",
    options: [
      "Green and yellow",
      "Brown",
      "Blue",
      "Black",
    ],
    correctIndex: 0,
    explanation:
      "Protective bonding conductors use green/yellow insulation.",
  },
  {
    id: "itc3-010",
    question: "Bonding clamps must comply with:",
    options: [
      "BS 951",
      "BS 7671 Part 7",
      "BS 5839",
      "BS 1387",
    ],
    correctIndex: 0,
    explanation:
      "Bonding clamps for pipework should meet BS 951.",
  },
  {
    id: "itc3-011",
    question: "BS 951 clamps are designed for:",
    options: [
      "Circular pipes or rods",
      "Flat steel beams",
      "Armoured cable glands",
      "Plastic pipes",
    ],
    correctIndex: 0,
    explanation:
      "BS 951 clamps are intended for circular pipes/rods.",
  },
  {
    id: "itc3-012",
    question: "Colour coding for BS 951 clamps uses:",
    options: [
      "Red for dry, blue/green for corrosive or humid",
      "Red for corrosive, blue for dry",
      "Green for dry only",
      "No colour coding",
    ],
    correctIndex: 0,
    explanation:
      "Red is for dry conditions; blue/green are for corrosive or humid environments.",
  },
  {
    id: "itc3-013",
    question: "Bonding connection labels must state:",
    options: [
      "Safety electrical connection – do not remove",
      "Danger 230 V",
      "Tested OK",
      "No label required",
    ],
    correctIndex: 0,
    explanation:
      "BS 7671 requires a permanent label stating ‘safety electrical connection – do not remove’.",
  },
  {
    id: "itc3-014",
    question: "Basic protection can be provided by:",
    options: [
      "Insulation of live parts",
      "RCDs only",
      "Supplementary bonding only",
      "Warning labels only",
    ],
    correctIndex: 0,
    explanation:
      "Basic protection includes insulation of live parts.",
  },
  {
    id: "itc3-015",
    question: "Barriers/enclosures for basic protection should typically provide:",
    options: [
      "At least IP2X or IPXXB on accessible surfaces",
      "Only IP00",
      "Only IP1X",
      "No IP requirement",
    ],
    correctIndex: 0,
    explanation:
      "Accessible surfaces should achieve IP2X/IPXXB (and IP4X/IPXXD on top surfaces).",
  },
  {
    id: "itc3-016",
    question: "SELV systems require:",
    options: [
      "Separation from earth and suitable separation device",
      "Direct connection to earth",
      "Use of PEN conductor",
      "No segregation from other circuits",
    ],
    correctIndex: 0,
    explanation:
      "SELV requires separation from earth and a suitable separating source.",
  },
  {
    id: "itc3-017",
    question: "PELV systems differ from SELV because:",
    options: [
      "They may not be separated from earth",
      "They use higher voltages",
      "They are AC only",
      "They require no transformer",
    ],
    correctIndex: 0,
    explanation:
      "PELV may be earthed, unlike SELV.",
  },
  {
    id: "itc3-018",
    question: "Where disconnection times cannot be met and RCDs are not feasible, inspection may consider:",
    options: [
      "Local supplementary equipotential bonding",
      "Removing protective devices",
      "Using thinner conductors",
      "Lowering supply voltage permanently",
    ],
    correctIndex: 0,
    explanation:
      "Local bonding can reduce touch‑voltage risk where ADS is not feasible.",
  },
  {
    id: "itc3-019",
    question: "RCDs used for additional protection should typically be rated at:",
    options: [
      "30 mA or less",
      "300 mA",
      "500 mA",
      "1 A",
    ],
    correctIndex: 0,
    explanation:
      "Additional protection usually requires 30 mA RCDs.",
  },
  {
    id: "itc3-020",
    question: "FELV refers to circuits where:",
    options: [
      "SELV/PELV requirements are not met but voltage is below 50 V AC",
      "Voltage is above 230 V",
      "Only DC is used",
      "All circuits are double insulated",
    ],
    correctIndex: 0,
    explanation:
      "FELV is extra‑low voltage without SELV/PELV separation requirements.",
  },
  {
    id: "itc3-021",
    question: "RLV circuits supplying 110 V AC must comply with:",
    options: [
      "Section 418 and appropriate Zs values",
      "Only Part 7",
      "No earth fault requirements",
      "Only IP rating",
    ],
    correctIndex: 0,
    explanation:
      "RLV requirements include Section 418 and earth‑fault loop impedance limits.",
  },
  {
    id: "itc3-022",
    question: "For bonding clamps, the connection point should be:",
    options: [
      "Accessible for future inspection and testing",
      "Hidden inside walls",
      "Covered permanently by insulation",
      "Placed after flexible sections",
    ],
    correctIndex: 0,
    explanation:
      "Bonding connections must remain accessible for inspection and testing.",
  },
  {
    id: "itc3-023",
    question: "When identifying extraneous conductive parts, ‘Earth potential’ refers to:",
    options: [
      "The potential of the ground (capital E)",
      "The potential between phases",
      "The voltage of the circuit",
      "A testing voltage only",
    ],
    correctIndex: 0,
    explanation:
      "Earth potential refers to the potential of the ground mass.",
  },
  {
    id: "itc3-024",
    question: "Metallic parts of the electrical installation itself are classed as:",
    options: [
      "Exposed conductive parts",
      "Extraneous conductive parts",
      "Insulated conductive parts",
      "Non‑conductive parts",
    ],
    correctIndex: 0,
    explanation:
      "Metallic parts of the installation are exposed conductive parts that require earthing.",
  },
  {
    id: "itc3-025",
    question: "For inspections, a changeover switch is important because it:",
    options: [
      "Prevents paralleling a standby generator with the public supply",
      "Increases Zs",
      "Replaces RCDs",
      "Provides overcurrent protection",
    ],
    correctIndex: 0,
    explanation:
      "Changeover switches prevent unsafe back‑feeding of the supply network.",
  },
  {
    id: "itc3-026",
    question: "A bonding clamp must be labelled per BS 7671 at the:",
    options: [
      "Point of connection to an extraneous conductive part",
      "Consumer unit front cover",
      "Main switch handle",
      "Lighting switch",
    ],
    correctIndex: 0,
    explanation:
      "Labels are required at the connection point to extraneous conductive parts.",
  },
  {
    id: "itc3-027",
    question: "In a schedule of inspection, the intake equipment section includes checks on:",
    options: [
      "Isolator and meter tails for protection and secure fixing",
      "Socket polarity only",
      "RCD trip times only",
      "Lighting controls only",
    ],
    correctIndex: 0,
    explanation:
      "Intake checks include isolator and meter tails for protection and condition.",
  },
  {
    id: "itc3-028",
    question: "Main protective bonding for water services should be connected:",
    options: [
      "On the consumer’s side, after the stopcock",
      "Before the service enters the building",
      "On plastic sections",
      "After tee joints",
    ],
    correctIndex: 0,
    explanation:
      "Bonding should be on the consumer’s side, after the stopcock and before branches.",
  },
  {
    id: "itc3-029",
    question: "A bonding clamp should be suitable for:",
    options: [
      "The environment where it is installed",
      "Only indoor use",
      "Only plastic pipes",
      "No label requirements",
    ],
    correctIndex: 0,
    explanation:
      "Clamps must suit the environmental conditions and be durable.",
  },
  {
    id: "itc3-030",
    question: "For ADS, RCDs are relied on for fault protection when:",
    options: [
      "Zs values are too high to meet disconnection times",
      "Zs values are very low",
      "No protective devices are fitted",
      "Only SELV circuits are used",
    ],
    correctIndex: 0,
    explanation:
      "Where Zs is too high to meet disconnection times, RCDs may be used for fault protection.",
  },
];
