import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { type DocumentHead, type RequestEvent, routeAction$ } from '@builder.io/qwik-city';
import { ApiService } from '~/misc/actions/request';

import { FlexRow } from '~/components/common/layout/flex-row';
import { Sidebar } from '~/components/common/layout/sidebar';
import { MainContent } from '~/components/common/layout/main-content';
import { PageTitle } from '~/components/common/layout/title';
import { BlogCard } from '~/components/read/blog-card';
import { type BlogCardInfo } from '../blog';
import { MoreBtnAndLoader } from '~/components/common/ui/more-btn-and-loader';
import { getTokenFromCookie } from '~/misc/actions/auth';

export const onGet = async ({ cookie, redirect }: RequestEvent) => {
  const token = getTokenFromCookie(cookie);
  if (!token) throw redirect(302, '/login');
};

export const getPostsWithSkip = routeAction$((params, ev): Promise<BlogCardInfo[]> => {
  const token = getTokenFromCookie(ev.cookie);
  return ApiService.get(`/api/blogs/not_approved?skip=${params.skip}`, token, []);
});

export default component$(() => {
  const getPosts = getPostsWithSkip();
  const posts = useSignal<BlogCardInfo[]>([]);
  const skipSignal = useSignal(0);

  useVisibleTask$(({ track }) => {
    const skip = track(() => skipSignal.value);
    getPosts.submit({ skip });
  });

  useVisibleTask$(({ track }) => {
    const res = track(() => getPosts.value);
    if (!res) return;
    posts.value = [...posts.value, ...res];
  });

  return (
    <>
      <PageTitle txt={'Посты на проверке'} />
      <FlexRow>
        <Sidebar>
          <div class="card bg-primary text-primary-content">
            <div class="card-body">
              <h2 class="card-title">Нужно проверить</h2>
              <p>Посты блога, которые ожидают проверки модератором или админом.</p>
            </div>
          </div>
        </Sidebar>

        <MainContent>
          <div class="columns-1 md:columns-2 gap-3">
            {posts.value.map((post, ind) => (
              <BlogCard key={ind} post={post} isUnapproved={true} />
            ))}
          </div>

          <MoreBtnAndLoader skipSignal={skipSignal} isLoading={getPosts.isRunning} />
        </MainContent>
      </FlexRow>
    </>
  );
});

export const head: DocumentHead = {
  title: 'Chinese+ Посты на проверке',
};
