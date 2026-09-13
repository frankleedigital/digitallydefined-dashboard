const CONFIG = {
  brand: {
    logoImage: "",
    logoText: "DigitallyDefined",
    nameLight: "Digitally",
    nameBold: "Defined",
    fullName: "DigitallyDefined",
    tagline: "The Reputation OS for Women Who Mean Business.",
    version: "2.0",
  },

  aesthetic: {
    philosophy: "Soft Brutalism",
    tokens: {
      colors: {
        background: "#FFFCF9",
        card: "#FFFFFF",
        text: {
          primary: "#111111",
          dark: "#111111",
        },
        accents: {
          orange: "#F18B25",
          aquaBlue: "#47B7D4",
          darkRed: "#8B1A0A",
        },
      },
      typography: {
        headings: {
          font: "Inter",
          weight: 800,
          style: "normal",
          transform: "none",
          letterSpacing: "-0.03em",
        },
        body: {
          font: "DM Sans",
          weights: [400, 500, 700],
          lineHeight: "1.6",
        },
      },
      geometry: {
        borderWidth: "1px",
        borderColor: "#111111",
        borderRadius: "0px",
        shadows: "none",
      },
      layout: {
        spacing: "24px",
        gridGap: "32px",
        containerMaxWidth: "1100px",
      },
    },
    rules: [
      "NEVER use border-radius higher than 0px.",
      "NEVER use box-shadows or drop-shadows.",
      "ALL cards must have a 1px solid black border (#111111).",
      "Headings must always use Inter.",
      "Primary buttons use Orange (#F18B25), Secondary use Aqua Blue (#47B7D4).",
      "Background must remain Off-White/Cream (#FFFCF9) for maximum contrast.",
      "Logo must always appear as one word: DigitallyDefined.",
      "Logo must use a 1px thin black frame with Digitally in black and Defined in orange italic.",
    ],
  },

  colors: {
    background: "#FFFCF9",
    backgroundAlt: "#F4EFE8",
    dark: "#111111",
    primary: "#47B7D4",
    accent: "#F18B25",
    text: "#111111",
    textMuted: "#5F5F5F",
    border: "#111111",
    surface: "#FFFFFF",
    bone: "#FFF7ED",
    darkBorder: "#333333",
    success: "#16A34A",
    successTint: "#DCFCE7",
    info: "#47B7D4",
    infoTint: "rgba(71, 183, 212, 0.10)",
    warning: "#F18B25",
    warningTint: "rgba(241, 139, 37, 0.10)",
    danger: "#8B1A0A",
    dangerTint: "#FEF2F2",
    panel: "#FFFAF5",
    featureSurface: "#1F2937",
    gold: "#EAB308",
    hotTint: "#FED7AA",
    ghostText: "rgba(17, 17, 17, 0.12)",
    overlayLight: "rgba(255, 252, 249, 0.92)",
    boneMuted: "rgba(255, 247, 237, 0.82)",
    boneSoft: "rgba(255, 247, 237, 0.80)",
    boneFaint: "rgba(255, 247, 237, 0.68)",
    whiteBorderSoft: "rgba(255,255,255,0.3)",
    onAccent: "#111111",
  },

  metrics: {
    assetValue: "$48,000",
    systemHealth: "100%",
    sentimentIndex: "Positive",
    communityCount: "1,284",
    reviewConversionRate: "24.8%",
    activeLeads: "1,284",
  },

  community: {
    platformName: "DigitallyDefined Collective",
    platformUrl: "https://digitallydefined.online",
    members: [
      {
        name: "Rena Walker",
        date: "Mar 28, 2026",
        status: "Active",
      },
      {
        name: "Angela Brooks",
        date: "Mar 31, 2026",
        status: "Onboarding",
      },
      {
        name: "Tasha Monroe",
        date: "Apr 02, 2026",
        status: "Subscribed",
      },
      {
        name: "Nicole James",
        date: "Apr 04, 2026",
        status: "Engaged",
      },
    ],
  },

  intel: {
    campaigns: [
      {
        name: "Authority Launch Sequence",
        conversion: 0.248,
      },
      {
        name: "Evergreen Reputation Funnel",
        conversion: 0.191,
      },
    ],
  },

  contact: {
    email: "francesca@digitallydefined.online",
    website: "https://digitallydefined.online",
    gumroadUrl: "https://francescaonline.gumroad.com/l/digital-business-os",
    fullCalculatorUrl: "https://francescaonline.gumroad.com/l/digital-business-os",
    facebookCommunityUrl: "https://www.facebook.com/groups/digitallydefind",
  },

  owner: {
    title: "Certified Digital Marketer & Keyword Researcher",
    email: "francesca@digitallydefined.online",
  },

  integrations: {
    slackWebhookUrl: "YOUR_SLACK_WEBHOOK",  // "https://hooks.slack.com/services/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""
    gumloopFlowUrl: "YOUR_GUMLOOP_URL",     // Replace with real URL or ""
    facebookGroupId: "YOUR_GROUP_ID",       // Add this if using Facebook
  },

  routes: {
    landing: "/",
    dashboard: "/dashboard",
    quiz: "/quiz",
    dashboardAliases: ["/command", "/internal", "/app"],
    thankYouCalculator: "/thank-you-calculator",
  },

  seo: {
    title: "DigitallyDefined | Reputation & Revenue Engine",
    description:
      "DigitallyDefined is an automated reputation management and digital marketing operating system for Gen X women solopreneurs, creators, and marketers.",
  },

  dashboard: {
    tabs: [
      {
        id: "dashboard",
        label: "COMMAND",
      },
      {
        id: "reputation",
        label: "REPUTATION",
      },
      {
        id: "intel",
        label: "INTEL",
      },
      {
        id: "growth",
        label: "GROWTH",
      },
      {
        id: "brain",
        label: "THE BRAIN",
      },
      {
        id: "automations",
        label: "AUTOMATIONS",
      },
      {
        id: "integrations",
        label: "INTEGRATIONS",
      },
      {
        id: "notion",
        label: "NOTION",
      },
      {
        id: "antigravity",
        label: "ARCHITECT",
      },
    ],
    assistantModel: import.meta.env.VITE_DASHBOARD_ASSISTANT_MODEL || "gemini-2.5-flash",
    integrationsTitle: "Integrations",
    integrationsCta: "Connect Source",
    integrationsDescription: "Connect your growth sources so the dashboard and assistant can read live data.",
    integrations: {
      googleAnalytics: {
        title: "Google Analytics",
        description: "Website traffic, goals, and revenue signals.",
        connectLabel: "Connect Google Analytics",
        connectedLabel: "Google Analytics connected",
      },
      social: {
        title: "Social Pages",
        description: "Followers, engagement, and top content.",
        connectLabel: "Connect Social",
        connectedLabel: "Social connected",
      },
      email: {
        title: "Email List",
        description: "Subscribers, open rates, and campaign performance.",
        connectLabel: "Connect Email",
        connectedLabel: "Email connected",
      },
      community: {
        title: "Community",
        description: "Members, activity, and growth.",
        connectLabel: "Connect Community",
        connectedLabel: "Community connected",
      },
    },
    settingsTitle: "Configuration",
    settingsDescription: "Manage assistant behavior and access keys.",
    openRouterLabel: "OpenRouter Key",
    openRouterPlaceholder: "sk-...",
    saveKeysLabel: "Save Settings",
  },

  thankYouCalculator: {
    title: "Thank You for Your Purchase",
    subtitle: "You now have full access to the 10x ROI Calculator",
    ctaLabel: "Access Your Download on Gumroad",
    secondaryCtaLabel: "Visit DigitallyDefined",
    features: [
      {
        title: "Full Calculator Access",
        description: "Unlock all advanced fields including customer retention, reputation lift, and annualized projections.",
      },
      {
        title: "Business Validation",
        description: "Validate your digital business decisions with real data before investing in campaigns.",
      },
      {
        title: "Lifetime Updates",
        description: "Get all future calculator improvements and new features at no additional cost.",
      },
    ],
    emailNote: "Questions? Email us at",
  },

  landing: {
    navCta: "LAUNCH DASHBOARD →",
    heroAudience: "BUILT FOR GEN X WOMEN",
    heroTitleLineOne: "YOU BUILT THE SKILLS.",
    heroTitleLineTwo: "NOW BUILD THE EMPIRE.",
    heroSubheadline:
      "DigitallyDefined is the automated reputation and marketing OS for Gen X women solopreneurs, creators, and marketers who are ready to turn trust into traction.",
    heroPrimaryCta: "ACCESS THE DASHBOARD",
    heroSecondaryCta: "SEE HOW IT WORKS ↓",
    statusSystemHealth: "SYSTEM HEALTH",
    statusSentiment: "SENTIMENT",
    statusAssetValue: "ASSET VALUE",
    statusCommunity: "COMMUNITY",
    realTalkEyebrow: "REAL TALK",
    realTalkTitleLineOne: "WE WEREN'T HANDED A ROADMAP.",
    realTalkTitleLineTwo: "WE'RE WRITING IT NOW.",
    realTalkBody:
      "Gen X women built careers, families, and businesses without hand-holding, endless tutorials, or a blueprint. Now we're claiming our space in the digital economy with systems that finally move at our speed.",
    realTalkProblems: [
      {
        icon: "01",
        text: "You know your value — but your digital presence doesn't reflect it yet.",
      },
      {
        icon: "02",
        text: "Reviews, DMs, and community messages are slipping through the cracks.",
      },
      {
        icon: "03",
        text: "Your brand health, sentiment, and asset value live in 10 different tools.",
      },
      {
        icon: "04",
        text: "You're leaving trust — and real money — on the table every single day.",
      },
    ],
    featuresAnchor: "free-calculator",
    featuresEyebrow: "THE SOLUTION",
    featuresTitleLineOne: "ONE COMMAND CENTER.",
    featuresTitleLineTwo: "YOUR RULES.",
    features: [
      {
        tag: "REPUTATION",
        title: "Reputation Command",
        description:
          "See reviews, sentiment shifts, and response drafts in one place so your trust signals never lag behind your value.",
        tone: "primary",
      },
      {
        tag: "INTEL",
        title: "Strategic Intel",
        description:
          "Track campaign conversion, market positioning, and decision-ready insights without opening ten tabs before breakfast.",
        tone: "accent",
      },
      {
        tag: "COMMUNITY",
        title: "Live Community Feed",
        description:
          "Watch new members, messages, and momentum in real time so no opportunity quietly slips past you.",
        tone: "primary",
      },
      {
        tag: "THE BRAIN",
        title: "The Brain (AI Layer)",
        description:
          "Let the AI layer surface priorities, draft responses, and keep your operations moving even when you are off the clock.",
        tone: "accent",
      },
      {
        tag: "COMMAND",
        title: "Command Center",
        description:
          "Get one place to monitor brand health, lead flow, and key business indicators with clarity instead of chaos.",
        tone: "primary",
      },
      {
        tag: "KEYS",
        title: "Keys & Integrations",
        description:
          "Connect your stack, secure your access, and keep the entire engine running from one controlled environment.",
        tone: "accent",
      },
    ],
    metricsStrip: {
      assetValue: "Asset Value",
      systemHealth: "System Uptime",
      reviewConversionRate: "Review Conversion Rate",
      sentimentIndex: "Sentiment Index",
    },
    audienceEyebrow: "WHO IT'S FOR",
    audienceTitleLineOne: "FOR THE WOMAN WHO IS",
    audienceTitleLineTwo: "DONE WAITING.",
    audienceRoles: [
      {
        title: "THE SOLOPRENEUR",
        description:
          "You wear every hat, so your systems need to work as hard as you do without constant babysitting.",
      },
      {
        title: "THE CREATOR",
        description:
          "Your visibility matters, and you need a reputation engine that protects the audience you worked to earn.",
      },
      {
        title: "THE MARKETER",
        description:
          "You need clean signals, sharper campaign intel, and one place to guide decisions with confidence.",
      },
      {
        title: "THE COACH",
        description:
          "Trust is the business model, and this system helps you measure, protect, and grow it intentionally.",
      },
      {
        title: "THE REINVENTOR",
        description:
          "You are building your next chapter, and your digital footprint should look like the future you are claiming.",
      },
      {
        title: "THE NOMAD",
        description:
          "When your work moves with you, your reputation, marketing, and community systems need to stay always on.",
      },
    ],
    howItWorksAnchor: "how-it-works",
    howItWorksEyebrow: "HOW IT WORKS",
    howItWorksTitleLineOne: "THREE STEPS.",
    howItWorksTitleLineTwo: "TOTAL CLARITY.",
    steps: [
      {
        number: "01",
        title: "CONNECT YOUR STACK",
        description:
          "Plug in your reviews, campaigns, and community channels so the system can see the full picture.",
      },
      {
        number: "02",
        title: "ACTIVATE YOUR AUTOMATIONS",
        description:
          "Turn on the workflows that watch sentiment, surface priorities, and reduce the manual drag on growth.",
      },
      {
        number: "03",
        title: "COMMAND YOUR GROWTH",
        description:
          "Use one command center to make sharper moves, protect your reputation, and scale with more control.",
      },
    ],
    manifestoQuote:
      "Gen X women didn't wait for permission then. We're not waiting for it now.",
    manifestoAttribution: "— DigitallyDefined",
    finalCtaEyebrow: "YOUR MOVE",
    finalCtaTitle: "STOP MANAGING BY GUT. START COMMANDING WITH DATA.",
    finalCtaBody:
      "The dashboard shows what is happening. The system helps decide what to do next. That is the difference between reacting and building an empire.",
    finalCtaButton: "ACCESS THE DASHBOARD →",
    metaSeparator: " / ",
    finalCtaSmallPrintSuffix: "ALWAYS ON · ALWAYS WORKING",
    footerDashboard: "Dashboard",
    footerFeatures: "Free Calculator",
    footerContact: "Contact",
    footerRights: "All rights reserved.",
    footerCopyrightPrefix: "(c)",
  },
};

export default CONFIG;