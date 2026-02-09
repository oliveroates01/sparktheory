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
    description: "Legal duties, safe working practices, and risk control for electrical work.",
    sections: [
      {
        title: "Health and Safety at Work Act",
        items: [
          { title: "Purpose of the Act", detail: "Creates the legal framework for safe working standards." },
          { title: "Employer duties", detail: "Provide safe systems, training, supervision, and equipment." },
          { title: "Employee duties", detail: "Take reasonable care and cooperate with safety rules." },
          { title: "Penalties", detail: "Breaches can lead to prosecution, fines, or imprisonment." },
          { title: "Policy requirement", detail: "Employers must have and communicate a safety policy." },
        ],
      },
      {
        title: "HSE enforcement and notices",
        items: [
          { title: "HSE role", detail: "Enforces health and safety law through inspection and action." },
          { title: "Inspector powers", detail: "Can enter sites, investigate, and issue notices." },
          { title: "Improvement notice", detail: "Requires a problem to be fixed within a set time." },
          { title: "Prohibition notice", detail: "Stops work that risks serious injury." },
        ],
      },
      {
        title: "Electrical regulations",
        items: [
          { title: "EAWR 1989", detail: "Requires precautions to prevent danger from electricity." },
          { title: "Prefer dead working", detail: "Conductors should be made dead where possible." },
          { title: "Due diligence", detail: "Reasonable steps and care are the key legal defense." },
          { title: "ESQCR 2002", detail: "Covers safe public supply and earthing requirements." },
        ],
      },
      {
        title: "Safety signs and symbols",
        items: [
          { title: "Sign categories", detail: "Prohibition, warning, mandatory, and safe condition." },
          { title: "Colors and shapes", detail: "Red circles, yellow triangles, blue circles, green signs." },
          { title: "Running man symbol", detail: "Indicates escape routes and exits." },
          { title: "Warning signs", detail: "Highlight hazards such as electric shock." },
        ],
      },
      {
        title: "Safe working practices",
        items: [
          { title: "Risk assessment", detail: "Identify hazards, assess risk, and apply controls." },
          { title: "Method statements", detail: "Set out the safe sequence of work." },
          { title: "Safe isolation", detail: "Isolate, lock off, and prove dead before work." },
          { title: "Reporting", detail: "Report hazards, defects, and near misses promptly." },
        ],
      },
      {
        title: "PPE and equipment",
        items: [
          { title: "PPE selection", detail: "Match PPE to hazards such as eye, hand, and hearing." },
          { title: "Pre-use checks", detail: "Inspect tools and leads before use." },
          { title: "Portable equipment", detail: "Use appropriate inspection and testing routines." },
        ],
      },
      {
        title: "Fire, first aid, and emergencies",
        items: [
          { title: "Fire types", detail: "Choose the correct extinguisher for the fire class." },
          { title: "Evacuation", detail: "Know escape routes and assembly points." },
          { title: "First aid", detail: "Know how to summon help and where equipment is stored." },
        ],
      },
    ],
  },
  
  
  
  
  {
    slug: "principles-electrical-science",
    title: "Principles of Electrical Science",
    description: "Core electrical quantities, circuit theory, and AC/DC principles.",
    sections: [
      {
        title: "Units and quantities",
        items: [
          { title: "Current (A)", detail: "Measured in amperes; flow of electric charge." },
          { title: "Voltage (V)", detail: "Potential difference that drives current." },
          { title: "Resistance (ohms)", detail: "Opposition to current flow." },
          { title: "Power (W)", detail: "Rate of energy transfer." },
          { title: "Energy (Wh, kWh)", detail: "Power used over time." },
        ],
      },
      {
        title: "Ohm's law",
        items: [
          { title: "V = I x R", detail: "Relates voltage, current, and resistance." },
          { title: "Rearranging", detail: "Find I or R by transposing the formula." },
          { title: "Using the law", detail: "Predict current draw or required resistance." },
        ],
      },
      {
        title: "Series and parallel circuits",
        items: [
          { title: "Series circuits", detail: "Current is the same; voltages add." },
          { title: "Parallel circuits", detail: "Voltage is the same; currents add." },
          { title: "Total resistance", detail: "Series adds; parallel reduces total." },
        ],
      },
      {
        title: "Power and energy",
        items: [
          { title: "Power formulas", detail: "Use P = V x I and related forms." },
          { title: "Resistive heating", detail: "Current through resistance produces heat." },
          { title: "Energy use", detail: "Calculate kWh from power and time." },
        ],
      },
      {
        title: "AC and DC",
        items: [
          { title: "DC", detail: "Flows in one direction with constant polarity." },
          { title: "AC", detail: "Alternates direction; mains is sinusoidal." },
          { title: "Frequency", detail: "UK supply is 50 Hz." },
          { title: "RMS values", detail: "AC values are given as effective heating values." },
        ],
      },
      {
        title: "Magnetism and induction",
        items: [
          { title: "Magnetic fields", detail: "Exist around magnets and current-carrying conductors." },
          { title: "Electromagnets", detail: "Coils produce controllable magnetic fields." },
          { title: "Induction", detail: "Changing fields induce voltage in conductors." },
        ],
      },
      {
        title: "Instruments",
        items: [
          { title: "Multimeter use", detail: "Measure voltage, current, and resistance safely." },
          { title: "Continuity testing", detail: "Confirms a complete path with no power." },
          { title: "Polarity checks", detail: "Verify correct line and neutral connections." },
        ],
      },
    ],
  },
  
  
  
  
  {
    slug: "electrical-installation-technology",
    title: "Electrical Installation Technology",
    description: "Supply regulations, system characteristics, and legal responsibilities.",
    sections: [
      {
        title: "Statutory and non-statutory rules",
        items: [
          { title: "Statutory regulations", detail: "Laws made by Parliament; non-compliance is an offense." },
          { title: "Non-statutory guidance", detail: "Shows how to comply with legal requirements." },
          { title: "Codes of practice", detail: "Accepted methods that support safe working." },
        ],
      },
      {
        title: "HSE and enforcement",
        items: [
          { title: "HSE role", detail: "Enforces health and safety law on electrical work." },
          { title: "Inspector powers", detail: "Entry, investigation, and issuing notices." },
          { title: "Notices", detail: "Improvement for breaches; prohibition for dangerous work." },
        ],
      },
      {
        title: "Supply safety regulations",
        items: [
          { title: "ESQCR purpose", detail: "Ensures safe supply and sets earthing requirements." },
          { title: "Supply responsibility", detail: "Supply companies must maintain declared voltage." },
          { title: "Frequency", detail: "Supply frequency is controlled to maintain accuracy." },
        ],
      },
      {
        title: "Harmonized voltages",
        items: [
          { title: "Nominal voltages", detail: "UK low voltage harmonized to 230 V single phase." },
          { title: "Three-phase supply", detail: "Nominal line voltage is 400 V." },
          { title: "Tolerance", detail: "Supply is kept within the declared limits." },
        ],
      },
      {
        title: "Electricity at Work Regulations",
        items: [
          { title: "Preferred practice", detail: "Make conductors dead before work." },
          { title: "Precautions", detail: "Work must be planned to prevent danger." },
          { title: "Due diligence", detail: "Reasonable steps are the key legal defense." },
        ],
      },
      {
        title: "Duty holder responsibilities",
        items: [
          { title: "Duty holder role", detail: "Person in control must manage electrical safety." },
          { title: "Competence", detail: "Workers must be competent for the task." },
          { title: "Records", detail: "Document safety actions and compliance." },
        ],
      },
    ],
  },
  
  
  
  
  {
    slug: "installation-wiring-systems-enclosures",
    title: "Installation of Wiring Systems & Enclosures",
    description: "Routes, containment, and wiring regulation requirements.",
    sections: [
      {
        title: "Technical information sources",
        items: [
          { title: "Electronic sources", detail: "Easy to update and store large amounts of data." },
          { title: "Hard copy sources", detail: "Useful on site but can be harder to update." },
          { title: "Manufacturer data", detail: "Always follow product instructions and ratings." },
        ],
      },
      {
        title: "Regulations and codes",
        items: [
          { title: "Statutory examples", detail: "EAWR and ESQCR are statutory regulations." },
          { title: "Codes of practice", detail: "Provide accepted methods for safe work." },
          { title: "Guidance notes", detail: "Support compliance with wiring rules." },
        ],
      },
      {
        title: "BS 7671 structure",
        items: [
          { title: "Part 4", detail: "Protection against electric shock." },
          { title: "Part 4 (overcurrent)", detail: "Protection against overcurrent and fault current." },
          { title: "Part 4 (thermal)", detail: "Protection against thermal effects and fire." },
          { title: "Part 5", detail: "Selection and erection of equipment." },
          { title: "Part 6", detail: "Inspection and testing requirements." },
        ],
      },
      {
        title: "Wiring systems and containment",
        items: [
          { title: "Conduit and trunking", detail: "Provide mechanical protection and routing." },
          { title: "Cable support", detail: "Maintain correct spacing and support." },
          { title: "Safe zones", detail: "Keep concealed cables within prescribed zones." },
        ],
      },
      {
        title: "Termination and enclosures",
        items: [
          { title: "Secure terminations", detail: "Correct lugs and torque prevent overheating." },
          { title: "Ingress protection", detail: "Choose IP rating to suit the environment." },
          { title: "Identification", detail: "Label circuits and equipment clearly." },
        ],
      },
    ],
  },
  
  
  
  
  {
    slug: "communication-within-building-services-engineering",
    title: "Communication within Building Services Engineering",
    description: "Clear site communication, documentation, and coordination.",
    sections: [
      {
        title: "Communication types",
        items: [
          { title: "Verbal", detail: "Briefings and spoken instructions on site." },
          { title: "Written", detail: "Method statements, permits, and reports." },
          { title: "Non-verbal", detail: "Signs, signals, and body language." },
        ],
      },
      {
        title: "Effective instruction",
        items: [
          { title: "Clarify", detail: "Ask questions if instructions are unclear." },
          { title: "Active listening", detail: "Focus, confirm understanding, and respond accurately." },
          { title: "Check-back", detail: "Repeat instructions to reduce mistakes." },
        ],
      },
      {
        title: "Site reporting",
        items: [
          { title: "Report issues", detail: "Tell the site supervisor or responsible person first." },
          { title: "Toolbox talks", detail: "Short briefings to share daily hazards." },
          { title: "Handover", detail: "Share progress, risks, and outstanding tasks." },
        ],
      },
      {
        title: "Documentation",
        items: [
          { title: "Method statements", detail: "Explain safe steps and control measures." },
          { title: "Permits", detail: "Confirm isolations and approvals for high-risk work." },
          { title: "Records", detail: "Document work completed and test results." },
        ],
      },
      {
        title: "Coordination with others",
        items: [
          { title: "Interface planning", detail: "Agree boundaries between trades." },
          { title: "Sequencing", detail: "Avoid clashes by coordinating access." },
          { title: "Professional conduct", detail: "Keep areas tidy and respect shared spaces." },
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
        title: "Regulations",
        items: [
          {
            title: "What identifies a Statutory Regulation?",
            detail: "Statutory Regulations are secondary legislation with a Statutory Instrument number.",
          },
          {
            title: "The Health and Safety at Work etc. Act 1974 is:",
            detail: "The HSW Act is primary legislation covering workplace health and safety in Great Britain.",
          },
          {
            title: "Which duty is required by the HSW Act for employers?",
            detail: "Employers must provide free health and safety training under the HSW Act.",
          },
          {
            title: "Under the HSW Act, employees must:",
            detail: "Employees are required to take reasonable care and cooperate with safety arrangements.",
          },
          {
            title: "The Electricity at Work Regulations 1989 (EAWR) are made under:",
            detail: "EAWR are made under the HSW Act, so breaches are enforced via that Act.",
          },
          {
            title: "ESQCR 2002 mainly applies to:",
            detail: "ESQCR sets requirements for suppliers\u2019 lines and apparatus, including earthing.",
          },
          {
            title: "PUWER 1998 requires work equipment to be:",
            detail: "PUWER ensures equipment is suitable for the task and safe in its environment.",
          },
          {
            title: "COSHH regulations focus on:",
            detail: "COSHH requires control of hazardous substances, exposure and health surveillance.",
          },
          {
            title: "Which is NOT covered by COSHH?",
            detail: "COSHH excludes asbestos, lead and radioactive substances which are covered elsewhere.",
          },
          {
            title: "A key purpose of the IET On\u2011Site Guide is to:",
            detail: "The On\u2011Site Guide gives practical guidance for standard installations.",
          },
          {
            title: "A prohibition notice is used when:",
            detail: "Prohibition notices stop dangerous activity where serious injury risk exists.",
          },
          {
            title: "A breach of non\u2011statutory guidance often results in:",
            detail: "Non\u2011statutory breaches often become contractual or quality disputes and can affect legal outcomes.",
          },
          {
            title: "Which drawing type shows what has actually been installed?",
            detail: "As\u2011fitted drawings record what was actually installed on site.",
          },
          {
            title: "Which statement about technical specifications is true?",
            detail: "Manufacturers provide specifications based on engineering testing and development.",
          },
        ],
      },
      {
        title: "Guidance & Standards",
        items: [
          {
            title: "EAWR applies to:",
            detail: "EAWR applies to workplaces and covers systems beyond the usual BS 7671 scope.",
          },
          {
            title: "Which document gives guidance on EAWR interpretation?",
            detail: "The HSE memorandum of guidance HSR25 provides interpretation guidance for EAWR.",
          },
          {
            title: "Which BS 7671 part covers inspection and testing?",
            detail: "BS 7671 Part 6 is dedicated to inspection and testing.",
          },
          {
            title: "Which BS 7671 part covers selection and erection?",
            detail: "Part 5 is titled Selection and Erection.",
          },
          {
            title: "Which Guidance Note focuses on earthing and bonding?",
            detail: "GN8 covers earthing and bonding.",
          },
          {
            title: "GN3 is primarily about:",
            detail: "GN3 is the guidance note for inspection and testing.",
          },
          {
            title: "ACoPs are:",
            detail: "ACoPs are approved by the Secretary of State and have legal status.",
          },
        ],
      },
      {
        title: "Drawings & Technical Info",
        items: [
          {
            title: "Which is a source of technical information?",
            detail: "Technical specifications are a formal source of technical information.",
          },
          {
            title: "Why must symbols on drawings be explained?",
            detail: "A key or legend ensures symbols are correctly interpreted.",
          },
          {
            title: "A drawing scale of 1:50 means:",
            detail: "At 1:50, the real size is 50 times the drawing measurement.",
          },
          {
            title: "Technical drawings should use symbols that are:",
            detail: "BS symbols should be used and explained in a key or legend.",
          },
          {
            title: "Why might A3 reductions be used on site?",
            detail: "A3 copies are convenient but reductions can make drawings less readable.",
          },
        ],
      },
      {
        title: "Supply & Generation",
        items: [
          {
            title: "National Grid\u2019s role includes:",
            detail: "National Grid operates transmission and balances supply with demand.",
          },
          {
            title: "Electricity cannot be stored in significant amounts, so the system must:",
            detail: "Because large\u2011scale storage is limited, supply must match demand.",
          },
          {
            title: "Which is a listed electricity generation method?",
            detail: "Nuclear is listed among UK generation methods.",
          },
          {
            title: "Which statement about renewable energy is correct?",
            detail: "The text notes renewables are an ever\u2011growing share of UK electricity.",
          },
          {
            title: "Pumped\u2011storage hydro works by:",
            detail: "Off\u2011peak electricity pumps water up; it is released through turbines at peak times.",
          },
        ],
      },
      {
        title: "Transmission & HV",
        items: [
          {
            title: "Why are transmission voltages raised to 275 kV or 400 kV?",
            detail: "Higher voltage reduces current for a given power, reducing I\u00b2R losses.",
          },
          {
            title: "High\u2011voltage overhead transmission in the UK mainly uses:",
            detail: "UK transmission is predominantly overhead on pylons.",
          },
          {
            title: "At high voltage, electricity can:",
            detail: "Higher voltages increase arc length, so arcing through air can occur.",
          },
          {
            title: "Why are longer insulators used at higher voltages?",
            detail: "Higher voltages require greater insulation distance to avoid flashover.",
          },
        ],
      },
      {
        title: "Other Key Points",
        items: [
          {
            title: "CPD seminars are often used to:",
            detail: "CPD seminars update knowledge and professional competence.",
          },
          {
            title: "HSE inspectors can do which of the following?",
            detail: "HSE inspectors have the right to enter and inspect workplaces without notice.",
          },
          {
            title: "Which statement about paper sizes is correct?",
            detail: "Each step down halves the area: A0 is twice A1, A1 is twice A2, and so on.",
          },
          {
            title: "On a 1:50 drawing, a 40 mm line represents a real length of:",
            detail: "40 mm \u00d7 50 = 2000 mm = 2 m.",
          },
          {
            title: "Which paper size is larger?",
            detail: "In the A\u2011series, lower numbers indicate larger sizes.",
          },
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
        title: "Certification & Schedules",
        items: [
          {
            title: "On an Electrical Installation Certificate schedule of inspection, boxes should be marked:",
            detail: "The schedule uses ticks or N/A; unsatisfactory items must be corrected before certification.",
          },
          {
            title: "If an installation has a standby generator as an alternative supply, inspection should confirm:",
            detail: "A changeover switch should prevent the generator energising the public supply.",
          },
          {
            title: "For a PV system operating in parallel with the public supply, inspection checks should confirm:",
            detail: "Grid\u2011tie inverters must shut down if the public supply fails.",
          },
          {
            title: "For inspections, a changeover switch is important because it:",
            detail: "Changeover switches prevent unsafe back\u2011feeding of the supply network.",
          },
          {
            title: "In a schedule of inspection, the intake equipment section includes checks on:",
            detail: "Intake checks include isolator and meter tails for protection and condition.",
          },
        ],
      },
      {
        title: "Earthing & Bonding",
        items: [
          {
            title: "Which item checks the distributor\u2019s earthing arrangement?",
            detail: "The MET must be correctly connected to the supply earthing arrangement.",
          },
          {
            title: "For TT systems, inspection should confirm:",
            detail: "TT systems require an earth electrode connected to the MET.",
          },
          {
            title: "Main protective bonding conductors should be connected:",
            detail: "Bonding is normally within 600 mm of entry or meter and before branches.",
          },
          {
            title: "Protective bonding conductor sizes for TN\u2011S and TT are based on:",
            detail: "TN\u2011S/TT bonding uses half the earthing conductor with 6\u201325 mm\u00b2 limits.",
          },
          {
            title: "For TN\u2011C\u2011S (PME), bonding conductor size is determined by:",
            detail: "TN\u2011C\u2011S bonding uses the supply neutral size per Table 54.8.",
          },
          {
            title: "Main protective bonding conductors should be coloured:",
            detail: "Protective bonding conductors use green/yellow insulation.",
          },
          {
            title: "Metallic parts of the electrical installation itself are classed as:",
            detail: "Metallic parts of the installation are exposed conductive parts that require earthing.",
          },
          {
            title: "Main protective bonding for water services should be connected:",
            detail: "Bonding should be on the consumer\u2019s side, after the stopcock and before branches.",
          },
          {
            title: "A bonding clamp should be suitable for:",
            detail: "Clamps must suit the environmental conditions and be durable.",
          },
        ],
      },
      {
        title: "Protective Measures",
        items: [
          {
            title: "SELV systems require:",
            detail: "SELV requires separation from earth and a suitable separating source.",
          },
          {
            title: "PELV systems differ from SELV because:",
            detail: "PELV may be earthed, unlike SELV.",
          },
          {
            title: "Where disconnection times cannot be met and RCDs are not feasible, inspection may consider:",
            detail: "Local bonding can reduce touch\u2011voltage risk where ADS is not feasible.",
          },
          {
            title: "RCDs used for additional protection should typically be rated at:",
            detail: "Additional protection usually requires 30 mA RCDs.",
          },
          {
            title: "FELV refers to circuits where:",
            detail: "FELV is extra\u2011low voltage without SELV/PELV separation requirements.",
          },
          {
            title: "RLV circuits supplying 110 V AC must comply with:",
            detail: "RLV requirements include Section 418 and earth\u2011fault loop impedance limits.",
          },
          {
            title: "For ADS, RCDs are relied on for fault protection when:",
            detail: "Where Zs is too high to meet disconnection times, RCDs may be used for fault protection.",
          },
        ],
      },
      {
        title: "Installation Checks",
        items: [
          {
            title: "Basic protection can be provided by:",
            detail: "Basic protection includes insulation of live parts.",
          },
          {
            title: "Barriers/enclosures for basic protection should typically provide:",
            detail: "Accessible surfaces should achieve IP2X/IPXXB (and IP4X/IPXXD on top surfaces).",
          },
        ],
      },
      {
        title: "Labels & Accessibility",
        items: [
          {
            title: "Bonding clamps must comply with:",
            detail: "Bonding clamps for pipework should meet BS 951.",
          },
          {
            title: "BS 951 clamps are designed for:",
            detail: "BS 951 clamps are intended for circular pipes/rods.",
          },
          {
            title: "Colour coding for BS 951 clamps uses:",
            detail: "Red is for dry conditions; blue/green are for corrosive or humid environments.",
          },
          {
            title: "Bonding connection labels must state:",
            detail: "BS 7671 requires a permanent label stating \u2018safety electrical connection \u2013 do not remove\u2019.",
          },
          {
            title: "For bonding clamps, the connection point should be:",
            detail: "Bonding connections must remain accessible for inspection and testing.",
          },
          {
            title: "A bonding clamp must be labelled per BS 7671 at the:",
            detail: "Labels are required at the connection point to extraneous conductive parts.",
          },
          {
            title: "When identifying extraneous conductive parts, \u2018Earth potential\u2019 refers to:",
            detail: "Earth potential refers to the potential of the ground mass.",
          },
        ],
      },
    ],
  },
];
