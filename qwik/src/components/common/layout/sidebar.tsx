import { component$, Slot, useContext } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { configContext } from "~/root";

export const Sidebar = component$(({ noAds }: { noAds?: boolean }) => {
  const configState = useContext(configContext);

  const adsInfoArr = configState.filter((x) => x.type === "ads");
  const adsInfo = adsInfoArr[Math.floor(Math.random() * adsInfoArr.length)];

  return (
    <div class='w-full md:w-1/4 mb-3 mr-4'>
      {!noAds && adsInfo && (
        <Link
          href={(adsInfo?.link as string) || ""}
          target={"_blank"}
          class='card w-full bg-base-200 mb-3'
        >
          <figure>
            <img
              class='pointer rounded-xl'
              width='648'
              height='240'
              src={(adsInfo?.mediaUrl as string) || ""}
              alt='ads_here'
            />
          </figure>
        </Link>
      )}
      <Slot />
    </div>
  );
});
