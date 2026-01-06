import { component$, useVisibleTask$ } from '@builder.io/qwik';

export const BannerAds = component$(() => {
  useVisibleTask$(
    () => {
      // @ts-ignore
      window.yaContextCb?.push(() => {
        // @ts-ignore
        Ya?.Context.AdvManager.render({
          blockId: 'R-A-15425793-1',
          renderTo: 'yandex_rtb_R-A-15425793-1',
        });
      });
    },
    { strategy: 'document-ready' },
  );

  return (
    <div class="card w-full bg-base-200 my-3">
      {/* <div class="card-body"> */}
      <div id="yandex_rtb_R-A-15425793-1"></div>
      {/* </div> */}
    </div>
  );
});
