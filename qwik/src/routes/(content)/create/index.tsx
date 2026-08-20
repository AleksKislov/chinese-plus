import { component$, useContext } from '@builder.io/qwik';
import { type DocumentHead, Link, type RequestEvent } from '@builder.io/qwik-city';
import { FlexRow } from '~/components/common/layout/flex-row';
import { PageTitle } from '~/components/common/layout/title';
import { getTokenFromCookie } from '~/misc/actions/auth';
import { userContext } from '~/root';

export const onGet = async ({ cookie, redirect }: RequestEvent) => {
  const token = getTokenFromCookie(cookie);
  if (!token) throw redirect(302, '/login');
};

export default component$(() => {
  const { isAdmin, isModerator } = useContext(userContext);

  return (
    <>
      <PageTitle txt={'Поделиться контентом'} />

      <FlexRow>
        <div class="w-full basis-1/2 mt-3 prose">
          <p>Что вы хотели бы создать сегодня?</p>

          <div class="flex">
            <Link href="/create/text" class="btn btn-primary mr-3">
              Текст
            </Link>
            <Link href="/create/video" class="btn btn-primary mr-3">
              Видео
            </Link>
            <Link href="/create/blog" class="btn btn-primary">
              Блог
            </Link>
            {(isAdmin || isModerator) && (
              <Link href="/edit/books" class="btn btn-secondary ml-3">
                Книга
              </Link>
            )}
          </div>
        </div>
      </FlexRow>
    </>
  );
});

export const head: DocumentHead = {
  title: 'Chinese+ Поделиться контентом',
  meta: [
    {
      name: 'description',
      content: 'Поделитесь обучающим контентом с остальными посетителями Chinese+',
    },
  ],
};
