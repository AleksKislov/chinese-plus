import { component$, useSignal } from '@builder.io/qwik';
import { UserDateDiv } from '../comments/user-with-date';
import { ContentCat } from './content-cat';
import { ContentLen } from './content-len';
import { ContentLvl } from './content-lvl';
import { LikeBtn } from './like-btn';
import { TagsLine } from './tags-line';
import { TextDesc } from './text-desc';
import { WHERE, type WhereType } from '../comments/comment-form';
import { TextSource } from './text-source';
import { EditBtn } from './edit-btn';
import CONST_URLS from '~/misc/consts/urls';
import { BookmarkBtn } from './bookmark-btn';
import { DeleteContentBtn } from './delete-content-btn';
import { UniqCharsTotal } from './uniq-chars-total';

type ContentPageCardProps = {
  contentType: WhereType;
  contentId: ObjectId;
  picUrl: string;
  tags: string[];
  userId: ObjectId;
  userName: string;
  date: ISODate;
  lvl: 1 | 2 | 3;
  category: string;
  length?: number;
  desc: string;
  likes: ContentLike[];
  textSource?: string;
  isApproved: boolean;
  uniqCharsTotal?: number;
};

export enum FontSizeBtns {
  sm = '小',
  md = '中',
  lg = '大',
}

export type FontSizeBtnsUnion = '小' | '中' | '大';

export const FontSizeMap: { [key: string]: string } = {
  小: 'text-base',
  中: 'text-lg',
  大: 'text-2xl',
};

export const ContentPageCard = component$(
  ({
    picUrl,
    tags,
    userId,
    userName,
    date,
    lvl,
    category,
    length,
    desc,
    likes,
    contentType,
    contentId,
    textSource,
    isApproved,
    uniqCharsTotal,
  }: ContentPageCardProps) => {
    const likesSignal = useSignal(likes);
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
          <TagsLine tags={tags} />
          <UserDateDiv userId={userId} userName={userName} date={date} ptNum={0} />
          <div>
            <span class={'font-bold'}>Благодарности: </span>
            <LikeBtn
              likes={likesSignal}
              contentType={contentType}
              contentId={contentId}
              creatorId={userId}
            />
          </div>
          <ContentLvl lvl={lvl} />
          <ContentCat txt={category} />
          <ContentLen len={length || 0} />
          <UniqCharsTotal num={uniqCharsTotal} />

          {textSource && <TextSource source={textSource} />}
          {(contentType === WHERE.video || contentType === WHERE.text) && (
            <div>
              <span class={'font-bold'}>В закладки: </span>
              <BookmarkBtn contentType={contentType} contentId={contentId} />
            </div>
          )}
          <TextDesc desc={desc} />
          <EditBtn
            contentType={contentType}
            contentId={contentId}
            creatorId={userId}
            isApproved={isApproved}
          />
          <DeleteContentBtn contentType={contentType} contentId={contentId} />
        </div>
      </div>
    );
  },
);
