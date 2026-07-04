import { questionnaireConfig } from '@/data/questionnaireConfig';

interface ProgressBarProps {
  progress: number;
  activeSectionId: string;
  onJump: (sectionId: string) => void;
}

export function ProgressBar({ progress, activeSectionId, onJump }: ProgressBarProps) {
  return (
    <div className="sticky top-0 z-30 border-b border-line bg-paper/90 backdrop-blur-md dark:border-linedark dark:bg-base-dark/90">
      <div className="container-page py-3">
        <div className="flex items-center justify-between">
          <span className="section-tag">Case File · {progress}% complete</span>
          <span className="font-mono text-[11px] text-text-soft dark:text-text-dark-soft">
            {questionnaireConfig.length} sections
          </span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-line dark:bg-linedark">
          <div
            className="h-full rounded-full bg-signal transition-all duration-300 dark:bg-signal-dark"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-3 flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {questionnaireConfig.map((section) => (
            <button
              key={section.id}
              onClick={() => onJump(section.id)}
              className={`flex-none rounded-full border px-3 py-1 font-mono text-[10.5px] tracking-wide transition-colors ${
                activeSectionId === section.id
                  ? 'border-signal bg-signal text-white dark:border-signal-dark dark:bg-signal-dark'
                  : 'border-line text-text-soft hover:border-signal/50 dark:border-linedark dark:text-text-dark-soft'
              }`}
            >
              {section.code}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
