import { OTHER_SPECIFY_SUFFIX } from '@/data/questionnaireConfig';
import type { FieldValue, QuestionField } from '@/types';

const OTHER_LABEL = 'Other (Specify)';

interface FieldRendererProps {
  field: QuestionField;
  value: FieldValue | undefined;
  otherValue: string | undefined;
  error?: string;
  otherError?: string;
  onChange: (fieldId: string, value: FieldValue) => void;
  onToggleMulti: (fieldId: string, option: string) => void;
}

export function FieldRenderer({
  field,
  value,
  otherValue,
  error,
  otherError,
  onChange,
  onToggleMulti,
}: FieldRendererProps) {
  const showOtherInput =
    field.hasOtherSpecify &&
    (Array.isArray(value) ? value.includes(OTHER_LABEL) : value === OTHER_LABEL);

  const charCount = typeof value === 'string' ? value.length : 0;

  return (
    <div>
      <label className="field-label" htmlFor={field.id}>
        {field.label}
        {field.required && <span className="ml-1 text-alert">*</span>}
      </label>

      {field.type === 'text' && (
        <input
          id={field.id}
          type="text"
          value={(value as string) || ''}
          placeholder={field.placeholder}
          onChange={(e) => onChange(field.id, e.target.value)}
          className={`input-base ${error ? 'input-error' : ''}`}
        />
      )}

      {field.type === 'textarea' && (
        <div>
          <textarea
            id={field.id}
            rows={3}
            value={(value as string) || ''}
            placeholder={field.placeholder}
            maxLength={field.maxLength}
            onChange={(e) => onChange(field.id, e.target.value)}
            className={`input-base resize-y ${error ? 'input-error' : ''}`}
          />
          {field.maxLength && (
            <div className="field-hint text-right">
              {charCount}/{field.maxLength}
            </div>
          )}
        </div>
      )}

      {field.type === 'dropdown' && (
        <select
          id={field.id}
          value={(value as string) || ''}
          onChange={(e) => onChange(field.id, e.target.value)}
          className={`input-base appearance-none ${error ? 'input-error' : ''}`}
        >
          <option value="" disabled>
            Select an option…
          </option>
          {field.options?.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      )}

      {field.type === 'radio' && (
        <div className="flex flex-wrap gap-2">
          {field.options?.map((opt) => {
            const active = value === opt;
            return (
              <button
                type="button"
                key={opt}
                onClick={() => onChange(field.id, opt)}
                className={`chip ${active ? 'chip-active' : ''}`}
                aria-pressed={active}
              >
                {opt}
              </button>
            );
          })}
        </div>
      )}

      {(field.type === 'checkbox' || field.type === 'multiselect') && (
        <div className="flex flex-wrap gap-2">
          {field.options?.map((opt) => {
            const active = Array.isArray(value) && value.includes(opt);
            return (
              <button
                type="button"
                key={opt}
                onClick={() => onToggleMulti(field.id, opt)}
                className={`chip ${active ? 'chip-active' : ''}`}
                aria-pressed={active}
              >
                {opt}
              </button>
            );
          })}
        </div>
      )}

      {showOtherInput && (
        <input
          type="text"
          placeholder="Please specify…"
          value={otherValue || ''}
          onChange={(e) => onChange(field.id + OTHER_SPECIFY_SUFFIX, e.target.value)}
          className={`input-base mt-2 ${otherError ? 'input-error' : ''}`}
        />
      )}

      {(error || otherError) && (
        <p className="mt-1.5 text-xs font-medium text-alert">{error || otherError}</p>
      )}
      {field.helpText && !error && <p className="field-hint">{field.helpText}</p>}
    </div>
  );
}
