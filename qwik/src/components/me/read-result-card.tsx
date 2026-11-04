import { component$, useComputed$, useContext } from '@builder.io/qwik';
import { userContext } from '~/root';
import { editSvg } from '../common/media/svg';
import { EditReadGoalModal } from '../common/modals/edit-read-goal-modal';

export const ReadResultCard = component$(() => {
  const editReadGoalModalId = 'editReadGoalModalId';
  const userState = useContext(userContext);
  const { loggedIn, readTodayNum, readDailyGoal } = userState;
  // read from the store directly, so the card updates when paragraphs are marked
  const progress = useComputed$(() => {
    if (!userState.loggedIn || !userState.readDailyGoal) return 0;
    return (userState.readTodayNum / userState.readDailyGoal) * 100;
  });

  return !loggedIn ? null : (
    <div class="card bg-base-200 mt-3">
      <div class="card-body">
        <h2 class="card-title">Дневник чтения 📚</h2>
        <div class={'w-full flex justify-between'}>
          <div class={'pt-1'}>
            Цель на день: <span class="badge badge-secondary">{readDailyGoal}</span> 字
          </div>
          <div class="tooltip tooltip-info" data-tip="Поменять цель">
            <label class={`btn btn-sm btn-info btn-outline ml-2`} for={editReadGoalModalId}>
              {editSvg}
            </label>
          </div>
        </div>
        <div>
          <small>
            Сегодня прочитано <span class="text-info">{readTodayNum}</span> из {readDailyGoal} 字{' '}
          </small>
          <div class="relative w-full h-3 overflow-hidden">
            <progress
              class={`progress border absolute w-full h-full z-[2] ${
                progress.value < 100 ? 'border-info' : 'border-success'
              }`}
              value={0.0001}
            ></progress>
            <progress
              class={`progress absolute h-full ${
                progress.value < 100 ? 'progress-info' : 'progress-success'
              }`}
              style={`width: ${
                progress.value < 100 ? progress.value : 100
              }%; transition: width 2s;`}
              value={100}
              max="100"
            ></progress>
          </div>
          <div class="w-full flex justify-between">
            <div>
              <small>Сброс в 0:00</small>
            </div>
            <div>
              <small>{Math.ceil(progress.value)}%</small>
            </div>
          </div>
        </div>
      </div>
      <EditReadGoalModal modalId={editReadGoalModalId} prevNum={readDailyGoal} />
    </div>
  );
});
