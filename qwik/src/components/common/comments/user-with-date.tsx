import { component$ } from "@builder.io/qwik";
import { SmallDate } from "../ui/small-date";
import { UserLink } from "../content-cards/user-link";

type UserDateDivProps = {
  userId: string;
  userName: string;
  date: ISODate;
  ptNum: number;
  isComment?: boolean;
  isAnon?: boolean;
};

export const UserDateDiv = component$(
  ({ userId, userName, date, ptNum, isComment, isAnon }: UserDateDivProps) => {
    const pt = "pt-" + ptNum;
    return (
      <>
        <div class={`flex ${pt} lg:flex-row  ${isComment ? "flex-col" : ""}`}>
          <div class='mr-1'>
            <UserLink userId={userId} userName={userName} isAnon={isAnon} />
          </div>
          <div>
            <SmallDate onlyDate={false} date={date} />
          </div>
        </div>
      </>
    );
  }
);
