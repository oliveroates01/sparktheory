export type Question = {
    id: string;
    legacyIds?: string[];
    question: string;
    options: [string, string, string, string];
    correctIndex: number;
    explanation: string;
  };
  
  export const healthSafetyQuestions: Question[] = [
    {
      id: "hs-001",
      question: "What is the main aim of the Health and Safety at Work Act 1974?",
      options: [
        "To define safety duties for employers and workers",
        "To control wages and working hours nationally",
        "To manage pollution on construction projects",
        "To licence all trades working on site",
      ],
      correctIndex: 0,
      explanation:
        "The Act sets legal duties for employers and employees to protect health and safety.",
    },
    {
      id: "hs-002",
      question:
        "Under the Health and Safety at Work Act 1974, which is a worker’s responsibility?",
      options: [
        "Take reasonable care for self and others",
        "Approve company safety spending decisions",
        "Change site rules when they disagree",
        "Remove guards to make work easier",
      ],
      correctIndex: 0,
      explanation:
        "Workers must take reasonable care and cooperate with safety arrangements.",
    },
    {
      id: "hs-003",
      question:
        "Under the Health and Safety at Work Act 1974, which is an employer’s responsibility?",
      options: [
        "Provide safe equipment and workplace",
        "Rely on workers supplying their own PPE",
        "Remove written procedures to save time",
        "Allow unsafe work if deadlines are tight",
      ],
      correctIndex: 0,
      explanation:
        "Employers must provide safe systems, equipment, and environments.",
    },
    {
      id: "hs-004",
      question:
        "What can happen if someone fails to comply with the Health and Safety at Work Act 1974?",
      options: [
        "They may be prosecuted and fined",
        "They may be moved to another site",
        "They may receive advice only",
        "They cannot face legal action",
      ],
      correctIndex: 0,
      explanation:
        "Failure to comply can lead to prosecution, fines or imprisonment.",
    },
    {
      id: "hs-005",
      question: "What is the main role of enforcing authorities such as the HSE?",
      options: [
        "Enforce safety law through inspections",
        "Provide tools and PPE to workers",
        "Manage daily site operations",
        "Set company pay and overtime rates",
      ],
      correctIndex: 0,
      explanation:
        "The HSE enforces health and safety law through inspections and investigations.",
    },
    {
      id: "hs-006",
      question:
        "Which of these is an example of a power used by enforcing authorities?",
      options: [
        "Enter sites to inspect and investigate",
        "Approve staff pay rises on request",
        "Choose which contractors get hired",
        "Control project deadlines and targets",
      ],
      correctIndex: 0,
      explanation:
        "Inspectors can enter premises and carry out investigations and measurements.",
    },
    {
      id: "hs-007",
      question: "Which statement best describes statutory regulations?",
      options: [
        "They are laws that must be followed",
        "They are optional safety suggestions",
        "They apply only to office workers",
        "They apply only if a company agrees",
      ],
      correctIndex: 0,
      explanation:
        "Statutory regulations are legal requirements and must be complied with.",
    },
    {
      id: "hs-008",
      question: "What is non-statutory guidance mainly used for?",
      options: [
        "To show ways to comply with the law",
        "To replace legal duties on site",
        "To allow workers to ignore rules",
        "To create new criminal offences",
      ],
      correctIndex: 0,
      explanation:
        "Guidance shows practical ways of meeting legal requirements.",
    },
    {
      id: "hs-009",
      question:
        "What is described as the ‘electrician’s bible’ for installation work?",
      options: [
        "The IET Wiring Regulations",
        "The Fire Safety Order",
        "A company toolbox talk sheet",
        "A manufacturer’s instruction leaflet",
      ],
      correctIndex: 0,
      explanation:
        "The IET Wiring Regulations provide the framework for electrical installations.",
    },
    {
      id: "hs-010",
      question:
        "What is the purpose of the Electricity at Work Regulations 1989 (EWR)?",
      options: [
        "Prevent injury or death from electricity",
        "Control the price of electrical power",
        "Manage building planning permissions",
        "Certify plumbers for electrical work",
      ],
      correctIndex: 0,
      explanation:
        "The EWR require precautions to prevent danger from electricity at work.",
    },
    {
      id: "hs-011",
      question:
        "According to the EWR, what is preferred before electrical work begins?",
      options: [
        "Make systems dead and isolated",
        "Work live to save time",
        "Remove warning labels first",
        "Increase voltage for testing",
      ],
      correctIndex: 0,
      explanation:
        "It is preferable that conductors are made dead before work starts.",
    },
    {
      id: "hs-012",
      question:
        "If prosecuted for breaking the EWR, what is the only acceptable defence?",
      options: [
        "Show reasonable steps were taken",
        "Say the job was urgent to finish",
        "Blame another worker on site",
        "Claim the rules do not apply",
      ],
      correctIndex: 0,
      explanation:
        "The defence is proving reasonable steps and due diligence were taken.",
    },
    {
      id: "hs-013",
      question: "Who is described as a ‘duty holder’ in electrical safety?",
      options: [
        "The person in control of the system",
        "The person delivering materials to site",
        "The person approving timesheets weekly",
        "The person ordering tools and equipment",
      ],
      correctIndex: 0,
      explanation:
        "A duty holder is the person who controls electrical systems and equipment.",
    },
    {
      id: "hs-014",
      question: "Which statement best describes ‘duty of care’ at work?",
      options: [
        "Protect others affected by your work",
        "Finish work as quickly as possible",
        "Ignore hazards outside your trade",
        "Work without PPE to show confidence",
      ],
      correctIndex: 0,
      explanation:
        "Duty of care means protecting the health and safety of others.",
    },
    {
      id: "hs-015",
      question:
        "What is the difference between ‘absolute’ and ‘reasonably practicable’ duties?",
      options: [
        "One must always be met; one balances risk",
        "One applies to offices; one to sites",
        "One is optional; one is guidance only",
        "One depends on pay; one on experience",
      ],
      correctIndex: 0,
      explanation:
        "Absolute duties must be met; reasonably practicable considers risk, time and cost.",
    },
    {
      id: "hs-016",
      question:
        "What do the Management of Health and Safety at Work Regulations 1999 require employers to do?",
      options: [
        "Carry out risk assessments and plan safety",
        "Provide PPE only with no assessments",
        "Ignore hazards until accidents occur",
        "Train managers only, not workers",
      ],
      correctIndex: 0,
      explanation:
        "Employers must carry out risk assessments and implement safety arrangements.",
    },
    {
      id: "hs-017",
      question:
        "Which of these is an example of a risk needing formal assessment on site?",
      options: [
        "Working at height",
        "Choosing a logo colour",
        "Picking a uniform style",
        "Deciding lunch break times",
      ],
      correctIndex: 0,
      explanation:
        "Working at height is a common risk that must be assessed.",
    },
    {
      id: "hs-018",
      question: "What is the main purpose of COSHH regulations?",
      options: [
        "Control exposure to harmful substances",
        "Control working hours on site",
        "Regulate site parking arrangements",
        "Set electricity supply tolerances",
      ],
      correctIndex: 0,
      explanation:
        "COSHH controls exposure to hazardous substances to reduce health risks.",
    },
    {
      id: "hs-019",
      question: "Which is an example of a hazardous substance category mentioned?",
      options: [
        "Dust and fumes affecting breathing",
        "Clean bottled drinking water",
        "Fresh air ventilation systems",
        "A safety notice board",
      ],
      correctIndex: 0,
      explanation:
        "Dust and fumes can cause respiratory problems and are classed as hazardous.",
    },
    {
      id: "hs-020",
      question: "What does PUWER focus on?",
      options: [
        "Safe use of work equipment",
        "Pricing of equipment hire",
        "Design of company branding",
        "Awarding trade qualifications",
      ],
      correctIndex: 0,
      explanation:
        "PUWER sets minimum standards for the safe use of work equipment.",
    },
    {
      id: "hs-021",
      question: "Why are construction sites often considered high risk?",
      options: [
        "Many hazards change as work progresses",
        "Offices are usually more dangerous",
        "PPE is not normally required",
        "Construction rarely involves tools",
      ],
      correctIndex: 0,
      explanation:
        "Construction sites have changing environments and multiple hazards.",
    },
    {
      id: "hs-022",
      question: "What is the main purpose of the PPE at Work Regulations?",
      options: [
        "Protect workers when other controls fail",
        "Replace training and supervision",
        "Allow unsafe equipment to be used",
        "Remove the need for risk assessments",
      ],
      correctIndex: 0,
      explanation:
        "PPE is used when risks cannot be fully controlled by other means.",
    },
    {
      id: "hs-023",
      question: "Which of the following is a correct example of PPE?",
      options: [
        "Safety helmet and eye protection",
        "Mobile phone and headphones",
        "Bright coloured stationery",
        "Personal coffee cup",
      ],
      correctIndex: 0,
      explanation:
        "PPE includes items such as helmets, goggles, gloves and boots.",
    },
    {
      id: "hs-024",
      question: "What are typical methods of protecting against falling objects?",
      options: [
        "Safety helmets and harness systems",
        "Lightweight trainers and hoodies",
        "Removing warning signs on site",
        "Assuming falling objects are unlikely",
      ],
      correctIndex: 0,
      explanation:
        "Helmets and harnesses are common methods of protection.",
    },
    {
      id: "hs-025",
      question: "Which statement best describes prohibition signs?",
      options: [
        "Red circle with line through symbol",
        "Yellow triangle warning of danger",
        "Blue circle showing required action",
        "Green sign showing safe conditions",
      ],
      correctIndex: 0,
      explanation:
        "Prohibition signs are red circles with a diagonal line.",
    },
    {
      id: "hs-026",
      question: "Which statement best describes warning signs?",
      options: [
        "Yellow triangle warning of hazard",
        "Green rectangle for first aid",
        "Blue circle for mandatory action",
        "Red circle showing prohibition",
      ],
      correctIndex: 0,
      explanation:
        "Warning signs are triangular and yellow with black borders.",
    },
    {
      id: "hs-027",
      question: "Which statement best describes mandatory signs?",
      options: [
        "Blue circle showing required action",
        "Yellow triangle warning of hazard",
        "Green rectangle showing safe route",
        "Red circle showing forbidden action",
      ],
      correctIndex: 0,
      explanation:
        "Mandatory signs are blue circles that show actions that must be followed.",
    },
    {
      id: "hs-028",
      question: "Which statement best describes safe condition signs?",
      options: [
        "Green signs showing safety information",
        "Red signs showing prohibited actions",
        "Yellow signs warning of hazards",
        "Blue signs showing mandatory actions",
      ],
      correctIndex: 0,
      explanation:
        "Safe condition signs are green and provide safety guidance.",
    },
    {
      id: "hs-029",
      question: "What is an accident at work?",
      options: [
        "An unplanned event causing harm or damage",
        "A planned maintenance activity",
        "A routine toolbox talk session",
        "A completed risk assessment form",
      ],
      correctIndex: 0,
      explanation:
        "An accident is an unplanned event causing injury or damage.",
    },
    {
      id: "hs-030",
      question: "What does the fire triangle show is needed for fire to burn?",
      options: [
        "Fuel, oxygen and heat",
        "Water, foam and carbon dioxide",
        "Electricity, metal and plastic",
        "Noise, dust and vibration",
      ],
      correctIndex: 0,
      explanation: "Fire needs fuel, oxygen and heat to exist.",
    },
  
    // ✅ Next batch starts here (still inside the same array)
    {
      id: "hs-031",
      question:
        "After 30 June 2000, what must workplaces with 5+ employees display?",
      options: [
        "The official HSE health and safety law poster",
        "A company advert showing site rules",
        "A weekly rota of staff holidays",
        "A toolbox talk schedule for the month",
      ],
      correctIndex: 0,
      explanation:
        "Workplaces employing five or more people had to display the HSE-style health and safety law poster.",
    },
    {
      id: "hs-032",
      question: "Why should an employer consult safety representatives?",
      options: [
        "To improve health and safety measures",
        "To reduce wages and overtime costs",
        "To avoid providing PPE on site",
        "To replace risk assessments completely",
      ],
      correctIndex: 0,
      explanation:
        "Employers should consult safety reps to promote and improve health and safety arrangements.",
    },
    {
      id: "hs-033",
      question: "In many companies with more than 20 employees, safety is managed by a:",
      options: [
        "Safety committee with reps and an officer",
        "Marketing team with site supervisors",
        "Payroll group with line managers",
        "Customer service team with HR staff",
      ],
      correctIndex: 0,
      explanation:
        "Where over 20 people are employed, it’s commonly done through a safety committee.",
    },
    {
      id: "hs-034",
      question: "What should an employee do first after spotting a dangerous situation?",
      options: [
        "Report it to the site safety representative",
        "Post it on social media immediately",
        "Keep quiet to avoid delays",
        "Fix it alone without telling anyone",
      ],
      correctIndex: 0,
      explanation:
        "The first step is to report the hazard to the site safety representative.",
    },
    {
      id: "hs-035",
      question: "Why should safety committee actions be documented?",
      options: [
        "To show safety actions were taken",
        "To advertise the company publicly",
        "To avoid reporting accidents legally",
        "To replace method statements on site",
      ],
      correctIndex: 0,
      explanation:
        "Records show the business takes health and safety seriously and acted on issues.",
    },
    {
      id: "hs-036",
      question:
        "What is the purpose of the Electricity Safety, Quality and Continuity Regulations 2002?",
      options: [
        "Ensure a safe supply up to consumer terminals",
        "Set rules for internal company wiring only",
        "Control energy prices for households",
        "Certify electricians for domestic work",
      ],
      correctIndex: 0,
      explanation:
        "These regulations are designed to ensure a proper and safe electricity supply to consumers.",
    },
    {
      id: "hs-037",
      question: "Which supply voltages were harmonised in the UK from 1 January 1995?",
      options: [
        "400 V three-phase and 230 V single-phase",
        "240 V three-phase and 415 V single-phase",
        "110 V single-phase and 220 V three-phase",
        "50 V single-phase and 100 V three-phase",
      ],
      correctIndex: 0,
      explanation:
        "The UK harmonised to 230 V single-phase and 400 V three-phase supplies.",
    },
    {
      id: "hs-038",
      question: "What is the permitted voltage range for a nominal 230 V supply?",
      options: [
        "216 V to 253 V",
        "200 V to 260 V",
        "220 V to 240 V",
        "210 V to 270 V",
      ],
      correctIndex: 0,
      explanation:
        "With +10% / -6% tolerance, a 230 V supply range is 216–253 V.",
    },
    {
      id: "hs-039",
      question: "What is the permitted voltage range for a nominal 400 V supply?",
      options: [
        "376 V to 440 V",
        "360 V to 460 V",
        "390 V to 410 V",
        "350 V to 450 V",
      ],
      correctIndex: 0,
      explanation:
        "With +10% / -6% tolerance, a 400 V supply range is 376–440 V.",
    },
    {
      id: "hs-040",
      question: "Why is the supply frequency controlled over 24 hours?",
      options: [
        "To keep electric clocks accurate",
        "To prevent lamps from overheating",
        "To increase power at peak times",
        "To stop circuits from tripping often",
      ],
      correctIndex: 0,
      explanation:
        "The frequency is maintained at an average 50 Hz so electric clocks keep time.",
    },
    {
      id: "hs-041",
      question: "Under the supply regulations, what can a distributor refuse to do?",
      options: [
        "Refuse to connect an unsafe installation",
        "Refuse to provide emergency lighting",
        "Refuse to allow PPE on construction",
        "Refuse to issue toolbox talk notes",
      ],
      correctIndex: 0,
      explanation:
        "Regulation 29 allows refusal to connect an installation not built to a suitable standard.",
    },
    {
      id: "hs-042",
      question: "When would refusal to connect a supply most likely happen?",
      options: [
        "If the installation fails IET standards",
        "If the site has a late delivery",
        "If the client requests extra sockets",
        "If the work is carried out at night",
      ],
      correctIndex: 0,
      explanation:
        "It would be enforced if the installation didn’t meet IET Wiring Regulations standards.",
    },
    {
      id: "hs-043",
      question: "What does the EWR say about electrical systems and maintenance?",
      options: [
        "Systems must prevent danger and be maintained",
        "Systems must be cheaper than alternatives",
        "Systems must be installed only after lunch",
        "Systems must use plastic enclosures always",
      ],
      correctIndex: 0,
      explanation:
        "The EWR requires systems to be constructed to prevent danger and be properly maintained.",
    },
    {
      id: "hs-044",
      question: "What does the EWR say about carrying out work activities?",
      options: [
        "Work must not create danger",
        "Work must always be finished quickly",
        "Work must avoid written procedures",
        "Work must ignore manufacturer guidance",
      ],
      correctIndex: 0,
      explanation:
        "The EWR requires work activities to be carried out in a way that does not give rise to danger.",
    },
    {
      id: "hs-045",
      question: "In electrical work, what is preferred before starting work?",
      options: [
        "Make conductors dead before work starts",
        "Increase load to test the circuit",
        "Remove labels to reduce confusion",
        "Use wet hands to improve grip",
      ],
      correctIndex: 0,
      explanation:
        "The EWR states it is preferable that conductors are made dead before work begins.",
    },
    {
      id: "hs-046",
      question: "In an EWR prosecution, what is the key defence?",
      options: [
        "Prove reasonable steps and due diligence",
        "Say you were told to hurry up",
        "Say the task looked low risk",
        "Say the client accepted the risk",
      ],
      correctIndex: 0,
      explanation:
        "The accepted defence is proving all reasonable steps were taken and diligence exercised.",
    },
    {
      id: "hs-047",
      question: "Who is most likely to be classed as a duty holder on site?",
      options: [
        "A person controlling systems and conductors",
        "A person delivering parts to stores",
        "A person cleaning the canteen area",
        "A person printing site induction cards",
      ],
      correctIndex: 0,
      explanation:
        "A duty holder is the person exercising control over systems, equipment and conductors on site.",
    },
    {
      id: "hs-048",
      question: "What is meant by an 'absolute' duty in regulations?",
      options: [
        "It must be met regardless of cost",
        "It applies only to office work",
        "It can be ignored if busy",
        "It is only suggested practice",
      ],
      correctIndex: 0,
      explanation:
        "Absolute duties must be met with no balancing of cost, time or difficulty.",
    },
    {
      id: "hs-049",
      question: "What is meant by 'reasonably practicable' in safety duties?",
      options: [
        "Balance risk against time, cost and effort",
        "Do the cheapest option every time",
        "Follow only what the client requests",
        "Avoid using written procedures always",
      ],
      correctIndex: 0,
      explanation:
        "Reasonably practicable means weighing risk against time, trouble, cost and difficulty.",
    },
    {
      id: "hs-050",
      question: "Why should electricians be 'legally aware' about safety and workmanship?",
      options: [
        "Poor work can lead to serious prosecution",
        "It makes the job quicker to complete",
        "It reduces the need for inspections",
        "It removes the need for risk assessments",
      ],
      correctIndex: 0,
      explanation:
        "The text highlights that negligence or poor workmanship can lead to prosecution and possible imprisonment.",
    },  {
        id: "hs-051",
        question: "What is the purpose of a risk assessment?",
        options: [
          "Identify hazards and reduce risks",
          "Decide who gets overtime pay",
          "Replace the need for supervision",
          "Show customers company branding",
        ],
        correctIndex: 0,
        explanation:
          "Risk assessments identify hazards and help control risks before work starts.",
      },
      {
        id: "hs-052",
        question: "Who is responsible for carrying out risk assessments on site?",
        options: [
          "The employer or responsible person",
          "Only the newest apprentice",
          "Only visiting inspectors",
          "Only the site cleaner",
        ],
        correctIndex: 0,
        explanation:
          "Employers or those in control of work activities are responsible for assessments.",
      },
      {
        id: "hs-053",
        question: "What should you do if you are unsure how to complete a task safely?",
        options: [
          "Ask for instruction or supervision",
          "Guess and hope for the best",
          "Ignore the task and walk away",
          "Rush the job to finish quickly",
        ],
        correctIndex: 0,
        explanation:
          "You should always seek guidance if unsure about safety or procedures.",
      },
      {
        id: "hs-054",
        question: "Why are toolbox talks used on site?",
        options: [
          "To remind workers of safety issues",
          "To replace all formal training",
          "To discuss company profits only",
          "To plan holiday schedules",
        ],
        correctIndex: 0,
        explanation:
          "Toolbox talks reinforce safety awareness and good working practices.",
      },
      {
        id: "hs-055",
        question: "What is a near miss?",
        options: [
          "An incident that could have caused harm",
          "A planned safety inspection",
          "A completed accident report",
          "A successful job completion",
        ],
        correctIndex: 0,
        explanation:
          "A near miss is an unplanned event that did not cause injury but could have.",
      },
      {
        id: "hs-056",
        question: "Why should near misses be reported?",
        options: [
          "To prevent future accidents",
          "To blame someone immediately",
          "To reduce company paperwork",
          "To avoid further training",
        ],
        correctIndex: 0,
        explanation:
          "Reporting near misses helps identify risks before serious accidents occur.",
      },
      {
        id: "hs-057",
        question: "What is the safest way to lift heavy objects?",
        options: [
          "Bend knees and keep back straight",
          "Twist while lifting quickly",
          "Lift with arms only",
          "Pull with one hand",
        ],
        correctIndex: 0,
        explanation:
          "Correct lifting technique reduces strain and risk of injury.",
      },
      {
        id: "hs-058",
        question: "What should you do before using a ladder?",
        options: [
          "Check it is secure and undamaged",
          "Assume it is safe to use",
          "Place it on loose materials",
          "Lean it against glass surfaces",
        ],
        correctIndex: 0,
        explanation:
          "Ladders must always be checked for stability and condition before use.",
      },
      {
        id: "hs-059",
        question: "When should damaged equipment be used?",
        options: [
          "Never, it should be reported",
          "When the job is urgent",
          "If only used for short tasks",
          "If no manager is nearby",
        ],
        correctIndex: 0,
        explanation:
          "Damaged equipment must not be used and should be reported immediately.",
      },
      {
        id: "hs-060",
        question: "What is the purpose of lock-off devices?",
        options: [
          "Prevent circuits being switched on",
          "Make tools easier to carry",
          "Increase voltage during testing",
          "Allow faster working methods",
        ],
        correctIndex: 0,
        explanation:
          "Lock-off devices stop accidental re-energising during electrical work.",
      },
      {
        id: "hs-061",
        question: "Why should test instruments be checked before use?",
        options: [
          "To confirm they are working correctly",
          "To make the test quicker",
          "To reduce the need for isolation",
          "To avoid using PPE",
        ],
        correctIndex: 0,
        explanation:
          "You must confirm test instruments function correctly before relying on results.",
      },
      {
        id: "hs-062",
        question: "What is the main aim of safe isolation?",
        options: [
          "Ensure circuits are dead before work",
          "Speed up installation times",
          "Reduce paperwork on site",
          "Allow tools to run cooler",
        ],
        correctIndex: 0,
        explanation:
          "Safe isolation ensures no electrical energy is present before work begins.",
      },
      {
        id: "hs-063",
        question: "What should you do if a fire alarm sounds on site?",
        options: [
          "Leave immediately using the escape route",
          "Finish the job before leaving",
          "Ignore it if unsure",
          "Wait for friends before exiting",
        ],
        correctIndex: 0,
        explanation:
          "You must evacuate immediately using designated escape routes.",
      },
      {
        id: "hs-064",
        question: "What is the main purpose of emergency exits?",
        options: [
          "Allow quick and safe evacuation",
          "Provide staff smoking areas",
          "Store spare equipment",
          "Control access to site",
        ],
        correctIndex: 0,
        explanation:
          "Emergency exits allow people to leave the building quickly and safely.",
      },
      {
        id: "hs-065",
        question: "What should you do if you discover a fire?",
        options: [
          "Raise the alarm immediately",
          "Finish your current task",
          "Try to hide the fire",
          "Wait for someone else to act",
        ],
        correctIndex: 0,
        explanation:
          "Raising the alarm quickly helps protect everyone on site.",
      },
      {
        id: "hs-066",
        question: "What does RIDDOR relate to?",
        options: [
          "Reporting serious workplace incidents",
          "Rules for electrical colour codes",
          "Guidance for tool maintenance",
          "Regulations for uniform standards",
        ],
        correctIndex: 0,
        explanation:
          "RIDDOR requires certain injuries, diseases and incidents to be reported.",
      },
      {
        id: "hs-067",
        question: "Which of these would normally be reportable under RIDDOR?",
        options: [
          "A major injury requiring hospital treatment",
          "A minor paper cut",
          "A late arrival to work",
          "A broken mobile phone",
        ],
        correctIndex: 0,
        explanation:
          "Serious injuries must be reported under RIDDOR regulations.",
      },
      {
        id: "hs-068",
        question: "Why must walkways be kept clear on site?",
        options: [
          "To prevent trips and allow safe access",
          "To improve site appearance only",
          "To reduce cleaning time",
          "To avoid using warning signs",
        ],
        correctIndex: 0,
        explanation:
          "Clear walkways reduce the risk of slips, trips and blocked exits.",
      },
      {
        id: "hs-069",
        question: "What is the safest action if you feel unwell at work?",
        options: [
          "Inform a supervisor immediately",
          "Ignore it and continue working",
          "Leave site without telling anyone",
          "Take someone else’s medication",
        ],
        correctIndex: 0,
        explanation:
          "You should report feeling unwell so action can be taken to protect safety.",
      },
      {
        id: "hs-070",
        question: "Why should visitors to site receive a safety induction?",
        options: [
          "So they understand site hazards and rules",
          "So they can start work immediately",
          "So they can inspect other workers",
          "So they avoid signing paperwork",
        ],
        correctIndex: 0,
        explanation:
          "Inductions ensure visitors understand risks and how to stay safe on site.",
      },  {
        id: "hs-071",
        legacyIds: ["hs-051"],
        question: "What is the main purpose of a risk assessment?",
        options: [
          "Identify hazards and reduce risks",
          "Decide who gets overtime pay",
          "Replace the need for supervision",
          "Show customers company branding",
        ],
        correctIndex: 0,
        explanation:
          "Risk assessments identify hazards and help control risks before work starts.",
      },
      {
        id: "hs-072",
        legacyIds: ["hs-052"],
        question: "Who is responsible for carrying out risk assessments on site?",
        options: [
          "The employer or responsible person",
          "Only the newest apprentice",
          "Only visiting inspectors",
          "Only the site receptionist",
        ],
        correctIndex: 0,
        explanation:
          "Employers or those in control of work activities must ensure risk assessments are carried out.",
      },
      {
        id: "hs-073",
        legacyIds: ["hs-053"],
        question: "Why must risk assessments be reviewed regularly?",
        options: [
          "Because site conditions can change",
          "Because law requires daily paperwork",
          "Because clients request new logos",
          "Because tools lose colour over time",
        ],
        correctIndex: 0,
        explanation:
          "Assessments must be reviewed when work changes or new hazards appear.",
      },
      {
        id: "hs-074",
        legacyIds: ["hs-054"],
        question: "What is a hazard?",
        options: [
          "Something with potential to cause harm",
          "Something that always causes injury",
          "A completed safety document",
          "A type of warning sign only",
        ],
        correctIndex: 0,
        explanation:
          "A hazard is anything that could cause harm.",
      },
      {
        id: "hs-075",
        legacyIds: ["hs-055"],
        question: "What is risk?",
        options: [
          "The chance of harm occurring",
          "The size of a toolbox",
          "The number of workers on site",
          "The colour of safety signs",
        ],
        correctIndex: 0,
        explanation:
          "Risk is the likelihood that a hazard will cause harm.",
      },
      {
        id: "hs-076",
        legacyIds: ["hs-056"],
        question: "Which activity is most likely to require a permit to work?",
        options: [
          "Working in confined spaces",
          "Completing paperwork in the office",
          "Attending a toolbox talk",
          "Cleaning hand tools after work",
        ],
        correctIndex: 0,
        explanation:
          "High-risk activities like confined space work often require permits.",
      },
      {
        id: "hs-077",
        legacyIds: ["hs-057"],
        question: "What is the purpose of a permit to work system?",
        options: [
          "Control high-risk work safely",
          "Replace the need for supervision",
          "Speed up job completion",
          "Reduce the need for PPE",
        ],
        correctIndex: 0,
        explanation:
          "Permits help ensure dangerous work is controlled and properly managed.",
      },
      {
        id: "hs-078",
        legacyIds: ["hs-058"],
        question: "Which document explains how a task will be carried out safely?",
        options: [
          "Method statement",
          "Payslip",
          "Delivery note",
          "Tool catalogue",
        ],
        correctIndex: 0,
        explanation:
          "A method statement describes safe working procedures for a task.",
      },
      {
        id: "hs-079",
        legacyIds: ["hs-059"],
        question: "Why should workers follow method statements?",
        options: [
          "To work safely and reduce risk",
          "To increase speed regardless of safety",
          "To avoid using PPE",
          "To ignore manufacturer guidance",
        ],
        correctIndex: 0,
        explanation:
          "They provide instructions to complete work safely.",
      },
      {
        id: "hs-080",
        legacyIds: ["hs-060"],
        question: "What does RAMS stand for?",
        options: [
          "Risk Assessment and Method Statement",
          "Register of Approved Management Systems",
          "Routine Appliance Maintenance Schedule",
          "Record of Annual Machinery Servicing",
        ],
        correctIndex: 0,
        explanation:
          "RAMS means Risk Assessment and Method Statement.",
      },
      {
        id: "hs-081",
        legacyIds: ["hs-061"],
        question: "What is the purpose of a toolbox talk?",
        options: [
          "Share safety information with workers",
          "Decide company holidays",
          "Train customers on products",
          "Promote company branding",
        ],
        correctIndex: 0,
        explanation:
          "Toolbox talks are used to communicate safety information on site.",
      },
      {
        id: "hs-082",
        legacyIds: ["hs-062"],
        question: "Why is good housekeeping important on site?",
        options: [
          "It reduces slips, trips and falls",
          "It improves mobile phone signal",
          "It increases working hours",
          "It removes the need for PPE",
        ],
        correctIndex: 0,
        explanation:
          "Poor housekeeping is a major cause of accidents.",
      },
      {
        id: "hs-083",
        legacyIds: ["hs-063"],
        question: "Which of these is a common cause of slips and trips?",
        options: [
          "Trailing cables and loose materials",
          "Wearing a high-visibility vest",
          "Using approved access equipment",
          "Reading safety signs carefully",
        ],
        correctIndex: 0,
        explanation:
          "Loose materials and cables create trip hazards.",
      },
      {
        id: "hs-084",
        legacyIds: ["hs-064"],
        question: "What is the safest way to access work at height?",
        options: [
          "Use suitable access equipment",
          "Stand on loose materials",
          "Climb on stacked boxes",
          "Use a chair instead of steps",
        ],
        correctIndex: 0,
        explanation:
          "Proper access equipment such as platforms or towers should be used.",
      },
      {
        id: "hs-085",
        legacyIds: ["hs-065"],
        question: "Which item is commonly used for fall protection?",
        options: [
          "Safety harness",
          "Dust mask",
          "Ear defenders",
          "High-visibility vest",
        ],
        correctIndex: 0,
        explanation:
          "Harnesses help protect workers when working at height.",
      },
      {
        id: "hs-086",
        legacyIds: ["hs-066"],
        question: "What should you do before using access equipment?",
        options: [
          "Check it is safe and undamaged",
          "Assume it is safe by default",
          "Modify it to suit your task",
          "Use it even if parts are missing",
        ],
        correctIndex: 0,
        explanation:
          "Equipment must be checked before use to ensure it is safe.",
      },
      {
        id: "hs-087",
        legacyIds: ["hs-067"],
        question: "Why should defective tools be reported immediately?",
        options: [
          "They can cause injury if used",
          "They reduce work speed only",
          "They affect company reputation",
          "They increase paperwork",
        ],
        correctIndex: 0,
        explanation:
          "Damaged tools can cause accidents and must not be used.",
      },
      {
        id: "hs-088",
        legacyIds: ["hs-068"],
        question: "What should you do if you are unsure how to do a task safely?",
        options: [
          "Ask a supervisor for guidance",
          "Guess and continue working",
          "Copy someone without checking",
          "Ignore the task completely",
        ],
        correctIndex: 0,
        explanation:
          "You should always seek guidance if unsure.",
      },
      {
        id: "hs-089",
        legacyIds: ["hs-069"],
        question: "Why is safety training important for workers?",
        options: [
          "It helps prevent accidents and injuries",
          "It removes the need for supervision",
          "It replaces the need for PPE",
          "It shortens working hours",
        ],
        correctIndex: 0,
        explanation:
          "Training ensures workers understand hazards and safe methods.",
      },
      {
        id: "hs-090",
        legacyIds: ["hs-070"],
        question: "What is the safest action if an accident occurs on site?",
        options: [
          "Report it immediately and seek help",
          "Ignore it if no one saw it",
          "Finish the task before reporting",
          "Post about it on social media",
        ],
        correctIndex: 0,
        explanation:
          "All accidents should be reported so they can be dealt with properly.",
      },
      {
        id: "hs-091",
        legacyIds: ["iwse-015"],
        question: "A key step in safe manual handling is to?",
        options: [
          "Bend knees and keep back straight",
          "Keep legs straight",
          "Twist while lifting",
          "Lift away from body",
        ],
        correctIndex: 0,
        explanation: "Safe lifting uses bent knees and a straight back.",
      },
      {
        id: "hs-092",
        legacyIds: ["iwse-021"],
        question: "A safe manual handling technique includes?",
        options: [
          "Keeping the load close to the body",
          "Holding the load at arm’s length",
          "Twisting while lifting",
          "Bending only at the waist",
        ],
        correctIndex: 0,
        explanation: "Loads should be kept close to reduce strain.",
      },
      {
        id: "hs-093",
        legacyIds: ["eit-004"],
        question: "Which is one power of HSE inspectors?",
        options: [
          "Enter premises unannounced to investigate",
          "Set employee pay rates",
          "Approve overtime",
          "Choose contractors",
        ],
        correctIndex: 0,
        explanation: "Inspectors can enter premises and investigate without notice.",
      },
      {
        id: "hs-094",
        legacyIds: ["eit-013"],
        question: "On construction sites there is a duty for workers to wear?",
        options: [
          "Head protection",
          "Hearing protection only",
          "Respirators only",
          "No PPE",
        ],
        correctIndex: 0,
        explanation: "Head protection is required on construction sites.",
      },
    
    
  ];
  
