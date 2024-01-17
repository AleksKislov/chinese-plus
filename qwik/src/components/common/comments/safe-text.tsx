import { component$ } from "@builder.io/qwik";

type SafeTextProps = { text: string };

export const SafeText = component$(({ text }: SafeTextProps) => {
  // (/[\s,]+/)
  return (
    <>
      {text
        .split(/\n|<br \/>/)
        .map((x) => x.trim())
        .filter(Boolean)
        .map((x, ind) => (
          <p class={"mt-2"} key={ind}>
            {x}
          </p>
        ))}
    </>
  );
});
