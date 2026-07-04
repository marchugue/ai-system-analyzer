# AI System Analyzer

A one-page tool that turns a structured client questionnaire into an AI-generated
business & systems analysis report — built for consultants, business/systems
analysts, and capstone students who need to gather requirements and produce a
professional recommendation report without writing one by hand.

No login. No admin panel (yet — see below). Client fills the form → Groq
analyzes the answers → a report renders on screen → the submission and report
are saved to Supabase automatically.

---

## Tech stack

- React 18 + TypeScript + Vite
- Tailwind CSS
- Supabase (`@supabase/supabase-js`) for storage
- Groq's Chat Completions API for the AI analysis
- `html2pdf.js` for PDF export

---

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Then fill in `.env`:

| Variable                 | Where to get it                                                        |
| ------------------------ | ------------------------------------------------------------------------ |
| `VITE_SUPABASE_URL`      | Supabase project → Settings → API                                      |
| `VITE_SUPABASE_ANON_KEY` | Supabase project → Settings → API (the **anon/public** key, not `service_role`) |
| `VITE_API_ENDPOINT`      | `https://api.groq.com/openai/v1/chat/completions`                      |
| `VITE_API_KEY`           | [console.groq.com/keys](https://console.groq.com/keys)                 |
| `VITE_MODEL_NAME`        | `openai/gpt-oss-120b` (recommended) or `openai/gpt-oss-20b` (faster)    |

> Groq retired `llama-3.3-70b-versatile` and `llama-3.1-8b-instant`. If a
> model name in these instructions is ever out of date, check
> [console.groq.com/docs/models](https://console.groq.com/docs/models) for
> the current list before assuming the app is broken.

### 3. Set up the database

In your Supabase project's SQL Editor, run `supabase/schema.sql`. It creates
the `client_analyses` table and the row-level-security policies described
below.

### 4. Run it

```bash
npm run dev
```

---

## Current features

- **Smart questionnaire** — 7 sections, ~30 questions, mixing text inputs,
  dropdowns, radio groups, multi-select chips, textareas with character
  counters, and "Other (Please Specify)" follow-ups.
- **Auto-save** — every answer is written to `localStorage` as you type and
  restored automatically if you reload or close the tab.
- **AI analysis** — on submit, all answers are sent to Groq with a system
  prompt that produces a 17-section business & systems analysis (executive
  summary, root causes, recommended system and modules, functional /
  non-functional requirements, database entities, risks, final
  recommendation, and more).
- **Report display** — the 17 sections are grouped into 8 reader-friendly
  cards (Executive Summary, Challenges, Opportunities, Recommended System,
  Features, Requirements, Benefits, Recommendations), each rendered from the
  AI's markdown.
- **Copy report** — copies a clean plain-text version of the full report to
  the clipboard.
- **PDF export** — generates a formatted, business-style PDF (client name,
  company, date, full analysis) using `html2pdf.js`, built from an
  off-screen light-themed copy of the report so it stays legible in PDF form
  even if the site is in dark mode.
- **Supabase logging** — every generated report is saved to
  `client_analyses` automatically, with no user action required.
- **Dark mode**, toast notifications, inline validation, an error boundary,
  and a mobile-responsive layout throughout.

---

## Wiring in your real AI provider

`src/services/aiService.ts` already targets Groq's real, documented
Chat Completions endpoint (`https://api.groq.com/openai/v1/chat/completions`,
OpenAI-compatible request/response shape). If you switch providers later,
that file is the only place you need to touch — update the fetch call to
match your provider's request/response format and keep `analyzeRequirements()`
returning an `AnalysisReport` (see `src/utils/reportParser.ts`).

### Hardening the AI call for production

Because this is a Vite app with no backend, `VITE_API_KEY` is bundled into
the client-side JavaScript — anyone can read it from the browser's network
tab or source once the site is deployed. That's an acceptable trade-off for
a prototype or capstone demo, but not for a real public deployment.

Before going further than that, put the Groq call behind a small server
component that holds the real key, for example a **Supabase Edge Function**:

1. Create an Edge Function (`supabase functions new analyze`) that reads the
   questionnaire payload, calls Groq server-side using a secret stored with
   `supabase secrets set GROQ_API_KEY=...`, and returns the AI's response.
2. Replace the `fetch(API_ENDPOINT, ...)` call in `aiService.ts` with a call
   to your function's URL — no API key travels to the browser at all.

---

## Future admin dashboard

The spec for this project deliberately excludes an admin panel. Here's the
recommended path for building one later.

### Suggested authentication

- Supabase Auth with email/password login for analysts/staff.
- Protected routes that redirect unauthenticated users to `/login`.
- Role-based access (e.g. an `analyst` vs `admin` role) if you need to
  separate who can view submissions from who can delete them.

### Suggested routes

| Route                | Purpose                                   |
| --------------------- | ------------------------------------------ |
| `/dashboard`          | Overview: recent submissions, quick stats |
| `/submissions`        | Searchable, filterable list of all analyses |
| `/submissions/:id`    | Full report view for one submission, with export/download |
| `/settings`           | Manage AI provider config, team members, etc. |

### Suggested future database fields

Add these to `client_analyses` (or a related table) once the dashboard needs
to track follow-up work:

- `status` (e.g. `new`, `in_review`, `contacted`, `closed`)
- `analyst_notes` (free text, internal only)
- `follow_up_required` (boolean)
- `contact_email` (if you start collecting it on the form)
- `project_priority` (e.g. `low` / `medium` / `high`)
- `estimated_budget` (numeric, distinct from the client's self-reported range)

### Dashboard feature checklist

- View all submissions in a table, paginated
- Search by client/company name
- Filter by date range and by industry
- Open a single submission's full report
- Download a submission's report as PDF
- Delete a record (should require the `admin` role, not just `analyst`)
- Export the current filtered view to CSV

### Row-level security for the dashboard

The current RLS setup (see `supabase/schema.sql`) lets the public `anon` key
insert rows but never read, update, or delete them — that's what keeps one
client's data private from another today. When you add the dashboard, add a
policy scoped to `authenticated` users instead of loosening the `anon`
policy:

```sql
create policy "Staff can read analyses"
  on public.client_analyses
  for select
  to authenticated
  using (true);
```

---

## Project structure

```
src/
  types/                TypeScript interfaces (questionnaire schema, report shape, DB row)
  data/
    questionnaireConfig.ts   All 7 sections + fields, data-driven (add a question by editing this file)
  hooks/
    useQuestionnaire.ts  Answers state, validation, progress, auto-save
    useLocalStorage.ts   Generic localStorage-backed state
    useDarkMode.ts       Theme toggle + persistence
    useToast.ts          Toast notification queue
  services/
    aiService.ts         Groq API call + error handling
    supabaseService.ts   Saves the questionnaire + report to Supabase
    pdfService.ts        Builds a printable report and exports it via html2pdf.js
  utils/
    promptBuilder.ts     Turns answers into the AI prompt (system + user messages)
    reportParser.ts      Splits the AI's raw text into the 17 structured sections
    markdown.ts          Minimal markdown-to-HTML for rendering AI output
    validation.ts        Required-field + "Other, please specify" validation
  components/
    questionnaire/       Data-driven form renderer (FieldRenderer, FormSection, QuestionnaireForm)
    report/               ReportCard, ReportDisplay
    ui/                   Toast, ProgressBar, DarkModeToggle, ErrorBoundary
  App.tsx                 Stage orchestration: form → analyzing → report
  main.tsx                Entry point
supabase/
  schema.sql              Table definition + RLS policies
```

Add a new question by adding one object to the relevant section in
`src/data/questionnaireConfig.ts` — the form, validation, progress bar, and
AI prompt all pick it up automatically.
