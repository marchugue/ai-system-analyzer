import { useState } from 'react';
import { Header } from '@/components/Header';
import { QuestionnaireForm } from '@/components/questionnaire/QuestionnaireForm';
import { LoadingState } from '@/components/LoadingState';
import { ReportDisplay } from '@/components/report/ReportDisplay';
import { ToastContainer } from '@/components/ui/Toast';
import { useDarkMode } from '@/hooks/useDarkMode';
import { useToast } from '@/hooks/useToast';
import { QUESTIONNAIRE_STORAGE_KEY } from '@/hooks/useQuestionnaire';
import { analyzeRequirements, AIServiceError } from '@/services/aiService';
import { saveAnalysis, SupabaseServiceError } from '@/services/supabaseService';
import type { AnalysisReport, AppStage, QuestionnaireData } from '@/types';

export default function App() {
  const { isDark, toggle } = useDarkMode();
  const { toasts, showToast, dismiss } = useToast();

  const [stage, setStage] = useState<AppStage>('form');
  const [formKey, setFormKey] = useState(0);
  const [submittedData, setSubmittedData] = useState<QuestionnaireData | null>(null);
  const [report, setReport] = useState<AnalysisReport | null>(null);

  const handleSubmit = async (data: QuestionnaireData) => {
    setSubmittedData(data);
    setStage('analyzing');

    try {
      const result = await analyzeRequirements(data);
      setReport(result);
      setStage('report');
      showToast('Analysis generated successfully.', 'success');

      // Save is fire-and-forget from the user's point of view — a failed
      // save should never hide the report they're already looking at.
      saveAnalysis(data, result, false)
        .then(() => showToast('Saved to your records.', 'info'))
        .catch((err) => {
          const message =
            err instanceof SupabaseServiceError ? err.message : 'Could not save this analysis to Supabase.';
          showToast(message, 'error');
        });
    } catch (err) {
      const message =
        err instanceof AIServiceError ? err.message : 'Something went wrong while generating your analysis.';
      showToast(message, 'error');
      setStage('form');
    }
  };

  const handleValidationError = () => {
    showToast('Please fill in the required fields before generating your analysis.', 'error');
  };

  const handleStartNew = () => {
    try {
      window.localStorage.removeItem(QUESTIONNAIRE_STORAGE_KEY);
    } catch {
      // ignore — worst case the old draft reappears, which is harmless
    }
    setReport(null);
    setSubmittedData(null);
    setStage('form');
    setFormKey((k) => k + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      <Header isDark={isDark} onToggleDark={toggle} />

      {stage === 'form' && (
        <QuestionnaireForm key={formKey} onSubmit={handleSubmit} onValidationError={handleValidationError} />
      )}

      {stage === 'analyzing' && <LoadingState />}

      {stage === 'report' && report && submittedData && (
        <ReportDisplay formData={submittedData} report={report} onStartNew={handleStartNew} onToast={showToast} />
      )}

      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}
