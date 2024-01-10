import { component$ } from "@builder.io/qwik";
import type { PulseDataItem, PulseData } from "~/routes/layout";

type ClubPulseProps = {
  data: PulseData;
};

export type MetricsItem = PulseDataItem & {
  title: string;
  margin: string;
};

export const ClubPulse = component$(({ data }: ClubPulseProps) => {
  const { comment, post, video, text, user, donate } = data;

  const commentAndPost: MetricsItem = {
    lastMonth: comment.lastMonth + post.lastMonth,
    prevMonth: comment.prevMonth + post.prevMonth,
    title: "Комменты / форум",
    margin: "mx-2",
  };

  const textAndVideo: MetricsItem = {
    lastMonth: video.lastMonth + text.lastMonth,
    prevMonth: video.prevMonth + text.prevMonth,
    title: "Тексты / видео",
    margin: "mx-4",
  };

  const metricsArr: MetricsItem[] = [
    commentAndPost,
    textAndVideo,
    { ...user, title: "Новые регистрации", margin: "mx-6" },
    { ...donate, title: "Новые донаты", margin: "mx-8" },
  ];

  const getPercent = (lastMonth: number, prevMonth: number): number => {
    const diff = lastMonth - prevMonth;
    let percent = 0;
    if (diff === 0) {
      percent = 0;
    } else if (prevMonth === 0 && diff > 0) {
      percent = lastMonth;
    } else {
      percent = diff / prevMonth;
    }
    return Math.trunc(percent * 100);
  };

  const getHeightAndColor = (percent: number): { height: string; color: string } => {
    switch (true) {
      case percent > 49:
        return { height: "h-8", color: "success" };
      case percent > 25:
        return { height: "h-6", color: "success" };
      case percent > 0:
        return { height: "h-4", color: "success" };
      case percent === 0:
        return { height: "h-3", color: "error" };
      case percent > -25:
        return { height: "h-2", color: "error" };
      default:
        return { height: "h-1", color: "error" };
    }
  };

  return (
    <div class='mt-5 mr-8'>
      <div class='dropdown dropdown-hover dropdown-right'>
        <div tabIndex={0} class={`cursor-pointer static h-3`}>
          {metricsArr.map((x, ind) => {
            const { height, color } = getHeightAndColor(getPercent(x.lastMonth, x.prevMonth));
            const bgColor = "bg-" + color;
            return (
              <div
                key={ind}
                class={`${height} ${bgColor} w-1 absolute bottom-0 left-0 ${x.margin}`}
              ></div>
            );
          })}
        </div>
        <div
          tabIndex={0}
          class='dropdown-content z-[4] card card-compact w-64 p-2 shadow bg-base-100 border border-base-content'
        >
          <div class='card-body'>
            <h3 class='card-title'>Пульс клуба</h3>
            <div>
              <span class='text-xs'>Текущий и предыдущий месяцы</span>
            </div>
            <div class='stats stats-vertical bg-base-100'>
              {metricsArr.map((x, ind) => {
                const isMoreThanBefore = x.lastMonth > x.prevMonth;
                const diff = x.lastMonth - x.prevMonth;
                const percent = getPercent(x.lastMonth, x.prevMonth);
                const { color } = getHeightAndColor(percent);
                const txtColor = "text-" + color;
                return (
                  <div class='stat' key={ind}>
                    <div class='stat-title'>{x.title}</div>
                    <div class='stat-value'>{x.lastMonth}</div>
                    <div class={`stat-desc ${txtColor}`}>
                      {isMoreThanBefore ? "↗" : "↘︎"} {diff} ({percent}%)
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
