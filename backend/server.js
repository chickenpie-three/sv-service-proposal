// backend/server.js
import express from "express";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";

const app = express();
app.use(express.json());

// 🔒 In production we’ll set specific origins; for now keep it open
app.use(cors());

const ai = new GoogleGenAI({}); // Will read GEMINI_API_KEY from env (Cloud Run)
app.get("/healthz", (_req, res) => res.send("ok"));
app.post("/api/proposal", async (req, res) => {
  try {
    const {
      clientName = "Client",
      companyOverview = "",
      goals = "",
      services = [],
      notes = ""
    } = req.body || {};

    const system = `You are the STAFFVIRTUAL proposal engine. Tone: Bain-level clarity, confident, ROI-centric, concise.
Sections: Executive Summary, Objectives, Scope & Deliverables, Timeline, Team, Pricing (tiers), Risks & Mitigations, Next Steps.
Write in first-person plural ("we").`;

    const user = `
Client: ${clientName}
Company overview: ${companyOverview}
Goals: ${goals}
Requested/Proposed services: ${services.join(", ")}
Additional notes/context: ${notes}
Format with clear H2 headings and short paragraphs/bullets.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: [
        { role: "user", parts: [{ text: system }] },
        { role: "user", parts: [{ text: user }] }
      ],
    });

    // SDK returns a helper; use .text to get final string
    res.json({ proposal: response.text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate proposal." });
  }
});

const PORT = process.env.PORT || 8080; // Cloud Run default
app.listen(PORT, () => console.log(`API running on :${PORT}`));

