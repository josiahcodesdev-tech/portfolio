import { chatCompletion } from "@/lib/openai";

const SYSTEM_PROMPT = `You are an expert CV writer and ATS optimization specialist. You follow these rules strictly:

1. REFRAME — never fabricate. Only use facts the candidate provides. Never invent tools, metrics, titles, or outcomes.
2. Every bullet must follow: Action verb + what was done + method/tool + outcome/purpose.
3. Start bullets with strong past-tense action verbs (Led, Coordinated, Developed, Designed, Conducted — never "Responsible for" or "Worked on").
4. Mirror job-description language wherever the underlying fact genuinely matches.
5. Never invent metrics. If no real numbers exist, describe scope or frequency in words.
6. Professional Summary: 4-6 sentences, opens with role identity reframed for the target job, uses JD keywords, closes with org-specific motivation.
7. Skills: group into 4-6 labeled categories.
8. Keep output honest — never overstate qualifications.

Respond ONLY with the requested JSON structure. No markdown fences, no explanations.`;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, data } = body;

    if (action === "enhance-bullets") {
      const { bullets, jobTitle, company } = data;
      const prompt = `Rewrite these CV bullet points for a "${jobTitle}" role at "${company}". Make each bullet follow the pattern: Action verb + what was done + method/tool + outcome. Keep all facts truthful — only rephrase, don't invent.

Current bullets:
${bullets}

Return a JSON array of strings, one per enhanced bullet. Example:
["Enhanced bullet 1", "Enhanced bullet 2"]`;

      const result = await chatCompletion(SYSTEM_PROMPT, prompt, { temperature: 0.6 });
      return Response.json({ result: JSON.parse(result) });
    }

    if (action === "enhance-summary") {
      const { currentSummary, jobTitle, skills, experience } = data;
      const prompt = `Write a professional summary (4-6 sentences) for a CV targeting the "${jobTitle}" role.

Current summary: ${currentSummary || "None provided"}
Key skills: ${skills || "Not specified"}
Recent experience: ${experience || "Not specified"}

The summary should:
- Open with the candidate's role identity reframed for this job
- Include 3-5 relevant keywords/tools
- Close with a statement of motivation specific to the role
- Be honest — only reference skills and experience provided

Return ONLY the summary text as a plain string (no JSON, no quotes wrapping it).`;

      const result = await chatCompletion(SYSTEM_PROMPT, prompt, { temperature: 0.7 });
      return Response.json({ result: result.replace(/^["']|["']$/g, "").trim() });
    }

    if (action === "suggest-skills") {
      const { experience, currentSkills, jobTitle } = data;
      const prompt = `Based on this candidate's experience and the target role "${jobTitle}", suggest organized skill categories.

Experience highlights: ${experience || "Not specified"}
Current skills: ${currentSkills || "Not specified"}

Return a JSON array of objects with "category" and "items" fields. Group into 4-6 categories. Only include skills the candidate likely has based on their experience — never add tools they haven't used.

Example format:
[{"category":"Data Analysis & BI","items":"Excel, SQL, SPSS, Power BI"},{"category":"IT Support","items":"Hardware Troubleshooting, System Maintenance"}]`;

      const result = await chatCompletion(SYSTEM_PROMPT, prompt, { temperature: 0.5 });
      return Response.json({ result: JSON.parse(result) });
    }

    return Response.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "AI enhancement failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
