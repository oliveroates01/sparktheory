import type { TopicGuide } from "@/data/electricalTopicGuides";

export const electricalTopicGuidesLevel3: TopicGuide[] = [
  {
    slug: "principles-electrical-science",
    title: "Principles of Electrical Science",
    description: "Advanced calculations, electromagnetic behavior, and higher-level AC theory.",
    sections: [
      {
        title: "Advanced calculation methods",
        items: [
          { title: "RMS and peak relationships", detail: "Convert between peak, peak-to-peak, and RMS values for AC signals." },
          { title: "Power factor impact", detail: "Relate real, reactive, and apparent power in practical circuits." },
          { title: "Loss estimation", detail: "Estimate I^2R losses and thermal effects in loaded conductors." },
          { title: "Formula selection", detail: "Choose the correct equation based on known and unknown quantities." },
        ],
      },
      {
        title: "Impedance and complex AC circuits",
        items: [
          { title: "Impedance concept", detail: "Treat opposition in AC as combined resistance and reactance." },
          { title: "Inductive and capacitive reactance", detail: "Understand how frequency changes circuit behavior." },
          { title: "Series/parallel impedance", detail: "Determine equivalent impedance in mixed AC networks." },
          { title: "Phase relationships", detail: "Track current and voltage phase shift through components." },
        ],
      },
      {
        title: "Material science and resistance behavior",
        items: [
          { title: "Resistivity in design", detail: "Use material resistivity when selecting conductor sizes." },
          { title: "Temperature coefficient", detail: "Apply resistance change with temperature for copper and alloys." },
          { title: "Conductor geometry effects", detail: "Model how length and area influence voltage drop and heating." },
          { title: "Performance trade-offs", detail: "Balance electrical performance, cost, and installation practicality." },
        ],
      },
      {
        title: "Electromagnetic machine principles",
        items: [
          { title: "Flux linkage", detail: "Relate turns, current, and magnetic flux in coils and machines." },
          { title: "Induced EMF mechanisms", detail: "Differentiate dynamic and static induction in practical equipment." },
          { title: "Machine torque fundamentals", detail: "Connect magnetic field interaction to motor torque production." },
          { title: "Efficiency influences", detail: "Recognize how copper, iron, and mechanical losses reduce output." },
        ],
      },
      {
        title: "Transformer operation and performance",
        items: [
          { title: "Turns ratio analysis", detail: "Use ratio calculations for voltage, current, and winding relationships." },
          { title: "No-load and load behavior", detail: "Interpret transformer performance under changing demand." },
          { title: "Regulation and efficiency", detail: "Assess voltage regulation and efficiency at different load factors." },
          { title: "Protection considerations", detail: "Identify common protection needs for transformer-fed circuits." },
        ],
      },
      {
        title: "Semiconductor applications",
        items: [
          { title: "Diode operating regions", detail: "Distinguish forward, reverse, and breakdown behavior." },
          { title: "Rectification quality", detail: "Compare half-wave and full-wave output characteristics." },
          { title: "Switching devices", detail: "Apply transistor and thyristor behavior in control circuits." },
          { title: "Component limits", detail: "Respect thermal and voltage ratings in design decisions." },
        ],
      },
    ],
  },
  {
    slug: "electrical-technology",
    title: "Electrical Technology",
    description: "Regulatory interpretation, fault-level thinking, and higher-level protection strategy.",
    sections: [
      {
        title: "Regulatory framework in practice",
        items: [
          { title: "BS 7671 interpretation", detail: "Apply regulation intent to real installation scenarios." },
          { title: "Cross-standard coordination", detail: "Relate BS 7671 requirements to statutory regulations." },
          { title: "Compliance evidence", detail: "Produce records that demonstrate design and verification decisions." },
          { title: "Technical justification", detail: "Defend departures and selections with engineering reasoning." },
        ],
      },
      {
        title: "Supply characteristics and fault levels",
        items: [
          { title: "Prospective fault analysis", detail: "Estimate and interpret likely fault current at origin and final circuits." },
          { title: "External impedance effects", detail: "Understand how Ze and source impedance shape protection choices." },
          { title: "Network behavior", detail: "Assess the impact of distribution characteristics on installation design." },
          { title: "Design margins", detail: "Apply conservative assumptions where measured data is limited." },
        ],
      },
      {
        title: "Earthing system strategy",
        items: [
          { title: "System comparison", detail: "Compare TN-S, TN-C-S, and TT for performance and risk." },
          { title: "PEN-related risk", detail: "Identify implications of lost neutral/PEN conditions." },
          { title: "Electrode performance", detail: "Evaluate earth electrode effectiveness in TT systems." },
          { title: "Selection rationale", detail: "Choose earthing arrangements suited to building and supply context." },
        ],
      },
      {
        title: "Protective device discrimination",
        items: [
          { title: "Coordination principles", detail: "Select device types and ratings to maintain selectivity." },
          { title: "RCD and RCBO strategy", detail: "Apply residual protection to reduce nuisance trips and maintain safety." },
          { title: "Breaking capacity", detail: "Match device fault withstand and breaking capacity to site conditions." },
          { title: "Operational continuity", detail: "Balance protection robustness with availability requirements." },
        ],
      },
      {
        title: "Fault protection design",
        items: [
          { title: "ADS verification", detail: "Check disconnection times and loop values for compliance." },
          { title: "Additional protection deployment", detail: "Place 30 mA protection where regulations and risk require it." },
          { title: "Touch voltage control", detail: "Limit shock risk through protective conductors and bonding strategy." },
          { title: "Inspection follow-through", detail: "Confirm design assumptions during commissioning and sign-off." },
        ],
      },
      {
        title: "Distribution board architecture",
        items: [
          { title: "Board segmentation", detail: "Separate circuits for resilience, maintenance, and fault containment." },
          { title: "Main vs supplementary bonding", detail: "Apply bonding principles correctly to service and local zones." },
          { title: "Labelling and identification", detail: "Implement clear, auditable circuit and device labeling." },
          { title: "Future capacity planning", detail: "Allow for expansion without compromising safety or compliance." },
        ],
      },
    ],
  },
  {
    slug: "installation-methods",
    title: "Installation Methods",
    description: "Advanced routing, termination quality, and environmental engineering decisions.",
    sections: [
      {
        title: "Higher-demand cable selection",
        items: [
          { title: "Current-carrying derating", detail: "Apply grouping, temperature, and installation method correction factors." },
          { title: "Specialist cable choice", detail: "Select MICC, SWA, and LSZH based on risk profile." },
          { title: "Mechanical protection planning", detail: "Design against impact, abrasion, and service exposure." },
          { title: "Performance validation", detail: "Confirm selected cable supports both safety and operational targets." },
        ],
      },
      {
        title: "Containment design and loading",
        items: [
          { title: "Containment fill strategy", detail: "Avoid overcrowding and maintain heat dissipation margins." },
          { title: "Support interval engineering", detail: "Set fixing and support spacing to prevent sag and damage." },
          { title: "Segregation by function", detail: "Separate services to reduce interference and maintenance risk." },
          { title: "Industrial route planning", detail: "Design routes for access, safety, and lifecycle maintenance." },
        ],
      },
      {
        title: "Advanced routing and zones",
        items: [
          { title: "Risk-led route selection", detail: "Choose routes based on building use and foreseeable modifications." },
          { title: "Protection depth decisions", detail: "Use depth, containment, and RCD protection as coordinated controls." },
          { title: "Penetration management", detail: "Control openings and entries to preserve fire and ingress performance." },
          { title: "Future-proofing", detail: "Design cable routes for alteration and extension without major rework." },
        ],
      },
      {
        title: "Termination and connection integrity",
        items: [
          { title: "Termination workmanship", detail: "Achieve consistent termination quality with correct preparation methods." },
          { title: "Torque-critical joints", detail: "Use manufacturer torque values to avoid thermal failure." },
          { title: "Connection reliability checks", detail: "Inspect and verify joints for mechanical and electrical integrity." },
          { title: "Failure-mode awareness", detail: "Recognize common causes of loose or high-resistance joints." },
        ],
      },
      {
        title: "Environmental resilience",
        items: [
          { title: "Ingress and corrosion strategy", detail: "Select materials and IP ratings for aggressive environments." },
          { title: "Thermal environment response", detail: "Account for ambient temperature and heat sources in design." },
          { title: "External installation controls", detail: "Protect against UV, moisture, and mechanical weather exposure." },
          { title: "Lifecycle durability", detail: "Choose solutions that retain performance over long service periods." },
        ],
      },
    ],
  },
  {
    slug: "inspection-testing-commissioning",
    title: "Inspection, Testing & Commissioning",
    description: "Verification logic, advanced interpretation, and certification quality assurance.",
    sections: [
      {
        title: "Verification sequence control",
        items: [
          { title: "Structured test planning", detail: "Run tests in a defensible sequence from safe isolation to live confirmation." },
          { title: "Dead/live transition", detail: "Manage the switch from dead tests to live tests with control measures." },
          { title: "Result traceability", detail: "Record values so findings remain auditable and reproducible." },
          { title: "Defect prioritization", detail: "Classify and action findings before energization and handover." },
        ],
      },
      {
        title: "Advanced continuity and insulation interpretation",
        items: [
          { title: "Continuity diagnostics", detail: "Use continuity results to identify wiring and termination faults." },
          { title: "Insulation trend reading", detail: "Interpret marginal readings and investigate probable causes." },
          { title: "Polarity verification logic", detail: "Confirm switching and protective devices are in the correct conductors." },
          { title: "Pre-live confidence checks", detail: "Ensure test evidence supports safe transition to live testing." },
        ],
      },
      {
        title: "Loop and fault performance",
        items: [
          { title: "Loop impedance analysis", detail: "Interpret Zs values in context of circuit protection and disconnection." },
          { title: "Fault current implications", detail: "Relate measured/estimated fault current to device capability." },
          { title: "ADS compliance review", detail: "Validate fault-clearing behavior against required limits." },
          { title: "Measurement limitations", detail: "Recognize when site conditions affect test confidence." },
        ],
      },
      {
        title: "RCD performance verification",
        items: [
          { title: "Trip characteristic testing", detail: "Assess tripping behavior at required test multiples." },
          { title: "Coordination with circuit design", detail: "Confirm RCD selection aligns with circuit function and safety role." },
          { title: "Nuisance trip mitigation", detail: "Identify likely causes and improve selectivity strategy." },
          { title: "Result interpretation", detail: "Determine compliance and required corrective actions from test outcomes." },
        ],
      },
      {
        title: "Certification governance",
        items: [
          { title: "Certificate selection", detail: "Use EIC, EICR, or Minor Works documentation appropriately." },
          { title: "Evidence completeness", detail: "Ensure schedules, readings, and remarks are complete and consistent." },
          { title: "Handover quality", detail: "Deliver documentation that supports safe operation and maintenance." },
          { title: "Professional accountability", detail: "Maintain defensible records for future inspection and legal scrutiny." },
        ],
      },
    ],
  },
  {
    slug: "communication-within-building-services-engineering",
    title: "Communication",
    description: "Coordination, technical reporting, and project communication at supervisory level.",
    sections: [
      {
        title: "Project role interfaces",
        items: [
          { title: "Design-to-site communication", detail: "Translate design intent into clear site execution instructions." },
          { title: "Multi-discipline coordination", detail: "Align electrical work with mechanical and structural teams." },
          { title: "Responsibility boundaries", detail: "Escalate issues to the correct authority without delay." },
          { title: "Decision logging", detail: "Capture key decisions that affect compliance and delivery." },
        ],
      },
      {
        title: "Technical communication channels",
        items: [
          { title: "Formal instruction control", detail: "Use controlled documents for revisions and scope changes." },
          { title: "Risk communication", detail: "Communicate hazards and controls with clarity and traceability." },
          { title: "Digital collaboration records", detail: "Maintain accurate project communication trails in shared systems." },
          { title: "Issue escalation protocols", detail: "Raise blockers early with sufficient technical detail." },
        ],
      },
      {
        title: "Drawing and specification governance",
        items: [
          { title: "Revision discipline", detail: "Work strictly to current revisions and withdraw superseded documents." },
          { title: "Specification compliance reporting", detail: "Demonstrate installed work meets specification requirements." },
          { title: "Coordination markups", detail: "Use markups to resolve clashes and update execution plans." },
          { title: "Information quality checks", detail: "Verify completeness before release to site teams." },
        ],
      },
      {
        title: "Completion and handover communication",
        items: [
          { title: "Completion evidence packs", detail: "Provide organized records for client and compliance review." },
          { title: "Operational briefing quality", detail: "Deliver concise technical briefings for users and maintainers." },
          { title: "Maintenance handover standards", detail: "Ensure maintenance teams receive actionable, accurate data." },
          { title: "Post-handover support loops", detail: "Close out queries with documented responses and updates." },
        ],
      },
    ],
  },
];
