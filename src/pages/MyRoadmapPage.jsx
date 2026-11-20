import React, { useEffect, useState } from "react";
import NotionTab from "./NotionTab";
import { fetchNotionData } from "../lib/notion";
import { theme } from "../theme";

// Customer journey: the buyer's Notion OS roadmap, outside the owner dashboard bar.
export default function MyRoadmapPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    fetchNotionData()
      .then((d) => { if (active) { setData(d); setError(d.error || null); } })
      .catch((e) => { if (active) setError(e instanceof Error ? e.message : String(e)); });
    return () => { active = false; };
  }, []);

  return (
    <div style={{ padding: "1.5rem", display: "grid", gap: "1rem", maxWidth: "72rem", margin: "0 auto" }}>
      <h1 style={{ margin: 0, fontSize: "1.4rem" }}>My Roadmap</h1>
      {error && (
        <p style={{ color: theme.colors.muted, margin: 0, fontSize: "0.9rem" }}>
          Notion sync is unavailable right now: {error}
        </p>
      )}
      {data ? <NotionTab data={data} /> : <p style={{ color: theme.colors.muted, margin: 0 }}>Loading your roadmap…</p>}
    </div>
  );
}
