import React, { useMemo, useState } from "react";
import { ArrowRight, Calculator, DollarSign, LineChart, PhoneCall } from "lucide-react";
import mergedConfig from "../configMerge";
import {
  brutalBorder,
  brutalButtonPrimary,
  brutalButtonSecondary,
  brutalCard,
  brutalEyebrow,
  brutalHeading,
  theme,
} from "../theme";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

const fieldConfig = [
  {
    key: "traffic",
    label: "Monthly lead traffic",
    min: 25,
    max: 500,
    step: 5,
    suffix: "calls",
  },
  {
    key: "ticket",
    label: "Average job value",
    min: 150,
    max: 7500,
    step: 50,
    prefix: "$",
  },
  {
    key: "closeRate",
    label: "Close rate",
    min: 5,
    max: 70,
    step: 1,
    suffix: "%",
  },
  {
    key: "ppcCost",
    label: "Market PPC cost",
    min: 5,
    max: 100,
    step: 1,
    prefix: "$",
  },
];

const fullModeFields = [
  {
    key: "retentionMonths",
    label: "Customer retention",
    min: 1,
    max: 18,
    step: 1,
    suffix: "months",
  },
  {
    key: "reviewLift",
    label: "Reputation lift",
    min: 0,
    max: 35,
    step: 1,
    suffix: "%",
  },
];

const defaultValues = {
  traffic: 45,
  ticket: 600,
  closeRate: 20,
  ppcCost: 25,
  retentionMonths: 3,
  reviewLift: 12,
};

