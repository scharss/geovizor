import { useAtom } from 'jotai';
import { languageAtom } from 'app/lib/i18n';

export function LanguageSwitcher() {
  const [language, setLanguage] = useAtom(languageAtom);

  return (
    <div
      role="group"
      aria-label="Language / Idioma"
      className="flex items-center rounded-lg border border-white/10 bg-ink-800/80 p-0.5"
    >
      <button
        type="button"
        aria-pressed={language === 'en'}
        aria-label="English"
        onClick={() => setLanguage('en')}
        className={`h-7 rounded-md px-2 text-[10px] font-semibold tracking-wide transition-colors ${
          language === 'en'
            ? 'bg-white/10 text-white'
            : 'text-slate-500 hover:text-slate-300'
        }`}
      >
        EN
      </button>
      <button
        type="button"
        aria-pressed={language === 'es'}
        aria-label="Español"
        onClick={() => setLanguage('es')}
        className={`h-7 rounded-md px-2 text-[10px] font-semibold tracking-wide transition-colors ${
          language === 'es'
            ? 'bg-white/10 text-white'
            : 'text-slate-500 hover:text-slate-300'
        }`}
      >
        ES
      </button>
    </div>
  );
}
