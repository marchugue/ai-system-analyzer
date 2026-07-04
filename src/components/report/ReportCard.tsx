import { REPORT_SECTION_LABELS, type AnalysisReport, type ReportSectionKey } from '@/types';
import { formatMarkdownLite } from '@/utils/markdown';

interface ReportCardProps {
  index: number;
  title: string;
  sections: ReportSectionKey[];
  report: AnalysisReport;
}

export function ReportCard({ index, title, sections, report }: ReportCardProps) {
  return (
    <article className="card-surface animate-fadeUp overflow-hidden p-6 sm:p-7" style={{ animationDelay: `${index * 60}ms` }}>
      <div className="mb-4 flex items-baseline gap-3">
        <span className="section-tag">§{String(index + 1).padStart(2, '0')}</span>
        <h3 className="font-display text-lg font-semibold text-ink dark:text-text-dark">{title}</h3>
      </div>

      <div className="flex flex-col gap-5">
        {sections.map((key) => (
          <div key={key}>
            {sections.length > 1 && (
              <h4 className="mb-1.5 font-mono text-[11px] uppercase tracking-wide text-text-soft dark:text-text-dark-soft">
                {REPORT_SECTION_LABELS[key]}
              </h4>
            )}
            <div
              className="prose-report text-sm leading-relaxed text-ink dark:text-text-dark [&_h4]:font-display [&_li]:ml-1 [&_strong]:font-semibold"
              dangerouslySetInnerHTML={{ __html: formatMarkdownLite(report[key]) }}
            />
          </div>
        ))}
      </div>
    </article>
  );
}
