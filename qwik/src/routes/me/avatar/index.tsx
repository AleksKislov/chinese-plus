import {
  component$,
  useContext,
  useSignal,
  useStore,
  useTask$,
  useVisibleTask$,
} from "@builder.io/qwik";
import { routeAction$, type RequestEvent, type DocumentHead } from "@builder.io/qwik-city";
import { FlexRow } from "~/components/common/layout/flex-row";
import { PageTitle } from "~/components/common/layout/title";
import { UserMainInfo } from "~/components/me/user-main-info";
import { getTokenFromCookie } from "~/misc/actions/auth";
import { userContext } from "~/root";
import {
  adventurer,
  avataaars,
  bigEars,
  bigSmile,
  bottts,
  lorelei,
  pixelArt,
  funEmoji,
} from "@dicebear/collection";
import { BigAvatar } from "~/components/me/avatar/big-avatar";
import { ApiService } from "~/misc/actions/request";
import Alwan from "alwan";
import "alwan/dist/css/alwan.min.css";

export const onGet = async ({ cookie, redirect }: RequestEvent) => {
  const token = getTokenFromCookie(cookie);
  if (!token) throw redirect(302, "/login");
};

export const AvatarTypes = {
  adventurer,
  avataaars,
  bigEars,
  bigSmile,
  bottts,
  funEmoji,
  lorelei,
  pixelArt,
};

export const useSetAvatar = routeAction$(async (params, ev): Promise<NewAvatar | null> => {
  const token = getTokenFromCookie(ev.cookie);
  if (!token) return null;
  return ApiService.post("/api/users/set_my_avatar", params, token, null);
});

export default component$(() => {
  const colorPickerId = "colorPicker";
  const setAvatar = useSetAvatar();
  const userState = useContext(userContext);
  const { _id, newAvatar, role, name } = userState;
  const avaTypeSignal = useSignal("adventurer");
  const avaSignal = useStore<NewAvatar>({
    type: "adventurer",
    background: "transparent",
    seed: name,
  });
  const seedSignal = useSignal(name);
  const background = useSignal("transparent");

  useVisibleTask$(({ track }) => {
    track(() => newAvatar?.seed);

    if (newAvatar) {
      avaSignal.type = newAvatar.type;
      avaSignal.background = newAvatar.background;
      avaSignal.seed = newAvatar.seed;

      avaTypeSignal.value = newAvatar.type;
      seedSignal.value = newAvatar.seed;
      background.value = newAvatar.background;
    }

    const alwan = new Alwan(`#${colorPickerId}`, {
      inputs: { hex: false, rgb: false, hsl: false },
      theme: "dark",
      color: "#f957ff",
      classname: "mt-2.5 mb-2.5 ml-1",
    });

    alwan.on("color", (ev) => {
      background.value = ev.hex.slice(1);
    });
  });

  useTask$(({ track }) => {
    track(() => avaTypeSignal.value);
    track(() => background.value);

    const newSeed = track(() => seedSignal.value || newAvatar?.seed || name);
    if (!newSeed) return;

    avaSignal.type = avaTypeSignal.value;
    avaSignal.background = background.value;
    avaSignal.seed = newSeed;
  });

  useTask$(({ track }) => {
    const newAvatar = track(() => setAvatar.value);
    if (newAvatar?.seed) userState.newAvatar = newAvatar as NewAvatar;
  });

  return (
    <>
      <PageTitle txt={"Смена аватарки"} />

      <FlexRow>
        <div class='w-full basis-1/2 mt-3'>
          <UserMainInfo id={_id} newAvatar={newAvatar} role={role} name={name} isPrivate={true} />
        </div>

        <div class='w-full basis-1/2 mt-3'>
          <div class='flex justify-between h-full'>
            <div class='w-full'>
              <div>Ваш новый аватар {"->"}</div>
              <button
                class='btn btn-sm btn-primary mt-2'
                onClick$={() => setAvatar.submit(avaSignal)}
              >
                Применить
              </button>
            </div>

            <div class='avatar w-full h-full'>
              <BigAvatar userName={name} newAvatar={avaSignal} />
            </div>
          </div>
        </div>
      </FlexRow>

      <FlexRow>
        <div class='form-control text-base-content w-full mr-2'>
          <label class='label'>
            <span class='label-text'>Впишите, что хотите</span>
          </label>
          <input
            maxLength={120}
            bind:value={seedSignal}
            value={newAvatar?.seed || name}
            type='text'
            placeholder='avatar seed'
            class='input input-bordered'
          />
          <label class='label'>
            <span class='label-text'>По умолчанию - ваш ник</span>
          </label>
        </div>

        <div class='form-control text-base-content w-full mr-2'>
          <label class='label'>
            <span class='label-text'>Тип аватарки</span>
          </label>
          <select class='select select-bordered' bind:value={avaTypeSignal}>
            {Object.keys(AvatarTypes).map((avaType, ind) => (
              <option value={avaType} key={ind}>
                {avaType}
              </option>
            ))}
          </select>
          <label class='label'>
            <span class='label-text'>По умолчанию - adventurer</span>
          </label>
        </div>

        <div class='form-control text-base-content w-full mr-2'>
          <label class='label'>
            <span class='label-text'>Цвет фона</span>
          </label>
          <div id={colorPickerId}></div>
          <label class='label'>
            <span class='label-text'>По умолчанию - прозрачный</span>
          </label>
        </div>
      </FlexRow>
    </>
  );
});

export const head: DocumentHead = {
  title: "Chinese+ Аватарка",
};
