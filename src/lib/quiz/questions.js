// src/lib/quiz/questions.js — Digital Superpower Quiz questions
// Each answer maps to one of five persona archetypes: builder, creator, educator, strategist, connector.

export const QUESTIONS = [
  {
    key: 'q_stage',
    label: 'Where are you currently on your income journey?',
    subtitle: 'This helps us tailor your roadmap to your current bandwidth and experience.',
    options: [
      { value: 'builder',    label: 'Working a 9-to-5, looking for automated assets that run without 40 extra hours a week' },
      { value: 'creator',    label: 'Pivoting out of corporate, ready to turn decades of domain expertise into digital assets' },
      { value: 'educator',   label: 'Already freelancing or consulting, wanting to move from trading time to digital products' },
      { value: 'strategist', label: 'Running an existing business, looking for high-margin AI leverage and better systems' },
      { value: 'connector',  label: 'In transition or semi-retired, seeking location-independent freedom and autonomy' },
    ]
  },
  {
    key: 'q_goal',
    label: 'What type of digital income asset do you want to learn & build first?',
    subtitle: 'We focus strictly on faceless, privacy-first models.',
    options: [
      { value: 'builder',    label: 'Faceless digital real estate (templates, rank-and-rent, micro-tools)' },
      { value: 'creator',    label: 'Automated content & newsletter engines that generate leads on autopilot' },
      { value: 'educator',   label: 'Checkbooks, workbooks, Notion templates, and automated email courses' },
      { value: 'strategist', label: 'Decision frameworks, offer architecture, and niche profitability scorecards' },
      { value: 'connector',  label: 'Community ecosystems, partner networks, and affiliate recommendation loops' },
    ]
  },
  {
    key: 'q_obstacle',
    label: 'What is your single biggest hurdle right now?',
    subtitle: 'We identify your bottleneck so your roadmap solves it immediately.',
    options: [
      { value: 'builder',    label: 'Tech overwhelm & tool fatigue — too many options, not enough simple execution' },
      { value: 'creator',    label: 'Reluctance to be on camera or turn my personal life into public social content' },
      { value: 'educator',   label: 'Knowing how to structure my knowledge into a digital product people actually pay for' },
      { value: 'strategist', label: 'Lack of time & energy after juggling work, family, and daily responsibilities' },
      { value: 'connector',  label: 'Finding the right niche and audience without wasting months on guesswork' },
    ]
  },
  {
    key: 'q1',
    label: 'When you learn a new tool, what do you do first?',
    options: [
      { value: 'builder',    label: 'Open it and start building something small' },
      { value: 'educator',   label: 'Look for tutorials or guides before touching it' },
      { value: 'strategist', label: 'Check whether it fits a bigger workflow' },
      { value: 'creator',    label: 'Think about how it could shape my content' },
      { value: 'connector',  label: 'See if I can use it to help someone else' },
    ]
  },
  {
    key: 'q2',
    label: 'Which phrase sounds like a good Saturday?',
    options: [
      { value: 'builder',    label: 'Tweaking a website or automation until it works' },
      { value: 'educator',   label: 'Reading a deep-dive article or course module' },
      { value: 'strategist', label: "Mapping next quarter's priorities on paper" },
      { value: 'creator',    label: 'Writing, filming, or designing in private' },
      { value: 'connector',  label: 'Checking in on my group or mentoring someone' },
    ]
  },
  {
    key: 'q3',
    label: 'Someone offers you a new project. You ask:',
    options: [
      { value: 'strategist', label: 'What is the outcome and timeline?' },
      { value: 'builder',    label: 'What tools and assets already exist?' },
      { value: 'educator',   label: 'Who else has done this and what can I learn?' },
      { value: 'creator',    label: 'Who is the audience and what will they feel?' },
      { value: 'connector',  label: 'Who else needs to be in the room?' },
    ]
  },
  {
    key: 'q4',
    label: 'Your ideal income model is:',
    options: [
      { value: 'builder',    label: 'Owned assets that generate leads or rent' },
      { value: 'educator',   label: 'Courses, templates, or teaching systems' },
      { value: 'strategist', label: 'Advisory or high-leverage planning work' },
      { value: 'creator',    label: 'Content-driven products with automated delivery' },
      { value: 'connector',  label: 'Community, referrals, or partner offers' },
    ]
  },
  {
    key: 'q5',
    label: 'Pick a risk tolerance statement:',
    options: [
      { value: 'strategist', label: 'I prefer planning over betting' },
      { value: 'builder',    label: 'I will test small and scale what works' },
      { value: 'educator',   label: 'I want proof before I commit' },
      { value: 'creator',    label: 'I care more about autonomy than predictability' },
      { value: 'connector',  label: 'I move forward when I know people are with me' },
    ]
  },
  {
    key: 'q7',
    label: 'What does "success" actually mean to you?',
    options: [
      { value: 'builder',    label: 'Assets that work while I am offline' },
      { value: 'educator',   label: 'Clarity I can pass forward to others' },
      { value: 'strategist', label: 'A system that makes decisions easier' },
      { value: 'creator',    label: 'Work that feels like mine, not performative' },
      { value: 'connector',  label: 'A network that lifts everyone' },
    ]
  },
];

export const PERSONA_VALUES = ['builder', 'educator', 'strategist', 'creator', 'connector'];
