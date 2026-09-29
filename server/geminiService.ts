import { GoogleGenAI, Type } from '@google/genai';
import { SCRIPT_SYSTEM_PROMPT } from './scriptPrompt.ts';

const CANDIDATE_MODELS = [
  'gemini-3.8-flash',
  'gemini-3.7-flash',
  'gemini-3.6-flash',
];

export interface ScriptLine {
  speaker: string;
  role: 'host' | 'caller';
  city: string;
  text: string;
}

export interface ScriptOutput {
  onTopic: boolean;
  redirectMessage: string;
  title: string;
  summary: string;
  lines: ScriptLine[];
  modelUsed?: string;
}

function getAiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured on the server');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function is429Error(err: unknown): boolean {
  if (!err) return false;
  const str = String(err);
  const status = (err as { status?: number; statusCode?: number })?.status ||
                 (err as { status?: number; statusCode?: number })?.statusCode;
  return (
    status === 429 ||
    str.includes('429') ||
    str.includes('RESOURCE_EXHAUSTED') ||
    str.toLowerCase().includes('quota') ||
    str.toLowerCase().includes('rate limit')
  );
}

function isModelUnavailableError(err: unknown): boolean {
  if (!err) return false;
  const str = String(err).toLowerCase();
  const status = (err as { status?: number; statusCode?: number })?.status ||
                 (err as { status?: number; statusCode?: number })?.statusCode;
  return (
    status === 404 ||
    status === 503 ||
    str.includes('503') ||
    str.includes('unavailable') ||
    str.includes('not found') ||
    str.includes('not_found') ||
    str.includes('is not supported') ||
    str.includes('unknown model') ||
    str.includes('high demand') ||
    str.includes('temporarily unavailable')
  );
}

export async function testScriptModel(): Promise<{ ok: boolean; modelUsed?: string; error?: string }> {
  const ai = getAiClient();

  for (const model of CANDIDATE_MODELS) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: 'Say ok',
      });
      if (response && response.text) {
        return { ok: true, modelUsed: model };
      }
    } catch (err) {
      if (is429Error(err)) {
        return { ok: false, error: 'Free limit reached. Wait a minute and try again.' };
      }
      if (isModelUnavailableError(err)) {
        // Continue to fallback model
        continue;
      }
      // If last model or unexpected error
      if (model === CANDIDATE_MODELS[CANDIDATE_MODELS.length - 1]) {
        return { ok: false, error: err instanceof Error ? err.message : String(err) };
      }
    }
  }

  return { ok: false, error: 'All candidate models unavailable' };
}

export async function generateScript(params: {
  prompt: string;
  format: string;
  level: string;
  minutes: number;
  mood: string;
}): Promise<ScriptOutput> {
  const ai = getAiClient();
  const userContent = `Broadcast Inquiry / Topic: "${params.prompt}"
Requested Format: ${params.format}
Audience Level: ${params.level}
Broadcast Duration: ${params.minutes} minutes (aim for approx ${params.minutes * 125} spoken words total across lines)
Tone & Mood: ${params.mood}

Write the full script following the instructions. If the topic is outside physics, astronomy, cosmology, and the history and ideas of science, mark onTopic: false, provide 3 suggested questions in redirectMessage, and leave title, summary, and lines empty.`;

  const scriptSchema = {
    type: Type.OBJECT,
    properties: {
      onTopic: {
        type: Type.BOOLEAN,
        description: 'True if topic is valid physics/cosmology/astronomy; false if off-topic.',
      },
      redirectMessage: {
        type: Type.STRING,
        description:
          'If off-topic, a friendly redirect explaining focus and proposing 3 specific example questions.',
      },
      title: {
        type: Type.STRING,
        description: 'Episode title.',
      },
      summary: {
        type: Type.STRING,
        description: 'Two sentence summary of the discussion and conclusions.',
      },
      lines: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            speaker: { type: Type.STRING, description: 'First name of speaker (Paul or caller name)' },
            role: { type: Type.STRING, enum: ['host', 'caller'] },
            city: { type: Type.STRING, description: 'London for host, or city of caller' },
            text: { type: Type.STRING, description: 'Single turn of dialogue' },
          },
          required: ['speaker', 'role', 'city', 'text'],
        },
      },
    },
    required: ['onTopic', 'redirectMessage', 'title', 'summary', 'lines'],
  };

  let lastError: unknown = null;

  for (const model of CANDIDATE_MODELS) {
    // Attempt generation up to 2 times for JSON validity per model
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: userContent,
          config: {
            systemInstruction: SCRIPT_SYSTEM_PROMPT,
            responseMimeType: 'application/json',
            responseSchema: scriptSchema,
            temperature: 0.7,
          },
        });

        const text = response.text?.trim();
        if (!text) {
          throw new Error('Empty response received from Gemini');
        }

        try {
          const parsed = JSON.parse(text) as ScriptOutput;
          // Validate structure
          if (typeof parsed.onTopic !== 'boolean') {
            throw new Error('Missing onTopic boolean in parsed script');
          }
          return {
            onTopic: parsed.onTopic,
            redirectMessage: parsed.redirectMessage || '',
            title: parsed.title || '',
            summary: parsed.summary || '',
            lines: Array.isArray(parsed.lines) ? parsed.lines : [],
            modelUsed: model,
          };
        } catch (jsonErr) {
          // If JSON parse failed, retry once if this was attempt 1
          if (attempt === 1) {
            continue;
          }
          throw new Error('Model produced invalid JSON structure: ' + String(jsonErr));
        }
      } catch (err) {
        lastError = err;

        if (is429Error(err)) {
          const customErr = new Error('Free limit reached. Wait a minute and try again.');
          (customErr as unknown as { statusCode: number }).statusCode = 429;
          throw customErr;
        }

        if (isModelUnavailableError(err)) {
          // Break inner loop to try next candidate model
          break;
        }

        // If non-recoverable and not JSON parse failure on attempt 1, continue
        if (attempt === 2) {
          break;
        }
      }
    }
  }

  if (lastError && is429Error(lastError)) {
    const customErr = new Error('Free limit reached. Wait a minute and try again.');
    (customErr as unknown as { statusCode: number }).statusCode = 429;
    throw customErr;
  }

  throw new Error(
    lastError instanceof Error
      ? lastError.message
      : 'Failed to generate script from available Gemini models'
  );
}
