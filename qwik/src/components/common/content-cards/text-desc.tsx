import { component$ } from "@builder.io/qwik";

export const TextDesc = component$(({ desc }: { desc: string }) => {
  return (
    <div class='lg:min-h-20'>
      <div>
        <p>{desc}</p>
      </div>
    </div>
  );
});
