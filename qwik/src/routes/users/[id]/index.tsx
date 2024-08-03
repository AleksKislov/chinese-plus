import { component$ } from '@builder.io/qwik';
import { type DocumentHead, routeLoader$ } from '@builder.io/qwik-city';
import { FlexRow } from '~/components/common/layout/flex-row';
import { PageTitle } from '~/components/common/layout/title';
import { ApiService } from '~/misc/actions/request';
import { UserMainInfo } from '~/components/me/user-main-info';
import { WHERE } from '~/components/common/comments/comment-form';
import { UserContentTable } from '~/components/users/user-content-table';
import { type VideoCategory } from '~/routes/watch/videos';

type UserInfo = {
  _id: string;
  name: string;
  role?: 'moderator' | 'admin';
  newAvatar?: NewAvatar;
};

export const getUserInfo = routeLoader$(async ({ params }): Promise<UserInfo> => {
  return ApiService.get('/api/users/' + params.id, undefined, {
    _id: params.id,
    name: 'unknown',
    role: undefined,
    newAvatar: undefined,
  });
});

export type UserPublishedText = {
  _id: ObjectId;
  categoryInd: number;
  hits: number;
  title: string;
  level: 1 | 2 | 3;
  likes: ObjectId[];
  date: string;
  comments_id: ObjectId[];
};

export type UserPublishedVideo = {
  _id: ObjectId;
  category: VideoCategory;
  hits: number;
  title: string;
  lvl: 1 | 2 | 3;
  likes: ObjectId[];
  date: string;
  comments_id: ObjectId[];
};

export const useGetUserContent = routeLoader$(
  async ({ params }): Promise<[UserPublishedText[], UserPublishedVideo[]]> => {
    return Promise.all([
      ApiService.get('/api/texts/user/' + params.id, undefined, []),
      ApiService.get('/api/videos/user/' + params.id, undefined, []),
    ]);
  },
);

export default component$(() => {
  const [texts, videos] = useGetUserContent().value;
  const userInfo = getUserInfo();
  const { _id: userId, newAvatar, role, name } = userInfo.value;

  return (
    <>
      <PageTitle txt={'О пользователе'} />

      <FlexRow>
        <div class="w-full basis-1/2  mt-3">
          <UserMainInfo
            id={userId}
            newAvatar={newAvatar}
            role={role}
            name={name}
            isPrivate={false}
          />
        </div>

        <div class="w-full basis-1/2"></div>
      </FlexRow>

      <FlexRow>
        <div class="w-full basis-1/2 mt-3">
          <div class="prose mb-3">
            <h3>Тексты: {texts.length}</h3>
          </div>
          <UserContentTable content={texts} contentType={WHERE.text} />
        </div>
        <div class="w-full basis-1/2 mt-3">
          <div class="prose mb-3">
            <h3>Видео: {videos.length}</h3>
          </div>
          <UserContentTable content={videos} contentType={WHERE.video} />
        </div>
      </FlexRow>
    </>
  );
});

export const head: DocumentHead = {
  title: 'Chinese+ страница пользователя',
};
