import { component$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import { type WhereType } from '../comments/comment-form';
import { eyeSvg } from '../media/svg';
import { getContentPath } from '~/misc/helpers/content';
import { type BookCardInfo } from '~/routes/read/books';

type CardTitleProps = {
  contentId: string;
  contentType: WhereType;
  hits: number;
  title: string;
  isUnapproved?: boolean;
  book?: BookCardInfo;
};

export const CardTitle = component$(
  ({ contentId, contentType, hits, title, isUnapproved, book }: CardTitleProps) => {
    return (
      <h2 class="card-title hover:text-accent">
        <Link href={getContentPath(contentType, contentId, isUnapproved, undefined, book)}>
          {title}{' '}
          {hits > 0 && (
            <div
              class="tooltip tooltip-info tooltip-bottom"
              data-tip={'Просмотров: ' + (hits || 0)}
            >
              <div class="badge badge-secondary">
                {eyeSvg} <span class={'pl-1'}>{hits || 0}</span>
              </div>
            </div>
          )}
        </Link>
      </h2>
    );
  },
);
