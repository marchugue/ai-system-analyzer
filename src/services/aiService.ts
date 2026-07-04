import type { AnalysisReport, QuestionnaireData } from '@/types';
import { buildPrompt, SYSTEM_PROMPT } from '@/utils/promptBuilder';
import { parseReport } from '@/utils/reportParser';

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------
// Groq exposes an OpenAI-compatible Chat Completions API. Equivalent cURL:
//
//   curl https://api.groq.com/openai/v1/chat/completions \
//     -H "Authorization: Bearer $GROQ_API_KEY" \
//     -H "Content-Type: application/json" \
//     -d '{
//           "model": "openai/gpt-oss-120b",
//           "messages": [
//             { "role": "system", "content": "..." },
//             { "role": "user", "content": "..." }
//           ]
//         }'
//
// Source: https://console.groq.com/docs/quickstart, https://console.groq.com/docs/text-chat
//
// ⚠️ SECURITY NOTE: VITE_ variables are bundled into the client-side JS, so
// VITE_API_KEY is visible to anyone who opens devtools on the deployed site.
// Groq's own SDK disables browser usage by default for this exact reason
// (it requires an explicit `dangerouslyAllowBrowser` flag to override).
// This mirrors the pattern the project brief asked for (no backend, no
// login), but it means the key can be extracted and used by someone else.
// For anything beyond a prototype/capstone demo, put this fetch call behind
// a small server-side proxy (e.g. a Supabase Edge Function) that holds the
// real key and only exposes a narrow "analyze" endpoint to the browser.
// See README.md → "Wiring in your real AI provider" for details.
const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT as string;
const API_KEY = import.meta.env.VITE_API_KEY as string;
const MODEL_NAME = import.meta.env.VITE_MODEL_NAME as string;

export class AIServiceError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = 'AIServiceError';
  }
}

interface GroqChatCompletionResponse {
  choices?: { message?: { content?: string } }[];
  error?: { message?: string };
}

/**
 * Sends the questionnaire responses to Groq for analysis and returns a
 * parsed, section-by-section business/systems analysis report.
 */
export async function analyzeRequirements(formData: QuestionnaireData): Promise<AnalysisReport> {
  if (!API_ENDPOINT || !API_KEY || !MODEL_NAME) {
    throw new AIServiceError(
      'AI provider is not configured. Set VITE_API_ENDPOINT, VITE_API_KEY, and VITE_MODEL_NAME in your .env file.'
    );
  }

  const userPrompt = buildPrompt(formData);

  let response: Response;
  try {
    response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.4,
        max_completion_tokens: 8000,
      }),
    });
  } catch (err) {
    throw new AIServiceError(
      'Could not reach the AI provider. Check your internet connection and VITE_API_ENDPOINT.',
      err
    );
  }

  let payload: GroqChatCompletionResponse;
  try {
    payload = await response.json();
  } catch (err) {
    throw new AIServiceError('The AI provider returned a response that could not be parsed as JSON.', err);
  }

  if (!response.ok) {
    const providerMessage = payload?.error?.message;
    if (response.status === 401) {
      throw new AIServiceError('AI provider rejected the request: invalid or missing API key.');
    }
    if (response.status === 429) {
      throw new AIServiceError('AI provider rate limit reached. Please wait a moment and try again.');
    }
    throw new AIServiceError(providerMessage || `AI provider request failed (HTTP ${response.status}).`);
  }

  const content = payload.choices?.[0]?.message?.content;
  if (!content) {
    throw new AIServiceError('The AI provider returned an empty response.');
  }

  return parseReport(content);
}