import { component$ } from '@builder.io/qwik';

export const InfoLine = component$(({ name, value }: { name: string; value: string }) => {
  return (
    <div>
      <span class={'font-bold'}>{name}: </span> {value}
    </div>
  );
});
