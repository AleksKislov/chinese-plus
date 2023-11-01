import { component$, useContext, useSignal, useTask$ } from "@builder.io/qwik";
import { plusSvg } from "../common/media/svg";
import { globalAction$, useLocation, z, zod$ } from "@builder.io/qwik-city";
import { ApiService } from "~/misc/actions/request";
import { userContext } from "~/root";

export enum ReadAction {
  add = "add",
  del = "del",
}

export const useAddReadChars = globalAction$(
  (body, ev) => {
    const token = ev.cookie.get("token")?.value || "";
    const { action, num, path, ind } = body;
    let method = "read_today";
    if (action === ReadAction.del) method = "un" + method;
    return ApiService.post("/api/users/" + method, { num, path, ind }, token);
  },
  zod$({
    num: z.number(),
    path: z.string(),
    ind: z.number(),
    action: z.string(),
  })
);

type ParagPlusProps = {
  strLen: number;
  ind: number;
};

export const ParagPlus = component$(({ strLen, ind }: ParagPlusProps) => {
  const addReadChars = useAddReadChars();
  const loc = useLocation();
  const userState = useContext(userContext);
  const { readTodayMap, loggedIn } = userState;
  const localPath = loc.url.pathname.slice(5, -1);
  const alreadyRead = useSignal(false);

  useTask$(({ track }) => {
    track(() => readTodayMap);
    if (!loggedIn) return;
    if (readTodayMap[localPath]?.includes(ind)) alreadyRead.value = true;
  });

  return (
    <div class='absolute right-1 -bottom-1'>
      <div class='tooltip tooltip-left text-sm' data-tip={`Прочитано ${strLen} 字`}>
        <div
          onClick$={() => {
            userState.readTodayNum += alreadyRead.value ? -strLen : strLen;
            addReadChars.submit({
              path: localPath,
              num: strLen,
              ind,
              action: alreadyRead.value ? ReadAction.del : ReadAction.add,
            });
            alreadyRead.value = !alreadyRead.value;
          }}
          class={`rounded-full cursor-pointer ${
            alreadyRead.value ? "bg-success text-success-content" : "bg-neutral-focus"
          }`}
        >
          {plusSvg}
        </div>
      </div>
    </div>
  );
});
