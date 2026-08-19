import { component$, useSignal, useStore } from '@builder.io/qwik';
import { type DocumentHead, routeLoader$ } from '@builder.io/qwik-city';
import { ApiService } from '~/misc/actions/request';
import { Alerts } from '~/components/common/alerts/alerts';
import CONSTANTS from '~/misc/consts/consts';
import {
  WHERE,
  type Addressee,
  type CommentIdToReply,
} from '~/components/common/comments/comment-form';
import { type CommentType } from '~/components/common/comments/comment-card';
import { getContentComments } from '~/misc/actions/get-content-comments';
import { type BlogCardInfo } from '..';
import { BackBtn } from '~/components/common/ui/back-btn';
import { PageTitle } from '~/components/common/layout/title';
import { BlogPostCard } from '~/components/read/blog-post-card';
import { BlogContent } from '~/components/read/blog-content';
import { CommentsFullBlock } from '~/components/common/comments/comments-full-block';
import { JsonLd } from '~/components/common/seo/json-ld';
import CONST_URLS from '~/misc/consts/urls';
import {
  getContentPath,
  getCoverImage,
  getPreviewText,
  parseTextWords,
  withSlug,
} from '~/misc/helpers/content';
import { getIdFromParam } from '~/misc/helpers/tools';
import { getWordsForTooltips } from '~/routes/read/texts/[id]';
import { getOrSetVisitorId } from '~/misc/helpers/visitor-id';

export type BlogPostFromDB = BlogCardInfo;

export const getBlogPostFromDB = (id: ObjectId, visitorId?: string): Promise<BlogPostFromDB> => {
  const vidParam = visitorId ? `?vid=${visitorId}` : '';
  return ApiService.get(`/api/blogs/${id}${vidParam}`, undefined, null);
};

export const getComments = routeLoader$(({ params }): Promise<CommentType[]> => {
  return getContentComments(WHERE.blog, getIdFromParam(params.id));
});

export const useGetBlogPost = routeLoader$(
  async (
    requestEvent,
  ): Promise<BlogPostFromDB & { tooltipsByBlock: ((string | DictWord)[][] | null)[] }> => {
    const { params, redirect } = requestEvent;
    const visitorId = getOrSetVisitorId(requestEvent);
    const post = await getBlogPostFromDB(getIdFromParam(params.id), visitorId);
    if (!post) throw redirect(302, '/read/blog');

    const canonicalId = withSlug(post._id, post.title);
    if (params.id !== canonicalId) {
      throw redirect(301, `/read/blog/${canonicalId}`);
    }

    const tooltipsByBlock = await Promise.all(
      post.content.map(async (block) => {
        if (block.type !== 'chinese' || !block.words.length) return null;
        const dbWords = await getWordsForTooltips(block.words, true);
        return parseTextWords(block.words, dbWords);
      }),
    );

    return { ...post, tooltipsByBlock };
  },
);

export default component$(() => {
  const postLoader = useGetBlogPost();
  const comments = getComments();

  const {
    _id: postId,
    title,
    tags,
    hits,
    user: { _id: userId, name: userName, bio: userBio },
    date,
    category,
    likes,
    content,
    tooltipsByBlock,
    isApproved,
  } = postLoader.value;

  const picUrl = getCoverImage(content);
  const desc = getPreviewText(content);

  const addressees = useSignal<Addressee[]>([]);
  const commentIdToReplyStore = useStore<CommentIdToReply>({
    commentId: '',
    name: '',
    userId: '',
  });

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: title,
          description: desc,
          image: picUrl,
          datePublished: date,
          author: { '@type': 'Person', name: userName },
        }}
      />
      <div class="max-w-prose mx-auto">
        <BackBtn path="/read/blog" />
        <PageTitle txt={title} hits={hits} hSizeSm={true} />

        <Alerts />

        <div class="prose max-w-none mb-6 mt-3 prose-p:my-3">
          <BlogContent content={content} tooltipsByBlock={tooltipsByBlock} />
        </div>

        <BlogPostCard
          postId={postId}
          tags={tags}
          userId={userId}
          userName={userName}
          userBio={userBio}
          date={date}
          category={CONSTANTS.blogCategories[category as keyof typeof CONSTANTS.blogCategories]}
          likes={likes}
          isApproved={Boolean(isApproved)}
        />

        <CommentsFullBlock
          contentId={postId}
          where={WHERE.blog}
          commentIdToReply={commentIdToReplyStore}
          addressees={addressees}
          comments={comments.value}
          author={{ id: userId, name: userName }}
        />
      </div>
    </>
  );
});

export const head: DocumentHead = ({ resolveValue }) => {
  const postInfo = resolveValue(useGetBlogPost);
  const title = `Chinese+ Блог: ${postInfo.title}`;
  const description = getPreviewText(postInfo.content) || postInfo.title;
  const url =
    CONST_URLS.siteUrl +
    getContentPath(WHERE.blog, postInfo._id, false, undefined, undefined, postInfo.title);

  return {
    title,
    meta: [
      { name: 'description', content: description },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: 'article' },
      { property: 'og:url', content: url },
      { property: 'og:image', content: getCoverImage(postInfo.content) },
    ],
  };
};
