import { useState } from 'react';
import { REPORT_CARD_GROUPS, REPORT_SECTIONS, REPORT_SECTION_LABELS } from '@/types';
import type { AnalysisReport, QuestionnaireData } from '@/types';
import { ReportCard } from './ReportCard';
import { exportPrintableReport, PdfServiceError } from '@/services/pdfService';

interface ReportDisplayProps {
  formData: QuestionnaireData;
  report: AnalysisReport;
  onStartNew: () => void;
  onToast: (message: string, variant: 'success' | 'error' | 'info') => void;
}

/** Builds a clean plain-text version of the full report for the Copy button. */
function buildPlainTextReport(formData: QuestionnaireData, report: AnalysisReport): string {
  const header = [
    'AI SYSTEM ANALYZER — BUSINESS & SYSTEMS ANALYSIS REPORT',
    `Client: ${formData.fullName || ''}`,
    `Company: ${formData.businessName || ''}`,
    `Generated: ${new Date(report.generatedAt).toLocaleString()}`,
    ''.padEnd(60, '='),
    '',
  ].join('\n');

  const body = REPORT_SECTIONS.map(
    (key, i) => `${i + 1}. ${REPORT_SECTION_LABELS[key].toUpperCase()}\n${'-'.repeat(40)}\n${report[key] || 'N/A'}\n`
  ).join('\n');

  return header + body;
}

export function ReportDisplay({ formData, report, onStartNew, onToast }: ReportDisplayProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [isCopying, setIsCopying] = useState(false);

  const handleCopy = async () => {
    setIsCopying(true);
    try {
      await navigator.clipboard.writeText(buildPlainTextReport(formData, report));
      onToast('Report copied to clipboard.', 'success');
    } catch {
      onToast('Could not copy the report. Your browser may be blocking clipboard access.', 'error');
    } finally {
      setIsCopying(false);
    }
  };

  const handleExportPdf = async () => {
    setIsExporting(true);
    try {
      await exportPrintableReport(formData, report);
      onToast('PDF exported.', 'success');
    } catch (err) {
      const message = err instanceof PdfServiceError ? err.message : 'PDF export failed. Please try again.';
      onToast(message, 'error');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="container-page flex flex-col gap-6 py-8">
      <div className="card-surface flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
        <div className="flex items-center gap-4">
          <div className="animate-stamp flex h-14 w-14 flex-none -rotate-2 items-center justify-center rounded-full border-[3px] border-ledger font-mono text-[10px] font-bold uppercase leading-tight text-ledger dark:border-ledger-dark dark:text-ledger-dark">
            Report<br />Ready
          </div>
          <div>
            <span className="section-tag">Analysis Complete</span>
            <h2 className="font-display text-xl font-semibold text-ink dark:text-text-dark">
              {String(formData.businessName || 'Your organization')}
            </h2>
            <p className="field-hint">Generated {new Date(report.generatedAt).toLocaleString()}</p>
          </div>
        </div>

        <div className="flex flex-none flex-wrap gap-2.5">
          <button type="button" className="btn-secondary" onClick={handleCopy} disabled={isCopying}>
            {isCopying ? 'Copying…' : 'Copy report'}
          </button>
          <button type="button" className="btn-primary" onClick={handleExportPdf} disabled={isExporting}>
            {isExporting ? 'Exporting…' : 'Export PDF'}
          </button>
        </div>
      </div>

      {REPORT_CARD_GROUPS.map((group, i) => (
        <ReportCard key={group.title} index={i} title={group.title} sections={group.sections} report={report} />
      ))}

      <div className="flex justify-center pt-2 pb-6">
        <button type="button" className="btn-ghost" onClick={onStartNew}>
          ← Start a new analysis
        </button>
      </div>
    </div>
  );
}
