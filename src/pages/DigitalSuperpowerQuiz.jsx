import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Sparkles, Zap, Users, BookOpen, Star } from "lucide-react";
import CONFIG from "../config";
import Footer from "../components/Footer";
import Logo from "../components/Logo";

const questions = [
  {
    id: 1,
    question: "When you imagine your ideal digital business, what excites you most?",
    options: [
      { text: "Creating content that helps and inspires people", value: "creator" },
      { text: "Building systems that run without me", value: "builder" },
      { text: "Teaching what I know and packaging my expertise", value: "educator" },
      { text: "Growing a loyal community of like-minded women", value: "connector" },
      { text: "Crafting a powerful personal brand that opens doors", value: "strategist" },
    ],
  },
  {
    id: 2,
    question: "Which of these feels most natural to you right now?",
    options: [
      { text: "Writing, filming, or sharing stories and ideas", value: "creator" },
      { text: "Automating, organizing, and optimizing workflows", value: "builder" },
      { text: "Explaining things clearly so others can learn fast", value: "educator" },
      { text: "Connecting people and building relationships", value: "connector" },
      { text: "Positioning, messaging, and standing out online", value: "strategist" },
    ],
  },
  {
    id: 3,
    question: "If you had a free afternoon to work on your business, you'd spend it:",
    options: [
      { text: "Batch creating content — posts, reels, carousels", value: "creator" },
      { text: "Setting up automations, tools, and workflows", value: "builder" },
      { text: "Writing a guide, course outline, or PDF playbook", value: "educator" },
      { text: "Showing up live, engaging, or hosting a session", value: "connector" },
      { text: "Researching competitors, refining my offer, storytelling", value: "strategist" },
    ],
  },
  {
    id: 4,
    question: "Which digital income stream sounds most aligned with you?",
    options: [
      { text: "Monetized content — affiliate links, brand deals, UGC", value: "creator" },
      { text: "Notion templates, tools, automated funnels, dashboards", value: "builder" },
      { text: "Online courses, workshops, PDF guides, coaching programs", value: "educator" },
      { text: "Memberships, group programs, paid communities", value: "connector" },
      { text: "Done-for-you services, consulting, digital strategy packages", value: "strategist" },
    ],
  },
  {
    id: 5,
    question: "Friends and colleagues would most likely describe you as:",
    options: [
      { text: "Creative, expressive, and always making something", value: "creator" },
      { text: "Organized, logical, and obsessed with efficiency", value: "builder" },
      { text: "Knowledgeable, patient, and great at breaking things down", value: "educator" },
      { text: "Warm, magnetic, and the one who brings people together", value: "connector" },
      { text: "Visionary, bold, and always ten steps ahead", value: "strategist" },
    ],
  },
  {
    id: 6,
    question: "What's your biggest strength from your pre-digital life?",
    options: [
      { text: "I've always had a creative eye and love for storytelling", value: "creator" },
      { text: "I built processes, solved problems, and made things run smoother", value: "builder" },
      { text: "I trained, mentored, or educated people in my field", value: "educator" },
      { text: "I led teams, built culture, or was the hub of my community", value: "connector" },
      { text: "I saw the big picture and knew how to position things for success", value: "strategist" },
    ],
  },
  {
    id: 7,
    question: "Which statement sounds most like you?",
    options: [
      { text: '"I want to create things that matter — content with real impact"', value: "creator" },
      { text: '"I want to build once and earn while I sleep"', value: "builder" },
      { text: '"My knowledge and experience deserve to be monetized"', value: "educator" },
      { text: '"I want to build something people belong to"', value: "connector" },
      { text: '"I want to be known as THE go-to expert in my space"', value: "strategist" },
    ],
  },
];

