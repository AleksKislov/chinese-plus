import { $, component$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import Cookies from 'js-cookie';
import { ApiService } from '~/misc/actions/request';

type CsvCardProps = {
  level: string | null;
  isOldHsk: boolean;
  isPrivate: boolean;
};

export const CsvCard = component$(({ level, isOldHsk, isPrivate }: CsvCardProps) => {
  const isNotHsk = level === null && isPrivate && !isOldHsk;
  const nonPrivateHsk = isOldHsk ? 'lexicon/csv/' : 'newhskwords/csv/';
  const privateHsk = isOldHsk ? 'words/csv' : 'userwords/csv';
  const urlPath = isPrivate ? privateHsk : nonPrivateHsk + (level || '1');

  const plainCsvLink = `${ApiService.baseUrl}/api/${urlPath}`;

  const hskType = isNotHsk ? '' : `HSK${isOldHsk ? '2' : '3'}.0`;

  const downloadCsv = (isHtml: boolean, hasExamples: boolean) =>
    $(async () => {
      try {
        const link = isHtml ? `${plainCsvLink}?is_html=1` : plainCsvLink;
        const csvLink = hasExamples ? link + '&has_examples=1' : link;
        console.log({ csvLink });
        const response = await fetch(csvLink, {
          // @ts-ignore
          headers: {
            'x-auth-token': Cookies.get('token'),
          },
        });

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const hskStr = isNotHsk ? 'words' : `${hskType}${level ? `_lvl_${level}` : ''}`;
        const fileName = `${isPrivate ? 'user_' : ''}${hskStr}${isHtml ? '_html' : ''}${
          hasExamples ? '_examples' : ''
        }`;

        // Create a temporary link and trigger download
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `${fileName.toLowerCase()}.csv`;
        document.body.appendChild(a);
        a.click();

        // Clean up
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } catch (error) {
        console.error('Download failed:', error);
      }
    });

  return (
    <div class="card bg-primary text-primary-content my-3">
      <div class="card-body">
        <h2 class="card-title">
          CSV-файл {hskType} {level ? `ур. ${level === '789' ? '7-9' : level}` : ''}
        </h2>
        {isOldHsk ? (
          <>
            <p>
              <Link
                class="badge bg-warning text-warning-content link-hover cursor-pointer"
                onClick$={downloadCsv(false, false)}
              >
                Скачать
              </Link>{' '}
              обычный CSV
            </p>
            <p>
              <Link
                class="badge bg-warning text-warning-content link-hover cursor-pointer"
                onClick$={downloadCsv(true, false)}
              >
                Скачать
              </Link>{' '}
              CSV с HTML (для ANKI)
            </p>
          </>
        ) : (
          <>
            <p>
              <Link
                class="badge bg-warning text-warning-content link-hover cursor-pointer"
                onClick$={downloadCsv(true, false)}
              >
                Скачать
              </Link>{' '}
              CSV с HTML без примеров (для ANKI)
            </p>
            <p>
              <Link
                class="badge bg-warning text-warning-content link-hover cursor-pointer"
                onClick$={downloadCsv(true, true)}
              >
                Скачать
              </Link>{' '}
              CSV с HTML и примерами (для ANKI)
            </p>
          </>
        )}
      </div>
    </div>
  );
});
