import { component$, useSignal } from '@builder.io/qwik';
import { type BookCardInfo } from '~/routes/read/books';
import { TextDesc } from '../common/content-cards/text-desc';
import { TagsLine } from '../common/content-cards/tags-line';
import CONST_URLS from '~/misc/consts/urls';
import { TextSource } from '../common/content-cards/text-source';
import { InfoLine } from '../common/content-cards/info-line';
import { CountryInfoLine } from '../common/content-cards/country-info-line';

// sidebar card
export const BookInfoCard = component$(
  ({ book: { genres, year, author, translationSrc, about, picUrl } }: { book: BookCardInfo }) => {
    const imageSrc = useSignal(picUrl);

    return (
      <div class="card w-full bg-base-300 mb-3">
        <figure>
          <img
            src={imageSrc.value}
            width="400"
            height="711"
            alt="Content pic"
            onError$={() => (imageSrc.value = CONST_URLS.defaultTextPic)}
          />
        </figure>

        <div class="card-body">
          <TagsLine tags={genres} />

          <InfoLine name={'Писатель'} value={author.name.ru + ' | ' + author.name.cn} />
          <InfoLine name={'Год'} value={'' + year} />
          <CountryInfoLine country={author.country} />
          <TextSource source={translationSrc} isTranslation={true} />

          <TextDesc desc={about} />
        </div>
      </div>
    );
  },
);
