import { REPORT_SECTIONS, REPORT_SECTION_LABELS, type AnalysisReport, type ReportSectionKey } from '@/types';

/**
 * Splits the AI's raw response into the 17 named sections.
 *
 * Expects headings shaped like "## 3. Current Challenges" (produced by the
 * SYSTEM_PROMPT in promptBuilder.ts), but falls back to matching on the
 * section's plain-text label if a model ignores the numbering instruction,
 * so the UI degrades gracefully instead of showing an empty card.
 */
export function parseReport(rawResponse: string): AnalysisReport {
  const sectionsByLabel = new Map<string, ReportSectionKey>();
  REPORT_SECTIONS.forEach((key) => sectionsByLabel.set(REPORT_SECTION_LABELS[key].toLowerCase(), key));

  // Matches "## 1. Executive Summary", "1. Executive Summary", "**1. Executive Summary**", etc.
  const headingRegex = /^#{0,3}\s*\**\s*(\d{1,2})\.\s*([A-Za-z][A-Za-z /&-]+?)\**\s*$/gm;

  type Match = { index: number; end: number; key: ReportSectionKey | null };
  const matches: Match[] = [];
  let m: RegExpExecArray | null;
  while ((m = headingRegex.exec(rawResponse)) !== null) {
    const label = m[2].trim().toLowerCase();
    const key = sectionsByLabel.get(label) ?? null;
    matches.push({ index: m.index, end: m.index + m[0].length, key });
  }

  const result = {} as AnalysisReport;
  REPORT_SECTIONS.forEach((key) => {
    result[key] = '';
  });

  if (matches.length === 0) {
    // No structured headings found at all — put everything in the executive summary
    // so the client still sees the AI's analysis rather than a blank report.
    result.executiveSummary = rawResponse.trim();
  } else {
    matches.forEach((match, i) => {
      if (!match.key) return;
      const start = match.end;
      const end = i + 1 < matches.length ? matches[i + 1].index : rawResponse.length;
      result[match.key] = rawResponse.slice(start, end).trim();
    });
  }

  result.rawResponse = rawResponse;
  result.generatedAt = new Date().toISOString();
  return result;
}
