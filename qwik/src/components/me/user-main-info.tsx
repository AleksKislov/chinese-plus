import { component$, useContext } from "@builder.io/qwik";
import { copySvg } from "../common/media/svg";
import { alertsContext } from "~/root";
import { Link } from "@builder.io/qwik-city";
import { BigAvatar } from "./avatar/big-avatar";

type UserMainInfoType = {
  id: ObjectId;
  newAvatar?: NewAvatar;
  role?: "moderator" | "admin";
  name: string;
  isPrivate: boolean;
};

export const UserMainInfo = component$(
  ({ id, newAvatar, role, name, isPrivate }: UserMainInfoType) => {
    const alertsState = useContext(alertsContext);

    const getRole = (): { name: string; desc: string } => {
      if (role === "admin") return { name: "админ", desc: "full power" };
      if (role === "moderator") return { name: "модератор", desc: "может редактировать тексты" };
      return { name: "изучающий", desc: "может редактировать свои тексты до публикации" };
    };

    return (
      <div class='flex'>
        {isPrivate ? (
          <div class='tooltip tooltip-info tooltip-bottom mr-4' data-tip='Сменить аватар'>
            <Link class='avatar' href={"/me/avatar"}>
              {name && <BigAvatar userName={name} newAvatar={newAvatar} />}
            </Link>
          </div>
        ) : (
          <div class='avatar mr-4'>
            {name && <BigAvatar userName={name} newAvatar={newAvatar} />}
          </div>
        )}
        <div>
          <div class='text-base-content mt-1'>
            <div>
              Nihao, <span class='badge badge-lg badge-primary'>{name}</span>
            </div>
            <div class='my-2'>
              Роль:{" "}
              <span class='tooltip tooltip-info tooltip-right' data-tip={getRole().desc}>
                <span class='badge badge-secondary'>{getRole().name}</span>
              </span>
            </div>
            {isPrivate ? (
              <Link href={"/users/" + id}>
                <button class='btn btn-xs btn-warning'>Мой контент</button>
              </Link>
            ) : (
              <div>
                User ID:{" "}
                <span
                  class='tooltip tooltip-warning tooltip-right'
                  data-tip='Скопировать ID, чтобы обратиться к пользователю в комментариях'
                >
                  <button
                    class='btn btn-xs btn-warning'
                    onClick$={() => {
                      navigator.clipboard.writeText(` @@[${id}]{${name}}@@, `);
                      alertsState.push({
                        bg: "alert-info",
                        text: "ID скопировано",
                      });
                    }}
                  >
                    {copySvg}
                  </button>
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);
