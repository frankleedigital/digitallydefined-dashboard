// src/pages/LegacyOSPage.jsx
// Native LegacyOS Flagship Bundle Landing & Sales Page for legacyos.digitallydefined.store

import React from "react";

const GUMROAD_BUY_URL = "https://shop.digitallydefined.store/l/legacy_os_bundle";
const BACKUP_BUY_URL = "https://shop.digitallydefined.store/l/legacy_os_bundle";

const styles = {
  wrap: {
    backgroundColor: "#FFFCF9",
    color: "#111111",
    fontFamily: '"DM Sans", sans-serif',
    fontSize: "16px",
    lineHeight: 1.65,
    minHeight: "100vh",
    width: "100%",
  },
  container: {
    maxWidth: "1140px",
    margin: "0 auto",
    padding: "0 20px",
  },
  topbar: {
    borderBottom: "2px solid #111111",
    padding: "18px 0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    flexWrap: "wrap",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  brandMark: {
    width: "38px",
    height: "38px",
    backgroundColor: "#111111",
    color: "#FFFCF9",
    display: "grid",
    placeItems: "center",
    fontWeight: 900,
    fontSize: "15px",
    fontFamily: '"Inter", sans-serif',
  },
  brandTitle: {
    fontWeight: 900,
    fontSize: "18px",
    color: "#111111",
    letterSpacing: "-0.02em",
    fontFamily: '"Inter", sans-serif',
    textTransform: "uppercase",
  },
  brandTitleSpan: {
    color: "#F18B25",
    fontStyle: "italic",
  },
  brandSub: {
    fontSize: "10px",
    textTransform: "uppercase",
    letterSpacing: "0.18em",
    color: "#555555",
    marginTop: "2px",
    fontWeight: 700,
  },
  topNote: {
    fontSize: "11px",
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    fontWeight: 700,
    color: "#111111",
    border: "2px solid #111111",
    padding: "8px 12px",
    backgroundColor: "#FFFFFF",
    fontFamily: '"Inter", sans-serif',
  },
  hero: {
    padding: "56px 0 48px",
    borderBottom: "2px solid #111111",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "40px",
    alignItems: "start",
  },
  eyebrow: {
    display: "inline-block",
    fontSize: "10px",
    fontWeight: 900,
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    color: "#F18B25",
    border: "1px solid #111111",
    backgroundColor: "#FFFFFF",
    padding: "6px 10px",
    marginBottom: "18px",
    fontFamily: '"Inter", sans-serif',
  },
  h1: {
    fontSize: "clamp(38px, 5.5vw, 68px)",
    lineHeight: 0.98,
    letterSpacing: "-0.04em",
    fontWeight: 900,
    color: "#111111",
    marginBottom: "18px",
    fontFamily: '"Inter", sans-serif',
    textTransform: "uppercase",
  },
  heroCopy: {
    fontSize: "18px",
    color: "#4B5563",
    maxWidth: "560px",
    marginBottom: "28px",
    lineHeight: 1.6,
  },
  heroBadges: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginBottom: "30px",
  },
  badge: {
    fontFamily: '"Inter", sans-serif',
    fontWeight: 700,
    fontSize: "11px",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    border: "2px solid #111111",
    padding: "8px 12px",
    backgroundColor: "#FFFFFF",
    color: "#111111",
  },
  badgeOrange: {
    backgroundColor: "#F18B25",
    color: "#111111",
    border: "2px solid #111111",
    fontFamily: '"Inter", sans-serif',
    fontWeight: 900,
    fontSize: "11px",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    padding: "8px 12px",
  },
  badgeBlue: {
    backgroundColor: "#47B7D4",
    color: "#111111",
    border: "2px solid #111111",
    fontFamily: '"Inter", sans-serif',
    fontWeight: 700,
    fontSize: "11px",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    padding: "8px 12px",
  },
  badgeGreen: {
    backgroundColor: "#16A34A",
    color: "#FFFFFF",
    border: "2px solid #111111",
    fontFamily: '"Inter", sans-serif',
    fontWeight: 700,
    fontSize: "11px",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    padding: "8px 12px",
  },
  btnPrimary: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    border: "2px solid #111111",
    backgroundColor: "#F18B25",
    color: "#111111",
    fontWeight: 900,
    fontSize: "14px",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    padding: "18px 24px",
    textDecoration: "none",
    cursor: "pointer",
    fontFamily: '"Inter", sans-serif',
    marginRight: "12px",
    marginBottom: "12px",
  },
  btnSecondary: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    border: "2px solid #111111",
    backgroundColor: "#FFFFFF",
    color: "#111111",
    fontWeight: 900,
    fontSize: "14px",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    padding: "18px 24px",
    textDecoration: "none",
    cursor: "pointer",
    fontFamily: '"Inter", sans-serif',
    marginBottom: "12px",
  },
  heroMeta: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: "14px",
  },
  metaCard: {
    border: "2px solid #111111",
    backgroundColor: "#FFFFFF",
    padding: "18px",
    minHeight: "120px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    gap: "14px",
  },
  metaValue: {
    fontSize: "30px",
    lineHeight: 1,
    fontWeight: 900,
    color: "#111111",
    letterSpacing: "-0.02em",
    fontFamily: '"Inter", sans-serif',
  },
  metaLabel: {
    fontSize: "10px",
    textTransform: "uppercase",
    letterSpacing: "0.14em",
    fontWeight: 700,
    color: "#555555",
    fontFamily: '"Inter", sans-serif',
  },
  section: {
    padding: "64px 0",
    borderBottom: "2px solid #111111",
  },
  sectionLabel: {
    display: "inline-block",
    fontSize: "10px",
    fontWeight: 900,
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    color: "#111111",
    border: "2px solid #111111",
    backgroundColor: "#FFFFFF",
    padding: "6px 10px",
    marginBottom: "16px",
    fontFamily: '"Inter", sans-serif',
  },
  sectionHead: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: "24px",
    flexWrap: "wrap",
    marginBottom: "32px",
  },
  h2: {
    fontSize: "clamp(28px, 4vw, 44px)",
    lineHeight: 1.05,
    letterSpacing: "-0.035em",
    fontWeight: 900,
    color: "#111111",
    maxWidth: "720px",
    fontFamily: '"Inter", sans-serif',
    textTransform: "uppercase",
  },
  grid3: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "18px",
  },
  card: {
    border: "2px solid #111111",
    backgroundColor: "#FFFFFF",
    padding: "26px",
    position: "relative",
  },
  cardNum: {
    position: "absolute",
    top: "14px",
    right: "18px",
    fontSize: "44px",
    fontWeight: 900,
    color: "#111111",
    opacity: 0.08,
    lineHeight: 1,
    fontFamily: '"Inter", sans-serif',
  },
  cardTitle: {
    fontSize: "20px",
    fontWeight: 900,
    color: "#111111",
    letterSpacing: "-0.02em",
    marginBottom: "10px",
    fontFamily: '"Inter", sans-serif',
    textTransform: "uppercase",
  },
  cardSub: {
    fontSize: "12px",
    color: "#F18B25",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    fontWeight: 700,
    marginBottom: "14px",
    fontFamily: '"Inter", sans-serif',
  },
  ctaBand: {
    border: "2px solid #111111",
    backgroundColor: "#111111",
    color: "#FFFFFF",
    padding: "36px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "28px",
    alignItems: "center",
  },
  footer: {
    padding: "30px 0",
    borderTop: "2px solid #111111",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    flexWrap: "wrap",
    fontSize: "10px",
    textTransform: "uppercase",
    letterSpacing: "0.16em",
    fontWeight: 700,
    color: "#111111",
    fontFamily: '"Inter", sans-serif',
  },
};

