import {
  CaretDownIcon,
  CheckIcon,
  CursorArrowIcon,
  DotFilledIcon,
  PlusIcon,
  QuestionMarkCircledIcon,
  SquareIcon
} from '@radix-ui/react-icons';
import {
  Button,
  DDContent,
  DDLabel,
  DDSeparator,
  StyledItem
} from 'app/components/elements';
import CircleIcon from 'app/components/icons/circle';
import Line from 'app/components/icons/line';
import Polygon from 'app/components/icons/polygon';
import MenuAction from 'app/components/menu_action';
import { useLineMode } from 'app/hooks/use_line_mode';
import { useT } from 'app/lib/i18n';
import clsx from 'clsx';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { DropdownMenu as DD } from 'radix-ui';
import { memo } from 'react';
import { USelection } from 'state';
import {
  circleTypeAtom,
  dataAtom,
  dialogAtom,
  ephemeralStateAtom,
  MODE_INFO,
  Mode,
  modeAtom
} from 'state/jotai';
import { CIRCLE_TYPE } from 'state/mode';
import { DialogHelpers } from 'state/dialog_helpers';
import type { IWrappedFeature } from 'types';

function CircleMenu() {
  const t = useT();
  const [circleType, setCircleType] = useAtom(circleTypeAtom);
  const setData = useSetAtom(dataAtom);
  const setEphemeralState = useSetAtom(ephemeralStateAtom);
  const setDialogState = useSetAtom(dialogAtom);
  const setMode = useSetAtom(modeAtom);

  return (
    <div className="z-50">
      <DD.Root>
        <DD.Trigger asChild>
          <Button size="xxs" variant="quiet">
            <CaretDownIcon />
          </Button>
        </DD.Trigger>
        <DDContent>
          <DDLabel>{t('Circle type')}</DDLabel>
          {[
            CIRCLE_TYPE.MERCATOR,
            CIRCLE_TYPE.GEODESIC,
            CIRCLE_TYPE.DEGREES
          ].map((type) => (
            <StyledItem
              key={type}
              onSelect={() => {
                setCircleType(type);
                setEphemeralState({ type: 'none' });
                setData((data) => {
                  return {
                    ...data,
                    selection: USelection.none()
                  };
                });
                setMode({
                  mode: Mode.DRAW_CIRCLE,
                  modeOptions: {
                    multi: false,
                    replaceGeometryForId: null,
                    circleType: type
                  }
                });
              }}
            >
              <CheckIcon className={circleType === type ? '' : 'opacity-0'} />
              {type}
            </StyledItem>
          ))}
          <DDSeparator />
          <StyledItem
            onSelect={() => {
              setDialogState(DialogHelpers.circleTypes());
            }}
          >
            <QuestionMarkCircledIcon className="h-3 w-3" />{' '}
            <span className="text-xs">{t('Help')}</span>
          </StyledItem>
        </DDContent>
      </DD.Root>
    </div>
  );
}

const MODE_OPTIONS = [
  {
    mode: Mode.NONE,
    hotkey: '1',
    Icon: CursorArrowIcon,
    Menu: null
  },
  {
    mode: Mode.DRAW_POINT,
    hotkey: '2',
    Icon: DotFilledIcon,
    Menu: null
  },
  {
    mode: Mode.DRAW_LINE,
    hotkey: '3',
    Icon: Line,
    Menu: null
  },
  {
    mode: Mode.DRAW_POLYGON,
    hotkey: '4',
    Icon: Polygon,
    Menu: null
  },
  {
    mode: Mode.DRAW_RECTANGLE,
    hotkey: '5',
    Icon: SquareIcon,
    Menu: null
  },
  {
    mode: Mode.DRAW_CIRCLE,
    hotkey: '6',
    Icon: CircleIcon,
    Menu: CircleMenu
  }
] as const;

export default memo(function Modes({
  replaceGeometryForId,
  orientation = 'horizontal'
}: {
  replaceGeometryForId: IWrappedFeature['id'] | null;
  orientation?: 'horizontal' | 'vertical';
}) {
  const [{ mode: currentMode, modeOptions }, setMode] = useAtom(modeAtom);
  const t = useT();
  const setData = useSetAtom(dataAtom);
  const setEphemeralState = useSetAtom(ephemeralStateAtom);
  const lineMode = useLineMode();
  const circleType = useAtomValue(circleTypeAtom);

  return (
    <div
      className={clsx(
        'flex justify-start',
        orientation === 'vertical'
          ? 'flex-col items-center gap-1'
          : 'flex-row items-center gap-x-1'
      )}
      role="radiogroup"
    >
      {MODE_OPTIONS.filter((mode) => {
        if (!replaceGeometryForId) return true;
        return mode.mode !== Mode.NONE;
      }).map(({ mode, hotkey, Icon, Menu }, i) => {
        const menuAction = (
          <MenuAction
            role="radio"
            key={i}
            selected={currentMode === mode}
            hotkey={hotkey}
            label={t(MODE_INFO[mode].label)}
            vertical={orientation === 'vertical'}
            tooltipSide={orientation === 'vertical' ? 'right' : 'bottom'}
            onClick={(e) => {
              if (mode === Mode.DRAW_LINE) {
                void lineMode({
                  event: e,
                  replaceGeometryForId
                });
              } else {
                setEphemeralState({ type: 'none' });
                setData((data) => {
                  return {
                    ...data,
                    selection: USelection.none()
                  };
                });
                setMode({
                  mode,
                  modeOptions: {
                    multi: !!e?.shiftKey,
                    replaceGeometryForId,
                    circleType
                  }
                });
              }
            }}
          >
            <Icon />
            {currentMode === mode && modeOptions?.multi ? (
              <PlusIcon className="w-2 h-2 absolute bottom-1 right-1" />
            ) : null}
          </MenuAction>
        );
        return Menu ? (
          <div
            key={mode}
            className={clsx(
              orientation === 'vertical'
                ? 'flex flex-col items-center'
                : 'flex items-center'
            )}
          >
            {menuAction}
            {<Menu />}
          </div>
        ) : (
          menuAction
        );
      })}
    </div>
  );
});
