import { chatCompletion } from "@/lib/openai";

const SYSTEM_PROMPT = `You are an expert cover letter writer. Follow these rules strictly:

1. One page maximum. Structure: opening connecting to the org's mission → 2-3 paragraphs mapping experience to JD responsibilities → honest paragraph addressing any gap → closing with availability.
2. Use the organisation's own language from the JD.
3. Never fabricate named contacts, quotes, or relationships.
4. Never use generic phrases like "passionate about making a difference" — be specific to the company.
5. Start with a dynamically appropriate current date.
6. Every claim must be backed by the qualifications and experience provided.
7. Extract and use 5-10 key terms from the job description verbatim where the candidate's experience supports them.
8. Address the letter to the named recipient or "Dear Hiring Manager" if none given.

Return the cover letter as clean HTML using only <p>, <b>, <i>, <ul>, <li>, and <br> tags. No markdown. No explanations outside the letter.`;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      fullName,
      email,
      phone,
      location,
      linkedin,
      recipientName,
      recipientTitle,
      companyName,
      companyAddress,
      jobTitle,
      jobDescription,
      qualifications,
      relevantExperience,
      whyThisCompany,
    } = body;

    const today = new Date().toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const prompt = `Write a professional cover letter with the following details:

DATE: ${today}

APPLICANT:
Name: ${fullName}
Email: ${email}
Phone: ${phone || "Not provided"}
Location: ${location || "Not provided"}
LinkedIn: ${linkedin || "Not provided"}

RECIPIENT:
Name: ${recipientName || "Hiring Manager"}
Title: ${recipientTitle || ""}
Company: ${companyName}
Address: ${companyAddress || ""}

POSITION: ${jobTitle}

JOB DESCRIPTION:
${jobDescription}

CANDIDATE'S QUALIFICATIONS:
${qualifications || "Not specified — focus on transferable skills from experience"}

CANDIDATE'S RELEVANT EXPERIENCE:
${relevantExperience || "Not specified — focus on qualifications"}

WHY THIS COMPANY:
${whyThisCompany || "Not specified — infer from the JD's mission/values if present"}

Requirements:
- Include the date, recipient block, and subject line at the top
- Opening paragraph: connect personally to the company's mission using their language from the JD
- Body: 2-3 paragraphs mapping the candidate's REAL qualifications and experience to the JD's requirements
- Use 5-10 keywords from the JD verbatim where the candidate can honestly claim them
- If there's an obvious gap, address it honestly as active development in one sentence
- Closing: state availability, thank the reader, sign off with the candidate's name and contact details
- Keep it to one page length (roughly 350-450 words)`;

    const result = await chatCompletion(SYSTEM_PROMPT, prompt, {
      temperature: 0.7,
      maxTokens: 2500,
    });

    return Response.json({ result });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Cover letter generation failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
