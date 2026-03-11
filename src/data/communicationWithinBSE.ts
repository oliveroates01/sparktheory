export type Question = {
    id: string;
    legacyIds?: string[];
    question: string;
    options: [string, string, string, string];
    correctIndex: number;
    explanation: string;
  };
  
  export const communicationWithinBSEQuestions: Question[] = [
    {
      id: "comm-1",
      question: "Why is clear site communication critical?",
      options: ["To reduce supervision", "To cut mistakes and accidents", "To increase paperwork", "To work without drawings"],
      correctIndex: 1,
      explanation: "Clear comms reduce errors, rework, and safety risk."
    },
    {
      id: "comm-2",
      question: "Best example of verbal communication?",
      options: ["Method statement", "Toolbox talk", "Warning sign", "Isolator label"],
      correctIndex: 1,
      explanation: "Verbal comms are spoken, e.g., briefings/toolbox talks."
    },
    {
      id: "comm-3",
      question: "Best example of written communication?",
      options: ["Hand signal", "Text message", "Whistle blast", "Eye contact"],
      correctIndex: 1,
      explanation: "Written comms include texts, emails, reports, notes."
    },
    {
      id: "comm-4",
      question: "Best example of non-verbal communication?",
      options: [
    "Email",
    "Phone call",
    "Hand signal",
    "Handover sheet",
  ],
  correctIndex: 2,
      explanation: "Non-verbal comms include gestures/signals/body language."
    },
    {
      id: "comm-5",
      question: "If you don’t understand instructions, what do you do?",
      options: ["Guess and start", "Ask for clarification", "Wait until tomorrow", "Copy someone else"],
      correctIndex: 1,
      explanation: "Clarifying prevents unsafe work and costly rework."
    },
    {
      id: "comm-6",
      question: "What does active listening mainly involve?",
      options: ["Listen but interrupt", "Confirm understanding", "Listen only to managers", "Stay silent always"],
      correctIndex: 1,
      explanation: "You listen, process, and check you understood correctly."
    },
    {
      id: "comm-7",
      question: "Why repeat instructions back (check-back)?",
      options: ["To delay work", "To confirm accuracy", "To avoid drawings", "To challenge authority"],
      correctIndex: 1,
      explanation: "Check-back catches misunderstandings before work starts."
    },
    {
      id: "comm-8",
      question: "First person to report a site issue to?",
      options: [
    "Client with no additional measures",
    "Supervisor/chargehand",
    "Any apprentice as the full solution",
    "Post online with no further action",
  ],
  correctIndex: 1,
      explanation: "Use the site communication chain/escalation route."
    },
    {
      id: "comm-9",
      question: "Toolbox talks are mainly used for?",
      options: [
    "Sell tools with no additional measures",
    "Brief hazards/controls/tasks",
    "Check payroll as the full solution",
    "Test maths with no further action",
  ],
  correctIndex: 1,
      explanation: "They communicate risks, controls, and planned work."
    },
    {
      id: "comm-10",
      question: "Why must instructions be specific?",
      options: ["So everyone interprets differently", "So work is safe and correct", "So paperwork increases", "So standards can be ignored"],
      correctIndex: 1,
      explanation: "Specific instructions reduce ambiguity and errors."
    },
  
    {
      id: "comm-11",
      question: "Most effective method on a very noisy site?",
      options: [
    "Whispering with no additional measures",
    "Agreed hand signals/radio",
    "Long emails as the full solution",
    "Wait silently with no further action",
  ],
  correctIndex: 1,
      explanation: "Use agreed signals/radios when speech is unreliable."
    },
    {
      id: "comm-12",
      question: "Why keep communication professional?",
      options: [
    "To create conflict as the main approach",
    "To maintain working relationships",
    "To avoid PPE as the main approach",
    "To ignore rules as the main approach",
  ],
  correctIndex: 1,
      explanation: "Professional comms support teamwork and compliance."
    },
    {
      id: "comm-13",
      question: "If the job spec changes, you should?",
      options: ["Ignore it and continue", "Inform relevant people promptly", "Only tell the client", "Change it after completion"],
      correctIndex: 1,
      explanation: "Changes must be communicated to avoid wrong installation."
    },
    {
      id: "comm-14",
      question: "Why must material orders be accurate?",
      options: ["To increase waste", "To avoid delays/returns", "To skip approvals", "To reduce quality checks"],
      correctIndex: 1,
      explanation: "Wrong orders cause cost, delays, and rework."
    },
    {
      id: "comm-15",
      question: "Main aim of a site meeting?",
      options: [
    "Avoid work with no additional measures",
    "Coordinate tasks/issues/resources",
    "Replace drawings as the full solution",
    "Reduce communication with no further action",
  ],
  correctIndex: 1,
      explanation: "Meetings align people, progress, risks, and actions."
    },
    {
      id: "comm-16",
      question: "Best way to prevent misunderstandings?",
      options: ["Use vague language", "Use clear simple language", "Never ask questions", "Assume everyone knows"],
      correctIndex: 1,
      explanation: "Clarity plus confirmation prevents wrong assumptions."
    },
    {
      id: "comm-17",
      question: "Before passing info on, you should?",
      options: [
    "Guess missing details with no additional measures",
    "Check it’s correct and relevant",
    "Add opinions as the full solution",
    "Tell only friends, with no additional measures",
  ],
  correctIndex: 1,
      explanation: "Bad info causes bad decisions and unsafe work."
    },
    {
      id: "comm-18",
      question: "Why write down critical instructions?",
      options: [
    "To slow work as the main approach",
    "To create a traceable record",
    "To avoid speaking as the main approach",
    "To avoid responsibility",
  ],
  correctIndex: 1,
      explanation: "Written records reduce disputes and memory errors."
    },
    {
      id: "comm-19",
      question: "A major outcome of poor communication is?",
      options: [
    "Fewer defects with no additional measures",
    "Mistakes/rework/accidents",
    "Instant compliance as the full solution",
    "Lower risk with no further action",
  ],
  correctIndex: 1,
      explanation: "Poor comms increases errors and safety hazards."
    },
    {
      id: "comm-20",
      question: "Best approach for safety-critical info?",
      options: [
    "Say it once with no additional measures",
    "Be clear and confirm understanding",
    "Text later as the full solution",
    "Assume they heard with no further action",
  ],
  correctIndex: 1,
      explanation: "Safety messages must be confirmed, not assumed."
    },
  
    {
      id: "comm-21",
      question: "Why report near misses?",
      options: [
    "To blame others as the main approach",
    "To prevent future accidents",
    "To avoid learning as the main approach",
    "To reduce training as the main approach",
  ],
  correctIndex: 1,
      explanation: "Near misses highlight risks before someone gets hurt."
    },
    {
      id: "comm-22",
      question: "Common communication barrier on site?",
      options: ["Clear drawings", "Noise/distractions", "Good teamwork", "Correct PPE"],
      correctIndex: 1,
      explanation: "Noise and distractions reduce message accuracy."
    },
    {
      id: "comm-23",
      question: "Best way to reduce language barriers?",
      options: [
    "Use slang terms only, with no additional measures",
    "Use simple words/visuals + check-back",
    "Speak faster only, with no additional measures",
    "Ignore it and continue with no further action",
  ],
  correctIndex: 1,
      explanation: "Simple wording, visuals, and confirmation improve understanding."
    },
    {
      id: "comm-24",
      question: "If work sequence changes, you should?",
      options: [
    "Tell nobody",
    "Tell affected people quickly",
    "Only update after finishing",
    "Only tell the client",
  ],
  correctIndex: 1,
      explanation: "Fast updates prevent clashes and wasted work."
    },
    {
      id: "comm-25",
      question: "Why is poor timekeeping a communication issue?",
      options: [
    "It improves coordination with no additional measures",
    "It disrupts schedules and other trades",
    "It removes risk as the full solution",
    "It replaces planning with no further action",
  ],
  correctIndex: 1,
      explanation: "Late updates cause knock-on delays for others."
    },
    {
      id: "comm-26",
      question: "Good communication habit on site?",
      options: [
    "Interrupting with no additional measures",
    "Updating progress regularly",
    "Ignoring drawings as the full solution",
    "Avoiding briefings with no further action",
  ],
  correctIndex: 1,
      explanation: "Progress updates keep everyone coordinated."
    },
    {
      id: "comm-27",
      question: "Why keep messages short and clear?",
      options: [
    "To hide details as the main approach",
    "To speed understanding/decisions",
    "To confuse people as the main approach",
    "To delay approvals as the main approach",
  ],
  correctIndex: 1,
      explanation: "Clear, concise messages reduce mistakes."
    },
    {
      id: "comm-28",
      question: "A proper shift handover should include?",
      options: [
    "Only opinions, with no additional measures",
    "Work done + issues + next steps",
    "Only jokes, with no additional measures",
    "No detail for the installation",
  ],
  correctIndex: 1,
      explanation: "Handover must transfer facts and risks to the next team."
    },
    {
      id: "comm-29",
      question: "Why coordinate with other trades?",
      options: [
    "To compete as the main approach",
    "To prevent clashes and rework",
    "To avoid method statements",
    "To reduce safety as the main approach",
  ],
  correctIndex: 1,
      explanation: "Coordination avoids conflicts in space/time and sequence."
    },
    {
      id: "comm-30",
      question: "Best way to handle conflict professionally?",
      options: [
    "Argue loudly with no additional measures",
    "Stay calm and follow procedure",
    "Ignore safety as the full solution",
    "Refuse to speak with no further action",
  ],
  correctIndex: 1,
      explanation: "Use calm facts and the agreed site process."
    },
  
    {
      id: "comm-31",
      question: "Why record variations/changes?",
      options: ["To hide mistakes", "To track scope/time/cost", "To skip approvals", "To avoid inspection"],
      correctIndex: 1,
      explanation: "Variations affect price, time, and specification."
    },
    {
      id: "comm-32",
      question: "Why avoid slang/jargon in instructions?",
      options: ["It always helps", "It can be misunderstood", "It reduces quality checks", "It replaces drawings"],
      correctIndex: 1,
      explanation: "Standard language reduces ambiguity across teams."
    },
    {
      id: "comm-33",
      question: "A method statement mainly describes?",
      options: [
    "Company history with no additional measures",
    "How to do the task safely",
    "Tool prices as the full solution",
    "Testing exemptions with no further action",
  ],
  correctIndex: 1,
      explanation: "It sets out steps, hazards, and controls."
    },
    {
      id: "comm-34",
      question: "Why use correct technical terms?",
      options: [
    "To impress people as the main approach",
    "To ensure shared accurate meaning",
    "To reduce training as the main approach",
    "To avoid specs as the main approach",
  ],
  correctIndex: 1,
      explanation: "Wrong terms can lead to wrong components/work."
    },
    {
      id: "comm-35",
      question: "Site notice boards are used to?",
      options: [
    "Display jokes with no additional measures",
    "Share key information/updates",
    "Hide changes as the full solution",
    "Replace inductions with no further action",
  ],
  correctIndex: 1,
      explanation: "They communicate rules, contacts, and site updates."
    },
    {
      id: "comm-36",
      question: "If you get conflicting instructions, you should?",
      options: [
    "Pick the easiest with no additional measures",
    "Stop and clarify with supervisor",
    "Ignore both as the full solution",
    "Ask client only, with no additional measures",
  ],
  correctIndex: 1,
      explanation: "Conflicts must be resolved before continuing."
    },
    {
      id: "comm-37",
      question: "Most important emergency message includes?",
      options: [
    "Tool brand with no additional measures",
    "Hazard + exact location",
    "Timesheet info as the full solution",
    "Who’s to blame with no further action",
  ],
  correctIndex: 1,
      explanation: "Emergency comms must be clear, fast, and specific."
    },
    {
      id: "comm-38",
      question: "Why rely on drawings/specifications?",
      options: [
    "To guess less as the main approach",
    "To follow the intended design",
    "To avoid checks as the main approach",
    "To skip approvals as the main approach",
  ],
  correctIndex: 1,
      explanation: "Drawings/specs define what ‘correct’ looks like."
    },
    {
      id: "comm-39",
      question: "Why communicate hazards you find?",
      options: ["To blame others", "To prevent harm", "To slow work", "To increase paperwork"],
      correctIndex: 1,
      explanation: "Others can’t control a risk they don’t know about."
    },
    {
      id: "comm-40",
      question: "Purpose of safety signage?",
      options: [
    "Decoration only, with no additional measures",
    "Warn and guide behaviour",
    "Replace PPE as the full solution",
    "Replace training with no further action",
  ],
  correctIndex: 1,
      explanation: "Signs communicate hazards, rules, and mandatory actions."
    },
  
    {
      id: "comm-41",
      question: "Good client communication example?",
      options: [
    "Private gossip with no additional measures",
    "Progress update/handover note",
    "Tool order as the full solution",
    "Trade banter with no further action",
  ],
  correctIndex: 1,
      explanation: "Clients need clear status, access, and handover info."
    },
    {
      id: "comm-42",
      question: "When reporting an issue, how should you keep it?",
      options: [
    "Emotional with no additional measures",
    "Factual and specific",
    "Vague as the full solution",
    "Anonymous with no further action",
  ],
  correctIndex: 1,
      explanation: "Facts help the right decision be made quickly."
    },
    {
      id: "comm-43",
      question: "Before sending an email about changes, you should?",
      options: [
    "Send instantly with no additional measures",
    "Check details + recipients",
    "Use slang terms as the full solution",
    "Leave out dates with no further action",
  ],
  correctIndex: 1,
      explanation: "Correct content to correct people prevents confusion."
    },
    {
      id: "comm-44",
      question: "A site “communication chain” is?",
      options: [
    "A lifting chain as the complete answer",
    "The agreed route for info escalation",
    "A tool brand as the complete answer",
    "A type of bonding as the complete answer",
  ],
  correctIndex: 1,
      explanation: "It defines who you report to and in what order."
    },
    {
      id: "comm-45",
      question: "Why must apprentices follow comms procedures?",
      options: [
    "So they can ignore supervisors with no additional measures",
    "Because safety/coordination depend on it",
    "To avoid paperwork as the main approach",
    "To change specs freely as the main approach",
  ],
  correctIndex: 1,
      explanation: "Good procedure prevents unsafe or unauthorised actions."
    },
    {
      id: "comm-46",
      question: "Best way to give instructions?",
      options: [
    "All details at once with no additional measures",
    "Clear steps + check understanding",
    "No context for the installation",
    "Assume they know with no further action",
  ],
  correctIndex: 1,
      explanation: "Step-by-step with confirmation reduces mistakes."
    },
    {
      id: "comm-47",
      question: "Why keep site records?",
      options: ["To create work", "Traceability/evidence", "To avoid inspection", "To reduce quality"],
      correctIndex: 1,
      explanation: "Records prove what was done and why."
    },
    {
      id: "comm-48",
      question: "Why update as-fitted/as-built info?",
      options: ["To confuse maintenance", "So future work is accurate", "To hide changes", "To reduce compliance"],
      correctIndex: 1,
      explanation: "As-built records match the real installation."
    },
    {
      id: "comm-49",
      question: "Purpose of equipment/circuit labelling?",
      options: [
    "Decoration only, with no additional measures",
    "Safe identification for operation/maintenance",
    "Reduce testing as the full solution with no further action",
    "Increase voltage with no further action",
  ],
  correctIndex: 1,
      explanation: "Labels support safe isolation and fault finding."
    },
    {
      id: "comm-50",
      question: "Why report delays early?",
      options: [
    "So nobody plans with no additional measures",
    "So schedules/resources can change",
    "So mistakes increase as the full solution",
    "So work stops with no further action",
  ],
  correctIndex: 1,
      explanation: "Early warning reduces knock-on delays and conflict."
    },
  
    {
      id: "comm-51",
      question: "Best approach with an angry/stressed person?",
      options: ["Match their tone", "Stay calm and clear", "Ignore them", "Argue immediately"],
      correctIndex: 1,
      explanation: "Calm comms de-escalate and keep decisions factual."
    },
    {
      id: "comm-52",
      question: "Which is poor communication?",
      options: [
    "Check-back with no additional measures",
    "Assuming you were understood",
    "Using drawings as the full solution",
    "Asking questions with no further action",
  ],
  correctIndex: 1,
      explanation: "Assumptions cause errors and unsafe actions."
    },
    {
      id: "comm-53",
      question: "Why does communication support quality?",
      options: [
    "Replaces inspection with no additional measures",
    "Aligns work to requirements",
    "Avoids standards as the full solution",
    "Increases waste with no further action",
  ],
  correctIndex: 1,
      explanation: "Quality needs clear requirements and feedback."
    },
    {
      id: "comm-54",
      question: "Customer asks for extra work (out of scope). You?",
      options: [
    "Do it instantly with no additional measures",
    "Refer via supervisor/variation process",
    "Ignore request as the full solution",
    "Change drawings yourself with no further action",
  ],
  correctIndex: 1,
      explanation: "Scope changes need approval, costing, and record."
    },
    {
      id: "comm-55",
      question: "Why mention hazards during handover?",
      options: ["So hazards continue", "So next shift stays safe", "So paperwork grows", "So work stops"],
      correctIndex: 1,
      explanation: "Incoming teams need risks/controls before starting."
    },
    {
      id: "comm-56",
      question: "Why are checklists useful for communication?",
      options: [
    "Remove accountability with no additional measures",
    "Standardise what must be done/reported",
    "Replace competence as the full solution",
    "Reduce safety with no further action",
  ],
  correctIndex: 1,
      explanation: "They reduce missed steps and inconsistent reporting."
    },
    {
      id: "comm-57",
      question: "Knowing who to speak to matters because?",
      options: [
      "You can avoid people with no additional measures",
      "Messages reach the right person fast",
      "Nothing gets reported as the full solution",
      "Procedure is optional with no further action",
    ],
    correctIndex: 1,
      explanation: "Correct routing prevents delays and confusion."
    },
    {
      id: "comm-58",
      question: "Most traceable communication method?",
      options: [
    "Hand signals with no additional measures",
    "Verbal only, with no additional measures",
    "Email/written record",
    "Shouting with no further action",
  ],
  correctIndex: 2,
      explanation: "Written comms provide an auditable record."
    },
    {
      id: "comm-59",
      question: "Why avoid rumours on site?",
      options: [
      "They improve teamwork with no additional measures",
      "They damage trust and decisions",
      "They improve safety as the full solution",
      "They reduce defects with no further action",
    ],
    correctIndex: 1,
      explanation: "Rumours cause conflict and poor choices."
    },
    {
      id: "comm-60",
      question: "Good radio practice is to?",
      options: [
    "Talk continuously with no additional measures",
    "Be clear and confirm receipt",
    "Use slang only, with no additional measures",
    "Avoid locations with no further action",
  ],
  correctIndex: 1,
      explanation: "Confirming receipt prevents misunderstandings."
    },
  
    {
      id: "comm-61",
      question: "Why does body language matter?",
      options: [
    "Never affects meaning with no additional measures",
    "Can support or contradict words",
    "Replaces records as the full solution",
    "Replaces drawings with no further action",
  ],
  correctIndex: 1,
      explanation: "Non-verbal cues can change how a message is understood."
    },
    {
      id: "comm-62",
      question: "If you see unsafe behaviour, you should?",
      options: ["Ignore it and continue", "Act/report using site rules", "Record it only", "Wait for an accident"],
      correctIndex: 1,
      explanation: "Unsafe behaviour must be addressed to prevent injury."
    },
    {
      id: "comm-63",
      question: "Professional way to request help?",
      options: [
    "Demand help immediately",
    "Explain what you need and why",
    "Blame other people as the full solution",
    "Refuse to work with no further action",
  ],
  correctIndex: 1,
      explanation: "Clear requests get faster and better support."
    },
    {
      id: "comm-64",
      question: "Why share your location when team working?",
      options: [
    "To waste time as the main approach",
    "Safety and coordination",
    "Avoid planning as the full solution",
    "Increase noise with no further action",
  ],
  correctIndex: 1,
      explanation: "Location updates help manage risk and sequencing."
    },
    {
      id: "comm-65",
      question: "Safety communication document example?",
      options: [
    "Risk assessment",
    "Tool catalogue",
    "Price list",
    "Invoice",
  ],
  correctIndex: 0,
      explanation: "Risk assessments communicate hazards and controls."
    },
    {
      id: "comm-66",
      question: "A good progress update includes?",
      options: [
    "Only jokes, with no additional measures",
    "Done + issues + next actions",
    "Only blame, with no additional measures",
    "Nothing specific with no further action",
  ],
  correctIndex: 1,
      explanation: "Status, risks, and next steps keep work aligned."
    },
    {
      id: "comm-67",
      question: "Communication must be timely because?",
      options: [
    "Problems should grow with no additional measures",
    "Decisions/fixes happen faster",
    "No one should plan for the installation",
    "Work must stop with no further action",
  ],
  correctIndex: 1,
      explanation: "Late info causes delays and increased risk."
    },
    {
      id: "comm-68",
      question: "During lifting ops, safest communication uses?",
      options: [
    "Random shouting with no additional measures",
    "Agreed signals/appointed banksman",
    "Walking under load as the full solution",
    "Ignoring the lift team with no further action",
  ],
  correctIndex: 1,
      explanation: "Controlled signals prevent dangerous misunderstandings."
    },
    {
      id: "comm-69",
      question: "Why give instructions to the right person?",
      options: [
    "So the wrong person acts with no additional measures",
    "Clear responsibility and action",
    "More paperwork as the full solution",
    "No one acts for the installation",
  ],
  correctIndex: 1,
      explanation: "Correct recipient = correct action and accountability."
    },
    {
      id: "comm-70",
      question: "Best safety instruction wording is?",
      options: [
    "“Be careful” with no additional measures",
    "Specific hazard + control",
    "Only mention once, with no additional measures",
    "Say it later with no further action",
  ],
  correctIndex: 1,
      explanation: "Specific controls are actionable and measurable."
    },
  
    {
      id: "comm-71",
      question: "Before working in another trade’s area, you should?",
      options: [
    "Start without telling with no additional measures",
    "Coordinate access and sequence",
    "Remove their kit as the full solution",
    "Ignore rules with no further action",
  ],
  correctIndex: 1,
      explanation: "Coordination prevents clashes, damage, and delays."
    },
    {
      id: "comm-72",
      question: "Why are as-built records valuable to clients?",
      options: [
    "Increase cost with no additional measures",
    "Support maintenance and future changes",
    "Replace training as the full solution",
    "Reduce safety with no further action",
  ],
  correctIndex: 1,
      explanation: "Accurate records help safe operation and future work."
    },
    {
      id: "comm-73",
      question: "Main weakness of verbal instructions only?",
      options: [
      "Always recorded with no additional measures",
      "Can be misheard/forgotten",
      "Never misunderstood as the full solution",
      "Too traceable with no further action",
    ],
    correctIndex: 1,
      explanation: "Without a record, errors are more likely."
    },
    {
      id: "comm-74",
      question: "If you make an error in a record, you should?",
      options: [
    "Hide the mistake with no additional measures",
    "Correct it properly (traceably)",
    "Delete everything as the full solution",
    "Ignore it and continue with no further action",
  ],
  correctIndex: 1,
      explanation: "Records must remain honest and auditable."
    },
    {
      id: "comm-75",
      question: "Why does respect matter in diverse teams?",
      options: [
    "Creates conflict with no additional measures",
    "Improves cooperation/understanding",
    "Avoids learning as the full solution",
    "Reduces standards with no further action",
  ],
  correctIndex: 1,
      explanation: "Respect improves teamwork and reduces misunderstanding."
    },
    {
      id: "comm-76",
      question: "If a safety instruction seems wrong, you should?",
      options: [
    "Ignore it and continue with no additional measures",
    "Raise it with supervisor for clarification",
    "Follow it silently as the full solution",
    "Tell the client first with no further action",
  ],
  correctIndex: 1,
      explanation: "Escalate concerns through the correct route."
    },
    {
      id: "comm-77",
      question: "Purpose of sharing RAMS?",
      options: [
    "Reduce safety with no additional measures",
    "Explain hazards and safe steps",
    "Avoid supervision as the full solution",
    "Replace tools with no further action",
  ],
  correctIndex: 1,
      explanation: "RAMS informs people how to work safely."
    },
    {
      id: "comm-78",
      question: "Which behaviour shows poor listening?",
      options: [
    "Taking notes",
    "Interrupting and assuming",
    "Repeating key points",
    "Asking clarifying questions",
  ],
  correctIndex: 1,
      explanation: "Interrupting/assuming leads to missed requirements."
    },
    {
      id: "comm-79",
      question: "Confidentiality in communication protects?",
      options: [
    "Rumours with no additional measures",
    "Client/company information",
    "Mistakes as the full solution",
    "Unsafe practice with no further action",
  ],
  correctIndex: 1,
      explanation: "Share sensitive info only with those who need it."
    },
    {
      id: "comm-80",
      question: "Communicating quality requirements means?",
      options: [
    "Ignoring specs with no additional measures",
    "Following standards/spec tolerances",
    "Using any materials as the full solution",
    "Avoiding inspections with no further action",
  ],
  correctIndex: 1,
      explanation: "Quality is defined by drawings, specs, and standards."
    },
  
    {
      id: "comm-81",
      question: "Why confirm a task is complete?",
      options: [
      "So nobody knows with no additional measures",
      "So others can proceed safely",
      "To avoid inspection as the main approach",
      "To increase paperwork as the main approach",
    ],
    correctIndex: 1,
      explanation: "Completion updates allow safe sequencing and handover."
    },
    {
      id: "comm-82",
      question: "Why use photos in site communication?",
      options: ["Replace all documents", "Provide visual evidence", "Avoid safety", "Confuse others"],
      correctIndex: 1,
      explanation: "Photos show progress/defects clearly and quickly."
    },
    {
      id: "comm-83",
      question: "Why communicate access requirements early?",
      options: [
    "So people arrive unprepared with no additional measures",
    "So permits/resources can be planned",
    "So safety drops as the full solution",
    "So trades clash with no further action",
  ],
  correctIndex: 1,
      explanation: "Access affects permits, timing, and safe work methods."
    },
    {
      id: "comm-84",
      question: "Asked to do a task outside your competence. You?",
      options: [
    "Do it anyway alone with no additional measures",
    "Tell supervisor and get guidance",
    "Hide the issue as the full solution",
    "Blame other people with no further action",
  ],
  correctIndex: 1,
      explanation: "Work must stay within competence for safety and compliance."
    },
    {
      id: "comm-85",
      question: "Why communicate hazards created by your work?",
      options: ["So controls are avoided", "So others can manage risk", "To reduce productivity", "To increase noise"],
      correctIndex: 1,
      explanation: "Others need to know new hazards to stay safe."
    },
    {
      id: "comm-86",
      question: "A permit-to-work briefing communicates?",
      options: [
    "How to skip PPE with no additional measures",
    "Restrictions and safety controls",
    "Tool brands as the full solution",
    "Testing exemptions with no further action",
  ],
  correctIndex: 1,
      explanation: "Permits set conditions and controls for high-risk work."
    },
    {
      id: "comm-87",
      question: "Best way to reduce critical communication errors?",
      options: [
    "Rely on memory with no additional measures",
    "Use written confirmation + check-backs",
    "Avoid records as the full solution",
    "Assume others heard with no further action",
  ],
  correctIndex: 1,
      explanation: "Check-backs and records reduce high-risk mistakes."
    },
    {
      id: "comm-88",
      question: "Why stay respectful under pressure?",
      options: [
    "To cause conflict as the main approach",
    "To keep teamwork and clear decisions",
    "To reduce compliance as the main approach",
    "To increase mistakes as the main approach",
  ],
  correctIndex: 1,
      explanation: "Respectful comms keeps focus on facts and actions."
    },
    {
      id: "comm-89",
      question: "Which communicates site rules effectively?",
      options: ["Removing signs", "Induction + signage", "Ignoring procedures", "Telling people to skip PPE"],
      correctIndex: 1,
      explanation: "Induction and signage set consistent expectations."
    },
    {
      id: "comm-90",
      question: "Why document defects/snags?",
      options: [
    "To blame others as the main approach",
    "To track and close defects",
    "To avoid fixing as the main approach",
    "To reduce quality as the main approach",
  ],
  correctIndex: 1,
      explanation: "Snag lists make defects visible, owned, and corrected."
    },
  
    {
      id: "comm-91",
      question: "Before formal client handover you should?",
      options: [
    "Skip checks with no additional measures",
    "Confirm completion + accurate info",
    "Hide docs as the full solution",
    "Remove labels with no further action",
  ],
  correctIndex: 1,
      explanation: "Handover must be complete, accurate, and usable."
    },
    {
      id: "comm-92",
      question: "What most improves team communication?",
      options: [
    "Avoid updates with no additional measures",
    "Regular briefings + clear roles",
    "Shouting as the full solution",
    "Ignoring feedback with no further action",
  ],
  correctIndex: 1,
      explanation: "Briefings and roles reduce uncertainty and clashes."
    },
    {
      id: "comm-93",
      question: "Why is feedback important on site?",
      options: [
    "It delays work with no additional measures",
    "It improves performance/understanding",
    "It replaces PPE as the full solution",
    "It removes responsibility with no further action",
  ],
  correctIndex: 1,
      explanation: "Feedback stops repeat errors and improves standards."
    },
    {
      id: "comm-94",
      question: "If test results affect others, you should?",
      options: [
    "Keep private always with no additional measures",
    "Share/record to relevant people",
    "Destroy records as the full solution",
    "Tell client verbally only",
  ],
  correctIndex: 1,
      explanation: "Relevant results must be communicated for safe decisions."
    },
    {
      id: "comm-95",
      question: "Why report tool/equipment condition?",
      options: [
    "Hide faults with no additional measures",
    "Prevent unsafe use and downtime",
    "Increase waste as the full solution",
    "Ignore maintenance with no further action",
  ],
  correctIndex: 1,
      explanation: "Fault reporting prevents accidents and delays."
    },
    {
      id: "comm-96",
      question: "Professional communication mainly supports?",
      options: [
    "Arguments with no additional measures",
    "Good relationships and standards",
    "Skipping rules as the full solution",
    "Avoiding records with no further action",
  ],
  correctIndex: 1,
      explanation: "Professional comms supports teamwork and compliance."
    },
    {
      id: "comm-97",
      question: "After receiving new site info, you should?",
      options: ["Ignore it and continue", "Confirm understanding if needed", "Wait for inspection only", "Tell client immediately"],
      correctIndex: 1,
      explanation: "Confirmation prevents acting on wrong assumptions."
    },
    {
      id: "comm-98",
      question: "Why are records important in communication?",
      options: [
      "To delay work as the main approach",
      "Evidence and traceability",
      "Replace drawings as the full solution",
      "Increase confusion with no further action",
    ],
    correctIndex: 1,
      explanation: "Records show decisions, changes, and what was done."
    },
    {
      id: "comm-99",
      question: "Who needs relevant safety information?",
      options: ["Only supervisors", "All affected people", "Clients only", "Office only"],
      correctIndex: 1,
      explanation: "Anyone exposed to risk must know the controls."
    },
    {
      id: "comm-100",
      question: "Main aim of effective communication in BSE?",
      options: [
      "Reduce inspections with no additional measures",
      "Safe, accurate, efficient work",
      "Increase paperwork as the full solution",
      "Avoid responsibility with no further action",
    ],
    correctIndex: 1,
      explanation: "Effective comms supports safety, quality, and productivity."
    },
    {
      id: "comm-101",
      legacyIds: ["iwse-001"],
      question: "Name one advantage of using electronic technical information (e.g., USB, CD, DVD)?",
      options: [
        "Portable and easy to update",
        "Always works without power",
        "Cannot be lost",
        "Never needs backups",
      ],
      correctIndex: 0,
      explanation: "Electronic sources are portable and can be updated easily."
    },
    {
      id: "comm-102",
      legacyIds: ["iwse-002"],
      question: "What is a disadvantage of electronic technical information?",
      options: [
        "Requires power or a device to access",
        "Is always out of date as the sole approach",
        "Cannot store large files as the full solution",
        "Is illegal to use with no further action",
      ],
      correctIndex: 0,
      explanation: "Electronic data needs a device and power to view."
    },
    {
      id: "comm-103",
      legacyIds: ["iwse-003"],
      question: "What is an advantage of hard-copy technical information?",
      options: [
        "Can be used without power",
        "Is always up to date",
        "Cannot be damaged",
        "Is lighter than digital devices",
      ],
      correctIndex: 0,
      explanation: "Printed information needs no power source."
    },
    {
      id: "comm-104",
      legacyIds: ["iwse-004"],
      question: "What is a disadvantage of hard-copy information?",
      options: [
        "Can be bulky and harder to update",
        "Cannot be taken to site as the sole approach",
        "Is illegal as the full solution",
        "Never gets damaged with no further action",
      ],
      correctIndex: 0,
      explanation: "Printed materials can be bulky and out of date."
    },
    {
      id: "comm-105",
      legacyIds: ["iwse-027"],
      question: "What is a disadvantage of hard-copy technical information?",
      options: [
        "Can become outdated and damaged",
        "Requires software updates",
        "Needs batteries as the full solution",
        "Cannot be shared with no further action",
      ],
      correctIndex: 0,
      explanation: "Printed materials can be out of date or damaged on site."
    },
    {
      id: "comm-106",
      legacyIds: ["iwse-028"],
      question: "What is an advantage of electronic technical information?",
      options: [
        "Can store large amounts of data in one place",
        "Never needs charging as the sole approach",
        "Cannot be lost as the full solution with no further action",
        "Cannot be corrupted with no further action",
      ],
      correctIndex: 0,
      explanation: "Electronic storage can hold a lot of information."
    },
    {
      id: "comm-107",
      legacyIds: ["iwse-035"],
      question: "An advantage of electronic technical info in the office is?",
      options: [
        "Easy search and fast updates",
        "No need for backups for the installation",
        "Cannot be shared as the full solution",
        "Always offline with no further action",
      ],
      correctIndex: 0,
      explanation: "Digital info is searchable and easy to update."
    },
    {
      id: "comm-108",
      legacyIds: ["iwse-036"],
      question: "An advantage of hard‑copy info in the office is?",
      options: [
        "Quick reference without devices",
        "Never gets out of date as the sole approach",
        "Always up to date as the full solution",
        "Cannot be lost with no further action",
      ],
      correctIndex: 0,
      explanation: "Hard copy can be read without devices or power."
    }
  ];
  
