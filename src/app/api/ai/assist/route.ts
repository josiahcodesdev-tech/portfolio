import { chatCompletion } from "@/lib/openai";

const SYSTEM = `You are an expert CV and cover letter writing assistant embedded in an editor. You give SHORT, actionable suggestions (1-3 sentences max). Follow ATS best practices. Never fabricate — only suggest based on what the user has provided. Be specific, not generic.`;

export async function POST(request: Request) {
  try {
    const { action, field, currentValue, context } = await request.json();

    if (action === "field-suggest") {
      const prompt = buildFieldPrompt(field, currentValue, context);
      const result = await chatCompletion(SYSTEM, prompt, {
        temperature: 0.6,
        maxTokens: 300,
      });
      return Response.json({ suggestion: result.trim() });
    }

    if (action === "review-structure") {
      const prompt = `Review this CV data for ATS compliance and quality. Return a JSON object with:
- "score": number 0-100
- "issues": array of {"field": string, "message": string, "severity": "error"|"warning"|"tip"} (max 5 most important)

CV Data:
${JSON.stringify(context, null, 2).slice(0, 3000)}`;

      const result = await chatCompletion(
        "You are an ATS CV reviewer. Return ONLY valid JSON, no markdown fences.",
        prompt,
        { temperature: 0.3, maxTokens: 600 },
      );
      return Response.json({ review: JSON.parse(result) });
    }

    if (action === "improve-text") {
      const prompt = `Improve this ${field} text for a CV/cover letter. Keep it concise, professional, and ATS-friendly. Return ONLY the improved text, nothing else.

Current text: "${currentValue}"
Context: ${context || "General professional document"}`;

      const result = await chatCompletion(SYSTEM, prompt, {
        temperature: 0.6,
        maxTokens: 400,
      });
      return Response.json({ improved: result.trim() });
    }

    return Response.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "AI assist failed";
    return Response.json({ error: message }, { status: 500 });
  }
}

function buildFieldPrompt(
  field: string,
  currentValue: string,
  context: Record<string, string>,
): string {
  const name = context?.fullName || "the candidate";
  const role = context?.tagline || context?.jobTitle || "their target role";

  const fieldGuides: Record<string, string> = {
    tagline: `Suggest a professional tagline for ${name} targeting ${role}. Format: "Role 1 | Role 2 | Speciality". Example: "Data Analyst | IT Support | Business Intelligence". Keep it under 60 characters.`,

    professionalSummary: `Write a 4-6 sentence professional summary for ${name} targeting ${role}. Open with role identity, include 3-5 relevant keywords, close with motivation specific to the role. Current draft: "${currentValue || "empty"}"`,

    "jobTitle": `Suggest a strong job title that ${name} could use. Current: "${currentValue}". If it's generic, make it more specific and impactful.`,

    responsibilities: `Suggest 3-5 achievement-focused bullet points for a ${currentValue || role} role. Each bullet: Action verb + what was done + method/tool + outcome. Use past tense. Never start with "Responsible for".`,

    skills: `Suggest 4-6 skill categories for someone with experience as ${role}. Format each as "Category Name: skill1, skill2, skill3". Only include skills typical for this role.`,

    qualifications: `Suggest key qualifications to highlight for a ${role} application. List 3-5 items, one per line. Focus on education, certifications, and hard skills.`,

    relevantExperience: `Suggest 3-5 experience highlights for a ${role} application. Each should be a specific accomplishment with measurable impact. One per line.`,

    whyThisCompany: `Write a 1-2 sentence motivation statement for applying to ${context?.companyName || "this company"} as ${role}. Be specific to the company's mission, not generic.`,

    degree: `Suggest how to format this education entry for ATS: "${currentValue}". Use format: "Degree in Field" (e.g., "Bachelor of Science in Business Information Technology").`,
  };

  return fieldGuides[field] || `Suggest what to write in the "${field}" field of a professional CV. Current value: "${currentValue || "empty"}". Keep the suggestion specific and actionable.`;
}
