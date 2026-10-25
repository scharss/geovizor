import {
  DownloadIcon,
  InfoCircledIcon,
  LayersIcon,
  Share2Icon,
  UploadIcon
} from '@radix-ui/react-icons';
import * as E from 'app/components/elements';
import { buildShareUrl } from 'app/components/dialogs/share';
import { useAtomValue, useSetAtom } from 'jotai';
import { Popover, Tooltip as T } from 'radix-ui';
import { memo, Suspense, useEffect, useState } from 'react';
import { dataAtom, dialogAtom } from 'state/jotai';
import { DialogHelpers } from 'state/dialog_helpers';
import { StylesPopover } from './styles/popover';
import { useOpenFiles } from 'app/hooks/use_open_files';
import { useT } from 'app/lib/i18n';

export const Visual = memo(function Visual() {
  const t = useT();
  const setDialogState = useSetAtom(dialogAtom);
  const data = useAtomValue(dataAtom);
  const openFiles = useOpenFiles();
  const hasFeatures = data.featureMap.size > 0;
  const [shareTooLong, setShareTooLong] = useState(false);

  useEffect(() => {
    buildShareUrl(data.featureMap).then(({ tooLong }) =>
      setShareTooLong(tooLong)
    );
  }, [data.featureMap]);

  return (
    <div className="flex items-center gap-1">
      <E.Button
        variant="primary"
        aria-label={t('Import')}
        className="h-9 rounded-lg px-3"
        onClick={() => {
          return openFiles();
        }}
      >
        <UploadIcon />
        <span className="hidden sm:inline">{t('Import')}</span>
      </E.Button>

      <E.Button
        variant="quiet"
        aria-label={t('Export')}
        className="h-9 rounded-lg px-3 text-slate-300 hover:bg-white/5 hover:text-white"
        disabled={!hasFeatures}
        onClick={() => {
          setDialogState(DialogHelpers.export());
        }}
      >
        <DownloadIcon />
        <span className="hidden sm:inline">{t('Export')}</span>
      </E.Button>

      <div className="mx-1 hidden h-5 w-px bg-white/5 sm:block" />

      <T.Root>
        <div className="flex h-9 w-9 items-center justify-center">
          <T.Trigger asChild>
            <E.Button
              variant="quiet"
              aria-label={t('Share')}
              className="h-9 w-9 justify-center rounded-lg text-slate-300 hover:bg-white/5 hover:text-white"
              disabled={!hasFeatures || shareTooLong}
              onClick={() => {
                setDialogState(DialogHelpers.share());
              }}
            >
              <Share2Icon />
            </E.Button>
          </T.Trigger>
        </div>
        {shareTooLong && hasFeatures ? (
          <E.TContent side="bottom">
            <span className="whitespace-nowrap">
              Dataset too large to share via URL
            </span>
          </E.TContent>
        ) : null}
      </T.Root>

      <T.Root>
        <Popover.Root>
          <div className="flex h-9 items-center justify-center">
            <T.Trigger asChild>
              <Popover.Trigger aria-label={t('Basemap')} asChild>
                <E.Button
                  variant="quiet"
                  className="h-9 rounded-lg px-2.5 text-slate-300 hover:bg-white/5 hover:text-white"
                >
                  <LayersIcon />
                  <span className="hidden lg:inline">{t('Basemap')}</span>
                </E.Button>
              </Popover.Trigger>
            </T.Trigger>
            <E.TContent side="bottom">
              <span className="whitespace-nowrap">{t('Change basemap')}</span>
            </E.TContent>
          </div>
          <E.PopoverContent2 size="md">
            <Suspense fallback={<E.Loading size="sm" />}>
              <StylesPopover />
            </Suspense>
          </E.PopoverContent2>
        </Popover.Root>
      </T.Root>

      <T.Root>
        <div className="flex h-9 w-9 items-center justify-center">
          <T.Trigger asChild>
            <E.Button
              variant="quiet"
              aria-label={t('About')}
              className="h-9 w-9 justify-center rounded-lg text-slate-300 hover:bg-white/5 hover:text-white"
              onClick={() => setDialogState(DialogHelpers.about())}
            >
              <InfoCircledIcon />
            </E.Button>
          </T.Trigger>
          <E.TContent side="bottom">
            <span className="whitespace-nowrap">{t('About geovizor')}</span>
          </E.TContent>
        </div>
      </T.Root>
    </div>
  );
});
