import { component$, useContext } from "@builder.io/qwik";

import { alertsContext, userContext } from "~/root";
import { editSvg } from "../media/svg";
import { editWordModalId } from "./word-tooltip";

export const EditWordBtn = component$(() => {
  const alertsState = useContext(alertsContext);
  const userState = useContext(userContext);
  const { loggedIn } = userState;

  return (
    <div class='tooltip tooltip-info tooltip-bottom' data-tip={"Редактировать"}>
      <label
        for={loggedIn ? editWordModalId : undefined}
        class='btn btn-sm btn-info'
        onClick$={() => {
          if (loggedIn) return;

          alertsState.push({
            bg: "alert-error",
            text: "Авторизуйтесь для редактирования",
          });
        }}
      >
        {editSvg}
      </label>
    </div>
  );
});
