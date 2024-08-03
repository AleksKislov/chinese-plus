import { component$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';

type AdsInfo = {
  mediaUrl: string;
  link: string;
};

export const AdsCard = component$(({ adsInfo }: AdsInfo) => {
  return (
    <Link
      href={(adsInfo?.link as string) || ''}
      target={'_blank'}
      class="card w-full bg-base-200 mb-3"
    >
      <figure>
        <img
          class="pointer rounded-xl"
          width="648"
          height="240"
          src={(adsInfo?.mediaUrl as string) || ''}
          alt="ads_here"
        />
      </figure>
    </Link>
  );
});
