import { markUpRuText } from './mark-up-ru-text';

export const ExamplesMarker = "<span class='tippyExample block'>";

export const parseRussian = (translation: string, showExamples: boolean): string => {
  if (!translation) return ' ';
  let russian = markUpRuText(translation, showExamples);

  // Only truncate if the text is long AND the examples marker is present.
  if (russian.length > 2000 && russian.includes(ExamplesMarker)) {
    const firstExampleIndex = russian.indexOf(ExamplesMarker);

    if (firstExampleIndex > 0) {
      russian = russian.substring(0, firstExampleIndex);
    }
  }

  return russian;
};
