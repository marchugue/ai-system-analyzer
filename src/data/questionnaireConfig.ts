import type { QuestionSection } from '@/types';

export const OTHER_SPECIFY_SUFFIX = '__other';

export const questionnaireConfig: QuestionSection[] = [
  {
    id: 'aboutBusiness',
    code: 'SEC-01',
    title: 'About Your Business',
    description: 'A quick snapshot of who you are and what you run.',
    fields: [
      { id: 'fullName', label: 'Full Name', type: 'text', required: true, placeholder: 'Juan Dela Cruz' },
      {
        id: 'businessName',
        label: 'Business / Organization Name',
        type: 'text',
        required: true,
        placeholder: 'e.g. Alijis Trading Co.',
      },
      {
        id: 'industry',
        label: 'Industry',
        type: 'dropdown',
        required: true,
        hasOtherSpecify: true,
        options: [
          'Retail', 'Education', 'Healthcare', 'Manufacturing', 'Logistics', 'Hospitality',
          'Restaurant', 'Government', 'Non-Profit', 'Real Estate', 'Construction',
          'Agriculture', 'Finance', 'Technology', 'E-Commerce', 'Other (Specify)',
        ],
      },
      {
        id: 'employeeCount',
        label: 'Number of Employees',
        type: 'dropdown',
        required: true,
        options: ['1–5', '6–20', '21–50', '51–100', '101–500', '500+'],
      },
      {
        id: 'organizationType',
        label: 'Organization Type',
        type: 'dropdown',
        required: true,
        hasOtherSpecify: true,
        options: [
          'Startup', 'Small Business', 'Medium Business', 'Large Enterprise', 'School',
          'Government Office', 'NGO', 'Other (Specify)',
        ],
      },
      {
        id: 'businessDescription',
        label: 'Brief Description',
        type: 'textarea',
        placeholder: 'Tell us about your organization.',
        maxLength: 600,
      },
    ],
  },
  {
    id: 'currentOperations',
    code: 'SEC-02',
    title: 'Current Operations',
    description: 'How things run today, before any new system.',
    fields: [
      {
        id: 'operationsManagement',
        label: 'How do you currently manage operations?',
        type: 'checkbox',
        hasOtherSpecify: true,
        options: [
          'Paper Records', 'Excel', 'Google Sheets', 'Email', 'Messenger', 'Existing Software',
          'Manual Tracking', 'Other (Specify)',
        ],
      },
      {
        id: 'currentSoftware',
        label: 'Which software do you currently use?',
        type: 'checkbox',
        hasOtherSpecify: true,
        options: [
          'Microsoft Office', 'Google Workspace', 'QuickBooks', 'SAP', 'Oracle',
          'Custom Software', 'None', 'Other (Specify)',
        ],
      },
      {
        id: 'timeConsumingTasks',
        label: 'What tasks take the most time each day?',
        type: 'textarea',
        maxLength: 600,
      },
      {
        id: 'manualTasks',
        label: 'Which tasks are still done manually?',
        type: 'textarea',
        maxLength: 600,
      },
    ],
  },
  {
    id: 'challenges',
    code: 'SEC-03',
    title: 'Challenges and Problems',
    description: 'What is actually getting in the way.',
    fields: [
      {
        id: 'frequentProblems',
        label: 'What problems do you frequently experience?',
        type: 'checkbox',
        hasOtherSpecify: true,
        options: [
          'Slow Processes', 'Data Entry Errors', 'Lost Records', 'Duplicate Records',
          'Poor Communication', 'Difficulty Tracking Activities', 'Delayed Reports',
          'Inventory Issues', 'Scheduling Problems', 'Approval Delays', 'Customer Complaints',
          'Lack of Automation', 'Other (Specify)',
        ],
      },
      {
        id: 'improvementArea',
        label: 'Which area needs the most improvement?',
        type: 'dropdown',
        hasOtherSpecify: true,
        options: [
          'Inventory Management', 'Employee Management', 'Customer Management', 'Sales Tracking',
          'Accounting', 'Reporting', 'Scheduling', 'Communication', 'Document Management',
          'Project Management', 'Other (Specify)',
        ],
      },
      {
        id: 'additionalChallenges',
        label: 'Additional Challenges',
        type: 'textarea',
        maxLength: 600,
      },
    ],
  },
  {
    id: 'records',
    code: 'SEC-04',
    title: 'Records and Information',
    description: 'Where information lives, and how reliable it is.',
    fields: [
      {
        id: 'recordStorage',
        label: 'How are records currently stored?',
        type: 'dropdown',
        hasOtherSpecify: true,
        options: [
          'Paper Files', 'Excel', 'Google Sheets', 'Shared Drive', 'Database System',
          'Multiple Systems', 'Other (Specify)',
        ],
      },
      {
        id: 'infoFindEase',
        label: 'How easy is it to find information?',
        type: 'radio',
        options: ['Very Easy', 'Easy', 'Moderate', 'Difficult', 'Very Difficult'],
      },
      {
        id: 'lostRecords',
        label: 'Have you experienced lost records?',
        type: 'radio',
        options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'],
      },
    ],
  },
  {
    id: 'reporting',
    code: 'SEC-05',
    title: 'Reporting',
    description: 'How reports get made, and how painful that is.',
    fields: [
      {
        id: 'reportFrequency',
        label: 'How often are reports generated?',
        type: 'dropdown',
        options: ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly', 'Rarely'],
      },
      {
        id: 'reportPreparationDifficulty',
        label: 'Preparing reports is:',
        type: 'radio',
        options: ['Very Easy', 'Easy', 'Moderate', 'Difficult', 'Very Difficult'],
      },
      {
        id: 'desiredReports',
        label: 'What reports would you like easier access to?',
        type: 'textarea',
        maxLength: 600,
      },
    ],
  },
  {
    id: 'communication',
    code: 'SEC-06',
    title: 'Communication',
    description: 'How your team talks to each other and to clients.',
    fields: [
      {
        id: 'communicationMethods',
        label: 'How does your team communicate?',
        type: 'checkbox',
        hasOtherSpecify: true,
        options: [
          'Face-to-Face', 'Phone Calls', 'Email', 'Messenger', 'WhatsApp', 'Slack',
          'Microsoft Teams', 'Other (Specify)',
        ],
      },
      {
        id: 'communicationDelays',
        label: 'Are communication delays a problem?',
        type: 'radio',
        options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'],
      },
      {
        id: 'communicationChallenges',
        label: 'Additional communication challenges',
        type: 'textarea',
        maxLength: 600,
      },
    ],
  },
  {
    id: 'futureGoals',
    code: 'SEC-07',
    title: 'Future Goals',
    description: 'Where you want this to end up.',
    fields: [
      {
        id: 'desiredSystemTypes',
        label: 'What type of system would help most?',
        type: 'checkbox',
        hasOtherSpecify: true,
        options: [
          'Inventory Management System', 'Point of Sale System', 'Employee Management System',
          'CRM', 'Accounting System', 'Learning Management System', 'Appointment System',
          'Reservation System', 'Project Management System', 'Document Management System',
          'E-Commerce Platform', 'Mobile Application', 'Other (Specify)',
        ],
      },
      {
        id: 'topPriorities',
        label: 'Top Priorities',
        type: 'checkbox',
        hasOtherSpecify: true,
        options: [
          'Save Time', 'Reduce Errors', 'Improve Reporting', 'Better Communication',
          'Better Customer Service', 'Automation', 'Centralized Records', 'Business Growth',
          'Data Security', 'Cost Reduction', 'Other (Specify)',
        ],
      },
      {
        id: 'budgetRange',
        label: 'Desired Budget Range',
        type: 'dropdown',
        options: ['Under $500', '$500–$2,000', '$2,000–$5,000', '$5,000–$10,000', '$10,000+'],
      },
      {
        id: 'additionalNotes',
        label: 'Additional Notes',
        type: 'textarea',
        maxLength: 600,
      },
    ],
  },
];

export const TOTAL_REQUIRED_FIELDS = questionnaireConfig
  .flatMap((s) => s.fields)
  .filter((f) => f.required).length;
