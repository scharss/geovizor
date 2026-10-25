import * as E from 'app/components/elements';
import { styledCheckbox } from 'app/components/elements';
import LAYERS from 'app/lib/default_styles';
import {
  activeStyleIdAtom,
  styleOptionsAtom,
  customRasterLayersAtom,
  type CustomRasterLayer
} from 'state/jotai';
import { useAtom, useSetAtom } from 'jotai';
import { dialogAtom } from 'state/jotai';
import { DialogHelpers } from 'state/dialog_helpers';
import {
  PlusIcon,
  Pencil1Icon,
  TrashIcon,
  DragHandleDots2Icon,
  EyeOpenIcon,
  EyeNoneIcon
} from '@radix-ui/react-icons';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useT } from 'app/lib/i18n';
import { getBasePath } from 'app/lib/utils';
import { memo } from 'react';
import { toast } from 'react-hot-toast';

const SortableRasterLayer = memo(function SortableRasterLayer({
  layer,
  onEdit,
  onDelete,
  onToggleVisibility
}: {
  layer: CustomRasterLayer;
  onEdit: () => void;
  onDelete: () => void;
  onToggleVisibility: () => void;
}) {
  const t = useT();
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: layer.id });

  const style: React.HTMLAttributes<HTMLDivElement>['style'] = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 p-2 bg-ink-800/60 rounded-xl border border-white/5"
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1 hover:bg-white/5 rounded"
        aria-label={t('Drag to reorder')}
      >
        <DragHandleDots2Icon className="w-4 h-4 text-slate-500" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">{layer.name}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
          {layer.tileUrl}
        </div>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={onToggleVisibility}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
          type="button"
          aria-label={layer.visible !== false ? t('Hide layer') : t('Show layer')}
        >
          {layer.visible !== false ? (
            <EyeOpenIcon className="w-4 h-4" />
          ) : (
            <EyeNoneIcon className="w-4 h-4" />
          )}
        </button>
        <button
          onClick={onEdit}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
          type="button"
          aria-label={t('Edit layer')}
        >
          <Pencil1Icon className="w-4 h-4" />
        </button>
        <button
          onClick={onDelete}
          className="p-1 hover:bg-red-200 dark:hover:bg-red-900 rounded text-red-600 dark:text-red-400"
          type="button"
          aria-label={t('Delete layer')}
        >
          <TrashIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
});

