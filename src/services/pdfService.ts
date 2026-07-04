import { REPORT_SECTIONS, REPORT_SECTION_LABELS, type AnalysisReport, type QuestionnaireData } from '@/types';
import { formatMarkdownLite } from '@/utils/markdown';

export class PdfServiceError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = 'PdfServiceError';
  }
}

function buildPrintableHtml(formData: QuestionnaireData, report: AnalysisReport): HTMLDivElement {
  const container = document.createElement('div');
  container.style.width = '760px';
  container.style.padding = '40px';
  container.style.fontFamily = "Georgia, 'Times New Roman', serif";
  container.style.color = '#14161A';

  const generatedDate = new Date(report.generatedAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const sectionsHtml = REPORT_SECTIONS.map((key, i) => {
    const body = formatMarkdownLite(report[key]);
    return `
      <div style="margin-bottom: 20px; page-break-inside: avoid;">
        <div style="font-size: 14px; font-weight: bold; color: #2947E5; margin-bottom: 6px;">
          ${i + 1}. ${REPORT_SECTION_LABELS[key]}
        </div>
        <div style="font-size: 12.5px; line-height: 1.55;">${body}</div>
      </div>`;
  }).join('');

  container.innerHTML = `
    <div style="border-bottom: 3px solid #2947E5; padding-bottom: 16px; margin-bottom: 24px;">
      <div style="font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; color: #2947E5; font-family: monospace;">
        AI System Analyzer — Business &amp; Systems Analysis Report
      </div>
      <div style="font-size: 26px; font-weight: bold; margin-top: 6px;">
        ${escapeHtml(String(formData.businessName || 'Client'))}
      </div>
      <div style="font-size: 13px; color: #5C5F66; margin-top: 4px;">
        Prepared for ${escapeHtml(String(formData.fullName || ''))} &middot; Generated ${generatedDate}
      </div>
    </div>
    ${sectionsHtml}
  `;

  return container;
}

function escapeHtml(str: string): string {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Renders the currently-displayed report DOM node (passed in from
 * ReportDisplay) to a downloadable PDF using html2pdf.js.
 */
export async function exportReportToPdf(
  reportElement: HTMLElement,
  companyName: string
): Promise<void> {
  let html2pdf: typeof import('html2pdf.js').default;
  try {
    html2pdf = (await import('html2pdf.js')).default;
  } catch (err) {
    throw new PdfServiceError('Could not load the PDF export module.', err);
  }

  const filename = `${(companyName || 'client').replace(/[^a-z0-9]+/gi, '-').toLowerCase()}-analysis-report.pdf`;

  try {
    await html2pdf()
      .set({
        margin: 12,
        filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
      })
      .from(reportElement)
      .save();
  } catch (err) {
    throw new PdfServiceError('PDF generation failed. Please try again.', err);
  }
}

/**
 * Builds a clean, print-ready off-screen version of the report (rather than
 * capturing the live themed UI, which may be in dark mode) and exports it.
 * This is the recommended entry point — call this instead of passing the
 * live card DOM directly, so PDFs stay legible regardless of theme.
 */
export async function exportPrintableReport(
  formData: QuestionnaireData,
  report: AnalysisReport
): Promise<void> {
  const node = buildPrintableHtml(formData, report);
  node.style.position = 'fixed';
  node.style.left = '-9999px';
  node.style.top = '0';
  document.body.appendChild(node);
  try {
    await exportReportToPdf(node, String(formData.businessName || 'client'));
  } finally {
    document.body.removeChild(node);
  }
}
