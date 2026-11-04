import { component$, useSignal } from '@builder.io/qwik';
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

export type UserPublishedBlogPost = {
  _id: ObjectId;
  category: string;
  hits: number;
  title: string;
  likes: ObjectId[];
  date: string;
  comments_id: ObjectId[];
};

export const useGetUserContent = routeLoader$(
  async ({
    params,
  }): Promise<[UserPublishedText[], UserPublishedVideo[], UserPublishedBlogPost[]]> => {
    return Promise.all([
      ApiService.get('/api/texts/user/' + params.id, undefined, []),
      ApiService.get('/api/videos/user/' + params.id, undefined, []),
      ApiService.get('/api/blogs/user/' + params.id, undefined, []),
    ]);
  },
);

type ProfileTab = WHERE.text | WHERE.video | WHERE.blog;

export default component$(() => {
  const [texts, videos, blogPosts] = useGetUserContent().value;
  const userInfo = getUserInfo();
  const { _id: userId, newAvatar, role, name } = userInfo.value;
  const activeTab = useSignal<ProfileTab>(WHERE.text);

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
        <div class="w-full mt-3">
          <div role="tablist" class="tabs tabs-boxed w-fit mb-3">
            <button
              type="button"
              role="tab"
              class={`tab ${activeTab.value === WHERE.text ? 'tab-active' : ''}`}
              onClick$={() => (activeTab.value = WHERE.text)}
            >
              Тексты: {texts.length}
            </button>
            <button
              type="button"
              role="tab"
              class={`tab ${activeTab.value === WHERE.video ? 'tab-active' : ''}`}
              onClick$={() => (activeTab.value = WHERE.video)}
            >
              Видео: {videos.length}
            </button>
            <button
              type="button"
              role="tab"
              class={`tab ${activeTab.value === WHERE.blog ? 'tab-active' : ''}`}
              onClick$={() => (activeTab.value = WHERE.blog)}
            >
              Блог: {blogPosts.length}
            </button>
          </div>

          {activeTab.value === WHERE.text && (
            <UserContentTable content={texts} contentType={WHERE.text} />
          )}
          {activeTab.value === WHERE.video && (
            <UserContentTable content={videos} contentType={WHERE.video} />
          )}
          {activeTab.value === WHERE.blog && (
            <UserContentTable content={blogPosts} contentType={WHERE.blog} />
          )}
        </div>
      </FlexRow>
    </>
  );
});

export const head: DocumentHead = {
  title: 'Chinese+ страница пользователя',
};
