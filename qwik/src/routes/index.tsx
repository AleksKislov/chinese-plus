import { component$, useContext } from "@builder.io/qwik";
import { Link, type DocumentHead, routeLoader$ } from "@builder.io/qwik-city";
import { GoogleButton } from "~/components/auth/google-btn";
import { FlexRow } from "~/components/common/layout/flex-row";
import { Features } from "~/components/home/features";
import { LandingVideo } from "~/components/home/landing-video";
import { ApiService } from "~/misc/actions/request";
import { userContext } from "~/root";
import { type Post } from "./feedback";
import { PostCard } from "~/components/feedback/post-card";
import { CommentCard, type CommentType } from "~/components/common/comments/comment-card";

export const getPosts = routeLoader$((): Promise<Post[]> => {
  return ApiService.get(`/api/posts/infinite?skip=0&tag=`, undefined, []);
});

export const getComments = routeLoader$((): Promise<CommentType[]> => {
  return ApiService.get("/api/comments/last", undefined, []);
});

export default component$(() => {
  const { loggedIn } = useContext(userContext);
  const comments = getComments();
  const posts = getPosts();
  return (
    <>
      <div class='text-center mt-8'>
        <article class={"prose max-w-none"}>
          <h1>
            Клуб Chinese<span class='text-success font-extrabold text-5xl'>+</span>
          </h1>
          <p class='font-semibold -mt-6 mb-5'>web-приложение для изучения китайского языка</p>
        </article>
      </div>

      {!loggedIn && (
        <FlexRow>
          <div class='flex justify-center w-full mb-3'>
            <Link href='/login' class='btn btn-success btn-sm mr-1'>
              войти
            </Link>
            <GoogleButton />
            <Link href='/register' class='btn btn-primary btn-sm ml-1'>
              регистрация
            </Link>
          </div>
        </FlexRow>
      )}

      <Features />

      <LandingVideo />

      <FlexRow>
        <div class='w-full md:w-1/2 mb-3 mr-4'>
          <div class='prose mb-2'>
            <h3>Свежие комментарии</h3>
          </div>
          {comments.value?.map((comment, ind) => (
            <CommentCard
              key={ind}
              comment={comment}
              commentIdToReply={{ commentId: "", userId: "", name: "" }}
              addressees={{ value: [] }}
              notForReply={true}
            />
          ))}
        </div>

        <div class='w-full md:w-1/2'>
          <div class='prose mb-2'>
            <h3>Свежий фидбэк</h3>
          </div>
          {posts.value?.map((post, ind) => (
            <PostCard post={post} isPostPage={false} key={ind} addressees={null} />
          ))}
        </div>
      </FlexRow>
    </>
  );
});

export const head: DocumentHead = {
  title: "Chinese+ Изучать китайский - интересно!",
  meta: [
    {
      name: "description",
      content:
        "Изучение китайского языка онлайн: уроки, тексты с переводом, видео с субтитрами, пиньинь, лексика HSK, иероглифы, тесты и пр.",
    },
  ],
};
