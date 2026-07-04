import { forwardRef } from 'react';
import type { FieldValue, QuestionSection, QuestionnaireData } from '@/types';
import { FieldRenderer } from './FieldRenderer';
import { OTHER_SPECIFY_SUFFIX } from '@/data/questionnaireConfig';

interface FormSectionProps {
  section: QuestionSection;
  data: QuestionnaireData;
  errors: Record<string, string>;
  onChange: (fieldId: string, value: FieldValue) => void;
  onToggleMulti: (fieldId: string, option: string) => void;
}

export const FormSection = forwardRef<HTMLDivElement, FormSectionProps>(function FormSection(
  { section, data, errors, onChange, onToggleMulti },
  ref
) {
  return (
    <section ref={ref} id={section.id} className="card-surface animate-fadeUp p-6 sm:p-7">
      <div className="mb-5 flex items-baseline gap-3">
        <span className="section-tag">{section.code}</span>
      </div>
      <h2 className="font-display text-xl font-semibold text-ink dark:text-text-dark">{section.title}</h2>
      {section.description && (
        <p className="mt-1 text-sm text-text-soft dark:text-text-dark-soft">{section.description}</p>
      )}

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {section.fields.map((field) => (
          <div key={field.id} className={field.type === 'textarea' ? 'sm:col-span-2' : ''}>
            <FieldRenderer
              field={field}
              value={data[field.id]}
              otherValue={data[field.id + OTHER_SPECIFY_SUFFIX] as string | undefined}
              error={errors[field.id]}
              otherError={errors[field.id + OTHER_SPECIFY_SUFFIX]}
              onChange={onChange}
              onToggleMulti={onToggleMulti}
            />
          </div>
        ))}
      </div>
    </section>
  );
});
