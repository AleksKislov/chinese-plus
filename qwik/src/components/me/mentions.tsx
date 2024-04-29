import { component$, useSignal } from "@builder.io/qwik";
import { CommentCard, type CommentType } from "../common/comments/comment-card";
import { getOldMentions, markMentionsAsOld, getLikedComments } from "~/routes/me";

type PersonalMentionsType = {
  newMentions: CommentType[];
};

export const PersonalMentions = component$(({ newMentions }: PersonalMentionsType) => {
  const showNewMentions = useSignal(newMentions.length > 0);
  const showOldMentions = useSignal(newMentions.length === 0);
  const showLikedComments = useSignal(false);
  const oldMentions = getOldMentions();
  const markAsOld = markMentionsAsOld();
  const likedComments = getLikedComments();

  // console.log(oldMentions.value);
  return (
    <div class='mb-3 mt-3 w-full'>
      <div class='prose'>
        <h3>Общение</h3>
      </div>

      <div class='flex'>
        <div class='tabs'>
          <a
            class={`tab tab-bordered ${showNewMentions.value ? "tab-active" : ""}`}
            onClick$={() => {
              showNewMentions.value = true;
              showOldMentions.value = false;
              showLikedComments.value = false;
            }}
          >
            Новые
          </a>
          <a
            class={`tab tab-bordered ${showOldMentions.value ? "tab-active" : ""}`}
            onClick$={() => {
              showNewMentions.value = false;
              showOldMentions.value = true;
              showLikedComments.value = false;
            }}
          >
            Прочитанные
          </a>
          <a
            class={`tab tab-bordered ${showLikedComments.value ? "tab-active" : ""}`}
            onClick$={() => {
              showNewMentions.value = false;
              showOldMentions.value = false;
              showLikedComments.value = true;
            }}
          >
            Понравившиеся
          </a>
        </div>
        {newMentions.length > 0 && !showOldMentions.value ? (
          <div class='tooltip tooltip-info' data-tip={"Пометить как прочитанные"}>
            <button
              class='btn btn-sm btn-primary ml-3'
              onClick$={async () => {
                await markAsOld.submit();
                location.reload();
              }}
            >
              Я прочитал
            </button>
          </div>
        ) : null}
      </div>

      {showNewMentions.value && (
        <div class='join join-vertical border-secondary mt-2 w-full'>
          {!newMentions.length ? (
            <p>Нет новых комментариев</p>
          ) : (
            newMentions.map((comment, ind) => (
              <CommentCard
                key={ind}
                comment={comment}
                commentIdToReply={{ commentId: "", userId: "", name: "" }}
                addressees={{ value: [] }}
                notForReply={true}
              />
            ))
          )}
        </div>
      )}

      {showOldMentions.value && (
        <div class='join join-vertical border-secondary mt-2 w-full'>
          {!oldMentions.value?.length ? (
            <p>Нет комментариев</p>
          ) : (
            oldMentions.value?.map((comment, ind) => (
              <CommentCard
                key={ind}
                comment={comment}
                commentIdToReply={{ commentId: "", userId: "", name: "" }}
                addressees={{ value: [] }}
                notForReply={true}
              />
            ))
          )}
        </div>
      )}

      {showLikedComments.value && (
        <div class='join join-vertical border-secondary mt-2 w-full'>
          {!likedComments.value.length ? (
            <p>Нет понравившихся комментариев</p>
          ) : (
            likedComments.value?.map((comment, ind) => (
              <CommentCard
                key={ind}
                comment={comment}
                commentIdToReply={{ commentId: "", userId: "", name: "" }}
                addressees={{ value: [] }}
                notForReply={true}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
});
