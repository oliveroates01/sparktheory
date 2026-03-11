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
    "Email in practice on site",
    "Phone call on site in this context",
    "Hand signal in this context",
    "Handover sheet as standard",
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
      question: "Active listening mainly means you?",
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
    "Client in practice on site",
    "Supervisor/chargehand",
    "Any apprentice in this context",
    "Post online as standard",
  ],
  correctIndex: 1,
      explanation: "Use the site communication chain/escalation route."
    },
    {
      id: "comm-9",
      question: "Toolbox talks are mainly used to?",
      options: [
    "Sell tools in practice",
    "Brief hazards/controls/tasks",
    "Check payroll in this context",
    "Test maths as standard",
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
    "Whispering in practice",
    "Agreed hand signals/radio",
    "Long emails in this context",
    "Wait silently as standard",
  ],
  correctIndex: 1,
      explanation: "Use agreed signals/radios when speech is unreliable."
    },
    {
      id: "comm-12",
      question: "Why keep communication professional?",
      options: [
    "To create conflict in practice",
    "To maintain working relationships",
    "To avoid PPE in this context",
    "To ignore rules as standard",
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
    "Avoid work in practice",
    "Coordinate tasks/issues/resources",
    "Replace drawings in this context",
    "Reduce communication",
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
    "Guess missing details",
    "Check it’s correct and relevant",
    "Add opinions in this context",
    "Tell only friends as standard",
  ],
  correctIndex: 1,
      explanation: "Bad info causes bad decisions and unsafe work."
    },
    {
      id: "comm-18",
      question: "Why write down critical instructions?",
      options: [
    "To slow work in practice",
    "To create a traceable record",
    "To avoid speaking in this context",
    "To avoid responsibility",
  ],
  correctIndex: 1,
      explanation: "Written records reduce disputes and memory errors."
    },
    {
      id: "comm-19",
      question: "A major outcome of poor communication is?",
      options: [
    "Fewer defects in practice",
    "Mistakes/rework/accidents",
    "Instant compliance in this context",
    "Lower risk as standard",
  ],
  correctIndex: 1,
      explanation: "Poor comms increases errors and safety hazards."
    },
    {
      id: "comm-20",
      question: "Best approach for safety-critical info?",
      options: [
    "Say it once in practice",
    "Be clear and confirm understanding",
    "Text later in this context",
    "Assume they heard as standard",
  ],
  correctIndex: 1,
      explanation: "Safety messages must be confirmed, not assumed."
    },
  
    {
      id: "comm-21",
      question: "Why report near misses?",
      options: [
    "To blame others in practice",
    "To prevent future accidents",
    "To avoid learning in this context",
    "To reduce training as standard",
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
    "Use slang terms only",
    "Use simple words/visuals + check-back",
    "Speak faster only in this context",
    "Ignore it and continue",
  ],
  correctIndex: 1,
      explanation: "Simple wording, visuals, and confirmation improve understanding."
    },
    {
      id: "comm-24",
      question: "If work sequence changes, you should?",
      options: [
    "Tell nobody in practice",
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
    "It improves coordination",
    "It disrupts schedules and other trades",
    "It removes risk in this context",
    "It replaces planning",
  ],
  correctIndex: 1,
      explanation: "Late updates cause knock-on delays for others."
    },
    {
      id: "comm-26",
      question: "Good communication habit on site?",
      options: [
    "Interrupting in practice",
    "Updating progress regularly",
    "Ignoring drawings in this context",
    "Avoiding briefings as standard",
  ],
  correctIndex: 1,
      explanation: "Progress updates keep everyone coordinated."
    },
    {
      id: "comm-27",
      question: "Why keep messages short and clear?",
      options: [
    "To hide details in practice",
    "To speed understanding/decisions",
    "To confuse people in this context",
    "To delay approvals as standard",
  ],
  correctIndex: 1,
      explanation: "Clear, concise messages reduce mistakes."
    },
    {
      id: "comm-28",
      question: "A proper shift handover should include?",
      options: [
    "Only opinions in practice",
    "Work done + issues + next steps",
    "Only jokes in this context",
    "No detail as standard",
  ],
  correctIndex: 1,
      explanation: "Handover must transfer facts and risks to the next team."
    },
    {
      id: "comm-29",
      question: "Why coordinate with other trades?",
      options: [
    "To compete in practice",
    "To prevent clashes and rework",
    "To avoid method statements",
    "To reduce safety as standard",
  ],
  correctIndex: 1,
      explanation: "Coordination avoids conflicts in space/time and sequence."
    },
    {
      id: "comm-30",
      question: "Best way to handle conflict professionally?",
      options: [
    "Argue loudly in practice",
    "Stay calm and follow procedure",
    "Ignore safety in this context",
    "Refuse to speak as standard",
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
    "Company history in practice",
    "How to do the task safely",
    "Tool prices in this context",
    "Testing exemptions as standard",
  ],
  correctIndex: 1,
      explanation: "It sets out steps, hazards, and controls."
    },
    {
      id: "comm-34",
      question: "Why use correct technical terms?",
      options: [
    "To impress people in practice",
    "To ensure shared accurate meaning",
    "To reduce training in this context",
    "To avoid specs as standard",
  ],
  correctIndex: 1,
      explanation: "Wrong terms can lead to wrong components/work."
    },
    {
      id: "comm-35",
      question: "Site notice boards are used to?",
      options: [
    "Display jokes in practice",
    "Share key information/updates",
    "Hide changes in this context",
    "Replace inductions as standard",
  ],
  correctIndex: 1,
      explanation: "They communicate rules, contacts, and site updates."
    },
    {
      id: "comm-36",
      question: "If you get conflicting instructions, you should?",
      options: [
    "Pick the easiest in practice",
    "Stop and clarify with supervisor",
    "Ignore both in this context",
    "Ask client only as standard",
  ],
  correctIndex: 1,
      explanation: "Conflicts must be resolved before continuing."
    },
    {
      id: "comm-37",
      question: "Most important emergency message includes?",
      options: [
    "Tool brand in practice",
    "Hazard + exact location",
    "Timesheet info in this context",
    "Who’s to blame as standard",
  ],
  correctIndex: 1,
      explanation: "Emergency comms must be clear, fast, and specific."
    },
    {
      id: "comm-38",
      question: "Why rely on drawings/specifications?",
      options: [
    "To guess less in practice",
    "To follow the intended design",
    "To avoid checks in this context",
    "To skip approvals as standard",
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
    "Decoration only in practice",
    "Warn and guide behaviour",
    "Replace PPE in this context",
    "Replace training as standard",
  ],
  correctIndex: 1,
      explanation: "Signs communicate hazards, rules, and mandatory actions."
    },
  
    {
      id: "comm-41",
      question: "Good client communication example?",
      options: [
    "Private gossip in practice",
    "Progress update/handover note",
    "Tool order in this context",
    "Trade banter as standard",
  ],
  correctIndex: 1,
      explanation: "Clients need clear status, access, and handover info."
    },
    {
      id: "comm-42",
      question: "When reporting an issue, keep it?",
      options: [
    "Emotional in practice",
    "Factual and specific",
    "Vague in this context",
    "Anonymous as standard",
  ],
  correctIndex: 1,
      explanation: "Facts help the right decision be made quickly."
    },
    {
      id: "comm-43",
      question: "Before sending an email about changes, you should?",
      options: [
    "Send instantly in practice",
    "Check details + recipients",
    "Use slang terms in this context",
    "Leave out dates as standard",
  ],
  correctIndex: 1,
      explanation: "Correct content to correct people prevents confusion."
    },
    {
      id: "comm-44",
      question: "A site “communication chain” is?",
      options: [
    "A lifting chain in practice",
    "The agreed route for info escalation",
    "A tool brand in this context",
    "A type of bonding as standard",
  ],
  correctIndex: 1,
      explanation: "It defines who you report to and in what order."
    },
    {
      id: "comm-45",
      question: "Why must apprentices follow comms procedures?",
      options: [
    "So they can ignore supervisors",
    "Because safety/coordination depend on it",
    "To avoid paperwork in this context",
    "To change specs freely",
  ],
  correctIndex: 1,
      explanation: "Good procedure prevents unsafe or unauthorised actions."
    },
    {
      id: "comm-46",
      question: "Best way to give instructions?",
      options: [
    "All details at once in practice",
    "Clear steps + check understanding",
    "No context in this context",
    "Assume they know as standard",
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
    "Decoration only in practice",
    "Safe identification for operation/maintenance",
    "Reduce testing in this context",
    "Increase voltage as standard",
  ],
  correctIndex: 1,
      explanation: "Labels support safe isolation and fault finding."
    },
    {
      id: "comm-50",
      question: "Why report delays early?",
      options: [
    "So nobody plans in practice",
    "So schedules/resources can change",
    "So mistakes increase",
    "So work stops as standard",
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
    "Check-back in practice",
    "Assuming you were understood",
    "Using drawings in this context",
    "Asking questions as standard",
  ],
  correctIndex: 1,
      explanation: "Assumptions cause errors and unsafe actions."
    },
    {
      id: "comm-53",
      question: "Communication supports quality because it?",
      options: [
    "Replaces inspection in practice",
    "Aligns work to requirements",
    "Avoids standards in this context",
    "Increases waste as standard",
  ],
  correctIndex: 1,
      explanation: "Quality needs clear requirements and feedback."
    },
    {
      id: "comm-54",
      question: "Customer asks for extra work (out of scope). You?",
      options: [
    "Do it instantly in practice",
    "Refer via supervisor/variation process",
    "Ignore request in this context",
    "Change drawings yourself",
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
    "Remove accountability",
    "Standardise what must be done/reported",
    "Replace competence in this context",
    "Reduce safety as standard",
  ],
  correctIndex: 1,
      explanation: "They reduce missed steps and inconsistent reporting."
    },
    {
      id: "comm-57",
      question: "Knowing who to speak to matters because?",
      options: ["You can avoid people", "Messages reach the right person fast", "Nothing gets reported", "Procedure is optional"],
      correctIndex: 1,
      explanation: "Correct routing prevents delays and confusion."
    },
    {
      id: "comm-58",
      question: "Most traceable communication method?",
      options: [
    "Hand signals in practice",
    "Verbal only on site in this context",
    "Email/written record",
    "Shouting as standard",
  ],
  correctIndex: 2,
      explanation: "Written comms provide an auditable record."
    },
    {
      id: "comm-59",
      question: "Why avoid rumours on site?",
      options: ["They improve teamwork", "They damage trust and decisions", "They improve safety", "They reduce defects"],
      correctIndex: 1,
      explanation: "Rumours cause conflict and poor choices."
    },
    {
      id: "comm-60",
      question: "Good radio practice is to?",
      options: [
    "Talk continuously in practice",
    "Be clear and confirm receipt",
    "Use slang only in this context",
    "Avoid locations as standard",
  ],
  correctIndex: 1,
      explanation: "Confirming receipt prevents misunderstandings."
    },
  
    {
      id: "comm-61",
      question: "Body language matters because it?",
      options: [
    "Never affects meaning",
    "Can support or contradict words",
    "Replaces records in this context",
    "Replaces drawings as standard",
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
    "Blame other people in this context",
    "Refuse to work as standard",
  ],
  correctIndex: 1,
      explanation: "Clear requests get faster and better support."
    },
    {
      id: "comm-64",
      question: "Why share your location when team working?",
      options: [
    "To waste time in practice",
    "Safety and coordination",
    "Avoid planning in this context",
    "Increase noise as standard",
  ],
  correctIndex: 1,
      explanation: "Location updates help manage risk and sequencing."
    },
    {
      id: "comm-65",
      question: "Safety communication document example?",
      options: [
    "Risk assessment in practice",
    "Tool catalogue on site",
    "Price list in this context",
    "Invoice as standard in normal use",
  ],
  correctIndex: 0,
      explanation: "Risk assessments communicate hazards and controls."
    },
    {
      id: "comm-66",
      question: "A good progress update includes?",
      options: [
    "Only jokes in practice",
    "Done + issues + next actions",
    "Only blame in this context",
    "Nothing specific as standard",
  ],
  correctIndex: 1,
      explanation: "Status, risks, and next steps keep work aligned."
    },
    {
      id: "comm-67",
      question: "Communication must be timely because?",
      options: [
    "Problems should grow",
    "Decisions/fixes happen faster",
    "No one should plan in this context",
    "Work must stop as standard",
  ],
  correctIndex: 1,
      explanation: "Late info causes delays and increased risk."
    },
    {
      id: "comm-68",
      question: "During lifting ops, safest communication uses?",
      options: [
    "Random shouting in practice",
    "Agreed signals/appointed banksman",
    "Walking under load in this context",
    "Ignoring the lift team",
  ],
  correctIndex: 1,
      explanation: "Controlled signals prevent dangerous misunderstandings."
    },
    {
      id: "comm-69",
      question: "Why give instructions to the right person?",
      options: [
    "So the wrong person acts",
    "Clear responsibility and action",
    "More paperwork in this context",
    "No one acts as standard",
  ],
  correctIndex: 1,
      explanation: "Correct recipient = correct action and accountability."
    },
    {
      id: "comm-70",
      question: "Best safety instruction wording is?",
      options: [
    "“Be careful” in practice",
    "Specific hazard + control",
    "Only mention once in this context",
    "Say it later as standard",
  ],
  correctIndex: 1,
      explanation: "Specific controls are actionable and measurable."
    },
  
    {
      id: "comm-71",
      question: "Before working in another trade’s area, you should?",
      options: [
    "Start without telling",
    "Coordinate access and sequence",
    "Remove their kit in this context",
    "Ignore rules as standard",
  ],
  correctIndex: 1,
      explanation: "Coordination prevents clashes, damage, and delays."
    },
    {
      id: "comm-72",
      question: "Why are as-built records valuable to clients?",
      options: [
    "Increase cost in practice",
    "Support maintenance and future changes",
    "Replace training in this context",
    "Reduce safety as standard",
  ],
  correctIndex: 1,
      explanation: "Accurate records help safe operation and future work."
    },
    {
      id: "comm-73",
      question: "Main weakness of verbal instructions only?",
      options: ["Always recorded", "Can be misheard/forgotten", "Never misunderstood", "Too traceable"],
      correctIndex: 1,
      explanation: "Without a record, errors are more likely."
    },
    {
      id: "comm-74",
      question: "If you make an error in a record, you should?",
      options: [
    "Hide the mistake in practice",
    "Correct it properly (traceably)",
    "Delete everything in this context",
    "Ignore it and continue",
  ],
  correctIndex: 1,
      explanation: "Records must remain honest and auditable."
    },
    {
      id: "comm-75",
      question: "Respect matters in diverse teams because it?",
      options: [
    "Creates conflict in practice",
    "Improves cooperation/understanding",
    "Avoids learning in this context",
    "Reduces standards as standard",
  ],
  correctIndex: 1,
      explanation: "Respect improves teamwork and reduces misunderstanding."
    },
    {
      id: "comm-76",
      question: "If a safety instruction seems wrong, you should?",
      options: [
    "Ignore it and continue",
    "Raise it with supervisor for clarification",
    "Follow it silently in this context",
    "Tell the client first",
  ],
  correctIndex: 1,
      explanation: "Escalate concerns through the correct route."
    },
    {
      id: "comm-77",
      question: "Purpose of sharing RAMS?",
      options: [
    "Reduce safety in practice",
    "Explain hazards and safe steps",
    "Avoid supervision in this context",
    "Replace tools as standard",
  ],
  correctIndex: 1,
      explanation: "RAMS informs people how to work safely."
    },
    {
      id: "comm-78",
      question: "Which behaviour shows poor listening?",
      options: [
    "Taking notes in practice",
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
    "Rumours in practice on site",
    "Client/company information",
    "Mistakes in this context",
    "Unsafe practice as standard",
  ],
  correctIndex: 1,
      explanation: "Share sensitive info only with those who need it."
    },
    {
      id: "comm-80",
      question: "Communicating quality requirements means?",
      options: [
    "Ignoring specs in practice",
    "Following standards/spec tolerances",
    "Using any materials in this context",
    "Avoiding inspections",
  ],
  correctIndex: 1,
      explanation: "Quality is defined by drawings, specs, and standards."
    },
  
    {
      id: "comm-81",
      question: "Why confirm a task is complete?",
      options: ["So nobody knows", "So others can proceed safely", "To avoid inspection", "To increase paperwork"],
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
    "So people arrive unprepared",
    "So permits/resources can be planned",
    "So safety drops in this context",
    "So trades clash as standard",
  ],
  correctIndex: 1,
      explanation: "Access affects permits, timing, and safe work methods."
    },
    {
      id: "comm-84",
      question: "Asked to do a task outside your competence. You?",
      options: [
    "Do it anyway alone in practice",
    "Tell supervisor and get guidance",
    "Hide the issue in this context",
    "Blame other people as standard",
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
    "How to skip PPE in practice",
    "Restrictions and safety controls",
    "Tool brands in this context",
    "Testing exemptions as standard",
  ],
  correctIndex: 1,
      explanation: "Permits set conditions and controls for high-risk work."
    },
    {
      id: "comm-87",
      question: "Best way to reduce critical communication errors?",
      options: [
    "Rely on memory in practice",
    "Use written confirmation + check-backs",
    "Avoid records in this context",
    "Assume others heard as standard",
  ],
  correctIndex: 1,
      explanation: "Check-backs and records reduce high-risk mistakes."
    },
    {
      id: "comm-88",
      question: "Why stay respectful under pressure?",
      options: [
    "To cause conflict in practice",
    "To keep teamwork and clear decisions",
    "To reduce compliance",
    "To increase mistakes",
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
    "To blame others in practice",
    "To track and close defects",
    "To avoid fixing in this context",
    "To reduce quality as standard",
  ],
  correctIndex: 1,
      explanation: "Snag lists make defects visible, owned, and corrected."
    },
  
    {
      id: "comm-91",
      question: "Before formal client handover you should?",
      options: [
    "Skip checks in practice",
    "Confirm completion + accurate info",
    "Hide docs in this context",
    "Remove labels as standard",
  ],
  correctIndex: 1,
      explanation: "Handover must be complete, accurate, and usable."
    },
    {
      id: "comm-92",
      question: "What most improves team communication?",
      options: [
    "Avoid updates in practice",
    "Regular briefings + clear roles",
    "Shouting in this context",
    "Ignoring feedback as standard",
  ],
  correctIndex: 1,
      explanation: "Briefings and roles reduce uncertainty and clashes."
    },
    {
      id: "comm-93",
      question: "Why is feedback important on site?",
      options: [
    "It delays work in practice",
    "It improves performance/understanding",
    "It replaces PPE in this context",
    "It removes responsibility",
  ],
  correctIndex: 1,
      explanation: "Feedback stops repeat errors and improves standards."
    },
    {
      id: "comm-94",
      question: "If test results affect others, you should?",
      options: [
    "Keep private always in practice",
    "Share/record to relevant people",
    "Destroy records in this context",
    "Tell client verbally only",
  ],
  correctIndex: 1,
      explanation: "Relevant results must be communicated for safe decisions."
    },
    {
      id: "comm-95",
      question: "Why report tool/equipment condition?",
      options: [
    "Hide faults in practice",
    "Prevent unsafe use and downtime",
    "Increase waste in this context",
    "Ignore maintenance as standard",
  ],
  correctIndex: 1,
      explanation: "Fault reporting prevents accidents and delays."
    },
    {
      id: "comm-96",
      question: "Professional communication mainly supports?",
      options: [
    "Arguments in practice",
    "Good relationships and standards",
    "Skipping rules in this context",
    "Avoiding records as standard",
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
      options: ["To delay work", "Evidence and traceability", "Replace drawings", "Increase confusion"],
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
      options: ["Reduce inspections", "Safe, accurate, efficient work", "Increase paperwork", "Avoid responsibility"],
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
      question: "A disadvantage of electronic technical information is that it?",
      options: [
        "Requires power or a device to access",
        "Is always out of date",
        "Cannot store large files",
        "Is illegal to use on site",
      ],
      correctIndex: 0,
      explanation: "Electronic data needs a device and power to view."
    },
    {
      id: "comm-103",
      legacyIds: ["iwse-003"],
      question: "An advantage of hard‑copy technical information is that it?",
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
      question: "A disadvantage of hard‑copy information is that it?",
      options: [
        "Can be bulky and harder to update",
        "Cannot be taken to site",
        "Is illegal on site in this context",
        "Never gets damaged as standard",
      ],
      correctIndex: 0,
      explanation: "Printed materials can be bulky and out of date."
    },
    {
      id: "comm-105",
      legacyIds: ["iwse-027"],
      question: "A disadvantage of hard‑copy technical info on site is that it?",
      options: [
        "Can become outdated and damaged",
        "Requires software updates",
        "Needs batteries in this context",
        "Cannot be shared as standard",
      ],
      correctIndex: 0,
      explanation: "Printed materials can be out of date or damaged on site."
    },
    {
      id: "comm-106",
      legacyIds: ["iwse-028"],
      question: "An advantage of electronic technical info on site is that it?",
      options: [
        "Can store large amounts of data in one place",
        "Never needs charging",
        "Cannot be lost in this context",
        "Cannot be corrupted as standard",
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
        "No need for backups on site",
        "Cannot be shared in this context",
        "Always offline as standard",
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
        "Never gets out of date",
        "Always up to date in this context",
        "Cannot be lost as standard",
      ],
      correctIndex: 0,
      explanation: "Hard copy can be read without devices or power."
    }
  ];
  
