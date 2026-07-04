import { DarkModeToggle } from './ui/DarkModeToggle';

interface HeaderProps {
  isDark: boolean;
  onToggleDark: () => void;
}

export function Header({ isDark, onToggleDark }: HeaderProps) {
  return (
    <header className="container-page flex items-center justify-between pt-8 pb-2">
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-signal font-mono text-xs font-bold text-white dark:bg-signal-dark">
          AI
        </div>
        <div>
          <div className="font-display text-[15px] font-semibold leading-none text-ink dark:text-text-dark">
            System Analyzer
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-text-soft dark:text-text-dark-soft">
            Requirements &amp; Analysis Tool
          </div>
        </div>
      </div>
      <DarkModeToggle isDark={isDark} onToggle={onToggleDark} />
    </header>
  );
}