const RoiCalculator = ({ mode = "free", onFullCalculatorClick }) => {
  const [values, setValues] = useState(defaultValues);
  const isFull = mode === "full";
  const colors = mergedConfig.colors;

  const results = useMemo(() => {
    const leads = Math.round((values.traffic * values.closeRate) / 100);
    const monthlyRevenue = leads * values.ticket;
    const ppcSavings = values.traffic * values.ppcCost;
    const reputationMultiplier = isFull ? 1 + values.reviewLift / 100 : 1;
    const retainedRevenue = monthlyRevenue * (isFull ? values.retentionMonths : 1);
    const totalYield = Math.round(retainedRevenue * reputationMultiplier + ppcSavings);
    const annualized = totalYield * 12;

    return {
      leads,
      monthlyRevenue,
      ppcSavings,
      totalYield,
      annualized,
    };
  }, [isFull, values]);

  const fields = isFull ? [...fieldConfig, ...fullModeFields] : fieldConfig;

  const renderValue = (field) => {
    const value = values[field.key];
    return `${field.prefix || ""}${value.toLocaleString()}${field.suffix ? ` ${field.suffix}` : ""}`;
  };

  return (
    <section
      className="dd-roi-calculator dd-tool"
      style={{
        ...brutalCard,
        overflow: "hidden",
        backgroundColor: colors.surface,
      }}
      aria-label={isFull ? "Full ROI calculator" : "Free ROI calculator"}
    >
      <div
        className="dd-roi-calculator__top"
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 0.9fr) minmax(0, 1.35fr)",
          minHeight: "520px",
        }}
      >
        <div
          style={{
            padding: "clamp(24px, 4vw, 40px)",
            borderRight: brutalBorder,
            display: "grid",
            gap: "24px",
            alignContent: "start",
          }}
        >
          <div>
            <p style={{ ...brutalEyebrow, color: colors.warning }}>
              {isFull ? "Institutional asset validator" : "Free lead snapshot"}
            </p>
            <h2
              style={{
                ...brutalHeading,
                margin: "12px 0 0",
                fontSize: "clamp(2rem, 4vw, 3.75rem)",
                lineHeight: 0.95,
                color: colors.text,
              }}
            >
              10x ROI <span style={{ color: colors.accent }}>Calculator</span>
            </h2>
            {!isFull && (
              <p className="dd-roi-privacy">
                Your inputs stay on this device. Nothing is stored or sent.
              </p>
            )}
          </div>

          <div style={{ display: "grid", gap: "18px" }}>
            {fields.map((field) => (
              <label key={field.key} className="dd-label" style={{ display: "grid", gap: "10px" }}>
                <span
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "16px",
                    color: colors.text,
                    fontSize: "0.8rem",
                    fontWeight: 900,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  <span>{field.label}</span>
                  <span style={{ color: colors.accent }}>{renderValue(field)}</span>
                </span>
                <input
                  className="dd-input"
                  type="range"
                  min={field.min}
                  max={field.max}
                  step={field.step}
                  value={values[field.key]}
                  onChange={(event) =>
                    setValues((current) => ({
                      ...current,
                      [field.key]: Number(event.target.value),
                    }))
                  }
                  style={{ accentColor: colors.accent, width: "100%" }}
                />
              </label>
            ))}
          </div>
        </div>

        <div
          style={{
            backgroundColor: colors.dark,
            color: colors.bone,
            padding: "clamp(28px, 5vw, 48px)",
            display: "grid",
            alignContent: "space-between",
            gap: "32px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <LineChart
            aria-hidden="true"
            size={170}
            strokeWidth={1.4}
            style={{
              position: "absolute",
              right: "32px",
              top: "56px",
              color: "rgba(255,255,255,0.12)",
            }}
          />
          <div style={{ position: "relative", display: "grid", gap: "14px" }}>
            <p style={{ ...brutalEyebrow, color: colors.boneMuted }}>
              Total yield capability
            </p>
            <strong
              className="dd-result"
              style={{
                display: "block",
                color: colors.surface,
                fontFamily: theme.fonts.heading,
                fontSize: "clamp(4rem, 11vw, 7rem)",
                fontStyle: "normal",
                fontWeight: 900,
                lineHeight: 0.9,
                letterSpacing: "0",
              }}
            >
              {formatCurrency(results.totalYield)}
            </strong>
            <p
              style={{
                margin: 0,
                maxWidth: "620px",
                color: colors.boneMuted,
                fontSize: "clamp(1rem, 2vw, 1.2rem)",
                lineHeight: 1.55,
              }}
            >
              Monthly gross revenue and avoided ad spend from the digital property
              you already own.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: "14px",
              position: "relative",
            }}
          >
            {[
              { icon: PhoneCall, label: "Estimated leads", value: results.leads },
              { icon: DollarSign, label: "Revenue", value: formatCurrency(results.monthlyRevenue) },
              { icon: Calculator, label: "PPC savings", value: formatCurrency(results.ppcSavings) },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  border: `1px solid ${colors.whiteBorderSoft}`,
                  padding: "16px",
                  minHeight: "112px",
                  display: "grid",
                  gap: "12px",
                  alignContent: "space-between",
                }}
              >
                <item.icon size={20} color={colors.primary} />
                <div>
                  <p style={{ ...brutalEyebrow, color: colors.boneFaint, fontSize: "0.62rem" }}>
                    {item.label}
                  </p>
                  <strong style={{ display: "block", marginTop: "6px", fontSize: "1.35rem" }}>
                    {item.value}
                  </strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {!isFull && (
        <div
          style={{
            borderTop: brutalBorder,
            padding: "22px clamp(24px, 4vw, 40px)",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "18px",
            flexWrap: "wrap",
            backgroundColor: colors.backgroundAlt,
          }}
        >
          <div style={{ maxWidth: "620px" }}>
            <p style={{ margin: 0, color: colors.textMuted, lineHeight: 1.6 }}>
              This free version gives you a quick signal: monthly revenue, PPC savings,
              and estimated leads. The paid full calculator on Gumroad adds retention,
              reputation lift, annualized upside, and the numbers you need for a serious
              decision.
            </p>
            <p className="dd-roi-privacy" style={{ marginTop: "12px" }}>
              Your inputs stay on this device. Nothing is stored or sent.
            </p>
          </div>
          <button
            className="dd-btn"
            type="button"
            onClick={onFullCalculatorClick}
            style={brutalButtonPrimary}
          >
            Buy the full calculator <ArrowRight size={16} />
          </button>
        </div>
      )}

      {isFull && (
        <div
          style={{
            borderTop: brutalBorder,
            padding: "24px clamp(24px, 4vw, 40px)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
            backgroundColor: colors.backgroundAlt,
          }}
        >
          <div style={{ ...brutalCard, padding: "20px" }}>
            <p style={{ ...brutalEyebrow, color: colors.textMuted }}>Annualized upside</p>
            <strong style={{ display: "block", marginTop: "8px", fontSize: "2rem" }}>
              {formatCurrency(results.annualized)}
            </strong>
          </div>
          <div style={{ ...brutalCard, padding: "20px" }}>
            <p style={{ ...brutalEyebrow, color: colors.textMuted }}>Decision note</p>
            <p style={{ margin: "8px 0 0", color: colors.textMuted }}>
              Use this as a directional validator before investing in paid traffic,
              reputation work, or a full local visibility campaign.
            </p>
          </div>
          <a
            className="dd-btn dd-btn--secondary"
            href={`mailto:${mergedConfig.contact.email}`}
            style={brutalButtonSecondary}
          >
            Send me my numbers <ArrowRight size={16} />
          </a>
        </div>
      )}
    </section>
  );
};

export default RoiCalculator;
