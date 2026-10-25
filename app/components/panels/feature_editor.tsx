import { useAtomValue, useAtom } from 'jotai';
import { Mode, modeAtom, selectedFeaturesAtom } from 'state/jotai';
import { FeatureEditorInner } from './feature_editor/feature_editor_inner';
import FeatureEditorMulti from './feature_editor/feature_editor_multi';
import { featureEditorMinimized } from 'state/jotai';
import { ResolvedLayout } from '../geojson_io';
import { SizeIcon } from '@radix-ui/react-icons';
import MinimizeIcon from '../icons/minimize';
import clsx from 'clsx';
import { Tooltip } from 'radix-ui';
import { TContent } from '../elements';
import { useT } from 'app/lib/i18n';

export default function FeatureEditor({ layout }: { layout: ResolvedLayout }) {
  const t = useT();
  const selectedFeatures = useAtomValue(selectedFeaturesAtom);
  const [minimizedEditor, setMinimizedEditor] = useAtom(featureEditorMinimized);
  const mode = useAtomValue(modeAtom);

  // Don't show panel while drawing a feature
  const isDrawing = [
    Mode.DRAW_POLYGON,
    Mode.DRAW_LINE,
    Mode.DRAW_CIRCLE,
    Mode.DRAW_POINT,
    Mode.DRAW_RECTANGLE
  ].includes(mode.mode);

  const hasSelected = selectedFeatures.length > 0 && !isDrawing;

  const classes = {
    'absolute z-20 overflow-hidden border border-white/10 bg-ink-850/95 shadow-panel backdrop-blur-xl transition-all':
      true,
    'left-1/2 bottom-4 rounded-2xl': layout === 'HORIZONTAL',
    'w-[calc(100%-2rem)] h-1/3': layout === 'HORIZONTAL' && !minimizedEditor,
    'w-80 h-[36px]': layout === 'HORIZONTAL' && minimizedEditor,
    'h-[36px] w-full bottom-0 rounded-t-2xl':
      layout === 'VERTICAL' && minimizedEditor,
    'h-full w-full': layout === 'VERTICAL' && !minimizedEditor
  };

  const translateDistance = !minimizedEditor
    ? 'translateY(110%)'
    : 'translateY(200%)';

  const horizontalTransform =
    layout === 'HORIZONTAL'
      ? `translateX(-50%) ${hasSelected ? 'translateY(0)' : translateDistance}`
      : hasSelected
        ? 'translateY(0)'
        : translateDistance;

  return (
    <div className={clsx(classes)} style={{ transform: horizontalTransform }}>
      <h2 className="text-center relative py-2 px-8 text-sm font-semibold text-slate-200 bg-ink-800 border-b border-white/5">
        {t('Feature Editor')}
        <span className="text-xs font-normal text-slate-500">
          {selectedFeatures.length > 1
            ? ` · ${selectedFeatures.length} selected`
            : ''}
        </span>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <div className="absolute top-2 right-2 cursor-pointer hover:text-gray-200">
              {minimizedEditor ? (
                <SizeIcon onClick={() => setMinimizedEditor((prev) => !prev)} />
              ) : (
                <MinimizeIcon
                  onClick={() => setMinimizedEditor((prev) => !prev)}
                />
              )}
            </div>
          </Tooltip.Trigger>
          <TContent side="left">
            <div className="flex gap-x-2 items-center ">
              {minimizedEditor ? t('Expand') : t('Minimize')}
            </div>
          </TContent>
        </Tooltip.Root>
      </h2>

      {selectedFeatures.length > 1 && minimizedEditor === false && (
        <FeatureEditorMulti selectedFeatures={selectedFeatures} />
      )}
      {selectedFeatures.length === 1 && minimizedEditor === false && (
        <FeatureEditorInner selectedFeature={selectedFeatures[0]} />
      )}
    </div>
  );
}
