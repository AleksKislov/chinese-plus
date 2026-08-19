import { routeAction$, type RequestEvent, type DocumentHead } from '@builder.io/qwik-city';
import { component$, useStore } from '@builder.io/qwik';
import { PageTitle } from '~/components/common/layout/title';
import { getTokenFromCookie } from '~/misc/actions/auth';
import { ApiService } from '~/misc/actions/request';
import { Alerts } from '~/components/common/alerts/alerts';
import { OtherBlogFields } from '~/components/create-edit/other-blog-fields';
import { BlogTextEditor } from '~/components/create-edit/blog-text-editor';
import { SimplePostEditor } from '~/components/create-edit/simple-post-editor';
import { type BlogBlock } from '~/misc/helpers/content';
import { type BlogPostFromDB } from '~/routes/read/blog/[id]';

export type NewBlogStore = {
  postType: 'simple' | 'article';
  title: string;
  content: BlogBlock[];
  tags: string;
  category: string;
};

export const onGet = async ({ cookie, redirect }: RequestEvent) => {
  const token = getTokenFromCookie(cookie);
  if (!token) throw redirect(302, '/login');
};

export const usePublishBlogPost = routeAction$(
  async (params, ev): Promise<BlogPostFromDB | null> => {
    const token = getTokenFromCookie(ev.cookie);
    if (!token) return null;
    return ApiService.post('/api/blogs/create', params, token, null);
  },
);

export default component$(() => {
  const store: NewBlogStore = useStore({
    postType: 'simple',
    title: '',
    content: [{ type: 'text', text: '' }],
    tags: '',
    category: 'general',
  });

  return (
    <>
      <PageTitle txt={'Новый пост в блоге'} />
      <Alerts />

      <div class="tabs tabs-boxed w-fit mb-3">
        <button
          type="button"
          class={`tab ${store.postType === 'simple' ? 'tab-active' : ''}`}
          onClick$={() => (store.postType = 'simple')}
        >
          Мини-пост
        </button>
        <button
          type="button"
          class={`tab ${store.postType === 'article' ? 'tab-active' : ''}`}
          onClick$={() => (store.postType = 'article')}
        >
          Статья
        </button>
      </div>

      <div class="card bg-base-200 border border-base-300 mb-3">
        <div class="card-body">
          {store.postType === 'article' && <OtherBlogFields store={store} />}

          {store.postType === 'simple' ? (
            <SimplePostEditor store={store} />
          ) : (
            <BlogTextEditor store={store} />
          )}
        </div>
      </div>
    </>
  );
});

export const head: DocumentHead = {
  title: 'Chinese+ Новый пост в блоге',
  meta: [
    {
      name: 'description',
      content: 'Поделитесь своей историей или заметкой в блоге Chinese+',
    },
  ],
};
