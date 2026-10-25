import { TableIcon, CodeIcon } from '@radix-ui/react-icons';
import { DefaultErrorBoundary } from 'app/components/elements';
import FeatureCollectionCodeBlock from 'app/components/panels/feature_collection_code_block';
import FeatureTable from 'app/components/panels/feature_table';
import clsx from 'clsx';
import { useHotkeys } from 'integrations/hotkeys';
import { useAtom, useAtomValue } from 'jotai';
import { memo } from 'react';
import { useT } from 'app/lib/i18n';
import {
  showPanelBottomAtom,
  splitsAtom,
  TabOption,
  tabAtom
} from 'state/jotai';
import FeatureEditor from './feature_editor';
import { ResolvedLayout } from '../geojson_io';
import { FeatureEditorFolderInner } from './feature_editor/feature_editor_folder';

// Configuration for tabs
const TAB_CONFIG = {
  [TabOption.Table]: {
    icon: <TableIcon className="inline-block align-text-bottom w-4 h-4" />,
    label: 'Table'
  },
  [TabOption.JSON]: {
    icon: <CodeIcon className="inline-block align-text-bottom w-4 h-4" />,
    label: 'JSON'
  }
};

const TAB_ORDER_RIGHT = [TabOption.JSON, TabOption.Table];
const TAB_ORDER_BOTTOM = [TabOption.JSON, TabOption.Table, TabOption.List];

export function Tab({
  onClick,
  active,
  label,
  ...attributes
}: {
  onClick: () => void;
  active: boolean;
  label: React.ReactNode;
} & React.HTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      role="tab"
      onClick={onClick}
      aria-selected={active}
      className={clsx(
        'text-center text-xs font-medium py-2 px-3 focus:outline-none transition-colors',
        active
          ? 'bg-mint-400/10 text-mint-300 shadow-[inset_0_-2px_0_0_#2dd4bf]'
          : `
              bg-transparent
              text-slate-500
              hover:bg-white/5 hover:text-slate-200
              focus:text-slate-100`
      )}
      {...attributes}
    >
      {label}
    </button>
  );
}

function previousTab(TAB_ORDER: TabOption[], activeTab: TabOption): TabOption {
  let nextTab = TAB_ORDER.indexOf(activeTab) - 1;
  if (nextTab < 0) nextTab = TAB_ORDER.length - 1;
  return TAB_ORDER[nextTab];
}

function nextTab(TAB_ORDER: TabOption[], activeTab: TabOption): TabOption {
  const nextTab = (TAB_ORDER.indexOf(activeTab) + 1) % TAB_ORDER.length;
  return TAB_ORDER[nextTab];
}

const ActiveTab = memo(function ActiveTab({
  activeTab
}: {
  activeTab: TabOption;
}) {
  switch (activeTab) {
    case TabOption.JSON:
      return <FeatureCollectionCodeBlock />;
    case TabOption.Table:
      return <FeatureTable />;
    case TabOption.List:
      return <FeatureEditorFolderInner />;
  }
});

export const TabList = memo(function TabList({
  tabOrder,
  setTab,
  activeTab
}: {
  tabOrder: TabOption[];
  activeTab: TabOption;
  setTab: React.Dispatch<React.SetStateAction<TabOption>>;
  showSymbolization: boolean;
}) {
  const t = useT();
  return (
    <div
      role="tablist"
      style={{
        gridTemplateColumns: `repeat(${tabOrder.length}, 1fr) min-content`
      }}
      className="flex-0 grid h-10 flex-none
      sticky top-0 z-10
      bg-ink-850/95
      divide-x divide-white/5
      border-b border-white/5 backdrop-blur-xl"
    >
      {tabOrder.map((tab) => {
        const config = TAB_CONFIG[tab] || { icon: null, label: tab };
        const label =
          typeof config.label === 'string' ? t(config.label) : config.label;
        return (
          <Tab
            key={tab}
            onClick={() => setTab(tab)}
            active={activeTab === tab}
            label={
              config.icon ? (
                <span className="inline-flex items-center gap-0.5">
                  {config.icon}
                  <span>{label}</span>
                </span>
              ) : (
                label
              )
            }
          />
        );
      })}
    </div>
  );
});

export const SidePanel = memo(function SidePanelInner() {
  const splits = useAtomValue(splitsAtom);
  if (!splits.rightOpen) return null;
  return (
    <div
      style={{
        width: splits.right
      }}
      className="bg-ink-850 border-l border-white/5 relative"
    >
      <Panel tabOrder={TAB_ORDER_RIGHT} />
    </div>
  );
});

export const BottomPanel = memo(function BottomPanelInner({
  layout
}: {
  layout: ResolvedLayout;
}) {
  const splits = useAtomValue(splitsAtom);
  const showPanel = useAtomValue(showPanelBottomAtom);
  if (!showPanel) return null;
  return (
    <div
      style={{
        height: splits.bottom
      }}
      className="bg-ink-850 border-t border-white/5 relative"
    >
      <Panel tabOrder={TAB_ORDER_BOTTOM} showSymbolization={false} />
      {layout === 'VERTICAL' && <FeatureEditor layout={layout} />}
    </div>
  );
});

export const FullPanel = memo(function FullPanelInner() {
  return (
    <div className="flex flex-auto bg-ink-900 relative">
      <Panel tabOrder={TAB_ORDER_BOTTOM} showSymbolization={false} />
    </div>
  );
});

const Panel = memo(function PanelInner({
  tabOrder,
  showSymbolization = true
}: {
  tabOrder: TabOption[];
  showSymbolization?: boolean;
}) {
  const [activeTab, setTab] = useAtom(tabAtom);

  useHotkeys(
    ']',
    () => {
      setTab(nextTab(tabOrder, activeTab));
    },
    [activeTab]
  );

  useHotkeys(
    '[',
    () => {
      setTab(previousTab(tabOrder, activeTab));
    },
    [activeTab]
  );

  return (
    <div className="absolute inset-0 flex flex-col">
      <TabList
        tabOrder={tabOrder}
        activeTab={activeTab}
        setTab={setTab}
        showSymbolization={showSymbolization}
      />
      <DefaultErrorBoundary>
        <ActiveTab activeTab={activeTab} />
      </DefaultErrorBoundary>
    </div>
  );
});