const results = {
  creator: {
    title: "The Content Creator",
    emoji: "✨",
    icon: Sparkles,
    tagline: "Your creativity IS your digital real estate.",
    description:
      "You have a natural gift for storytelling, visuals, and creating content that connects. Your superpower is your ability to turn ideas into scroll-stopping digital assets that attract an audience — and an income. Faceless content, affiliate marketing, brand partnerships, and UGC are all in your wheelhouse.",
    assets: [
      "Faceless YouTube / Reels content",
      "Affiliate marketing funnels",
      "Pinterest SEO content",
      "UGC brand partnerships",
      "Email newsletter",
    ],
    nextStep:
      "Start by identifying your niche content pillars and batch-creating 30 days of content. Your content is your currency.",
    color: "#F18B25",
  },
  builder: {
    title: "The Systems Builder",
    emoji: "⚡",
    icon: Zap,
    tagline: "You don't just work smart — you build systems that work FOR you.",
    description:
      "You think in automations, frameworks, and repeatable processes. Your superpower is turning complexity into elegance — Notion templates, automated funnels, digital dashboards, and tools that solve real problems. You build digital products that save people time, and people will pay premium prices for that.",
    assets: [
      "Automated lead funnels",
      "Notion templates and dashboards",
      "SaaS-adjacent workflows",
      "Content repurposing engines",
      "Premium process toolkits",
    ],
    nextStep:
      "Map your highest-value workflow and turn it into a sellable, repeatable system. Then start selling the transformation, not the task.",
    color: "#52C41A",
  },
  educator: {
    title: "The Expertise Educator",
    emoji: "📚",
    icon: BookOpen,
    tagline: "Your experience becomes the shortcut people pay for.",
    description:
      "You've spent decades accumulating expertise that others desperately need. Your superpower is transforming lived experience into structured learning — courses, workshops, playbooks, and coaching programs that shortcut other people's journeys.",
    assets: [
      "Mini-course funnels",
      "Coaching container templates",
      "Paid workshop sequels",
      "Membership lesson libraries",
      "Signature programs",
    ],
    nextStep:
      "Pick one small, high-impact teaching topic and create a short lead magnet that proves your model. Then invite paid learners to go deeper.",
    color: "#3366FF",
  },
  connector: {
    title: "The Community Connector",
    emoji: "💫",
    icon: Users,
    tagline: "You build belonging, momentum, and repeat business.",
    description:
      "People are drawn to you. You create belonging, safety, and momentum wherever you show up. Your superpower is building communities — Facebook groups, memberships, group coaching containers — where people come for information and stay for connection.",
    assets: [
      "Paid memberships",
      "Group coaching programs",
      "Community-led launches",
      "Membership content roadmaps",
      "Live event funnels",
    ],
    nextStep:
      "Choose a small group format, set a clear outcome, and invite the people who already trust you to join the first cohort.",
    color: "#FF6B6B",
  },
  strategist: {
    title: "The Strategy Specialist",
    emoji: "⭐",
    icon: Star,
    tagline: "You see the gap between the current state and the next-level opportunity.",
    description:
      "You think in positioning, messaging, and market differentiation. Your superpower is seeing the gap between where someone is and where they could be — and building the bridge. You're wired for consulting, done-for-you services, and brand strategy work that commands premium prices.",
    assets: [
      "Signature consulting offers",
      "Premium service packages",
      "Positioning frameworks",
      "Brand storytelling systems",
      "High-ticket launch plans",
    ],
    nextStep:
      "Start by clarifying the outcome you deliver, then package it in a premium offer for the clients who need it most.",
    color: "#A259FF",
  },
};

const calculateResult = (answers) => {
  const counts = Object.values(answers).reduce((acc, value) => {
    if (!value) return acc;
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});

  const entries = Object.entries(counts);
  if (!entries.length) return "creator";

  entries.sort((a, b) => b[1] - a[1]);
  return entries[0][0];
};

