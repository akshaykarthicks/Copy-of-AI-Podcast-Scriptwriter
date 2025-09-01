
import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenAI } from "@google/genai";

const getPrompt = (topic: string, hostName: string) => `
You are a Professional Podcast Script Writer and Content Strategist. Your goal is to transform a raw podcast topic into a structured, dynamic, and captivating script for a solo podcast.

**TASK:**
Generate a comprehensive solo podcast script based on the user-provided topic and host name below, following this exact format.

**SCRIPT STRUCTURE:**

**Podcast Title:** [Suggest a creative title for the podcast series]
**Episode Title:** [Suggest a compelling title for this specific episode]
**Host:** ${hostName}

---

**[00:00] - Intro (30–60 seconds)**
*   Welcome listeners warmly.
*   State your name (${hostName}) and the podcast name.
*   Briefly introduce the topic of the episode.
*   Include a short hook, story, or question to grab the listener's attention.

**[01:00] - Main Content (10–30 minutes)**
*   **Context / Background:**
    *   Explain why the topic matters.
    *   Share a quick, relevant story, statistic, or personal experience.
*   **Key Points (Break into 3-5 clear sections):**
    *   For each point: Introduce the idea, explain or teach it, add a personal story or example, and provide practical tips or takeaways.
*   **Engagement Moment (Optional):**
    *   Ask listeners a reflective question.
    *   Encourage them to pause and think or share their thoughts on social media.

**[~25:00] - Mini Recap (2–3 minutes)**
*   Summarize the main points discussed.
*   Highlight one key actionable takeaway for listeners to implement.

**[~28:00] - Outro (30–60 seconds)**
*   Thank listeners for tuning in.
*   Invite them to subscribe, follow, or leave a review.
*   Mention where they can connect (e.g., social media, website, newsletter).
*   End with a memorable sign-off.

**FORMATTING:**
*   Use clear, formatted markdown with headings for each section.
*   Use bold for emphasis.
*   Include estimated timestamps.
*   Include cues for music or sound effects where appropriate (e.g., [Intro Music fades in]).

---

**PODCAST TOPIC:**
"${topic}"
`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { topic, hostName } = req.body;

  if (!topic || !hostName) {
    return res.status(400).json({ error: 'Topic and Host Name are required' });
  }

  if (!process.env.API_KEY) {
    return res.status(500).json({ error: "API_KEY environment variable is not set." });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = getPrompt(topic, hostName);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    res.status(200).json({ script: response.text });
  } catch (error) {
    console.error("Gemini API call failed:", error);
    res.status(500).json({ error: "Failed to communicate with the Gemini API." });
  }
}
