import { useEffect, useRef, useState } from 'react';
import { questionnaireConfig } from '@/data/questionnaireConfig';
import { useQuestionnaire } from '@/hooks/useQuestionnaire';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { FormSection } from './FormSection';
import type { QuestionnaireData } from '@/types';

interface QuestionnaireFormProps {
  onSubmit: (data: QuestionnaireData) => void;
  onValidationError: () => void;
}

export function QuestionnaireForm({ onSubmit, onValidationError }: QuestionnaireFormProps) {
  const { data, setField, toggleMultiValue, errors, validate, clearForm, progress, filledRequiredCount, requiredCount } =
    useQuestionnaire();

  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [activeSectionId, setActiveSectionId] = useState(questionnaireConfig[0]?.id ?? '');

  const scrollToSection = (id: string) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Scroll-spy: highlight whichever section is nearest the top of the
  // viewport so the rail at the top always reflects where you actually are.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target.id) {
          setActiveSectionId(visible[0].target.id);
        }
      },
      { rootMargin: '-120px 0px -60% 0px', threshold: 0 }
    );

    Object.values(sectionRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleSubmit = () => {
    const freshErrors = validate();
    if (Object.keys(freshErrors).length > 0) {
      onValidationError();
      // Jump to the first section that has an error so the person doesn't
      // have to hunt for it manually.
      const firstErrorField = Object.keys(freshErrors)[0];
      const owningSection = questionnaireConfig.find((s) =>
        s.fields.some((f) => f.id === firstErrorField || f.id + '__other' === firstErrorField)
      );
      if (owningSection) scrollToSection(owningSection.id);
      return;
    }
    onSubmit(data);
  };

  return (
    <div>
      <ProgressBar progress={progress} activeSectionId={activeSectionId} onJump={scrollToSection} />

      <div className="container-page flex flex-col gap-6 py-8">
        {questionnaireConfig.map((section) => (
          <FormSection
            key={section.id}
            ref={(el) => {
              sectionRefs.current[section.id] = el;
            }}
            section={section}
            data={data}
            errors={errors}
            onChange={setField}
            onToggleMulti={toggleMultiValue}
          />
        ))}

        <div className="card-surface flex flex-col items-center gap-4 p-6 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <p className="text-sm font-medium text-ink dark:text-text-dark">
              {filledRequiredCount}/{requiredCount} required fields complete
            </p>
            <p className="field-hint">Your answers auto-save to this browser as you go.</p>
          </div>
          <div className="flex gap-2.5">
            <button type="button" className="btn-secondary" onClick={clearForm}>
              Clear form
            </button>
            <button type="button" className="btn-primary" onClick={handleSubmit}>
              Generate analysis
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
