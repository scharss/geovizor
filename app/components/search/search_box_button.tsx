import React from 'react';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import * as E from 'app/components/elements';
import { dialogAtom } from 'state/jotai';
import { DialogHelpers } from 'state/dialog_helpers';
import { useSetAtom } from 'jotai';
import { getIsMac, localizeKeybinding } from '../../lib/utils';
import { useT } from 'app/lib/i18n';
import { Tooltip as T } from 'radix-ui';

const SearchBoxButton = () => {
  const t = useT();
  const SEARCH_KEYBINDING = 'Command+k';
  const setDialogState = useSetAtom(dialogAtom);
  const isMac = getIsMac();

  return (
    <div className="absolute right-3 top-3 z-20">
      <T.Root>
        <T.Trigger asChild>
          <E.Button
            className="h-10 w-[210px] justify-between rounded-xl border border-white/10 bg-ink-800/90 px-3 text-slate-300 shadow-float backdrop-blur-xl hover:border-mint-400/40 hover:bg-ink-700/90 md:w-[250px]"
            variant="quiet"
            aria-label={t('Search')}
            onClick={() => {
              setDialogState(DialogHelpers.quickswitcher());
            }}
          >
            <div className="flex items-center">
              <MagnifyingGlassIcon />
              <span className="ml-2 text-slate-400">{t('Search')}</span>
            </div>

            <span className="text-[10px] font-medium text-slate-500">
              {localizeKeybinding(SEARCH_KEYBINDING, isMac)}
            </span>
          </E.Button>
        </T.Trigger>
        <E.TContent>
          <div className="flex items-center gap-x-2">
            {t('Search')}{' '}
            <E.Keycap>{localizeKeybinding(SEARCH_KEYBINDING, isMac)}</E.Keycap>
          </div>
        </E.TContent>
      </T.Root>
    </div>
  );
};

export default SearchBoxButton;
