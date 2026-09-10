import { useState, useEffect } from "react";
import IntelligenceDashboard from "../components/intelligence/IntelligenceDashboard";
import { callSupabaseEdge } from "../lib/supabase-edge";

export default function IntelligencePage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchIntelligence() {
      try {
        // Check for quiz data in localStorage (set by quiz redirect)
        const stored = localStorage.getItem('dd-quiz-results');
        let quizData = null;

        if (stored) {
          quizData = JSON.parse(stored);
          localStorage.removeItem('dd-quiz-results'); // Clear after reading
        }

        // If no quiz data, redirect to quiz
        if (!quizData) {
          window.location.href = '/quiz';
          return;
        }

        // Call the dashboard backend API directly for the intelligence payload.
        const result = await callSupabaseEdge("intelligence", {
          userId: quizData.userId || "unknown",
          answers: quizData.answers || {}
        });

        if (!result.success) {
          throw new Error(result.error || "Unknown error");
        }

        // Transform data to match IntelligenceDashboard expectations
        const dashboardData = {
          superpower: result.data.superpower || "Builder",
          persona: {
            name: quizData.userId.split('@')[0] || "Builder",
            type: result.data.superpower || "Builder"
          },
          businessModel: {
            type: result.data.superpower || "Builder",
            description: result.data.superpowerDescription || ""
          },
          strengths: result.data.recommendations || ["Your superpower is well-defined"],
          blindspots: [],
          roadmap: result.data.roadmap?.steps ? [
            {
              phase: "Your Path",
              description: result.data.roadmap.estimatedTime || "30-60 days",
              actions: result.data.roadmap.steps || []
            }
          ] : [],
          trends: [],
          competition: [],
          opportunities: result.data.recommendations || [],
          audience: {
            description: result.data.superpowerDescription || ""
          }
        };

        setData(dashboardData);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }

    fetchIntelligence();
  }, []);

  if (loading) return <div style={{
    padding: '2rem',
    textAlign: 'center',
    color: '#111',
    fontFamily: 'Inter, sans-serif'
  }}>Loading your intelligence package…</div>;
  if (error) return <div style={{
    padding: '2rem',
    textAlign: 'center',
    color: '#8B1A0A',
    fontFamily: 'Inter, sans-serif'
  }}>Error: {error}</div>;

  return <IntelligenceDashboard data={data} />;
}
