import { component$, useContext } from '@builder.io/qwik';
import { Link, type DocumentHead, routeLoader$ } from '@builder.io/qwik-city';
import { FlexRow } from '~/components/common/layout/flex-row';
import { Features } from '~/components/home/features';
import { LandingVideo } from '~/components/home/landing-video';
import { ApiService } from '~/misc/actions/request';
import { userContext } from '~/root';
import { type BlogCardInfo } from './read/blog';
import { BlogCard } from '~/components/read/blog-card';
import { CommentCard, type CommentType } from '~/components/common/comments/comment-card';
import CONST_URLS from '~/misc/consts/urls';
import { JsonLd } from '~/components/common/seo/json-ld';

export const getLatestBlogPosts = routeLoader$((): Promise<BlogCardInfo[]> => {
  return ApiService.get(`/api/blogs?skip=0&limit=5`, undefined, []);
});

export const getComments = routeLoader$((): Promise<CommentType[]> => {
  return ApiService.get('/api/comments/last', undefined, []);
});

export default component$(() => {
  const { loggedIn } = useContext(userContext);
  const comments = getComments();
  const blogPosts = getLatestBlogPosts();
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'Organization',
              name: 'Chinese+',
              url: CONST_URLS.siteUrl,
              logo: `${CONST_URLS.siteUrl}/favicon.svg`,
              sameAs: [
                'https://t.me/chineseplusnew',
                'https://www.youtube.com/c/Buyilehuorg',
                'https://vk.com/buyilehu',
              ],
            },
            {
              '@type': 'WebSite',
              name: 'Chinese+',
              url: CONST_URLS.siteUrl,
              potentialAction: {
                '@type': 'SearchAction',
                target: `${CONST_URLS.siteUrl}/dictionary/{search_term_string}`,
                'query-input': 'required name=search_term_string',
              },
            },
          ],
        }}
      />
      <div class="text-center mt-8">
        <article class={'prose max-w-none'}>
          <h1>
            Клуб Chinese<span class="text-secondary font-extrabold text-5xl">+</span>
          </h1>
          <p class="font-semibold -mt-6 mb-5">web-приложение для изучения китайского языка</p>
        </article>
      </div>

      {!loggedIn && (
        <FlexRow>
          <div class="flex flex-col items-center w-full mb-3">
            <Link href="/read/texts" class="btn btn-accent mb-2">
              Учиться бесплатно
            </Link>
            <p class="text-xs opacity-60 mb-3">
              Сайт бесплатный — зарегистрированным пользователям доступно больше возможностей
            </p>
          </div>
        </FlexRow>
      )}

      <Features />

      <LandingVideo />

      <FlexRow>
        <div class="w-full md:w-1/2 mb-3 mr-4">
          <div class="prose mb-2">
            <h3>Свежие комментарии</h3>
          </div>
          {comments.value?.map((comment, ind) => (
            <CommentCard
              key={ind}
              comment={comment}
              commentIdToReply={{ commentId: '', userId: '', name: '' }}
              addressees={{ value: [] }}
              notForReply={true}
            />
          ))}
        </div>

        <div class="w-full md:w-1/2">
          <div class="prose mb-2">
            <h3>Свежее в блоге</h3>
          </div>
          {blogPosts.value?.map((post, ind) => (
            <BlogCard post={post} key={ind} />
          ))}
        </div>
      </FlexRow>
    </>
  );
});

export const head: DocumentHead = {
  title: 'Chinese+ Изучать китайский - интересно!',
  meta: [
    {
      name: 'description',
      content:
        'Изучение китайского языка онлайн: уроки, тексты с переводом, видео с субтитрами, пиньинь, лексика HSK, иероглифы, тесты и пр.',
    },
    {
      property: 'og:title',
      content: 'Chinese+ Изучать китайский - интересно!',
    },
    {
      property: 'og:description',
      content:
        'Изучение китайского языка онлайн: уроки, тексты с переводом, видео с субтитрами, пиньинь, лексика HSK, иероглифы, тесты и пр.',
    },
    {
      property: 'og:type',
      content: 'website',
    },
    {
      property: 'og:url',
      content: CONST_URLS.siteUrl,
    },
  ],
};
