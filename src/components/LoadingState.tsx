import { useEffect, useState } from 'react';

const STAGES = [
  'Reading questionnaire responses…',
  'Cross-referencing operations and challenges…',
  'Identifying root causes and opportunities…',
  'Drafting system and module recommendations…',
  'Compiling the final report…',
];

export function LoadingState() {
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setStageIndex((i) => Math.min(i + 1, STAGES.length - 1));
    }, 2200);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="container-page flex min-h-[70vh] flex-col items-center justify-center text-center">
      <div className="relative flex h-16 w-16 items-center justify-center">
        <span className="absolute h-full w-full animate-ping rounded-full bg-signal/20" />
        <span className="relative flex h-11 w-11 items-center justify-center rounded-full bg-signal font-mono text-sm font-bold text-white dark:bg-signal-dark">
          AI
        </span>
      </div>

      <span className="section-tag mt-6">Case File · Analysis in Progress</span>
      <h2 className="mt-2 font-display text-2xl font-semibold text-ink dark:text-text-dark">
        Building your analysis report
      </h2>

      <div className="mt-6 w-full max-w-sm">
        {STAGES.map((stage, i) => (
          <div
            key={stage}
            className={`flex items-center gap-3 py-1.5 text-sm transition-opacity duration-300 ${
              i <= stageIndex ? 'opacity-100' : 'opacity-30'
            }`}
          >
            <span
              className={`flex h-4 w-4 flex-none items-center justify-center rounded-full border text-[9px] font-bold ${
                i < stageIndex
                  ? 'border-ledger bg-ledger text-white'
                  : i === stageIndex
                    ? 'border-signal text-signal dark:border-signal-dark dark:text-signal-dark'
                    : 'border-line dark:border-linedark'
              }`}
            >
              {i < stageIndex ? '✓' : ''}
            </span>
            <span className="text-left text-ink dark:text-text-dark">{stage}</span>
          </div>
        ))}
      </div>

      <p className="field-hint mt-6 max-w-xs">
        This usually takes a few seconds. Please don't close this tab.
      </p>
    </div>
  );
}
