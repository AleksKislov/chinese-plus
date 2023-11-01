import { component$, useSignal, useStore } from "@builder.io/qwik";
import { type DocumentHead, routeLoader$ } from "@builder.io/qwik-city";
import { FlexRow } from "~/components/common/layout/flex-row";
import { PostCard } from "~/components/feedback/post-card";
import { ApiService } from "~/misc/actions/request";
import { type Post } from "..";
import { type CommentType } from "~/components/common/comments/comment-card";
import {
  CommentForm,
  WHERE,
  type CommentIdToReply,
  type Addressee,
} from "~/components/common/comments/comment-form";
import { getContentComments } from "~/misc/actions/get-content-comments";
import { CommentsBlock } from "~/components/common/comments/comments-block";
import { CommentsBlockTitle } from "~/components/common/comments/comments-block-title";
import { BackBtn } from "~/components/common/ui/back-btn";

export const getPost = routeLoader$(({ params }): Promise<Post> => {
  return ApiService.get(`/api/posts/${params.id}`, undefined, {});
});

export const getComments = routeLoader$(({ params }): Promise<CommentType[]> => {
  return getContentComments(WHERE.post, params.id);
});

export default component$(() => {
  const post = getPost();
  const comments = getComments();

  const commentIdToReplyStore = useStore<CommentIdToReply>({
    commentId: "",
    name: "",
    userId: "",
  });

  const addressees = useSignal<Addressee[]>([]);

  return (
    <>
      <FlexRow>
        <div class='w-full md:w-1/2 mr-4 mb-3'>
          <BackBtn path={"/feedback"} />
          <PostCard post={post.value} isPostPage={true} addressees={addressees} />
          <CommentForm
            contentId={post.value._id}
            where={WHERE.post}
            path={undefined}
            commentIdToReply={commentIdToReplyStore}
            addressees={addressees}
          />
        </div>

        <div class='w-full md:w-1/2'>
          <CommentsBlockTitle />

          <CommentsBlock
            comments={comments.value}
            commentIdToReply={commentIdToReplyStore}
            addressees={addressees}
          />
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
