import type { TranslationInline, TranslationNode } from '~/components/common/translation/types';
import { parseRussian } from './parse-russian';

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const INLINE_HTML: Partial<Record<TranslationInline['type'], (v: string) => string>> = {
  label: (v) => `<span class='text-success italic text-xs'>${v}</span>`,
  comment: (v) => `<span class='italic'>${v}</span>`,
  pinyin: (v) => `<span class='font-bold text-success'>${v}</span>`,
  strong: (v) => `<span class='font-bold text-success'>${v}</span>`,
  en: (v) => `<span class='text-success'>${v}</span>`,
  ref: (v) => `<a href="/dictionary/${encodeURIComponent(v)}">${v}</a>`,
};

const inlineHtml = (parts: TranslationInline[]) =>
  parts.map(({ type, value }) => (INLINE_HTML[type] || ((v) => v))(escapeHtml(value))).join('');

const nodeHtml = (node: TranslationNode): string => {
  const isGroup = node.kind === 'homonym' || node.kind === 'section';
  const marker = node.marker
    ? isGroup
      ? INLINE_HTML.strong!(escapeHtml(node.marker)) + ' '
      : `${escapeHtml(node.marker)}) `
    : '';
  const pinyin = node.pinyin ? INLINE_HTML.pinyin!(escapeHtml(node.pinyin)) + ' ' : '';
  const labels = node.labels?.length
    ? INLINE_HTML.label!(escapeHtml(node.labels.join(' '))) + ' '
    : '';
  const text = node.content ? inlineHtml(node.content) : escapeHtml(node.text || '');
  const children = node.senses?.length
    ? `<span class='block ml-3'>${node.senses.map(nodeHtml).join('')}</span>`
    : '';
  return `<span class='block'>${marker}${pinyin}${labels}${text}</span>${children}`;
};

/** Compact HTML of a parsed translation (no examples), for tooltips, list rows and games. */
export const sensesToHtml = (senses: TranslationNode[]): string => senses.map(nodeHtml).join('');

// sense text without pinyin and labels: "получать, добывать; обретать"
const plainText = (node: TranslationNode): string =>
  node.content
    ? node.content
        .filter((part) => part.type !== 'pinyin' && part.type !== 'label')
        .map((part) => part.value)
        .join('')
        .replace(/\s+/g, ' ')
        .trim()
    : node.text || '';

const sensesToText = (senses: TranslationNode[]): string[] =>
  senses.flatMap((node) => [plainText(node), ...(node.senses ? sensesToText(node.senses) : [])]);

/**
 * Only the meanings, as escaped HTML text: no pinyin, labels, sense numbers or homonym headers
 * (tests, where pinyin would give the answer away). The DSL markup of the old HSK 2021 list
 * when there is no parsed one.
 */
export const translationTextHtml = ({
  senses,
  russian,
}: {
  senses?: TranslationNode[];
  russian?: string;
}): string =>
  senses?.length
    ? escapeHtml(sensesToText(senses).filter(Boolean).join('; '))
    : parseRussian(russian || '', false);

/** The parsed translation of a dictionary word, else the DSL markup of the old HSK 2021 list. */
export const translationHtml = ({
  senses,
  russian,
}: {
  senses?: TranslationNode[];
  russian?: string;
}): string => (senses?.length ? sensesToHtml(senses) : parseRussian(russian || '', false));
