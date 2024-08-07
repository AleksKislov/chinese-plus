import { component$, useContext, useStore, $, useSignal } from '@builder.io/qwik';
import CONSTANTS from '~/misc/consts/consts';
import { userContext } from '~/root';
import { msgTypes, useAddPost, type MsgType } from '~/routes/(club)/feedback';

export const PostForm = component$(() => {
  const TITLE_LENGTH = 80;
  const userState = useContext(userContext);
  const addPost = useAddPost();
  const { loggedIn } = userState;
  const newPostStore = useStore({
    emo: '',
    title: '',
    text: '',
  });
  const alreadySubmitted = useSignal(false);

  const chosenBtn = useStore<ChosenBtnStore>({
    wish: true,
    bug: false,
    news: false,
    goal: false,
    question: false,
  });

  const submitPost = $(async () => {
    if (!newPostStore.text.length || !newPostStore.title.length) return;
    alreadySubmitted.value = true;

    const text = newPostStore.text;
    const tag = Object.keys(chosenBtn).find((tag) => chosenBtn[tag as MsgType]);
    await addPost.submit({
      title: `${newPostStore.emo} ${newPostStore.title}`,
      text,
      tag,
    });
    location.reload();
  });

  const cantSubmit = [
    !loggedIn,
    newPostStore.text.length > CONSTANTS.commentLength,
    newPostStore.title.length > TITLE_LENGTH,
  ].some(Boolean);

  return (
    <>
      <div class="card w-full bg-base-300">
        <div class="card-body">
          <h2 class="card-title">Чем хотите поделиться?</h2>
          <p class={'mb-2'}>
            {Object.keys(msgTypes)?.map((msg, ind) => (
              <span
                key={ind}
                class={`badge badge-info mr-1 cursor-pointer ${
                  chosenBtn[msg as MsgType] ? '' : 'badge-outline'
                }`}
                onClick$={() => {
                  for (const key in chosenBtn) chosenBtn[key as MsgType] = key === msg;
                }}
              >
                {msgTypes[msg as MsgType]}
              </span>
            ))}
          </p>

          <div class="flex flex-wrap mb-1">
            <div class="form-control w-1/3 md:w-1/5 pr-1">
              <select
                class="select select-bordered w-full"
                onChange$={(e) => {
                  // @ts-ignore
                  newPostStore.emo = e.target.value;
                }}
              >
                <option disabled selected>
                  Эмо
                </option>
                {CONSTANTS.commentEmojis.map((emo, ind) => (
                  <option key={ind} value={emo}>
                    {emo}
                  </option>
                ))}
              </select>
              <label class="label">
                <span class="label-text-alt">Эмодзи</span>
              </label>
            </div>

            <div class="form-control w-2/3 md:w-4/5 pl-1">
              <input
                type="text"
                placeholder="Заголовок сообщения"
                class="input input-bordered w-full"
                disabled={!loggedIn}
                onKeyUp$={(e) => {
                  newPostStore.title = (e.target as HTMLInputElement).value;
                }}
              />
              <label class="label">
                <span
                  class={`label-text-alt ${
                    newPostStore.title.length > TITLE_LENGTH ? 'text-error' : ''
                  }`}
                >
                  {newPostStore.title.length} / {TITLE_LENGTH}
                </span>
              </label>
            </div>
          </div>

          <div
            class={loggedIn ? '' : 'tooltip tooltip-info'}
            data-tip={loggedIn ? '' : 'Авторизуйтесь'}
          >
            <div class="form-control">
              <textarea
                class="textarea textarea-bordered"
                placeholder="Ваше сообщение"
                disabled={!loggedIn}
                onKeyUp$={(e) => {
                  newPostStore.text = (e.target as HTMLInputElement).value;
                }}
              ></textarea>
              <label class="label">
                <span
                  class={`label-text-alt ${
                    newPostStore.text.length > CONSTANTS.commentLength ? 'text-error' : ''
                  }`}
                >
                  {newPostStore.text.length} / {CONSTANTS.commentLength}
                </span>
              </label>
            </div>
          </div>

          <div class="card-actions justify-end">
            <button
              class="btn btn-info btn-sm"
              disabled={cantSubmit || alreadySubmitted.value}
              onClick$={submitPost}
            >
              Опубликовать
            </button>
          </div>
        </div>
      </div>
    </>
  );
});

type ChosenBtnStore = {
  wish: boolean;
  bug: boolean;
  news: boolean;
  goal: boolean;
  question: boolean;
};
