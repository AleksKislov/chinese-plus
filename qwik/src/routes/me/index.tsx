import {
  component$,
  useContext,
  useSignal,
  useTask$,
  useVisibleTask$,
} from '@builder.io/qwik';
import {
  routeLoader$,
  type RequestEvent,
  routeAction$,
  type DocumentHead,
} from '@builder.io/qwik-city';
import { FlexRow } from '~/components/common/layout/flex-row';
import { PageTitle } from '~/components/common/layout/title';
import { ReadResultCard } from '~/components/me/read-result-card';
import { ApiService } from '~/misc/actions/request';
import { Alerts } from '~/components/common/alerts/alerts';
import { AlertColorEnum, alertsContext, userContext } from '~/root';
import { type TextsNumInfo } from '../read/texts';
import { type ReadStatType, ReadingDiagram } from '~/components/me/reading-diagram';
import { PersonalStats } from '~/components/me/personal-stats';
import { getTokenFromCookie } from '~/misc/actions/auth';
import { PersonalMentions } from '~/components/me/mentions';
import { type CommentType } from '~/components/common/comments/comment-card';
import { UserMainInfo } from '~/components/me/user-main-info';
import { getNewMentions } from '../layout';

export const onGet = async ({ cookie, redirect }: RequestEvent) => {
  const token = getTokenFromCookie(cookie);
  if (!token) throw redirect(302, '/login');
};

export const getTextsStats = routeLoader$((): Promise<TextsNumInfo> => {
  return ApiService.get(`/api/texts/texts_num`, undefined, {});
});

export const getOldMentions = routeLoader$(async ({ cookie }): Promise<CommentType[]> => {
  const token = getTokenFromCookie(cookie);
  if (!token) return [];
  return ApiService.get('/api/comments/to_me/true', token, []);
});

export const getLikedComments = routeLoader$(async ({ cookie }): Promise<CommentType[]> => {
  const token = getTokenFromCookie(cookie);
  if (!token) return [];
  return ApiService.get('/api/comments/liked?limit=20', token, []);
});

export const markMentionsAsOld = routeAction$((_param, ev) => {
  const token = getTokenFromCookie(ev.cookie);
  return ApiService.post('/api/comments/mark_mentions_as_seen', {}, token);
});

export const useSetBio = routeAction$(async (params, ev): Promise<{ bio: string } | null> => {
  const token = getTokenFromCookie(ev.cookie);
  if (!token) return null;
  return ApiService.post('/api/users/set_my_bio', params, token, null);
});

export const getReadStats = routeLoader$(async ({ cookie }): Promise<ReadStatType[]> => {
  const token = getTokenFromCookie(cookie);
  if (!token) return [];
  return ApiService.get(`/api/users/reading_results`, token, []);

  // for tests
  // return [
  //   {
  //     // user_id: "5f301a8f0aa5c18",
  //     have_read: 371,
  //     daily_goal: 400,
  //     createdAt: "2023-08-22T23:27:13.504Z",
  //   },
  // ];
});

export default component$(() => {
  const newMentions = getNewMentions();
  const textsStats = getTextsStats();
  const readStats = getReadStats();
  const userState = useContext(userContext);
  const {
    newAvatar,
    name,
    finishedTexts,
    readDailyGoal,
    readTodayNum,
    hsk2WordsTotal,
    wordsCount,
    role,
    bio,
    _id: userId,
  } = userState;

  const alertsState = useContext(alertsContext);
  const setBio = useSetBio();
  const bioSignal = useSignal(bio);

  useVisibleTask$(({ track }) => {
    bioSignal.value = track(() => userState.bio);
  });

  useTask$(({ track }) => {
    const result = track(() => setBio.value);
    if (result === undefined) return;

    if (!result) {
      alertsState.push({
        bg: AlertColorEnum.error,
        text: 'Не удалось сохранить. Попробуйте снова.',
      });
      return;
    }

    userState.bio = result.bio;
    alertsState.push({ bg: AlertColorEnum.success, text: 'Сохранено!' });
  });

  return (
    <>
      <PageTitle txt={'Личный кабинет'} />
      <Alerts />

      <FlexRow>
        <div class="w-full basis-1/2  mt-3">
          <UserMainInfo
            id={userId}
            newAvatar={newAvatar}
            role={role}
            name={name}
            isPrivate={true}
          />
          <PersonalStats
            approvedTextsNum={textsStats.value.approved}
            finishedTextsTotal={finishedTexts.length}
            userWordsTotal={wordsCount}
            hsk2Total={hsk2WordsTotal}
          />
        </div>

        <div class="w-full basis-1/2">
          <ReadResultCard />
        </div>
      </FlexRow>

      <FlexRow>
        <div class="form-control text-base-content w-full">
          <label class="label">
            <span class="label-text">
              Об авторе (показывается под вашими постами в блоге)
            </span>
          </label>
          <textarea
            maxLength={600}
            bind:value={bioSignal}
            placeholder="Расскажите немного о себе..."
            class="textarea textarea-bordered"
            rows={4}
          />
          <button
            class="btn btn-sm btn-primary mt-2 self-start"
            disabled={setBio.isRunning}
            onClick$={() => setBio.submit({ bio: bioSignal.value })}
          >
            {setBio.isRunning && <span class="loading loading-spinner loading-xs mr-1" />}
            Сохранить
          </button>
        </div>
      </FlexRow>

      <FlexRow>
        <ReadingDiagram
          data={readStats.value}
          readDailyGoal={readDailyGoal}
          readTodayNum={readTodayNum}
        />
      </FlexRow>

      <FlexRow>
        <PersonalMentions newMentions={newMentions.value} />
      </FlexRow>
    </>
  );
});

export const head: DocumentHead = {
  title: 'Chinese+ Личный кабинет',
};
