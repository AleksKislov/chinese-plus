import { $, component$, useOnDocument, useOnWindow, useSignal } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import { isChinese } from '~/routes/dictionary';
import { searchSvg } from '../media/svg';

// A short sentence is plenty for a lookup; longer selections are more likely an
// accidental drag across a whole paragraph.
const MAX_SELECTION_LENGTH = 16;

// Global, mounted once in the root layout: shows a small "look up in dictionary" button
// whenever the user selects Chinese text anywhere on the site.
export const ChineseSelectionPopup = component$(() => {
  const word = useSignal('');
  const top = useSignal(0);
  const left = useSignal(0);
  const visible = useSignal(false);

  const updateFromSelection = $(() => {
    const selection = window.getSelection();
    const text = selection?.toString().trim() || '';

    if (!text || text.length > MAX_SELECTION_LENGTH || !isChinese(text) || !selection?.rangeCount) {
      visible.value = false;
      return;
    }

    const range = selection.getRangeAt(0);

    // Skip the per-word tooltip text used in Texts/Blog reading - each word there
    // already has its own click-to-translate popup, so this would be redundant.
    let container: Node | null = range.commonAncestorContainer;
    if (container.nodeType !== Node.ELEMENT_NODE) container = container.parentElement;
    if ((container as Element | null)?.closest('.no-selection-popup')) {
      visible.value = false;
      return;
    }

    const rect = range.getBoundingClientRect();
    if (!rect.width && !rect.height) {
      visible.value = false;
      return;
    }

    word.value = text;
    // Below the selection, not above - avoids overlapping the browser/OS's own
    // copy/select-all bubble, which on mobile appears above the selection.
    top.value = rect.bottom + 8;
    left.value = rect.left + rect.width / 2;
    visible.value = true;
  });

  useOnDocument('mouseup', updateFromSelection);
  useOnDocument('touchend', updateFromSelection);
  useOnWindow(
    'scroll',
    $(() => (visible.value = false)),
  );

  if (!visible.value) return null;

  return (
    <Link
      href={`/dictionary/${encodeURIComponent(word.value)}`}
      class="btn btn-sm btn-info fixed z-50 shadow-lg -translate-x-1/2 gap-1"
      style={{ top: `${top.value}px`, left: `${left.value}px` }}
      onClick$={() => (visible.value = false)}
    >
      {searchSvg} Словарь
    </Link>
  );
});
