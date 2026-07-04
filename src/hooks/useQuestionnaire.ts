import { useMemo, useState } from 'react';
import { questionnaireConfig } from '@/data/questionnaireConfig';
import { useLocalStorage } from './useLocalStorage';
import type { FieldValue, QuestionnaireData } from '@/types';
import { validateQuestionnaire } from '@/utils/validation';

export const QUESTIONNAIRE_STORAGE_KEY = 'ai-system-analyzer:questionnaire-data';
const STORAGE_KEY = QUESTIONNAIRE_STORAGE_KEY;

export function useQuestionnaire() {
  const [data, setData, clearStoredData] = useLocalStorage<QuestionnaireData>(STORAGE_KEY, {});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const setField = (fieldId: string, value: FieldValue) => {
    setData((prev) => ({ ...prev, [fieldId]: value }));
    setTouched((prev) => ({ ...prev, [fieldId]: true }));
    setErrors((prev) => {
      if (!prev[fieldId]) return prev;
      const next = { ...prev };
      delete next[fieldId];
      return next;
    });
  };

  const toggleMultiValue = (fieldId: string, option: string) => {
    setData((prev) => {
      const current = Array.isArray(prev[fieldId]) ? (prev[fieldId] as string[]) : [];
      const next = current.includes(option)
        ? current.filter((v) => v !== option)
        : [...current, option];
      return { ...prev, [fieldId]: next };
    });
    setTouched((prev) => ({ ...prev, [fieldId]: true }));
  };

  const allFields = useMemo(() => questionnaireConfig.flatMap((s) => s.fields), []);

  const requiredCount = useMemo(() => allFields.filter((f) => f.required).length, [allFields]);

  const filledRequiredCount = useMemo(() => {
    return allFields.filter((f) => {
      if (!f.required) return false;
      const v = data[f.id];
      if (Array.isArray(v)) return v.length > 0;
      return typeof v === 'string' && v.trim().length > 0;
    }).length;
  }, [allFields, data]);

  // Progress counts every answered field (not just required) against the total,
  // so the bar reflects real completion effort, not just the minimum to submit.
  const progress = useMemo(() => {
    const answered = allFields.filter((f) => {
      const v = data[f.id];
      if (Array.isArray(v)) return v.length > 0;
      return typeof v === 'string' && v.trim().length > 0;
    }).length;
    return allFields.length === 0 ? 0 : Math.round((answered / allFields.length) * 100);
  }, [allFields, data]);

  /** Validates and returns the fresh errors map directly (don't rely on the
   * `errors` state value right after calling this — state updates are async,
   * so a caller that needs the result immediately, e.g. to scroll to the
   * first invalid field, should use this return value instead). */
  const validate = (): Record<string, string> => {
    const newErrors = validateQuestionnaire(data);
    setErrors(newErrors);
    return newErrors;
  };

  const clearForm = () => {
    clearStoredData();
    setErrors({});
    setTouched({});
  };

  return {
    data,
    setField,
    toggleMultiValue,
    errors,
    touched,
    validate,
    clearForm,
    progress,
    requiredCount,
    filledRequiredCount,
  };
}
