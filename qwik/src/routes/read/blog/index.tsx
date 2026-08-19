import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { type DocumentHead, routeAction$ } from '@builder.io/qwik-city';
import { ApiService } from '~/misc/actions/request';

import { FlexRow } from '~/components/common/layout/flex-row';
import { Sidebar } from '~/components/common/layout/sidebar';
import { MainContent } from '~/components/common/layout/main-content';
import { PageTitle } from '~/components/common/layout/title';
import { BlogCard } from '~/components/read/blog-card';
import { CreateBlogCard } from '~/components/read/create-blog-card';
import { MoreBtnAndLoader } from '~/components/common/ui/more-btn-and-loader';
import { type BlogBlock } from '~/misc/helpers/content';

export type BlogCardInfo = {
  _id: ObjectId;
  postType: 'simple' | 'article';
  category: string;
  tags: string[];
  hits: number;
  title: string;
  content: BlogBlock[];
  user: ShortUserInfo;
  isApproved: 1 | 0 | undefined;
  comments_id: CommentId[];
  likes: ContentLike[];
  date: ISODate;
};

export const getBlogPostsWithSkip = routeAction$((params): Promise<BlogCardInfo[]> => {
  const { skip, category } = params;
  const catParam = category ? `&category=${category}` : '';
  return ApiService.get(`/api/blogs?skip=${skip}${catParam}`, undefined, []);
});

export default component$(() => {
  const posts = useSignal<BlogCardInfo[]>([]);
  const getPosts = getBlogPostsWithSkip();
  const skipSignal = useSignal(0);

  useVisibleTask$(({ track }) => {
    const skip = track(() => skipSignal.value);
    getPosts.submit({ skip, category: '' });
  });

  useVisibleTask$(({ track }) => {
    const res = track(() => getPosts.value);
    if (!res) return;
    posts.value = [...posts.value, ...res];
  });

  return (
    <>
      <PageTitle txt={'Блог Chinese+'} />
      <FlexRow>
        <Sidebar>
          <CreateBlogCard />
        </Sidebar>

        <MainContent>
          <div class="columns-1 md:columns-2 gap-3">
            {posts.value.map((post, ind) => (
              <BlogCard key={ind} post={post} />
            ))}
          </div>

          <MoreBtnAndLoader skipSignal={skipSignal} isLoading={getPosts.isRunning} />
        </MainContent>
      </FlexRow>
    </>
  );
});

export const head: DocumentHead = {
  title: 'Chinese+ Блог',
  meta: [
    {
      name: 'description',
      content: 'Блог сообщества Chinese+: истории, заметки и мысли об изучении китайского языка.',
    },
  ],
  links: [
    {
      rel: 'alternate',
      type: 'application/rss+xml',
      title: 'Chinese+ Блог RSS',
      href: '/read/blog/rss.xml',
    },
  ],
};
