import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { type DocumentHead, routeAction$ } from "@builder.io/qwik-city";
import { FlexRow } from "~/components/common/layout/flex-row";
import { PageTitle } from "~/components/common/layout/title";
import { ApiService } from "~/misc/actions/request";
import { PostForm } from "~/components/feedback/post-form";
import { PostCard } from "~/components/feedback/post-card";
import { MoreBtnAndLoader } from "~/components/common/ui/more-btn-and-loader";

export type newPostData = {
  title: string;
  text: string;
  tag: MsgType;
};

export const useAddPost = routeAction$((post, ev) => {
  const token = ev.cookie.get("token")?.value;
  return ApiService.post("/api/posts", post, token);
});

export type MsgType = "wish" | "bug" | "question" | "news" | "goal";
type MsgsType = "all" | MsgType;

export type Post = {
  _id: ObjectId;
  text: string;
  title: string;
  tag: MsgType;
  user: ShortUserInfo;
  comments_id: CommentId[];
  date: ISODate;
};

export const msgTypes = {
  wish: "пожелание",
  bug: "баг",
  question: "вопрос",
  news: "новости",
  goal: "цели",
};

export const getPostsWithParams = routeAction$((params): Promise<Post[]> => {
  return ApiService.get(`/api/posts/infinite?skip=0&tag=${params.tag}`, undefined, []);
});

export const getPostsWithSkip = routeAction$((params): Promise<Post[]> => {
  const { skip, tag } = params;
  return ApiService.get(`/api/posts/infinite?skip=${skip}&tag=${tag}`, undefined, []);
});

export default component$(() => {
  const chosenMsgsType = useSignal<MsgsType>("all");
  const skipSignal = useSignal(0);
  const posts = useSignal<Post[]>([]);
  const getPosts = getPostsWithParams();
  const getSkipPosts = getPostsWithSkip();

  useVisibleTask$(({ track }) => {
    const tag = track(() => chosenMsgsType.value);
    posts.value = [];
    getPosts.submit({ tag: tag === "all" ? "" : tag });
  });

  useVisibleTask$(({ track }) => {
    const skip = track(() => skipSignal.value);
    if (skip === 0) return;
    getSkipPosts.submit({
      skip,
      tag: chosenMsgsType.value === "all" ? "" : chosenMsgsType.value,
    });
  });

  useVisibleTask$(({ track }) => {
    const res = track(() => getPosts.value);
    if (!res) return;
    posts.value = res;
  });

  useVisibleTask$(({ track }) => {
    const res = track(() => getSkipPosts.value);
    if (!res) return;
    posts.value = [...posts.value, ...res];
  });

  const DisplayBtns: MsgsType[] = ["all", "wish", "bug", "question", "news", "goal"];

  return (
    <>
      <PageTitle txt={"Форум"} />

      <FlexRow>
        <div class='w-full md:w-1/2 mb-3 mr-4'>
          <div class='card w-full bg-base-200 mb-3 h-24'>
            <div class='card-body'>
              <p>Место для общения, фидбэка и новостей проекта</p>
            </div>
          </div>

          <PostForm />
        </div>

        <div class='w-full md:w-1/2'>
          <div class='card w-full bg-base-200 mb-3'>
            <div class='card-body'>
              <p class={"mb-2"}>
                {DisplayBtns.map((btnType, ind) => (
                  <span
                    key={btnType}
                    class={`badge badge-info mr-1 cursor-pointer ${
                      chosenMsgsType.value === btnType ? "" : "badge-outline"
                    }`}
                    onClick$={() => (chosenMsgsType.value = btnType)}
                  >
                    {ind === 0 ? "все" : msgTypes[btnType as MsgType]}
                  </span>
                ))}
              </p>
            </div>
          </div>
          {posts.value?.map((post, ind) => (
            <PostCard post={post} isPostPage={false} key={ind} addressees={null} />
          ))}

          <MoreBtnAndLoader
            isLoading={getPosts.isRunning || getSkipPosts.isRunning}
            skipSignal={skipSignal}
          />
        </div>
      </FlexRow>
    </>
  );
});

export const head: DocumentHead = {
  title: "Chinese+ Форум",
  meta: [
    {
      name: "description",
      content: "Поделитесь своими мыслями касательно Chinese+",
    },
  ],
};