export default function LegacyOSPage() {
  return (
    <div style={styles.wrap}>
      <div style={styles.container}>
        {/* TOPBAR */}
        <header style={styles.topbar} role="banner">
          <div style={styles.brand}>
            <div style={styles.brandMark}>DD</div>
            <div>
              <div style={styles.brandTitle}>
                DIGITALLY<span style={styles.brandTitleSpan}>DEFINED.</span>
              </div>
              <div style={styles.brandSub}>Legacy OS · Phase 1 Launch</div>
            </div>
          </div>
          <div style={styles.topNote}>Week 1 Launch · $297 Flagship Suite</div>
        </header>

        {/* HERO SECTION */}
        <section style={styles.hero} id="top">
          <div>
            <span style={styles.eyebrow}>Phase 1 · Complete Digital System</span>
            <h1 style={styles.h1}>
              The <span style={{ color: "#F18B25" }}>Legacy OS</span> Bundle.
            </h1>
            <p style={styles.heroCopy}>
              One branded system that helps Gen X women stop managing caregiving, retirement, and legacy planning from chaos.
              Plan the money. Protect the crisis. Run the operation.
            </p>
            <div style={styles.heroBadges}>
              <span style={styles.badgeOrange}>One-time $297</span>
              <span style={styles.badgeBlue}>Planner</span>
              <span style={styles.badgeBlue}>Survival Kit</span>
              <span style={styles.badgeBlue}>Command Center</span>
              <span style={styles.badgeGreen}>Instant Download</span>
            </div>
            <div>
              <a
                href={GUMROAD_BUY_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={styles.btnPrimary}
              >
                Buy the Bundle on Gumroad ($297) →
              </a>
              <a href="#what-inside" style={styles.btnSecondary}>
                What’s Inside ↓
              </a>
            </div>
          </div>

          <div style={styles.heroMeta}>
            <div style={styles.metaCard}>
              <div>
                <div style={styles.metaValue}>$297</div>
                <div style={styles.metaLabel}>One-Time Offer</div>
              </div>
              <div style={{ fontSize: "12px", color: "#555" }}>Zero recurring subscriptions</div>
            </div>
            <div style={styles.metaCard}>
              <div>
                <div style={styles.metaValue}>5</div>
                <div style={styles.metaLabel}>Core Deliverables</div>
              </div>
              <div style={{ fontSize: "12px", color: "#555" }}>System · Guide · 3 Tool Checklists</div>
            </div>
            <div style={styles.metaCard}>
              <div>
                <div style={styles.metaValue}>100%</div>
                <div style={styles.metaLabel}>Private / On-Device</div>
              </div>
              <div style={{ fontSize: "12px", color: "#555" }}>No cloud tracking or data capture</div>
            </div>
            <div style={styles.metaCard}>
              <div>
                <div style={styles.metaValue}>2026</div>
                <div style={styles.metaLabel}>Launch Standard</div>
              </div>
              <div style={{ fontSize: "12px", color: "#555" }}>Immediate lifetime access</div>
            </div>
          </div>
        </section>

        {/* WHAT'S INSIDE */}
        <section style={styles.section} id="what-inside">
          <div style={styles.sectionHead}>
            <div>
              <span style={styles.sectionLabel}>The Offer Stack</span>
              <h2 style={styles.h2}>What you’re getting inside the bundle</h2>
            </div>
            <p style={{ maxWidth: "460px", color: "#4B5563", fontSize: "15px" }}>
              This is not a folder of loose files. It is one branded, interconnected system with a specific operational job.
            </p>
          </div>

          <div style={styles.grid3}>
            {/* CARD 01 */}
            <div style={{ ...styles.card, borderTop: "6px solid #47B7D4" }}>
              <div style={styles.cardNum}>01</div>
              <h3 style={styles.cardTitle}>Financial Autonomy Planner</h3>
              <div style={styles.cardSub}>01 · The Strategy Layer</div>
              <p style={{ fontSize: "14px", color: "#4B5563", marginBottom: "14px" }}>
                Calculate your exact Freedom Number, map your retirement income gap, and select the digital asset mix that bridges it.
              </p>
              <ul style={{ paddingLeft: "18px", fontSize: "13px", color: "#111111" }}>
                <li style={{ marginBottom: "6px" }}>Monthly target calculation</li>
                <li style={{ marginBottom: "6px" }}>Digital asset cashflow sliders</li>
                <li style={{ marginBottom: "6px" }}>35× liquidation exit multiple math</li>
                <li>L.E.G.A.C.Y. sovereign lens framework</li>
              </ul>
            </div>

            {/* CARD 02 */}
            <div style={{ ...styles.card, borderTop: "6px solid #F18B25" }}>
              <div style={styles.cardNum}>02</div>
              <h3 style={styles.cardTitle}>Caregiver’s Survival Kit</h3>
              <div style={styles.cardSub}>02 · The Protection Layer</div>
              <p style={{ fontSize: "14px", color: "#4B5563", marginBottom: "14px" }}>
                Turn the caregiving crisis into a financial map. Measure the burn, understand the Medicaid, VA, and Paid Leave paths.
              </p>
              <ul style={{ paddingLeft: "18px", fontSize: "13px", color: "#111111" }}>
                <li style={{ marginBottom: "6px" }}>Caregiving financial exposure calculator</li>
                <li style={{ marginBottom: "6px" }}>Medicaid Self-Directed Care checklist</li>
                <li style={{ marginBottom: "6px" }}>VA Family Caregiver stipend path</li>
                <li>Sandwich-generation risk multiplier</li>
              </ul>
            </div>

            {/* CARD 03 */}
            <div style={{ ...styles.card, borderTop: "6px solid #16A34A" }}>
              <div style={styles.cardNum}>03</div>
              <h3 style={styles.cardTitle}>Legacy Command Center</h3>
              <div style={styles.cardSub}>03 · The Operations Layer</div>
              <p style={{ fontSize: "14px", color: "#4B5563", marginBottom: "14px" }}>
                Run the day-to-day without burnout. Care appointments, task delegation, budget targets, and firm diplomacy communication.
              </p>
              <ul style={{ paddingLeft: "18px", fontSize: "13px", color: "#111111" }}>
                <li style={{ marginBottom: "6px" }}>Critical care calendar</li>
                <li style={{ marginBottom: "6px" }}>Shared task delegation board</li>
                <li style={{ marginBottom: "6px" }}>Financial Force Field budget tracker</li>
                <li>Diplomat AI communication drafter</li>
              </ul>
            </div>
          </div>

          {/* BONUS DELIVERY STRIP */}
          <div
            style={{
              marginTop: "20px",
              backgroundColor: "#111111",
              color: "#FFFFFF",
              border: "2px solid #111111",
              padding: "24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <div>
              <span style={{ color: "#F18B25", fontWeight: 900, fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Plus Included Bonuses
              </span>
              <h4 style={{ color: "#FFFFFF", fontSize: "18px", fontWeight: 900, textTransform: "uppercase", margin: "4px 0" }}>
                Welcome PDF Guide · Estate Documents Checklist · 96-Hour Scam Response Plan
              </h4>
              <p style={{ color: "#D1D5DB", fontSize: "13px", margin: 0 }}>
                Instant zip delivery upon checkout + immediate browser access.
              </p>
            </div>
            <a
              href={GUMROAD_BUY_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                backgroundColor: "#F18B25",
                color: "#111111",
                padding: "12px 20px",
                fontWeight: 900,
                textTransform: "uppercase",
                textDecoration: "none",
                fontSize: "13px",
                fontFamily: '"Inter", sans-serif',
              }}
            >
              Get All 5 Deliverables →
            </a>
          </div>
        </section>

        {/* CHECKOUT BANNER */}
        <section style={styles.section} id="checkout">
          <div style={styles.ctaBand}>
            <div>
              <span style={{ color: "#F18B25", fontWeight: 900, fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                Final Call to Action
              </span>
              <h3 style={{ fontSize: "28px", fontWeight: 900, color: "#FFFFFF", textTransform: "uppercase", margin: "10px 0 14px", fontFamily: '"Inter", sans-serif' }}>
                Ready to stop managing everything from chaos?
              </h3>
              <p style={{ color: "#D1D5DB", fontSize: "15px", lineHeight: 1.6, margin: "0 0 20px" }}>
                Get the full Legacy OS Bundle: Planner, Survival Kit, and Command Center — in one branded system. One-time purchase. Instant download.
              </p>
              <a
                href={GUMROAD_BUY_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-block",
                  backgroundColor: "#F18B25",
                  color: "#111111",
                  padding: "16px 28px",
                  fontWeight: 900,
                  fontSize: "15px",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  border: "2px solid #111111",
                  fontFamily: '"Inter", sans-serif',
                }}
              >
                Complete Order on Gumroad ($297) →
              </a>
            </div>

            <div style={{ backgroundColor: "#1F2937", border: "2px solid #4B5563", padding: "24px" }}>
              <span style={{ fontSize: "11px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", color: "#F18B25", display: "block", marginBottom: "8px" }}>
                Order Summary
              </span>
              <div style={{ color: "#FFFFFF", fontWeight: 800, fontSize: "16px", marginBottom: "6px" }}>
                The Legacy OS Bundle (Phase 1)
              </div>
              <div style={{ color: "#F18B25", fontWeight: 900, fontSize: "24px", marginBottom: "12px" }}>
                $297.00 <span style={{ fontSize: "12px", color: "#9CA3AF", fontWeight: 400 }}>one-time</span>
              </div>
              <p style={{ fontSize: "12px", color: "#9CA3AF", lineHeight: 1.6, margin: 0 }}>
                Instant file delivery via Gumroad. Your data stays 100% on your device with local browser storage.
                <br />
                Backup link: <a href={BACKUP_BUY_URL} target="_blank" rel="noopener noreferrer" style={{ color: "#F18B25" }}>Direct Gumroad Checkout</a>
              </p>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={styles.footer}>
          <div>© 2026 DigitallyDefined · Build What You Own</div>
          <div>Phase 1 · Legacy OS Flagship Suite</div>
        </footer>
      </div>
    </div>
  );
}
