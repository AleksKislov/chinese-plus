import { component$ } from '@builder.io/qwik';
import { markUpRuText } from '~/misc/helpers/translation';

export const DictWordTranslation = component$(
  ({
    ru,
    showExamples,
    py,
    tradChinese,
  }: {
    ru: string;
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
        <div dangerouslySetInnerHTML={markUpRuText(ru, showExamples)}></div>
      </>
    );
  },
);
