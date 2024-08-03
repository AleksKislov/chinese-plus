import { component$, useContext } from '@builder.io/qwik';
import { type RequestEvent, type DocumentHead, routeLoader$ } from '@builder.io/qwik-city';
import { FlexRow } from '~/components/common/layout/flex-row';
import { PageTitle } from '~/components/common/layout/title';
import { UserMainInfo } from '~/components/me/user-main-info';
import { getTokenFromCookie } from '~/misc/actions/auth';
import { userContext } from '~/root';
import { ApiService } from '~/misc/actions/request';
import { type VideoCategory } from '~/routes/watch/videos';
import { MarkedTable } from '~/components/me/marked/marked-table';
import { WHERE } from '~/components/common/comments/comment-form';

export const onGet = async ({ cookie, redirect }: RequestEvent) => {
  const token = getTokenFromCookie(cookie);
  if (!token) throw redirect(302, '/login');
};

export type MarkedVideo = {
  category: VideoCategory;
  hits: number;
  _id: ObjectId;
  title: string;
  lvl: 1 | 2 | 3;
  user: ShortUserInfo;
  comments_id: ObjectId[];
  likes: ObjectId[];
  date: string;
};

export type MarkedText = {
  categoryInd: number;
  hits: number;
  _id: ObjectId;
  title: string;
  level: 1 | 2 | 3;
  user: ShortUserInfo;
  comments_id: ObjectId[];
  likes: ObjectId[];
  date: string;
  audioSrc?: 0 | 1;
};

export const useGetMarkedContent = routeLoader$(
  async ({ cookie }): Promise<[MarkedText[], MarkedVideo[]]> => {
    const token = getTokenFromCookie(cookie);
    if (!token) return [[], []];
    return Promise.all([
      ApiService.get('/api/texts/marked', token, []),
      ApiService.get('/api/videos/marked', token, []),
    ]);
  },
);

export default component$(() => {
  const [texts, videos] = useGetMarkedContent().value;
  const { _id, newAvatar, role, name } = useContext(userContext);

  return (
    <>
      <PageTitle txt={'Закладки'} />

      <FlexRow>
        <div class="w-full basis-1/2 mt-3">
          <UserMainInfo id={_id} newAvatar={newAvatar} role={role} name={name} isPrivate={true} />
        </div>

        <div class="w-full basis-1/2 mt-3"></div>
      </FlexRow>

      <FlexRow>
        <div class="w-full basis-1/2 mt-3">
          <div class="prose mb-3">
            <h3>Тексты: {texts.length}</h3>
          </div>
          <MarkedTable content={texts} contentType={WHERE.text} />
        </div>
        <div class="w-full basis-1/2 mt-3">
          <div class="prose mb-3">
            <h3>Видео: {videos.length}</h3>
          </div>
          <MarkedTable content={videos} contentType={WHERE.video} />
        </div>
      </FlexRow>
    </>
  );
});

export const head: DocumentHead = {
  title: 'Chinese+ Закладки',
};
