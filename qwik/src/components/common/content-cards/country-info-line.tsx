import { component$ } from '@builder.io/qwik';
import CONSTANTS from '~/misc/consts/consts';

export const CountryInfoLine = component$(({ country }: { country: string }) => {
  return (
    <div>
      <span class={'font-bold'}>Страна: </span> {CONSTANTS.countries[country]}
    </div>
  );
});
