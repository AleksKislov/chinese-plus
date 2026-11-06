import { component$ } from '@builder.io/qwik';
import { ParsedTranslation } from './parsed-translation';
import type { DictExample, TranslationNode } from './types';

export type ParsedWordTranslation = { senses: TranslationNode[]; examples: DictExample[] };

export const DictWordTranslation = component$(
  ({
    emptyText,
    parsed,
    showExamples,
    py,
    tradChinese,
  }: {
    // shown when there is no parsed translation, e.g. 'перевод отсутствует'
    emptyText?: string;
    parsed?: ParsedWordTranslation | null;
    showExamples: boolean;
    py: string;
    tradChinese?: string;
  }) => {
    return (
      <>
        <div class="font-bold text-xl text-success">{py}</div>
        {tradChinese && (
          <div class="mt-1">
            <div class="text-sm opacity-70">Традиционное написание:</div>
            <div class="text-3xl">{tradChinese}</div>
          </div>
        )}
        {parsed?.senses.length ? (
          <ParsedTranslation
            senses={parsed.senses}
            examples={parsed.examples}
            showExamples={showExamples}
          />
        ) : (
          emptyText && <div>{emptyText}</div>
        )}
      </>
    );
  },
);
