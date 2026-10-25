import { Dialogs } from 'app/components/dialogs';
import Drop from 'app/components/drop';
import { MapComponent } from 'app/components/map_component';
import { MenuBar } from 'app/components/menu_bar';
import FeatureEditor from './panels/feature_editor';
import Modes from 'app/components/modes';
import type PMap from 'app/lib/pmap';
import 'styles/globals.css';
import 'core-js/features/array/at';
import {
  DndContext,
  PointerSensor,
  useDraggable,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { UpdateIcon } from '@radix-ui/react-icons';
import ContextActions from 'app/components/context_actions';
import { ErrorBoundary } from 'app/components/elements';
import { Keybindings } from 'app/components/keybindings';
import { Legend } from 'app/components/legend';
import Notifications from 'app/components/notifications';
import { SidePanel, BottomPanel } from 'app/components/panels';
import {
  BottomResizer,
  Resizer,
  useBigScreen,
  useWindowResizeSplits
} from 'app/components/resizer';
import { MapContext } from 'app/context/map_context';
import clsx from 'clsx';
import { atom, useAtom, useAtomValue } from 'jotai';
import debounce from 'lodash/debounce';
import { Tooltip as T } from 'radix-ui';
import SearchBoxButton from './search/search_box_button';
import { Suspense, useContext, useLayoutEffect, useRef, useState } from 'react';
import { Button } from './elements';
import { FeatureEditorFolder } from './panels/feature_editor/feature_editor_folder';
import { Visual } from './visual';
import { UrlAPI } from './url_api';
import { splitsAtom } from 'state/jotai';

export type ResolvedLayout = 'HORIZONTAL' | 'VERTICAL';

interface Transform {
  x: number;
  y: number;
}

const persistentTransformAtom = atom<Transform>({
  x: 5,
  y: 5
});

export function GeojsonIO() {
  const [map, setMap] = useState<PMap | null>(null);
  useWindowResizeSplits();
  const splits = useAtomValue(splitsAtom);
  const isBigScreen = useBigScreen();

  const layout: ResolvedLayout = isBigScreen ? 'HORIZONTAL' : 'VERTICAL';

  const sensor = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 2
      }
    })
  );

  const [persistentTransform, setPersistentTransform] = useAtom(
    persistentTransformAtom
  );

  return (
    <main className="h-screen flex flex-col bg-ink-900 text-slate-100">
      <T.Provider>
        <MapContext.Provider value={map}>
          <ErrorBoundary
            fallback={(props) => {
              return (
                <div className="h-20 flex items-center justify-center px-2 gap-x-2">
                  An error occurred
                  <Button onClick={() => props.resetError()}>
                    <UpdateIcon /> Try again
                  </Button>
                </div>
              );
            }}
          >
            <MenuBar>
              <Visual />
            </MenuBar>
          </ErrorBoundary>
          <div
            className={clsx(
              layout === 'VERTICAL' && 'flex-col',
              'flex flex-auto relative overflow-hidden bg-ink-900'
            )}
          >
            {layout === 'HORIZONTAL' ? <FeatureEditorFolder /> : null}
            <DndContext
              sensors={sensor}
              modifiers={[restrictToWindowEdges]}
              onDragEnd={(end) => {
                setPersistentTransform((transform) => {
                  return {
                    x: transform.x + end.delta.x,
                    y: transform.y + end.delta.y
                  };
                });
              }}
            >
              <Map
                persistentTransform={persistentTransform}
                setMap={setMap}
                layout={layout}
              />
            </DndContext>
            {layout === 'HORIZONTAL' ? (
              <>
                <SidePanel />
                <Resizer side="left" />
                <Resizer side="right" />
              </>
            ) : layout === 'VERTICAL' ? (
              <>
                <BottomPanel layout={layout} />
                <BottomResizer />
              </>
            ) : null}
          </div>
          <Drop />
          <UrlAPI />
          <Dialogs />
          <Suspense fallback={null}>
            <Keybindings />
          </Suspense>
          <Notifications />
        </MapContext.Provider>
      </T.Provider>
    </main>
  );
}

function Map({
  layout,
  setMap
}: {
  layout: ResolvedLayout;
  setMap: (arg0: PMap | null) => void;
  persistentTransform: Transform;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { setNodeRef } = useDraggable({
    id: 'map'
  });

  useMapResize(containerRef.current);

  return (
    <div
      className={'relative flex-auto flex flex-col overflow-hidden bg-ink-900'}
      ref={(elem) => {
        setNodeRef(elem);
        containerRef.current = elem;
      }}
    >
      <div className="flex-auto relative">
        <MapComponent setMap={setMap} />
        <SearchBoxButton />
        <div className="absolute left-3 top-3 z-20">
          <div className="geo-surface rounded-2xl p-1.5">
            <Modes replaceGeometryForId={null} orientation="vertical" />
          </div>
        </div>
        <div className="absolute left-1/2 top-20 z-20 -translate-x-1/2">
          <ContextActions />
        </div>
        <Legend />
      </div>
      {/* Feature Editor bottom of map */}
      {layout === 'HORIZONTAL' && <FeatureEditor layout={layout} />}
    </div>
  );
}

function useMapResize(element: HTMLElement | null) {
  const pmap = useContext(MapContext);

  useLayoutEffect(() => {
    if (element) {
      element.style.width = '';
      element.style.height = '';
    }
    pmap?.map?.resize();
  }, [element, pmap]);

  useLayoutEffect(() => {
    if (element) {
      const callback = debounce((entries: ResizeObserverEntry[]) => {
        if (!Array.isArray(entries)) {
          return;
        }

        if (!entries.length) {
          return;
        }

        pmap?.map?.resize();
      }, 50);

      const resizeObserver = new ResizeObserver(callback);
      resizeObserver.observe(element, { box: 'border-box' });
      return () => resizeObserver.unobserve(element);
    } else {
      // Nothing
    }
  }, [element, pmap]);
}
