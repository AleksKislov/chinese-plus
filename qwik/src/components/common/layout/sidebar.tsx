import { component$, Slot, useContext } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { configContext } from "~/root";

export const Sidebar = component$(({ noAds }: { noAds?: boolean }) => {
  const configState = useContext(configContext);

  const adsInfo = configState.find((x) => x.type === "ads");

  return (
    <div class='w-full md:w-1/4 mb-3 mr-4'>
      {!noAds && (
        <Link
          href={(adsInfo?.link as string) || ""}
          target={"_blank"}
          class='card w-full bg-base-200 mb-3'
        >
          <figure>
            <img
              class='pointer'
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
