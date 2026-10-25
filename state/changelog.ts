import changelogMarkdown from '../CHANGELOG.md?raw';

const RECENT_ENTRY_COUNT = 5;

// Reformats the standalone CHANGELOG.md to embed cleanly in the About modal:
// keep the most recent N date entries, demote each date heading to inline
// bold text so the sidebar nav stays tidy, and prepend a "What's new" heading.
export const changelogForAboutModal: string = (() => {
  const sections = changelogMarkdown.split(/(?=^##\s+\d{4}-\d{2}-\d{2})/m);
  const dated = sections.filter((s) => /^##\s+\d{4}-\d{2}-\d{2}/.test(s));
  const recent = dated
    .slice(0, RECENT_ENTRY_COUNT)
    .join('')
    .replace(/^##\s+(\d{4}-\d{2}-\d{2})\s*$/gm, '**$1**')
    .trim();
  return `## Changelog\n\n${recent}\n`;
})();
