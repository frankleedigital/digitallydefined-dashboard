import React from "react";
import mergedConfig from "../configMerge";

const Logo = ({ as: Component = "span", style = {}, className = "" }) => {
  const logoImage = String(mergedConfig.brand.logoImage || "").trim();

  const frameStyle = {
    display: "inline-flex",
    alignItems: "center",
    gap: 0,
    padding: "0.5rem 0.75rem",
    border: "1px solid #111111",
    backgroundColor: "#fffcf9",
    lineHeight: 1,
    whiteSpace: "nowrap",
    width: "fit-content",
    boxSizing: "border-box",
  };

  const wordStyle = {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "1rem",
    fontWeight: 800,
    letterSpacing: "-0.04em",
    textTransform: "none",
  };

  return (
    <Component
      className={className}
      style={{ ...frameStyle, ...style }}
      aria-label={mergedConfig.brand.fullName}
    >
      {logoImage ? (
          <img
            src={`/${logoImage}`}
            alt={mergedConfig.brand.fullName || "DigitallyDefined"}
            style={{
              height: "28px",
              width: "auto",
              objectFit: "contain",
              display: "block",
            }}
          />
      ) : (
        <>
          <span
            style={{
              ...wordStyle,
              color: "#111111",
              fontStyle: "normal",
            }}
          >
            {mergedConfig.brand.nameLight || "Digitally"}
          </span>
          <span
            style={{
              ...wordStyle,
              color: "#f18b25",
              fontStyle: "italic",
              marginLeft: "0.05rem",
            }}
          >
            {mergedConfig.brand.nameBold || "Defined"}
          </span>
        </>
      )}
    </Component>
  );
};

export default Logo;