import { component$ } from "@builder.io/qwik";
import { type Alert } from "~/root";

export const SingleAlert = component$(({ alert }: { alert: Alert }) => {
  const { bg, text } = alert;

  return (
    <div class={`alert ${bg}`}>
      <div>
        <span>{text}</span>
      </div>
    </div>
  );
});
