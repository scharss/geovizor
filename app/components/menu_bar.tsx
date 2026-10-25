import { memo, type ReactNode } from 'react';
import { useT } from 'app/lib/i18n';
import { LanguageSwitcher } from './language_switcher';

export const MenuBar = memo(function MenuBar({
  children
}: {
  children?: ReactNode;
}) {
  const t = useT();

  return (
    <header className="relative z-30 flex h-14 shrink-0 items-center gap-3 border-b border-white/5 bg-ink-900/95 px-4 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <div className="relative h-8 w-8 rounded-[11px] bg-gradient-to-br from-mint-300 to-mint-600 shadow-[0_0_24px_rgba(45,212,191,0.2)]">
          <div className="absolute inset-[5px] rounded-[7px] border border-ink-900/60" />
          <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink-900" />
        </div>
        <div className="flex flex-col leading-none">
          <span className="text-[15px] font-semibold tracking-tight text-slate-100">
            geovizor
          </span>
          <span className="mt-1 text-[9px] font-semibold uppercase tracking-[0.22em] text-slate-500">
            {t('Map workspace')}
          </span>
        </div>
      </div>

      <div className="mx-3 h-6 w-px bg-white/5" />

      <span className="hidden items-center gap-2 text-xs text-slate-400 sm:flex">
        <span className="h-1.5 w-1.5 rounded-full bg-mint-400 shadow-[0_0_10px_rgba(45,212,191,0.8)]" />
        FeatureCollection
      </span>

      <div className="flex-1" />

      <div className="flex items-center gap-2">
        <LanguageSwitcher />
        <div className="mx-1 hidden h-5 w-px bg-white/5 sm:block" />
        <div className="flex items-center gap-1.5">{children}</div>
      </div>
    </header>
  );
});