export function StylesPopover() {
  const t = useT();
  const [activeStyleId, setActiveStyleId] = useAtom(activeStyleIdAtom);
  const [styleOptions, setStyleOptions] = useAtom(styleOptionsAtom);
  const [customRasterLayers, setCustomRasterLayers] = useAtom(
    customRasterLayersAtom
  );
  const setDialogState = useSetAtom(dialogAtom);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8
      }
    })
  );

  const handleAddRasterLayer = () => {
    setDialogState(DialogHelpers.addRasterLayer());
  };

  const handleEditRasterLayer = (layer: {
    id: string;
    name: string;
    tileUrl: string;
  }) => {
    setDialogState(DialogHelpers.editRasterLayer(layer));
  };

  const handleDeleteRasterLayer = (id: string) => {
    setCustomRasterLayers(customRasterLayers.filter((l) => l.id !== id));
    toast.success('Raster layer removed');
  };

  const handleToggleVisibility = (id: string) => {
    setCustomRasterLayers(
      customRasterLayers.map((layer) =>
        layer.id === id
          ? { ...layer, visible: layer.visible !== false ? false : true }
          : layer
      )
    );
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = customRasterLayers.findIndex((l) => l.id === active.id);
      const newIndex = customRasterLayers.findIndex((l) => l.id === over.id);

      const newLayers = arrayMove(customRasterLayers, oldIndex, newIndex);
      // Update order values
      newLayers.forEach((layer, i) => {
        layer.order = i;
      });
      setCustomRasterLayers(newLayers);
    }
  };

  const activeStyle = LAYERS[activeStyleId];
  const supports3dFeatures = !!activeStyle?.supports3dFeatures;
  const basePath = getBasePath();

  return (
    <div>
      <div className="flex justify-between pb-2">
        <div className="text-sm font-semibold text-slate-200">
          {t('Basemap')}
        </div>
      </div>
      <div className="pt-3 border-t border-white/5">
        <div className="flex flex-row gap-4 p-2 overflow-x-auto">
          {Object.entries(LAYERS).map(([id, layer]) => {
            const isActive = id === activeStyleId;
            // Image file convention: public/layer-icons/{id}.png (or .jpg, .svg, etc.)
            // You will need to place the images in public/layer-icons/ with the correct names
            const iconSrc = `${basePath}layer-icons/${id}.png`;
            return (
              <div key={id} className="flex flex-col items-center">
                <button
                  className={`w-16 h-16 rounded-xl border flex items-center justify-center transition-all ${
                    isActive
                      ? 'border-mint-400 ring-4 ring-mint-400/20 bg-mint-400/10'
                      : 'border-white/10 bg-ink-700 hover:border-white/25'
                  }`}
                  aria-label={`${t('Select')} ${t(layer.name)}`}
                  onClick={() => setActiveStyleId(id)}
                  type="button"
                >
                  <img
                    src={iconSrc}
                    alt={layer.name}
                    className="w-full h-full object-cover rounded"
                    style={{ aspectRatio: '1 / 1', objectFit: 'cover' }}
                    onError={(e) => {
                      // Hide image if not found
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </button>
                <div className="text-[11px] mt-1.5 text-center text-slate-400">{t(layer.name)}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Style options panel */}

      <div className="px-2 py-3">
        {/* Disable label visibility option for OSM style since it is a style with a raster layer */}
        {activeStyleId !== 'OSM' ? (
          <label className="flex items-center gap-x-2">
            <input
              type="checkbox"
              checked={styleOptions.labelVisibility}
              onChange={(e) =>
                setStyleOptions({
                  ...styleOptions,
                  labelVisibility: e.target.checked
                })
              }
              className={styledCheckbox({ variant: 'default' })}
            />
            <E.StyledLabelSpan size="xs">{t('Show map labels')}</E.StyledLabelSpan>
          </label>
        ) : (
          <span className="flex items-center gap-x-2 opacity-50 cursor-not-allowed">
            <input
              type="checkbox"
              checked={false}
              disabled
              className={styledCheckbox({ variant: 'default' })}
            />
            <E.StyledLabelSpan size="xs" style={{ color: '#888' }}>
              {t('Show map labels')}
            </E.StyledLabelSpan>
          </span>
        )}

        {supports3dFeatures ? (
          <label className="flex items-center gap-x-2 mt-2">
            <input
              type="checkbox"
              checked={styleOptions.show3dFeatures ?? true}
              onChange={(e) =>
                setStyleOptions({
                  ...styleOptions,
                  show3dFeatures: e.target.checked
                })
              }
              className={styledCheckbox({ variant: 'default' })}
            />
            <E.StyledLabelSpan size="xs">{t('Show 3D features')}</E.StyledLabelSpan>
          </label>
        ) : (
          <span className="flex items-center gap-x-2 mt-2 opacity-50 cursor-not-allowed">
            <input
              type="checkbox"
              checked={false}
              disabled
              className={styledCheckbox({ variant: 'default' })}
            />
            <E.StyledLabelSpan size="xs" style={{ color: '#888' }}>
              {t('Show 3D features')}
            </E.StyledLabelSpan>
          </span>
        )}
      </div>

      {/* Projection section */}
      <div className="pt-3 border-t border-white/5">
        <div className="flex justify-between pb-2 px-2">
          <div className="text-sm font-semibold text-slate-200">
            {t('Projection')}
          </div>
        </div>
        <div className="flex flex-row gap-4 p-2">
          {(
            [
              { id: 'globe', label: 'Globe' },
              { id: 'mercator', label: 'Mercator' }
            ] as const
          ).map(({ id, label }) => {
            const isActive = (styleOptions.mapProjection ?? 'globe') === id;
            return (
              <div key={id} className="flex flex-col items-center">
                <button
                  className={`w-16 h-16 rounded-xl border flex items-center justify-center transition-all ${
                    isActive
                      ? 'border-mint-400 ring-4 ring-mint-400/20 bg-mint-400/10'
                      : 'border-white/10 bg-ink-700 hover:border-white/25'
                  }`}
                  aria-label={`${t('Use')} ${t(label)} ${t('Projection')}`}
                  onClick={() =>
                    setStyleOptions({ ...styleOptions, mapProjection: id })
                  }
                  type="button"
                >
                  <img
                    src={`${basePath}layer-icons/projection-${id}.png`}
                    alt={label}
                    className="w-full h-full object-cover rounded"
                    style={{ aspectRatio: '1 / 1', objectFit: 'cover' }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </button>
                <div className="text-[11px] mt-1.5 text-center text-slate-400">{t(label)}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Raster Layers section */}
      <div className="pt-3 border-t border-white/5">
        <div className="flex justify-between pb-2 px-2">
          <div className="text-sm font-semibold text-slate-200">
            {t('Raster Layers')}
          </div>
          <button
            onClick={handleAddRasterLayer}
            className="flex items-center gap-1 text-xs text-mint-300 hover:text-mint-200"
            type="button"
            aria-label={t('Add raster layer')}
          >
            <PlusIcon />
            {t('Add Layer')}
          </button>
        </div>

        {customRasterLayers.length > 0 && (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={customRasterLayers.map((l) => l.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2 px-2 max-h-48 overflow-y-auto">
                {customRasterLayers.map((layer) => (
                  <SortableRasterLayer
                    key={layer.id}
                    layer={layer}
                    onEdit={() => handleEditRasterLayer(layer)}
                    onDelete={() => handleDeleteRasterLayer(layer.id)}
                    onToggleVisibility={() => handleToggleVisibility(layer.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
}
