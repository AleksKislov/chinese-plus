import { component$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import { type Config } from '~/root';

export const OurAds = component$(({ adsInfo }: { adsInfo?: Config }) => {
  return (
    <Link href={(adsInfo?.link as string) || ''} target={'_blank'} class="card w-full mb-3">
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
