import { NextRequest, NextResponse } from 'next/server';

const EXTRACTION_PROMPT = `You are a professional resume parser.

Your task is to extract structured information from a resume text and return ONLY valid JSON.

IMPORTANT RULES:
- Return ONLY JSON (no explanation, no markdown, no text before/after)
- If a field is missing, use null
- Do NOT guess or hallucinate information
- Normalize all dates to format: YYYY-MM
- Extract clean and structured data
- Remove duplicates
- Keep responses concise and accurate

OUTPUT FORMAT:

{
  "full_name": "string | null",
  "email": "string | null",
  "phone": "string | null",
  "location": "string | null",
  "summary": "string | null",
  "skills": ["string"],
  "education": [
    {
      "degree": "string | null",
      "field_of_study": "string | null",
      "institution": "string | null",
      "start_date": "string | null",
      "end_date": "string | null"
    }
  ],
  "experience": [
    {
      "job_title": "string | null",
      "company": "string | null",
      "location": "string | null",
      "start_date": "string | null",
      "end_date": "string | null",
      "description": "string | null"
    }
  ],
  "languages": ["string"],
  "certifications": ["string"]
}

RESUME TEXT:
"""
`;

// ─── Types ────────────────────────────────────────────────────────────────────

type Education = {
  degree?: string | null;
  field_of_study?: string | null;
  institution?: string | null;
  start_date?: string | null;
  end_date?: string | null;
};

type Experience = {
  job_title?: string | null;
  company?: string | null;
  location?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  description?: string | null;
};

type ParsedResume = {
  full_name?: string | null;
  email?: string | null;
  phone?: string | null;
  location?: string | null;
  summary?: string | null;
  skills?: string[];
  education?: Education[];
  experience?: Experience[];
  languages?: string[];
  certifications?: string[];
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildPrompt(resumeText: string) {
  return `${EXTRACTION_PROMPT}${resumeText}\n"""`;
}

function splitName(fullName: string | null | undefined): { firstName: string; lastName: string } {
  if (!fullName) return { firstName: '', lastName: '' };
  const parts = fullName.trim().split(/\s+/);
  return { firstName: parts[0] ?? '', lastName: parts.slice(1).join(' ') };
}

function formatEducation(edu: Education[]): string {
  return edu
    .map((e) => {
      const degree = [e.degree, e.field_of_study].filter(Boolean).join(' in ');
      const dates  = [e.start_date, e.end_date].filter(Boolean).join(' – ');
      return [e.institution, degree, dates].filter(Boolean).join(' | ');
    })
    .join('\n');
}

function formatExperience(exp: Experience[]): string {
  return exp
    .map((e) => {
      const dates  = [e.start_date, e.end_date].filter(Boolean).join(' – ');
      const header = [e.job_title, e.company, e.location, dates].filter(Boolean).join(' | ');
      return e.description ? `${header}\n${e.description}` : header;
    })
    .join('\n\n');
}

function buildClientResponse(parsed: ParsedResume) {
  const { firstName, lastName } = splitName(parsed.full_name);

  const allSkills = [...(parsed.skills ?? []), ...(parsed.languages ?? [])].filter(Boolean);

  const eduStr   = formatEducation(parsed.education ?? []);
  const certsStr = (parsed.certifications ?? []).join('\n');

  return {
    firstName,
    lastName,
    email:       parsed.email    ?? '',
    phone:       parsed.phone    ?? '',
    location:    parsed.location ?? '',
    jobTitle:    parsed.experience?.[0]?.job_title ?? '',
    linkedInUrl: '',
    portfolioUrl:'',
    githubUrl:   '',
    skills:      allSkills.join(', '),
    experience:  formatExperience(parsed.experience ?? []),
    education:   [eduStr, certsStr].filter(Boolean).join('\n\n'),
    notes:       parsed.summary  ?? '',
  };
}

function extractJson(raw: string): ParsedResume {
  const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim();
  const match   = cleaned.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('No JSON object found in AI response');
  return JSON.parse(match[0]) as ParsedResume;
}

// ─── AI providers ─────────────────────────────────────────────────────────────

async function callGroq(resumeText: string, apiKey: string): Promise<ParsedResume> {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      temperature: 0,
      max_tokens: 2048,
      messages: [{ role: 'user', content: buildPrompt(resumeText) }],
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { error?: { message?: string } };
    throw new Error(`Groq: ${err.error?.message ?? `HTTP ${res.status}`}`);
  }
  const data = await res.json() as { choices?: Array<{ message?: { content?: string } }> };
  return extractJson(data.choices?.[0]?.message?.content ?? '');
}

