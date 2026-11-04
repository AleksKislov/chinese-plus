import { component$, useSignal } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import { WHERE, type WhereType } from '../comments/comment-form';
import { getContentPath } from '~/misc/helpers/content';
import CONST_URLS from '~/misc/consts/urls';
import { type BookCardInfo } from '~/routes/read/books';

type CardImgProps = {
  contentId: string;
  contentType: WhereType;
  picUrl: string;
  title: string;
  isUnapproved?: boolean;
  book?: BookCardInfo;
  /** 'side' (default): image beside the body, sized to its own aspect ratio.
   *  'top': image above the body, cropped to a fixed height so a grid of cards lines up. */
  variant?: 'side' | 'top';
};

export const CardImg = component$(
  ({ contentId, contentType, picUrl, title, isUnapproved, book, variant = 'side' }: CardImgProps) => {
    const errorPic = useSignal('');
    const isTop = variant === 'top';

    return (
      <figure
        class={
          isTop ? 'w-full h-48' : `lg:w-1/3 max-h-full ${contentType === WHERE.text ? 'max-h-52' : ''}`
        }
      >
        <Link
          href={getContentPath(contentType, contentId, isUnapproved, undefined, book, title)}
          class={isTop ? 'block w-full h-full' : ''}
          prefetch="js"
        >
          <img
            width="400"
            height="600"
            src={errorPic.value || picUrl}
            alt={title}
            class={isTop ? 'w-full h-full object-cover' : ''}
            style={contentType === WHERE.video ? { transform: 'scale(1.35)' } : {}}
            onError$={() => (errorPic.value = CONST_URLS.defaultTextPic)}
          />
        </Link>
      </figure>
    );
  },
);
