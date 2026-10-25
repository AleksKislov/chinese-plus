import { component$ } from '@builder.io/qwik';
import { markUpRuText } from '~/misc/helpers/translation';
import { ParsedTranslation } from './parsed-translation';
import type { DictTranslationResponse } from './types';

export const DictWordTranslation = component$(
  ({
    ru,
    parsed,
    showExamples,
    py,
    tradChinese,
  }: {
    ru: string;
    // parsed translation of the word; the DSL markup in `ru` is rendered when there is none
    parsed?: DictTranslationResponse | null;
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
        {parsed?.translation ? (
          <ParsedTranslation
            senses={parsed.translation.senses}
            examples={parsed.examples}
            showExamples={showExamples}
          />
        ) : (
          <div dangerouslySetInnerHTML={markUpRuText(ru, showExamples)}></div>
        )}
      </>
    );
  },
);
