import { component$, useVisibleTask$ } from '@builder.io/qwik';
import { type DocumentHead, routeLoader$, routeAction$, z, zod$ } from '@builder.io/qwik-city';
import { ApiService } from '~/misc/actions/request';
import { FlexRow } from '~/components/common/layout/flex-row';
import { Sidebar } from '~/components/common/layout/sidebar';
import CONSTANTS from '~/misc/consts/consts';
import { ContentPageCard } from '~/components/common/content-cards/content-page-card';
import { WHERE } from '~/components/common/comments/comment-form';
import { type CommentType } from '~/components/common/comments/comment-card';
import { getContentComments } from '~/misc/actions/get-content-comments';
import { type TextCardInfo } from '..';
import { parseTextWords } from '~/misc/helpers/content';
import { ContentPageHead } from '~/components/common/ui/content-page-head';
import { ReadResultCard } from '~/components/me/read-result-card';
import { TextMainContent } from '~/components/read/text-main-content';
import { type TooltipSegment } from '~/misc/helpers/content/parse-text-words';
import { getIdFromParam } from '~/misc/helpers/tools';
import { getContentPath, withSlug } from '~/misc/helpers/content';
import { JsonLd } from '~/components/common/seo/json-ld';
import CONST_URLS from '~/misc/consts/urls';
import { getOrSetVisitorId } from '~/misc/helpers/visitor-id';
import { truncateCrumb } from '~/components/common/layout/breadcrumbs';

export type TextContent = {
  // origintext?: string[];
  translation: string[];
  chinese_arr: string[];
  origParagsLen: number[];
  uniqCharsTotal: number;
};

export type TextFromDB = TextCardInfo &
  TextContent & {
    pages: (TextContent & { _id: ObjectId })[];
    sameTitleCount?: number; // approved texts with this title
  };

export type TooltipParagraph = TooltipSegment[]; // Tooltip data for one paragraph
export type TooltipText = {
  tooltipTxt: TooltipParagraph[]; // Array of paragraphs, each containing tooltip segments
};

export type SimilarText = {
  _id: ObjectId;
  audioSrc?: 0 | 1;
  title: string;
  picUrl: string;
  matchingTags?: string[];
};

export const getTextFromDB = (
  id: ObjectId,
  noOrigin: boolean,
  visitorId?: string,
): Promise<TextFromDB> => {
  const vidParam = visitorId ? `&vid=${visitorId}` : '';
  return ApiService.get(`/api/texts/${id}?no_origin=${noOrigin}${vidParam}`, undefined, null);
};

export const getWordsForTooltips = (
  wordsArr: string[],
  isShortRu?: boolean,
): Promise<TooltipSegment[]> => {
  const shortRu = isShortRu ? '?isShortRu=1' : '';
  return ApiService.post(`/api/dictionary/allwords${shortRu}`, wordsArr, undefined, []);
};

export const getComments = routeLoader$(({ params }): Promise<CommentType[]> => {
  return getContentComments(WHERE.text, getIdFromParam(params.id));
});

export const useGetText = routeLoader$(
  async (requestEvent): Promise<TextFromDB & TooltipText & { curPage: number }> => {
    const { params, query, redirect } = requestEvent;
    const curPage = getCurrentPageNum(query.get('pg'));
    const visitorId = getOrSetVisitorId(requestEvent);
    const textFromDb = await getTextFromDB(getIdFromParam(params.id), true, visitorId);
    if (!textFromDb) throw redirect(302, '/read/texts');
    // Unapproved texts are shown only under /read/unapproved-texts/ (noindex).
    if (!textFromDb.isApproved) throw redirect(302, `/read/unapproved-texts/${textFromDb._id}`);

    const canonicalId = withSlug(textFromDb._id, textFromDb.title);
    if (params.id !== canonicalId) {
      const pg = query.get('pg');
      throw redirect(301, `/read/texts/${canonicalId}${pg ? `?pg=${pg}` : ''}`);
    }

    const chineseArr = getChineseArr(textFromDb, curPage);
    const dbWords = await getWordsForTooltips(chineseArr, true);
    const tooltipTxt = parseTextWords(chineseArr, dbWords);
    return { ...textFromDb, tooltipTxt, curPage };
  },
);

export const useGetSimilarTextsAction = routeAction$(
  async (params): Promise<SimilarText[]> => {
    const { lvl, tags, textId } = params;

    return ApiService.get(
      `/api/texts/similar?lvl=${lvl}&tags=${tags.join(',')}&text_id=${textId}`,
      undefined,
      [],
    );
  },
  zod$({
    lvl: z.number().int(),
    tags: z.array(z.string()),
    textId: z.string(),
  }),
);

export function getCurrentPageNum(pg: string | null = '1'): number {
  if (!pg) return 0;
  if (+pg && +pg > 0) return +pg - 1;
  return 0;
}

export function getChineseArr(textFromDb: TextFromDB, curPage: number): string[] {
  // Ensure pages exist and curPage is within bounds
  if (textFromDb.pages && textFromDb.pages.length > curPage && curPage >= 0) {
    return textFromDb.pages[curPage]?.chinese_arr || [];
  }
  // Fallback to root chinese_arr if pages aren't used or curPage is invalid
  return textFromDb.chinese_arr || [];
}

