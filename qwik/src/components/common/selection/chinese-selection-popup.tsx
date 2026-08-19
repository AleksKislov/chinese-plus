import { $, component$, useOnDocument, useOnWindow, useSignal } from '@builder.io/qwik';
import { isChinese } from '~/routes/dictionary';
import { searchSvg } from '../media/svg';

// A short sentence is plenty for a lookup; longer selections are more likely an
// accidental drag across a whole paragraph.
const MAX_SELECTION_LENGTH = 16;

const closestElement = (node: Node | null): Element | null => {
  if (!node) return null;
  return node.nodeType === Node.ELEMENT_NODE ? (node as Element) : node.parentElement;
};

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

    // Skip the per-word tooltip text used in Texts/Blog reading - each word there
    // already has its own click-to-translate popup, so this would be redundant.
    // Checked at both ends of the selection (not just the common ancestor), since
    // dragging across several tooltip words shares no classed ancestor closer than
    // the whole paragraph.
    const startEl = closestElement(selection.anchorNode);
    const endEl = closestElement(selection.focusNode);
    if (startEl?.closest('.no-selection-popup') || endEl?.closest('.no-selection-popup')) {
      visible.value = false;
      return;
    }

    const rect = selection.getRangeAt(0).getBoundingClientRect();
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

  // Hide as soon as a new interaction begins elsewhere, not just on click/scroll.
  // Otherwise the fixed-position button from the previous selection lingers on top
  // of the text the user is about to select next; since it has its own mousedown
  // preventDefault (see below), it can eat the mousedown that should start the new
  // selection drag, and the whole thing looks like selection stopped working.
  // Excludes mousedowns on the popup itself - otherwise this fires before the
  // popup's own click/navigation can land, hiding the button out from under it.
  const hide = $((event: Event) => {
    if (closestElement(event.target as Node | null)?.closest('.js-selection-popup')) return;
    visible.value = false;
  });
  useOnDocument('mousedown', hide);
  useOnDocument('touchstart', hide);
  useOnDocument('mouseup', updateFromSelection);
  useOnDocument('touchend', updateFromSelection);
  useOnWindow('scroll', hide);

  return (
    <a
      href={`/dictionary/${encodeURIComponent(word.value)}`}
      // Kept mounted at all times (never `return null`) and toggled with
      // hidden/pointer-events instead of conditional rendering: this element is
      // also where the on-document mouseup/touchstart/etc listeners above live,
      // so unmounting it between selections risked taking those listeners with it -
      // which looked like "selection only works the first time".
      class={{
        'js-selection-popup btn btn-circle btn-sm btn-info shadow-lg fixed z-50 -translate-x-1/2':
          true,
        hidden: !visible.value,
        'pointer-events-none': !visible.value,
      }}
      style={{ top: `${top.value}px`, left: `${left.value}px` }}
      // Mousedown on a non-text element normally collapses the browser's text
      // selection, which would wipe out our selection before mouseup even runs -
      // hiding this button out from under the click.
      onMouseDown$={(e) => e.preventDefault()}
      onClick$={() => (visible.value = false)}
    >
      {searchSvg}
    </a>
  );
});
