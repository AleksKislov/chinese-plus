import { component$, useComputed$, useContext } from '@builder.io/qwik';
import { plusSvg } from '../common/media/svg';
import { globalAction$, useLocation, z, zod$ } from '@builder.io/qwik-city';
import { ApiService } from '~/misc/actions/request';
import { userContext } from '~/root';

export enum ReadAction {
  add = 'add',
  del = 'del',
}

export const useAddReadChars = globalAction$(
  (body, ev) => {
    const token = ev.cookie.get('token')?.value || '';
    const { action, num, path, ind } = body;
    let method = 'read_today';
    if (action === ReadAction.del) method = 'un' + method;
    return ApiService.post('/api/users/' + method, { num, path, ind }, token);
  },
  zod$({
    num: z.number(),
    path: z.string(),
    ind: z.number(),
    action: z.string(),
  }),
);

// long texts and book chapters paginate via query param, so page index goes into the key
export const getReadKey = (pathname: string, pageInd?: number): string => {
  const path = pathname.slice(5, -1); // '/read/texts/id/' -> '/texts/id'
  return pageInd ? `${path}/pg${pageInd}` : path;
};

type ParagPlusProps = {
  strLen: number;
  ind: number;
  pageInd?: number;
};

export const ParagPlus = component$(({ strLen, ind, pageInd }: ParagPlusProps) => {
  const addReadChars = useAddReadChars();
  const loc = useLocation();
  const userState = useContext(userContext);
  const alreadyRead = useComputed$(() =>
    Boolean(userState.readTodayMap[getReadKey(loc.url.pathname, pageInd)]?.includes(ind)),
  );

  return (
    <div class="absolute right-1 -bottom-1">
      <div class="tooltip tooltip-left text-sm" data-tip={`Прочитано ${strLen} 字`}>
        <div
          onClick$={async () => {
            // wait for server answer, otherwise fast clicks send conflicting requests
            if (addReadChars.isRunning) return;
            const { value } = await addReadChars.submit({
              path: getReadKey(loc.url.pathname, pageInd),
              num: strLen,
              ind,
              action: alreadyRead.value ? ReadAction.del : ReadAction.add,
            });
            if (!value?.read_today_arr) return;
            userState.readTodayNum = value.read_today_num || 0;
            userState.readTodayMap = value.read_today_arr;
          }}
          class={`rounded-full cursor-pointer ${
            alreadyRead.value
              ? 'bg-success text-success-content'
              : 'bg-neutral text-neutral-content'
          } ${addReadChars.isRunning ? 'opacity-50 cursor-wait' : ''}`}
        >
          {plusSvg}
        </div>
      </div>
    </div>
  );
});
