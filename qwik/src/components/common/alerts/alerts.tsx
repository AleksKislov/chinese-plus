import { component$, useContext, useTask$ } from "@builder.io/qwik";
import { alertsContext } from "~/root";
import { SingleAlert } from "./alert";

export const Alerts = component$(() => {
  const alertsState = useContext(alertsContext);

  useTask$(({ track }) => {
    track(() => alertsState.length);
    let timer = 0;
    if (alertsState.length) {
      timer = window.setTimeout(() => {
        alertsState.shift();
      }, 3000);
    }
    return () => {
      clearTimeout(timer);
    };
  });

  return (
    <div class='toast toast-top fixed z-10 top-14'>
      {alertsState.map((alert, ind) => (
        <SingleAlert alert={alert} key={ind} />
      ))}
    </div>
  );
});
