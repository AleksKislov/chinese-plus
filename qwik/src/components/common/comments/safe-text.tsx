import { component$ } from '@builder.io/qwik';
import { AddresseeTag } from './comment-form';

type SafeTextProps = { text: string };

export const SafeText = component$(({ text }: SafeTextProps) => {
  const getMatchesForAddressees = (txt: string): string[] => {
    const regex = /(<strong[^>]*>.*?<\/strong>)|([^<]*)/g;
    return txt.match(regex) || [];
  };
  return (
    <>
      {text
        .split(/\n|<br \/>/)
        .map((x) => x.trim())
        .filter(Boolean)
        .map((parag, ind) => (
          <p class={'mt-2'} key={ind}>
            {getMatchesForAddressees(parag).map((x, ind2) => {
              if (x.includes(AddresseeTag.start)) {
                return <span dangerouslySetInnerHTML={x} key={ind2}></span>;
              } else {
                return x;
              }
            })}
          </p>
        ))}
    </>
  );
});
