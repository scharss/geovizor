import { PlusIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import { useOpenFiles } from 'app/hooks/use_open_files';
import { captureException } from 'integrations/errors';
import { memo } from 'react';
import { Button } from './elements';
import { DialogHelpers } from 'state/dialog_helpers';
import { dialogAtom } from 'state/jotai';
import { useSetAtom } from 'jotai';
import { useT } from 'app/lib/i18n';

export const NothingSelected = memo(function NothingSelected() {
  const t = useT();
  const openFiles = useOpenFiles();
  const setDialogState = useSetAtom(dialogAtom);

  return (
    <div className="px-5 pt-6 overflow-y-auto pb-6 flex-auto geojsonio-scrollbar">
      <div className="geo-label">{t('Workspace')}</div>
      <h2 className="mt-2 text-lg font-semibold tracking-tight text-slate-100">
        {t('Start mapping')}
      </h2>
      <p className="mt-2 text-sm leading-6 text-slate-400">
        {t(
          'Draw features on the map with the tools on the left, or import an existing dataset to begin editing.'
        )}
      </p>

      <div className="mt-6 rounded-2xl border border-white/5 bg-ink-800/60 p-4">
        <div className="geo-label">{t('Quick start')}</div>
        <Button
          type="button"
          variant="primary"
          className="mt-3 w-full justify-center rounded-xl"
          onClick={() => {
            openFiles().catch((e) => captureException(e));
          }}
        >
          <PlusIcon />
          {t('Import data')}
        </Button>
        <button
          type="button"
          onClick={() => setDialogState(DialogHelpers.about())}
          className="mt-3 flex w-full items-center justify-between rounded-lg px-1 py-1 text-xs text-slate-500 transition-colors hover:text-mint-300"
        >
          {t('Supported file types')}
          <ChevronRightIcon />
        </button>
      </div>

      <div className="mt-5 space-y-2 text-xs text-slate-600">
        <p>{t('Tip: press 2–6 to switch drawing tools.')}</p>
        <p>{t('Drag and drop files anywhere on the map.')}</p>
      </div>
    </div>
  );
});
