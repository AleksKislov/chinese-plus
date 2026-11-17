import { component$ } from '@builder.io/qwik';
import CONST_URLS from '~/misc/consts/urls';

type PdfCardProps = {
  level: string;
  isOldHsk: boolean;
};

// file names as server/scripts/generate-hsk-pdfs.js uploads them (hskPdfKey)
const pdfUrl = (isOldHsk: boolean, level: string, practice: boolean) =>
  `${CONST_URLS.hskPdfUrl}hsk${isOldHsk ? '2' : '3'}-${level === '789' ? '7-9' : level}${
    practice ? '-practice' : ''
  }.pdf`;

// Printable word list of the level: plain links (crawlable, no JS), files in the bucket.
export const PdfCard = component$(({ level, isOldHsk }: PdfCardProps) => {
  const hskType = `HSK ${isOldHsk ? '2' : '3'}.0`;
  const levelLabel = level === '789' ? '7–9' : level;

  return (
    <div class="card bg-primary text-primary-content my-3">
      <div class="card-body">
        <h2 class="card-title">
          PDF {hskType} ур. {levelLabel}
        </h2>
        <p>
          <a
            href={pdfUrl(isOldHsk, level, false)}
            target="_blank"
            rel="noopener"
            class="badge bg-warning text-warning-content link-hover"
          >
            Скачать
          </a>{' '}
          список слов с пиньинем и переводом
        </p>
        <p>
          <a
            href={pdfUrl(isOldHsk, level, true)}
            target="_blank"
            rel="noopener"
            class="badge bg-warning text-warning-content link-hover"
          >
            Скачать
          </a>{' '}
          для самопроверки — без перевода
        </p>
      </div>
    </div>
  );
});
