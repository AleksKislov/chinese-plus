import { component$, Slot, useContext } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import { DonateGoalCard } from '~/components/donate/donate-goal-card';
import { getRandElem } from '~/misc/helpers/tools';
import { configContext, goalsContext } from '~/root';

type SidebarType = {
  noAds?: boolean;
};

export const Sidebar = component$(({ noAds }: SidebarType) => {
  const configState = useContext(configContext);
  const goalsState = useContext(goalsContext);

  const adsInfoArr = configState.filter((x) => x.type === 'ads');
  const adsInfo = adsInfoArr[Math.floor(Math.random() * adsInfoArr.length)];

  const randomGoal = getRandElem(goalsState);
  return (
    <div class="w-full md:w-1/4 mb-3 mr-4">
      {!noAds && adsInfo && (
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
      )}

      <Slot />

      {!noAds && randomGoal && <DonateGoalCard goal={randomGoal} isCompact={true} />}
    </div>
  );
});