export function getTranslationArr(textFromDb: TextFromDB, curPage: number): string[] {
  if (textFromDb.pages && textFromDb.pages.length > curPage && curPage >= 0) {
    return textFromDb.pages[curPage]?.translation || [];
  }
  return textFromDb.translation || [];
}

const CN_PUNCTUATION = /[\n。，！？；：、,.!?;:]/;

// Opening words of the Chinese text, up to the first punctuation mark
function getChineseOpening(words: string[], maxLen = 16): string {
  let opening = '';
  for (const word of words) {
    if (CN_PUNCTUATION.test(word)) {
      if (opening) return opening;
      continue;
    }
    if ((opening + word).length > maxLen) return opening ? opening + '…' : word.slice(0, maxLen);
    opening += word;
  }
  return opening;
}

// First paragraphs of the translation, enough for the meta description
function getTranslationStart(paragraphs: string[], minLen = 200): string {
  let start = '';
  for (const parag of paragraphs) {
    if (start.length >= minLen) break;
    start += ' ' + parag;
  }
  return start.replace(/\s+/g, ' ').trim();
}

function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str;
  const cut = str.slice(0, maxLen);
  const lastSpace = cut.lastIndexOf(' ');
  return (lastSpace > maxLen / 2 ? cut.slice(0, lastSpace) : cut).replace(/[\s,.;:—-]+$/, '') + '…';
}

export default component$(() => {
  const textLoader = useGetText();
  const comments = getComments();
  const getSimilarTexts = useGetSimilarTextsAction();

  const {
    _id: textId,
    title,
    description: desc,
    tags,
    hits,
    user: { _id: userId, name: userName },
    date,
    level: lvl,
    pic_url: picUrl,
    categoryInd,
    likes,
    length,
    source,
    isApproved,
    tooltipTxt,
    uniqCharsTotal,
  } = textLoader.value;

  useVisibleTask$(
    () => {
      if (!isApproved) return; // Only fetch if approved
      getSimilarTexts.submit({ lvl, tags, textId });
    },
    { strategy: 'document-ready' },
  );

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: title,
          description: desc,
          image: picUrl,
          datePublished: date,
          author: { '@type': 'Person', name: userName },
        }}
      />
      <ContentPageHead
        title={title}
        hits={hits}
        crumbs={[{ name: 'Тексты', href: '/read/texts/' }, { name: truncateCrumb(title) }]}
      />

      <FlexRow>
        <Sidebar noAds={true}>
          <ContentPageCard
            title={title}
            desc={desc}
            length={length}
            tags={tags}
            userId={userId}
            userName={userName}
            date={date}
            lvl={lvl}
            picUrl={picUrl}
            category={CONSTANTS.textCategories[categoryInd]}
            likes={likes}
            contentType={WHERE.text}
            contentId={textId}
            textSource={source}
            uniqCharsTotal={uniqCharsTotal}
            isApproved={Boolean(isApproved)} // Ensure boolean
          />
          <ReadResultCard />
        </Sidebar>
        <TextMainContent
          tooltipTxt={tooltipTxt}
          text={textLoader.value}
          comments={comments.value}
          restLoading={false}
          similarTexts={getSimilarTexts.value as SimilarText[]}
        />
      </FlexRow>
    </>
  );
});

export const head: DocumentHead = ({ resolveValue }) => {
  const textInfo = resolveValue(useGetText);
  const { curPage } = textInfo;
  // Many texts share a title ("Описание задания из игры World of Warcraft"), so add the
  // Chinese opening to tell them apart; the description gets the start of the translation.
  const chineseOpening =
    (textInfo.sameTitleCount || 0) > 1 ? getChineseOpening(getChineseArr(textInfo, curPage)) : '';
  const pageSuffix = curPage > 0 ? ` — стр. ${curPage + 1}` : '';
  const title = `${textInfo.title}${
    chineseOpening ? `: ${chineseOpening}` : ''
  }${pageSuffix} — текст на китайском с переводом | Chinese+`;

  const desc = textInfo.description?.trim();
  const translationStart = getTranslationStart(getTranslationArr(textInfo, curPage));
  const descPrefix =
    desc && desc !== textInfo.title ? `${textInfo.title}. ${truncate(desc, 100)}` : textInfo.title;
  const description = translationStart
    ? `${descPrefix}: «${truncate(translationStart, 120)}» Текст на китайском с переводом.`
    : `Текст на китайском языке с переводом: ${descPrefix}`;
  const url =
    CONST_URLS.siteUrl +
    getContentPath(WHERE.text, textInfo._id, false, undefined, undefined, textInfo.title);

  return {
    title,
    meta: [
      {
        name: 'description',
        content: description,
      },
      {
        property: 'og:title',
        content: title,
      },
      {
        property: 'og:description',
        content: description,
      },
      {
        property: 'og:type',
        content: 'article',
      },
      {
        property: 'og:url',
        content: url,
      },
      // no picture -> no tag, so RouterHead adds the default image
      ...(textInfo.pic_url ? [{ property: 'og:image', content: textInfo.pic_url }] : []),
      {
        name: 'twitter:card',
        content: 'text_image_' + textInfo._id,
      },
      {
        name: 'twitter:image',
        content: textInfo.pic_url,
      },
    ],
  };
};
