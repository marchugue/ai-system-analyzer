import { supabase } from '@/lib/supabaseClient';
import type { AnalysisReport, ClientAnalysisRow, QuestionnaireData } from '@/types';

export class SupabaseServiceError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = 'SupabaseServiceError';
  }
}

/** Pulls out a clean list of recommended feature/module strings for the jsonb column. */
function extractRecommendedFeatures(report: AnalysisReport): string[] {
  const source = `${report.recommendedModules}\n${report.priorityFeatures}`;
  return source
    .split('\n')
    .map((line) => line.replace(/^[\s\-*•\d.]+/, '').trim())
    .filter((line) => line.length > 0)
    .slice(0, 25);
}

/**
 * Saves the questionnaire answers + generated report to Supabase.
 * Non-fatal by design: the caller decides whether a save failure should
 * block the user from seeing their report (it shouldn't — see App.tsx).
 */
export async function saveAnalysis(
  formData: QuestionnaireData,
  report: AnalysisReport,
  pdfGenerated: boolean
): Promise<void> {
  const row: ClientAnalysisRow = {
    client_name: String(formData.fullName || ''),
    company_name: String(formData.businessName || ''),
    industry: String(formData.industry || ''),
    employee_count: String(formData.employeeCount || ''),
    questionnaire_data: formData,
    ai_summary: report.executiveSummary,
    recommended_system: report.recommendedSystem,
    recommended_features: extractRecommendedFeatures(report),
    full_ai_response: report.rawResponse,
    pdf_generated: pdfGenerated,
  };

  const { error } = await supabase.from('client_analyses').insert(row);

  if (error) {
    throw new SupabaseServiceError(`Could not save this analysis to Supabase: ${error.message}`, error);
  }
}
