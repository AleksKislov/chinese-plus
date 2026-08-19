import { type RequestEvent, routeLoader$, routeAction$, type DocumentHead } from '@builder.io/qwik-city';
import { component$, useContext, useStore } from '@builder.io/qwik';
import { PageTitle } from '~/components/common/layout/title';
import { getTokenFromCookie } from '~/misc/actions/auth';
import { Alerts } from '~/components/common/alerts/alerts';
import { ApiService } from '~/misc/actions/request';
import { userContext } from '~/root';
import { EditBlogFields } from '~/components/create-edit/edit-blog-fields';
import { EditBlogTextEditor } from '~/components/create-edit/edit-blog-text-editor';
import { EditSimplePostEditor } from '~/components/create-edit/edit-simple-post-editor';
import { getBlogPostFromDB, type BlogPostFromDB } from '~/routes/read/blog/[id]';
import { getIdFromParam } from '~/misc/helpers/tools';
import { type BlogBlock } from '~/misc/helpers/content';

export type EditBlogStore = {
  postId: ObjectId;
  postType: 'simple' | 'article';
  title: string;
  content: BlogBlock[];
  tags: string;
  category: string;
  isApproved?: 0 | 1;
};

export const onGet = async ({ cookie, redirect }: RequestEvent) => {
  const token = getTokenFromCookie(cookie);
  if (!token) throw redirect(302, '/login');
};

export const useGetBlogPost = routeLoader$(
  async ({ params, redirect }): Promise<BlogPostFromDB> => {
    const post = await getBlogPostFromDB(getIdFromParam(params.id));
    if (!post) throw redirect(302, '/read/blog');
    return post;
  },
);

export const useEditBlogPost = routeAction$(
  async (params, ev): Promise<BlogPostFromDB | null> => {
    const token = getTokenFromCookie(ev.cookie);
    if (!token) return null;
    return ApiService.post('/api/blogs/update', params, token, null);
  },
);

export default component$(() => {
  const { isAdmin } = useContext(userContext);

  const { _id, postType, title, content, tags, category, isApproved } = useGetBlogPost().value;

  const store: EditBlogStore = useStore({
    postId: _id,
    postType,
    title: title || '',
    content: content.length ? content : [{ type: 'text', text: '' }],
    tags: tags.join(', '),
    category: category || 'general',
    isApproved,
  });

  return (
    <>
      <PageTitle txt={'Редактировать пост'} />
      <Alerts />

      <div class="card bg-base-200 border border-base-300 mb-3">
        <div class="card-body">
          {store.postType === 'article' && <EditBlogFields store={store} isAdmin={isAdmin} />}

          {store.postType === 'simple' ? (
            <EditSimplePostEditor store={store} />
          ) : (
            <EditBlogTextEditor store={store} />
          )}
        </div>
      </div>
    </>
  );
});

export const head: DocumentHead = {
  title: 'Chinese+ Редактировать пост в блоге',
};
