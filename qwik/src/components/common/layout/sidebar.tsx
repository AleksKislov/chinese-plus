import { component$, Slot, useContext } from '@builder.io/qwik';
import { configContext } from '~/root';
import { BannerAds } from '../ads/sidebar-ads';
import YANDEX_ADS from '~/misc/consts/ads';
import { OurAds } from '../ads/our-ads';
import OUR_ADS from '~/misc/consts/our-ads';

type SidebarType = {
  noAds?: boolean;
};

export const Sidebar = component$(({ noAds }: SidebarType) => {
  const configState = useContext(configContext);

  const yandexAds = configState.find((x) => x.type === YANDEX_ADS.banner);
  const adsInfoArr = configState.filter((x) => x.type === OUR_ADS.sidebar);
  const adsInfo = adsInfoArr[Math.floor(Math.random() * adsInfoArr.length)];

  return (
    <div class="w-full md:w-1/4 mb-3 mr-4">
      {!noAds && adsInfo && <OurAds adsInfo={adsInfo} />}

      <Slot />

      {!noAds && yandexAds?.isActive && <BannerAds />}
    </div>
  );
});
