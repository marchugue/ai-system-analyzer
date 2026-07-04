import { questionnaireConfig } from '@/data/questionnaireConfig';
import type { QuestionnaireData } from '@/types';
import { OTHER_SPECIFY_SUFFIX } from '@/data/questionnaireConfig';

const OTHER_OPTION_LABEL = 'Other (Specify)';

/**
 * Validates the questionnaire data against the config's required flags.
 * Also requires the "Other" free-text field to be filled whenever
 * "Other (Specify)" was selected on a field that supports it.
 */
export function validateQuestionnaire(data: QuestionnaireData): Record<string, string> {
  const errors: Record<string, string> = {};

  for (const section of questionnaireConfig) {
    for (const field of section.fields) {
      const value = data[field.id];

      if (field.required) {
        const isEmpty = Array.isArray(value) ? value.length === 0 : !value || !value.trim();
        if (isEmpty) {
          errors[field.id] = `${field.label} is required.`;
          continue;
        }
      }

      if (field.hasOtherSpecify) {
        const selectedOther = Array.isArray(value)
          ? value.includes(OTHER_OPTION_LABEL)
          : value === OTHER_OPTION_LABEL;
        if (selectedOther) {
          const otherValue = data[field.id + OTHER_SPECIFY_SUFFIX];
          if (!otherValue || !String(otherValue).trim()) {
            errors[field.id + OTHER_SPECIFY_SUFFIX] = `Please specify "${field.label}".`;
          }
        }
      }
    }
  }

  return errors;
}
