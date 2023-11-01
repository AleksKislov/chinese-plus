import { component$ } from "@builder.io/qwik";
import { type DocumentHead, Link, type RequestEvent } from "@builder.io/qwik-city";
import { FlexRow } from "~/components/common/layout/flex-row";
import { PageTitle } from "~/components/common/layout/title";
import { getTokenFromCookie } from "~/misc/actions/auth";

export const onGet = async ({ cookie, redirect }: RequestEvent) => {
  const token = getTokenFromCookie(cookie);
  if (!token) throw redirect(302, "/login");
};

export default component$(() => {
  return (
    <>
      <PageTitle txt={"Поделиться контентом"} />

      <FlexRow>
        <div class='w-full basis-1/2 mt-3 prose'>
          <p>Что вы хотели бы создать сегодня?</p>

          <div class='flex'>
            <Link href='/create/text' class='btn btn-primary mr-3'>
              Текст
            </Link>
            {/* <Link href='/create/video' class='btn btn-primary'>
              Видео
            </Link> */}
            <button class='btn btn-primary' disabled>
              Видео
            </button>
          </div>
        </div>
      </FlexRow>
    </>
  );
});

export const head: DocumentHead = {
  title: "Chinese+ Поделиться контентом",
  meta: [
    {
      name: "description",
      content: "Поделитесь обучающим контентом с остальными посетителями Chinese+",
    },
  ],
};
