// ---------------------------------------------------------------------------
// Questionnaire schema types (data-driven form definition)
// ---------------------------------------------------------------------------

export type FieldType =
  | 'text'
  | 'textarea'
  | 'dropdown'
  | 'radio'
  | 'checkbox' // multi-select rendered as chip checkboxes
  | 'multiselect'; // multi-select rendered as chip toggles (alias of checkbox, kept distinct for intent)

export interface QuestionField {
  /** Unique key, also used as the field's key inside QuestionnaireData */
  id: string;
  label: string;
  type: FieldType;
  options?: string[];
  required?: boolean;
  /** Adds an auto-appearing "Other, please specify" text input when the user selects "Other (Specify)" */
  hasOtherSpecify?: boolean;
  maxLength?: number;
  placeholder?: string;
  helpText?: string;
}

export interface QuestionSection {
  id: string;
  code: string; // e.g. "SEC-01" — used as the mono section tag in the UI
  title: string;
  description?: string;
  fields: QuestionField[];
}

// ---------------------------------------------------------------------------
// Answer values
// ---------------------------------------------------------------------------

/** A single field's stored value. Multi-select fields store string[]. */
export type FieldValue = string | string[];

export interface QuestionnaireData {
  [fieldId: string]: FieldValue;
}

// ---------------------------------------------------------------------------
// AI Analysis Report
// ---------------------------------------------------------------------------

/** The 17 sections the AI prompt is instructed to produce, in order. */
export const REPORT_SECTIONS = [
  'executiveSummary',
  'businessOverview',
  'currentChallenges',
  'rootCauses',
  'opportunities',
  'recommendedSystem',
  'recommendedModules',
  'functionalRequirements',
  'nonFunctionalRequirements',
  'suggestedDatabaseEntities',
  'expectedBenefits',
  'developmentComplexity',
  'suggestedDevelopmentApproach',
  'priorityFeatures',
  'risksAndConsiderations',
  'implementationRecommendations',
  'finalRecommendation',
] as const;

export type ReportSectionKey = (typeof REPORT_SECTIONS)[number];

export const REPORT_SECTION_LABELS: Record<ReportSectionKey, string> = {
  executiveSummary: 'Executive Summary',
  businessOverview: 'Business Overview',
  currentChallenges: 'Current Challenges',
  rootCauses: 'Root Causes',
  opportunities: 'Opportunities for Improvement',
  recommendedSystem: 'Recommended Software System',
  recommendedModules: 'Recommended Modules',
  functionalRequirements: 'Functional Requirements',
  nonFunctionalRequirements: 'Non-Functional Requirements',
  suggestedDatabaseEntities: 'Suggested Database Entities',
  expectedBenefits: 'Expected Benefits',
  developmentComplexity: 'Development Complexity',
  suggestedDevelopmentApproach: 'Suggested Development Approach',
  priorityFeatures: 'Priority Features',
  risksAndConsiderations: 'Risks and Considerations',
  implementationRecommendations: 'Implementation Recommendations',
  finalRecommendation: 'Final Recommendation',
};

/** Groups sections into cards for the report UI, per the spec's card grouping. */
export const REPORT_CARD_GROUPS: { title: string; sections: ReportSectionKey[] }[] = [
  { title: 'Executive Summary', sections: ['executiveSummary', 'businessOverview'] },
  { title: 'Challenges', sections: ['currentChallenges', 'rootCauses', 'risksAndConsiderations'] },
  { title: 'Opportunities', sections: ['opportunities'] },
  { title: 'Recommended System', sections: ['recommendedSystem', 'recommendedModules', 'suggestedDatabaseEntities'] },
  { title: 'Features', sections: ['priorityFeatures'] },
  { title: 'Requirements', sections: ['functionalRequirements', 'nonFunctionalRequirements'] },
  { title: 'Benefits', sections: ['expectedBenefits', 'developmentComplexity'] },
  { title: 'Recommendations', sections: ['suggestedDevelopmentApproach', 'implementationRecommendations', 'finalRecommendation'] },
];

export type AnalysisReport = {
  [key in ReportSectionKey]: string;
} & {
  /** Full, unparsed AI response — kept for PDF export / debugging / Supabase logging */
  rawResponse: string;
  generatedAt: string;
};

// ---------------------------------------------------------------------------
// Supabase row shape (mirrors supabase/schema.sql)
// ---------------------------------------------------------------------------

export interface ClientAnalysisRow {
  id?: string;
  created_at?: string;
  client_name: string;
  company_name: string;
  industry: string;
  employee_count: string;
  questionnaire_data: QuestionnaireData;
  ai_summary: string;
  recommended_system: string;
  recommended_features: string[];
  full_ai_response: string;
  pdf_generated: boolean;
}

// ---------------------------------------------------------------------------
// UI / app state
// ---------------------------------------------------------------------------

export type ToastVariant = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  message: string;
  variant: ToastVariant;
}

export type AppStage = 'form' | 'analyzing' | 'report';