const DigitalSuperpowerQuiz = () => {
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [resultKey, setResultKey] = useState(null);
  const [showInstructions, setShowInstructions] = useState(true);

  const question = useMemo(
    () => questions.find((item) => item.id === currentQuestion),
    [currentQuestion],
  );

  useEffect(() => {
    document.title = "Digital Superpower Quiz | DigitallyDefined";
  }, []);

  const handleAnswer = (value) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion]: value }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    const key = calculateResult(answers);
    setResultKey(key);
    setSubmitted(true);
    setShowInstructions(false);
    try {
      const personaResults = {
        builder: {
          title: "The Systems Builder",
          description: "You think in automations, frameworks, and repeatable processes.",
          superpowerDescription: "You think in automations, frameworks, and repeatable processes.",
          assets: ["Automated lead funnels", "Notion templates and dashboards", "SaaS-adjacent workflows", "Content repurposing engines", "Premium process toolkits"],
          nextStep: "Map your highest-value workflow and turn it into a sellable, repeatable system.",
        },
        creator: {
          title: "The Content Creator",
          description: "You have a natural gift for storytelling, visuals, and creating content.",
          superpowerDescription: "You have a natural gift for storytelling, visuals, and creating content.",
          assets: ["Faceless YouTube / Reels content", "Affiliate marketing funnels", "Pinterest SEO content", "UGC brand partnerships", "Email newsletter"],
          nextStep: "Start by identifying your niche content pillars and batch-creating 30 days of content.",
        },
        educator: {
          title: "The Expertise Educator",
          description: "You've spent decades accumulating expertise that others desperately need.",
          superpowerDescription: "You've spent decades accumulating expertise that others desperately need.",
          assets: ["Mini-course funnels", "Coaching container templates", "Paid workshop sequels", "Membership lesson libraries", "Signature programs"],
          nextStep: "Pick one small, high-impact teaching topic and create a short lead magnet that proves your model.",
        },
        connector: {
          title: "The Community Connector",
          description: "People are drawn to you. You create belonging, safety, and momentum.",
          superpowerDescription: "People are drawn to you. You create belonging, safety, and momentum.",
          assets: ["Paid memberships", "Group coaching programs", "Community-led launches", "Membership content roadmaps", "Live event funnels"],
          nextStep: "Choose a small group format, set a clear outcome, and invite the people who already trust you to join the first cohort.",
        },
        strategist: {
          title: "The Strategy Specialist",
          description: "You think in positioning, messaging, and market differentiation.",
          superpowerDescription: "You think in positioning, messaging, and market differentiation.",
          assets: ["Signature consulting offers", "Premium service packages", "Positioning frameworks", "Brand storytelling systems", "High-ticket launch plans"],
          nextStep: "Start by clarifying the outcome you deliver, then package it in a premium offer for the clients who need it most.",
        },
      };
      const persona = personaResults[key] || personaResults.creator;
      const roadmap = {
        steps: persona.assets,
        estimatedTime: "30-60 days",
      };
      const quizResult = {
        userId: "",
        name: "",
        email: "",
        superpower: key,
        superpowerType: key,
        personaTitle: persona.title,
        answers,
        confidence: 1,
        roadmap,
        ...persona,
      };
      localStorage.setItem("dd-quiz-results", JSON.stringify(quizResult));
    } catch {
      /* localStorage unavailable — IntelligencePage will redirect to quiz anyway */
    }
  };

  const handleReset = () => {
    setAnswers({});
    setCurrentQuestion(1);
    setSubmitted(false);
    setResultKey(null);
    setShowInstructions(true);
  };

  const handleGoToDashboard = () => {
    if (typeof window !== "undefined") {
      window.location.href = CONFIG.routes.dashboard;
    }
  };

  const result = resultKey ? results[resultKey] : null;

  return (
    <div className="dd-page">
      <header className="dd-page__hero">
        <div className="dd-page__hero-inner">
          <div className="dd-page__hero-meta">
            <Logo as="div" style={{ fontSize: "clamp(1.2rem, 2vw, 1.5rem)" }} />
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <a className="dd-button dd-button--secondary" href={CONFIG.routes.landing}>
                Home
              </a>
              <a className="dd-button dd-button--secondary" href={CONFIG.routes.dashboard}>
                Dashboard
              </a>
            </div>
          </div>

          <section className="dd-card dd-card--spaced">
            <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "1.25rem" }}>{result ? result.emoji : "✨"}</span>
              <div>
                <div
                  className="dd-text dd-text--muted"
                  style={{ marginBottom: "8px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", fontSize: "0.85rem" }}
                >
                  Digital Superpower Quiz
                </div>
                <h1 className="dd-heading dd-heading--large">Discover the way you win online.</h1>
              </div>
            </div>
            <p className="dd-text dd-text--muted" style={{ maxWidth: "780px" }}>
              Answer 7 quick questions to uncover your digital superpower and get a clear next step for the business model that fits your experience, personality, and goals.
            </p>
          </section>
        </div>
      </header>

      <main>
        <div className="dd-page__container">
          {showInstructions && (
            <section className="dd-card dd-card--spaced">
              <h2 className="dd-heading dd-heading--medium">How it works</h2>
              <p className="dd-text dd-text--muted" style={{ marginTop: "16px" }}>
                Choose the option that feels most true for you in the moment. This quiz is about energy and focus, not perfection.
              </p>
            </section>
          )}

          {!submitted ? (
            <section className="dd-card dd-card--spaced">
              <div className="dd-page__section-header">
                <div>
                  <p
                    className="dd-text dd-text--muted"
                    style={{ margin: 0, textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700, fontSize: "0.85rem" }}
                  >
                    Question {currentQuestion} of {questions.length}
                  </p>
                  <h2 className="dd-heading dd-heading--medium" style={{ marginTop: "12px" }}>{question.question}</h2>
                </div>
                <div className="dd-text" style={{ fontWeight: 700, color: "var(--brand-accent-aqua)" }}>
                  {answers[currentQuestion] ? "Answer selected" : "Choose an answer"}
                </div>
              </div>

              <div className="dd-grid" style={{ marginTop: "28px" }}>
                {question.options.map((option, index) => (
                  <button
                    key={`${question.id}-${index}`}
                    type="button"
                    onClick={() => handleAnswer(option.value)}
                    className={`dd-button dd-button--secondary ${answers[currentQuestion] === option.value ? "dd-button--selected" : ""}`}
                    style={{ justifyContent: "flex-start" }}
                  >
                    <span style={{ fontWeight: 700, marginRight: "10px" }}>
                      {answers[currentQuestion] === option.value ? "●" : "○"}
                    </span>
                    {option.text}
                  </button>
                ))}
              </div>

              <div className="dd-page__actions" style={{ marginTop: "28px" }}>
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={currentQuestion === 1}
                  className="dd-button dd-button--secondary"
                >
                  <ArrowLeft size={16} /> Back
                </button>
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  {currentQuestion < questions.length ? (
                    <button type="button" onClick={handleNext} className="dd-button dd-button--primary">
                      Next <ArrowRight size={16} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={Object.keys(answers).length < questions.length}
                      className="dd-button dd-button--primary"
                    >
                      See my superpower <ArrowRight size={16} />
                    </button>
                  )}
                </div>
              </div>
            </section>
          ) : (
            <section className="dd-card dd-card--spaced">
              <div className="dd-grid" style={{ gap: "18px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "1.5rem" }}>{result.emoji}</span>
                  <div>
                    <div
                      className="dd-text dd-text--muted"
                      style={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", fontSize: "0.85rem" }}
                    >
                      Your digital superpower
                    </div>
                    <h2 className="dd-heading dd-heading--large" style={{ marginTop: "8px" }}>{result.title}</h2>
                  </div>
                </div>

                <p className="dd-text dd-text--muted" style={{ maxWidth: "720px" }}>{result.tagline}</p>
                <p className="dd-text">{result.description}</p>

                <div className="dd-grid" style={{ gap: "12px" }}>
                  <h3 className="dd-heading" style={{ fontSize: "1.25rem" }}>Digital assets to build first</h3>
                  <div className="dd-grid dd-grid--assets">
                    {result.assets.map((asset) => (
                      <div key={asset} className="dd-card" style={{ padding: "14px" }}>
                        {asset}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="dd-heading" style={{ fontSize: "1.25rem", margin: "0 0 10px" }}>Best next step</h3>
                  <p className="dd-text">{result.nextStep}</p>
                </div>

                <div className="dd-page__footer-actions" style={{ gap: "12px" }}>
                  <button type="button" onClick={handleReset} className="dd-button dd-button--secondary">
                    Retake the quiz
                  </button>
                  <button type="button" onClick={handleGoToDashboard} className="dd-button dd-button--primary">
                    Go to dashboard <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer
        colors={{ text: "var(--brand-text-primary)", textMuted: "var(--brand-text-muted)" }}
        containerStyle={{ maxWidth: "var(--brand-container-max-width)", margin: "0 auto" }}
        footerStyle={{ padding: "32px 24px", backgroundColor: "var(--brand-panel)" }}
        routes={CONFIG.routes}
        landing={CONFIG.landing}
        contact={CONFIG.contact}
        year={new Date().getFullYear()}
        showDashboardLink={false}
      />
    </div>
  );
};

export default DigitalSuperpowerQuiz;
