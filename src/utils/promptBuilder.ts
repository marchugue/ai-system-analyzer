import { questionnaireConfig } from '@/data/questionnaireConfig';
import { REPORT_SECTION_LABELS, REPORT_SECTIONS } from '@/types';
import type { QuestionnaireData } from '@/types';
import { OTHER_SPECIFY_SUFFIX } from '@/data/questionnaireConfig';

/** System prompt — the exact analyst persona + task instructions from the spec. */
export const SYSTEM_PROMPT = `You are a highly experienced Senior Business Analyst and Senior Systems Analyst.

Analyze the client's responses.

Use both the structured answers and written responses.

Generate a complete report with these 17 sections, in this exact order, each starting with a
markdown heading in the exact format "## N. Section Title" (N = section number) so the report can
be parsed programmatically. Do not skip a section, and do not add sections that are not listed:

${REPORT_SECTIONS.map((key, i) => `${i + 1}. ${REPORT_SECTION_LABELS[key]}`).join('\n')}

Use professional language suitable for technical and non-technical stakeholders.
Provide practical and realistic recommendations grounded specifically in what the client wrote —
avoid generic filler that could apply to any business.`;

/** Renders the client's answers as a readable, labeled block for the AI to analyze. */
export function buildPrompt(formData: QuestionnaireData): string {
  const lines: string[] = ['# Client Questionnaire Responses', ''];

  for (const section of questionnaireConfig) {
    lines.push(`## ${section.title}`);
    for (const field of section.fields) {
      const raw = formData[field.id];
      if (raw === undefined || raw === null || (Array.isArray(raw) && raw.length === 0) || raw === '') {
        continue;
      }
      let display: string;
      if (Array.isArray(raw)) {
        display = raw
          .map((v) => (v === 'Other (Specify)' ? formData[field.id + OTHER_SPECIFY_SUFFIX] || v : v))
          .join(', ');
      } else if (raw === 'Other (Specify)') {
        display = String(formData[field.id + OTHER_SPECIFY_SUFFIX] || raw);
      } else {
        display = String(raw);
      }
      lines.push(`- ${field.label}: ${display}`);
    }
    lines.push('');
  }

  return lines.join('\n');
}
