import type { TopicGuide } from "@/data/electricalTopicGuides";
import { validateGuideLevelBoundaries } from "@/data/electricalGuideValidation";

export const electricalTopicGuidesLevel3: TopicGuide[] = [
  {
    slug: "principles-electrical-science",
    title: "Principles of Electrical Science",
    description: "AC theory, RMS relationships, power behavior, losses, and higher-level problem solving.",
    levelTag: "L3",
    sections: [
      {
        title: "AC values and waveform relationships",
        items: [
          { title: "RMS and peak relationships", detail: "Convert between peak, peak-to-peak, and RMS values for AC waveforms." },
          { title: "Frequency and waveform behavior", detail: "Explain how frequency affects waveform timing and circuit response." },
          { title: "AC calculations", detail: "Select AC equations based on known and unknown quantities." },
          { title: "Result checking", detail: "Validate answers against expected magnitudes and units." },
        ],
      },
      {
        title: "Power in AC circuits",
        items: [
          { title: "Real, reactive, and apparent power", detail: "Relate kW, kVAr, and kVA in practical circuit scenarios." },
          { title: "Power factor impact", detail: "Explain how power factor affects current demand and efficiency." },
          { title: "Power triangle use", detail: "Use power relationships to solve installation and load problems." },
          { title: "Circuit implications", detail: "Link poor power factor to increased current and system stress." },
        ],
      },
      {
        title: "Resistance behavior and losses",
        items: [
          { title: "I^2R loss estimation", detail: "Estimate conductor losses under load and interpret heat effects." },
          { title: "Resistivity in design", detail: "Use resistivity and conductor geometry in design decisions." },
          { title: "Temperature effects", detail: "Apply resistance change with temperature for realistic calculations." },
          { title: "Performance trade-offs", detail: "Balance conductor size, performance, and installation constraints." },
        ],
      },
      {
        title: "Magnetism, induction, and transformers",
        items: [
          { title: "Induced EMF mechanisms", detail: "Differentiate static and dynamic induction in electrical equipment." },
          { title: "Transformer principles", detail: "Use turns ratio relationships for voltage and current analysis." },
          { title: "Load behavior", detail: "Interpret transformer operation under no-load and loaded conditions." },
          { title: "Efficiency influences", detail: "Assess how copper and core losses affect output performance." },
        ],
      },
      {
        title: "Semiconductor theory and application",
        items: [
          { title: "Diode operating regions", detail: "Distinguish forward, reverse, and breakdown behavior." },
          { title: "Rectification quality", detail: "Compare half-wave and full-wave output characteristics." },
          { title: "Switching devices", detail: "Apply transistor and thyristor behavior in control circuits." },
          { title: "Thermal and voltage limits", detail: "Respect component ratings during circuit design and fault analysis." },
        ],
      },
    ],
  },
  {
    slug: "electrical-technology",
    title: "Electrical Technology",
    description: "Regulation-led design, earthing strategy, fault analysis, and protective device coordination.",
    levelTag: "L3",
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
          { title: "Network behavior", detail: "Assess distribution characteristics and their impact on design." },
          { title: "Design margins", detail: "Apply conservative assumptions where measured data is limited." },
        ],
      },
      {
        title: "Earthing system strategy",
        items: [
          { title: "System comparison", detail: "Compare TN-S, TN-C-S, and TT for performance and risk." },
          { title: "PEN-related risk", detail: "Identify implications of lost neutral or PEN conditions." },
          { title: "Electrode performance", detail: "Evaluate earth electrode effectiveness in TT systems." },
          { title: "Selection rationale", detail: "Choose earthing arrangements suited to building and supply context." },
        ],
      },
      {
        title: "Protective device discrimination",
        items: [
          { title: "Coordination principles", detail: "Select device types and ratings to maintain selectivity." },
          { title: "RCD and RCBO strategy", detail: "Apply residual protection while reducing nuisance tripping." },
          { title: "Breaking capacity", detail: "Match device withstand and breaking capacity to site fault levels." },
          { title: "Operational continuity", detail: "Balance safety requirements with availability of supply." },
        ],
      },
      {
        title: "Fault protection design",
        items: [
          { title: "ADS verification", detail: "Check disconnection times and loop values for compliance." },
          { title: "Additional protection", detail: "Deploy 30 mA protection where regulation and risk require it." },
          { title: "Touch voltage control", detail: "Limit shock risk through protective conductors and bonding." },
          { title: "Commissioning checks", detail: "Verify design assumptions during testing and sign-off." },
        ],
      },
      {
        title: "Distribution board architecture",
        items: [
          { title: "Board segmentation", detail: "Separate circuits for resilience, maintenance, and fault containment." },
          { title: "Main vs supplementary bonding", detail: "Apply bonding strategy correctly for supply and location." },
          { title: "Labelling and identification", detail: "Implement clear, auditable circuit and device labelling." },
          { title: "Future capacity planning", detail: "Allow for expansion without reducing safety or compliance." },
        ],
      },
    ],
  },
  {
    slug: "installation-methods",
    title: "Installation Methods",
    description: "Advanced cable selection, derating, route engineering, and termination quality control.",
    levelTag: "L3",
    sections: [
      {
        title: "Higher-demand cable selection",
        items: [
          { title: "Current-carrying derating", detail: "Apply grouping, temperature, and installation method correction factors." },
          { title: "Voltage drop assessment", detail: "Assess voltage drop against design and compliance limits." },
          { title: "Specialist cable choice", detail: "Select MICC, SWA, and LSZH based on risk profile." },
          { title: "Mechanical protection planning", detail: "Design against impact, abrasion, and service exposure." },
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
          { title: "Protection depth decisions", detail: "Coordinate depth, containment, and RCD measures." },
          { title: "Penetration management", detail: "Control entries to preserve fire and ingress performance." },
          { title: "Future-proofing", detail: "Design routes for alterations and extensions with minimal rework." },
        ],
      },
      {
        title: "Termination and connection integrity",
        items: [
          { title: "Termination workmanship", detail: "Apply consistent preparation methods for repeatable quality." },
          { title: "Torque-critical joints", detail: "Use manufacturer torque settings to reduce thermal failure risk." },
          { title: "Connection reliability checks", detail: "Inspect and verify joints for electrical and mechanical integrity." },
          { title: "Failure-mode awareness", detail: "Diagnose high-resistance and loose-joint failure patterns." },
        ],
      },
      {
        title: "Environmental resilience",
        items: [
          { title: "Ingress and corrosion strategy", detail: "Select materials and IP ratings for aggressive environments." },
          { title: "Thermal environment response", detail: "Account for ambient temperature and heat sources in design." },
          { title: "External installation controls", detail: "Protect against UV, moisture, and weather exposure." },
          { title: "Lifecycle durability", detail: "Choose solutions that retain performance over long service periods." },
        ],
      },
    ],
  },
  {
    slug: "inspection-testing-commissioning",
    title: "Inspection, Testing & Commissioning",
    description: "Test sequencing, interpretation of results, and certification quality assurance.",
    levelTag: "L3",
    sections: [
      {
        title: "Verification sequence control",
        items: [
          { title: "Structured test planning", detail: "Run tests in a defensible sequence from isolation to live confirmation." },
          { title: "Dead/live transition", detail: "Control changeover from dead tests to live tests safely." },
          { title: "Result traceability", detail: "Record results so findings are auditable and repeatable." },
          { title: "Defect prioritization", detail: "Classify and resolve defects before energisation and handover." },
        ],
      },
      {
        title: "Advanced continuity and insulation interpretation",
        items: [
          { title: "Continuity diagnostics", detail: "Use continuity results to locate wiring and termination faults." },
          { title: "Insulation trend reading", detail: "Interpret borderline readings and investigate likely causes." },
          { title: "Polarity verification logic", detail: "Confirm switching and protection are in the correct conductors." },
          { title: "Pre-live confidence checks", detail: "Verify evidence supports safe progression to live tests." },
        ],
      },
      {
        title: "Loop and fault performance",
        items: [
          { title: "Loop impedance analysis", detail: "Interpret Zs values against protective device requirements." },
          { title: "Fault current implications", detail: "Relate measured or estimated fault current to device capability." },
          { title: "ADS compliance review", detail: "Validate fault-clearing behavior against required limits." },
          { title: "Measurement limitations", detail: "Recognise site factors that reduce test confidence." },
        ],
      },
      {
        title: "RCD performance verification",
        items: [
          { title: "Trip characteristic testing", detail: "Assess tripping behavior at required test multiples." },
          { title: "Coordination with circuit design", detail: "Confirm RCD choice supports circuit function and safety role." },
          { title: "Nuisance trip mitigation", detail: "Identify likely causes and improve selectivity strategy." },
          { title: "Result interpretation", detail: "Determine compliance and corrective actions from test outcomes." },
        ],
      },
      {
        title: "Certification governance",
        items: [
          { title: "Certificate selection", detail: "Use EIC, EICR, or Minor Works documents appropriately." },
          { title: "Evidence completeness", detail: "Check schedules, readings, and remarks for consistency." },
          { title: "Handover quality", detail: "Deliver documentation that supports safe operation and maintenance." },
          { title: "Professional accountability", detail: "Maintain defensible records for future audit and legal review." },
        ],
      },
    ],
  },
  {
    slug: "communication-within-building-services-engineering",
    title: "Communication",
    description: "Technical coordination, compliance reporting, and handover communication at Level 3 depth.",
    levelTag: "L3",
    sections: [
      {
        title: "Project role interfaces",
        items: [
          { title: "Design-to-site communication", detail: "Translate design intent into precise site instructions." },
          { title: "Multi-discipline coordination", detail: "Coordinate electrical works with other discipline teams." },
          { title: "Responsibility boundaries", detail: "Escalate technical issues to the correct authority quickly." },
          { title: "Decision logging", detail: "Record technical decisions that affect compliance and delivery." },
        ],
      },
      {
        title: "Technical communication channels",
        items: [
          { title: "Formal instruction control", detail: "Use controlled documents for revisions and scope changes." },
          { title: "Risk communication", detail: "Communicate hazards and controls with traceable records." },
          { title: "Digital collaboration records", detail: "Maintain complete communication trails in project systems." },
          { title: "Issue escalation protocols", detail: "Escalate blockers early with sufficient technical evidence." },
        ],
      },
      {
        title: "Drawing and specification governance",
        items: [
          { title: "Revision discipline", detail: "Work to current revisions and remove superseded documents." },
          { title: "Specification compliance reporting", detail: "Report installed work against specification requirements." },
          { title: "Coordination markups", detail: "Use markups to resolve clashes and update execution plans." },
          { title: "Information quality checks", detail: "Check completeness and clarity before release to site teams." },
        ],
      },
      {
        title: "Completion and handover communication",
        items: [
          { title: "Completion evidence packs", detail: "Compile records for client and compliance review." },
          { title: "Operational briefing quality", detail: "Deliver clear technical briefings for users and maintainers." },
          { title: "Maintenance handover standards", detail: "Provide maintenance teams with accurate actionable data." },
          { title: "Post-handover support loops", detail: "Close queries with documented responses and updates." },
        ],
      },
    ],
  },
];


validateGuideLevelBoundaries("L3", electricalTopicGuidesLevel3);
