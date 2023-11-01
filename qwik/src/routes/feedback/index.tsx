import { $, component$, useSignal } from "@builder.io/qwik";
import { type DocumentHead, routeAction$, routeLoader$ } from "@builder.io/qwik-city";
import { FlexRow } from "~/components/common/layout/flex-row";
import { PageTitle } from "~/components/common/layout/title";
import { ApiService } from "~/misc/actions/request";
import { PostForm } from "~/components/feedback/post-form";
import { PostCard } from "~/components/feedback/post-card";
import { OurSocialMedia } from "~/components/common/media/our-social-media";

export type newPostData = {
  title: string;
  text: string;
  tag: MsgType;
};

export const useAddPost = routeAction$((post, ev) => {
  const token = ev.cookie.get("token")?.value;
  return ApiService.post("/api/posts", post, token);
});

export type MsgType = "wish" | "bug" | "news";
type MsgsType = "all" | "wish" | "bug" | "news";

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
  news: "новости",
};

export const getInitPosts = routeLoader$((): Promise<Post[]> => {
  return ApiService.get(`/api/posts/infinite?skip=0&tag=`, undefined, []);
});

export default component$(() => {
  const chosenMsgsType = useSignal<MsgsType>("all");
  const skip = useSignal(0);
  const posts = useSignal<Post[]>(getInitPosts().value);

  const getPosts = $((): Promise<Post[]> => {
    const t = chosenMsgsType.value === "all" ? "" : chosenMsgsType.value;
    return ApiService.get(`/api/posts/infinite?skip=${skip.value}&tag=${t}`, undefined, []);
  });

  const DisplayBtns: MsgsType[] = ["all", "wish", "bug", "news"];

  return (
    <>
      <PageTitle txt={"Гостевая и Новости Проекта"} />
      <FlexRow>
        <div class='w-full md:w-1/2 mb-3 mr-4 h-24'>
          <div class='card w-full bg-neutral h-full'>
            <div class='card-body'>
              <div class={"flex"}>
                За проектом можно следить и в соцсетях: <OurSocialMedia />
              </div>
            </div>
          </div>
        </div>

        <div class='w-full md:w-1/2'>
          <div class='card w-full bg-neutral mb-3'>
            <div class='card-body'>
              <div class='btn-group'>
                {DisplayBtns?.map((btnType, ind) => (
                  <button
                    key={btnType}
                    class={`btn btn-sm btn-info lowercase ${
                      chosenMsgsType.value === btnType ? "" : "btn-outline"
                    }`}
                    type='button'
                    onClick$={async () => {
                      chosenMsgsType.value = btnType;
                      skip.value = 0;
                      posts.value = await getPosts();
                    }}
                  >
                    {ind === 0 ? "Все" : msgTypes[btnType as MsgType]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </FlexRow>

      <FlexRow>
        <div class='w-full md:w-1/2 mb-3 mr-4'>
          <PostForm />
        </div>

        <div class='w-full md:w-1/2'>
          {posts.value?.map((post, ind) => (
            <PostCard post={post} isPostPage={false} key={ind} addressees={null} />
          ))}

          <div class={"flex flex-col items-center"}>
            <button
              type='button'
              class={`btn btn-sm btn-info btn-outline`}
              onClick$={async () => {
                skip.value += 5;
                posts.value = [...posts.value, ...(await getPosts())];
              }}
            >
              Еще
            </button>
          </div>
        </div>
      </FlexRow>
    </>
  );
});

export const head: DocumentHead = {
  title: "Chinese+ Фидбэк",
  meta: [
    {
      name: "description",
      content: "Поделитесь своими мыслями касательно Chinese+",
    },
  ],
};