async function callAnthropic(
  pdfBuffer: Buffer | null,
  resumeText: string | null,
  apiKey: string,
): Promise<ParsedResume> {
  type Block =
    | { type: 'text'; text: string }
    | { type: 'document'; source: { type: 'base64'; media_type: 'application/pdf'; data: string } };

  const content: Block[] = pdfBuffer
    ? [
        {
          type: 'document',
          source: {
            type: 'base64',
            media_type: 'application/pdf',
            data: pdfBuffer.toString('base64'),   // Base64 only here, only for Anthropic
          },
        },
        { type: 'text', text: buildPrompt('(see attached PDF)') },
      ]
    : [{ type: 'text', text: buildPrompt(resumeText ?? '') }];

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-beta': 'pdfs-2024-09-25',
    },
    body: JSON.stringify({ model: 'claude-sonnet-4-6', max_tokens: 2048, messages: [{ role: 'user', content }] }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { error?: { message?: string } };
    throw new Error(`Anthropic: ${err.error?.message ?? `HTTP ${res.status}`}`);
  }
  const data = await res.json() as { content?: Array<{ type: string; text?: string }> };
  return extractJson(data.content?.[0]?.text ?? '');
}

async function callGemini(
  pdfBuffer: Buffer | null,
  resumeText: string | null,
  apiKey: string,
): Promise<ParsedResume> {
  type Part = { text: string } | { inline_data: { mime_type: string; data: string } };

  const parts: Part[] = pdfBuffer
    ? [
        { inline_data: { mime_type: 'application/pdf', data: pdfBuffer.toString('base64') } },
        { text: buildPrompt('(see attached PDF)') },
      ]
    : [{ text: buildPrompt(resumeText ?? '') }];

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts }],
        generationConfig: { temperature: 0, maxOutputTokens: 2048 },
      }),
    },
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { error?: { message?: string } };
    throw new Error(`Gemini: ${err.error?.message ?? `HTTP ${res.status}`}`);
  }
  const data = await res.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
  return extractJson(data.candidates?.[0]?.content?.parts?.[0]?.text ?? '');
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    // Read raw multipart/form-data — no Base64 in the browser at all
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'A file is required. Send it as form-data with key "file".' }, { status: 400 });
    }

    const mimeType = file.type;
    const fileName = file.name;
    const isPdf    = mimeType === 'application/pdf';
    const isText   = mimeType.startsWith('text/') || fileName.endsWith('.txt') || fileName.endsWith('.md');

    if (!isPdf && !isText) {
      return NextResponse.json(
        { error: 'Unsupported file type. Please upload a PDF or plain text (.txt) file.' },
        { status: 400 },
      );
    }

    // Read file once as a raw Buffer — no Base64 anywhere in this step
    const buffer     = Buffer.from(await file.arrayBuffer());
    const pdfBuffer  = isPdf  ? buffer : null;
    const resumeText = isText ? buffer.toString('utf-8') : null;

    const groqKey      = process.env.GROQ_API_KEY;
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    const geminiKey    = process.env.GEMINI_API_KEY;

    const errors: string[] = [];

    // 1️⃣ Groq — text files only (no PDF support)
    if (!isPdf && groqKey) {
      try {
        const parsed = await callGroq(resumeText!, groqKey);
        console.log('[parse-resume] Groq succeeded');
        return NextResponse.json(buildClientResponse(parsed));
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        console.warn('[parse-resume] Groq failed:', msg);
        errors.push(msg);
      }
    }

    // 2️⃣ Anthropic — PDF + text (Base64 conversion happens inside callAnthropic only)
    if (anthropicKey) {
      try {
        const parsed = await callAnthropic(pdfBuffer, resumeText, anthropicKey);
        console.log('[parse-resume] Anthropic succeeded');
        return NextResponse.json(buildClientResponse(parsed));
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        console.warn('[parse-resume] Anthropic failed:', msg);
        errors.push(msg);
      }
    }

    // 3️⃣ Gemini — PDF + text (Base64 conversion happens inside callGemini only)
    if (geminiKey) {
      try {
        const parsed = await callGemini(pdfBuffer, resumeText, geminiKey);
        console.log('[parse-resume] Gemini succeeded');
        return NextResponse.json(buildClientResponse(parsed));
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        console.warn('[parse-resume] Gemini failed:', msg);
        errors.push(msg);
      }
    }

    if (errors.length === 0) {
      return NextResponse.json(
        { error: 'No AI provider configured. Add GROQ_API_KEY, ANTHROPIC_API_KEY, or GEMINI_API_KEY to .env' },
        { status: 503 },
      );
    }

    return NextResponse.json(
      { error: `All AI providers failed: ${errors.join(' | ')}` },
      { status: 502 },
    );
  } catch (error) {
    console.error('[parse-resume] Unexpected error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to parse resume' },
      { status: 500 },
    );
  }
}
