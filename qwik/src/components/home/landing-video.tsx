import { component$ } from "@builder.io/qwik";

export const LandingVideo = component$(() => {
  return (
    <div class='grid grid-cols-6 my-6'>
      <div></div>

      <div class='lg:col-span-4 col-span-6'>
        <div class='aspect-w-16 aspect-h-9 '>
          <iframe
            class='rounded-lg shadow-lg'
            width='560'
            height='315'
            src='https://www.youtube.com/embed/fxM8lH17fUY?si=lXAKe7vNBOaFKz6D&amp;controls=0'
            title='YouTube video player'
            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
          ></iframe>
        </div>
      </div>

      <div></div>
    </div>
  );
});
